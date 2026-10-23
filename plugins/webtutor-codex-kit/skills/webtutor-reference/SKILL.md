---
name: webtutor-reference
description: Research documented WebTutor/SP-XML functions, objects, XQuery, runtime semantics, execution contexts, diagnostics, and version compatibility. Use when an exact platform API, language rule, data-access pattern, provenance link, or version-qualified behavior is needed; do not use it as proof of a client-specific schema or endpoint.
---

# WebTutor Reference

Use this skill as the portable knowledge layer for WebTutor/SP-XML. Keep client code, URLs, credentials, object IDs, table snapshots, and endpoint configuration in the client repository.

## Required reading for executable SP-XML

Before writing or reviewing code that WebTutor executes, read completely:

1. [LLM coding guide](references/core/webtutor-reference/llm-coding-guide.md)
2. [Language and runtime](references/core/webtutor-reference/language-runtime.md)
3. [Execution contexts](references/core/architecture/execution-contexts.md)

Then load only the task-specific reference from [the routing index](references/README.md).

## Exact API lookup

Search the bundled official catalog before assuming a function, object, signature, or related entry exists:

```powershell
node scripts/search-webtutor-reference.mjs <name-or-description>
```

The command supports `--kind function|object`, `--category`, `--limit`, and `--json`. Resolve the script relative to this installed skill, not relative to a client repository.

If the required signature or behavior is absent, inspect the linked official source and verify it against the installed WebTutor version. Similar JavaScript APIs are not evidence for SP-XML.

If the helper cannot start because the local sandbox denies access to the
installed plugin path, search
`references/core/webtutor-reference/generated/catalog.jsonl` directly with
`rg`. Treat this only as a discovery fallback: follow the entry's
`source_url` for any signature or behavior not present in the catalog.

## Compatibility model

- `references/core/` contains reusable rules and evidence-backed platform knowledge. A `verified_on` field records observed versions; it does not turn a core rule into a client override.
- `references/profiles/<version>/` contains behavior whose applicability depends materially on that WebTutor/UniBridge/runtime combination. Load a profile only after identifying the target version.
- Repository instructions and tests decide local commands, endpoints, public paths, custom roots, schemas, and verification requirements. Placeholders such as `<custom_root>`, `<webtutor_base_url>`, `<webtutor_log_root>`, and `<object_id>` must be resolved from the current repository; never guess them.

Preserve explicit distinctions among `undefined`, `null`, `""`, `0`, and `false`; preserve 64-bit IDs; and never infer table fields, execution globals, or writable behavior from a nearby example.
