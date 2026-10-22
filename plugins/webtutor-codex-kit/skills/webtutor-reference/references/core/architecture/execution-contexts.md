---
status: verified
applies_to: SP-XML execution contexts
scope: universal-core
verified_on:
  - "2025.2.1403"
verified_at: 2026-07-28
review_by: 2026-10-28
source: project-practice
---

# Контексты исполнения

| Контекст | Типичное размещение | Вход и результат |
|---|---|---|
| agent | repository-declared agent source | параметры агента; серверные побочные эффекты |
| remote action | repository-declared remote-action source | параметры вызова; сериализуемый ответ/файл |
| remote collection | repository-declared collection/report source | фильтры/пагинация; строки коллекции |
| ASP server page | server-side `*.asp` under the configured custom web root | HTTP request; HTTP/JSON/HTML response |
| browser page | browser assets under the configured public web path | DOM и HTTP API; пользовательский интерфейс |

Нельзя переносить код между контекстами по синтаксическому сходству. До
реализации проверить:

1. откуда приходят параметры;
2. какие глобальные объекты доступны;
3. какой формат результата ожидает вызывающая сторона;
4. какой существующий тест запускает файл.

Подробности платформенных глобальных объектов:
[объекты и глобальные переменные](../webtutor-reference/objects-and-globals.md).

