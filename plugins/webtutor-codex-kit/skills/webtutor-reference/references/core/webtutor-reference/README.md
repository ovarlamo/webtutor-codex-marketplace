# Portable WebTutor / SP-XML reference

This is a self-contained practical reference, not a mirror of `docs.datex.ru`. It prevents JavaScript, Node.js, general SQL, and client-repository assumptions from being transferred into SP-XML without evidence.

## How to use it

1. Read [the LLM coding guide](llm-coding-guide.md) and [language/runtime](language-runtime.md) completely before executable WebTutor code.
2. Identify the [execution context](../architecture/execution-contexts.md).
3. Search the bundled `generated/catalog.jsonl` through `scripts/search-webtutor-reference.mjs` for exact function and object names.
4. Load only the relevant manual note: [functions](functions.md), [objects and globals](objects-and-globals.md), [XQuery and data](xquery-and-data.md), [SQL through XQuery](sql-through-xquery.md), or a targeted troubleshooting/playbook page.
5. If a signature or behavior is absent, follow the official link and test the installed WebTutor version. Do not infer an API from JavaScript.

## Evidence levels

- **Official** — concise paraphrase with an official source link.
- **Verified practice** — reproduced in a named WebTutor/runtime context; `verified_on` records that context.
- **Safety rule** — conservative generation rule kept until documentation and a runtime test prove a broader contract.

Core remains usable when the target version is unknown. Version profiles are optional evidence overlays and must not be loaded merely because one exists.

## Contents

- [LLM coding guide](llm-coding-guide.md)
- [Language and runtime](language-runtime.md)
- [Functions](functions.md)
- [Objects and globals](objects-and-globals.md)
- [XQuery and data](xquery-and-data.md)
- [SQL through XQuery](sql-through-xquery.md)
- [`person_list_staff_by_person_id`](person-list-staff-by-person-id.md)
- [`OpenCodeLibrary()`](open-code-library.md)
- [Generated functions](generated/functions.md), [generated objects](generated/objects.md), and [machine-readable catalog](generated/catalog.jsonl)
- [Source map](sources.md)
