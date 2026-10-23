# WebTutor Codex Kit

Portable local-executor plugin for WebTutor and SP-XML projects. It combines
client-neutral skills with a local MCP server and a thin WebTutor ASP Bridge.

## Execution model

The plugin declares `requires_local_executor: true`. The MCP server runs from
`${PLUGIN_ROOT}`, as documented for desktop-only plugins. Every tool call
requires an absolute `project_root` and reads
`<project_root>/webtutor-codex.json` directly. It does not infer the active
client from the MCP process working directory or search sibling projects.
After resolving the client configuration, it sends one HTTP request to the
configured Bridge with a fixed timeout.

The package contains exactly four MCP tools:

- `webtutor_ping`;
- `webtutor_get_table_info`;
- `webtutor_get_object_info`;
- `webtutor_run_script_file`.

All four tools require `project_root`. Object IDs remain string values.

The package does not contain:

- registered apps or lifecycle hooks;
- client endpoints or credentials;
- client-owned object IDs or client data;
- business/domain knowledge;
- a required WebTutor version;
- automatic write or deployment behavior.

The Bridge has no authentication in this MVP. `base_url` defaults to
`http://127.0.0.1`, but an explicit value in the client configuration is used
as written. Bridge installation is manual.

## Skills

- `webtutor-reference`
- `webtutor-development`
- `webtutor-sql-report`
- `webtutor-troubleshooting`

Together they provide the migrated client-neutral reference core and focused
development, SQL-reporting, and diagnostic workflows. Migration provenance and
evaluation coverage are tracked in the repository roadmap.

Public catalog and documentation identifiers may appear in reference material
when they carry explicit provenance. They are not treated as client-owned
runtime identifiers.

## Client boundary

Each consuming repository remains authoritative for its own instructions,
runtime routes, table/object structures, test commands, verification
approvals, domain/project documentation, and optional overlays. Missing local
reference material does not block use of the packaged universal core. If a
task specifically requires unavailable client context or an exact
version-specific fact, ask or stop rather than falling back to data from
another repository.

Each client project owns:

```text
<custom_root>/
├── codex_bridge/
│   └── api.asp
└── webtutor-codex.json
```

The Bridge returns a common `ok`, `bridge_version`, `errors`, `logs`,
`assertions`, and `result` envelope. `webtutor_version` is optional until a
portable automatic resolver is established. Execution of `web/server_agents/*.js` loads saved `wvars` when a server agent with the matching code exists.
