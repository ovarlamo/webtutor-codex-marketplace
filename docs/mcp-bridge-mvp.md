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

The MCP server starts from its inherited working directory, finds the nearest
ancestor `webtutor-codex.json`, and reads it again for each tool call. It does
not inspect sibling projects or use another client's configuration.

## Bridge contract

The Bridge accepts JSON POST requests selected by `action`:

| Action | Parameters | Result |
|---|---|---|
| `ping` | none | Bridge readiness |
| `get_table_info` | `table_name` | Ordered field names and SQL types |
| `get_object_info` | string `object_id` | String ID and `TopElem.Xml` |
| `run_agent_file` | `custom_root`, `agent_path` | Agent metadata and output |

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

## Pilot and fallback

The template is copied manually during the pilot. Existing client
`agents/tests/*.js`, `api/*.asp`, package scripts, and endpoints remain intact.
The first pilot target is WebTutor 2021.1.3.297. The existing 2025.2.1403
project is tested only after the older client works. Removing fallback code is
outside the MVP and requires success on both clients.
