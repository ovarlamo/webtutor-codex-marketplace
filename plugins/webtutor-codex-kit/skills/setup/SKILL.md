---
name: setup
description: Set up webtutor-codex-kit for a new local WebTutor client project after plugin installation. Use when the user asks to onboard, bootstrap, connect, or configure a WebTutor instance or a new workstation.
---

# WebTutor Codex Kit Setup

Set up one active client project at a time. Keep every client-specific value in
that project; never copy configuration, endpoints, identifiers, or evidence
from another client.

## Preflight

1. Read the active project's `AGENTS.md` and obey its verification contract.
2. Confirm the project root, its WebTutor `custom_root`, and the local instance
   base URL. Default the base URL to `http://127.0.0.1` only when the user does
   not specify another address.
3. Inspect existing `webtutor-codex.json` and `codex_bridge/api.asp` before
   proposing changes. Preserve unrelated client files and legacy endpoints.

## Bootstrap

1. Create `<project-root>/webtutor-codex.json` with client-local values:

   ```json
   {
     "base_url": "http://127.0.0.1",
     "custom_root": "client_custom",
     "bridge_url": "/client_custom/codex_bridge/api.asp"
   }
   ```

2. Copy the packaged `bridge/api.asp.template` to
   `<project-root>/codex_bridge/api.asp`. Do not edit the packaged template.
3. Preserve UTF-8 with BOM for the copied ASP file and verify its first three
   bytes are `EF BB BF`.
4. Do not add authentication, tokens, an installer, extra MCP tools, or remove
   fallback endpoints as part of setup.

## Verification handoff

Before executing checks, show the user an exact plan and obtain approval under
the active project's `AGENTS.md`. A proportionate first check is:

1. confirm both client-local files exist and the ASP BOM is correct;
2. start or refresh Codex so it reloads the installed plugin and MCP server;
3. call `webtutor_ping` in a fresh conversation;
4. if approved, inspect `collaborators` and object ID
   `6148914691236517121` with the read-only MCP tools;
5. report `Verified` and `Not verified` separately.

If the Bridge cannot be reached, stop after collecting the response and use
the current project's declared fallback. Do not modify its test endpoint.
