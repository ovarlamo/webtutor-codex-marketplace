---
status: active
scope: universal-core
verified_on:
  - "2025.2.1403"
source: adapted-project-practice
---

# Inspect WebTutor logs

Use logs after reproducing the exact failure when an HTTP handler returns 500 before JSON, the message is too general, or the failure crosses XQuery, SQL, or UniBridge.

## Standard location and files

Resolve the WebTutor installation root from the current environment. The standard log directory is:

```text
<webtutor_install_root>\Logs
```

Typical files are `xhttp_YYYY-MM-DD.log` for HTTP/ASP/SP-XML processing and `spxml_unibridge_YYYY-MM-DD.log` for generated queries, database exceptions, and UniBridge stacks. Select the newest matching file by `LastWriteTime`; do not guess today's filename because failures can cross midnight.

## Procedure

1. Reproduce the original request or test.
2. Read a small tail from the newest `xhttp_*.log`.
3. If it mentions XQuery, SQL, UniBridge, or a database error, read the same time window in the newest `spxml_unibridge_*.log`.
4. Correlate by timestamp and request identifier when present.
5. Compare the logged query with the code that builds it; a diagnostic wrapper can change query validity.
6. After a fix, repeat the original request and confirm that the new time window no longer contains the failure.

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

Read the minimum needed range. Logs and SQL may contain personal data, parameters, tokens, and service details. A generic `unibridge error` is not a diagnosis without the actual query, underlying exception, or a reproducible test.
