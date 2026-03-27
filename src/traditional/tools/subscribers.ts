import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { StatuspageClient } from "../../client.js";
import { Config } from "../../config.js";

export function registerSubscribersTools(
  server: McpServer,
  client: StatuspageClient,
  config: Config
): void {
  const pageId = client.getPageId();

  // list_subscribers
  server.registerTool(
    "list_subscribers",
    {
      description: "List all subscribers to the status page",
      inputSchema: {
        page_id: z
          .string()
          .optional()
          .describe("Page ID (uses configured page if omitted)"),
        limit: z.number().optional().describe("Maximum number of subscribers to return"),
      },
    },
    async (args) => {
      const pid = args.page_id || pageId;
      const params: Record<string, string> = {};
      if (args.limit) params.limit = args.limit.toString();

      const results = await client.get(`pages/${pid}/subscribers`, params);
      return {
        content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
      };
    }
  );

  // Write operations (gated by --enable-write)
  if (config.enableWrite) {
    // create_subscriber
    server.registerTool(
      "create_subscriber",
      {
        description: "Add a new subscriber to the status page",
        inputSchema: {
          email: z.string().describe("Subscriber email address"),
          component_ids: z
            .array(z.string())
            .optional()
            .describe("Specific components to subscribe to (subscribes to all if omitted)"),
          page_id: z
            .string()
            .optional()
            .describe("Page ID (uses configured page if omitted)"),
        },
      },
      async (args) => {
        const pid = args.page_id || pageId;
        const body = {
          subscriber: {
            email: args.email,
            component_ids: args.component_ids,
          },
        };

        const result = await client.post(`pages/${pid}/subscribers`, body);
        return {
          content: [
            {
              type: "text",
              text: `Created subscriber: ${JSON.stringify(result, null, 2)}`,
            },
          ],
        };
      }
    );

    // delete_subscriber
    server.registerTool(
      "delete_subscriber",
      {
        description: "Remove a subscriber from the status page",
        inputSchema: {
          subscriber_id: z.string().describe("Subscriber ID"),
          page_id: z
            .string()
            .optional()
            .describe("Page ID (uses configured page if omitted)"),
        },
      },
      async (args) => {
        const pid = args.page_id || pageId;
        const result = await client.delete(`pages/${pid}/subscribers/${args.subscriber_id}`);
        return {
          content: [
            {
              type: "text",
              text: `Deleted subscriber ${args.subscriber_id}: ${JSON.stringify(result, null, 2)}`,
            },
          ],
        };
      }
    );
  }
}
