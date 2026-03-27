import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { StatuspageClient } from "../../client.js";
import { Config } from "../../config.js";

export function registerPagesTools(
  server: McpServer,
  client: StatuspageClient,
  config: Config
): void {
  // list_pages
  server.registerTool(
    "list_pages",
    {
      description: "List all status pages accessible with the API key",
      inputSchema: {},
    },
    async () => {
      const results = await client.get("pages");
      return {
        content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
      };
    }
  );

  // get_page
  server.registerTool(
    "get_page",
    {
      description: "Get details of a specific status page",
      inputSchema: {
        page_id: z
          .string()
          .optional()
          .describe("Page ID (uses configured page if omitted)"),
      },
    },
    async (args) => {
      const pageId = args.page_id || client.getPageId();
      const result = await client.get(`pages/${pageId}`);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
