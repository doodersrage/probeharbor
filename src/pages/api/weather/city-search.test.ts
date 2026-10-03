import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { APIContext } from "astro";

const mockCheckWeatherSearchRateLimit = vi.fn();
vi.mock("../../../lib/weatherSearchLimits", () => ({
  checkWeatherSearchRateLimit: (...a: unknown[]) => mockCheckWeatherSearchRateLimit(...a),
}));

const mockNormalizeGeocodeResults = vi.fn();
vi.mock("../../../lib/weatherCities", () => ({
  normalizeGeocodeResults: (...a: unknown[]) => mockNormalizeGeocodeResults(...a),
}));

const mockGetOpenWeatherApiKey = vi.fn();
vi.mock("../../../lib/FetchWeather", () => ({
  getOpenWeatherApiKey: () => mockGetOpenWeatherApiKey(),
}));

function makeContext(q: string | null, clientAddress = "1.2.3.4"): APIContext {
  const url = new URL(`https://example.com/api/weather/city-search${q === null ? "" : `?q=${encodeURIComponent(q)}`}`);
  return { url, clientAddress } as unknown as APIContext;
}

async function readJson(response: Response): Promise<unknown> {
  return response.json();
}

beforeEach(() => {
  mockCheckWeatherSearchRateLimit.mockReset().mockReturnValue({ ok: true });
  mockNormalizeGeocodeResults.mockReset();
  mockGetOpenWeatherApiKey.mockReset().mockReturnValue("test-api-key");
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("GET /api/weather/city-search", () => {
  it("returns 429 with Retry-After when rate limited", async () => {
    mockCheckWeatherSearchRateLimit.mockReturnValue({ ok: false, retryAfterSec: 30 });
    const { GET } = await import("./city-search");

    const response = await GET(makeContext("chicago"));

    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("30");
    expect(await readJson(response)).toEqual({ error: "Too many requests" });
  });

  it("omits Retry-After when the limiter doesn't provide one", async () => {
    mockCheckWeatherSearchRateLimit.mockReturnValue({ ok: false });
    const { GET } = await import("./city-search");

    const response = await GET(makeContext("chicago"));

    expect(response.headers.get("Retry-After")).toBeNull();
  });

  it("returns an empty result set for a too-short query without calling the API", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const { GET } = await import("./city-search");

    const response = await GET(makeContext("c"));

    expect(response.status).toBe(200);
    expect(await readJson(response)).toEqual({ results: [] });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("treats a missing query param the same as too-short", async () => {
    const { GET } = await import("./city-search");

    const response = await GET(makeContext(null));

    expect(await readJson(response)).toEqual({ results: [] });
  });

  it("returns 500 when the weather API key isn't configured", async () => {
    mockGetOpenWeatherApiKey.mockReturnValue("");
    const { GET } = await import("./city-search");

    const response = await GET(makeContext("chicago"));

    expect(response.status).toBe(500);
    expect(await readJson(response)).toEqual({ error: "Weather API not configured" });
  });

  it("fetches, normalizes, and returns geocode results on success", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([{ name: "Chicago" }]),
    });
    vi.stubGlobal("fetch", fetchMock);
    mockNormalizeGeocodeResults.mockReturnValue([{ name: "Chicago", lat: 41.8, lon: -87.6 }]);
    const { GET } = await import("./city-search");

    const response = await GET(makeContext("chicago"));

    expect(response.status).toBe(200);
    expect(await readJson(response)).toEqual({
      results: [{ name: "Chicago", lat: 41.8, lon: -87.6 }],
    });
    const [calledUrl] = fetchMock.mock.calls[0]!;
    expect(calledUrl).toContain("q=chicago");
    expect(calledUrl).toContain("appid=test-api-key");
  });

  it("looks up a bare US ZIP with the ZIP geocoder and labels it with the ZIP", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ zip: "23219", name: "Richmond", lat: 37.5, lon: -77.4, country: "US" }),
    });
    vi.stubGlobal("fetch", fetchMock);
    mockNormalizeGeocodeResults.mockImplementation((raw: unknown) => raw);
    const { GET } = await import("./city-search");

    const response = await GET(makeContext("23219"));

    const [calledUrl] = fetchMock.mock.calls[0]!;
    expect(calledUrl).toContain("/geo/1.0/zip?zip=23219,US");
    expect(mockNormalizeGeocodeResults).toHaveBeenCalledWith([
      expect.objectContaining({ name: "Richmond", state: "23219" }),
    ]);
    expect(response.status).toBe(200);
  });

  it("returns no results for an unknown ZIP instead of an error", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 404 }));
    const { GET } = await import("./city-search");

    const response = await GET(makeContext("00000"));

    expect(response.status).toBe(200);
    expect(await readJson(response)).toEqual({ results: [] });
  });

  it("returns 502 when the upstream geocode request fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
    const { GET } = await import("./city-search");

    const response = await GET(makeContext("chicago"));

    expect(response.status).toBe(502);
    expect(await readJson(response)).toEqual({ error: "Geocode failed" });
  });

  it("returns 502 when the fetch itself throws (e.g. timeout)", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("timeout")));
    const { GET } = await import("./city-search");

    const response = await GET(makeContext("chicago"));

    expect(response.status).toBe(502);
    expect(await readJson(response)).toEqual({ error: "Geocode request failed" });
  });
});
