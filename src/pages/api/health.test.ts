import { beforeEach, describe, expect, it, vi } from "vitest";
import { pathRequiresAuth } from "../../lib/routeAuth";

const mockFetchAppStatusSummary = vi.fn();

vi.mock("../../lib/appStatus", () => ({
  fetchAppStatusSummary: (...a: unknown[]) => mockFetchAppStatusSummary(...a),
}));

async function callHealth(): Promise<Response> {
  const { GET } = await import("./health");
  return GET({} as Parameters<typeof GET>[0]) as Promise<Response>;
}

async function jsonOf(response: Response): Promise<Record<string, unknown>> {
  return (await response.json()) as Record<string, unknown>;
}

describe("GET /api/health", () => {
  beforeEach(() => {
    mockFetchAppStatusSummary.mockReset();
  });

  it("is public, so an external monitor can reach it", () => {
    expect(pathRequiresAuth("/api/health")).toBe(false);
  });

  it("returns 200 ok when history polls are current", async () => {
    mockFetchAppStatusSummary.mockResolvedValue({ healthy: true });
    const response = await callHealth();

    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    const body = await jsonOf(response);
    expect(body.status).toBe("ok");
    expect(Number.isNaN(Date.parse(String(body.checkedAt)))).toBe(false);
  });

  it("returns 503 stale when history polls are overdue", async () => {
    mockFetchAppStatusSummary.mockResolvedValue({ healthy: false });
    const response = await callHealth();

    expect(response.status).toBe(503);
    expect((await jsonOf(response)).status).toBe("stale");
  });

  it("returns 503 unknown when the status lookup fails", async () => {
    mockFetchAppStatusSummary.mockResolvedValue(null);
    const response = await callHealth();

    expect(response.status).toBe(503);
    expect((await jsonOf(response)).status).toBe("unknown");
  });

  it("does not expose job or user detail", async () => {
    mockFetchAppStatusSummary.mockResolvedValue({ healthy: true });
    const body = await jsonOf(await callHealth());

    expect(Object.keys(body).sort()).toEqual(["checkedAt", "status"]);
  });
});
