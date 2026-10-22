# Маршрутизация симптомов

| Симптом | Первый документ или шаг |
|---|---|
| HTTP 500 до JSON, ошибка `EvalCodePage`/ASP | playbook `inspect-webtutor-logs`, затем актуальный `xhttp_*.log` |
| ошибка XQuery/SQL или СУБД | playbook `inspect-webtutor-logs`, затем актуальный `spxml_unibridge_*.log` |
| `unibridge`, object reference | core note `unibridge-errors` |
| SQL работает отдельно, падает в коде | core note `sql-prefix` |
| пустая remote collection | playbook `debug-remote-collection` |
| округлённый или изменённый ID | core note `large-integer-ids` |
| 404 CSS/JS/image | core note `public-resource-paths` и карта проекта |
| искажённая кириллица/BOM | core note `encoding-and-bom` |
| JSON с exponent notation не разбирается | core note `json-scientific-notation` |
| неизвестная функция | `$webtutor-reference`: packaged search, official source, version test |

Названия core notes и playbooks разрешаются внутри `$webtutor-reference`.
Фактические пути логов, команды, endpoints и fixtures берутся только из
текущего проекта или выбранного локального инстанса.
