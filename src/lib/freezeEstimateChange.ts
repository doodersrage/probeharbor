import { formatHitsAtLabel, type TimeToFreezeProjection } from "./spaceThermalModel";
import { formatDurationHours } from "./timeToFreeze";
import { createServerClient } from "./supabase";
import type { Json } from "../types/supabase";

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

function f(value: number): string {
  return `${Math.round(value)}°F`;
}

export function explainEstimateChange(
  previous: FreezeEstimateSnapshot | null,
  next: FreezeEstimateSnapshot,
  timeZone: string,
  nowMs = Date.now(),
): FreezeEstimateChange | null {
  if (!previous) return null;
  const prevAt = Date.parse(previous.computedAt);
  if (!Number.isFinite(prevAt) || nowMs - prevAt > MAX_BASELINE_AGE_MS || nowMs - prevAt < 5 * 60 * 1000) return null;
  const now = new Date(nowMs);
  const since = formatHitsAtLabel(previous.computedAt, timeZone, now);
  const label = (iso: string) => formatHitsAtLabel(iso, timeZone, now);

  let headline: string;
  if (previous.hitsAtIso && next.hitsAtIso) {
    const shiftMs = Date.parse(next.hitsAtIso) - Date.parse(previous.hitsAtIso);
    if (!Number.isFinite(shiftMs) || Math.abs(shiftMs) < MIN_SHIFT_MS) return null;
    headline = `${formatDurationHours(Math.abs(shiftMs) / 3_600_000)} ${shiftMs < 0 ? "earlier" : "later"} than the estimate at ${since} (was ${label(previous.hitsAtIso)}).`;
  } else if (!previous.hitsAtIso && next.hitsAtIso) {
    headline = `New since ${since}: no freeze was expected then.`;
  } else if (previous.hitsAtIso && !next.hitsAtIso) {
    headline = `No longer expected to reach freeze. At ${since} it was around ${label(previous.hitsAtIso)}.`;
  } else {
    return null;
  }

  const reasons: string[] = [];
  if (previous.forecastLowF != null && next.forecastLowF != null && Math.abs(next.forecastLowF - previous.forecastLowF) >= 2) {
    reasons.push(`Outdoor forecast low moved from ${f(previous.forecastLowF)} to ${f(next.forecastLowF)}.`);
  }
  if (
    previous.rateFPerHour != null &&
    next.rateFPerHour != null &&
    Math.abs(next.rateFPerHour - previous.rateFPerHour) >= 0.3
  ) {
    const word = (rate: number) => (rate < 0 ? `cooling ${Math.abs(rate).toFixed(1)}°F/hr` : "not cooling");
    reasons.push(`The space went from ${word(previous.rateFPerHour)} to ${word(next.rateFPerHour)}.`);
  }
  if (previous.offsetF != null && next.offsetF != null && Math.abs(next.offsetF - previous.offsetF) >= 2) {
    reasons.push(`Its learned lag behind outdoor air changed from ${Math.round(previous.offsetF)}°F to ${Math.round(next.offsetF)}°F.`);
  }
  if (previous.source !== next.source) {
    if (next.source === "forecast_model") reasons.push("The estimate now uses the outdoor forecast, not just the cooling rate.");
    else if (next.source === "trend") reasons.push("No usable outdoor forecast now, so the estimate uses the cooling rate alone.");
  }
  if (reasons.length === 0) reasons.push("Newer readings and forecast hours; no single input moved much.");
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
): Promise<FreezeEstimateChange | null> {
  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from("freeze_estimate_snapshots")
      .select("data, updated_at")
      .eq("household_id", householdId)
      .maybeSingle();
    const previous = (data?.data as unknown as FreezeEstimateSnapshot | undefined) ?? null;
    const change = explainEstimateChange(previous, next, timeZone, nowMs);
    const storedAt = data?.updated_at ? Date.parse(data.updated_at) : NaN;
    if (!Number.isFinite(storedAt) || nowMs - storedAt >= SNAPSHOT_REFRESH_MS) {
      await supabase
        .from("freeze_estimate_snapshots")
        .upsert({ household_id: householdId, data: next as unknown as Json, updated_at: new Date(nowMs).toISOString() });
    }
    return change;
  } catch (error) {
    console.error("compareAndStoreFreezeEstimate failed:", error);
    return null;
  }
}
