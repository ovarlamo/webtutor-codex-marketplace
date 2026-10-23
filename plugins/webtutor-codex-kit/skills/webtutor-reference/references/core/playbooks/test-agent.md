---
status: active
scope: universal-core
---

# Test a WebTutor agent

1. Read the client repository's instructions and package scripts.
2. Identify the exact registered or file-based agent test and its execution mode.
3. State observable success criteria and obtain any verification approval required by the repository.
4. If `webtutor-codex.json` exists and synchronous file execution is intended,
   use `webtutor_run_agent_file` with the absolute active workspace
   `project_root`; otherwise run the repository-declared test
   without changing its endpoint.
5. On failure, inspect the complete JSON response, including `errors`, logs, assertions, and result.
6. Change only the in-scope agent or dependency, then rerun the same test.
7. Treat a queued/background start as incomplete until the repository-defined logs, data, or `last_run_date` prove completion.

A repository may expose `npm run test:wt-agent` or a more specific `test:*`, but plugin core does not assume either exists. Registered-agent IDs, `script_path`, `env`, base URL, custom web root, and diagnostic endpoint are client capabilities that must come from the repository. Keep IDs as strings and do not switch a production agent's code source merely to test it.
