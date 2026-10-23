---
name: webtutor-development
description: Implement, modify, review, or explain server-side WebTutor/SP-XML code in agents, libraries, procedures, remote actions, remote collections, reports, ASP pages, or related project files. Use whenever a task touches WebTutor APIs, XQuery, XML documents, platform globals, execution contexts, or server-side JavaScript-like code.
---

# WebTutor Development

## Mandatory preflight

1. Read and obey the current workspace `AGENTS.md` files before acting.
2. Use `$webtutor-reference` and apply its mandatory coding guide before
   writing or changing code executed by WebTutor. Do not substitute another
   client's repository when a required project capability is absent.
3. Identify the execution context and answer the checklist in
   [execution-contexts.md](references/execution-contexts.md).
4. Define observable success criteria and a proportionate verification plan.
   Show the plan to the user and obtain agreement before running checks.

## Workflow

1. Route the task with [task-router.md](references/task-router.md).
2. Establish every exact WebTutor function, object, global, or XQuery rule
   through `$webtutor-reference`. SP-XML Script is not JavaScript.
3. If the packaged reference does not establish a signature or behavior,
   inspect an official source and test the installed WebTutor version. Mark
   unsupported claims as unknown rather than guessing.
4. Preserve explicit handling of `undefined`, `null`, `""`, `0`, and `false`
   according to the surrounding contract. Preserve 64-bit identifiers.
5. Before testing SP-XML, recursively audit every loop body. It must contain
   no `var` declarations, including inside nested `if`, `try`/`catch`, or
   `switch` blocks. Declare working variables before entering the loop and
   only assign to them inside it.
6. In an object literal, wrap a ternary property value in parentheses.
7. Make the smallest scoped change. Use only test and diagnostic capabilities
   declared by the current project.
8. When the active project contains `webtutor-codex.json` and the requested
   operation is supported, prefer the packaged MCP Bridge and pass the
   absolute active workspace root as `project_root` on every call. Treat
   `webtutor_run_agent_file` and `webtutor_run_script_file` as potentially state-changing and use it only
   after the project's verification approval.
9. For executable WebTutor agents, ASP pages, and remote actions, create or
   preserve UTF-8 with BOM and verify the first bytes are `EF BB BF` before
   handing off a path or running the file.
10. Run the agreed context-specific verification. Report `Verified` and
   `Not verified` separately.

## Routing

- SQL or report query: use `$webtutor-sql-report`.
- Failure diagnosis: use `$webtutor-troubleshooting`; do not implement a fix
  unless the request includes one.
- Unknown platform fact: use `$webtutor-reference`.
- Browser resources in server templates: use the current project's confirmed
  public web-root mapping. If none exists, ask the user for it.
- Unknown table structure: use the project's declared table-inspection
  capability before writing SQL.
- Local Bridge available: use `webtutor_ping` with the absolute active
  workspace `project_root` to establish connectivity and
  `webtutor_run_script_file` for approved project-relative execution under `web/agents/` or `tools/`. Keep `webtutor_run_agent_file` for legacy `agents/` projects. If the
  Bridge is absent, keep using the repository-declared fallback.

## Boundaries

- Do not use undocumented WebTutor functions.
- Do not replace platform URL schemes with guessed filesystem paths.
- Do not move code between execution contexts without confirming inputs,
  globals, return type, and caller.
- Do not modify a test endpoint unless the user requested that separately.
- Do not turn production code into a reusable example until its complete
  workflow has passed.
- For a verified unusual behavior, follow the packaged knowledge-capture
  playbook: report symptom, cause, solution, evidence, and scope; record it
  only after user approval.
