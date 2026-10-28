import { beforeEach, describe, expect, it, vi } from "vitest";
import type { APIContext } from "astro";

const mockResolveApiKey = vi.fn();
const mockCheckApiPlan = vi.fn();
vi.mock("../../../lib/apiPlan", () => ({
  checkApiPlan: (...a: unknown[]) => mockCheckApiPlan(...a),
}));

vi.mock("../../../lib/apiKeys", () => ({
  resolveApiKey: (...a: unknown[]) => mockResolveApiKey(...a),
}));

const mockMaybeSingle = vi.fn();
const mockEq2 = vi.fn();
const mockEq1 = vi.fn();
const mockSelect = vi.fn();
const mockFrom = vi.fn();
const mockCreateServerClient = vi.fn();
vi.mock("../../../lib/supabase", () => ({
  createServerClient: () => mockCreateServerClient(),
}));

const mockSanitizeTempFeeds = vi.fn();
const mockSanitizeTempProbes = vi.fn();
vi.mock("../../../lib/tempFeedConfig", () => ({
  sanitizeTempFeeds: (...a: unknown[]) => mockSanitizeTempFeeds(...a),
  sanitizeTempProbes: (...a: unknown[]) => mockSanitizeTempProbes(...a),
}));

const mockSaveUserPullSetup = vi.fn();
vi.mock("../../../lib/userTempConfig", () => ({
  saveUserPullSetup: (...a: unknown[]) => mockSaveUserPullSetup(...a),
}));

function makeContext(options: {
  auth?: string | null;
  body?: unknown | string;
} = {}): APIContext {
  const headers = new Headers({ "Content-Type": "application/json" });
  if (options.auth !== null) {
    headers.set("Authorization", options.auth ?? "Bearer good-key");
  }
  const body =
    typeof options.body === "string"
      ? options.body
      : JSON.stringify(
          options.body ?? {
            feeds: [
              {
                id: "feed-1",
                name: "Garage",
                url: "https://example.com/temps",
                enabled: true,
              },
            ],
            probes: [{ key: "0", feedId: "feed-1", label: "North" }],
          },
        );
  return {
    request: new Request("https://example.com/api/v1/pull-setup", {
      method: "POST",
      headers,
      body,
    }),
  } as unknown as APIContext;
}

const sampleFeed = {
  id: "feed-1",
  name: "Garage",
  url: "https://example.com/temps",
  enabled: true,
  jsonRoot: "temp",
};

beforeEach(() => {
  mockCheckApiPlan.mockReset().mockResolvedValue({ ok: true, entitlements: { canCreateShareLinks: true, maxDevices: 24 } });
  mockResolveApiKey.mockReset().mockResolvedValue({ householdId: "house-1" });
  mockMaybeSingle.mockReset().mockResolvedValue({ data: { user_id: "owner-1" } });
  mockEq2.mockReset().mockReturnValue({ maybeSingle: mockMaybeSingle });
  mockEq1.mockReset().mockReturnValue({ eq: mockEq2 });
  mockSelect.mockReset().mockReturnValue({ eq: mockEq1 });
  mockFrom.mockReset().mockReturnValue({ select: mockSelect });
  mockCreateServerClient.mockReset().mockReturnValue({ from: mockFrom });
  mockSanitizeTempFeeds.mockReset().mockImplementation((feeds: unknown) => feeds);
  mockSanitizeTempProbes.mockReset().mockImplementation((probes: unknown) => probes);
  mockSaveUserPullSetup.mockReset().mockResolvedValue({
    error: null,
    discoveredProbes: 2,
  });
});

describe("POST /api/v1/pull-setup", () => {
  it("returns 401 without an Authorization header", async () => {
    const { POST } = await import("./pull-setup");

    const response = await POST(makeContext({ auth: null }));

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ ok: false, error: "Unauthorized" });
  });

  it("returns 401 for an invalid API key", async () => {
    mockResolveApiKey.mockResolvedValue(null);
    const { POST } = await import("./pull-setup");

    const response = await POST(makeContext());

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ ok: false, error: "Invalid API key" });
  });

  it("returns 400 for invalid JSON", async () => {
    const { POST } = await import("./pull-setup");

    const response = await POST(makeContext({ body: "not json" }));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ ok: false, error: "Invalid JSON" });
  });

  it("returns 400 when no valid feeds are provided", async () => {
    const { POST } = await import("./pull-setup");

    const response = await POST(makeContext({ body: { feeds: [] } }));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      ok: false,
      error: "No valid feeds provided.",
    });
  });

  it("saves the pull setup for the household owner", async () => {
    const { POST } = await import("./pull-setup");

    const response = await POST(makeContext());

    expect(mockSaveUserPullSetup).toHaveBeenCalledWith(
      "owner-1",
      expect.arrayContaining([expect.objectContaining({ url: "https://example.com/temps" })]),
      expect.any(Array),
    );
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true, discoveredProbes: 2 });
  });
});

describe("POST /api/v1/pull-setup plan check", () => {
  it("returns 403 and saves nothing after a downgrade", async () => {
    mockCheckApiPlan.mockResolvedValue({ ok: false, status: 403, error: "API access needs a Pro plan" });
    const { POST } = await import("./pull-setup");

    const response = await POST(makeContext());

    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({ ok: false, error: "API access needs a Pro plan" });
    expect(mockSaveUserPullSetup).not.toHaveBeenCalled();
  });
});
