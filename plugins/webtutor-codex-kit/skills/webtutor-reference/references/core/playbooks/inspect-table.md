---
status: active
scope: universal-core
---

# Inspect a SQL table

When the active project contains `webtutor-codex.json`, prefer
`webtutor_get_table_info`. Otherwise use the repository-declared read-only
schema command before writing SQL when fields or types are unknown. A common
fallback capability shape is:

```powershell
npm run get-table-info -- table <table_name>
```

Do not assume this exact script exists; discover it from repository instructions or package scripts. Request only metadata. Persist a schema snapshot in the client repository only when it will be reused, and record its command, source installation, and verification date. Never place client schema snapshots in plugin core.
