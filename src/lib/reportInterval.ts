/**
 * How often a device normally reports, learned from the gaps between its
 * posts and kept on device meta (`report_interval_s`, median of the last
 * `report_intervals_s`). Freshness labels use it so a device that reports
 * hourly isn't called offline after 30 minutes.
 */
const MAX_SAMPLES = 9;
/** Faster than this is a retry or a burst, not the device's cadence. */
const MIN_GAP_S = 10;
/** A gap this many times the usual interval is an outage, not a new cadence. */
const OUTAGE_FACTOR = 4;
/** Without a learned interval, ignore gaps longer than a day. */
const MAX_FIRST_GAP_S = 24 * 60 * 60;
/** Steady devices stop writing once learned: only a gap this far off the median is recorded. */
const CHANGE_FACTOR = 0.25;

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid]! : (sorted[mid - 1]! + sorted[mid]!) / 2;
}

export function reportIntervalSeconds(meta: unknown): number | null {
  const value = meta && typeof meta === "object" ? (meta as Record<string, unknown>).report_interval_s : null;
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : null;
}

/**
 * The meta fields to write after a post, or null when nothing changed
 * (no previous post, a retry/burst, an outage gap, or a steady device).
 */
export function nextReportInterval(
  meta: unknown,
  lastSeenAt: string | null | undefined,
  nowIso: string,
): { report_intervals_s: number[]; report_interval_s: number } | null {
  if (!lastSeenAt) return null;
  const gapS = (Date.parse(nowIso) - Date.parse(lastSeenAt)) / 1000;
  if (!Number.isFinite(gapS) || gapS < MIN_GAP_S) return null;

  const current = reportIntervalSeconds(meta);
  if (current != null && gapS > OUTAGE_FACTOR * current) return null;
  if (current == null && gapS > MAX_FIRST_GAP_S) return null;

  const raw = meta && typeof meta === "object" ? (meta as Record<string, unknown>).report_intervals_s : null;
  const samples = Array.isArray(raw) ? raw.filter((v): v is number => typeof v === "number" && v > 0) : [];
  const learned = current != null && samples.length >= MAX_SAMPLES;
  if (learned && Math.abs(gapS - current) <= CHANGE_FACTOR * current) return null;

  const next = [...samples, Math.round(gapS)].slice(-MAX_SAMPLES);
  return { report_intervals_s: next, report_interval_s: Math.round(median(next)) };
}
