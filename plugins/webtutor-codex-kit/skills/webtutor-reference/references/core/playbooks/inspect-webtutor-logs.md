---
status: active
scope: universal-core
verified_on:
  - "2025.2.1403"
source: adapted-project-practice
---

# Просмотр логов WebTutor

Изучай логи после воспроизведения конкретной ошибки, если HTTP-обработчик возвращает 500 до формирования JSON, сообщение об ошибке слишком общее или сбой затрагивает XQuery, SQL либо UniBridge.

## Стандартное расположение и файлы

Определи корневой каталог установки WebTutor по текущему окружению. Стандартный каталог логов:

```text
<webtutor_install_root>\Logs
```

Обычно используются файлы `xhttp_YYYY-MM-DD.log` для обработки HTTP/ASP/SP-XML и `spxml_unibridge_YYYY-MM-DD.log` для сформированных запросов, ошибок базы данных и стеков UniBridge. Выбирай самый новый подходящий файл по `LastWriteTime`, а не по предполагаемой сегодняшней дате: сбой может произойти около полуночи.

## Порядок действий

1. Воспроизведи исходный запрос или тест.
2. Прочитай небольшой фрагмент с конца самого нового файла `xhttp_*.log`.
3. Если там упоминаются XQuery, SQL, UniBridge или ошибка базы данных, изучи тот же временной интервал в самом новом `spxml_unibridge_*.log`.
4. Сопоставь события по времени и, если есть, идентификатору запроса.
5. Сравни запрос из лога с кодом, который его формирует: диагностическая обёртка может влиять на корректность запроса.
6. После исправления повтори исходный запрос и убедись, что в новом временном интервале ошибка больше не появляется.

```powershell
$webTutorLogRoot = '<webtutor_install_root>\Logs'
$latestXhttpLog = Get-ChildItem -LiteralPath $webTutorLogRoot -Filter 'xhttp_*.log' |
    Sort-Object LastWriteTime -Descending |
    Select-Object -First 1
$latestUnibridgeLog = Get-ChildItem -LiteralPath $webTutorLogRoot -Filter 'spxml_unibridge_*.log' |
    Sort-Object LastWriteTime -Descending |
    Select-Object -First 1
Get-Content -LiteralPath $latestXhttpLog.FullName -Tail 150 -Encoding UTF8
Get-Content -LiteralPath $latestUnibridgeLog.FullName -Tail 150 -Encoding UTF8
```

Читай только необходимый фрагмент. Логи и SQL могут содержать персональные данные, параметры, токены и служебную информацию. Общее сообщение `unibridge error` не является диагнозом без реального запроса, исходного исключения или воспроизводимого теста.
