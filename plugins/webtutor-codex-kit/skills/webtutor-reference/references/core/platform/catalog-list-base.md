---
status: verified
applies_to: catalog_list_base and course documents
scope: common-core
verified_on:
  - "2025.2.1403"
verified_at: 2026-08-10
review_by: 2026-11-10
source: project-practice
---

# Хранение связей `catalog_list_base`

## Краткий вывод

`catalog_list_base` хранит связанные объекты внутри XML исходного документа.
В проверенной базе версии из `verified_on` эти связи не материализуются
автоматически в отдельный универсальный каталог или SQL-таблицу.

Для электронного курса структура находится в `course.data`, а каталожная
таблица `courses` не содержит полей `catalogs`, типа связанного объекта или его
ID. Каталог `object_links` является отдельным механизмом и не служит зеркалом
`catalog_list_base`.

## XML-контракт

Базовый тип объявлен в `wtv/wtv_general.xmd`:

```xml
<catalogs>
    <catalog type="...">
        <title>...</title>
        <all>false</all>
        <objects>
            <object>
                <object_id>...</object_id>
                <comment>...</comment>
            </object>
        </objects>
    </catalog>
</catalogs>
```

- `catalog.type` — код типа объекта из `common.exchange_object_types`;
- `catalog.all` — признак выбора всех объектов указанного типа;
- `catalog.objects.object.object_id` — 64-битный ID связанного объекта;
- `catalog.objects.object.comment` — необязательный комментарий связи.

В форме администрирования общий блок `ms_general.xms` изменяет
`Ps.catalogs` непосредственно: получает секцию через `ObtainChildByKey()` и
добавляет выбранные ID в `objects`.

## Хранение курса

`wtv_course.xmd` наследует `catalog_list_base`. Физически документ курса
хранится в таблице `course`:

| Поле | SQL-тип | Назначение |
|---|---|---|
| `id` | `bigint` | ID документа курса |
| `data` | `xml` | полный XML, включая `catalogs` |

Таблица `courses` является построенным каталогом. Ее `OnBuild` переносит
только явно объявленные поля. В частности, `knowledge_parts`, `tags` и
`experts` денормализуются, а `catalogs` — нет.

Следствия:

- прямой поиск связей через каталог `courses` невозможен;
- добавление связи в XML курса само по себе не создает строку в
  `object_links` или другом универсальном каталоге;
- обратный SQL-поиск по `course.data` может быть дорогим. В проверенной базе у
  `course.data` нет XML-индекса, а у таблицы `course` обнаружен только первичный
  индекс по `id`;
- если нужен быстрый обратный поиск, следует проектировать отдельный
  прикладной каталог-связку и явно синхронизировать его с документом.

## Чтение связи из SP-XML

Если известен ID курса и доступен серверный объект `tools`, читать связь нужно
из документа:

```javascript
var courseID = OptInt(rawCourseID);
if (courseID == undefined)
    throw Error("Некорректный ID курса");

var courseDoc = tools.open_doc(courseID);
var classifierLinks =
    courseDoc.TopElem.catalogs.GetOptChildByKey("knowledge_classifier");
```

`classifierLinks` может быть `undefined`. ID нельзя передавать через обычный
JavaScript `Number`, если он превышает `Number.MAX_SAFE_INTEGER`.

## Не путать с `object_links`

`wtv_object_link.xmd` описывает самостоятельный документ со своим исходным
объектом, массивом `links`, состоянием и необязательным
`recommender_algorithm_id`. Его каталог `object_links` строится из этих
документов. Проверка конкретной связи курса показала, что запись присутствует
в `course.data`, но отсутствует в `object_links`, XML документов `object_link`
и `knowledge_objects`.

## Как воспроизвести проверку

Если текущий репозиторий объявляет совместимые read-only diagnostic
capabilities, типичный набор команд выглядит так:

```powershell
npm run get-object-info -- <course_id>
npm run get-table-info -- table course
npm run get-table-info -- table courses
npm run get-table-info -- table object_links
```

Проверить наличие XML-индексов:

```sql
SELECT TOP 20
    xi.name,
    xi.secondary_type_desc,
    xi.using_xml_index_id
FROM sys.xml_indexes xi
JOIN sys.tables t ON t.object_id = xi.object_id
WHERE t.name = 'course'
ORDER BY xi.index_id
```

Исходники установленной версии, подтверждающие контракт:

- `wtv/wtv_general.xmd` — структура `catalog_list_base`;
- `wtv/wtv_course.xmd` — наследование базового типа курсом;
- `wtv/wtv_courses.xmd` — состав и `OnBuild` каталога `courses`;
- `wtv/ms_general.xms` — редактирование `Ps.catalogs`;
- `wtv/wtv_object_link.xmd` и `wtv/wtv_object_links.xmd` — отдельный механизм
  `object_links`.

## Границы подтверждения

Вывод подтвержден исходниками и фактической схемой одной установки WebTutor версии из `verified_on`. После обновления платформы или изменения XMD-форм нужно повторить
проверку `OnBuild`, SQL-схемы и индексов.

