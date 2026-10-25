# Changelog

This changelog records marketplace-level changes. Plugin behavior is recorded
separately in `plugins/webtutor-codex-kit/CHANGELOG.md`.

## [Unreleased]

### Изменено — версионные исходники WebTutor

- Генераторы справочников используют приватный `ovarlamo/websoft-hcm` с исходниками в `WebSoftServer/wtv/`; исходники не публикуются в marketplace.
- Генератор схем читает `WebSoftServer/lngs/russian/const.xml` и отменяет запись индекса при отсутствующих константах или перечислениях. Базовый индекс `2025.2.1403` оставлен без изменений.
- Уточнён порядок исследования версий и сравнения результата перед обновлением справочника.


### Добавлено — справочник операций WebTutor

- Проиндексированы 688 методов из трёх XML-библиотек WebTutor 2025.2.1403; добавлены две карточки операций, генератор и поиск по назначению метода. Версия WebTutor и SHA исходников сохраняются раздельно.


### Добавлено — прототип справочника XMD

- Добавлены JSON-карточки трёх типов объектов WebTutor с привязкой к коммиту исходных XMD, системные перечисления, автономный генератор из XMD и локальный поиск по схеме. Новых MCP-инструментов нет.


### Changed in 0.2.3

- Release the `server_agents` variable-loading and `Param` knowledge improvements in the Bridge and Codex playbooks.
- Remove the former `webtutor_run_agent_file` MCP tool and legacy `agents/` and `web/agents/` execution guidance; retain project-relative `web/server_agents/` and diagnostic `tools/` execution with four tools.
- Update plugin and bundled MCP metadata to `0.2.3` and the separately installed Bridge contract to `1.2.0`.


### Fixed in 0.2.2

- Replace unreliable inherited-CWD client discovery with an explicit absolute
  `project_root` parameter on every WebTutor MCP tool.
- Align the packaged skills, Bridge documentation, validator, and five-tool
  inventory with the desktop plugin runtime.
- Correct validator resolution of skill references ending in `.jsonl`.
- Add explicit universal guidance for the core `alert(value)` function:
  application-console output and the dated main server
  `xhttp-YYYY-MM-DD.log`.

### Changed in 0.2.1

- Add project-relative script execution to the MCP server and Bridge while retaining the legacy agent runner.
- Distinguish production agent sources from local-only development tools.

### Added

- Guided setup skill and concise onboarding flows for a new workstation and a
  new client project.
- Universal client `AGENTS.md` template with confirmed-value placeholders and
  non-destructive onboarding behavior for existing project instructions.
- Version 0.2.0 local MCP and thin WebTutor Bridge MVP with four tools:
  ping, table metadata, object XML, and synchronous agent-file execution.
- Client-local `webtutor-codex.json` contract and manual two-client pilot.

- Initial local marketplace catalog for `webtutor-codex-kit`.
- Dependency-free infrastructure and release validation modes.
- Initial activation, boundary, and client-isolation evaluation inventory.
- Migration roadmap for extracting client-neutral WebTutor knowledge.
- Four focused WebTutor workflow skills and the self-contained migrated
  reference core.
- Portable-reference leakage checks and generated-catalog/link integrity
  checks in the dependency-free validator.
