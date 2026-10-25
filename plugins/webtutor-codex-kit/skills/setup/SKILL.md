---
name: setup
description: Set up webtutor-codex-kit for a new local WebTutor client project after plugin installation. Use when the user asks to onboard, bootstrap, connect, or configure a WebTutor instance or a new workstation.
---

# WebTutor Codex Kit Setup

Set up one active client project at a time. Keep every client-specific value in
that project; never copy configuration, endpoints, identifiers, or evidence
from another client.

## Preflight

1. Confirm the active client project root. Never inspect a sibling client to
   fill gaps.
2. Check whether the project already has `AGENTS.md`.
   - If it exists, read and obey it. Never overwrite it. Compare it with the
     packaged `templates/client/AGENTS.md.template` and offer only relevant
     additions as a reviewable diff.
   - If it is absent, offer to create it from that packaged template. Create it
     only after the user agrees.
3. Confirm `custom_root`, `base_url`, and the exact WebTutor version from this
   project or its instance. Fill only confirmed values in a new template.
   Leave an unknown placeholder unresolved and ask; do not guess, including
   from the default base URL or another client.
4. Ask for client test commands when they are not already confirmed. Preserve
   the placeholder rather than inventing a command.
5. Inspect existing `webtutor-codex.json` and `codex_bridge/api.asp` before
   proposing changes. Preserve unrelated client files, tests, and endpoints.

## Bootstrap

After the `AGENTS.md` proposal is resolved:

1. Create `<project-root>/webtutor-codex.json` with confirmed client-local
   values. `bridge_url` is derived from the confirmed `custom_root`:

   ```json
   {
     "base_url": "<confirmed-base-url>",
     "custom_root": "<confirmed-custom-root>",
     "bridge_url": "/<confirmed-custom-root>/codex_bridge/api.asp"
   }
   ```

Для исследования версионных исходников можно дополнительно указать необязательный путь к локальному клону `websoft-hcm` в том же JSON-файле:

```json
{
  "webtutor_sources_path": "D:\\Repos\\websoft-hcm"
}
```

Это **только пример дополнительного поля**, а не замена обязательных `base_url`, `custom_root` и `bridge_url` из примера выше. Используйте лишь подтверждённый пользователем абсолютный путь и не добавляйте его автоматически. Codex читает это поле как инструкцию для поиска исходников; MCP-сервер и Bridge его не используют. Не копируйте значение из другого клиентского проекта.

2. Copy the packaged `bridge/api.asp.template` to
   `<project-root>/codex_bridge/api.asp`. Do not edit the packaged template.
3. Preserve UTF-8 with BOM for the copied ASP file and verify its first three
   bytes are `EF BB BF`.
4. Do not add authentication, tokens, an installer, extra MCP tools, or remove
   fallback endpoints and tests as part of setup.
5. Do not copy configuration, identifiers, documentation, test data, or
   runtime evidence from any other client.

## Verification handoff

Before executing checks, show the user an exact plan and obtain approval under
the active project's `AGENTS.md`. A proportionate first check is:

1. confirm `AGENTS.md`, `webtutor-codex.json`, and the Bridge are in the active
   client only, and verify the ASP BOM;
2. start or refresh Codex so it reloads the installed plugin and MCP server;
3. call `webtutor_ping` with the absolute active client `project_root` in a
   fresh conversation;
4. if approved, inspect `collaborators` and use object inspection only with an
   ID confirmed for the active client;
5. report `Verified` and `Not verified` separately.

If the Bridge cannot be reached, stop after collecting the response and use
the current project's declared fallback. Do not modify its test endpoint.
