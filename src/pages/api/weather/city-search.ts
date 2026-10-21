import type { APIRoute } from "astro";
import { getOpenWeatherApiKey } from "../../../lib/FetchWeather";
import { normalizeGeocodeResults } from "../../../lib/weatherCities";
import { checkWeatherSearchRateLimit } from "../../../lib/weatherSearchLimits";
import { apiCommonMessages, apiLocale } from "../../../i18n/messages/app/api/common";
import { apiUserMessages } from "../../../i18n/messages/app/api/user";

export const GET: APIRoute = async ({ url, clientAddress, locals }) => {
  const locale = apiLocale({ locals });
  const tc = apiCommonMessages(locale);
  const rate = checkWeatherSearchRateLimit(clientAddress || "unknown");
  if (!rate.ok) {
    return new Response(JSON.stringify({ error: tc.tooManyRequests }), {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        ...(rate.retryAfterSec ? { "Retry-After": String(rate.retryAfterSec) } : {}),
      },
    });
  }

  const q = url.searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) {
    return new Response(JSON.stringify({ results: [] }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const apiKey = getOpenWeatherApiKey();
  if (!apiKey) {
    return new Response(JSON.stringify({ error: apiUserMessages(locale).weather.notConfigured }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  // A bare US ZIP goes to the ZIP geocoder (one result); anything else is a name search.
  const zip = /^\d{5}$/.test(q) ? q : null;
  const endpoint = zip
    ? `https://api.openweathermap.org/geo/1.0/zip?zip=${zip},US&appid=${apiKey}`
    : `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(q)}&limit=5&appid=${apiKey}`;

  try {
    const response = await fetch(endpoint, {
      signal: AbortSignal.timeout(5000),
    });
    if (zip && response.status === 404) {
      return new Response(JSON.stringify({ results: [] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (!response.ok) {
      return new Response(JSON.stringify({ error: apiUserMessages(locale).weather.geocodeFailed }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }
    const raw = await response.json();
    // The ZIP geocoder returns one object with no state; label it "Name ZIP, US".
    const results = normalizeGeocodeResults(
      zip && raw && typeof raw === "object" && !Array.isArray(raw)
        ? [{ ...(raw as Record<string, unknown>), state: zip }]
        : raw,
    );
    return new Response(JSON.stringify({ results }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: apiUserMessages(locale).weather.geocodeRequestFailed }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }
};
