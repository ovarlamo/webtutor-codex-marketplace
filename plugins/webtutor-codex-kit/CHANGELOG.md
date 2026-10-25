# Changelog

## [0.2.3] - Unreleased

### Изменено — источник справочников WebTutor

- `generate-schema.mjs` и `generate-operations.mjs` читают исходники из клона `ovarlamo/websoft-hcm` по версии, выбранной оператором.
- `generate-schema.mjs` использует `WebSoftServer/lngs/russian/const.xml` и предотвращает перезапись при потере ранее разрешённых названий; неразрешённые ключи выводит как предупреждения.
- `webtutor-reference/SKILL.md` описывает выбор ветки, исследование исходников и безопасное сравнение генерации с базовым индексом `2025.2.1403`.
- Обновлены `references/core/schema/index.json`, `enums.json` и три карточки объектов по `websoft-hcm` `2025.2.1403`: 393 записи полей, 6 системных перечислений. Значения `TITLE` из XMD сохраняются дословно, включая выражения `##...##`.


### Добавлено — методы WebTutor

- Поисковый индекс 688 методов из `wtv_tools.xml`, `wtv_tools_web.xml` и `ms_tools.xml`, а также карточки `tools.activate_course_to_person` и `tools.create_notification`.
- Скрипты `generate-operations.mjs` и `search-operations.mjs`. При генерации схем и методов версия WebTutor указывается явно параметром `--webtutor-version`; существующий снимок помечен `2025.2.1403`.


### Добавлено — прототип справочника XMD

- Добавлены поисковые JSON-карточки `collaborator`, `course` и `active_learning`, сформированные из XMD: поля каталогов и XML-документов, русские названия, связи `FOREIGN-ARRAY` и системные перечисления.
- В `webtutor-reference` добавлены локальный генератор и скрипт поиска по схеме. Физическую структуру SQL по-прежнему необходимо проверять на целевой установке WebTutor.


### Changed

- Standardize server-agent file testing on `web/server_agents/*.js` with `webtutor_run_script_file`; continue supporting diagnostic scripts in `tools/` without automatic `wvars` injection.
- Remove deprecated `webtutor_run_agent_file`, the Bridge `run_agent_file` action, and legacy `web/agents/` variable loading. The MCP runtime now provides four tools.
- Document actual `server_agent.wvars` string-value delivery through `Param`, including a JSON multi-select representation selected by the Administrator card layout, validation advice, and the limitations of file-based `EvalCodeUrl` tests.
- Enable matching `server_agents.code` lookup and stored `wvars` loading for `web/server_agents/` test files; require checking `result.agent_id` to verify card lookup.
- Increase Bridge interface version to `1.2.0`; replace the separately installed `codex_bridge/api.asp` to use the new action contract.


## [0.2.2] - Unreleased

### Fixed

- Require an explicit absolute `project_root` on every MCP tool call instead
  of assuming that a desktop plugin server inherits the active project
  working directory.
- Run the stdio server from the documented `${PLUGIN_ROOT}` directory and
  resolve only `<project_root>/webtutor-codex.json`.
- Bring the README, Bridge playbook, setup flow, and tool count in line with
  the five-tool runtime.
- Document direct catalog search as the fallback when the bundled reference
  helper is blocked by the local sandbox.
- Validate skill references to `.jsonl` files without truncating them to a
  nonexistent `.json` path.
- Document the core `alert(value)` function and its universal behavior:
  output to the application console and the dated main server
  `xhttp-YYYY-MM-DD.log`.

## [0.2.1] - Unreleased

### Added

- `webtutor_run_script_file(relative_path)` for project-relative WebTutor file execution, including production `web/agents/` and development-only `tools/`.
- Matching Bridge `run_script_file` action. Load server-agent `wvars` only for `web/agents/` paths; diagnostic scripts do not automatically load them.

### Compatibility

- Keep legacy `webtutor_run_agent_file` and existing `agents/` execution route.
- No directory traversal restrictions were added in this iteration; use only on the trusted local development instance.

## [0.2.0] - Unreleased

### Added

- Guided setup skill for creating client-local Bridge configuration without
  copying data or evidence between clients.
- Client `AGENTS.md` template and setup flow that creates missing instructions
  by agreement or proposes additions to an existing file as a diff.
- Portable `mcp.json` and self-contained local stdio MCP runtime.
- Universal WebTutor Bridge template version `1.0.0`.
- `webtutor_ping`, `webtutor_get_table_info`,
  `webtutor_get_object_info`, and `webtutor_run_agent_file`.
- Client-local `webtutor-codex.json` discovery from the active workspace.
- Compatible server-agent `wvars` loading for file execution.

### Boundaries

- Bridge installation remains manual during the two-client pilot.
- No authentication, roles, tokens, test registry, DB query, remote action,
  remote collection, or production `tools.start_agent()` execution.
- WebTutor version reporting is optional.

## [0.1.0] - Unreleased

### Added

- Portable root `plugin.json` for `webtutor-codex-kit`.
- Explicit local-executor requirement.
- `webtutor-reference`, `webtutor-development`, `webtutor-sql-report`, and
  `webtutor-troubleshooting` skills.
- Self-contained migrated client-neutral reference core with explicit evidence
  boundaries and optional exact-version profiles.
- Universal core contracts for SQL through `XQuery()`, loop declarations,
  parenthesized ternaries in object literals, JSON scientific notation,
  employee subdivision hierarchy behavior, and standard WebTutor log paths.
- Common-core guidance for `OpenCodeLibrary()`, `catalog_list_base`, and
  WebSoft HCM Administrator system reports with `verified_on` provenance.
- Client-neutral package boundary and activation/boundary/isolation evaluation
  inventory.

### Compatibility

- No WebTutor runtime version is claimed by the skills-only package as a whole.
- Version-specific behavior must retain explicit provenance and `verified_on`
  evidence after skill migration.
- An unknown runtime version uses the universal core without loading a version
  profile.
