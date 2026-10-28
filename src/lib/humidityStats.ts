/**
 * Humidity helpers for chart points whose humidity may be missing (null).
 * A missing value is skipped, never counted as 0%.
 */
type WithHumidity = { humidity: number | null };

export function averageHumidity(points: WithHumidity[]): number | null {
  const values = points.flatMap((p) => (p.humidity == null || !Number.isFinite(p.humidity) ? [] : [p.humidity]));
  return values.length > 0 ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
}

/** The point with the highest humidity, or null when none has humidity. */
export function wettestPoint<T extends WithHumidity>(points: T[]): (T & { humidity: number }) | null {
  let best: (T & { humidity: number }) | null = null;
  for (const point of points) {
    if (point.humidity == null || !Number.isFinite(point.humidity)) continue;
    if (!best || point.humidity >= best.humidity) best = point as T & { humidity: number };
  }
  return best;
}
