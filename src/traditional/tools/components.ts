import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { StatuspageClient } from "../../client.js";
import { Config } from "../../config.js";

export function registerComponentsTools(
  server: McpServer,
  client: StatuspageClient,
  config: Config
): void {
  const pageId = client.getPageId();

  // list_components
  server.registerTool(
    "list_components",
    {
      description: "List all components for the status page",
      inputSchema: {
        page_id: z
          .string()
          .optional()
          .describe("Page ID (uses configured page if omitted)"),
      },
    },
    async (args) => {
      const pid = args.page_id || pageId;
      const results = await client.get(`pages/${pid}/components`);
      return {
        content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
      };
    }
  );

  // get_component
  server.registerTool(
    "get_component",
    {
      description: "Get details of a specific component",
      inputSchema: {
        component_id: z.string().describe("Component ID"),
        page_id: z
          .string()
          .optional()
          .describe("Page ID (uses configured page if omitted)"),
      },
    },
    async (args) => {
      const pid = args.page_id || pageId;
      const result = await client.get(`pages/${pid}/components/${args.component_id}`);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // Write operations (gated by --enable-write)
  if (config.enableWrite) {
    // create_component
    server.registerTool(
      "create_component",
      {
        description: "Create a new component on the status page",
        inputSchema: {
          name: z.string().describe("Component name"),
          description: z.string().optional().describe("Component description"),
          status: z
            .enum([
              "operational",
              "under_maintenance",
              "degraded_performance",
              "partial_outage",
              "major_outage",
            ])
            .optional()
            .describe("Component status (default: operational)"),
          group_id: z.string().optional().describe("Component group ID"),
          page_id: z
            .string()
            .optional()
            .describe("Page ID (uses configured page if omitted)"),
        },
      },
      async (args) => {
        const pid = args.page_id || pageId;
        const body = {
          component: {
            name: args.name,
            description: args.description,
            status: args.status || "operational",
            group_id: args.group_id,
          },
        };

        const result = await client.post(`pages/${pid}/components`, body);
        return {
          content: [
            {
              type: "text",
              text: `Created component: ${JSON.stringify(result, null, 2)}`,
            },
          ],
        };
      }
    );

    // update_component
    server.registerTool(
      "update_component",
      {
        description: "Update an existing component",
        inputSchema: {
          component_id: z.string().describe("Component ID"),
          name: z.string().optional().describe("New component name"),
          description: z.string().optional().describe("New description"),
          status: z
            .enum([
              "operational",
              "under_maintenance",
              "degraded_performance",
              "partial_outage",
              "major_outage",
            ])
            .optional()
            .describe("New status"),
          page_id: z
            .string()
            .optional()
            .describe("Page ID (uses configured page if omitted)"),
        },
      },
      async (args) => {
        const pid = args.page_id || pageId;
        const body: Record<string, unknown> = { component: {} };
        const component = body.component as Record<string, unknown>;

        if (args.name !== undefined) component.name = args.name;
        if (args.description !== undefined) component.description = args.description;
        if (args.status !== undefined) component.status = args.status;

        if (Object.keys(component).length === 0) {
          throw new Error("At least one field must be provided for update");
        }

        const result = await client.patch(
          `pages/${pid}/components/${args.component_id}`,
          body
        );
        return {
          content: [
            {
              type: "text",
              text: `Updated component: ${JSON.stringify(result, null, 2)}`,
            },
          ],
        };
      }
    );

    // delete_component
    server.registerTool(
      "delete_component",
      {
        description: "Delete a component from the status page",
        inputSchema: {
          component_id: z.string().describe("Component ID"),
          page_id: z
            .string()
            .optional()
            .describe("Page ID (uses configured page if omitted)"),
        },
      },
      async (args) => {
        const pid = args.page_id || pageId;
        const result = await client.delete(`pages/${pid}/components/${args.component_id}`);
        return {
          content: [
            {
              type: "text",
              text: `Deleted component ${args.component_id}: ${JSON.stringify(result, null, 2)}`,
            },
          ],
        };
      }
    );

    // update_component_status
    server.registerTool(
      "update_component_status",
      {
        description: "Update the status of a component",
        inputSchema: {
          component_id: z.string().describe("Component ID"),
          status: z
            .enum([
              "operational",
              "under_maintenance",
              "degraded_performance",
              "partial_outage",
              "major_outage",
            ])
            .describe("New status"),
          page_id: z
            .string()
            .optional()
            .describe("Page ID (uses configured page if omitted)"),
        },
      },
      async (args) => {
        const pid = args.page_id || pageId;
        const body = {
          component: {
            status: args.status,
          },
        };

        const result = await client.patch(
          `pages/${pid}/components/${args.component_id}`,
          body
        );
        return {
          content: [
            {
              type: "text",
              text: `Updated component status: ${JSON.stringify(result, null, 2)}`,
            },
          ],
        };
      }
    );
  }
}
