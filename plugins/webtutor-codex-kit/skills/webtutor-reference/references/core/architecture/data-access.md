---
status: verified
applies_to: WebTutor data access
scope: universal-core
verified_on:
  - "2025.2.1403"
verified_at: 2026-07-28
review_by: 2026-10-28
source: project-practice
---

# Доступ к данным

Выбор режима зависит от задачи:

- каталоговый XQuery — для платформенной модели каталогов;
- SQL через `XQuery("sql:...")` — для проверенного серверного SQL;
- `OpenDoc()` — когда действительно требуется XML-документ записи;
- диагностические `get-table-info` и `db-query` — только read-only исследование.

Правила:

1. Не угадывать таблицы и поля.
2. Не открывать документы в цикле, если достаточно ограниченной выборки.
3. Не запрашивать персональные данные без необходимости.
4. Обрабатывать отсутствие результата явно.
5. Сохранять 64-битные идентификаторы без преобразования в небезопасный JS Number.

См. [XQuery и данные](../webtutor-reference/xquery-and-data.md) и
[SQL через XQuery](../webtutor-reference/sql-through-xquery.md).

