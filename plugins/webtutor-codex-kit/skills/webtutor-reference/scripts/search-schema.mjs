import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const schema = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../references/core/schema");

function normalize(value) {
    return String(value ?? "").toLocaleLowerCase("ru").replaceAll("ё", "е")
        .replace(/[_./\\-]+/g, " ").replace(/[^\p{L}\p{N}\s]+/gu, " ")
        .replace(/\s+/g, " ").trim();
}

function parse(argv) {
    const options = { text: [], limit: 20, json: false, entity: "", foreign: "" };
    for (let i = 0; i < argv.length; i++) {
        const arg = argv[i];
        if (arg === "--json") options.json = true;
        else if (arg === "--help") {
            console.log("node scripts/search-schema.mjs <термин> [--entity <объект>] [--foreign <каталог>] [--limit N] [--json]");
            process.exit(0);
        } else if (["--entity", "--foreign", "--limit"].includes(arg)) {
            if (!argv[i + 1]) throw new Error("Укажите значение для " + arg);
            options[arg.slice(2)] = argv[++i];
        } else if (arg.startsWith("--")) throw new Error("Неизвестная опция: " + arg);
        else options.text.push(arg);
    }
    options.limit = Number(options.limit);
    if (!Number.isInteger(options.limit) || options.limit < 1 || options.limit > 100)
        throw new Error("--limit должен быть от 1 до 100");
    if (!options.text.length && !options.entity && !options.foreign)
        throw new Error("Укажите строку поиска или фильтр");
    return options;
}

function match(value, words) {
    const text = normalize(value);
    return words.every(word => text.includes(word));
}

async function main() {
    const opts = parse(process.argv.slice(2));
    const index = JSON.parse(await fs.readFile(path.join(schema, "index.json"), "utf8"));
    const words = normalize(opts.text.join(" ")).split(" ").filter(Boolean);
    const results = [];
    for (const summary of index.entities) {
        if (opts.entity && ![summary.name, summary.document, summary.catalog].includes(opts.entity)) continue;
        const data = JSON.parse(await fs.readFile(path.join(schema, summary.file), "utf8"));
        const entityNames = [data.name, data.title, data.web_title, data.document.table, data.catalog.table];
        if (!opts.foreign && match(entityNames.join(" "), words)) {
            results.push({ kind: "entity", object: data.name, title: data.title,
                document: data.document.table, catalog: data.catalog.table, source: summary.file });
        }
        for (const part of ["catalog", "document"]) {
            for (const field of data[part].fields) {
                if (opts.foreign && field.foreign_array !== opts.foreign) continue;
                const terms = [field.name, field.title, field.path, data.title, data.name,
                    data[part].table, field.foreign_array].join(" ");
                if (!match(terms, words)) continue;
                results.push({ kind: "field", object: data.name, view: part,
                    table: data[part].table, path: field.path, name: field.name,
                    title: field.title, type: field.type, foreign_array: field.foreign_array,
                    source: data[part].form, computed: field.computed });
            }
        }
    }
    const sliced = results.slice(0, opts.limit);
    if (opts.json) console.log(JSON.stringify(sliced, null, 2));
    else if (!sliced.length) console.log("Совпадений не найдено.");
    else for (const item of sliced) {
        if (item.kind === "entity")
            console.log(item.title + " → " + item.document + " / " + item.catalog + " [" + item.source + "]");
        else console.log(item.table + "." + item.path + " — " + (item.title ?? "(нет подписи)") +
            " [" + (item.type ?? "без TYPE") + "; " + item.view + "]" +
            (item.foreign_array ? " → " + item.foreign_array : "") + " (" + item.source + ")");
    }
}
main().catch(error => { console.error(error.stack ?? error); process.exitCode = 1; });
