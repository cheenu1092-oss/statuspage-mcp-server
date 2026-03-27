import { describe, it, expect } from "vitest";
import { StatuspageClient } from "../src/client";

describe("StatuspageClient", () => {
  it("should instantiate with config", () => {
    expect(() => {
      new StatuspageClient({
        apiKey: "test-key",
        pageId: "test-page",
        baseUrl: "https://api.statuspage.io/v1",
        enableWrite: false,
      });
    }).not.toThrow();
  });

  it("should return pageId", () => {
    const client = new StatuspageClient({
      apiKey: "test-key",
      pageId: "test-page-123",
      baseUrl: "https://api.statuspage.io/v1",
      enableWrite: false,
    });

    expect(client.getPageId()).toBe("test-page-123");
  });
});
