# Routing index

Read only the branch needed for the current task.

## Shared core

The shared core contains universal contracts and common documentation with
explicit evidence boundaries.

- SP-XML code or review: [LLM coding guide](core/webtutor-reference/llm-coding-guide.md), [language/runtime](core/webtutor-reference/language-runtime.md), and [execution contexts](core/architecture/execution-contexts.md).
- Function or platform object: run the bundled search, then use [functions](core/webtutor-reference/functions.md), [objects and globals](core/webtutor-reference/objects-and-globals.md), and the [generated catalog](core/webtutor-reference/generated/functions.md).
- XQuery, SQL, or data access: [XQuery and data](core/webtutor-reference/xquery-and-data.md), [SQL through XQuery](core/webtutor-reference/sql-through-xquery.md), and [data access](core/architecture/data-access.md).
- Server agents and `Param`: [agent variable contract](core/webtutor-reference/objects-and-globals.md#параметры-серверного-агента-server_agent) and [agent testing playbook](core/playbooks/test-agent.md).
- Server/request failure: [request lifecycle](core/architecture/request-lifecycle.md), [troubleshooting](core/troubleshooting/README.md), and the matching [playbook](core/playbooks/README.md).
- Examples: use [example acceptance criteria](core/examples/README.md); examples are evidence only when their stated test and context match.

## Version profiles

Load [the 2025.2.1403 profile](profiles/2025.2.1403/README.md) only for the same or explicitly compatibility-tested WebTutor/UniBridge/runtime combination. A profile cannot override client-repository instructions or substitute for a runtime check after an upgrade.
