#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { loadConfig } from "../config.js";
import { StatuspageClient } from "../client.js";
import { registerPagesTools } from "./tools/pages.js";
import { registerComponentsTools } from "./tools/components.js";
import { registerIncidentsTools } from "./tools/incidents.js";
import { registerSubscribersTools } from "./tools/subscribers.js";

const config = loadConfig();
const client = new StatuspageClient(config);

const server = new McpServer({
  name: "statuspage-mcp-server",
  version: "1.0.0",
});

// Register all tool categories
registerPagesTools(server, client, config);
registerComponentsTools(server, client, config);
registerIncidentsTools(server, client, config);
registerSubscribersTools(server, client, config);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Statuspage MCP server running on stdio");
  console.error(`Write operations: ${config.enableWrite ? "ENABLED" : "DISABLED"}`);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
