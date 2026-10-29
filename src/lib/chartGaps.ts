/**
 * Where a chart has no data. Lines shouldn't be drawn straight across a
 * stretch with no readings: that looks like a measured, steady temperature.
 */

/** Never call less than this a gap: hourly rollups and slow pull feeds are normal. */
export const MIN_GAP_MS = 90 * 60 * 1000;
/** A gap is this many typical reporting intervals with nothing in between. */
const GAP_INTERVALS = 4;

export type DataGap = { startMs: number; endMs: number };

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid]! : (sorted[mid - 1]! + sorted[mid]!) / 2;
}

/** With sampled data, a gap is a whole empty bucket: never less than this many bucket widths. */
const SAMPLE_GAP_BUCKETS = 2.5;

/**
 * Gap threshold for one series of sorted timestamps. `sampleIntervalMs`:
 * the bucket width when points are samples (first / lowest / highest per
 * bucket); those sit close together inside a bucket, so the median spacing
 * alone would call every jump to the next bucket a gap.
 */
export function gapThresholdMs(sortedMs: number[], sampleIntervalMs = 0): number {
  const spacings: number[] = [];
  for (let i = 1; i < sortedMs.length; i += 1) {
    const step = sortedMs[i]! - sortedMs[i - 1]!;
    if (step > 0) spacings.push(step);
  }
  return Math.max(MIN_GAP_MS, GAP_INTERVALS * median(spacings), SAMPLE_GAP_BUCKETS * sampleIntervalMs);
}

/** Stretches longer than the threshold between consecutive sorted timestamps. */
export function findGaps(sortedMs: number[], thresholdMs = gapThresholdMs(sortedMs)): DataGap[] {
  const gaps: DataGap[] = [];
  for (let i = 1; i < sortedMs.length; i += 1) {
    const prev = sortedMs[i - 1]!;
    const next = sortedMs[i]!;
    if (next - prev > thresholdMs) gaps.push({ startMs: prev, endMs: next });
  }
  return gaps;
}

/** Periods where none of the series has a reading (each judged by its own cadence). */
export function findSharedGaps(seriesMs: number[][], sampleIntervalMs = 0): DataGap[] {
  const nonEmpty = seriesMs.filter((s) => s.length > 0);
  if (nonEmpty.length === 0) return [];
  let shared = findGaps(nonEmpty[0]!, gapThresholdMs(nonEmpty[0]!, sampleIntervalMs));
  for (const series of nonEmpty.slice(1)) {
    const other = findGaps(series, gapThresholdMs(series, sampleIntervalMs));
    const next: DataGap[] = [];
    for (const a of shared) {
      for (const b of other) {
        const startMs = Math.max(a.startMs, b.startMs);
        const endMs = Math.min(a.endMs, b.endMs);
        if (endMs > startMs) next.push({ startMs, endMs });
      }
    }
    shared = next;
  }
  return shared;
}

/**
 * For each point of a time-sorted series, whether its line segment starts
 * fresh (first point, or after a gap) instead of joining the previous point.
 * Use with moveTo/lineTo so a line isn't drawn across missing data.
 */
export function segmentStarts(sortedMs: number[], thresholdMs = gapThresholdMs(sortedMs)): boolean[] {
  return sortedMs.map((ms, i) => i === 0 || ms - sortedMs[i - 1]! > thresholdMs);
}
