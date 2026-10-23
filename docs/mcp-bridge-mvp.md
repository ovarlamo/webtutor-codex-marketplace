# Local WebTutor Bridge MVP

## Purpose

The plugin supplies one client-neutral MCP server. Each client project keeps
its own connection configuration and a manually copied ASP Bridge. The MCP
process never contains a fixed client custom root or Bridge URL.

## Client files

```text
<custom_root>/
├── codex_bridge/
│   └── api.asp
└── webtutor-codex.json
```

Minimal configuration:

```json
{
  "base_url": "http://127.0.0.1",
  "custom_root": "client_custom",
  "bridge_url": "/client_custom/codex_bridge/api.asp"
}
```

`base_url` is optional and defaults to `http://127.0.0.1`. An explicit value
is used without a separate authorization mechanism. HTTP requests use a fixed
timeout. `webtutor_version` is not required.

The MCP server starts from `${PLUGIN_ROOT}`. Every MCP tool receives an
absolute `project_root` and reads
`<project_root>/webtutor-codex.json` for that call. The server does not infer
the client from its process working directory, search ancestors, inspect
sibling projects, or reuse another client's configuration.

## Bridge contract

The Bridge accepts JSON POST requests selected by `action`:

| Action | Parameters | Result |
|---|---|---|
| `ping` | `project_root` at the MCP boundary; none forwarded to the Bridge | Bridge readiness |
| `get_table_info` | `table_name` | Ordered field names and SQL types |
| `get_object_info` | string `object_id` | String ID and `TopElem.Xml` |
| `run_agent_file` | `custom_root`, `agent_path` | Legacy agent execution under `agents/` |
| `run_script_file` | `custom_root`, `relative_path` | Execute a file relative to the active WebTutor custom root |

Every response contains:

```json
{
  "ok": true,
  "bridge_version": "1.0.0",
  "errors": [],
  "logs": [],
  "assertions": [],
  "result": {}
}
```

`webtutor_version` may be added when a portable automatic resolver is
established; its absence is not an error.

`run_agent_file` executes synchronously with `EvalCodeUrl()`. Before execution
it derives the server-agent code from the file name. When a matching
`server_agents` record exists, its `wvars` are copied into `Param`, preserving
the compatible behavior of the existing local test harness. The Bridge does
not call `tools.start_agent()`.

`run_script_file` executes project-relative files, including `web/agents/*.js`, `web/server_agents/*.js`, and `tools/*.js`. It loads matching `server_agents` WVars for paths starting with `web/agents/` or `web/server_agents/`; diagnostics in `tools/` execute without that lookup. Check nonempty `result.agent_id` to confirm that a matching server-agent card was found. Loaded WVars retain their stored string values, including JSON strings for multi-select fields. The editor layout, not `wvar.type` alone, determines the expected format. The Bridge executes code with `EvalCodeUrl()` rather than reproducing `server_agent.run_agent()` lifecycle, `OBJECT_ID`, or `OBJECTS_ID_STR`. This is for the trusted local WebTutor development instance; path restrictions have not been added. The legacy `run_agent_file` API remains supported.

## Pilot and fallback

The template is copied manually during the pilot. Existing client
`agents/tests/*.js`, `api/*.asp`, package scripts, and endpoints remain intact.
The first pilot target is WebTutor 2021.1.3.297. The existing 2025.2.1403
project is tested only after the older client works. Removing fallback code is
outside the MVP and requires success on both clients.
