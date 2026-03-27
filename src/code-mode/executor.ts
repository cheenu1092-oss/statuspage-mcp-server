import { StatuspageClient } from "../client.js";

export interface ExecuteRequest {
  method: "GET" | "POST" | "PATCH" | "DELETE";
  endpoint: string;
  body?: unknown;
  params?: Record<string, string> | Record<string, unknown>;
}

export async function executeApiCall(
  client: StatuspageClient,
  request: ExecuteRequest
): Promise<unknown> {
  const { method, endpoint, body, params } = request;

  switch (method) {
    case "GET":
      return await client.get(endpoint, params as Record<string, string>);
    case "POST":
      return await client.post(endpoint, body);
    case "PATCH":
      return await client.patch(endpoint, body);
    case "DELETE":
      return await client.delete(endpoint);
    default:
      throw new Error(`Unsupported HTTP method: ${method}`);
  }
}
