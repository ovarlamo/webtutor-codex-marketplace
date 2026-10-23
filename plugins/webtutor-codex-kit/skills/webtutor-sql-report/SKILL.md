---
name: webtutor-sql-report
description: Create, change, review, or verify SQL used by WebTutor agents, remote collections, reports, exports, or XQuery SQL mode. Use for table and field discovery, report query debugging, filters, sorting, pagination, XML SQL projections, read-only validation, and end-to-end report testing.
---

# WebTutor SQL Report

## Workflow

1. Read and obey the current workspace `AGENTS.md` files.
2. Use `$webtutor-reference` for the universal data-access, SQL-through-XQuery,
   and `sql:` prefix contracts.
3. Inspect the complete query assembly in WebTutor code, including appended
   `WHERE`, `ORDER BY`, filters, and paging.
4. For every unknown table, use `webtutor_get_table_info` when the active
   project has `webtutor-codex.json`, passing its absolute root as
   `project_root`; otherwise use the schema-inspection
   capability declared by that project. Never infer field names or SQL types.
5. Review the query with
   [query-review-checklist.md](references/query-review-checklist.md).
6. Define observable success criteria and a verification plan, show it to the
   user, and obtain agreement before executing checks.
7. Validate one read-only `SELECT` with the project's declared diagnostic
   capability, selecting only required columns and limiting rows.
8. Ensure the string passed to `XQuery()` starts with `sql:`. Keep the
   diagnostic query as a plain `SELECT` when the project tool expects one.
9. Run the agreed end-to-end test for SQL plus WebTutor/SP-XML assembly.
10. Report `Verified` and `Not verified` separately.

## Safety

- Never guess fields or SQL types.
- Never query personal or secret columns unless required by the task.
- Use only read-only diagnostic operations allowed by the current project.
- Preserve 64-bit identifiers as strings across ordinary browser JavaScript
  and JSON boundaries.
- Treat successful standalone SQL as an intermediate check, not completion.
- If a required capability is absent, stop and report it. Do not borrow a
  command, endpoint, schema, or fixture from another client project.
