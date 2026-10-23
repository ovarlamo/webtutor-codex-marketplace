import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const schemaDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../references/core/schema");
const repository = "ovarlamo/webtutor-catalog-xmds";

function args(argv) {
    const opts = { source: "", revision: "", objects: ["collaborator", "course", "active_learning"] };
    for (let i = 0; i < argv.length; i += 1) {
        const key = argv[i];
        if (key === "--help") {
            console.log("node scripts/generate-schema.mjs --source <путь-к-webtutor-catalog-xmds> [--revision <commit>] [--objects name,name]");
            process.exit(0);
        }
        if (!["--source", "--revision", "--objects"].includes(key) || !argv[i + 1])
            throw new Error("Неизвестный параметр или отсутствует значение: " + key);
        const value = argv[++i];
        if (key === "--source") opts.source = path.resolve(value);
        if (key === "--revision") opts.revision = value;
        if (key === "--objects") opts.objects = value.split(",").map(x => x.trim()).filter(Boolean);
    }
    if (!opts.source || !opts.objects.length)
        throw new Error("Укажите --source и хотя бы один объект");
    if (opts.objects.some(x => !/^[a-z][a-z0-9_]*$/.test(x)))
        throw new Error("Недопустимое имя объекта");
    if (!opts.revision) {
        try {
            opts.revision = execFileSync("git", ["-C", opts.source, "rev-parse", "HEAD"], { encoding: "utf8" }).trim();
        } catch {
            throw new Error("Не удалось получить commit исходного репозитория; задайте --revision");
        }
    }
    if (!/^[a-f0-9]{40}$/.test(opts.revision))
        throw new Error("--revision должен быть полным SHA коммита");
    return opts;
}

function decode(value) {
    return String(value).replace(/&quot;/g, '"').replace(/&apos;/g, "'")
        .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&")
        .replace(/&#(x[0-9a-f]+|\d+);/gi, (_, code) =>
            String.fromCodePoint(code[0].toLowerCase() === "x" ? parseInt(code.slice(1), 16) : Number(code)));
}

function section(xml, name) {
    const start = xml.indexOf("<" + name + ">");
    const end = xml.indexOf("</" + name + ">", start);
    if (start < 0 || end < 0) throw new Error("Не найдена секция: " + name);
    return xml.slice(start + name.length + 2, end);
}

function child(xml, name) {
    const match = xml.match(new RegExp("<" + name + ">([\\s\\S]*?)</" + name + ">"));
    return match ? decode(match[1].trim()) : null;
}

function dictionary(xml) {
    const result = new Map();
    for (const item of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
        const id = child(item[1], "id");
        const value = child(item[1], "val");
        if (id !== null && value !== null) result.set(id, value);
    }
    return result;
}

// XMD may contain multi-line EXPR attributes with '>' inside quotes.
// Do not split tags at every '>' or treat executable expressions as XML fields.
function* tags(xml) {
    let i = 0;
    while ((i = xml.indexOf("<", i)) !== -1) {
        if (xml.startsWith("<!--", i)) {
            const end = xml.indexOf("-->", i + 4);
            if (end < 0) throw new Error("Незакрытый XML-комментарий");
            i = end + 3;
            continue;
        }
        let j = i + 1, quote = "";
        for (; j < xml.length; j += 1) {
            const ch = xml[j];
            if (quote) {
                if (ch === quote) quote = "";
            } else if (ch === '"' || ch === "'") quote = ch;
            else if (ch === ">") break;
        }
        if (j >= xml.length) throw new Error("Незавершённый XML-тег");
        const raw = xml.slice(i + 1, j).trim();
        i = j + 1;
        if (!raw || raw.startsWith("?") || raw.startsWith("!")) continue;
        const closing = raw.startsWith("/");
        const name = raw.match(/^\/?([A-Za-z_][\w:-]*)/)?.[1];
        if (!name) continue;
        const attrs = {};
        for (const a of raw.matchAll(/([A-Za-z_][\w:-]*)\s*=\s*(?:"([^"]*)"|'([^']*)')/g))
            attrs[a[1]] = decode(a[2] ?? a[3]);
        yield { name, closing, selfClosing: /\/\s*$/.test(raw), attrs };
    }
}

function parseForm(xml, name, catalog, constants) {
    const plural = name + "s";
    const prefix = catalog ? ["SPXML-FORM", plural, name] : ["SPXML-FORM", name];
    const stack = [], fields = [], inherits = [], missingTitles = new Set();
    let formAttrs;
    for (const tag of tags(xml)) {
        if (tag.closing) {
            if (stack.at(-1) !== tag.name)
                throw new Error("Нарушена вложенность XMD у " + name + ": " + tag.name);
            stack.pop();
            continue;
        }
        if (tag.name === "SPXML-FORM") formAttrs = tag.attrs;
        const full = [...stack, tag.name];
        const belongs = prefix.every((p, index) => full[index] === p);
        const relative = full.slice(prefix.length).join(".");
        if (belongs && tag.name === "INHERIT" && tag.attrs.TYPE)
            inherits.push({ path: relative, type: tag.attrs.TYPE });
        const excluded = new Set(["INHERIT", "USE", "OnBuild", "OnSave", "OnBeforeSave", "OnInit"]);
        const a = tag.attrs;
        if (belongs && relative && !excluded.has(tag.name) &&
            (a.TYPE || a.PROPERTY || a.MULTIPLE || a["FOREIGN-ARRAY"])) {
            let title = null;
            if (a.TITLE) {
                if (a.TITLE.startsWith("const=")) {
                    const key = a.TITLE.slice(6);
                    title = constants.get(key) ?? null;
                    if (title === null) missingTitles.add(key);
                } else {
                    title = a.TITLE;
                }
            }
            fields.push({
                path: relative,
                name: tag.name,
                title,
                type: a.TYPE ?? null,
                foreign_array: a["FOREIGN-ARRAY"] ?? null,
                multiple: a.MULTIPLE === "1",
                computed: a.PROPERTY === "1",
                indexed_in_xmd: a.INDEXED === "1"
            });
        }
        if (!tag.selfClosing) stack.push(tag.name);
    }
    if (stack.length || !formAttrs) throw new Error("Некорректная XML-форма: " + name);
    if (catalog && (formAttrs.CATALOG !== "1" || formAttrs["OBJECT-NAME"] !== name))
        throw new Error("Каталожная форма не совпадает с объектом " + name);
    return { fields, inherits, missingTitles: [...missingTitles] };
}

function enumEntries(common, enumName) {
    const xml = section(common, enumName);
    const elementName = xml.match(/<([A-Za-z_][\w-]*)>/)?.[1];
    if (!elementName) return [];
    const re = new RegExp("<" + elementName + ">([\\s\\S]*?)</" + elementName + ">", "g");
    return [...xml.matchAll(re)].map(row => ({ id: child(row[1], "id"), name: child(row[1], "name") }))
        .filter(x => x.id !== null && x.name !== null);
}

async function main() {
    const options = args(process.argv.slice(2));
    const read = name => fs.readFile(path.join(options.source, name), "utf8");
    const [common, constXml] = await Promise.all([read("wtv_common.xml"), read("text_const.xml")]);
    const constants = dictionary(constXml);
    const definitions = new Map();
    for (const item of section(common, "exchange_object_types").matchAll(/<exchange_object_type>([\s\S]*?)<\/exchange_object_type>/g))
        definitions.set(child(item[1], "name"), {
            name: child(item[1], "name"),
            title: child(item[1], "title"),
            web_title: child(item[1], "web_title"),
            display_field: child(item[1], "disp_name")
        });

    const source = { repository, commit: options.revision };
    const entities = [], enums = new Set(), warnings = [];
    await fs.mkdir(path.join(schemaDir, "entities"), { recursive: true });
    for (const name of options.objects) {
        const def = definitions.get(name);
        if (!def) throw new Error("Тип отсутствует в wtv_common.xml: " + name);
        const docFile = "wtv_" + name + ".xmd";
        const catFile = "wtv_" + name + "s.xmd";
        const [documentXml, catalogXml] = await Promise.all([read(docFile), read(catFile)]);
        const document = parseForm(documentXml, name, false, constants);
        const catalog = parseForm(catalogXml, name, true, constants);
        for (const field of [...document.fields, ...catalog.fields])
            if (/^common\.[a-z_]+$/.test(field.foreign_array ?? ""))
                enums.add(field.foreign_array.slice(7));
        for (const key of [...document.missingTitles, ...catalog.missingTitles])
            warnings.push(name + ": не найдена константа " + key);
        const data = {
            schema_version: 1, ...def, source,
            document: { table: name, form: docFile, fields: document.fields, inherits: document.inherits },
            catalog: { table: name + "s", form: catFile, fields: catalog.fields, inherits: catalog.inherits }
        };
        await fs.writeFile(path.join(schemaDir, "entities", name + ".json"), JSON.stringify(data, null, 2) + "\n");
        entities.push({ ...def, document: name, catalog: name + "s", file: "entities/" + name + ".json" });
    }
    await fs.writeFile(path.join(schemaDir, "index.json"),
        JSON.stringify({ schema_version: 1, source, entities }, null, 2) + "\n");
    const values = {};
    for (const name of [...enums].sort()) {
        try { values[name] = enumEntries(common, name); }
        catch { warnings.push("Не найдено перечисление common." + name); }
    }
    await fs.writeFile(path.join(schemaDir, "enums.json"),
        JSON.stringify({ schema_version: 1, source, values }, null, 2) + "\n");
    console.log("Создано карточек: " + entities.length + "; перечислений: " + Object.keys(values).length);
    for (const warning of warnings) console.warn("Предупреждение: " + warning);
}
main().catch(error => { console.error(error.stack ?? error); process.exitCode = 1; });
