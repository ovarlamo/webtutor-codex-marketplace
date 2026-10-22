import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, "..");
const releaseMode = process.argv.includes("--release");
const errors = [];
const warnings = [];

const expectedPluginName = "webtutor-codex-kit";
const expectedVersion = "0.2.0";
const expectedSourcePath = "./plugins/webtutor-codex-kit";
const expectedSkills = [
  "webtutor-reference",
  "webtutor-development",
  "webtutor-sql-report",
  "webtutor-troubleshooting"
];

function fail(message) {
  errors.push(message);
}

function warn(message) {
  warnings.push(message);
}

function relativePath(absolutePath) {
  return path.relative(rootDir, absolutePath).split(path.sep).join("/");
}

function requireFile(relativeFile) {
  const absoluteFile = path.join(rootDir, relativeFile);
  if (!fs.existsSync(absoluteFile) || !fs.statSync(absoluteFile).isFile()) {
    fail(`Missing required file: ${relativeFile}`);
  }
  return absoluteFile;
}

function readJson(relativeFile) {
  const absoluteFile = requireFile(relativeFile);
  if (!fs.existsSync(absoluteFile)) {
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(absoluteFile, "utf8"));
  } catch (error) {
    fail(`Invalid JSON in ${relativeFile}: ${error.message}`);
    return null;
  }

}

function assertCondition(condition, message) {
  if (!condition) {
    fail(message);
  }
}

function walkFiles(directory) {
  if (!fs.existsSync(directory)) {
    return [];
  }
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkFiles(entryPath));
    } else if (entry.isFile()) {
      files.push(entryPath);
    }
  }
  return files;
}

function isPathInside(rootDirectory, candidatePath) {
  const relative = path.relative(rootDirectory, candidatePath);
  return relative === "" || (
    relative !== ".." &&
    !relative.startsWith(`..${path.sep}`) &&
    !path.isAbsolute(relative)
  );
}

function maskMarkdownCode(contents) {
  const lines = contents.match(/.*(?:\r?\n|$)/g) ?? [];
  let fenceCharacter = null;
  let fenceLength = 0;
  const withoutFences = lines.map((line) => {
    const fence = line.match(/^[ \t]{0,3}(`{3,}|~{3,})/);
    if (fenceCharacter === null && fence !== null) {
      fenceCharacter = fence[1][0];
      fenceLength = fence[1].length;
      return line.replace(/[^\r\n]/g, " ");
    }
    if (fenceCharacter !== null) {
      const closingFence = new RegExp(`^[ \\t]{0,3}${fenceCharacter}{${fenceLength},}[ \\t]*(?:\\r?\\n)?$`);
      if (closingFence.test(line)) {
        fenceCharacter = null;
        fenceLength = 0;
      }
      return line.replace(/[^\r\n]/g, " ");
    }
    return line;
  }).join("");

  return withoutFences.replace(/(`+)([^`]*?)\1/g, (match) => match.replace(/[^\r\n]/g, " "));
}

function markdownLineNumber(contents, index) {
  return contents.slice(0, index).split(/\r?\n/).length;
}

function markdownDestinations(contents) {
  const searchable = maskMarkdownCode(contents);
  const destinations = [];
  const inlineLink = /!?\[[^\]\r\n]*\]\(\s*(<[^>\r\n]+>|(?:\\.|[^()\s]|\([^()\r\n]*\))+)(?:\s+(?:"[^"\r\n]*"|'[^'\r\n]*'|\([^\)\r\n]*\)))?\s*\)/g;
  const referenceDefinition = /^[ \t]{0,3}\[[^\]\r\n]+\]:[ \t]*(<[^>\r\n]+>|(?:\\.|[^\s])+)/gm;

  for (const pattern of [inlineLink, referenceDefinition]) {
    for (const match of searchable.matchAll(pattern)) {
      destinations.push({ raw: match[1], index: match.index ?? 0 });
    }
  }
  return destinations;
}

function isTemplatePlaceholder(rawDestination) {
  if (/\{\{[^{}]+\}\}|\$\{[^{}]+\}|\{[^{}]+\}|%[A-Za-z_][A-Za-z0-9_]*%|\[[A-Z][A-Z0-9_-]*\]/.test(rawDestination)) {
    return true;
  }
  const anglePlaceholders = [...rawDestination.matchAll(/<([^<>]+)>/g)];
  if (anglePlaceholders.length === 0) {
    return false;
  }
  const singleAngleWrappedPath = anglePlaceholders.length === 1 &&
    anglePlaceholders[0][0] === rawDestination &&
    /[.\\/]/.test(anglePlaceholders[0][1]);
  return !singleAngleWrappedPath;
}

function normalizeLocalDestination(rawDestination, location) {
  let destination = rawDestination.trim();
  if (isTemplatePlaceholder(destination)) {
    return null;
  }
  if (destination.startsWith("<") && destination.endsWith(">")) {
    destination = destination.slice(1, -1).trim();
  }
  if (destination === "" || destination.startsWith("#") || /^(?:https?:|mailto:)/i.test(destination)) {
    return null;
  }

  const pathPart = destination.split(/[?#]/, 1)[0].replace(/\\([\\() ])/g, "$1");
  if (pathPart === "" || isTemplatePlaceholder(pathPart)) {
    return null;
  }
  try {
    return decodeURI(pathPart);
  } catch (error) {
    fail(`${location}: invalid URL encoding in Markdown destination ${rawDestination}: ${error.message}`);
    return null;
  }
}

function validateExistingLocalPath(baseDirectory, rawPath, location, containmentRoot = baseDirectory) {
  if (typeof rawPath !== "string" || rawPath.trim() === "") {
    fail(`${location}: local path must be a non-empty string`);
    return;
  }
  if (/^(?:https?:|mailto:)/i.test(rawPath) || isTemplatePlaceholder(rawPath)) {
    return;
  }

  const localPath = rawPath.split(/[?#]/, 1)[0];
  if (path.isAbsolute(localPath)) {
    fail(`${location}: local path must be relative: ${rawPath}`);
    return;
  }
  const resolvedPath = path.resolve(baseDirectory, localPath);
  if (!isPathInside(containmentRoot, resolvedPath)) {
    fail(`${location}: local path escapes ${relativePath(containmentRoot)}: ${rawPath}`);
    return;
  }
  if (!fs.existsSync(resolvedPath)) {
    fail(`${location}: local path does not exist: ${rawPath}`);
    return;
  }

  const realRoot = fs.realpathSync(containmentRoot);
  const realTarget = fs.realpathSync(resolvedPath);
  assertCondition(isPathInside(realRoot, realTarget), `${location}: local path resolves outside ${relativePath(containmentRoot)}: ${rawPath}`);
}

function validateMarkdownLinks(pluginDirectory) {
  if (!fs.existsSync(pluginDirectory) || !fs.statSync(pluginDirectory).isDirectory()) {
    fail(`Missing plugin directory: ${relativePath(pluginDirectory)}`);
    return;
  }
  const realPluginDirectory = fs.realpathSync(pluginDirectory);
  for (const markdownFile of walkFiles(pluginDirectory).filter((file) => file.toLowerCase().endsWith(".md"))) {
    const contents = fs.readFileSync(markdownFile, "utf8");
    for (const link of markdownDestinations(contents)) {
      const location = `${relativePath(markdownFile)}:${markdownLineNumber(contents, link.index)}`;
      const destination = normalizeLocalDestination(link.raw, location);
      if (destination === null) {
        continue;
      }
      if (path.isAbsolute(destination)) {
        fail(`${location}: Markdown link must be relative to the plugin: ${link.raw}`);
        continue;
      }

      const target = path.resolve(path.dirname(markdownFile), destination);
      if (!isPathInside(pluginDirectory, target)) {
        fail(`${location}: Markdown link escapes the plugin root: ${link.raw}`);
        continue;
      }
      if (!fs.existsSync(target)) {
        fail(`${location}: Markdown link target does not exist: ${link.raw}`);
        continue;
      }
      const realTarget = fs.realpathSync(target);
      assertCondition(isPathInside(realPluginDirectory, realTarget), `${location}: Markdown link resolves outside the plugin root: ${link.raw}`);
    }
  }
}

function validateReferenceCatalog(webtutorReferenceRoot) {
  const catalogFile = path.join(webtutorReferenceRoot, "generated", "catalog.jsonl");
  const manifestFile = path.join(webtutorReferenceRoot, "generated", "manifest.json");
  const manifest = readJson(relativePath(manifestFile));
  requireFile(relativePath(catalogFile));
  if (manifest === null || !fs.existsSync(catalogFile)) {
    if (manifest === null && fs.existsSync(manifestFile) && fs.readFileSync(manifestFile, "utf8").trim() === "null") {
      fail(`${relativePath(manifestFile)}: manifest must be a JSON object`);
    }
    return;
  }
  if (typeof manifest !== "object" || Array.isArray(manifest)) {
    fail(`${relativePath(manifestFile)}: manifest must be a JSON object`);
    return;
  }

  const catalogLines = fs.readFileSync(catalogFile, "utf8").split(/\r?\n/);
  const entries = [];
  let recordCount = 0;
  for (const [lineIndex, line] of catalogLines.entries()) {
    if (line.trim() === "") {
      continue;
    }
    recordCount += 1;
    try {
      const entry = JSON.parse(line);
      assertCondition(entry !== null && typeof entry === "object" && !Array.isArray(entry), `${relativePath(catalogFile)}:${lineIndex + 1}: entry must be a JSON object`);
      if (entry !== null && typeof entry === "object" && !Array.isArray(entry)) {
        entries.push({ entry, line: lineIndex + 1 });
      }
    } catch (error) {
      fail(`${relativePath(catalogFile)}:${lineIndex + 1}: invalid JSON: ${error.message}`);
    }
  }

  assertCondition(Number.isInteger(manifest.entries) && manifest.entries >= 0, `${relativePath(manifestFile)}: entries must be a non-negative integer`);
  if (Number.isInteger(manifest.entries)) {
    assertCondition(manifest.entries === recordCount, `${relativePath(manifestFile)}: entries (${manifest.entries}) must equal catalog records (${recordCount})`);
  }

  assertCondition(Array.isArray(manifest.files), `${relativePath(manifestFile)}: files must be an array`);
  if (Array.isArray(manifest.files)) {
    for (const [index, file] of manifest.files.entries()) {
      validateExistingLocalPath(webtutorReferenceRoot, file, `${relativePath(manifestFile)}: files[${index}]`, webtutorReferenceRoot);
    }
  }

  for (const { entry, line } of entries) {
    for (const field of ["source_path", "file"]) {
      if (!Object.hasOwn(entry, field)) {
        continue;
      }
      const values = Array.isArray(entry[field]) ? entry[field] : [entry[field]];
      for (const [index, value] of values.entries()) {
        const suffix = values.length === 1 ? field : `${field}[${index}]`;
        validateExistingLocalPath(webtutorReferenceRoot, value, `${relativePath(catalogFile)}:${line}: ${suffix}`, webtutorReferenceRoot);
      }
    }
  }
}

function validateEvalFile(relativeFile, knownCaseIds) {
  const document = readJson(relativeFile);
  if (document === null) {
    return;
  }
  assertCondition(document.schema_version === 1, `${relativeFile}: schema_version must be 1`);
  assertCondition(Array.isArray(document.cases) && document.cases.length > 0, `${relativeFile}: cases must be a non-empty array`);
  if (!Array.isArray(document.cases)) {
    return;
  }
  for (const [index, testCase] of document.cases.entries()) {
    const location = `${relativeFile}: cases[${index}]`;
    assertCondition(typeof testCase.id === "string" && testCase.id.length > 0, `${location}: id is required`);
    if (typeof testCase.id === "string") {
      assertCondition(!knownCaseIds.has(testCase.id), `${location}: duplicate id ${testCase.id}`);
      knownCaseIds.add(testCase.id);
    }
    assertCondition(typeof testCase.prompt === "string" && testCase.prompt.length > 0, `${location}: prompt is required`);
    assertCondition(typeof testCase.should_activate_plugin === "boolean", `${location}: should_activate_plugin must be boolean`);
    assertCondition(
      testCase.expected_primary_skill === null || expectedSkills.includes(testCase.expected_primary_skill),
      `${location}: expected_primary_skill must be null or a known skill`
    );
    assertCondition(Array.isArray(testCase.expected_supporting_skills), `${location}: expected_supporting_skills must be an array`);
    if (Array.isArray(testCase.expected_supporting_skills)) {
      for (const skillName of testCase.expected_supporting_skills) {
        assertCondition(expectedSkills.includes(skillName), `${location}: unknown supporting skill ${skillName}`);
      }
    }
    assertCondition(typeof testCase.expected_behavior === "string" && testCase.expected_behavior.length > 0, `${location}: expected_behavior is required`);
  }
}

function validateSkill(skillName, skillsDir) {
  const skillDir = path.join(skillsDir, skillName);
  const skillFile = path.join(skillDir, "SKILL.md");
  if (!fs.existsSync(skillFile)) {
    fail(`Missing expected skill: ${skillName}/SKILL.md`);
    return;
  }
  const contents = fs.readFileSync(skillFile, "utf8");
  const frontmatter = contents.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (frontmatter === null) {
    fail(`${relativePath(skillFile)}: missing YAML frontmatter`);
    return;
  }
  const nameMatch = frontmatter[1].match(/^name:\s*["']?([^"'\r\n]+)["']?\s*$/m);
  const descriptionMatch = frontmatter[1].match(/^description:\s*["']?([^\r\n]+)["']?\s*$/m);
  assertCondition(nameMatch !== null, `${relativePath(skillFile)}: frontmatter name is required`);
  if (nameMatch !== null) {
    assertCondition(nameMatch[1].trim() === skillName, `${relativePath(skillFile)}: name must equal ${skillName}`);
  }
  assertCondition(descriptionMatch !== null && descriptionMatch[1].trim().length > 0, `${relativePath(skillFile)}: description is required`);
  assertCondition(!contents.includes("../"), `${relativePath(skillFile)}: parent-directory references are not allowed`);

  const referencePattern = /references\/[A-Za-z0-9._/-]+\.(?:md|json|txt|xml|js|mjs)/g;
  for (const reference of contents.match(referencePattern) ?? []) {
    const target = path.resolve(skillDir, reference);
    assertCondition(target.startsWith(`${skillDir}${path.sep}`), `${relativePath(skillFile)}: reference escapes the skill directory: ${reference}`);
    assertCondition(fs.existsSync(target), `${relativePath(skillFile)}: missing referenced file ${reference}`);
  }
}

const requiredInfrastructure = [
  "AGENTS.md",
  "README.md",
  "CHANGELOG.md",
  "package.json",
  ".agents/plugins/marketplace.json",
  "docs/migration-roadmap.md",
  "scripts/validate-plugin.mjs",
  "evals/activation.json",
  "evals/boundaries.json",
  "evals/isolation.json",
  "plugins/webtutor-codex-kit/plugin.json",
  "plugins/webtutor-codex-kit/mcp.json",
  "plugins/webtutor-codex-kit/server/index.mjs",
  "plugins/webtutor-codex-kit/bridge/api.asp.template",
  "plugins/webtutor-codex-kit/README.md",
  "plugins/webtutor-codex-kit/CHANGELOG.md",
  "docs/mcp-bridge-mvp.md"
];

for (const requiredFile of requiredInfrastructure) {
  requireFile(requiredFile);
}

const packageDocument = readJson("package.json");
const pluginDocument = readJson("plugins/webtutor-codex-kit/plugin.json");
const mcpDocument = readJson("plugins/webtutor-codex-kit/mcp.json");
const marketplaceDocument = readJson(".agents/plugins/marketplace.json");

if (packageDocument !== null) {
  assertCondition(packageDocument.private === true, "package.json: private must be true");
  assertCondition(packageDocument.type === "module", "package.json: type must be module");
  assertCondition(packageDocument.version === expectedVersion, `package.json: version must be ${expectedVersion}`);
  assertCondition(Object.keys(packageDocument.dependencies ?? {}).length === 0, "package.json: runtime dependencies are not allowed; bundle the MCP server");
  assertCondition(typeof packageDocument.scripts?.["build:mcp"] === "string", "package.json: build:mcp script is required");
  assertCondition(typeof packageDocument.devDependencies?.["@modelcontextprotocol/sdk"] === "string", "package.json: MCP SDK build dependency is required");
  assertCondition(typeof packageDocument.devDependencies?.esbuild === "string", "package.json: esbuild build dependency is required");
  assertCondition(typeof packageDocument.devDependencies?.zod === "string", "package.json: zod build dependency is required");
}

if (pluginDocument !== null) {
  assertCondition(pluginDocument.$schema === "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json", "plugin.json: unexpected portable schema");
  assertCondition(pluginDocument.name === expectedPluginName, `plugin.json: name must be ${expectedPluginName}`);
  assertCondition(pluginDocument.version === expectedVersion, `plugin.json: version must be ${expectedVersion}`);
  assertCondition(/^\d+\.\d+\.\d+$/.test(pluginDocument.version ?? ""), "plugin.json: version must be semantic x.y.z");
  assertCondition(typeof pluginDocument.description === "string" && pluginDocument.description.length > 0, "plugin.json: description is required");
  assertCondition(pluginDocument.extensions?.["com.openai"]?.requires_local_executor === true, "plugin.json: extensions.com.openai.requires_local_executor must be true");
  assertCondition(pluginDocument.skills === undefined, "plugin.json: portable packages discover root skills automatically; omit skills");
}

if (mcpDocument !== null) {
  assertCondition(mcpDocument.$schema === "https://agent-plugins.org/schemas/1.0.0/mcp.schema.json", "mcp.json: unexpected portable schema");
  const serverEntries = Object.entries(mcpDocument.mcpServers ?? {});
  assertCondition(serverEntries.length === 1, "mcp.json: exactly one MCP server is required");
  if (serverEntries.length === 1) {
    const [serverName, serverConfig] = serverEntries[0];
    assertCondition(serverName === "webtutor", "mcp.json: server name must be webtutor");
    assertCondition(serverConfig?.type === "stdio", "mcp.json: server type must be stdio");
    assertCondition(serverConfig?.command === "node", "mcp.json: server command must be node");
    assertCondition(Array.isArray(serverConfig?.args) && serverConfig.args.length === 1 && serverConfig.args[0] === "${PLUGIN_ROOT}/server/index.mjs", "mcp.json: server args must point to the bundled runtime");
    assertCondition(serverConfig?.cwd === undefined, "mcp.json: omit cwd so the active project working directory is inherited");
  }
}

if (marketplaceDocument !== null) {
  assertCondition(marketplaceDocument.name === "webtutor-codex-marketplace", "marketplace.json: unexpected marketplace name");
  assertCondition(Array.isArray(marketplaceDocument.plugins) && marketplaceDocument.plugins.length === 1, "marketplace.json: exactly one plugin entry is required for v0.1");
  const entry = marketplaceDocument.plugins?.[0];
  if (entry !== undefined) {
    assertCondition(entry.name === expectedPluginName, `marketplace.json: plugin name must be ${expectedPluginName}`);
    assertCondition(entry.source?.source === "local", "marketplace.json: source.source must be local");
    assertCondition(entry.source?.path === expectedSourcePath, `marketplace.json: source.path must be ${expectedSourcePath}`);
    assertCondition(entry.policy?.installation === "AVAILABLE", "marketplace.json: installation policy must be AVAILABLE");
    assertCondition(entry.policy?.authentication === "ON_INSTALL", "marketplace.json: authentication policy must be ON_INSTALL");
    assertCondition(typeof entry.category === "string" && entry.category.length > 0, "marketplace.json: category is required");
    const resolvedSource = path.resolve(rootDir, entry.source?.path ?? "");
    assertCondition(resolvedSource === path.join(rootDir, "plugins", expectedPluginName), "marketplace.json: source.path resolves outside the expected plugin root");
  }
}

const knownCaseIds = new Set();
validateEvalFile("evals/activation.json", knownCaseIds);
validateEvalFile("evals/boundaries.json", knownCaseIds);
validateEvalFile("evals/isolation.json", knownCaseIds);

const pluginDir = path.join(rootDir, "plugins", expectedPluginName);
const forbiddenEntries = [".app.json", "hooks", ".codex-plugin"];
for (const entry of forbiddenEntries) {
  assertCondition(!fs.existsSync(path.join(pluginDir, entry)), `v0.2 does not allow ${entry}`);
}

for (const file of walkFiles(pluginDir)) {
  const pathParts = relativePath(file).split("/");
  for (const part of pathParts) {
    assertCondition(/^[\x00-\x7F]+$/.test(part), `Non-ASCII package path: ${relativePath(file)}`);
  }
  if (/\.(?:md|json|js|mjs|txt|xml|asp|template)$/i.test(file)) {
    const contents = fs.readFileSync(file, "utf8");
    assertCondition(!contents.includes("/tmx_custom"), `${relativePath(file)}: client custom root must not be packaged`);
    assertCondition(!contents.includes("/rs_custom"), `${relativePath(file)}: pilot custom root must not be packaged`);
    assertCondition(!contents.includes("D:\\WS\\WT"), `${relativePath(file)}: absolute workstation path must not be packaged`);
  }
}

const bridgeTemplate = path.join(pluginDir, "bridge", "api.asp.template");
if (fs.existsSync(bridgeTemplate)) {
  const bridgeBytes = fs.readFileSync(bridgeTemplate);
  assertCondition(
    bridgeBytes.length >= 3 && bridgeBytes[0] === 0xef && bridgeBytes[1] === 0xbb && bridgeBytes[2] === 0xbf,
    `${relativePath(bridgeTemplate)}: UTF-8 BOM is required`
  );
}

validateMarkdownLinks(pluginDir);
const webtutorReferenceRoot = path.join(
  pluginDir,
  "skills",
  "webtutor-reference",
  "references",
  "core",
  "webtutor-reference"
);
validateReferenceCatalog(webtutorReferenceRoot);

const skillsDir = path.join(pluginDir, "skills");
if (!fs.existsSync(skillsDir)) {
  fail("The package requires the skills directory");
} else {
  for (const skillName of expectedSkills) {
    validateSkill(skillName, skillsDir);
  }
  const discoveredSkills = fs.readdirSync(skillsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  const unexpectedSkills = discoveredSkills.filter((skillName) => !expectedSkills.includes(skillName));
  assertCondition(unexpectedSkills.length === 0, `Unexpected skill directories: ${unexpectedSkills.join(", ")}`);
}

for (const message of warnings) {
  process.stderr.write(`WARNING: ${message}\n`);
}

if (errors.length > 0) {
  for (const message of errors) {
    process.stderr.write(`ERROR: ${message}\n`);
  }
  process.stderr.write(`Validation failed with ${errors.length} error(s).\n`);
  process.exitCode = 1;
} else {
  const mode = releaseMode ? "release" : "package";
  process.stdout.write(`Validation passed in ${mode} mode.\n`);
}
