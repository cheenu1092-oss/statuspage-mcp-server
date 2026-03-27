export interface Config {
  apiKey: string;
  pageId: string;
  baseUrl?: string;
  enableWrite?: boolean;
}

export function loadConfig(): Config {
  const apiKey = process.env.STATUSPAGE_API_KEY;
  const pageId = process.env.STATUSPAGE_PAGE_ID;
  const baseUrl = process.env.STATUSPAGE_BASE_URL || "https://api.statuspage.io/v1";
  const enableWrite = process.env.STATUSPAGE_ENABLE_WRITE === "true";

  if (!apiKey) {
    throw new Error("STATUSPAGE_API_KEY environment variable is required");
  }

  if (!pageId) {
    throw new Error("STATUSPAGE_PAGE_ID environment variable is required");
  }

  return {
    apiKey,
    pageId,
    baseUrl,
    enableWrite,
  };
}
