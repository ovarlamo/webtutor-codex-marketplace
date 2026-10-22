---
status: active
scope: universal-core
---

# Verify report SQL

1. Read the SQL and the code that adds `WHERE`, `ORDER BY`, paging, and parameters.
2. Inspect every unknown table and field through the repository's read-only schema capability.
3. Build a temporary complete single `SELECT` without comments or additional statements.
4. Limit fields and rows to the minimum needed and avoid personal data.
5. Run it through the repository's read-only SQL capability, preferably from a UTF-8 file for a large query.
6. Confirm that the server-side string passed to `XQuery()` starts with `sql:`; the diagnostic command normally accepts the bare `SELECT`.
7. Run the report or remote-collection end-to-end test.
8. Remove the temporary diagnostic query unless the task requires it as an artifact.

Do not modify the working query or diagnostic endpoint solely to make the diagnostic command accept it.
