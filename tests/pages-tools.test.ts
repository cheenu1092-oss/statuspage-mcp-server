import { describe, it, expect, beforeEach } from "vitest";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StatuspageClient } from "../src/client";
import { registerPagesTools } from "../src/traditional/tools/pages";

describe("Pages Tools Registration", () => {
  let server: McpServer;
  let client: StatuspageClient;

  beforeEach(() => {
    server = new McpServer({
      name: "test-server",
      version: "1.0.0",
    });
    client = new StatuspageClient({
      apiKey: "test-key",
      pageId: "test-page",
      baseUrl: "https://api.statuspage.io/v1",
      enableWrite: false,
    });
  });

  it("should register without errors in read-only mode", () => {
    expect(() => {
      registerPagesTools(server, client, { apiKey: "test", pageId: "test", enableWrite: false });
    }).not.toThrow();
  });
});
