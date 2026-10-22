# Changelog

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
