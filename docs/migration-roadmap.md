# Migration roadmap

## Goal

Extract reusable WebTutor engineering workflows from the current client
project into the portable `webtutor-codex-kit` plugin without transferring
client configuration, business knowledge, endpoints, identifiers, or
unsupported assumptions between WebTutor versions.

## Classification

- **Universal core**: shared platform contracts that apply across supported
  client repositories. `verified_on` records where a rule was confirmed; it
  is provenance, not a version gate.
- **Common core**: reusable documentation and procedures whose individual
  empirical claims may retain narrower evidence boundaries.
- **Active core**: shared material that is already an active required workflow
  and must remain operational after migration.
- **Repository-local**: client, project, environment, or version overlay that
  remains in the consuming repository.
- **Version profile**: behavior materially coupled to an exact
  WebTutor/UniBridge/runtime combination; load it only on an exact match.

Common-core placement does not broaden a claim beyond its evidence. The
universal core remains usable without a repository-local reference or a known
WebTutor version; an exact version profile is an optional refinement, not a
prerequisite.

## Target skills

| Skill | Responsibility |
|---|---|
| `webtutor-reference` | Establish platform facts, search references, preserve provenance, and distinguish documented, runtime-verified, hypothetical, and unknown behavior. |
| `webtutor-development` | Implement and review server-side WebTutor/SP-XML code in the correct execution context. |
| `webtutor-sql-report` | Discover table structure and create or verify report SQL and its JavaScript integration. |
| `webtutor-troubleshooting` | Diagnose failures from errors, logs, assertions, serialization, encoding, browser resources, and runtime behavior. |

The three workflow skills route exact API and version questions to
`webtutor-reference`; they do not link into another skill directory with
relative filesystem traversal.

## Core knowledge inventory

The source path and final wording of every note must be confirmed during its
migration. Do not create a substitute when the source is missing.

| Note ID | Target classification | Planned owner | Migration requirement |
|---|---|---|---|
| `catalog-list-base` | Core; `verified_on` remains specific | `webtutor-reference` | Keep it in the common core, preserve the exact `verified_on` evidence, and do not present that evidence as valid for untested versions. |
| `json-scientific-notation` | Universal core | `webtutor-reference` | Preserve the numeric-serialization symptom, safe handling rule, and evidence boundary without embedding client-owned IDs. |
| `open-code-library` | Common core | `webtutor-reference` | Preserve the documented lookup/opening workflow and distinguish platform URI handling from guessed filesystem paths. |
| `websoft-admin-system-reports` | Common core | `webtutor-reference` | Preserve the supported administrative inspection route and its authorization/runtime assumptions. |
| `inspect-webtutor-logs` | Universal active core | `webtutor-troubleshooting` | Keep log inspection active and document `<WebSoftServer>/Logs` as the standard location. Use a different location only when the active repository or instance confirms an override. |

Additional version-neutral candidates must be reviewed individually. A whole
project document must not be copied merely because some of its paragraphs are
portable.

## Repository-local material

The following stays in each client repository:

- applicable `AGENTS.md` instructions;
- client domain/project documentation and optional reference overlays;
- WebTutor-version overlays and current-instance evidence;
- endpoints, authentication, client-owned object IDs, custom roots, and
  secrets;
- business agents, reports, remote actions, collections, and tests;
- `agents/package.json` and context-specific test command selection;
- confirmed nonstandard log-location overrides and local diagnostic
  configuration;
- client-specific table and object structures.

## Reference resolution rules

1. Use the packaged universal core without requiring a repository-local
   WebTutor reference.
2. Load a version profile only after the active version exactly matches that
   profile's declared version.
3. If the version is unknown, do not load any profile. Continue with the
   universal core and label exact version-specific behavior as unverified.
4. Treat repository domain/project documents and reference overlays as
   optional context for that client only. Never borrow an overlay from a
   sibling client repository.

## Phases

### Phase 0: infrastructure

Create the portable manifest, local marketplace catalog, changelogs,
dependency-free validator, and evaluation inventory before assembling the
complete four-skill package.

### Phase 1: reference core

Create `webtutor-reference`, migrate only confirmed sources, and add the five
core items listed above with explicit evidence status. Do not make runtime
claims broader than their `verified_on` metadata.

### Phase 2: workflow skills

Migrate `webtutor-development`, `webtutor-sql-report`, and
`webtutor-troubleshooting`. Retain their narrow triggers and skill-local
references. Replace assumptions about one project with checks for capabilities
in the active workspace.

### Phase 3: package verification

Run release validation, review the complete package for client leakage, and
execute the approved activation, boundary, and isolation cases in a fresh
Codex conversation after installing from the local marketplace.

### Phase 4: client pilot

Pilot the package in a client repository only after the user confirms the
target path and rollout order. Confirm that it reads only that repository's
instructions and optional overlays. Test each client separately; do not keep
duplicate same-named local and plugin skills enabled during final cutover.

### Phase 5: private Git distribution

Publish an immutable reviewed tag, pin approved clients to that tag or commit,
and document rollback to the previous plugin version. Do not use a moving
branch as a production pin.

### Phase 6: local MCP and Bridge pilot

Package one local stdio MCP server and one universal ASP Bridge template.
Store `base_url`, `custom_root`, and `bridge_url` only in the active client
project's `webtutor-codex.json`. Copy the Bridge manually while the contract is
being proven. Pilot WebTutor 2021.1.3.297 first, then 2025.2.1403. Preserve all
legacy test scripts and ASP endpoints until both clients succeed.

## Release criteria for 0.2.0

- All four expected skills are present with unique valid frontmatter.
- Packaged references contain no client endpoint, secret, client-owned object
  ID, or absolute workstation path.
- The five named core items have confirmed source material and preserved
  evidence scope.
- The universal reference core works without a repository-local reference;
  unknown versions do not activate a version profile.
- `npm run validate:release` succeeds.
- Approved activation, negative, and isolation cases pass in a fresh
  conversation.
- The installed plugin uses only the active client's repository capabilities.
- The bundled MCP exposes exactly the four approved Bridge tools.
- Manual Bridge pilots succeed first on WebTutor 2021.1.3.297 and then on
  2025.2.1403 before any fallback endpoint is removed.
- Verified and not-verified results are recorded separately.
