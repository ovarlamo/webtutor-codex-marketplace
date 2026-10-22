import fs from "node:fs/promises";
import path from "node:path";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const SERVER_NAME = "webtutor-codex-kit";
const SERVER_VERSION = "0.2.1";
const BRIDGE_VERSION = "1.1.0";
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

export async function findClientConfig(startDirectory = process.cwd()) {
  let currentDirectory = path.resolve(startDirectory);

  while (true) {
    const candidate = path.join(currentDirectory, CONFIG_FILE);
    if (await fileExists(candidate)) {
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

    const gitBoundary = path.join(currentDirectory, ".git");
    if (await fileExists(gitBoundary)) {
      break;
    }

    const parentDirectory = path.dirname(currentDirectory);
    if (parentDirectory === currentDirectory) {
      break;
    }
    currentDirectory = parentDirectory;
  }

  throw new Error(`${CONFIG_FILE} was not found from ${path.resolve(startDirectory)}`);
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

export async function callBridge(action, parameters = {}, startDirectory = process.cwd()) {
  try {
    const config = await findClientConfig(startDirectory);
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

server.registerTool(
  "webtutor_ping",
  {
    title: "Ping local WebTutor Bridge",
    description: "Check that the WebTutor Bridge configured by the active project responds.",
    inputSchema: {},
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      openWorldHint: false
    }
  },
  async () => toolResult(await callBridge("ping"))
);

server.registerTool(
  "webtutor_get_table_info",
  {
    title: "Get WebTutor table fields",
    description: "Read field names and SQL types for a WebTutor table.",
    inputSchema: {
      table_name: z.string().min(1)
    },
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      openWorldHint: false
    }
  },
  async ({ table_name }) => toolResult(await callBridge("get_table_info", { table_name }))
);

server.registerTool(
  "webtutor_get_object_info",
  {
    title: "Get WebTutor object XML",
    description: "Read TopElem.Xml for a WebTutor object while preserving its ID as a string.",
    inputSchema: {
      object_id: z.string().min(1)
    },
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      openWorldHint: false
    }
  },
  async ({ object_id }) => toolResult(await callBridge("get_object_info", { object_id }))
);

server.registerTool(
  "webtutor_run_agent_file",
  {
    title: "Run a WebTutor agent file",
    description: "Synchronously execute an agent file below the configured custom root's agents directory.",
    inputSchema: {
      agent_path: z.string().min(1)
    },
    annotations: {
      readOnlyHint: false,
      destructiveHint: true,
      openWorldHint: false
    }
  },
  async ({ agent_path }) => toolResult(await callBridge("run_agent_file", { agent_path }))
);

server.registerTool(
  "webtutor_run_script_file",
  {
    title: "Run a WebTutor project script file",
    description: "Synchronously execute a WebTutor script from a path relative to the active project root (for example web/agents/example.js or tools/inspect.js).",
    inputSchema: {
      relative_path: z.string().min(1)
    },
    annotations: {
      readOnlyHint: false,
      destructiveHint: true,
      openWorldHint: false
    }
  },
  async ({ relative_path }) => toolResult(await callBridge("run_script_file", { relative_path }))
);

const transport = new StdioServerTransport();
await server.connect(transport);
