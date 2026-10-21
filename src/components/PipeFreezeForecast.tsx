import { useEffect, useRef, useState } from "preact/hooks";
import {
  embedSnippet,
  HIGH_RISK_LOW_F,
  WINDY_MPH,
  type FreezeNight,
  type FreezeRisk,
} from "../lib/pipeFreezeForecast";
import { formatTemp, formatWind, loadTempUnit, saveTempUnit, type TempUnit } from "../lib/tempUnits";

type Place = { label: string; lat: number; lon: number };
type Forecast = {
  location: { city: string | null; state: string | null };
  nights: FreezeNight[];
  worst: FreezeRisk;
  updatedAt: string | null;
};

/**
 * Visible strings. Pages pass a translated copy (`text`); `{name}` marks a
 * value filled in at runtime. Plain strings only, so the prop serializes.
 */
export const PIPE_FREEZE_FORECAST_TEXT = {
  riskHigh: "High risk",
  riskWatch: "Watch",
  riskLow: "Low risk",
  errorUsOnly: "This forecast uses the National Weather Service, so it covers US locations only.",
  errorRateLimited: "Too many lookups in a minute. Try again shortly.",
  errorService: "The forecast service didn't answer. Try again in a minute.",
  errorNoGeolocation: "This browser can't share its location. Search for a city or ZIP instead.",
  errorGeoDeclined: "Location permission was declined. Search for a city or ZIP instead.",
  tonight: "Tonight",
  weekdayNight: "{weekday} night",
  headlineNone: "No forecast nights returned",
  headlineHigh: "Tonight: high freeze risk for unheated spaces (low {low})",
  headlineWatch: "Tonight: below freezing (low {low}), watch exposed pipes",
  headlineColderLater: "Tonight stays above freezing, but colder nights are coming",
  headlineClear: "No freezing nights in the forecast",
  describeHigh:
    "Low of {low}, at or below the {mark} mark where pipes in unheated garages, crawlspaces, and attics are commonly at risk.",
  describeWatchOne:
    "Below freezing for about {hours} hour, low {low}. Exposed pipes on exterior walls, near garage doors, or in vented crawlspaces can still freeze on a long or windy night.",
  describeWatchMany:
    "Below freezing for about {hours} hours, low {low}. Exposed pipes on exterior walls, near garage doors, or in vented crawlspaces can still freeze on a long or windy night.",
  describeAbove: "Stays above freezing (low {low}).",
  describeWind: "Wind up to {wind} while below freezing pulls heat from exposed pipes faster.",
  describeNextDay: "The next day stays below freezing too, so unheated spaces won't warm back up.",
  signupTitle: "Email me before freezing nights in {place}",
  signupLede:
    "Free, no hardware needed. One email the afternoon before the first freezing night of a cold spell, and before every night at {temp} or colder. Unsubscribe in one click.",
  emailLabel: "Email",
  emailPlaceholder: "you@example.com",
  sending: "Sending…",
  submit: "Get freeze alerts",
  genericError: "Something went wrong. Please try again.",
  heading: "Check your area",
  unitLegend: "Temperature unit",
  searchLabel: "US city or ZIP code",
  searchPlaceholder: "e.g. 23219 or Richmond, VA",
  useMyLocation: "Use my location",
  myLocation: "My location",
  resultsLabel: "Matching places",
  loading: "Loading the forecast for {place}…",
  source: " · outdoor forecast from the National Weather Service",
  updated: ", updated {time}",
  nightLow: "low · {hours}h at or below {temp}",
  nightBelow20: " · {hours}h at or below {temp}",
  embedSummary: "Embed this forecast on your site",
  embedLede:
    "A small live widget for a plumber's, property manager's, or neighborhood site. It shows tonight and the next two nights and updates on its own.",
  copied: "Copied",
  copyEmbed: "Copy embed code",
};
export type PipeFreezeForecastText = typeof PIPE_FREEZE_FORECAST_TEXT;

function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}

function riskLabel(risk: FreezeRisk, text: PipeFreezeForecastText): string {
  return risk === "high" ? text.riskHigh : risk === "watch" ? text.riskWatch : text.riskLow;
}

/** Same sentences as `describeFreezeNight` in the lib, from translatable templates. */
function describeNight(night: FreezeNight, unit: TempUnit, text: PipeFreezeForecastText): string {
  const parts: string[] = [];
  const low = formatTemp(night.lowF, unit);
  if (night.risk === "high") {
    parts.push(fill(text.describeHigh, { low, mark: formatTemp(HIGH_RISK_LOW_F, unit) }));
  } else if (night.risk === "watch") {
    const template = night.hoursAtOrBelow32 === 1 ? text.describeWatchOne : text.describeWatchMany;
    parts.push(fill(template, { hours: night.hoursAtOrBelow32, low }));
  } else {
    parts.push(fill(text.describeAbove, { low }));
  }
  if (night.maxFreezingWindMph != null && night.maxFreezingWindMph >= WINDY_MPH) {
    parts.push(fill(text.describeWind, { wind: formatWind(night.maxFreezingWindMph, unit) }));
  }
  if (night.staysBelowFreezingNextDay) parts.push(text.describeNextDay);
  return parts.join(" ");
}
const RISK_CLASS: Record<FreezeRisk, string> = {
  high: "pipe-freeze-risk--high",
  watch: "pipe-freeze-risk--watch",
  low: "pipe-freeze-risk--low",
};
function errorMessage(code: string | undefined, text: PipeFreezeForecastText): string {
  if (code === "us_only") return text.errorUsOnly;
  if (code === "rate_limited") return text.errorRateLimited;
  return text.errorService;
}

function nightLabel(date: string, index: number, text: PipeFreezeForecastText, locale?: string): string {
  if (index === 0) return text.tonight;
  const d = new Date(`${date}T12:00:00`);
  return fill(text.weekdayNight, { weekday: d.toLocaleDateString(locale, { weekday: "long" }) });
}

function headline(forecast: Forecast, unit: TempUnit, text: PipeFreezeForecastText): string {
  const tonight = forecast.nights[0];
  if (!tonight) return text.headlineNone;
  const low = formatTemp(tonight.lowF, unit);
  if (tonight.risk === "high") return fill(text.headlineHigh, { low });
  if (tonight.risk === "watch") return fill(text.headlineWatch, { low });
  if (forecast.worst !== "low") return text.headlineColderLater;
  return text.headlineClear;
}

type TurnstileApi = {
  render: (el: HTMLElement, options: { sitekey: string }) => string;
  reset: (id?: string) => void;
  remove: (id: string) => void;
};

/** Email + Turnstile form for hardware-free freeze alerts at the place just looked up. */
function FreezeAlertSignup({
  place,
  siteKey,
  unit,
  text,
}: {
  place: Place;
  siteKey?: string;
  unit: TempUnit;
  text: PipeFreezeForecastText;
}) {
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Arriving from an embed's "Get free freeze alerts" link: jump to the form.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("signup") !== "1") return;
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    formRef.current?.querySelector<HTMLInputElement>('input[name="email"]')?.focus({ preventScroll: true });
  }, []);

  // The Turnstile script only auto-renders widgets present at page load, so render this one explicitly.
  useEffect(() => {
    if (!siteKey) return;
    let cancelled = false;
    const tryRender = () => {
      const api = (window as { turnstile?: TurnstileApi }).turnstile;
      if (cancelled || !widgetRef.current) return;
      if (!api) {
        window.setTimeout(tryRender, 300);
        return;
      }
      if (widgetId.current == null) widgetId.current = api.render(widgetRef.current, { sitekey: siteKey });
    };
    tryRender();
    return () => {
      cancelled = true;
      const api = (window as { turnstile?: TurnstileApi }).turnstile;
      if (api && widgetId.current != null) api.remove(widgetId.current);
      widgetId.current = null;
    };
  }, [siteKey]);

  async function submit(event: SubmitEvent) {
    event.preventDefault();
    setSubmitting(true);
    setStatus(null);
    const form = event.currentTarget as HTMLFormElement;
    const data = new FormData(form);
    data.set("lat", String(place.lat));
    data.set("lon", String(place.lon));
    data.set("label", place.label);
    try {
      const res = await fetch("/api/freeze-alerts/subscribe", { method: "POST", body: data });
      const body = (await res.json()) as { ok?: boolean; message?: string };
      setStatus({ ok: res.ok && body.ok === true, message: body.message ?? text.genericError });
      if (res.ok && body.ok) form.reset();
    } catch {
      setStatus({ ok: false, message: text.genericError });
    } finally {
      const api = (window as { turnstile?: TurnstileApi }).turnstile;
      if (api && widgetId.current != null) api.reset(widgetId.current);
      setSubmitting(false);
    }
  }

  return (
    <form id="freeze-alerts" ref={formRef} class="freeze-alert-signup mt-5" onSubmit={submit}>
      <h3 class="m-0 text-base font-semibold">{fill(text.signupTitle, { place: place.label })}</h3>
      <p class="mt-1 mb-3 text-sm text-[var(--color-text-muted)]">
        {fill(text.signupLede, { temp: formatTemp(20, unit) })}
      </p>
      <div class="pipe-freeze-search">
        <label class="block grow">
          <span class="form-label">{text.emailLabel}</span>
          <input class="form-input" type="email" name="email" required autoComplete="email" placeholder={text.emailPlaceholder} />
        </label>
        <button class="btn-primary self-end" type="submit" disabled={submitting}>
          {submitting ? text.sending : text.submit}
        </button>
      </div>
      {/* Honeypot: hidden from people, filled by bots. */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" class="hidden" />
      <div ref={widgetRef} class="mt-3"></div>
      {status && (
        <p class={`${status.ok ? "alert-success" : "alert-warning"} mt-3 mb-0`} role="status">
          {status.message}
        </p>
      )}
    </form>
  );
}

/** Search a US city or ZIP and show the next few nights' pipe freeze outlook from the NWS forecast. */
/**
 * `turnstileSiteKey` comes from the page as a prop: non-PUBLIC_ env vars are
 * not available in browser code, so reading import.meta.env here is undefined.
 */
export default function PipeFreezeForecast({
  turnstileSiteKey,
  text = PIPE_FREEZE_FORECAST_TEXT,
  locale,
}: {
  turnstileSiteKey?: string;
  /** Translated strings; English when missing. */
  text?: PipeFreezeForecastText;
  /** BCP 47 tag for weekday and date formatting; the browser default when missing. */
  locale?: string;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Place[]>([]);
  const [place, setPlace] = useState<Place | null>(null);
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [unit, setUnit] = useState<TempUnit>("F");
  const searchTimer = useRef<number | undefined>(undefined);

  // Server render is °F; after mount use ?unit= (from Celsius embeds), the saved choice, or the browser's locale.
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("unit")?.toLowerCase();
    setUnit(fromUrl === "c" ? "C" : fromUrl === "f" ? "F" : loadTempUnit());
  }, []);

  function chooseUnit(next: TempUnit) {
    setUnit(next);
    saveTempUnit(next);
  }

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
        setError(errorMessage(body.error, text));
      } else {
        setForecast(body);
      }
    } catch {
      setError(text.errorService);
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
      setError(text.errorNoGeolocation);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => void load({ label: text.myLocation, lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => setError(text.errorGeoDeclined),
      { timeout: 10_000, maximumAge: 600_000 },
    );
  }

  return (
    <section class="card" aria-labelledby="pipe-freeze-tool-heading">
      <div class="flex items-center justify-between gap-3">
        <h2 id="pipe-freeze-tool-heading" class="card-title">{text.heading}</h2>
        <fieldset class="temp-unit-toggle">
          <legend class="sr-only">{text.unitLegend}</legend>
          {(["F", "C"] as const).map((option) => (
            <button
              key={option}
              type="button"
              class={option === unit ? "btn-secondary btn-sm" : "btn-ghost btn-sm"}
              aria-pressed={option === unit}
              onClick={() => chooseUnit(option)}
            >
              °{option}
            </button>
          ))}
        </fieldset>
      </div>
      <form
        class="pipe-freeze-search"
        onSubmit={(event) => {
          event.preventDefault();
          if (results[0]) void load(results[0]);
        }}
      >
        <label class="block grow">
          <span class="form-label">{text.searchLabel}</span>
          <input
            class="form-input"
            type="search"
            autoComplete="postal-code"
            placeholder={text.searchPlaceholder}
            value={query}
            onInput={(event) => onInput((event.currentTarget as HTMLInputElement).value)}
          />
        </label>
        <button class="btn-secondary self-end" type="button" onClick={useMyLocation}>
          {text.useMyLocation}
        </button>
      </form>
      {results.length > 0 && (
        <ul class="pipe-freeze-results" aria-label={text.resultsLabel}>
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
        {loading && (
          <p class="mt-4 mb-0 text-[var(--color-text-muted)]">{fill(text.loading, { place: place?.label ?? "" })}</p>
        )}
        {error && <p class="alert-warning mt-4 mb-0">{error}</p>}
        {forecast && (
          <div class="mt-5">
            <p class="pipe-freeze-headline">{headline(forecast, unit, text)}</p>
            <p class="mt-1 mb-4 text-sm text-[var(--color-text-muted)]">
              {[forecast.location.city, forecast.location.state].filter(Boolean).join(", ") || place?.label}
              {text.source}
              {forecast.updatedAt
                ? fill(text.updated, { time: new Date(forecast.updatedAt).toLocaleString(locale) })
                : ""}
            </p>
            <div class="pipe-freeze-nights">
              {forecast.nights.map((night, index) => (
                <article class={`pipe-freeze-night ${RISK_CLASS[night.risk]}`} key={night.date}>
                  <header class="flex items-baseline justify-between gap-2">
                    <h3 class="m-0 text-base font-semibold">{nightLabel(night.date, index, text, locale)}</h3>
                    <span class="pipe-freeze-risk">{riskLabel(night.risk, text)}</span>
                  </header>
                  <p class="stat-value m-0 mt-2">{formatTemp(night.lowF, unit)}</p>
                  <p class="m-0 text-xs text-[var(--color-text-muted)]">
                    {fill(text.nightLow, { hours: night.hoursAtOrBelow32, temp: formatTemp(32, unit) })}
                    {night.hoursAtOrBelow20 > 0
                      ? fill(text.nightBelow20, { hours: night.hoursAtOrBelow20, temp: formatTemp(20, unit) })
                      : ""}
                  </p>
                  <p class="m-0 mt-2 text-sm">{describeNight(night, unit, text)}</p>
                </article>
              ))}
            </div>
            {place && <FreezeAlertSignup place={place} siteKey={turnstileSiteKey} unit={unit} text={text} />}
            {place && (
              <details class="mt-4">
                <summary class="cursor-pointer text-sm text-link">{text.embedSummary}</summary>
                <p class="mt-2 mb-2 text-sm text-[var(--color-text-muted)]">{text.embedLede}</p>
                <textarea class="form-textarea font-mono text-xs w-full" rows={4} readOnly>
                  {embedSnippet(window.location.origin, place, unit)}
                </textarea>
                <button
                  type="button"
                  class="btn-secondary btn-sm mt-2"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(embedSnippet(window.location.origin, place, unit));
                      setCopied(true);
                      window.setTimeout(() => setCopied(false), 2000);
                    } catch {
                      setCopied(false);
                    }
                  }}
                >
                  {copied ? text.copied : text.copyEmbed}
                </button>
              </details>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
