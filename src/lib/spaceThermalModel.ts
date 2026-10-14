import {
  estimateTimeToFreeze,
  formatDurationHours,
  type TempSample,
} from "./timeToFreeze";

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

export function formatHitsAtLabel(
  iso: string,
  timeZone: string,
  now = new Date(),
): string {
  const hits = new Date(iso);
  if (Number.isNaN(hits.getTime())) return iso;
  const timeOpts: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
  };
  let time: string;
  try {
    time = new Intl.DateTimeFormat("en-US", { ...timeOpts, timeZone }).format(hits);
  } catch {
    time = new Intl.DateTimeFormat("en-US", {
      ...timeOpts,
      timeZone: "UTC",
    }).format(hits);
  }

  const hitsDay = calendarDayKey(hits, timeZone);
  const nowDay = calendarDayKey(now, timeZone);
  if (hitsDay === nowDay) return time;

  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  if (hitsDay === calendarDayKey(tomorrow, timeZone)) return `${time} tomorrow`;

  try {
    const weekday = new Intl.DateTimeFormat("en-US", {
      timeZone,
      weekday: "short",
    }).format(hits);
    return `${weekday} ${time}`;
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
}): TimeToFreezeProjection {
  const nowMs = input.nowMs ?? Date.now();
  const lookAheadHours = input.lookAheadHours ?? 12;
  const timeZone = input.timeZone ?? "UTC";
  const thresholdLabel = input.useCelsius
    ? `${(((input.freezeThresholdF - 32) * 5) / 9).toFixed(0)}°C`
    : `${input.freezeThresholdF}°F`;

  const trend = estimateTimeToFreeze(
    input.currentTempF,
    input.freezeThresholdF,
    input.indoorSamples,
  );

  if (input.currentTempF <= input.freezeThresholdF) {
    return {
      hours: 0,
      hitsAtIso: new Date(nowMs).toISOString(),
      hitsAtLabel: formatHitsAtLabel(new Date(nowMs).toISOString(), timeZone, new Date(nowMs)),
      confidence: "high",
      source: "already_below",
      currentTempF: input.currentTempF,
      freezeThresholdF: input.freezeThresholdF,
      rateFPerHour: trend.rateFPerHour,
      params: null,
      lookAheadHours,
      message: trend.message,
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
    const label = (iso: string) => formatHitsAtLabel(iso, timeZone, new Date(nowMs));
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
    });
    if (projected.hours != null && projected.hitsAtIso) {
      const hitsAtLabel = formatHitsAtLabel(
        projected.hitsAtIso,
        timeZone,
        new Date(nowMs),
      );
      const doorNote = input.doorOpenNearby
        ? " A door is open: heat loss will be faster until it closes."
        : "";
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
        message: `Hits ${thresholdLabel} around ${hitsAtLabel} (about ${formatDurationHours(projected.hours)}). Forecast-backed from this space's lag vs outdoor.${doorNote}`,
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
      message: `No freeze in the next ${lookAheadHours}h at this space's typical lag vs the outdoor forecast.${
        window ? ` A night ${band}°F colder than expected would reach it around ${window.earliestLabel}.` : ""
      }`,
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
    const hitsAtLabel = formatHitsAtLabel(hitsAtIso, timeZone, new Date(nowMs));
    const atHours = (hours: number) => new Date(nowMs + hours * 60 * 60 * 1000).toISOString();
    const earliestIso = atHours(trend.hours / (1 + TREND_WINDOW_RATE_SPREAD));
    const latestIso = atHours(trend.hours / (1 - TREND_WINDOW_RATE_SPREAD));
    const reasons = [
      trend.rateFPerHour != null
        ? `Cooling about ${Math.abs(trend.rateFPerHour).toFixed(1)}°F/hr${
            elapsedHours != null ? ` over the last ${formatDurationHours(elapsedHours)}` : ""
          }.`
        : null,
      "No outdoor forecast for this space yet, so this assumes the current cooling rate holds.",
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
      message: `${trend.message} Around ${hitsAtLabel} if this cooling rate holds.`,
      window: {
        earliestIso,
        earliestLabel: formatHitsAtLabel(earliestIso, timeZone, new Date(nowMs)),
        latestIso,
        latestLabel: formatHitsAtLabel(latestIso, timeZone, new Date(nowMs)),
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
    message: trend.message,
  };
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
}): string[] {
  const reasons: string[] = [];
  const horizonMs = input.nowMs + input.lookAheadHours * 60 * 60 * 1000;
  const ahead = input.outdoorForecast.filter((p) => p.atMs >= input.nowMs && p.atMs <= horizonMs);
  const low = ahead.reduce<OutdoorHourlyPoint | null>((min, p) => (!min || p.tempF < min.tempF ? p : min), null);
  if (low) {
    reasons.push(
      `Outdoor forecast low of ${Math.round(low.tempF)}°F around ${formatHitsAtLabel(
        new Date(low.atMs).toISOString(),
        input.timeZone,
        new Date(input.nowMs),
      )}.`,
    );
  }
  const offset = Math.round(input.params.offsetF);
  reasons.push(
    offset === 0
      ? "This space usually sits right at the outdoor temperature."
      : `This space usually runs about ${Math.abs(offset)}°F ${offset > 0 ? "warmer" : "colder"} than outdoors.`,
  );
  reasons.push(
    input.params.fittedCoupling
      ? `How fast it follows outdoor air is learned from ${input.params.sampleCount} paired readings.`
      : `How fast it follows outdoor air is a default until there's more history (${input.params.sampleCount} paired readings so far).`,
  );
  if (input.rateFPerHour != null && input.rateFPerHour < -0.05) {
    reasons.push(`Cooling about ${Math.abs(input.rateFPerHour).toFixed(1)}°F/hr right now.`);
  }
  if (input.doorOpenNearby) reasons.push("A door is open nearby, so it's assumed to lose heat faster.");
  reasons.push(`The window assumes the space runs up to ${input.band}°F colder or milder than usual.`);
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
): string | null {
  if (!settings.enabled || !settings.runwayAlertEnabled) return null;
  const lookAhead = settings.forecastHoursAhead || projection.lookAheadHours;
  if (!shouldAlertOnRunway(projection, lookAhead)) return null;
  const clock = projection.hitsAtLabel ? ` around ${projection.hitsAtLabel}` : "";
  const hoursLabel =
    projection.hours != null ? formatDurationHours(projection.hours) : "a few hours";
  return `This space is projected to hit ${settings.freezeThresholdF}°F${clock} (in ${hoursLabel}). Drip faucets or turn on heat now: you still have a window before the probe crosses freeze.`;
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
