---
status: active
scope: universal-core
---

# Debug a remote collection

1. Find the repository-declared end-to-end test for the exact collection; do not change its endpoint merely for diagnosis.
2. Reproduce and inspect the full response, including `errors`, logs, and assertions.
3. Locate the failing boundary: parameters → SQL/XQuery → SP-XML transformation → serialization → caller.
4. Verify unknown SQL tables and fields through the repository's read-only schema capability.
5. Run the query alone through the repository's read-only SQL capability, with minimal fields and rows.
6. Compare returned fields and types with SP-XML access, explicitly handling an empty result and 64-bit IDs.
7. Rerun the original full collection test.

Successful SQL is not evidence that the remote collection contract succeeds.
