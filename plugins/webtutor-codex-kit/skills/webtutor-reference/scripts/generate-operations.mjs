import fs from "node:fs/promises";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const destination = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../references/core/operations");
const sourceRepository = "ovarlamo/webtutor-catalog-xmds";
const defaultFiles = ["wtv_tools.xml", "wtv_tools_web.xml", "ms_tools.xml"];

function options(argv) {
    const opts = { source: "", revision: "", webtutorVersion: "", files: defaultFiles };
    for (let i = 0; i < argv.length; i++) {
        const key = argv[i];
        if (key === "--help") {
            console.log("node scripts/generate-operations.mjs --source <путь-к-репозиторию-XMD> [--revision <SHA>] --webtutor-version <версия> [--files file1.xml,file2.xml]");
            process.exit(0);
        }
        if (!["--source", "--revision", "--webtutor-version", "--files"].includes(key) || !argv[i + 1])
            throw new Error("Неизвестный параметр или отсутствует значение: " + key);
        const value = argv[++i];
        if (key === "--source") opts.source = path.resolve(value);
        if (key === "--revision") opts.revision = value;
        if (key === "--webtutor-version") opts.webtutorVersion = value;
        if (key === "--files") opts.files = value.split(",").map(x => x.trim()).filter(Boolean);
    }
    if (!opts.source || !opts.files.length || !opts.webtutorVersion)
        throw new Error("Укажите --source и хотя бы один XML-файл");
    if (opts.files.some(x => !/^[a-zA-Z_][a-zA-Z0-9_]*\.xml$/.test(x)))
        throw new Error("Недопустимое имя XML-файла");
    if (!opts.revision) {
        try {
            opts.revision = execFileSync("git", ["-C", opts.source, "rev-parse", "HEAD"], { encoding: "utf8" }).trim();
        } catch {
            throw new Error("Укажите --revision: не удалось определить SHA источника");
        }
    }
    if (!/^[a-f0-9]{40}$/.test(opts.revision))
        throw new Error("--revision должен содержать полный SHA коммита");
    return opts;
}

function decode(value) {
    return value.replace(/&quot;/g, '"').replace(/&apos;/g, "'")
        .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}

// Читаем теги с учётом кавычек: EXPR может содержать переводы строк и символы >.
// Содержимое EXPR не исполняется и не сохраняется в поисковом индексе.
function* readTags(xml) {
    let pos = 0;
    let line = 1;
    while (pos < xml.length) {
        const start = xml.indexOf("<", pos);
        if (start < 0) return;
        line += (xml.slice(pos, start).match(/\n/g) ?? []).length;
        if (xml.startsWith("<!--", start)) {
            const finish = xml.indexOf("-->", start + 4);
            if (finish < 0) throw new Error("Незакрытый комментарий");
            line += (xml.slice(start, finish + 3).match(/\n/g) ?? []).length;
            pos = finish + 3;
            continue;
        }
        let end = start + 1, quote = "";
        for (; end < xml.length; end++) {
            const ch = xml[end];
            if (quote) {
                if (ch === quote) quote = "";
            } else if (ch === '"' || ch === "'") quote = ch;
            else if (ch === ">") break;
        }
        if (end === xml.length) throw new Error("Незакрытый XML-тег");
        const raw = xml.slice(start + 1, end).trim();
        const tagLine = line;
        line += (xml.slice(start, end + 1).match(/\n/g) ?? []).length;
        pos = end + 1;
        if (!raw || raw.startsWith("?") || raw.startsWith("!")) continue;
        const match = raw.match(/^\/?([A-Za-z_][\w:-]*)/);
        if (!match) continue;
        const attrs = [];
        for (const a of raw.matchAll(/([A-Za-z_][\w:-]*)\s*=\s*(?:"([^"]*)"|'([^']*)')/g))
            attrs.push([a[1], decode(a[2] ?? a[3])]);
        yield {
            name: match[1],
            closing: raw.startsWith("/"),
            selfClosing: /\/\s*$/.test(raw),
            line: tagLine,
            attrs
        };
    }
}

function methodsFrom(xml, filename) {
    const stack = [], methods = [], namespaces = new Set();
    for (const tag of readTags(xml)) {
        if (tag.closing) {
            if (stack.pop() !== tag.name)
                throw new Error("Неверная вложенность в " + filename + ": " + tag.name);
            continue;
        }
        if (stack.length === 1 && stack[0] === "SPXML-INLINE-FORM" && !tag.selfClosing)
            namespaces.add(tag.name);
        if (stack.length === 2 && stack[0] === "SPXML-INLINE-FORM") {
            const a = Object.fromEntries(tag.attrs);
            if (a.PROPERTY === "1" && a.EXPR !== undefined) {
                const parameters = tag.attrs.filter(([key]) => key === "PARAM").map(([, value]) => value);
                methods.push({
                    name: stack[1] + "." + tag.name,
                    namespace: stack[1],
                    method: tag.name,
                    parameters,
                    source_file: filename,
                    source_line: tag.line,
                    allow_call_from_client: a["ALLOW-CALL-FROM-CLIENT"] === "1"
                });
            }
        }
        if (!tag.selfClosing) stack.push(tag.name);
    }
    if (stack.length) throw new Error("Незакрытые элементы XML в " + filename);
    if (namespaces.size !== 1)
        throw new Error("Ожидалось одно пространство имён в " + filename);
    return methods;
}

async function main() {
    const opts = options(process.argv.slice(2));
    const entries = [];
    for (const file of opts.files) {
        const xml = await fs.readFile(path.join(opts.source, file), "utf8");
        entries.push(...methodsFrom(xml, file));
    }
    entries.sort((a, b) => a.name.localeCompare(b.name, "en"));
    const seen = new Set();
    for (const entry of entries) {
        if (seen.has(entry.name)) throw new Error("Повторное определение: " + entry.name);
        seen.add(entry.name);
    }
    const index = {
        schema_version: 1,
        source: { repository: sourceRepository, commit: opts.revision, webtutor_version: opts.webtutorVersion },
        libraries: opts.files,
        declaration_kind: "PROPERTY=1 и EXPR в SPXML-INLINE-FORM",
        methods: entries
    };
    await fs.mkdir(destination, { recursive: true });
    await fs.writeFile(path.join(destination, "index.json"), JSON.stringify(index, null, 2) + "\n");
    console.log("Проиндексировано объявлений: " + entries.length + " из файлов: " + opts.files.join(", "));
}
main().catch(error => { console.error(error.stack ?? error); process.exitCode = 1; });
