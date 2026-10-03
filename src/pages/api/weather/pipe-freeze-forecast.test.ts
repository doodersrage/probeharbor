import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { APIContext } from "astro";

const mockRateLimit = vi.fn();
vi.mock("../../../lib/weatherSearchLimits", () => ({
  checkWeatherSearchRateLimit: (...a: unknown[]) => mockRateLimit(...a),
}));

function ctx(lat: string, lon: string): APIContext {
  const url = new URL(`https://example.com/api/weather/pipe-freeze-forecast?lat=${lat}&lon=${lon}`);
  return { url, clientAddress: "1.2.3.4" } as unknown as APIContext;
}

const pointBody = {
  properties: {
    forecastHourly: "https://api.weather.gov/gridpoints/AKQ/45,76/forecast/hourly",
    relativeLocation: { properties: { city: "Richmond", state: "VA" } },
  },
};
const hourlyBody = {
  properties: {
    updateTime: "2026-01-10T18:00:00+00:00",
    periods: [
      { startTime: "2026-01-10T18:00:00-05:00", isDaytime: false, temperature: 25, temperatureUnit: "F", windSpeed: "5 mph" },
      { startTime: "2026-01-10T19:00:00-05:00", isDaytime: false, temperature: 18, temperatureUnit: "F", windSpeed: "5 mph" },
      { startTime: "2026-01-11T07:00:00-05:00", isDaytime: true, temperature: 30, temperatureUnit: "F", windSpeed: "5 mph" },
    ],
  },
};

function respond(status: number, body: unknown) {
  return { ok: status >= 200 && status < 300, status, json: () => Promise.resolve(body) };
}

beforeEach(() => {
  vi.resetModules();
  mockRateLimit.mockReset().mockReturnValue({ ok: true });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("GET /api/weather/pipe-freeze-forecast", () => {
  it("rejects missing or out-of-range coordinates", async () => {
    const { GET } = await import("./pipe-freeze-forecast");
    expect((await GET(ctx("abc", "1"))).status).toBe(400);
    expect((await GET(ctx("91", "0"))).status).toBe(400);
  });

  it("summarizes the NWS hourly forecast into nights", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(respond(200, pointBody))
      .mockResolvedValueOnce(respond(200, hourlyBody));
    vi.stubGlobal("fetch", fetchMock);
    const { GET } = await import("./pipe-freeze-forecast");

    const res = await GET(ctx("37.54", "-77.43"));
    const body = (await res.json()) as Record<string, unknown>;

    expect(res.status).toBe(200);
    expect(fetchMock.mock.calls[0]![0]).toBe("https://api.weather.gov/points/37.5400,-77.4300");
    expect(body).toMatchObject({
      location: { city: "Richmond", state: "VA" },
      worst: "high",
      nights: [expect.objectContaining({ lowF: 18, hoursAtOrBelow32: 2, risk: "high" })],
    });
  });

  it("serves repeat requests for the same spot from cache", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(respond(200, pointBody))
      .mockResolvedValueOnce(respond(200, hourlyBody));
    vi.stubGlobal("fetch", fetchMock);
    const { GET } = await import("./pipe-freeze-forecast");

    await GET(ctx("37.541", "-77.431"));
    const again = await GET(ctx("37.539", "-77.429"));

    expect(again.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("says US only when NWS has no forecast for the point", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(respond(404, null)));
    const { GET } = await import("./pipe-freeze-forecast");

    const res = await GET(ctx("51.5", "-0.12"));

    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "us_only" });
  });

  it("rate limits uncached lookups", async () => {
    mockRateLimit.mockReturnValue({ ok: false, retryAfterSec: 30 });
    const { GET } = await import("./pipe-freeze-forecast");

    const res = await GET(ctx("40", "-75"));

    expect(res.status).toBe(429);
    expect(res.headers.get("Retry-After")).toBe("30");
  });
});
