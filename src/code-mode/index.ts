#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { loadConfig } from "../config.js";
import { StatuspageClient } from "../client.js";
import { executeApiCall } from "./executor.js";

const config = loadConfig();
const client = new StatuspageClient(config);

const server = new McpServer({
  name: "statuspage-mcp-server-code-mode",
  version: "1.0.0",
});

// Provide API schema as a resource
const apiSchema = {
  baseUrl: "https://api.statuspage.io/v1",
  authentication: "OAuth token via Authorization header",
  endpoints: {
    pages: {
      list: "GET /pages",
      get: "GET /pages/{page_id}",
    },
    components: {
      list: "GET /pages/{page_id}/components",
      get: "GET /pages/{page_id}/components/{component_id}",
      create: "POST /pages/{page_id}/components",
      update: "PATCH /pages/{page_id}/components/{component_id}",
      delete: "DELETE /pages/{page_id}/components/{component_id}",
    },
    incidents: {
      list: "GET /pages/{page_id}/incidents",
      get: "GET /pages/{page_id}/incidents/{incident_id}",
      create: "POST /pages/{page_id}/incidents",
      update: "PATCH /pages/{page_id}/incidents/{incident_id}",
      delete: "DELETE /pages/{page_id}/incidents/{incident_id}",
    },
    subscribers: {
      list: "GET /pages/{page_id}/subscribers",
      create: "POST /pages/{page_id}/subscribers",
      delete: "DELETE /pages/{page_id}/subscribers/{subscriber_id}",
    },
  },
  documentation: "https://developer.statuspage.io/",
};

server.resource(
  "statuspage-api-schema",
  "statuspage://schema",
  {
    description: "Statuspage API Schema with available endpoints",
    mimeType: "application/json",
  },
  async () => ({
    contents: [
      {
        uri: "statuspage://schema",
        mimeType: "application/json",
        text: JSON.stringify(apiSchema, null, 2),
      },
    ],
  })
);

// Single execute tool for all API calls
server.registerTool(
  "execute_api_call",
  {
    description: "Execute a raw Statuspage API call. See statuspage-api-schema resource for available endpoints.",
    inputSchema: {
      method: z.enum(["GET", "POST", "PATCH", "DELETE"]).describe("HTTP method"),
      endpoint: z.string().describe("API endpoint (e.g., pages/{page_id}/incidents)"),
      body: z.unknown().optional().describe("Request body for POST/PATCH"),
      params: z
        .record(z.string(), z.string())
        .optional()
        .describe("Query parameters for GET"),
    },
  },
  async (args) => {
    if (
      !config.enableWrite &&
      (args.method === "POST" || args.method === "PATCH" || args.method === "DELETE")
    ) {
      throw new Error(
        "Write operations are disabled. Set STATUSPAGE_ENABLE_WRITE=true to enable."
      );
    }

    const result = await executeApiCall(client, {
      method: args.method as "GET" | "POST" | "PATCH" | "DELETE",
      endpoint: args.endpoint as string,
      body: args.body,
      params: args.params as Record<string, string> | undefined,
    });

    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Statuspage MCP server (Code Mode) running on stdio");
  console.error(`Write operations: ${config.enableWrite ? "ENABLED" : "DISABLED"}`);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
