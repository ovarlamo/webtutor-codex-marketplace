---
status: active
scope: universal-core
---

# Inspect a system object

Use only a repository-declared read-only diagnostic resolver with an allowlist of object types and fixed parameters. Never send arbitrary SP-XML, a global-object path, or an unrestricted `tools` method to a diagnostic endpoint.

If the repository exposes a command equivalent to `get-system-info`, use placeholders resolved from the current task:

```powershell
npm run get-system-info -- custom-template <catalog_name>
npm run get-system-info -- custom-template <catalog_name> --top-id <top_id>
npm run get-system-info -- custom-template <catalog_name> --source-id <object_id>
```

Keep all 64-bit IDs as strings. For custom fields, compare actual object values under `custom_elems` with the resolved template's `fields`; obtain title, type, requiredness, and lookup settings from the returned XML rather than guessing them.

If the capability is absent, stop and request a permitted resolver instead of synthesizing one inside an unrelated task.
