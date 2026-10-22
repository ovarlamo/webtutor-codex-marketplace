---
status: verified
applies_to: SQL passed to XQuery
scope: universal-core
verified_on:
  - "2025.2.1403"
verified_at: 2026-07-28
review_by: 2026-10-28
source: project-practice
---

# Ошибка SQL-префикса

## Симптом

Корректный SQL падает внутри WebTutor с неинформативной ошибкой либо
интерпретируется не в том режиме.

## Проверка

Рабочий вызов должен иметь форму:

```javascript
XQuery("sql:SELECT ...")
```

Утилита `npm run db-query` принимает чистый `SELECT`, поэтому успешная
диагностическая проверка не добавляет префикс в рабочий файл автоматически.

После исправления повторить тест всего агента/отчёта. Каноническое правило:
[SQL через XQuery](../webtutor-reference/sql-through-xquery.md).

