---
status: verified
applies_to: WebTutor ASP server pages
scope: universal-core
verified_on:
  - "2025.2.1403"
verified_at: 2026-07-29
review_by: 2026-10-29
source: project-practice
---

# Синтаксическая ошибка ASP в литерале объекта

## Симптом

ASP endpoint отвечает HTTP 500 до формирования JSON. В
`Logs/xhttp_YYYY-MM-DD.log` записано:

```text
JavaScript syntax error.
wt\web\...\api\endpoint.asp, line N
```

## Подтверждённая причина

Парсер серверной ASP-страницы отклоняет условный оператор, использованный
непосредственно как значение свойства литерала без круглых скобок. Это правило
общего ядра; `verified_on` хранит provenance runtime-проверки:

```javascript
var result = {
    object_id: hasObjectId ? String(objectId) : ""
};
```

## Исправление

Заключите тернарное выражение в круглые скобки:

```javascript
var result = {
    object_id: (hasObjectId ? String(objectId) : "")
};
```

Для наиболее консервативного кода вычислите значение до создания литерала:

```javascript
var responseObjectId = "";

if (hasObjectId)
    responseObjectId = String(objectId);

var result = {
    object_id: responseObjectId
};
```

После исправления повторите исходный HTTP/CLI-тест и убедитесь, что endpoint
снова возвращает валидный JSON.

