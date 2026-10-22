# WebTutor Codex Marketplace

Private marketplace source for reusable, client-neutral Codex workflows used
when developing and diagnosing WebTutor/SP-XML solutions.

## Current state

This staging tree contains the marketplace and portable local-executor plugin
`webtutor-codex-kit` version `0.2.0`. The package contains four focused skills,
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
src/mcp-server/                        MCP build source
docs/migration-roadmap.md              Approved migration sequence
evals/*.json                           Activation, boundary, and isolation cases
scripts/validate-plugin.mjs            Dependency-free validator
```

Packaged skills live below:

```text
plugins/webtutor-codex-kit/skills/
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
package boundaries, and all four skill directories. For the release gate, use:

```powershell
npm run validate:release
```

Release validation requires all expected skills and their valid frontmatter.
Running either command is a verification action and must follow the applicable
approval contract.

## Local marketplace use

After the package is release-ready, add this repository as a local marketplace,
install `webtutor-codex-kit`, restart or refresh the desktop app, and validate
the skills in a new conversation. Installed local plugins are loaded from the
Codex plugin cache rather than directly from this source tree.

## Versioning

The plugin follows semantic versioning. Every change to a packaged file must
be accompanied by an appropriate plugin version and changelog update. Released
tags are immutable. Client projects should eventually pin an approved Git tag
or commit instead of following a moving branch.
