import { useEffect, useRef, useState } from "preact/hooks";
import {
  describeFreezeNight,
  embedSnippet,
  type FreezeNight,
  type FreezeRisk,
} from "../lib/pipeFreezeForecast";

type Place = { label: string; lat: number; lon: number };
type Forecast = {
  location: { city: string | null; state: string | null };
  nights: FreezeNight[];
  worst: FreezeRisk;
  updatedAt: string | null;
};

const RISK_LABEL: Record<FreezeRisk, string> = { high: "High risk", watch: "Watch", low: "Low risk" };
const RISK_CLASS: Record<FreezeRisk, string> = {
  high: "pipe-freeze-risk--high",
  watch: "pipe-freeze-risk--watch",
  low: "pipe-freeze-risk--low",
};
const ERRORS: Record<string, string> = {
  us_only: "This forecast uses the National Weather Service, so it covers US locations only.",
  rate_limited: "Too many lookups in a minute. Try again shortly.",
};

function nightLabel(date: string, index: number): string {
  if (index === 0) return "Tonight";
  const d = new Date(`${date}T12:00:00`);
  return `${d.toLocaleDateString(undefined, { weekday: "long" })} night`;
}

function headline(forecast: Forecast): string {
  const tonight = forecast.nights[0];
  if (!tonight) return "No forecast nights returned";
  if (tonight.risk === "high") return `Tonight: high freeze risk for unheated spaces (low ${tonight.lowF}°F)`;
  if (tonight.risk === "watch") return `Tonight: below freezing (low ${tonight.lowF}°F), watch exposed pipes`;
  if (forecast.worst !== "low") return "Tonight stays above freezing, but colder nights are coming";
  return "No freezing nights in the forecast";
}

/** Search a US city or ZIP and show the next few nights' pipe freeze outlook from the NWS forecast. */
export default function PipeFreezeForecast() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Place[]>([]);
  const [place, setPlace] = useState<Place | null>(null);
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const searchTimer = useRef<number | undefined>(undefined);

  async function load(next: Place) {
    setPlace(next);
    setResults([]);
    setError(null);
    setLoading(true);
    setForecast(null);
    const url = new URL(window.location.href);
    url.searchParams.set("lat", next.lat.toFixed(3));
    url.searchParams.set("lon", next.lon.toFixed(3));
    url.searchParams.set("place", next.label);
    window.history.replaceState({}, "", url);
    try {
      const res = await fetch(`/api/weather/pipe-freeze-forecast?lat=${next.lat}&lon=${next.lon}`);
      const body = (await res.json()) as Forecast & { error?: string };
      if (!res.ok) {
        setError(ERRORS[body.error ?? ""] ?? "The forecast service didn't answer. Try again in a minute.");
      } else {
        setForecast(body);
      }
    } catch {
      setError("The forecast service didn't answer. Try again in a minute.");
    } finally {
      setLoading(false);
    }
  }

  // Shared links (?lat=&lon=&place=) open straight to that forecast.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const lat = Number(params.get("lat"));
    const lon = Number(params.get("lon"));
    if (params.has("lat") && Number.isFinite(lat) && Number.isFinite(lon)) {
      const label = params.get("place") || `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
      setQuery(label);
      void load({ label, lat, lon });
    }
  }, []);

  function onInput(value: string) {
    setQuery(value);
    window.clearTimeout(searchTimer.current);
    if (value.trim().length < 2) {
      setResults([]);
      return;
    }
    searchTimer.current = window.setTimeout(async () => {
      try {
        const res = await fetch(`/api/weather/city-search?q=${encodeURIComponent(value.trim())}`);
        const body = (await res.json()) as {
          results?: Array<{ label: string; lat: number; lon: number; country?: string }>;
        };
        const found = body.results ?? [];
        setResults(found.filter((r) => !r.country || r.country === "US").map(({ label, lat, lon }) => ({ label, lat, lon })));
      } catch {
        setResults([]);
      }
    }, 300);
  }

  function useMyLocation() {
    if (!navigator.geolocation) {
      setError("This browser can't share its location. Search for a city or ZIP instead.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => void load({ label: "My location", lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => setError("Location permission was declined. Search for a city or ZIP instead."),
      { timeout: 10_000, maximumAge: 600_000 },
    );
  }

  return (
    <section class="card" aria-labelledby="pipe-freeze-tool-heading">
      <h2 id="pipe-freeze-tool-heading" class="card-title">Check your area</h2>
      <form
        class="pipe-freeze-search"
        onSubmit={(event) => {
          event.preventDefault();
          if (results[0]) void load(results[0]);
        }}
      >
        <label class="block grow">
          <span class="form-label">US city or ZIP code</span>
          <input
            class="form-input"
            type="search"
            autoComplete="postal-code"
            placeholder="e.g. 23219 or Richmond, VA"
            value={query}
            onInput={(event) => onInput((event.currentTarget as HTMLInputElement).value)}
          />
        </label>
        <button class="btn-secondary self-end" type="button" onClick={useMyLocation}>
          Use my location
        </button>
      </form>
      {results.length > 0 && (
        <ul class="pipe-freeze-results" aria-label="Matching places">
          {results.map((result) => (
            <li key={`${result.lat},${result.lon}`}>
              <button type="button" class="pipe-freeze-result" onClick={() => void load(result)}>
                {result.label}
              </button>
            </li>
          ))}
        </ul>
      )}

      <div aria-live="polite">
        {loading && <p class="mt-4 mb-0 text-[var(--color-text-muted)]">Loading the forecast for {place?.label}…</p>}
        {error && <p class="alert-warning mt-4 mb-0">{error}</p>}
        {forecast && (
          <div class="mt-5">
            <p class="pipe-freeze-headline">{headline(forecast)}</p>
            <p class="mt-1 mb-4 text-sm text-[var(--color-text-muted)]">
              {[forecast.location.city, forecast.location.state].filter(Boolean).join(", ") || place?.label} · outdoor
              forecast from the National Weather Service
              {forecast.updatedAt ? `, updated ${new Date(forecast.updatedAt).toLocaleString()}` : ""}
            </p>
            <div class="pipe-freeze-nights">
              {forecast.nights.map((night, index) => (
                <article class={`pipe-freeze-night ${RISK_CLASS[night.risk]}`} key={night.date}>
                  <header class="flex items-baseline justify-between gap-2">
                    <h3 class="m-0 text-base font-semibold">{nightLabel(night.date, index)}</h3>
                    <span class="pipe-freeze-risk">{RISK_LABEL[night.risk]}</span>
                  </header>
                  <p class="stat-value m-0 mt-2">{night.lowF}°F</p>
                  <p class="m-0 text-xs text-[var(--color-text-muted)]">
                    low · {night.hoursAtOrBelow32}h at or below 32°F
                    {night.hoursAtOrBelow20 > 0 ? ` · ${night.hoursAtOrBelow20}h at or below 20°F` : ""}
                  </p>
                  <p class="m-0 mt-2 text-sm">{describeFreezeNight(night)}</p>
                </article>
              ))}
            </div>
            {place && (
              <details class="mt-4">
                <summary class="cursor-pointer text-sm text-link">Embed this forecast on your site</summary>
                <p class="mt-2 mb-2 text-sm text-[var(--color-text-muted)]">
                  A small live widget for a plumber's, property manager's, or neighborhood site. It shows tonight and
                  the next two nights and updates on its own.
                </p>
                <textarea class="form-textarea font-mono text-xs w-full" rows={4} readOnly>
                  {embedSnippet(window.location.origin, place)}
                </textarea>
                <button
                  type="button"
                  class="btn-secondary btn-sm mt-2"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(embedSnippet(window.location.origin, place));
                      setCopied(true);
                      window.setTimeout(() => setCopied(false), 2000);
                    } catch {
                      setCopied(false);
                    }
                  }}
                >
                  {copied ? "Copied" : "Copy embed code"}
                </button>
              </details>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
