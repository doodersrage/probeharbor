import {
  summarizeFreezeNights,
  worstRisk,
  type FreezeNight,
  type FreezeRisk,
  type NwsHourlyPeriod,
} from "./pipeFreezeForecast";

/**
 * Server-side NWS fetch for the pipe freeze forecast, shared by
 * /api/weather/pipe-freeze-forecast and /embed/pipe-freeze. Coordinates are
 * rounded to ~1 km so nearby lookups share a per-isolate cache entry.
 */
export type PipeFreezeForecastBody = {
  location: { city: string | null; state: string | null };
  nights: FreezeNight[];
  worst: FreezeRisk;
  updatedAt: string | null;
};

export type PipeFreezeForecastResult =
  | { ok: true; body: PipeFreezeForecastBody; cached: boolean }
  | { ok: false; error: "us_only" | "forecast_unavailable" };

const CACHE_TTL_MS = 30 * 60 * 1000;
const CACHE_MAX = 500;
const cache = new Map<string, { at: number; body: PipeFreezeForecastBody }>();
const USER_AGENT = `ProbeHarbor (${import.meta.env.SITE_URL?.trim() || "https://probeharbor.dev"})`;

export function pipeFreezeCacheKey(lat: number, lon: number): string {
  return `${lat.toFixed(2)},${lon.toFixed(2)}`;
}

export function getCachedPipeFreezeForecast(lat: number, lon: number): PipeFreezeForecastBody | null {
  const hit = cache.get(pipeFreezeCacheKey(lat, lon));
  return hit && Date.now() - hit.at < CACHE_TTL_MS ? hit.body : null;
}

async function nwsJson(url: string): Promise<{ ok: boolean; status: number; data: unknown }> {
  const res = await fetch(url, {
    headers: { Accept: "application/geo+json", "User-Agent": USER_AGENT },
    signal: AbortSignal.timeout(8000),
  });
  return { ok: res.ok, status: res.status, data: res.ok ? await res.json() : null };
}

export async function fetchPipeFreezeForecast(
  lat: number,
  lon: number,
  maxNights = 5,
): Promise<PipeFreezeForecastResult> {
  const cached = getCachedPipeFreezeForecast(lat, lon);
  if (cached) return { ok: true, body: { ...cached, nights: cached.nights.slice(0, maxNights) }, cached: true };

  try {
    const point = await nwsJson(`https://api.weather.gov/points/${lat.toFixed(4)},${lon.toFixed(4)}`);
    // NWS answers 404 for points outside the US and its territories.
    if (point.status === 404) return { ok: false, error: "us_only" };
    const props = (point.data as {
      properties?: {
        forecastHourly?: string;
        relativeLocation?: { properties?: { city?: string; state?: string } };
      };
    } | null)?.properties;
    if (!point.ok || !props?.forecastHourly) return { ok: false, error: "forecast_unavailable" };

    const hourly = await nwsJson(props.forecastHourly);
    const hourlyProps = (hourly.data as {
      properties?: { periods?: NwsHourlyPeriod[]; updateTime?: string; generatedAt?: string };
    } | null)?.properties;
    const periods = hourlyProps?.periods ?? [];
    if (!hourly.ok || periods.length === 0) return { ok: false, error: "forecast_unavailable" };

    const nights = summarizeFreezeNights(periods);
    const body: PipeFreezeForecastBody = {
      location: {
        city: props.relativeLocation?.properties?.city ?? null,
        state: props.relativeLocation?.properties?.state ?? null,
      },
      nights,
      worst: worstRisk(nights),
      updatedAt: hourlyProps?.updateTime ?? hourlyProps?.generatedAt ?? null,
    };
    if (cache.size >= CACHE_MAX) cache.clear();
    cache.set(pipeFreezeCacheKey(lat, lon), { at: Date.now(), body });
    return { ok: true, body: { ...body, nights: nights.slice(0, maxNights) }, cached: false };
  } catch {
    return { ok: false, error: "forecast_unavailable" };
  }
}

export function parseCoordinates(
  latRaw: string | null,
  lonRaw: string | null,
): { lat: number; lon: number } | null {
  if (latRaw == null || lonRaw == null || latRaw.trim() === "" || lonRaw.trim() === "") return null;
  const lat = Number(latRaw);
  const lon = Number(lonRaw);
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) {
    return null;
  }
  return { lat, lon };
}
