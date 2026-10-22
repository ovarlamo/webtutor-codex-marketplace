---
status: verified
applies_to: diagnostic inspection of SQL generated from WebTutor XQuery
scope: version-profile
profile: "2025.2.1403"
verified_on:
  - "2025.2.1403"
verified_at: 2026-09-15
review_by: 2026-12-15
source: project-practice
---

# Инспектировать SQL, сформированный из XQuery

Этот playbook применяется к обычному WebTutor XQuery вида
`for ... in ... return ...`, когда нужно увидеть SQL активного UniBridge
provider. Для строки `XQuery("sql:SELECT ...")` использовать обычную проверку
SQL из [проверки SQL отчёта](../../../core/playbooks/verify-report-sql.md).

## Уровни доказательности

| Уровень | Что подтверждает | Обращение к данным |
|---|---|---|
| `Inspect()` | предварительный SQL, Count SQL и параметры UniBridge | строки коллекции не читаются |
| `Execute()` | полное перечисление и снимок команды после него | да |
| трассировка СУБД | фактически отправленные команды | да |

Не выдавать результат одного уровня за доказательство следующего.

## Безопасный порядок

1. Подтвердить версию WebTutor, .NET runtime, UniBridge и SQL provider.
2. Проверить, что хэш DLL совпадает с одобренной версией.
3. Использовать фиксированный XQuery без персональных данных. Для проверки
   параметризации подходит несуществующий тестовый ID.
4. Сначала вызвать `Describe(provider)`, затем только `Inspect()`.
5. Проверить не только `success`, но и:
   - `contractVersion` и `inspectorVersion`;
   - `providerAssemblyVersion`;
   - `reflectionPath`;
   - SQL, Count SQL, имена и типы параметров;
   - точность 64-битных ID;
   - `executionAttempted = false`;
   - отсутствие `cleanupError`;
   - начатые timings.
6. Для hierarchy отдельно проверить `effectiveXQuery`, параметры и SQL.
7. Для негативного сценария проверять конкретный `failureStage`.
8. Не добавлять сочетание версий в совместимую матрицу только по результатам
   локальных fake-тестов: нужен runtime-прогон с фактическим provider.

## Точные fixtures

Текст негативного XQuery хранить без нормализации, включая переводы строк.
На UniBridge `2.26.3.3` многострочный запрос с незакрытым строковым литералом
вернул `failureStage = "invoke-xquery"`, а похожая однострочная форма могла
вернуть успешный контракт с пустым SQL.

Это наблюдение подтверждает чувствительность теста к точному входу, но не
устанавливает внутреннюю причину поведения парсера. Не заменять один fixture
другим как эквивалентным.

Нормализация `effectiveXQuery` также может менять пробелы. Сравнивать
семантически значимые фрагменты и параметры, а не форматирование всей строки.

## Воспроизводимый inspect-only прогон

Использовать repository-declared runtime and compatibility tests на изолированном стенде. Ожидаемый контракт: `ok: true`, `result.success: true`, пустой `errors` и `executionAttempted: false` в inspect-only сценариях. Конкретные имена лабораторных агентов не являются частью profile.

Если `reflectionPath` изменился, считать сочетание версий несовместимым до анализа новой структуры и отдельного runtime-подтверждения. Не добавлять guessed reflection path в рабочую DLL.

## Когда нужен `Execute()`

Переходить к `Execute()` только по отдельному согласованному плану на
изолированном стенде. Ограничить запрос тестовым ID, задать timeout, проверить
`rowsRead`, `executionSuccess`, `executedSql`, `executedParameters` и cleanup.

Для строгого сопоставления с реально отправленным SQL использовать MSSQL
Profiler/Extended Events или журнал PostgreSQL. Не сохранять необезличенные
трассы в Git.

Технический контракт и границы DLL описаны в
[справочнике по `tools.dotnet_host`](../webtutor-reference/dotnet-host-xquery-inspector.md).

