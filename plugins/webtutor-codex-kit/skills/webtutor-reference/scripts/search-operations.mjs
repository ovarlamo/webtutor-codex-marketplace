import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../references/core/operations");
function norm(value) {
    return String(value ?? "").toLocaleLowerCase("ru").replaceAll("ё", "е")
        .replace(/[_./-]+/g, " ").replace(/\s+/g, " ").trim();
}
async function main() {
    const args = process.argv.slice(2);
    const json = args.includes("--json");
    const query = norm(args.filter(x => x !== "--json").join(" "));
    if (!query) throw new Error("Укажите имя метода или фразу для поиска");
    const index = JSON.parse(await fs.readFile(path.join(root, "index.json"), "utf8"));
    const cards = [];
    for (const file of ["tools/activate_course_to_person.json", "tools/create_notification.json"]) {
        try { cards.push(JSON.parse(await fs.readFile(path.join(root, file), "utf8"))); }
        catch (err) { if (err.code !== "ENOENT") throw err; }
    }
    const terms = query.split(" ");
    const results = index.methods.flatMap(entry => {
        const card = cards.find(x => x.name === entry.name);
        const description = [entry.name, entry.method, entry.parameters.join(" "), card?.title,
            ...(card?.keywords ?? []), ...(card?.related_objects ?? [])].join(" ");
        if (!terms.every(term => norm(description).includes(term))) return [];
        return [{ ...entry, title: card?.title ?? null,
            details: card ? "tools/" + entry.method + ".json" : null,
            webtutor_version: index.source.webtutor_version }];
    }).sort((a, b) => Number(Boolean(b.title)) - Number(Boolean(a.title)) || a.name.localeCompare(b.name));
    if (json) { console.log(JSON.stringify(results, null, 2)); return; }
    if (!results.length) { console.log("Совпадений не найдено."); return; }
    for (const m of results.slice(0, 30))
        console.log(m.name + "(" + m.parameters.join(", ") + ")" +
            (m.title ? " — " + m.title : "") +
            " [" + m.source_file + ":" + m.source_line + "; WT " + m.webtutor_version + "]");
}
main().catch(error => { console.error(error.stack ?? error); process.exitCode = 1; });
