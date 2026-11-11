import { beforeEach, describe, expect, it, vi } from "vitest";
import type { APIContext } from "astro";

const mockCheckEdgeRateLimit = vi.fn();
vi.mock("../../../../lib/edgeRateLimit", () => ({
  checkEdgeRateLimit: (...a: unknown[]) => mockCheckEdgeRateLimit(...a),
}));

const mockResolveShareToken = vi.fn();
vi.mock("../../../../lib/shareLinksStore", () => ({
  resolveShareToken: (...a: unknown[]) => mockResolveShareToken(...a),
}));

const mockFetchLatestSensorValues = vi.fn();
vi.mock("../../../../lib/sensorReadings", () => ({
  fetchLatestSensorValues: (...a: unknown[]) => mockFetchLatestSensorValues(...a),
}));

const mockListHouseholdDevices = vi.fn();
vi.mock("../../../../lib/devices", () => ({
  listHouseholdDevices: (...a: unknown[]) => mockListHouseholdDevices(...a),
}));

const mockBuildPrometheusText = vi.fn();
vi.mock("../../../../lib/prometheusMetrics", () => ({
  buildPrometheusText: (...a: unknown[]) => mockBuildPrometheusText(...a),
}));

const mockFetchHouseholdChartData = vi.fn();
vi.mock("../../../../lib/garageTempsHistory", () => ({
  fetchHouseholdChartData: (...a: unknown[]) => mockFetchHouseholdChartData(...a),
}));

const mockCheckShareReadingsRateLimit = vi.fn();
vi.mock("../../../../lib/shareReadingsLimits", () => ({
  checkShareReadingsRateLimit: (...a: unknown[]) =>
    mockCheckShareReadingsRateLimit(...a),
}));

const mockResolveShareReadingsFormat = vi.fn();
const mockShareScopeAllowsMetrics = vi.fn();
vi.mock("../../../../lib/shareReadingsAccess", () => ({
  resolveShareReadingsFormat: (...a: unknown[]) =>
    mockResolveShareReadingsFormat(...a),
  shareScopeAllowsMetrics: (...a: unknown[]) => mockShareScopeAllowsMetrics(...a),
}));

function makeContext(options: {
  token?: string;
  search?: string;
  clientAddress?: string;
} = {}): APIContext {
  const { token = "share-token-abc", search = "", clientAddress = "1.2.3.4" } =
    options;
  const url = new URL(
    `https://example.com/api/share/${token}/readings${search}`,
  );
  return {
    params: { token },
    request: new Request(url),
    url,
    clientAddress,
  } as unknown as APIContext;
}

beforeEach(() => {
  mockCheckEdgeRateLimit.mockReset().mockResolvedValue(null);
  mockCheckShareReadingsRateLimit.mockReset().mockReturnValue({ ok: true });
  mockResolveShareToken.mockReset().mockResolvedValue({
    id: "link-1",
    household_id: "house-1",
    scope: "live",
    label: "Live view",
    expires_at: null,
  });
  mockFetchLatestSensorValues.mockReset().mockResolvedValue([
    {
      deviceName: "Garage",
      sensor: {
        key: "0",
        label: "North",
        kind: "temperature",
        unit: "F",
        device_id: "d1",
      },
      value_num: 70,
      value_bool: null,
      value_text: null,
      recorded_at: "2024-01-01T00:00:00Z",
    },
  ]);
  mockListHouseholdDevices.mockReset().mockResolvedValue({
    devices: [
      {
        name: "Garage",
        last_seen_at: "2024-01-01T00:00:00Z",
        source: "pull",
        space: "garage",
      },
    ],
  });
  mockBuildPrometheusText.mockReset().mockResolvedValue("# HELP\n");
  mockFetchHouseholdChartData.mockReset().mockResolvedValue({ points: [] });
  mockResolveShareReadingsFormat.mockReset().mockReturnValue({
    ok: true,
    format: "json",
  });
  mockShareScopeAllowsMetrics.mockReset().mockReturnValue(false);
});

describe("GET /api/share/[token]/readings", () => {
  it("returns 400 when the token is missing", async () => {
    const { GET } = await import("./readings");

    const response = await GET(makeContext({ token: "" }));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "Missing token" });
  });

  it("returns 429 when rate limited", async () => {
    mockCheckShareReadingsRateLimit.mockReturnValue({
      ok: false,
      retryAfterSec: 15,
    });
    const { GET } = await import("./readings");

    const response = await GET(makeContext());

    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("15");
    expect(await response.json()).toEqual({ error: "Too many requests" });
  });

  it("returns 404 for an unknown share link", async () => {
    mockResolveShareToken.mockResolvedValue(null);
    const { GET } = await import("./readings");

    const response = await GET(makeContext());

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: "Invalid or expired link" });
  });

  it("returns 404 for an expired share link", async () => {
    mockResolveShareToken.mockResolvedValue({
      id: "link-1",
      household_id: "house-1",
      scope: "live",
      label: null,
      expires_at: "2020-01-01T00:00:00Z",
    });
    const { GET } = await import("./readings");

    const response = await GET(makeContext());

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: "Invalid or expired link" });
    expect(mockFetchLatestSensorValues).not.toHaveBeenCalled();
  });

  it("returns the format error when metrics formats are not allowed", async () => {
    mockResolveShareReadingsFormat.mockReturnValue({
      ok: false,
      status: 403,
      error: "This share link does not allow metrics formats",
    });
    const { GET } = await import("./readings");

    const response = await GET(makeContext({ search: "?format=prometheus" }));

    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({
      error: "This share link does not allow metrics formats",
    });
  });

  it("returns live readings JSON on the happy path", async () => {
    const { GET } = await import("./readings");

    const response = await GET(makeContext());

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      scope: "live",
      label: "Live view",
      expires_at: null,
      readings: [
        {
          device: "Garage",
          key: "0",
          label: "North",
          kind: "temperature",
          unit: "F",
          value_num: 70,
          value_bool: null,
          value_text: null,
          recorded_at: "2024-01-01T00:00:00Z",
        },
      ],
      devices: [
        {
          name: "Garage",
          last_seen_at: "2024-01-01T00:00:00Z",
          source: "pull",
          space: "garage",
        },
      ],
      history_points: [],
    });
  });

  describe("token lookup", () => {
    async function hash(v: string) {
      const { sha256Hex } = await import("../../../../lib/shareLinkTokens");
      return sha256Hex(v);
    }

    it("looks the token up by its hash, not the raw value", async () => {
      const { GET } = await import("./readings");

      const response = await GET(makeContext({ token: "some-token" }));

      expect(response.status).toBe(200);
      expect(mockResolveShareToken).toHaveBeenCalledTimes(1);
      expect(mockResolveShareToken).toHaveBeenCalledWith(await hash("some-token"));
    });

    it("never asks for a raw match, even for the old 48-hex shape", async () => {
      const legacy = "ab".repeat(24);
      const { GET } = await import("./readings");

      const response = await GET(makeContext({ token: legacy }));

      expect(response.status).toBe(200);
      expect(mockResolveShareToken).toHaveBeenCalledWith(await hash(legacy));
    });

    it("returns 404 for a token whose hash matches nothing (e.g. a stored hash)", async () => {
      mockResolveShareToken.mockResolvedValue(null);
      const stored = "cd".repeat(32);
      const { GET } = await import("./readings");

      const response = await GET(makeContext({ token: stored }));

      expect(response.status).toBe(404);
      expect(mockResolveShareToken).toHaveBeenCalledWith(await hash(stored));
    });
  });

  describe("Cloudflare rate limiter", () => {
    it("returns 429 with Retry-After when the edge limiter says no", async () => {
      mockCheckEdgeRateLimit.mockResolvedValue(false);
      const { GET } = await import("./readings");

      const response = await GET(makeContext());

      expect(response.status).toBe(429);
      expect(response.headers.get("Retry-After")).toBe("60");
      expect(mockCheckEdgeRateLimit).toHaveBeenCalledWith("SHARE_READINGS_RATE_LIMITER", expect.any(String));
      expect(mockCheckShareReadingsRateLimit).not.toHaveBeenCalled();
    });

    it("falls back to the in-memory limit when the binding isn't available", async () => {
      mockCheckEdgeRateLimit.mockResolvedValue(null);
      const { GET } = await import("./readings");

      await GET(makeContext());

      expect(mockCheckShareReadingsRateLimit).toHaveBeenCalled();
    });
  });
});
