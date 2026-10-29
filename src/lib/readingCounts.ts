import { createServerClient } from "./supabase";

/**
 * How many temperature readings were recorded in a window, and how many at
 * or below a threshold (temperature_reading_counts, migration
 * 20261029210000). `approximate`: older hours are hourly summaries, so
 * `below` is a minimum (hours that only dipped below aren't counted).
 */
export type ReadingCounts = { total: number; below: number; approximate: boolean };

/** null when the function isn't available or fails; callers keep their previous figure. */
export async function fetchTemperatureReadingCounts(
  householdId: string,
  fromIso: string,
  toIso: string,
  thresholdF: number,
  sensorIds: string[] | null = null,
): Promise<ReadingCounts | null> {
  let result: Awaited<ReturnType<ReturnType<typeof createServerClient>["rpc"]>>;
  try {
    result = await createServerClient().rpc("temperature_reading_counts", {
      p_household_id: householdId,
      p_from: fromIso,
      p_to: toIso,
      p_threshold_f: thresholdF,
      p_sensor_ids: sensorIds,
    });
  } catch (err) {
    // A report (e.g. the claims pack) must not fail over a count.
    console.warn("temperature_reading_counts failed:", err);
    return null;
  }
  const { data, error } = result as { data: Array<{ total_count: number; below_count: number; from_rollups: boolean }> | null; error: { message: string } | null };
  if (error) {
    console.warn("temperature_reading_counts unavailable:", error.message);
    return null;
  }
  const row = data?.[0];
  if (!row) return null;
  return { total: Number(row.total_count), below: Number(row.below_count), approximate: row.from_rollups === true };
}

/** Temperature sensor ids matching History's device/probe filter; null = no filter (all). */
export function temperatureSensorIdsForFilter(
  devices: Array<{ name: string; sensors: Array<{ id: string; key: string; kind: string }> }>,
  filters: { feedName?: string; probeKey?: string },
): string[] | null {
  if (!filters.feedName && !filters.probeKey) return null;
  return devices
    .filter((d) => !filters.feedName || d.name === filters.feedName)
    .flatMap((d) => d.sensors)
    .filter((s) => s.kind === "temperature" && (!filters.probeKey || s.key === filters.probeKey))
    .map((s) => s.id);
}
