import type { ChartDoorBand } from "./chartDoorBands";
import { readDoorSessions } from "./doorEvents";
import { doorBandsOverlapping } from "./db/doors";

/** Most saved sessions read for one chart window. */
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
  let rows: Awaited<ReturnType<typeof doorBandsOverlapping>>;
  try {
    rows = await doorBandsOverlapping(householdId, fromIso, toIso, DOOR_BAND_LIMIT);
  } catch (e) {
    return { bands: [], error: e instanceof Error ? e.message : String(e) };
  }
  if (rows.length === DOOR_BAND_LIMIT) {
    console.warn(`Door bands for household ${householdId}: hit the ${DOOR_BAND_LIMIT}-row limit; oldest not shown`);
  }

  const bands: ChartDoorBand[] = rows
    .filter((row) => typeof row.opened_at === "string")
    .map((row) => ({ label: row.label, openedAt: row.opened_at, closedAt: row.closed_at ?? null }))
    .reverse();

  // A door that is open now has no saved session yet.
  if (Date.parse(toIso) >= now - OPEN_SESSION_LOOKBACK_MS) {
    const since = new Date(now - OPEN_SESSION_LOOKBACK_MS).toISOString();
    for (const sensor of doorSensors) {
      try {
        // Includes a door open since before the 24 h window (true start).
        const sessions = await readDoorSessions(sensor, since);
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
