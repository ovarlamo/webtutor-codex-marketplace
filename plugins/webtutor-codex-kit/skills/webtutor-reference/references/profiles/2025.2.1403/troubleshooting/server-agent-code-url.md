---
status: verified
applies_to: server agents and api/agent.asp
scope: version-profile
profile: "2025.2.1403"
verified_on:
  - "2025.2.1403"
verified_at: 2026-09-08
review_by: 2026-12-08
source: project-practice
---

# Диагностика `run_code_url` серверного агента

## Симптом

Присваивание только `TopElem.run_code_url` агенту со встроенным кодом не
переключает карточку на исполнение файла. После `Save()` в XML остаются
`exec_code.code_text` и `run_code`, а `run_code_url` отсутствует.

При попытке прочитать URL методом `TopElem.GetOptChildValue()` WebTutor
2025.2.1403 возвращает ошибку `Unknown method: GetOptChildValue()` в контексте
ASP endpoint.

## Причина

Фактический источник исполняемого кода сохраняется также во вложенном узле
`exec_code`. Если в нём остается `code_text`, сохранение продолжает считать
активным встроенный код. Кроме того, на `TopElem` открытого документа
серверного агента в проверенном ASP-контексте доступен `GetOptProperty()`, но
не `GetOptChildValue()`.

## Рабочее решение

При программном переключении тестового агента с inline-кода на файл:

```javascript
agent_doc.TopElem.exec_code.code_text = "";
agent_doc.TopElem.exec_code.code_url = code_url;
agent_doc.TopElem.run_code = "";
agent_doc.TopElem.run_code_url = code_url;
agent_doc.Save();
```

Для безопасного чтения URL в repository-declared diagnostic agent endpoint используется:

```javascript
var code_url = String(
    agent_top_elem.GetOptProperty("run_code_url", "")
);
```

## Подтверждение и границы

Поведение подтверждено 2026-09-08 на WebTutor 2025.2.1403:

- XML тестового агента `<agent_id>` после одиночного присваивания не содержал
  `run_code_url`;
- после очистки `code_text` и заполнения `exec_code.code_url` XML содержал
  одинаковый URL в `exec_code.code_url` и `run_code_url`;
- `dev + agent_id` синхронно выполнил этот URL и получил значение переменной
  агента `TEST`;
- замена чтения на `GetOptChildValue()` воспроизводимо завершилась ошибкой
  `Unknown method`, возврат к `GetOptProperty()` восстановил выполнение.

Это результат практической проверки конкретной версии и ASP-контекста, а не
универсальное утверждение для всех типов `XmlElem` и версий платформы.

