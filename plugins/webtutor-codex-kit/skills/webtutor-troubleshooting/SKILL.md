---
name: webtutor-troubleshooting
description: Diagnose WebTutor/SP-XML failures in agents, SQL/XQuery, remote actions, remote collections, ASP endpoints, serialization, encoding, resource loading, or tests. Use when investigating an error, failed assertion, empty result, UniBridge message, corrupted identifier, or missing browser resource.
---

# WebTutor Troubleshooting

## Triage

1. Read and obey the current workspace `AGENTS.md` files.
2. Define the observable reproduction and verification plan. Obtain user
   agreement before executing tests, runtime requests, log inspection, or SQL.
3. If the active project contains `webtutor-codex.json`, use
   `webtutor_ping` to distinguish MCP/config/HTTP failures from WebTutor action
   failures. Use the common `errors`, `logs`, `assertions`, and `result`
   envelope when routing the symptom.
4. Reproduce with the exact existing project test or request without changing
   its endpoint.
5. Read the complete response, including `errors`, `logs`, and `assertions`.
6. If the endpoint returns HTTP 500 before structured output, use the
   `inspect-webtutor-logs` playbook from `$webtutor-reference` and the current
   project's declared WebTutor installation or log root.
7. Locate the failing boundary:

   ```text
   parameters -> query/data -> SP-XML transformation -> serialization -> caller
   ```

8. Route the symptom with
   [symptom-routing.md](references/symptom-routing.md).
9. Use read-only diagnostics first. For SQL, use `$webtutor-sql-report`; for
   platform facts, use `$webtutor-reference`.
10. If diagnosis alone was requested, report the evidence-backed cause and do
   not implement a fix.
11. If a fix is authorized, make the smallest change and repeat the agreed
    original end-to-end test.
12. Report `Verified` and `Not verified` separately.

## Evidence rules

- Do not infer a cause from a generic UniBridge message alone.
- Do not invent a missing API, schema, source file, route, test fixture, or
  replacement image.
- Distinguish an empty valid result from an exception.
- Do not read another client's workspace when a local source is absent.
- For confirmed reusable platform behavior, use the packaged
  `capture-knowledge` playbook and record it only after user approval.
