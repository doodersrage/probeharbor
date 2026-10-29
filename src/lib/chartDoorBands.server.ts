import type { ChartDoorBand } from "./chartDoorBands";
import { computeDoorOpenSessions } from "./doorDuration";
import { fetchRecentBoolReadings } from "./sensorReadings";
import { createServerClient } from "./supabase";

/** PostgREST returns at most this many rows by default (`max_rows`). */
const DOOR_BAND_LIMIT = 1000;
/** Same lookback the ingest and alert paths use to find an open session. */
const OPEN_SESSION_LOOKBACK_MS = 24 * 60 * 60 * 1000;

/**
 * Door-open periods that overlap [fromIso, toIso] for a household: saved
 * sessions from `door_open_events`, plus a door that is open right now
 * (worked out from the last 24 h of readings, as the alert path does).
 * Returns an error instead of throwing, so the chart can still draw.
 */
export async function fetchChartDoorBands(
  householdId: string,
  fromIso: string,
  toIso: string,
  doorSensors: Array<{ id: string; label: string }>,
  now = Date.now(),
): Promise<{ bands: ChartDoorBand[]; error: string | null }> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("door_open_events")
    .select("label, opened_at, closed_at")
    .eq("household_id", householdId)
    .lte("opened_at", toIso)
    .gte("closed_at", fromIso)
    .order("opened_at", { ascending: false })
    .limit(DOOR_BAND_LIMIT);
  if (error) {
    return { bands: [], error: error.message };
  }
  if ((data ?? []).length === DOOR_BAND_LIMIT) {
    console.warn(`Door bands for household ${householdId}: hit the ${DOOR_BAND_LIMIT}-row limit; oldest not shown`);
  }

  const bands: ChartDoorBand[] = (data ?? [])
    .filter((row) => typeof row.opened_at === "string")
    .map((row) => ({
      label: row.label as string,
      openedAt: row.opened_at as string,
      closedAt: (row.closed_at as string | null) ?? null,
    }))
    .reverse();

  // A door that is open now has no saved session yet.
  if (Date.parse(toIso) >= now - OPEN_SESSION_LOOKBACK_MS) {
    const since = new Date(now - OPEN_SESSION_LOOKBACK_MS).toISOString();
    for (const sensor of doorSensors) {
      try {
        const readings = await fetchRecentBoolReadings(sensor.id, since);
        const sessions = computeDoorOpenSessions(
          readings.map((r) => ({ label: sensor.label, kind: "door", value: r.value, recordedAt: r.recordedAt })),
        );
        for (const session of sessions) {
          if (!session.stillOpen) continue;
          bands.push({ label: session.label, openedAt: session.openedAt, closedAt: null });
        }
      } catch (err) {
        console.error(`Door bands: reading door ${sensor.id} failed:`, err);
      }
    }
  }

  return { bands, error: null };
}
