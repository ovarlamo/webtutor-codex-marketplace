---
status: active
scope: universal-core
---

# Use the local MCP Bridge

Use this route only when the active project contains `webtutor-codex.json`.
The nearest ancestor configuration belongs to that project; do not look in a
sibling client repository.

1. Read the current workspace instructions and obtain any required runtime
   verification approval.
2. Pass the absolute active workspace root as `project_root` on every Bridge
   tool call. The MCP process working directory is the installed plugin root
   and must not be used to infer the client.
3. Call `webtutor_ping` when connectivity or configuration is not already
   established.
4. Use only the supported operation:
   - `webtutor_get_table_info` for table metadata;
   - `webtutor_get_object_info` for `TopElem.Xml` with a string ID;
   - `webtutor_run_agent_file` for approved legacy `agents/` execution;
   - `webtutor_run_script_file` for approved project-relative execution.
5. Read the complete `errors`, `logs`, `assertions`, and `result` envelope.
6. If configuration or Bridge access is unavailable, use only the fallback
   declared by the same client repository.

`webtutor_run_agent_file` and `webtutor_run_script_file` may execute business
code and are not read-only. The
Bridge loads matching server-agent `wvars` when available, but it does not run
production agents through `tools.start_agent()`.
