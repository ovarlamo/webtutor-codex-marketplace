---
status: verified
applies_to: WebTutor server-side SP-XML and XQuery inspection
scope: version-profile
profile: "2025.2.1403"
verified_on:
  - "2025.2.1403"
verified_at: 2026-09-15
review_by: 2026-12-15
source: project-practice
---

# .NET DLL через `tools.dotnet_host` и инспекция XQuery

## Два разных механизма библиотек

`OpenCodeLibrary()` и `tools.dotnet_host` решают разные задачи:

- `OpenCodeLibrary()` загружает динамическую библиотеку SP-XML v2 из файла
  `.bs`, `.js` или `.xmi`;
- `tools.dotnet_host.Object.GetAssembly()` загружает .NET assembly;
- `CreateClassObject()` создаёт экземпляр публичного .NET-класса, методы
  которого можно вызывать из серверного SP-XML.

Не передавать путь к DLL в `OpenCodeLibrary()` и не считать объект динамической
SP-XML-библиотеки .NET assembly.

## Подтверждённый минимальный вызов

На WebTutor `2025.2.1403` подтверждён вызов пользовательской DLL:

```javascript
var assembly = tools.dotnet_host.Object.GetAssembly(
    "XQueryInspector.dll"
);
var inspector = assembly.CreateClassObject(
    "XQueryInspector.Inspector"
);
var provider = tools.spxml_unibridge.Object.provider;
var providerType = inspector.Describe(provider);
var resultJson = inspector.Inspect(provider, xquery);
```

Проверенная DLL `XQueryInspector.dll` находилась в `dotnetcore/tempdll`, а
этот каталог присутствовал в `DOTNETLIBS-PATH` файла `xHttp.ini`. При первой
загрузке после копирования DLL перезапуск WebTutor не потребовался. Замена уже
загруженной assembly без перезапуска не проверялась.

В поставочных компонентах той же версии также встречаются
`tools.dotnet_host.Object.GetAssembly()` и `CreateClassObject()`. Это
подтверждает штатность механизма, но не является доказательством совместимости
произвольной DLL.

Локальный автоматически собранный каталог описывает `DotNetHost` как объект
для .NET Framework 4.x и Windows. Для текущей поставки это описание неполно:
runtime-тест пользовательской DLL прошёл в хосте .NET `9.0.13`. Не обобщать
этот результат на другие версии и операционные системы без отдельного теста.

## Что подтвердил XQuery Inspector

Для следующего окружения:

| Компонент | Версия |
|---|---|
| WebTutor | `2025.2.1403` |
| .NET runtime | `9.0.13` |
| UniBridge и MSSQL bridge | `2.26.3.3` |
| XQueryInspector | `1.5.1+478dd90a6c04419b7e1ab6968fb5aa05e2adb829` |

`Inspect()` успешно получил:

- SQL и отдельный Count SQL;
- параметры команды, включая MSSQL-тип `BigInt`;
- 64-битный ID `9007199254740993` как JSON-строку без округления;
- типы и версии provider, collection и query assemblies;
- путь доступа `collection.dc.Query.command`;
- `sqlOffset = true` и `pageSize = 400`;
- timings и успешное завершение коллекции через `Terminate()`.

Во всех проверенных сценариях `executionAttempted = false`: коллекция не
перечислялась, строки результата не читались.

Также подтверждены инспекция `IsHierChild()` и `IsHierChildOrSelf()`, этапы
ошибок `preprocess-xquery` и `invoke-xquery`, допустимая длина XQuery 200000
Unicode-символов и отклонение 200001 символа на этапе `validate-input`.

## Границы результата

XQuery Inspector не является самостоятельным парсером или транслятором. Он
вызывает активный UniBridge provider и через reflection читает созданный им
объект команды.

Поле `sql` — предварительный снимок `Query.command.CommandText`. При
постраничном чтении UniBridge может позднее изменить запрос. Параметры
передаются драйверу отдельно, поэтому строка с ручной подстановкой значений не
является фактически отправленной SQL-командой.

Путь `collection.dc.Query.command` и сигнатура метода provider являются
непубличными деталями реализации. После обновления WebTutor или UniBridge
нужен повторный compatibility-тест.

`Execute()` действительно перечисляет коллекцию и может обращаться к БД. В
WebTutor `2025.2.1403` методы `Execute()`, `ExecuteWithTimeout()`, отмена SQL и
снимок `executedSql` не проверялись.

Не проверены PostgreSQL provider, Linux и замена уже загруженной DLL.

## Безопасность

XQuery, SQL, параметры и ошибки могут содержать чувствительные данные.

- Не публиковать открытый endpoint, принимающий произвольный XQuery.
- Использовать фиксированные обезличенные сценарии и dev/test-контур.
- Не сохранять полный SQL и параметры в общие журналы без необходимости.
- Не вызывать `Execute()` на рабочей базе в рамках обычной диагностики.
- Для доказательства реально исполненной команды использовать трассировку
  СУБД; снимок объекта UniBridge её не заменяет.

## Воспроизведение

Использовать только repository-declared runtime и compatibility tests на
изолированном стенде. Перед запуском проверить UTF-8 BOM `EF BB BF` у
исполняемых WebTutor fixtures, разрешённый каталог DLL, фактические версии
WebTutor/.NET/UniBridge/provider и SHA-256 DLL. Имена исторических
лабораторных агентов не являются переносимым API и в profile не включены.

Внешний исходник: [websoft-xquery-inspector v1.5.1](https://github.com/GaliFrey/websoft-xquery-inspector/releases/tag/v1.5.1),
лицензия MIT. SHA-256 проверенной DLL:
`83ABDD889BB197458CFBD35DB7FF6ECDC4E8724D9B103275B62F3ECCD8354FF0`.

