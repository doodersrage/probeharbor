import type { DoorStateAtTime } from "./anomalyDetection";
import { computeDoorOpenSessions } from "./doorDuration";
import { fetchRecentBoolReadings } from "./sensorReadings";
import { createServerClient } from "./supabase";

/**
 * A stretch of time a door sensor reported open, for shading the History
 * chart. `closedAt` is null while the latest reading still says open (no
 * close has been reported yet).
 */
export type ChartDoorBand = {
  label: string;
  openedAt: string;
  closedAt: string | null;
};

/** PostgREST returns at most this many rows by default (`max_rows`). */
const DOOR_BAND_LIMIT = 1000;
/** Same lookback the ingest and alert paths use to find an open session. */
const OPEN_SESSION_LOOKBACK_MS = 24 * 60 * 60 * 1000;

function bandEndMs(band: ChartDoorBand): number {
  return band.closedAt ? Date.parse(band.closedAt) : Number.POSITIVE_INFINITY;
}

/** Bands that overlap [minTs, maxTs], clipped to it; open-ended ones run to maxTs. */
export function clipDoorBands(
  bands: ChartDoorBand[],
  minTs: number,
  maxTs: number,
): Array<{ label: string; startMs: number; endMs: number }> {
  const out: Array<{ label: string; startMs: number; endMs: number }> = [];
  for (const band of bands) {
    const start = Date.parse(band.openedAt);
    const end = bandEndMs(band);
    if (!Number.isFinite(start) || Number.isNaN(end)) continue;
    if (end < minTs || start > maxTs) continue;
    out.push({ label: band.label, startMs: Math.max(start, minTs), endMs: Math.min(end, maxTs) });
  }
  return out;
}

/** Bands that cover the instant `ts`. */
export function doorBandsAt(bands: ChartDoorBand[], ts: number): ChartDoorBand[] {
  return bands.filter((band) => {
    const start = Date.parse(band.openedAt);
    return Number.isFinite(start) && start <= ts && ts <= bandEndMs(band);
  });
}

/** How many open periods overlap the window, and which doors they belong to. */
export function summarizeDoorBands(
  bands: ChartDoorBand[],
  minTs: number,
  maxTs: number,
): { count: number; labels: string[] } {
  const clipped = clipDoorBands(bands, minTs, maxTs);
  return { count: clipped.length, labels: [...new Set(clipped.map((b) => b.label))] };
}

/** Door periods in the shape `detectTemperatureAnomalies` takes. */
export function toDoorStates(bands: ChartDoorBand[]): DoorStateAtTime[] {
  return bands.map((band) => ({
    label: band.label,
    open: true,
    recordedAt: band.openedAt,
    until: band.closedAt,
  }));
}

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
