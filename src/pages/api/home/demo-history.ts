import type { APIRoute } from "astro";
import { checkDemoTempsRateLimit } from "../../../lib/demoTempsLimits";
import { fetchWeatherSnapshot } from "../../../lib/FetchWeather";
import {
  buildDemoHistoryPoints,
  fetchDemoHourlyWeather,
  outdoorHistoryPoints,
} from "../../../lib/demoHistory";

const CACHE_MS = 30 * 60 * 1000;
let cached: { at: number; body: string } | null = null;

/** Public 7-day history for the demo shop, rebuilt from real hourly weather. */
export const GET: APIRoute = async ({ clientAddress }) => {
  const rate = checkDemoTempsRateLimit(`history:${clientAddress || "unknown"}`);
  if (!rate.ok) {
    return new Response(JSON.stringify({ error: "Too many requests" }), {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        ...(rate.retryAfterSec ? { "Retry-After": String(rate.retryAfterSec) } : {}),
      },
    });
  }

  if (!cached || Date.now() - cached.at > CACHE_MS) {
    const weather = await fetchWeatherSnapshot(null);
    const hourly =
      weather?.lat != null && weather.lon != null
        ? await fetchDemoHourlyWeather(weather.lat, weather.lon)
        : [];
    if (hourly.length < 2) {
      return new Response(JSON.stringify({ error: "Weather history unavailable" }), {
        status: 503,
        headers: { "Content-Type": "application/json", "Retry-After": "300" },
      });
    }
    cached = {
      at: Date.now(),
      body: JSON.stringify({
        location: weather?.name ?? null,
        points: buildDemoHistoryPoints(hourly),
        outdoor: outdoorHistoryPoints(hourly),
      }),
    };
  }

  return new Response(cached.body, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=900, stale-while-revalidate=1800",
    },
  });
};
