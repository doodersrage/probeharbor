import * as neonRemaining from "./db/remaining";
import { formatDurationLabel, formatHitsAtLabel, type TimeToFreezeProjection } from "./spaceThermalModel";
import { tempUnitLabel, toDisplayDelta, toDisplayTemp } from "./temperatureFormat";
import { fmt, formatNumber } from "../i18n/format";
import type { Locale } from "../i18n/locales";
import { overviewCardsMessages } from "../i18n/messages/app/overviewCards";

/**
 * "Why did the time-to-freeze estimate move?" Keeps one earlier estimate per
 * property and compares the current one against it.
 */

export type FreezeEstimateSnapshot = {
  computedAt: string;
  hitsAtIso: string | null;
  source: TimeToFreezeProjection["source"];
  forecastLowF: number | null;
  rateFPerHour: number | null;
  offsetF: number | null;
};

export type FreezeEstimateChange = { headline: string; reasons: string[] };

/** The baseline is replaced at most this often, so changes are explained over a meaningful span. */
export const SNAPSHOT_REFRESH_MS = 60 * 60 * 1000;
/** Compare only against estimates from the last day. */
const MAX_BASELINE_AGE_MS = 24 * 60 * 60 * 1000;
/** Moves smaller than this aren't worth a sentence. */
const MIN_SHIFT_MS = 30 * 60 * 1000;

export function snapshotFromProjection(projection: TimeToFreezeProjection, nowMs = Date.now()): FreezeEstimateSnapshot {
  return {
    computedAt: new Date(nowMs).toISOString(),
    hitsAtIso: projection.hours != null && projection.hours > 0 ? projection.hitsAtIso : null,
    source: projection.source,
    forecastLowF: projection.forecastLowF ?? null,
    rateFPerHour: projection.rateFPerHour,
    offsetF: projection.params?.offsetF ?? null,
  };
}

function whole(value: number, locale: Locale): string {
  return formatNumber(Math.round(value) || 0, locale, { useGrouping: false });
}

/** A °F temperature in the display unit, whole degrees ("28°F" / "-2°C"). */
function f(value: number, locale: Locale, useCelsius: boolean): string {
  return `${whole(toDisplayTemp(value, useCelsius), locale)}${tempUnitLabel(useCelsius)}`;
}

export function explainEstimateChange(
  previous: FreezeEstimateSnapshot | null,
  next: FreezeEstimateSnapshot,
  timeZone: string,
  nowMs = Date.now(),
  locale: Locale = "en",
  /** °C wording (the dashboard display preference); snapshots stay °F. */
  useCelsius = false,
): FreezeEstimateChange | null {
  if (!previous) return null;
  const unit = tempUnitLabel(useCelsius);
  const t = overviewCardsMessages(locale).estimateChange;
  const prevAt = Date.parse(previous.computedAt);
  if (!Number.isFinite(prevAt) || nowMs - prevAt > MAX_BASELINE_AGE_MS || nowMs - prevAt < 5 * 60 * 1000) return null;
  const now = new Date(nowMs);
  const since = formatHitsAtLabel(previous.computedAt, timeZone, now, locale);
  const label = (iso: string) => formatHitsAtLabel(iso, timeZone, now, locale);

  let headline: string;
  if (previous.hitsAtIso && next.hitsAtIso) {
    const shiftMs = Date.parse(next.hitsAtIso) - Date.parse(previous.hitsAtIso);
    if (!Number.isFinite(shiftMs) || Math.abs(shiftMs) < MIN_SHIFT_MS) return null;
    headline = fmt(shiftMs < 0 ? t.earlier : t.later, {
      duration: formatDurationLabel(Math.abs(shiftMs) / 3_600_000, locale),
      since,
      was: label(previous.hitsAtIso),
    });
  } else if (!previous.hitsAtIso && next.hitsAtIso) {
    headline = fmt(t.newSince, { since });
  } else if (previous.hitsAtIso && !next.hitsAtIso) {
    headline = fmt(t.noLonger, { since, was: label(previous.hitsAtIso) });
  } else {
    return null;
  }

  const reasons: string[] = [];
  if (previous.forecastLowF != null && next.forecastLowF != null && Math.abs(next.forecastLowF - previous.forecastLowF) >= 2) {
    reasons.push(fmt(t.forecastLow, { from: f(previous.forecastLowF, locale, useCelsius), to: f(next.forecastLowF, locale, useCelsius) }));
  }
  if (
    previous.rateFPerHour != null &&
    next.rateFPerHour != null &&
    Math.abs(next.rateFPerHour - previous.rateFPerHour) >= 0.3
  ) {
    const word = (rate: number) =>
      rate < 0
        ? fmt(t.cooling, {
            // A rate is a difference per hour: ×5/9 in °C, no offset.
            rate: formatNumber(Math.abs(toDisplayDelta(rate, useCelsius)), locale, {
              minimumFractionDigits: 1,
              maximumFractionDigits: 1,
              useGrouping: false,
            }),
            unit,
          })
        : t.notCooling;
    reasons.push(fmt(t.rate, { from: word(previous.rateFPerHour), to: word(next.rateFPerHour) }));
  }
  if (previous.offsetF != null && next.offsetF != null && Math.abs(next.offsetF - previous.offsetF) >= 2) {
    reasons.push(fmt(t.offset, {
        from: whole(toDisplayDelta(previous.offsetF, useCelsius), locale),
        to: whole(toDisplayDelta(next.offsetF, useCelsius), locale),
        unit,
      }));
  }
  if (previous.source !== next.source) {
    if (next.source === "forecast_model") reasons.push(t.nowForecast);
    else if (next.source === "trend") reasons.push(t.nowTrend);
  }
  if (reasons.length === 0) reasons.push(t.noSingle);
  return { headline, reasons };
}

/**
 * Compare against the stored estimate, then store this one if the stored one
 * is over an hour old. Never throws: before the table exists this is a no-op.
 */
export async function compareAndStoreFreezeEstimate(
  householdId: string,
  next: FreezeEstimateSnapshot,
  timeZone: string,
  nowMs = Date.now(),
  locale: Locale = "en",
  useCelsius = false,
): Promise<FreezeEstimateChange | null> {
  try {
    const data = await neonRemaining.getEstimateSnapshot(householdId);
    const previous = (data?.data as unknown as FreezeEstimateSnapshot | undefined) ?? null;
    const change = explainEstimateChange(previous, next, timeZone, nowMs, locale, useCelsius);
    const storedAt = data?.updated_at ? Date.parse(data.updated_at) : NaN;
    if (!Number.isFinite(storedAt) || nowMs - storedAt >= SNAPSHOT_REFRESH_MS) {
      await neonRemaining.saveEstimateSnapshot(householdId, next, new Date(nowMs).toISOString());
    }
    return change;
  } catch (error) {
    console.error("compareAndStoreFreezeEstimate failed:", error);
    return null;
  }
}
