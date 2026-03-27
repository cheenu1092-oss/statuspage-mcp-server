import { describe, it, expect, beforeEach } from "vitest";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StatuspageClient } from "../src/client";
import { registerComponentsTools } from "../src/traditional/tools/components";

describe("Components Tools Registration", () => {
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
      registerComponentsTools(server, client, { apiKey: "test", pageId: "test", enableWrite: false });
    }).not.toThrow();
  });

  it("should register without errors in write mode", () => {
    expect(() => {
      registerComponentsTools(server, client, { apiKey: "test", pageId: "test", enableWrite: true });
    }).not.toThrow();
  });
});
