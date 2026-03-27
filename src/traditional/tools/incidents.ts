import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { StatuspageClient } from "../../client.js";
import { Config } from "../../config.js";

export function registerIncidentsTools(
  server: McpServer,
  client: StatuspageClient,
  config: Config
): void {
  const pageId = client.getPageId();

  // list_incidents
  server.registerTool(
    "list_incidents",
    {
      description: "List incidents for the status page",
      inputSchema: {
        page_id: z
          .string()
          .optional()
          .describe("Page ID (uses configured page if omitted)"),
        limit: z.number().optional().describe("Maximum number of incidents to return"),
      },
    },
    async (args) => {
      const pid = args.page_id || pageId;
      const params: Record<string, string> = {};
      if (args.limit) params.limit = args.limit.toString();

      const results = await client.get(`pages/${pid}/incidents`, params);
      return {
        content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
      };
    }
  );

  // get_incident
  server.registerTool(
    "get_incident",
    {
      description: "Get details of a specific incident",
      inputSchema: {
        incident_id: z.string().describe("Incident ID"),
        page_id: z
          .string()
          .optional()
          .describe("Page ID (uses configured page if omitted)"),
      },
    },
    async (args) => {
      const pid = args.page_id || pageId;
      const result = await client.get(`pages/${pid}/incidents/${args.incident_id}`);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  // Write operations (gated by --enable-write)
  if (config.enableWrite) {
    // create_incident
    server.registerTool(
      "create_incident",
      {
        description: "Create a new incident on the status page",
        inputSchema: {
          name: z.string().describe("Incident name/title"),
          status: z
            .enum(["investigating", "identified", "monitoring", "resolved"])
            .describe("Incident status"),
          impact_override: z
            .enum(["none", "minor", "major", "critical"])
            .optional()
            .describe("Manual impact level (overrides automatic detection)"),
          body: z.string().optional().describe("Incident message body"),
          component_ids: z
            .array(z.string())
            .optional()
            .describe("List of affected component IDs"),
          components: z
            .record(z.enum([
              "operational",
              "degraded_performance",
              "partial_outage",
              "major_outage",
              "under_maintenance",
            ]))
            .optional()
            .describe("Component statuses (component_id: status)"),
          page_id: z
            .string()
            .optional()
            .describe("Page ID (uses configured page if omitted)"),
        },
      },
      async (args) => {
        const pid = args.page_id || pageId;
        const body = {
          incident: {
            name: args.name,
            status: args.status,
            impact_override: args.impact_override,
            body: args.body,
            component_ids: args.component_ids,
            components: args.components,
          },
        };

        const result = await client.post(`pages/${pid}/incidents`, body);
        return {
          content: [
            {
              type: "text",
              text: `Created incident: ${JSON.stringify(result, null, 2)}`,
            },
          ],
        };
      }
    );

    // update_incident
    server.registerTool(
      "update_incident",
      {
        description: "Update an existing incident (adds a new incident update)",
        inputSchema: {
          incident_id: z.string().describe("Incident ID"),
          status: z
            .enum(["investigating", "identified", "monitoring", "resolved"])
            .optional()
            .describe("New incident status"),
          body: z.string().describe("Update message body"),
          impact_override: z
            .enum(["none", "minor", "major", "critical"])
            .optional()
            .describe("New impact level"),
          component_ids: z
            .array(z.string())
            .optional()
            .describe("Updated list of affected component IDs"),
          components: z
            .record(z.enum([
              "operational",
              "degraded_performance",
              "partial_outage",
              "major_outage",
              "under_maintenance",
            ]))
            .optional()
            .describe("Updated component statuses"),
          page_id: z
            .string()
            .optional()
            .describe("Page ID (uses configured page if omitted)"),
        },
      },
      async (args) => {
        const pid = args.page_id || pageId;
        const body = {
          incident: {
            status: args.status,
            body: args.body,
            impact_override: args.impact_override,
            component_ids: args.component_ids,
            components: args.components,
          },
        };

        const result = await client.patch(
          `pages/${pid}/incidents/${args.incident_id}`,
          body
        );
        return {
          content: [
            {
              type: "text",
              text: `Updated incident: ${JSON.stringify(result, null, 2)}`,
            },
          ],
        };
      }
    );

    // delete_incident
    server.registerTool(
      "delete_incident",
      {
        description: "Delete an incident from the status page",
        inputSchema: {
          incident_id: z.string().describe("Incident ID"),
          page_id: z
            .string()
            .optional()
            .describe("Page ID (uses configured page if omitted)"),
        },
      },
      async (args) => {
        const pid = args.page_id || pageId;
        const result = await client.delete(`pages/${pid}/incidents/${args.incident_id}`);
        return {
          content: [
            {
              type: "text",
              text: `Deleted incident ${args.incident_id}: ${JSON.stringify(result, null, 2)}`,
            },
          ],
        };
      }
    );
  }
}
