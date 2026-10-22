import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const skillRoot = path.resolve(scriptDirectory, "..");
const catalogPath = path.join(
    skillRoot,
    "references",
    "core",
    "webtutor-reference",
    "generated",
    "catalog.jsonl"
);

function usage() {
    return [
        "Локальный поиск по справочнику WebTutor / SP-XML.",
        "",
        "Использование:",
        "  node scripts/search-webtutor-reference.mjs <запрос> [параметры]",
        "",
        "Параметры:",
        "  --kind function|object  Ограничить тип карточки",
        "  --category <текст>      Ограничить категорию",
        "  --limit <1..50>         Число результатов, по умолчанию 10",
        "  --json                  Вывести JSON",
        "  --help                  Показать справку",
        "",
        "Примеры:",
        "  node scripts/search-webtutor-reference.mjs ArrayOptFind",
        "  node scripts/search-webtutor-reference.mjs \"XML документ\" --kind object",
    ].join("\n");
}

function parseArguments(argv) {
    const options = { category: "", kind: "", limit: 10, json: false, terms: [] };

    for (let index = 0; index < argv.length; index += 1) {
        const argument = argv[index];
        if (argument === "--help" || argument === "-h")
            return { ...options, help: true };
        if (argument === "--json") {
            options.json = true;
            continue;
        }
        if (argument === "--kind" || argument === "--category" || argument === "--limit") {
            const value = argv[index + 1];
            if (value == null || value.startsWith("--"))
                throw new Error(`Для ${argument} требуется значение`);
            index += 1;
            if (argument === "--kind")
                options.kind = value;
            else if (argument === "--category")
                options.category = value;
            else
                options.limit = Number(value);
            continue;
        }
        if (argument.startsWith("--"))
            throw new Error(`Неизвестный параметр: ${argument}`);
        options.terms.push(argument);
    }

    if (!["", "function", "object"].includes(options.kind))
        throw new Error("--kind принимает только function или object");
    if (!Number.isInteger(options.limit) || options.limit < 1 || options.limit > 50)
        throw new Error("--limit должен быть целым числом от 1 до 50");
    if (options.terms.length === 0)
        throw new Error("Не указан поисковый запрос");

    return options;
}

function normalize(value) {
    return String(value)
        .toLocaleLowerCase("ru")
        .replaceAll("ё", "е")
        .replace(/\(\)/g, "")
        .replace(/[_./\\-]+/g, " ")
        .replace(/[^\p{L}\p{N}\s]+/gu, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function scoreEntry(entry, rawQuery) {
    const query = normalize(rawQuery);
    const words = query.split(" ").filter(Boolean);
    const name = normalize(entry.name);
    const category = normalize(entry.category);
    const summary = normalize(entry.summary);
    const related = normalize((entry.related_entries ?? []).map((item) => item.name).join(" "));
    const haystack = `${name} ${category} ${summary} ${related}`;

    if (!words.every((word) => haystack.includes(word)))
        return -1;

    let score = 0;
    if (name === query)
        score += 1000;
    else if (name.startsWith(query))
        score += 700;
    else if (name.includes(query))
        score += 500;

    if (category === query)
        score += 250;
    else if (category.includes(query))
        score += 120;
    if (related.includes(query))
        score += 160;
    if (summary.includes(query))
        score += 80;

    for (const word of words) {
        if (name === word)
            score += 120;
        else if (name.startsWith(word))
            score += 80;
        else if (name.includes(word))
            score += 50;
        if (category.includes(word))
            score += 20;
        if (related.includes(word))
            score += 15;
        if (summary.includes(word))
            score += 5;
    }

    return score;
}

async function readCatalog() {
    const content = await fs.readFile(catalogPath, "utf8");
    return content
        .split(/\r?\n/)
        .filter((line) => line.trim() !== "")
        .map((line, index) => {
            try {
                return JSON.parse(line);
            }
            catch (error) {
                throw new Error(`Некорректный JSON в ${catalogPath}, строка ${index + 1}: ${error.message}`);
            }
        });
}

function printText(results) {
    if (results.length === 0) {
        process.stdout.write("Совпадений не найдено.\n");
        return;
    }

    for (const [index, result] of results.entries()) {
        const entry = result.entry;
        process.stdout.write(`${index + 1}. ${entry.name} [${entry.kind}; ${entry.category}]\n`);
        process.stdout.write(`   ${entry.summary}\n`);
        if ((entry.related_entries ?? []).length !== 0) {
            const visible = entry.related_entries.slice(0, 20).map((item) => item.name);
            const hiddenCount = entry.related_entries.length - visible.length;
            const suffix = hiddenCount > 0 ? `, … (+${hiddenCount})` : "";
            process.stdout.write(`   Связанные элементы: ${visible.join(", ")}${suffix}\n`);
        }
        process.stdout.write(`   ${entry.source_url}\n`);
    }
}

async function main() {
    let options;
    try {
        options = parseArguments(process.argv.slice(2));
    }
    catch (error) {
        process.stderr.write(`${error.message}\n\n${usage()}\n`);
        process.exitCode = 2;
        return;
    }

    if (options.help) {
        process.stdout.write(`${usage()}\n`);
        return;
    }

    const query = options.terms.join(" ");
    const categoryFilter = normalize(options.category);
    const entries = await readCatalog();
    const results = entries
        .filter((entry) => options.kind === "" || entry.kind === options.kind)
        .filter((entry) => categoryFilter === "" || normalize(entry.category).includes(categoryFilter))
        .map((entry) => ({ entry, score: scoreEntry(entry, query) }))
        .filter((result) => result.score >= 0)
        .sort((left, right) =>
            right.score - left.score ||
            left.entry.name.localeCompare(right.entry.name, "ru")
        )
        .slice(0, options.limit);

    if (options.json)
        process.stdout.write(`${JSON.stringify(results.map((result) => result.entry), null, 2)}\n`);
    else
        printText(results);
}

main().catch((error) => {
    process.stderr.write(`${error.stack ?? error}\n`);
    process.exitCode = 1;
});
