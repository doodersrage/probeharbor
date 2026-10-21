import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
import { formatRelativeAge } from "../lib/relativeTime";
import type { PluralForms } from "../i18n/format";
import {
  LIVE_READINGS_EVENT,
  LIVE_REFRESH_EVENT,
  newestLiveReadingAt,
} from "../lib/liveDashboardChrome";

type ProbeReading = {
  key: string;
  label: string;
  data: { f: number; c: number; h: number } | null;
};

type FeedGroup = {
  feedId: string;
  feedName: string;
  enabled: boolean;
  error?: string;
  probes: ProbeReading[];
};

type LiveSensor = {
  deviceId: string;
  deviceName: string;
  deviceSource?: "push" | "pull_url" | null;
  space?: string | null;
  key: string;
  label: string;
  kind: string;
  unit: string | null;
  value_num: number | null;
  value_bool: boolean | null;
  value_text: string | null;
  recorded_at: string | null;
  temp?: { f: number; c: number; h: number } | null;
};

/**
 * Visible copy. Plain strings only (island props are serialized). English is
 * the default; the dashboard passes a translation from
 * `src/i18n/messages/app/live/`.
 */
export const LIVE_TEMPS_PANEL_TEXT_EN = {
  loading: "Loading live readings…",
  title: "Live sensors",
  subtitle: "Temperature, humidity, and other probes from pull feeds and push devices.",
  spaceLabel: "Space",
  allSpaces: "All spaces",
  refreshError: "Unable to refresh readings",
  refreshFailed: "Refresh failed",
  retryNow: "Retry now",
  laggingMany: {
    one: "{count} probe looks offline or stale",
    other: "{count} probes look offline or stale",
  } as PluralForms,
  andMore: "and {count} more on Devices",
  checkDevices: "Check Devices",
  debugStale: "Debug stale readings",
  offlineProbes: "Offline probes ({count}): no reading in 2+ hours",
  disabled: "Disabled",
  noProbes: "No probes assigned to this feed.",
  noReadingForKey: 'No reading for key "{key}"',
  emptyTitle: "No sensors yet",
  emptyBody:
    "Create a push device or pull feed, then POST a reading. Cards show up here within a few seconds.",
  openDevices: "Open Devices",
  alertEssentials: "Alert essentials",
  probeSimulator: "Probe simulator",
  otherSensors: "Other sensors",
  cachedOffline: "Showing cached readings (offline).",
  updated: "Updated {time}. Next refresh in {seconds}s.",
  nextRefresh: "Next refresh in {seconds}s.",
  /** Second line of a temperature tile. */
  tempHumidity: "{celsius}°C · {humidity}% humidity",
  noReading: "No reading",
  details: {
    humidity: "Relative humidity",
    co2: "CO₂",
    pressure: "Barometric pressure",
    pm25: "Fine particles",
    voc: "VOCs",
    level: "Sump / tank level",
    energy: "Power draw",
    door: "Door",
    power: "Power",
    flood: "Flood / leak",
    motion: "Motion",
  },
  values: {
    true: "True",
    false: "False",
    open: "Open",
    closed: "Closed",
    on: "On",
    off: "Off",
    wet: "Wet",
    dry: "Dry",
    detected: "Detected",
    clear: "Clear",
  },
  freshness: {
    polled: "Polled {age}",
    updated: "Updated {age}",
    offlinePolled: "Offline · last polled {age}",
    awaitingPoll: "Awaiting poll · last polled {age}",
    offlineSeen: "Offline · last seen {age}",
    mayBeOffline: "May be offline · last seen {age}",
  },
  age: {
    never: "never",
    justNow: "just now",
    minutes: "{count}m ago",
    hours: "{count}h ago",
    days: "{count}d ago",
  },
};

export type LiveTempsPanelText = typeof LIVE_TEMPS_PANEL_TEXT_EN;

interface Props {
  intervalMs?: number;
  text?: LiveTempsPanelText;
  /** BCP 47 tag for number and time formatting. Omitted or English keeps the current output. */
  locale?: string;
}

const PLACEHOLDER = /\{([a-zA-Z_][a-zA-Z0-9_]*)\}/g;

/** Fill `{name}` placeholders (same rules as `fmt` in src/i18n/format.ts). */
function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(PLACEHOLDER, (whole, name: string) =>
    Object.hasOwn(vars, name) ? String(vars[name]) : whole,
  );
}

/** Formatting helpers bound to the panel's copy and locale. */
export function makeFormat(text: LiveTempsPanelText, locale: string | undefined) {
  const localized = locale != null && !locale.toLowerCase().startsWith("en");
  const fixed = (n: number, digits: number) =>
    localized
      ? new Intl.NumberFormat(locale, {
          minimumFractionDigits: digits,
          maximumFractionDigits: digits,
        }).format(n)
      : n.toFixed(digits);
  const count = (n: number) => (localized ? new Intl.NumberFormat(locale).format(n) : String(n));
  const pluralRules = new Intl.PluralRules(localized ? locale : "en-US");
  const plural = (forms: PluralForms, n: number) =>
    fill(forms[pluralRules.select(n) as keyof PluralForms] ?? forms.other, { count: count(n) });

  /** Same buckets as `formatRelativeAge` in src/lib/relativeTime.ts. */
  const ageLabel = (iso: string | null | undefined): string => {
    const parsed = iso ? Date.parse(iso) : Number.NaN;
    if (Number.isNaN(parsed)) return text.age.never;
    const ms = Date.now() - parsed;
    const minutes = Math.floor(ms / 60000);
    if (ms < 0 || minutes < 1) return text.age.justNow;
    if (minutes < 60) return fill(text.age.minutes, { count: count(minutes) });
    const hours = Math.floor(minutes / 60);
    return hours < 48
      ? fill(text.age.hours, { count: count(hours) })
      : fill(text.age.days, { count: count(Math.floor(hours / 24)) });
  };

  /** Same wording rules as `freshnessDetailForSource` in src/lib/sensorFreshness.ts. */
  const freshness = (
    recordedAt: string | null | undefined,
    source: LiveSensor["deviceSource"],
  ): string => {
    const flags = formatRelativeAge(recordedAt);
    const age = ageLabel(recordedAt);
    if (!flags.lagging) {
      return fill(source === "pull_url" ? text.freshness.polled : text.freshness.updated, { age });
    }
    if (source === "pull_url") {
      return fill(flags.stale ? text.freshness.offlinePolled : text.freshness.awaitingPoll, { age });
    }
    return fill(flags.stale ? text.freshness.offlineSeen : text.freshness.mayBeOffline, { age });
  };

  /** °F tile value, tenths (finer than typical probe accuracy). */
  const tempF = (f: number) => (Number.isFinite(f) ? `${fixed(f, 1)}°F` : "—");
  const tempDetail = (c: number, h: number) =>
    fill(text.tempHumidity, {
      celsius: Number.isFinite(c) ? fixed(c, 1) : "—",
      // Humidity sensors are ±2–3%, so whole percents.
      humidity: Number.isFinite(h) ? fixed(h, 0) : "—",
    });
  const boolValue = (kind: string, value: boolean): string => {
    const v = text.values;
    if (kind === "door") return value ? v.open : v.closed;
    if (kind === "flood") return value ? v.wet : v.dry;
    if (kind === "motion") return value ? v.detected : v.clear;
    return value ? v.on : v.off;
  };
  const time = (iso: string) =>
    localized ? new Date(iso).toLocaleTimeString(locale) : new Date(iso).toLocaleTimeString();

  return { fixed, count, plural, freshness, tempF, tempDetail, boolValue, time };
}

type PanelFormat = ReturnType<typeof makeFormat>;

function formatSensorValue(
  sensor: LiveSensor,
  text: LiveTempsPanelText,
  f: PanelFormat,
  /** Humidity from a paired sensor (same device + key), when there is one. */
  pairedHumidity: number | null = null,
): { primary: string; detail: string } {
  switch (sensor.kind) {
    case "temperature":
      if (sensor.temp) {
        // The API reports 0 when a probe has no humidity sensor; don't show
        // that as a real 0% reading.
        const humidity =
          pairedHumidity ?? (sensor.temp.h > 0 ? sensor.temp.h : null);
        return {
          primary: `${f.tempF(sensor.temp.f)}`,
          detail:
            humidity != null
              ? f.tempDetail(sensor.temp.c, humidity)
              : `${f.fixed(sensor.temp.c, 1)}°C`,
        };
      }
      if (sensor.value_num != null) {
        return {
          primary: `${f.fixed(sensor.value_num, 1)}${sensor.unit ? ` ${sensor.unit}` : "°F"}`,
          detail: sensor.deviceName,
        };
      }
      break;
    case "humidity":
      if (sensor.value_num != null) {
        return {
          primary: `${f.fixed(sensor.value_num, 0)}%`,
          detail: text.details.humidity,
        };
      }
      break;
    case "co2":
      if (sensor.value_num != null) {
        return {
          primary: `${f.count(Math.round(sensor.value_num))} ${sensor.unit ?? "ppm"}`,
          detail: text.details.co2,
        };
      }
      break;
    case "pressure":
      if (sensor.value_num != null) {
        return {
          primary: `${f.fixed(sensor.value_num, 1)} ${sensor.unit ?? "hPa"}`,
          detail: text.details.pressure,
        };
      }
      break;
    case "pm25":
      if (sensor.value_num != null) {
        return {
          primary: `${f.fixed(sensor.value_num, 1)} ${sensor.unit ?? "µg/m³"}`,
          detail: text.details.pm25,
        };
      }
      break;
    case "voc":
      if (sensor.value_num != null) {
        return {
          primary: `${f.count(Math.round(sensor.value_num))} ${sensor.unit ?? "ppb"}`,
          detail: text.details.voc,
        };
      }
      break;
    case "level":
      if (sensor.value_num != null) {
        return {
          primary: `${f.fixed(sensor.value_num, 0)}${sensor.unit ? ` ${sensor.unit}` : "%"}`,
          detail: text.details.level,
        };
      }
      break;
    case "energy":
      if (sensor.value_num != null) {
        return {
          primary: `${f.fixed(sensor.value_num, 0)} ${sensor.unit ?? "W"}`,
          detail: text.details.energy,
        };
      }
      break;
    case "door":
    case "power":
    case "flood":
    case "motion":
      return {
        primary:
          sensor.value_bool == null
            ? "—"
            : f.boolValue(sensor.kind, sensor.value_bool),
        detail: (text.details as Record<string, string>)[sensor.kind] ?? sensor.kind,
      };
    default:
      if (sensor.value_bool != null) {
        return {
          primary: sensor.value_bool ? text.values.true : text.values.false,
          detail: sensor.kind,
        };
      }
      if (sensor.value_num != null) {
        return {
          primary: `${sensor.value_num}${sensor.unit ? ` ${sensor.unit}` : ""}`,
          detail: sensor.kind,
        };
      }
      if (sensor.value_text) {
        return { primary: sensor.value_text, detail: sensor.kind };
      }
  }

  return { primary: "—", detail: text.noReading };
}

function isSensorAlert(sensor: LiveSensor): boolean {
  if (sensor.kind === "door" && sensor.value_bool === true) return true;
  if (sensor.kind === "flood" && sensor.value_bool === true) return true;
  if (sensor.kind === "power" && sensor.value_bool === false) return true;
  if (sensor.kind === "motion" && sensor.value_bool === true) return true;
  if (sensor.kind === "co2" && sensor.value_num != null && sensor.value_num >= 1000) {
    return true;
  }
  if (sensor.kind === "pm25" && sensor.value_num != null && sensor.value_num >= 35) {
    return true;
  }
  if (sensor.kind === "voc" && sensor.value_num != null && sensor.value_num >= 400) {
    return true;
  }
  if (sensor.kind === "level" && sensor.value_num != null && sensor.value_num >= 80) {
    return true;
  }
  return false;
}

export default function LiveTempsPanel({
  intervalMs = 30000,
  text = LIVE_TEMPS_PANEL_TEXT_EN,
  locale,
}: Props) {
  const f = useMemo(() => makeFormat(text, locale), [text, locale]);
  const [groups, setGroups] = useState<FeedGroup[]>([]);
  const [sensors, setSensors] = useState<LiveSensor[]>([]);
  const [spaces, setSpaces] = useState<string[]>([]);
  const [spaceFilter, setSpaceFilter] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(intervalMs / 1000);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [offlineStale, setOfflineStale] = useState(false);

  const loadReadings = useCallback(async (signal?: AbortSignal) => {
    try {
      const qs = spaceFilter
        ? `?space=${encodeURIComponent(spaceFilter)}`
        : "";
      const response = await fetch(`/api/home/readings${qs}`, {
        credentials: "same-origin",
        signal,
      });

      if (signal?.aborted) return;
      if (!response.ok) {
        throw new Error(text.refreshError);
      }

      const payload = (await response.json()) as {
        groups: FeedGroup[];
        sensors?: LiveSensor[];
        spaces?: string[];
        updatedAt: string;
      };

      if (signal?.aborted) return;
      setGroups(payload.groups ?? []);
      setSensors(payload.sensors ?? []);
      if (payload.spaces) setSpaces(payload.spaces);
      setUpdatedAt(payload.updatedAt);
      setOfflineStale(
        response.headers.get("X-ProbeHarbor-Stale") === "1" ||
          response.headers.get("X-Garage-Temp-Stale") === "1",
      );
      setError(null);
      setCountdown(intervalMs / 1000);
    } catch (e) {
      if (signal?.aborted || (e instanceof DOMException && e.name === "AbortError")) {
        return;
      }
      // Network failures (TypeError) carry browser wording; show our own.
      setError(
        e instanceof Error && (!locale || locale.toLowerCase().startsWith("en") || !(e instanceof TypeError))
          ? e.message
          : text.refreshFailed,
      );
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [intervalMs, spaceFilter, text, locale]);

  useEffect(() => {
    const ac = new AbortController();
    void loadReadings(ac.signal);
    return () => ac.abort();
  }, [loadReadings]);

  useEffect(() => {
    let es: EventSource | null = null;
    try {
      es = new EventSource("/api/home/readings/stream");
      es.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "readings") void loadReadings();
        } catch {
          /* ignore malformed SSE payloads */
        }
      };
      es.onerror = () => {
        /* Browser reconnects; polling remains as backup. Avoid noisy logs. */
      };
    } catch {
      /* SSE unavailable — polling fallback remains */
    }
    return () => es?.close();
  }, [loadReadings]);

  useEffect(() => {
    const tick = window.setInterval(() => {
      if (document.visibilityState === "hidden") return;
      setCountdown((current) => {
        if (current <= 1) {
          void loadReadings();
          return intervalMs / 1000;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(tick);
  }, [intervalMs, loadReadings]);

  useEffect(() => {
    const onRefresh = () => void loadReadings();
    const onVisibility = () => {
      if (document.visibilityState === "visible") void loadReadings();
    };
    window.addEventListener(LIVE_REFRESH_EVENT, onRefresh);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener(LIVE_REFRESH_EVENT, onRefresh);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [loadReadings]);

  useEffect(() => {
    const groupCount = groups.reduce((n, group) => n + (group.probes?.length ?? 0), 0);
    window.dispatchEvent(
      new CustomEvent(LIVE_READINGS_EVENT, {
        detail: {
          lastReadingAt: newestLiveReadingAt(sensors, updatedAt),
          sensorCount: sensors.length + groupCount,
        },
      }),
    );
  }, [sensors, groups, updatedAt]);

  const nonTempSensors = useMemo(
    () => sensors.filter((s) => s.kind !== "temperature" && s.kind !== "humidity"),
    [sensors],
  );

  // Prefer kind-aware climate cards when present; fall back to feed groups.
  // Humidity paired with a temperature probe (same device + key) shows on the
  // temperature tile instead of its own. Fresh tiles lead; probes with no
  // reading for 2h+ (or ever) collapse into an "Offline probes" group.
  const pairKey = (s: LiveSensor) => `${s.deviceId}:${s.key}`;
  const pairedHumidity = useMemo(() => {
    const byKey = new Map<string, number>();
    for (const s of sensors) {
      if (s.kind === "humidity" && s.value_num != null) byKey.set(pairKey(s), s.value_num);
    }
    return byKey;
  }, [sensors]);
  const temperatureCards = useMemo(() => {
    const tempKeys = new Set(sensors.filter((s) => s.kind === "temperature").map(pairKey));
    const rank = (s: LiveSensor) => {
      const age = formatRelativeAge(s.recorded_at ?? null);
      return age.stale ? 2 : age.lagging ? 1 : 0;
    };
    return sensors
      .filter(
        (s) => s.kind === "temperature" || (s.kind === "humidity" && !tempKeys.has(pairKey(s))),
      )
      .map((sensor, index) => ({ sensor, index, rank: rank(sensor) }))
      .sort((a, b) => a.rank - b.rank || a.index - b.index);
  }, [sensors]);
  const liveClimateCards = temperatureCards.filter((c) => c.rank < 2).map((c) => c.sensor);
  const offlineClimateCards = temperatureCards.filter((c) => c.rank === 2).map((c) => c.sensor);

  const laggingSensors = useMemo(() => {
    return sensors
      .map((sensor) => {
        if (!sensor.recorded_at) {
          return { sensor, age: formatRelativeAge(null) };
        }
        const age = formatRelativeAge(sensor.recorded_at);
        return age.lagging ? { sensor, age } : null;
      })
      .filter((row): row is { sensor: LiveSensor; age: ReturnType<typeof formatRelativeAge> } =>
        Boolean(row),
      );
  }, [sensors]);

  const renderClimateCard = (sensor: LiveSensor) => {
    const display = formatSensorValue(sensor, text, f, pairedHumidity.get(pairKey(sensor)) ?? null);
    const age = sensor.recorded_at
      ? formatRelativeAge(sensor.recorded_at)
      : formatRelativeAge(null);
    const freshnessClass = age.stale
      ? " stat-item-stale"
      : age.lagging
        ? " stat-item-lagging"
        : "";
    return (
      <article
        class={`stat-item${freshnessClass}`}
        key={`${sensor.deviceId}:${sensor.key}:${sensor.kind}`}
      >
        <span class="stat-label">{sensor.label}</span>
        <p class="stat-value">{display.primary}</p>
        <p class="stat-detail">
          {display.detail}
          {sensor.deviceName ? ` · ${sensor.deviceName}` : ""}
        </p>
        <p
          class={`stat-detail m-0${
            age.lagging ? " text-[var(--color-warning)]" : ""
          }`}
        >
          {f.freshness(sensor.recorded_at, sensor.deviceSource ?? null)}
        </p>
      </article>
    );
  };

  const hasAnySensors =
    temperatureCards.length > 0 || groups.length > 0 || sensors.length > 0;

  if (loading && groups.length === 0 && sensors.length === 0) {
    return (
      <section class="card animate-slide-in-left">
        <p class="live-refresh-note m-0">{text.loading}</p>
      </section>
    );
  }

  return (
    <section class="card animate-slide-in-left">
      <h2 class="card-title">{text.title}</h2>
      <p class="card-subtitle">{text.subtitle}</p>

      {spaces.length > 0 && (
        <div class="mb-4">
          <label class="form-label" for="space-filter">
            {text.spaceLabel}
          </label>
          <select
            id="space-filter"
            class="form-input"
            value={spaceFilter}
            onChange={(e) =>
              setSpaceFilter((e.target as HTMLSelectElement).value)
            }
          >
            <option value="">{text.allSpaces}</option>
            {spaces.map((space) => (
              <option value={space} key={space}>
                {space}
              </option>
            ))}
          </select>
        </div>
      )}

      {error && (
        <div class="alert-warning mb-4">
          <p class="m-0">{error}</p>
          <button type="button" class="btn-secondary mt-3" onClick={() => void loadReadings()}>
            {text.retryNow}
          </button>
        </div>
      )}

      {laggingSensors.length > 0 && (
        <div class="alert-warning mb-4" role="status">
          <p class="m-0 font-medium">
            {laggingSensors.length === 1
              ? `${laggingSensors[0]!.sensor.label} — ${f.freshness(
                  laggingSensors[0]!.sensor.recorded_at,
                  laggingSensors[0]!.sensor.deviceSource ?? null,
                )}`
              : f.plural(text.laggingMany, laggingSensors.length)}
          </p>
          {laggingSensors.length > 1 && (
            <ul class="mb-0 mt-2 pl-5 text-sm">
              {laggingSensors.slice(0, 4).map(({ sensor }) => (
                <li key={`${sensor.deviceId}:${sensor.key}`}>
                  {/* Sensor labels repeat across devices ("Temp1"); the device name tells them apart. */}
                  {sensor.deviceName && sensor.deviceName !== sensor.label
                    ? `${sensor.deviceName} · ${sensor.label}`
                    : sensor.label}{" "}
                  —{" "}
                  {f.freshness(sensor.recorded_at, sensor.deviceSource ?? null)}
                </li>
              ))}
              {laggingSensors.length > 4 && (
                <li class="list-none -ml-5 text-[var(--color-text-muted)]">
                  {fill(text.andMore, { count: f.count(laggingSensors.length - 4) })}
                </li>
              )}
            </ul>
          )}
          <p class="mb-0 mt-3 text-sm">
            <a class="text-link" href="/dashboard/devices">{text.checkDevices}</a>
            {" · "}
            <a class="text-link" href="/about/debugging-stale-readings">{text.debugStale}</a>
          </p>
        </div>
      )}

      {temperatureCards.length > 0 ? (
        <>
          {liveClimateCards.length > 0 && (
            <div class="stat-grid mb-6">{liveClimateCards.map(renderClimateCard)}</div>
          )}
          {offlineClimateCards.length > 0 && (
            <details class="live-offline-probes mb-6" open={liveClimateCards.length === 0}>
              <summary class="text-sm cursor-pointer text-[var(--color-text-muted)]">
                {fill(text.offlineProbes, { count: f.count(offlineClimateCards.length) })}
              </summary>
              <div class="stat-grid mt-3">{offlineClimateCards.map(renderClimateCard)}</div>
            </details>
          )}
        </>
      ) : groups.length > 0 ? (
        <div class="feed-groups mb-6">
          {groups.map((group) => (
            <section class="feed-group" key={group.feedId}>
              <div class="feed-group-header">
                <h3 class="feed-group-title">{group.feedName}</h3>
                {!group.enabled && <span class="feed-group-badge">{text.disabled}</span>}
              </div>

              {group.error && (
                <div class="alert-warning mb-4">
                  <p class="m-0">{group.error}</p>
                </div>
              )}

              {group.probes.length === 0 ? (
                <p class="stat-detail m-0">{text.noProbes}</p>
              ) : (
                <div class="stat-grid">
                  {group.probes.map((probe) => (
                    <article class="stat-item" key={probe.key}>
                      <span class="stat-label">{probe.label}</span>
                      {probe.data ? (
                        <>
                          <p class="stat-value">{f.tempF(probe.data.f)}</p>
                          <p class="stat-detail">{f.tempDetail(probe.data.c, probe.data.h)}</p>
                        </>
                      ) : (
                        <p class="stat-detail">{fill(text.noReadingForKey, { key: probe.key })}</p>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      ) : !hasAnySensors ? (
        <div class="empty-state">
          <p class="empty-state-title mb-2">{text.emptyTitle}</p>
          <p class="mb-4">{text.emptyBody}</p>
          <div class="empty-state-actions">
            <a class="btn-primary" href="/dashboard/devices?view=setup">
              {text.openDevices}
            </a>
            <a class="btn-secondary" href="/dashboard/alerts?tab=settings#alert-section-essentials">
              {text.alertEssentials}
            </a>
            <a class="btn-ghost" href="/about/probe-demo">
              {text.probeSimulator}
            </a>
          </div>
        </div>
      ) : null}

      {nonTempSensors.length > 0 && (
        <>
          <h3 class="feed-group-title mb-3">{text.otherSensors}</h3>
          <div class="stat-grid">
            {nonTempSensors.map((sensor) => {
              const display = formatSensorValue(sensor, text, f);
              const age = sensor.recorded_at
                ? formatRelativeAge(sensor.recorded_at)
                : formatRelativeAge(null);
              const alert = isSensorAlert(sensor);
              const freshnessClass = age.stale
                ? " stat-item-stale"
                : age.lagging
                  ? " stat-item-lagging"
                  : "";
              return (
                <article
                  class={`stat-item${freshnessClass}${alert ? " stat-item-alert" : ""}`}
                  key={`${sensor.deviceId}:${sensor.key}:${sensor.kind}`}
                >
                  <span class="stat-label">{sensor.label}</span>
                  <p class={`stat-value${alert ? " text-[var(--color-danger)]" : ""}`}>
                    {display.primary}
                  </p>
                  <p class="stat-detail">
                    {display.detail} · {sensor.deviceName}
                  </p>
                  <p
                    class={`stat-detail m-0${
                      age.lagging ? " text-[var(--color-warning)]" : ""
                    }`}
                  >
                    {f.freshness(sensor.recorded_at, sensor.deviceSource ?? null)}
                  </p>
                </article>
              );
            })}
          </div>
        </>
      )}

      <p class="live-refresh-note">
        {offlineStale && (
          <span class="text-[var(--color-warning)]">{`${text.cachedOffline} `}</span>
        )}
        {updatedAt
          ? fill(text.updated, { time: f.time(updatedAt), seconds: f.count(countdown) })
          : fill(text.nextRefresh, { seconds: f.count(countdown) })}
      </p>
    </section>
  );
}
