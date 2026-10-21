import {
  estimateTimeToFreeze,
  formatDurationHours,
  type TempSample,
} from "./timeToFreeze";
import { fmt, formatNumber, plural } from "../i18n/format";
import { LOCALE_META, type Locale } from "../i18n/locales";
import { overviewCardsMessages } from "../i18n/messages/app/overviewCards";

export type OutdoorHourlyPoint = { atMs: number; tempF: number };

export type IndoorOutdoorPair = {
  atMs: number;
  indoorF: number;
  outdoorF: number;
};

export type SpaceThermalParams = {
  /** Typical indoor − outdoor offset (°F). Unheated spaces sit above outdoor air. */
  offsetF: number;
  /** Newton cooling constant (1/hour). Higher = tracks outdoor faster. */
  couplingPerHour: number;
  sampleCount: number;
  /** True when coupling was estimated from this space's history, not the default. */
  fittedCoupling: boolean;
};

export type TimeToFreezeSource =
  | "forecast_model"
  | "trend"
  | "already_below"
  | "none";

export type TimeToFreezeConfidence = "low" | "medium" | "high";

export type TimeToFreezeProjection = {
  hours: number | null;
  hitsAtIso: string | null;
  hitsAtLabel: string | null;
  confidence: TimeToFreezeConfidence;
  source: TimeToFreezeSource;
  currentTempF: number;
  freezeThresholdF: number;
  rateFPerHour: number | null;
  params: SpaceThermalParams | null;
  lookAheadHours: number;
  message: string;
  /**
   * Earliest and latest plausible hit times around `hitsAtIso`. `latestIso`
   * null means the mild case doesn't reach the threshold inside the look-ahead.
   * Also set when the likely case misses but a colder-than-forecast night hits.
   */
  window?: TimeToFreezeWindow | null;
  /** Plain-language inputs behind the estimate, so a changed clock can be read. */
  reasons?: string[];
  /** Lowest outdoor forecast inside the look-ahead (forecast-backed estimates only). */
  forecastLowF?: number | null;
};

export type TimeToFreezeWindow = {
  earliestIso: string;
  earliestLabel: string;
  latestIso: string | null;
  latestLabel: string | null;
};

export const DEFAULT_COUPLING_PER_HOUR = 0.22;
const MIN_COUPLING_PER_HOUR = 0.04;
const MAX_COUPLING_PER_HOUR = 1.6;
const PAIR_MAX_GAP_MS = 90 * 60 * 1000;
const STEP_HOURS = 0.25;
const DOOR_OPEN_COUPLING_MULT = 1.75;
/**
 * How far colder or milder than the fitted offset the window's edges assume
 * (°F): outdoor forecast error plus how well this space's lag is known.
 */
const WINDOW_BAND_F: Record<TimeToFreezeConfidence, number> = { high: 3, medium: 5, low: 7 };
/** Trend-only window: the cooling rate running this much faster or slower. */
const TREND_WINDOW_RATE_SPREAD = 0.3;

export function outdoorPointsFromHourly(
  points: Array<{ timestamp: string; tempF?: number; tempf?: number }>,
): OutdoorHourlyPoint[] {
  return points
    .map((point) => {
      const stamp = point.timestamp.endsWith("Z")
        ? point.timestamp
        : `${point.timestamp}Z`;
      const tempF = point.tempF ?? point.tempf;
      return { atMs: Date.parse(stamp), tempF: tempF as number };
    })
    .filter((point) => Number.isFinite(point.atMs) && Number.isFinite(point.tempF))
    .sort((a, b) => a.atMs - b.atMs);
}

export function interpolateOutdoor(
  outdoor: OutdoorHourlyPoint[],
  atMs: number,
): number | null {
  if (outdoor.length === 0) return null;
  if (atMs <= outdoor[0]!.atMs) return outdoor[0]!.tempF;
  const last = outdoor[outdoor.length - 1]!;
  if (atMs >= last.atMs) return last.tempF;
  for (let i = 1; i < outdoor.length; i += 1) {
    const next = outdoor[i]!;
    if (atMs <= next.atMs) {
      const prev = outdoor[i - 1]!;
      const span = next.atMs - prev.atMs;
      if (span <= 0) return next.tempF;
      const t = (atMs - prev.atMs) / span;
      return prev.tempF + t * (next.tempF - prev.tempF);
    }
  }
  return last.tempF;
}

export function pairIndoorOutdoor(
  indoor: TempSample[],
  outdoor: OutdoorHourlyPoint[],
): IndoorOutdoorPair[] {
  if (outdoor.length === 0) return [];
  const pairs: IndoorOutdoorPair[] = [];
  for (const sample of indoor) {
    const atMs = Date.parse(sample.at);
    if (!Number.isFinite(atMs) || !Number.isFinite(sample.tempF)) continue;
    const outdoorF = interpolateOutdoor(outdoor, atMs);
    if (outdoorF == null) continue;
    const nearest = outdoor.reduce((best, point) =>
      Math.abs(point.atMs - atMs) < Math.abs(best.atMs - atMs) ? point : best,
    );
    if (Math.abs(nearest.atMs - atMs) > PAIR_MAX_GAP_MS) continue;
    pairs.push({ atMs, indoorF: sample.tempF, outdoorF });
  }
  return pairs.sort((a, b) => a.atMs - b.atMs);
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length === 0) return 0;
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1]! + sorted[mid]!) / 2;
  }
  return sorted[mid]!;
}

export function fitSpaceThermalParams(
  pairs: IndoorOutdoorPair[],
): SpaceThermalParams | null {
  if (pairs.length < 3) return null;

  const offsetF = Math.max(-5, Math.min(35, median(pairs.map((p) => p.indoorF - p.outdoorF))));
  const couplings: number[] = [];

  for (let i = 1; i < pairs.length; i += 1) {
    const prev = pairs[i - 1]!;
    const next = pairs[i]!;
    const dtHours = (next.atMs - prev.atMs) / (60 * 60 * 1000);
    if (dtHours < 0.25 || dtHours > 8) continue;
    const tEq = (prev.outdoorF + next.outdoorF) / 2 + offsetF;
    const d0 = prev.indoorF - tEq;
    const d1 = next.indoorF - tEq;
    if (Math.abs(d0) < 0.6) continue;
    const ratio = d1 / d0;
    if (!(ratio > 0) || ratio >= 0.999) continue;
    const k = -Math.log(ratio) / dtHours;
    if (k >= MIN_COUPLING_PER_HOUR && k <= MAX_COUPLING_PER_HOUR) {
      couplings.push(k);
    }
  }

  const fittedCoupling = couplings.length >= 3;
  const couplingPerHour = fittedCoupling
    ? median(couplings)
    : DEFAULT_COUPLING_PER_HOUR;

  return {
    offsetF,
    couplingPerHour,
    sampleCount: pairs.length,
    fittedCoupling,
  };
}

function calendarDayKey(date: Date, timeZone: string): string {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  } catch {
    return date.toISOString().slice(0, 10);
  }
}

function fixed(value: number, digits: number, locale: Locale): string {
  return formatNumber(value, locale, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
    useGrouping: false,
  });
}

/** `String(n)` in English as before; locale digits elsewhere. */
function rawNumber(value: number, locale: Locale): string {
  return locale === "en" ? String(value) : formatNumber(value, locale);
}

/**
 * "12 minutes" / "3.5 hours" / "2.1 days". English is `formatDurationHours`
 * from lib/timeToFreeze; other languages use their own plural forms.
 */
export function formatDurationLabel(hours: number, locale: Locale = "en"): string {
  if (locale === "en") return formatDurationHours(hours);
  const t = overviewCardsMessages(locale).thermal;
  if (hours < 1) return plural(t.minutes, Math.round(hours * 60), locale);
  // One decimal place: pick the plural form for "1.0", not "1".
  const pick = (forms: typeof t.hours, value: number) => {
    const rules = new Intl.PluralRules(LOCALE_META[locale].intl, { minimumFractionDigits: 1 });
    const category = rules.select(Number(value.toFixed(1))) as keyof typeof forms;
    return fmt(forms[category] ?? forms.other, { count: fixed(value, 1, locale) });
  };
  if (hours < 48) return pick(t.hours, hours);
  return pick(t.days, hours / 24);
}

export function formatHitsAtLabel(
  iso: string,
  timeZone: string,
  now = new Date(),
  locale: Locale = "en",
): string {
  const hits = new Date(iso);
  if (Number.isNaN(hits.getTime())) return iso;
  const intl = LOCALE_META[locale].intl;
  const t = overviewCardsMessages(locale).thermal;
  const timeOpts: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
  };
  let time: string;
  try {
    time = new Intl.DateTimeFormat(intl, { ...timeOpts, timeZone }).format(hits);
  } catch {
    time = new Intl.DateTimeFormat(intl, {
      ...timeOpts,
      timeZone: "UTC",
    }).format(hits);
  }

  const hitsDay = calendarDayKey(hits, timeZone);
  const nowDay = calendarDayKey(now, timeZone);
  if (hitsDay === nowDay) return time;

  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  if (hitsDay === calendarDayKey(tomorrow, timeZone)) return fmt(t.hitsTomorrow, { time });

  try {
    const weekday = new Intl.DateTimeFormat(intl, {
      timeZone,
      weekday: "short",
    }).format(hits);
    return fmt(t.hitsWeekday, { weekday, time });
  } catch {
    return time;
  }
}

function projectWithForecast(input: {
  currentTempF: number;
  freezeThresholdF: number;
  params: SpaceThermalParams;
  outdoorForecast: OutdoorHourlyPoint[];
  doorOpenNearby: boolean;
  nowMs: number;
  lookAheadHours: number;
}): { hours: number | null; hitsAtIso: string | null; endTempF: number } {
  const horizonMs = input.nowMs + Math.max(3, input.lookAheadHours) * 60 * 60 * 1000;
  const k =
    input.params.couplingPerHour *
    (input.doorOpenNearby ? DOOR_OPEN_COUPLING_MULT : 1);
  const dtMs = STEP_HOURS * 60 * 60 * 1000;
  let temp = input.currentTempF;
  let atMs = input.nowMs;
  let prevTemp = temp;
  let prevMs = atMs;

  while (atMs < horizonMs) {
    atMs += dtMs;
    const outdoorF = interpolateOutdoor(input.outdoorForecast, atMs);
    if (outdoorF == null) break;
    const tEq = outdoorF + input.params.offsetF;
    temp = tEq + (temp - tEq) * Math.exp(-k * STEP_HOURS);
    if (prevTemp > input.freezeThresholdF && temp <= input.freezeThresholdF) {
      const span = prevTemp - temp;
      const frac = span > 0 ? (prevTemp - input.freezeThresholdF) / span : 1;
      const hitMs = prevMs + Math.max(0, Math.min(1, frac)) * dtMs;
      return {
        hours: (hitMs - input.nowMs) / (60 * 60 * 1000),
        hitsAtIso: new Date(hitMs).toISOString(),
        endTempF: temp,
      };
    }
    prevTemp = temp;
    prevMs = atMs;
  }

  return { hours: null, hitsAtIso: null, endTempF: temp };
}

function confidenceFor(
  source: TimeToFreezeSource,
  params: SpaceThermalParams | null,
  trendElapsedHours: number | null,
): TimeToFreezeConfidence {
  if (source === "forecast_model" && params) {
    if (params.fittedCoupling && params.sampleCount >= 24) return "high";
    if (params.sampleCount >= 8) return "medium";
    return "low";
  }
  if (source === "trend") {
    if (trendElapsedHours != null && trendElapsedHours >= 2) return "medium";
    return "low";
  }
  if (source === "already_below") return "high";
  return "low";
}

export function buildTimeToFreezeProjection(input: {
  currentTempF: number;
  freezeThresholdF: number;
  indoorSamples: TempSample[];
  outdoorPast?: OutdoorHourlyPoint[];
  outdoorForecast?: OutdoorHourlyPoint[];
  doorOpenNearby?: boolean;
  nowMs?: number;
  timeZone?: string;
  lookAheadHours?: number;
  useCelsius?: boolean;
}, locale: Locale = "en"): TimeToFreezeProjection {
  const nowMs = input.nowMs ?? Date.now();
  const lookAheadHours = input.lookAheadHours ?? 12;
  const timeZone = input.timeZone ?? "UTC";
  const t = overviewCardsMessages(locale).thermal;
  const thresholdLabel = input.useCelsius
    ? `${fixed(((input.freezeThresholdF - 32) * 5) / 9, 0, locale)}°C`
    : `${rawNumber(input.freezeThresholdF, locale)}°F`;

  const trend = estimateTimeToFreeze(
    input.currentTempF,
    input.freezeThresholdF,
    input.indoorSamples,
  );
  const trendMessage = localizedTrendMessage(trend, input, locale);

  if (input.currentTempF <= input.freezeThresholdF) {
    return {
      hours: 0,
      hitsAtIso: new Date(nowMs).toISOString(),
      hitsAtLabel: formatHitsAtLabel(new Date(nowMs).toISOString(), timeZone, new Date(nowMs), locale),
      confidence: "high",
      source: "already_below",
      currentTempF: input.currentTempF,
      freezeThresholdF: input.freezeThresholdF,
      rateFPerHour: trend.rateFPerHour,
      params: null,
      lookAheadHours,
      message: trendMessage,
    };
  }

  const outdoorPast = input.outdoorPast ?? [];
  const outdoorForecast = input.outdoorForecast ?? [];
  const pairs = pairIndoorOutdoor(input.indoorSamples, outdoorPast);
  const params = fitSpaceThermalParams(pairs);

  if (params && outdoorForecast.length >= 2) {
    const projected = projectWithForecast({
      currentTempF: input.currentTempF,
      freezeThresholdF: input.freezeThresholdF,
      params,
      outdoorForecast,
      doorOpenNearby: input.doorOpenNearby === true,
      nowMs,
      lookAheadHours,
    });
    const source: TimeToFreezeSource = "forecast_model";
    const confidence = confidenceFor(source, params, null);
    const band = WINDOW_BAND_F[confidence];
    const scenario = (offsetDeltaF: number) =>
      projectWithForecast({
        currentTempF: input.currentTempF,
        freezeThresholdF: input.freezeThresholdF,
        params: { ...params, offsetF: params.offsetF + offsetDeltaF },
        outdoorForecast,
        doorOpenNearby: input.doorOpenNearby === true,
        nowMs,
        lookAheadHours,
      });
    const early = scenario(-band);
    const late = scenario(band);
    const label = (iso: string) => formatHitsAtLabel(iso, timeZone, new Date(nowMs), locale);
    const window: TimeToFreezeWindow | null = early.hitsAtIso
      ? {
          earliestIso: early.hitsAtIso,
          earliestLabel: label(early.hitsAtIso),
          latestIso: late.hitsAtIso,
          latestLabel: late.hitsAtIso ? label(late.hitsAtIso) : null,
        }
      : null;
    const forecastLowF = lowestForecastF(outdoorForecast, nowMs, lookAheadHours);
    const reasons = forecastReasons({
      params,
      outdoorForecast,
      nowMs,
      lookAheadHours,
      timeZone,
      rateFPerHour: trend.rateFPerHour,
      doorOpenNearby: input.doorOpenNearby === true,
      band,
      locale,
    });
    if (projected.hours != null && projected.hitsAtIso) {
      const hitsAtLabel = formatHitsAtLabel(
        projected.hitsAtIso,
        timeZone,
        new Date(nowMs),
        locale,
      );
      const doorNote = input.doorOpenNearby ? t.doorNote : "";
      return {
        hours: projected.hours,
        hitsAtIso: projected.hitsAtIso,
        hitsAtLabel,
        confidence,
        source,
        currentTempF: input.currentTempF,
        freezeThresholdF: input.freezeThresholdF,
        rateFPerHour: trend.rateFPerHour,
        params,
        lookAheadHours,
        message:
          fmt(t.forecastHit, {
            threshold: thresholdLabel,
            time: hitsAtLabel,
            duration: formatDurationLabel(projected.hours, locale),
          }) + doorNote,
        window,
        reasons,
        forecastLowF,
      };
    }

    return {
      hours: null,
      hitsAtIso: null,
      hitsAtLabel: null,
      confidence,
      source,
      currentTempF: input.currentTempF,
      freezeThresholdF: input.freezeThresholdF,
      rateFPerHour: trend.rateFPerHour,
      params,
      lookAheadHours,
      message:
        fmt(t.noFreeze, { hours: rawNumber(lookAheadHours, locale) }) +
        (window
          ? fmt(t.noFreezeColderNight, { band: rawNumber(band, locale), time: window.earliestLabel })
          : ""),
      window,
      reasons,
      forecastLowF,
    };
  }

  const sorted = [...input.indoorSamples]
    .filter((s) => Number.isFinite(s.tempF) && s.at)
    .sort((a, b) => Date.parse(a.at) - Date.parse(b.at));
  const elapsedHours =
    sorted.length >= 2
      ? (Date.parse(sorted[sorted.length - 1]!.at) - Date.parse(sorted[0]!.at)) /
        (60 * 60 * 1000)
      : null;

  if (trend.hours != null && trend.hours > 0) {
    const hitsAtIso = new Date(nowMs + trend.hours * 60 * 60 * 1000).toISOString();
    const hitsAtLabel = formatHitsAtLabel(hitsAtIso, timeZone, new Date(nowMs), locale);
    const atHours = (hours: number) => new Date(nowMs + hours * 60 * 60 * 1000).toISOString();
    const earliestIso = atHours(trend.hours / (1 + TREND_WINDOW_RATE_SPREAD));
    const latestIso = atHours(trend.hours / (1 - TREND_WINDOW_RATE_SPREAD));
    const reasons = [
      trend.rateFPerHour != null
        ? elapsedHours != null
          ? fmt(t.reasons.trendCoolingOver, {
              rate: fixed(Math.abs(trend.rateFPerHour), 1, locale),
              duration: formatDurationLabel(elapsedHours, locale),
            })
          : fmt(t.reasons.trendCooling, { rate: fixed(Math.abs(trend.rateFPerHour), 1, locale) })
        : null,
      t.reasons.noForecast,
    ].filter((r): r is string => r != null);
    return {
      hours: trend.hours,
      hitsAtIso,
      hitsAtLabel,
      confidence: confidenceFor("trend", null, elapsedHours),
      source: "trend",
      currentTempF: input.currentTempF,
      freezeThresholdF: input.freezeThresholdF,
      rateFPerHour: trend.rateFPerHour,
      params,
      lookAheadHours,
      message: fmt(t.trendHit, { message: trendMessage, time: hitsAtLabel }),
      window: {
        earliestIso,
        earliestLabel: formatHitsAtLabel(earliestIso, timeZone, new Date(nowMs), locale),
        latestIso,
        latestLabel: formatHitsAtLabel(latestIso, timeZone, new Date(nowMs), locale),
      },
      reasons,
    };
  }

  return {
    hours: null,
    hitsAtIso: null,
    hitsAtLabel: null,
    confidence: "low",
    source: trend.hours === 0 ? "already_below" : "none",
    currentTempF: input.currentTempF,
    freezeThresholdF: input.freezeThresholdF,
    rateFPerHour: trend.rateFPerHour,
    params,
    lookAheadHours,
    message: trendMessage,
  };
}

/**
 * lib/timeToFreeze words its trend message in English; other languages
 * rebuild it here from the same branches.
 */
/** `estimateTimeToFreeze(...).message` in the reader's language (English unchanged). */
export function localizedTrendMessage(
  trend: ReturnType<typeof estimateTimeToFreeze>,
  input: { currentTempF: number; freezeThresholdF: number; indoorSamples: TempSample[] },
  locale: Locale,
): string {
  if (locale === "en") return trend.message;
  const t = overviewCardsMessages(locale).thermal.trend;
  if (input.currentTempF <= input.freezeThresholdF) return t.alreadyBelow;
  const sorted = [...input.indoorSamples]
    .filter((s) => Number.isFinite(s.tempF) && s.at)
    .sort((a, b) => Date.parse(a.at) - Date.parse(b.at));
  if (sorted.length < 2) return t.needMore;
  const elapsedHours =
    (Date.parse(sorted[sorted.length - 1]!.at) - Date.parse(sorted[0]!.at)) / (60 * 60 * 1000);
  if (elapsedHours < 0.25 || trend.rateFPerHour == null) return t.tooClose;
  if (trend.rateFPerHour >= -0.05 || trend.hours == null) {
    return trend.rateFPerHour > 0.1 ? t.rising : t.stable;
  }
  return fmt(t.cooling, {
    rate: fixed(Math.abs(trend.rateFPerHour), 1, locale),
    duration: formatDurationLabel(trend.hours, locale),
    threshold: rawNumber(input.freezeThresholdF, locale),
  });
}

function lowestForecastF(forecast: OutdoorHourlyPoint[], nowMs: number, lookAheadHours: number): number | null {
  const horizonMs = nowMs + lookAheadHours * 60 * 60 * 1000;
  const ahead = forecast.filter((p) => p.atMs >= nowMs && p.atMs <= horizonMs);
  return ahead.length > 0 ? Math.min(...ahead.map((p) => p.tempF)) : null;
}

function forecastReasons(input: {
  params: SpaceThermalParams;
  outdoorForecast: OutdoorHourlyPoint[];
  nowMs: number;
  lookAheadHours: number;
  timeZone: string;
  rateFPerHour: number | null;
  doorOpenNearby: boolean;
  band: number;
  locale: Locale;
}): string[] {
  const { locale } = input;
  const t = overviewCardsMessages(locale).thermal.reasons;
  const reasons: string[] = [];
  const horizonMs = input.nowMs + input.lookAheadHours * 60 * 60 * 1000;
  const ahead = input.outdoorForecast.filter((p) => p.atMs >= input.nowMs && p.atMs <= horizonMs);
  const low = ahead.reduce<OutdoorHourlyPoint | null>((min, p) => (!min || p.tempF < min.tempF ? p : min), null);
  if (low) {
    reasons.push(
      fmt(t.forecastLow, {
        temp: fixed(Math.round(low.tempF) || 0, 0, locale),
        time: formatHitsAtLabel(new Date(low.atMs).toISOString(), input.timeZone, new Date(input.nowMs), locale),
      }),
    );
  }
  const offset = Math.round(input.params.offsetF);
  reasons.push(
    offset === 0
      ? t.offsetZero
      : fmt(offset > 0 ? t.offsetWarmer : t.offsetColder, { offset: rawNumber(Math.abs(offset), locale) }),
  );
  // English as before: the raw count, no digit grouping.
  const sampleVars: Record<string, string> = locale === "en" ? { count: String(input.params.sampleCount) } : {};
  reasons.push(
    plural(
      input.params.fittedCoupling ? t.couplingLearned : t.couplingDefault,
      input.params.sampleCount,
      locale,
      sampleVars,
    ),
  );
  if (input.rateFPerHour != null && input.rateFPerHour < -0.05) {
    reasons.push(fmt(t.coolingNow, { rate: fixed(Math.abs(input.rateFPerHour), 1, locale) }));
  }
  if (input.doorOpenNearby) reasons.push(t.doorOpen);
  reasons.push(fmt(t.band, { band: rawNumber(input.band, locale) }));
  return reasons;
}

export function shouldAlertOnRunway(
  projection: TimeToFreezeProjection,
  lookAheadHours: number,
): boolean {
  if (projection.hours == null || projection.hours <= 0) return false;
  if (projection.hours > lookAheadHours) return false;
  if (projection.source === "none" || projection.source === "already_below") {
    return false;
  }
  if (projection.source === "trend") {
    return projection.confidence !== "low" && projection.hours <= 6;
  }
  if (projection.confidence === "low") return projection.hours <= 4;
  return true;
}

export function evaluateRunwayAlert(
  settings: { enabled: boolean; runwayAlertEnabled: boolean; freezeThresholdF: number; forecastHoursAhead: number },
  projection: TimeToFreezeProjection,
  locale: Locale = "en",
): string | null {
  if (!settings.enabled || !settings.runwayAlertEnabled) return null;
  const lookAhead = settings.forecastHoursAhead || projection.lookAheadHours;
  if (!shouldAlertOnRunway(projection, lookAhead)) return null;
  const t = overviewCardsMessages(locale).thermal;
  const duration =
    projection.hours != null ? formatDurationLabel(projection.hours, locale) : t.aFewHours;
  const threshold = rawNumber(settings.freezeThresholdF, locale);
  return projection.hitsAtLabel
    ? fmt(t.runwayAlertAt, { threshold, time: projection.hitsAtLabel, duration })
    : fmt(t.runwayAlert, { threshold, duration });
}

export function timeToFreezeApiPayload(projection: TimeToFreezeProjection) {
  return {
    hours: projection.hours,
    hits_at: projection.hitsAtIso,
    hits_at_label: projection.hitsAtLabel,
    confidence: projection.confidence,
    source: projection.source,
    message: projection.message,
    rate_f_per_hour: projection.rateFPerHour,
    freeze_threshold_f: projection.freezeThresholdF,
    current_temp_f: projection.currentTempF,
    offset_f: projection.params?.offsetF ?? null,
    coupling_per_hour: projection.params?.couplingPerHour ?? null,
    window_earliest: projection.window?.earliestIso ?? null,
    window_latest: projection.window?.latestIso ?? null,
    reasons: projection.reasons ?? [],
  };
}
