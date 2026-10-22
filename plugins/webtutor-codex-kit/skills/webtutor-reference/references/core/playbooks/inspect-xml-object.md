---
status: active
scope: universal-core
---

# Inspect an XML object

When the structure of a concrete WebTutor object is unknown, use
`webtutor_get_object_info` if the active project contains
`webtutor-codex.json`. Otherwise use the repository's read-only
object-inspection capability. A common fallback command shape is:

```powershell
npm run get-object-info -- <object_id>
```

Discover the actual command from repository instructions; do not assume this script or endpoint exists. Keep `<object_id>` as a string throughout the client and response.

Inspect the returned `TopElem.Xml` for the root name, exact child names, nesting, repeated elements, dynamic fields, and ID representation. Do not copy fields from a different object merely because it belongs to the same catalog. Then apply the [`XmlElem` child-access rules](../webtutor-reference/objects-and-globals.md#получение-дочерних-свойств-xmlelem).
