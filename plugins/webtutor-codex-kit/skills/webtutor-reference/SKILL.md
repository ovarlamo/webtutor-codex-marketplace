---
name: webtutor-reference
description: Research documented WebTutor/SP-XML functions, objects, XQuery, runtime semantics, execution contexts, diagnostics, and version compatibility. Use when an exact platform API, language rule, data-access pattern, provenance link, or version-qualified behavior is needed; do not use it as proof of a client-specific schema or endpoint.
---

# WebTutor Reference

Use this skill as the portable knowledge layer for WebTutor/SP-XML. Keep client code, URLs, credentials, object IDs, table snapshots, and endpoint configuration in the client repository.

## Required reading for executable SP-XML

Before writing or reviewing code that WebTutor executes, read completely:

1. [LLM coding guide](references/core/webtutor-reference/llm-coding-guide.md)
2. [Language and runtime](references/core/webtutor-reference/language-runtime.md)
3. [Execution contexts](references/core/architecture/execution-contexts.md)

Then load only the task-specific reference from [the routing index](references/README.md).

## Exact API lookup

Search the bundled official catalog before assuming a function, object, signature, or related entry exists:

```powershell
node scripts/search-webtutor-reference.mjs <name-or-description>
```

The command supports `--kind function|object`, `--category`, `--limit`, and `--json`. Resolve the script relative to this installed skill, not relative to a client repository.

If the required signature or behavior is absent, inspect the linked official source and verify it against the installed WebTutor version. Similar JavaScript APIs are not evidence for SP-XML.

If the helper cannot start because the local sandbox denies access to the
installed plugin path, search
`references/core/webtutor-reference/generated/catalog.jsonl` directly with
`rg`. Treat this only as a discovery fallback: follow the entry's
`source_url` for any signature or behavior not present in the catalog.

## Поиск по схеме объектов WebTutor

Для уточнения русских названий, полей каталогов, XML-путей и `FOREIGN-ARRAY` используйте локальный индекс XMD:

```powershell
node scripts/search-schema.mjs "Дата приема"
node scripts/search-schema.mjs --entity collaborator
node scripts/search-schema.mjs --foreign collaborators
```

Пути к скрипту относительны установленного навыка. JSON-карточки находятся в `references/core/schema/entities/`; `index.json` содержит имена объектов, `enums.json` — значения системных списков. Это **снимок исходных XMD**, а не проверка физической схемы SQL текущей установки. Для SQL сверяйте столбцы с таблицами заказчика.

Базовый снимок относится к WebTutor `2025.2.1403`. Основной источник версионных исходников — приватный репозиторий `ovarlamo/websoft-hcm`; исходники из него не копируются в marketplace. Для исследования другой версии переключите локальный клон `websoft-hcm` на соответствующую ветку (`2021.1.3.297` или `2025.2.1403`), проверьте исходные XMD в `WebSoftServer/wtv/` и русские текстовые константы в `WebSoftServer/lngs/russian/const.xml`. Сначала исследуйте нужную версию, не заменяя базовый справочник.

Перегенерация снимка допускается только после проверки исходников и сравнения результата с существующим индексом, в отдельной рабочей копии Kit:

```powershell
node scripts/generate-schema.mjs --source <путь-к-websoft-hcm> --webtutor-version 2025.2.1403
```

Генератор записывает SHA текущего коммита источника. Отсутствие `const.xml` отменяет генерацию. Если отдельные ключи отсутствуют в словаре, генератор сообщает об этом; запись отменяется, если из-за этого пропало ранее разрешённое название в существующей карточке. Перед использованием результата проверяйте предупреждения. Параметр `--webtutor-version` задаётся вручную: перед запуском убедитесь, что выбранная ветка действительно соответствует версии.

## Поиск методов WebTutor

В `references/core/operations/index.json` находятся имена и параметры методов из `wtv_tools.xml`, `wtv_tools_web.xml` и `ms_tools.xml`. Карточки с изученным поведением находятся в `references/core/operations/tools/`. Для поиска используйте `node scripts/search-operations.mjs "назначить курс"` либо точное имя метода. Все эти сведения извлечены из исходников WebTutor **2025.2.1403**; другие версии требуют отдельной проверки. SHA коммита источника сохранён отдельно.

При необходимости исследуйте объявления методов в `WebSoftServer/wtv/` соответствующей ветки `websoft-hcm`, проверяйте их контекст и поведение по исходникам данной версии. Для перегенерации в отдельной копии Kit: `node scripts/generate-operations.mjs --source <путь-к-websoft-hcm> --webtutor-version 2025.2.1403`. Перед переносом результата сравните его с базовым индексом и проверьте SHA и выбранную версию.

## Compatibility model

- `references/core/` contains reusable rules and evidence-backed platform knowledge. A `verified_on` field records observed versions; it does not turn a core rule into a client override.
- Отдельные профили версий не требуются для исследования исходников: используйте базовые материалы и сверяйте версионные особенности с соответствующей веткой `websoft-hcm`. Если уже существует материал, ограниченный конкретной версией, применяйте его только при подтверждённом совпадении версии.
- Repository instructions and tests decide local commands, endpoints, public paths, custom roots, schemas, and verification requirements. Placeholders such as `<custom_root>`, `<webtutor_base_url>`, `<webtutor_log_root>`, and `<object_id>` must be resolved from the current repository; never guess them.

Preserve explicit distinctions among `undefined`, `null`, `""`, `0`, and `false`; preserve 64-bit IDs; and never infer table fields, execution globals, or writable behavior from a nearby example.
