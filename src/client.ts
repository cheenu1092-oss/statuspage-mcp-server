import { Config } from "./config.js";

export class StatuspageClient {
  private baseUrl: string;
  private apiKey: string;
  private pageId: string;

  constructor(config: Config) {
    this.baseUrl = config.baseUrl || "https://api.statuspage.io/v1";
    this.apiKey = config.apiKey;
    this.pageId = config.pageId;
  }

  async get(endpoint: string, params?: Record<string, string>): Promise<unknown> {
    const url = new URL(`${this.baseUrl}/${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Authorization": `OAuth ${this.apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Statuspage API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  async post(endpoint: string, body: unknown): Promise<unknown> {
    const url = `${this.baseUrl}/${endpoint}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `OAuth ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Statuspage API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  async patch(endpoint: string, body: unknown): Promise<unknown> {
    const url = `${this.baseUrl}/${endpoint}`;

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Authorization": `OAuth ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Statuspage API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  async delete(endpoint: string): Promise<unknown> {
    const url = `${this.baseUrl}/${endpoint}`;

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Authorization": `OAuth ${this.apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Statuspage API error: ${response.status} ${response.statusText}`);
    }

    // DELETE may return empty response
    const text = await response.text();
    return text ? JSON.parse(text) : {};
  }

  getPageId(): string {
    return this.pageId;
  }
}
