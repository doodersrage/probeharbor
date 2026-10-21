import { useCallback, useEffect, useState } from "preact/hooks";
import type { WeatherSnapshot } from "../lib/FetchWeather";
import { LIVE_REFRESH_EVENT } from "../lib/liveDashboardChrome";
import WeatherMap, { WEATHER_MAP_TEXT_EN } from "./WeatherMap";

/**
 * Visible copy. Plain strings only (island props are serialized). English is
 * the default; marketing pages pass a translation from
 * `src/i18n/messages/demoIslands/`.
 */
export const WEATHER_PANEL_TEXT_EN = {
  loading: "Loading outdoor weather…",
  title: "Current weather",
  loadError: "Unable to load weather",
  rateLimited: "Too many requests",
  locationUnavailable: "Unable to load weather for this location.",
  retry: "Retry",
  guestCta: "Create account to set location",
  changeLocation: "Change location",
  temperature: "Temperature",
  humidity: "Humidity",
  feelsLike: "Feels Like",
  windSpeed: "Wind Speed",
  windGusts: "Wind Gusts",
  cloudCover: "Cloud Cover",
  condition: "Condition",
  refreshNote: "Outdoor weather refreshes every few minutes.",
  refreshNow: "Refresh now",
  mapLabel: WEATHER_MAP_TEXT_EN.mapLabel,
  mapOpenLarger: WEATHER_MAP_TEXT_EN.openLarger,
  mapAttribution: WEATHER_MAP_TEXT_EN.attribution,
};

export type WeatherPanelText = typeof WEATHER_PANEL_TEXT_EN;

interface Props {
  text?: WeatherPanelText;
  /** BCP 47 tag for number formatting. Omitted or English keeps the °F/mph layout. */
  locale?: string;
  cityId?: string | null;
  intervalMs?: number;
  /** Guest marketing home — avoid dashboard-only CTAs */
  guest?: boolean;
}

export default function WeatherPanel({
  cityId = null,
  intervalMs = 300000,
  guest = false,
  text = WEATHER_PANEL_TEXT_EN,
  locale,
}: Props) {
  // Non-English pages read °C and km/h first, with the US units in parentheses.
  const localized = locale != null && !locale.toLowerCase().startsWith("en");
  const [weather, setWeather] = useState<WeatherSnapshot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (signal?: AbortSignal) => {
    try {
      const params = new URLSearchParams();
      if (cityId) params.set("cityId", cityId);
      const query = params.toString();
      const response = await fetch(`/api/home/weather${query ? `?${query}` : ""}`, {
        credentials: "same-origin",
        signal,
      });
      const payload = (await response.json()) as {
        error?: string;
        weather?: WeatherSnapshot;
      };
      if (signal?.aborted) return;
      if (!response.ok) {
        throw new Error(
          response.status === 429
            ? text.rateLimited
            : response.status === 502
              ? text.locationUnavailable
              : localized
                ? text.loadError
                : (payload.error ?? text.loadError),
        );
      }
      setWeather(payload.weather ?? null);
      setError(null);
    } catch (e) {
      if (signal?.aborted || (e instanceof DOMException && e.name === "AbortError")) {
        return;
      }
      setError(
        e instanceof Error && (!localized || !(e instanceof TypeError)) ? e.message : text.loadError,
      );
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [cityId, localized, text]);

  useEffect(() => {
    const ac = new AbortController();
    void load(ac.signal);
    return () => ac.abort();
  }, [load]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (document.visibilityState === "hidden") return;
      void load();
    }, intervalMs);
    const onRefresh = () => void load();
    window.addEventListener(LIVE_REFRESH_EVENT, onRefresh);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener(LIVE_REFRESH_EVENT, onRefresh);
    };
  }, [intervalMs, load]);

  if (loading && !weather) {
    return (
      <section class="card animate-slide-in-right">
        <div class="loading-state">
          <p class="m-0">{text.loading}</p>
        </div>
      </section>
    );
  }

  if (error && !weather) {
    return (
      <section class="card animate-slide-in-right">
        <div class="empty-state">
          <h2 class="card-title">{text.title}</h2>
          <p class="mb-4">{error}</p>
          <div class="flex flex-wrap justify-center gap-3">
            <button type="button" class="btn-secondary" onClick={() => {
              setLoading(true);
              void load();
            }}>
              {text.retry}
            </button>
            {guest ? (
              <a class="btn-ghost" href="/register?next=/dashboard/devices">
                {text.guestCta}
              </a>
            ) : (
              <a class="btn-ghost" href="/dashboard#weather">
                {text.changeLocation}
              </a>
            )}
          </div>
        </div>
      </section>
    );
  }

  if (!weather) return null;

  const locationLabel =
    weather.source === "ambient"
      ? `${weather.name} (Ambient Weather)`
      : weather.source === "weatherflow"
        ? `${weather.name} (WeatherFlow)`
        : `${weather.name}${weather.country ? `, ${weather.country}` : ""}`;
  const hasCoords =
    weather.lat != null &&
    weather.lon != null &&
    Number.isFinite(weather.lat) &&
    Number.isFinite(weather.lon);
  // Providers return hundredths; whole units match what a forecast shows.
  const whole = (n: number) =>
    localized ? new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(Math.round(n)) : String(Math.round(n));
  const pct = (n: number) =>
    localized
      ? new Intl.NumberFormat(locale, { style: "percent", maximumFractionDigits: 0 }).format(Math.round(n) / 100)
      : `${whole(n)}%`;
  const temp = (f: number) => (localized ? `${whole(((f - 32) * 5) / 9)} °C (${whole(f)} °F)` : `${whole(f)}°F`);
  const wind = (mph: number) => (localized ? `${whole(mph * 1.609344)} km/h (${whole(mph)} mph)` : `${whole(mph)} mph`);
  const stats: Array<{ key: string; label: string; value: string; detail?: boolean }> = [
    { key: "temperature", label: text.temperature, value: temp(weather.temp) },
    { key: "humidity", label: text.humidity, value: pct(weather.humidity) },
    { key: "feelsLike", label: text.feelsLike, value: temp(weather.feelsLike) },
    { key: "windSpeed", label: text.windSpeed, value: wind(weather.windSpeed) },
  ];
  if (weather.windGust != null) {
    stats.push({ key: "windGusts", label: text.windGusts, value: wind(weather.windGust) });
  }
  stats.push(
    { key: "cloudCover", label: text.cloudCover, value: pct(weather.cloudCover) },
    { key: "condition", label: text.condition, value: weather.description, detail: true },
  );

  return (
    <section class="card animate-slide-in-right">
      <h2 class="card-title">{text.title}</h2>
      <p class="card-subtitle">{locationLabel}</p>
      {error && (
        <div class="alert-warning mb-4">
          <p class="m-0">
            {error}{" "}
            <button
              type="button"
              class="text-link bg-transparent border-0 p-0 cursor-pointer"
              onClick={() => void load()}
            >
              {text.retry}
            </button>
          </p>
        </div>
      )}
      {hasCoords && (
        <WeatherMap
          lat={weather.lat!}
          lon={weather.lon!}
          label={locationLabel}
          text={{ mapLabel: text.mapLabel, openLarger: text.mapOpenLarger, attribution: text.mapAttribution }}
        />
      )}
      <div class="stat-grid">
        {stats.map(({ key, label, value, detail }) => (
          <article class="stat-item" key={key}>
            <span class="stat-label">{label}</span>
            {detail ? (
              <p class="stat-value stat-value-text capitalize">{value}</p>
            ) : (
              <p class="stat-value">{value}</p>
            )}
          </article>
        ))}
      </div>
      <p class="live-refresh-note">
        {text.refreshNote}
        {" "}
        <button
          type="button"
          class="text-link bg-transparent border-0 p-0 cursor-pointer text-sm"
          onClick={() => void load()}
        >
          {text.refreshNow}
        </button>
      </p>
    </section>
  );
}
