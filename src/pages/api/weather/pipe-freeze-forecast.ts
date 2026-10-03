import type { APIRoute } from "astro";
import {
  summarizeFreezeNights,
  worstRisk,
  type FreezeNight,
  type FreezeRisk,
  type NwsHourlyPeriod,
} from "../../../lib/pipeFreezeForecast";
import { checkWeatherSearchRateLimit } from "../../../lib/weatherSearchLimits";

/**
 * Public, unauthenticated night-by-night pipe freeze outlook for the
 * /pipe-freeze-forecast tool. Source: National Weather Service hourly
 * forecast (public domain, US only). Coordinates are rounded to ~1 km so
 * nearby visitors share a cache entry and NWS sees few repeat calls.
 */
type ForecastBody = {
  location: { city: string | null; state: string | null };
  nights: FreezeNight[];
  worst: FreezeRisk;
  updatedAt: string | null;
};

const CACHE_TTL_MS = 30 * 60 * 1000;
const cache = new Map<string, { at: number; body: ForecastBody }>();
const USER_AGENT = `ThermalTrace (${import.meta.env.SITE_URL?.trim() || "https://thermaltrace.dev"})`;

function json(body: unknown, status = 200, extra: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...extra },
  });
}

async function nwsJson(url: string): Promise<{ ok: boolean; status: number; data: unknown }> {
  const res = await fetch(url, {
    headers: { Accept: "application/geo+json", "User-Agent": USER_AGENT },
    signal: AbortSignal.timeout(8000),
  });
  return { ok: res.ok, status: res.status, data: res.ok ? await res.json() : null };
}

export const GET: APIRoute = async ({ url, clientAddress }) => {
  const lat = Number(url.searchParams.get("lat"));
  const lon = Number(url.searchParams.get("lon"));
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) {
    return json({ error: "invalid_coordinates" }, 400);
  }

  const key = `${lat.toFixed(2)},${lon.toFixed(2)}`;
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) {
    return json(hit.body, 200, { "Cache-Control": "public, max-age=900" });
  }

  const rate = checkWeatherSearchRateLimit(`pipe-freeze:${clientAddress || "unknown"}`);
  if (!rate.ok) {
    return json({ error: "rate_limited" }, 429, rate.retryAfterSec ? { "Retry-After": String(rate.retryAfterSec) } : {});
  }

  try {
    const point = await nwsJson(`https://api.weather.gov/points/${lat.toFixed(4)},${lon.toFixed(4)}`);
    // NWS answers 404 for points outside the US and its territories.
    if (point.status === 404) return json({ error: "us_only" }, 404);
    const props = (point.data as {
      properties?: {
        forecastHourly?: string;
        relativeLocation?: { properties?: { city?: string; state?: string } };
      };
    } | null)?.properties;
    if (!point.ok || !props?.forecastHourly) return json({ error: "forecast_unavailable" }, 502);

    const hourly = await nwsJson(props.forecastHourly);
    const hourlyProps = (hourly.data as {
      properties?: { periods?: NwsHourlyPeriod[]; updateTime?: string; generatedAt?: string };
    } | null)?.properties;
    const periods = hourlyProps?.periods ?? [];
    if (!hourly.ok || periods.length === 0) return json({ error: "forecast_unavailable" }, 502);

    const nights = summarizeFreezeNights(periods);
    const body: ForecastBody = {
      location: {
        city: props.relativeLocation?.properties?.city ?? null,
        state: props.relativeLocation?.properties?.state ?? null,
      },
      nights,
      worst: worstRisk(nights),
      updatedAt: hourlyProps?.updateTime ?? hourlyProps?.generatedAt ?? null,
    };
    if (cache.size >= 500) cache.clear();
    cache.set(key, { at: Date.now(), body });
    return json(body, 200, { "Cache-Control": "public, max-age=900" });
  } catch {
    return json({ error: "forecast_unavailable" }, 502);
  }
};
