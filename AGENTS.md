# WebTutor Codex Marketplace

## Scope

This repository packages reusable, client-neutral Codex skills and a
self-contained WebTutor reference core. Keep the plugin portable while
requiring a local Codex executor for repository, terminal, and
WebTutor-instance access.

## Boundaries

- Keep client names, client-owned object IDs, endpoints, credentials, domain
  knowledge, and business tests out of the marketplace and plugin. Public
  catalog or documentation identifiers may be packaged when their source and
  purpose are explicit.
- Keep version-specific evidence explicit. A note may be part of the shared
  core while retaining a narrow `verified_on` value; never generalize that
  evidence to other WebTutor versions without a new verification.
- Keep client repositories responsible for their own `AGENTS.md`, local
  `webtutor-codex.json`, copied WebTutor Bridge, test commands, domain/project
  documentation, and optional WebTutor version or project overlays. The
  packaged reference core must remain usable without a repository-local
  WebTutor reference.
- Load a version profile only when the active WebTutor version exactly matches
  that profile. If the version is unknown, continue with the universal core,
  do not load a profile, and keep version-specific claims explicitly
  unverified.
- Version `0.2.x` includes one local stdio MCP server and one manually copied
  WebTutor Bridge. Do not add registered apps, lifecycle hooks, automatic
  client setup, authentication, or additional MCP tools without a separately
  approved scope change.
- Do not use undocumented WebTutor APIs or infer SP-XML behavior from
  JavaScript semantics.
- Use ASCII names for every file and directory shipped in the plugin.
- If a future template creates executable WebTutor agent code, write it as
  UTF-8 with BOM and verify the leading bytes are `EF BB BF`.

## Package contract

- The portable manifest is
  `plugins/webtutor-codex-kit/plugin.json`.
- The portable MCP manifest is `plugins/webtutor-codex-kit/mcp.json`.
- The packaged MCP runtime is
  `plugins/webtutor-codex-kit/server/index.mjs`.
- The local marketplace catalog is `.agents/plugins/marketplace.json`.
- The plugin identity is `webtutor-codex-kit` and follows semantic versioning.
- The catalog source is `./plugins/webtutor-codex-kit`, resolved from the
  marketplace root.
- `extensions.com.openai.requires_local_executor` must remain `true`.
- Packaged skills live only under
  `plugins/webtutor-codex-kit/skills/<skill-name>/`.
- Skill-local references use paths below the owning skill. Optional project
  overlays and domain/project documents are workspace-root capabilities, not
  required dependencies and not links relative to the installed plugin cache.

## Change workflow

1. Read `docs/migration-roadmap.md` and the affected plugin documentation.
2. State the exact files and observable success criteria before writing.
3. Make the smallest scoped change. Do not change client repositories as a
   side effect of marketplace work.
4. Propose the validation commands and obtain approval before running them.
5. Record behavior-affecting changes in both applicable changelogs.
6. Do not mark `0.2.0` release-ready until `npm run validate:release` and the
   approved activation/boundary evaluations pass in a fresh conversation.

## Verification contract

Static validation alone does not prove that Codex discovers or activates the
skills. A release requires an approved local-marketplace installation check,
a fresh Codex conversation, activation and negative cases, and isolation
checks in at least two client repositories. Report completed checks separately
from checks that were not run.
