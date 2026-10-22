# Объекты XML-документа

Источник категории: [docs.datex.ru](http://docs.datex.ru/article.htm?id=5791375928854454950).

Карточек: 3.

| Имя | Краткое описание | Связанные элементы карточки | Источник |
|---|---|---|---|
| `XmlDoc` | Текстовое описание в исходной карточке отсутствует; карточка содержит перечень связанных элементов. | `AutoSave`, `DocID`, `Form`, `FormUrl`, `HasWriteAccess`, `IsChanged`, `IsSeparated`, `LastSavedData`, `NeverSaved`, `ObjectID`, `OptScreen`, `RunActionOnBeforeSave`, `RunActionOnSave`, `Screen`, `TempData`, `TopElem`, `Url`, `WriteAllNodes`, `WriteAsync`, `WriteDocInfo`, … (+22) | [карточка](http://docs.datex.ru/article.htm?id=5620203358492510980) |
| `XmlElem` | Объект XmlElem соответствует определенном узлу (элементу) в открытом XML-документе. Элемент имеет значение и набор дочерних элементов. Любой элемент обладает свойствами массива, то есть можно получить спсиок дочерних элементов, использую стандарнтые методы работы с массивами, в том числе прямое индексирование (elem[i]). Также к любому дочернему элементу можно обратиться как к атрибуту объекта, например elem.xxx. | `AttrNames`, `BaseMultipleElem`, `ChildIndex`, `ChildNum`, `Doc`, `ExternalDispName`, `ForeignArray`, `ForeignArrayCodeStr`, `ForeignDispName`, `ForeignElem`, `ForeignObjectUrl`, `ForeignPrimaryObjectUrl`, `Form`, `FormElem`, `FormPath`, `HasValue`, `ImageUrl`, `Instances`, `IsDynamic`, `IsFirstSibling`, … (+89) | [карточка](http://docs.datex.ru/article.htm?id=5607317807203771901) |
| `XmlMultiElem` | XmlMultiElem - это виртуальный объект, создаваемый при вызове конструкции вида candidate.profession_id, в случае, когда profession_id был описан с атрибутом MILTIPLE. Объект XmlElem является массивом, который возвращает список всех элементов c именем profession_id среди дочерних элементов своего родителя. | `Doc`, `ForeignArray`, `FormElem`, `HasValue`, `Instances`, `IsMultiElem`, `Name`, `Parent`, `XQueryLiteral`, `Add()`, `ByValueExists()`, `Clear()`, `DeleteAll()`, `DeleteByValue()`, `GetByKey()`, `ObtainByKey()`, `ObtainByKeySorted()`, `ObtainByValue()`, `SetValues()` | [карточка](http://docs.datex.ru/article.htm?id=5607317807203771902) |

