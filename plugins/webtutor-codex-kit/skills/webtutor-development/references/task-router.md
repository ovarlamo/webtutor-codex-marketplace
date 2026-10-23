# Маршрутизация задач

| Признак задачи | Прочитать или использовать |
|---|---|
| функция, объект, глобальная переменная | `$webtutor-reference` и его точный поиск |
| SQL, таблица, отчёт | `$webtutor-sql-report` |
| агент | playbook `test-agent` из `$webtutor-reference` и тест текущего проекта |
| remote collection | playbook `debug-remote-collection` из `$webtutor-reference` |
| ошибка выполнения | `$webtutor-troubleshooting` |
| ASP/HTML-ресурс | подтверждённая карта публичных путей текущего проекта |
| локальный Bridge | `webtutor_ping` с абсолютным `project_root`, затем один из четырёх предметных MCP-инструментов с тем же корнем |
| контракт параметров | клиентские contracts/schema текущего проекта |
| новое устойчивое знание | playbook `capture-knowledge` из `$webtutor-reference` |

Не загружать весь справочник заранее. Использовать только ветку, необходимую
для текущей задачи. Пакетное знание о платформе и клиентские документы не
смешивать.
