// Browser-safe (imported by the HistoryChart island): no server imports.

type HumidityCandidate = { timestamp: string; humidity: number | null; probeLabel: string };

const measured = (p: HumidityCandidate) => p.humidity != null && Number.isFinite(p.humidity) && p.humidity > 0;

/**
 * Which probe's humidity (and dew point) the chart draws. The chart has one
 * humidity axis, so it shows one probe: among the probes the user hasn't
 * hidden, the one with the most recent humidity reading (ties: more
 * readings). Hidden probes are used only when no visible probe has
 * humidity. Before, it took the first probe with any humidity, which could
 * be one that stopped reporting days ago, so the line ended off-screen.
 * Returns null when no probe has at least two humidity readings.
 */
export function pickHumiditySource(
  points: HumidityCandidate[],
  visibleLabels: ReadonlySet<string>,
  labelOf: (p: HumidityCandidate) => string = (p) => p.probeLabel,
): string | null {
  const stats = new Map<string, { latest: number; count: number }>();
  for (const p of points) {
    if (!measured(p)) continue;
    const ts = Date.parse(p.timestamp);
    if (!Number.isFinite(ts)) continue;
    const label = labelOf(p);
    const s = stats.get(label) ?? { latest: Number.NEGATIVE_INFINITY, count: 0 };
    s.latest = Math.max(s.latest, ts);
    s.count += 1;
    stats.set(label, s);
  }
  const usable = [...stats.entries()].filter(([, s]) => s.count >= 2);
  const visible = usable.filter(([label]) => visibleLabels.has(label));
  const pool = visible.length > 0 ? visible : usable;
  pool.sort(([, a], [, b]) => b.latest - a.latest || b.count - a.count);
  return pool[0]?.[0] ?? null;
}
