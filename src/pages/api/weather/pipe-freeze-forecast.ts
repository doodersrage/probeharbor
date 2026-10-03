import type { APIRoute } from "astro";
import {
  fetchPipeFreezeForecast,
  getCachedPipeFreezeForecast,
  parseCoordinates,
} from "../../../lib/pipeFreezeForecastFetch";
import { checkWeatherSearchRateLimit } from "../../../lib/weatherSearchLimits";

/**
 * Public, unauthenticated night-by-night pipe freeze outlook for the
 * /pipe-freeze-forecast tool. Source: National Weather Service hourly
 * forecast (public domain, US only). Cached lookups skip the rate limit.
 */
function json(body: unknown, status = 200, extra: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...extra },
  });
}

export const GET: APIRoute = async ({ url, clientAddress }) => {
  const coords = parseCoordinates(url.searchParams.get("lat"), url.searchParams.get("lon"));
  if (!coords) return json({ error: "invalid_coordinates" }, 400);

  if (!getCachedPipeFreezeForecast(coords.lat, coords.lon)) {
    const rate = checkWeatherSearchRateLimit(`pipe-freeze:${clientAddress || "unknown"}`);
    if (!rate.ok) {
      return json(
        { error: "rate_limited" },
        429,
        rate.retryAfterSec ? { "Retry-After": String(rate.retryAfterSec) } : {},
      );
    }
  }

  const result = await fetchPipeFreezeForecast(coords.lat, coords.lon);
  if (!result.ok) return json({ error: result.error }, result.error === "us_only" ? 404 : 502);
  return json(result.body, 200, { "Cache-Control": "public, max-age=900" });
};
