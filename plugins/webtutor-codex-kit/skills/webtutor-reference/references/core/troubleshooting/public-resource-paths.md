---
status: verified
applies_to: browser resources in server templates
scope: universal-core
verified_on:
  - "2025.2.1403"
verified_at: 2026-07-28
review_by: 2026-10-28
source: project-practice
---

# Публичные пути ресурсов

## Симптом

HTML отдается, но CSS, JavaScript или изображение возвращает 404.

## Причина

Браузер разрешает относительный URL от адреса HTTP-запроса, а не от каталога
файла, который сервер исполнил через `EvalCodePage()`.

## Исправление

Использовать только подтвержденный публичный путь от web-корня. Если его нельзя
найти в рабочем шаблоне, запросить путь у пользователя. Затем проверить Network
и Console браузера.

