# WebTutor Codex Marketplace

Private marketplace source for reusable, client-neutral Codex workflows used
when developing and diagnosing WebTutor/SP-XML solutions.

## Current state

This staging tree contains the marketplace and portable local-executor plugin
`webtutor-codex-kit` version `0.2.3`. The package contains four focused
WebTutor workflow skills, one setup skill,
the migrated client-neutral reference core, and a local stdio MCP server for a
thin WebTutor Bridge. Release readiness still depends on separately approved
validation and client runtime checks.

The plugin requires a local executor because its MCP process reads the active
project's `webtutor-codex.json` and calls that project's manually installed
Bridge. Client endpoints, custom roots, credentials, client-owned object IDs,
and business knowledge remain outside the plugin.

The packaged reference core is self-contained. A client repository may add
domain/project documentation or an exact-version overlay, but neither is a
prerequisite for universal guidance. When the installed WebTutor version is
unknown, the universal core remains available and no version profile is
loaded.

## Layout

```text
.agents/plugins/marketplace.json       Local marketplace catalog
plugins/webtutor-codex-kit/plugin.json Portable plugin manifest
plugins/webtutor-codex-kit/mcp.json    Portable local MCP declaration
plugins/webtutor-codex-kit/server/     Bundled dependency-free runtime
plugins/webtutor-codex-kit/bridge/     Universal ASP Bridge template
plugins/webtutor-codex-kit/templates/  Client onboarding templates
src/mcp-server/                        MCP build source
docs/migration-roadmap.md              Approved migration sequence
evals/*.json                           Activation, boundary, and isolation cases
scripts/validate-plugin.mjs            Dependency-free validator
```

Packaged skills live below:

```text
plugins/webtutor-codex-kit/skills/
  setup/
  webtutor-reference/
  webtutor-development/
  webtutor-sql-report/
  webtutor-troubleshooting/
```

`webtutor-reference` owns the common reference workflow and shared
version-aware core notes. The other three skills remain focused on their
own user goals and route exact platform-fact research to that skill. Critical
safety rules remain short and self-contained in every workflow skill.

## Client configuration

Place `webtutor-codex.json` in the active client project root:

```json
{
  "base_url": "http://127.0.0.1",
  "custom_root": "client_custom",
  "bridge_url": "/client_custom/codex_bridge/api.asp"
}
```

`base_url` defaults to `http://127.0.0.1` when omitted and may be explicitly
overridden. Requests use a fixed timeout. The MVP has no authentication and
does not automatically install the Bridge. Copy
`plugins/webtutor-codex-kit/bridge/api.asp.template` manually to
`<custom_root>/codex_bridge/api.asp` as UTF-8 with BOM.

## Validation

The validator has no external dependencies.

```powershell
npm run validate
```

This checks the portable manifest, marketplace catalog, evaluation documents,
package boundaries, and all five skill directories. For the release gate, use:

```powershell
npm run validate:release
```

Release validation requires all expected skills and their valid frontmatter.
Running either command is a verification action and must follow the applicable
approval contract.

## Local marketplace use

### New machine

Prerequisites: Git, Node.js 18 or newer, Codex, and GitHub access to this
private repository.

```powershell
codex plugin marketplace add ovarlamo/webtutor-codex-marketplace --ref main
codex plugin marketplace list
```

Restart the ChatGPT desktop app, open the Plugins Directory, select
`WebTutor Codex Marketplace`, and install `webtutor-codex-kit`. Start a new
conversation after installation. Until an immutable release tag exists,
`main` is a pilot source rather than a production pin.

### New client

1. Open the client's custom WebTutor directory as the active Codex project.
2. Run the plugin setup/onboarding action, or ask:
   `Подключи webtutor-codex-kit к этому проекту`.
3. Confirm the WebTutor version, `base_url`, `custom_root`, and client test
   commands. Unknown values remain explicit placeholders; setup never borrows
   them from another client.
4. If `AGENTS.md` is absent, approve creating it from
   `templates/client/AGENTS.md.template`. If it exists, review only the
   proposed diff; setup never overwrites it.
5. Setup then creates `webtutor-codex.json` and copies
   `codex_bridge/api.asp` with UTF-8 BOM.
6. Approve the separately proposed verification plan, then check the Bridge
   in a fresh conversation.

Do not copy `webtutor-codex.json`, project documentation, IDs, endpoints, or
runtime evidence between clients. Existing `agents/tests/*.js` and `api/*.asp`
remain available as fallbacks until both client pilots pass.

Installed local plugins are loaded from the Codex plugin cache rather than
directly from this source tree. After marketplace updates, run
`codex plugin marketplace upgrade webtutor-codex-marketplace`, refresh the
desktop app, and confirm the installed plugin version before use.

## Versioning

The plugin follows semantic versioning. Every change to a packaged file must
be accompanied by an appropriate plugin version and changelog update. Released
tags are immutable. Client projects should eventually pin an approved Git tag
or commit instead of following a moving branch.
