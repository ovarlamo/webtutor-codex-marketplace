import fs from "node:fs/promises";
import path from "node:path";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const SERVER_NAME = "webtutor-codex-kit";
const SERVER_VERSION = "0.2.3";
const BRIDGE_VERSION = "1.2.0";
const CONFIG_FILE = "webtutor-codex.json";
const REQUEST_TIMEOUT_MS = 10000;

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function findClientConfig(projectRoot) {
  const rawProjectRoot = String(projectRoot ?? "").trim();
  if (rawProjectRoot === "") {
    throw new Error("project_root is required");
  }
  if (!path.isAbsolute(rawProjectRoot)) {
    throw new Error("project_root must be an absolute path");
  }

  const resolvedProjectRoot = path.resolve(rawProjectRoot);
  const candidate = path.join(resolvedProjectRoot, CONFIG_FILE);
  if (!(await fileExists(candidate))) {
    throw new Error(`${CONFIG_FILE} was not found in project root ${resolvedProjectRoot}`);
  }

  const source = await fs.readFile(candidate, "utf8");
  const document = JSON.parse(source);
  const customRoot = String(document.custom_root ?? "").trim();
  const bridgeUrl = String(document.bridge_url ?? "").trim();

  if (customRoot === "") {
    throw new Error(`${candidate}: custom_root is required`);
  }
  if (bridgeUrl === "") {
    throw new Error(`${candidate}: bridge_url is required`);
  }

  return {
    path: candidate,
    baseUrl: String(document.base_url ?? "http://127.0.0.1").trim() || "http://127.0.0.1",
    customRoot,
    bridgeUrl
  };
}

function arrayValue(value) {
  if (Array.isArray(value)) {
    return value;
  }
  if (value === undefined || value === null || value === "") {
    return [];
  }
  return [value];
}

export function normalizeEnvelope(value) {
  const source = value !== null && typeof value === "object" ? value : {};
  const envelope = {
    ok: source.ok === true,
    bridge_version: String(source.bridge_version ?? BRIDGE_VERSION),
    errors: arrayValue(source.errors),
    logs: arrayValue(source.logs),
    assertions: arrayValue(source.assertions),
    result: source.result ?? {}
  };

  if (source.webtutor_version !== undefined && source.webtutor_version !== null && source.webtutor_version !== "") {
    envelope.webtutor_version = String(source.webtutor_version);
  }

  return envelope;
}

function errorEnvelope(error) {
  return normalizeEnvelope({
    ok: false,
    errors: [error instanceof Error ? error.message : String(error)]
  });
}

export async function callBridge(action, projectRoot, parameters = {}) {
  try {
    const config = await findClientConfig(projectRoot);
    const endpoint = new URL(config.bridgeUrl, config.baseUrl);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          action,
          custom_root: config.customRoot,
          ...parameters
        }),
        signal: controller.signal
      });
      const responseText = await response.text();
      let responseData;

      try {
        responseData = JSON.parse(responseText);
      } catch {
        throw new Error(`Bridge returned invalid JSON with HTTP ${response.status}`);
      }

      const envelope = normalizeEnvelope(responseData);
      if (!response.ok && envelope.errors.length === 0) {
        envelope.ok = false;
        envelope.errors.push(`Bridge returned HTTP ${response.status}`);
      }
      return envelope;
    } finally {
      clearTimeout(timeout);
    }
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return errorEnvelope(`Bridge request timed out after ${REQUEST_TIMEOUT_MS} ms`);
    }
    return errorEnvelope(error);
  }
}

function toolResult(envelope) {
  return {
    isError: envelope.ok !== true,
    structuredContent: envelope,
    content: [
      {
        type: "text",
        text: JSON.stringify(envelope, null, 2)
      }
    ]
  };
}

const server = new McpServer({
  name: SERVER_NAME,
  version: SERVER_VERSION
});

const projectRootSchema = z.string().min(1).describe(
  "Absolute path to the active client project root containing webtutor-codex.json."
);

server.registerTool(
  "webtutor_ping",
  {
    title: "Ping local WebTutor Bridge",
    description: "Check that the WebTutor Bridge configured by an explicit active project root responds.",
    inputSchema: {
      project_root: projectRootSchema
    },
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      openWorldHint: false
    }
  },
  async ({ project_root }) => toolResult(await callBridge("ping", project_root))
);

server.registerTool(
  "webtutor_get_table_info",
  {
    title: "Get WebTutor table fields",
    description: "Read field names and SQL types for a WebTutor table.",
    inputSchema: {
      project_root: projectRootSchema,
      table_name: z.string().min(1)
    },
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      openWorldHint: false
    }
  },
  async ({ project_root, table_name }) => toolResult(await callBridge("get_table_info", project_root, { table_name }))
);

server.registerTool(
  "webtutor_get_object_info",
  {
    title: "Get WebTutor object XML",
    description: "Read TopElem.Xml for a WebTutor object while preserving its ID as a string.",
    inputSchema: {
      project_root: projectRootSchema,
      object_id: z.string().min(1)
    },
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      openWorldHint: false
    }
  },
  async ({ project_root, object_id }) => toolResult(await callBridge("get_object_info", project_root, { object_id }))
);

server.registerTool(
  "webtutor_run_script_file",
  {
    title: "Run a WebTutor project script file",
    description: "Synchronously execute a WebTutor script from a path relative to the active project root (for example web/server_agents/example.js or tools/inspect.js).",
    inputSchema: {
      project_root: projectRootSchema,
      relative_path: z.string().min(1)
    },
    annotations: {
      readOnlyHint: false,
      destructiveHint: true,
      openWorldHint: false
    }
  },
  async ({ project_root, relative_path }) => toolResult(await callBridge("run_script_file", project_root, { relative_path }))
);

const transport = new StdioServerTransport();
await server.connect(transport);
