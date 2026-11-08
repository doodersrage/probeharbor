import * as neonDoors from "./db/doors";
import { computeDoorOpenSessions, type DoorOpenSession } from "./doorDuration";
import { fetchRecentBoolReadings } from "./sensorReadings";

export type DoorEventRow = {
  id: string;
  household_id: string;
  label: string;
  opened_at: string;
  closed_at: string | null;
  duration_ms: number | null;
};

export type DoorEventInsert = {
  household_id: string;
  sensor_id: string | null;
  label: string;
  opened_at: string;
  closed_at: string | null;
  duration_ms: number | null;
};

/** Duplicate key for a session: door label + the instant it opened (text format can vary). */
export function doorEventKey(label: string, openedAt: string): string {
  return `${label}:${Date.parse(openedAt)}`;
}

/** Build insert rows for closed sessions, skipping duplicates already in `existingKeys` (see doorEventKey). */
export function buildDoorEventRows(
  householdId: string,
  sessions: DoorOpenSession[],
  existingKeys: Set<string>,
  sensorIdByLabel?: Map<string, string>,
): DoorEventInsert[] {
  return sessions
    .filter((s) => !s.stillOpen && s.closedAt && s.durationMs != null)
    .filter((s) => !existingKeys.has(doorEventKey(s.label, s.openedAt)))
    .map((s) => ({
      household_id: householdId,
      sensor_id: sensorIdByLabel?.get(s.label) ?? null,
      label: s.label,
      opened_at: s.openedAt,
      closed_at: s.closedAt,
      duration_ms: s.durationMs,
    }));
}

export async function persistDoorSessions(
  householdId: string,
  sessions: DoorOpenSession[],
  sensorIdByLabel?: Map<string, string>,
): Promise<void> {
  const closed = sessions.filter((s) => !s.stillOpen && s.closedAt && s.durationMs != null);
  if (closed.length === 0) return;
  // Look up saved sessions from the earliest candidate on, not a fixed 48 h:
  // a door open for days opened earlier than that, and saving runs on every
  // "closed" report, so a fixed window would re-save it each time.
  const since = new Date(Math.min(...closed.map((s) => Date.parse(s.openedAt)))).toISOString();
  let saved: Array<{ label: string; opened_at: string }>;
  try {
    saved = await neonDoors.savedSessionKeysSince(householdId, since);
  } catch (error) {
    throw new Error(`door_open_events fetch failed: ${error instanceof Error ? error.message : error}`);
  }
  const existing = new Set(saved.map((r) => doorEventKey(r.label, r.opened_at)));
  const rows = buildDoorEventRows(householdId, sessions, existing, sensorIdByLabel);
  try {
    await neonDoors.insertDoorSessions(rows);
  } catch (error) {
    throw new Error(`door_open_events insert failed: ${error instanceof Error ? error.message : error}`);
  }
}

/** How far back to read a door's readings; a longer open stretch is found by findOpenStartBefore. */
const DOOR_SESSION_LOOKBACK_MS = 24 * 60 * 60 * 1000;

/**
 * A door that was already open at `beforeIso`: when did that open stretch
 * begin? The first "open" reading after the last "closed" reading before
 * `beforeIso` (or the first "open" reading on record). Two small indexed
 * queries; null when there's no earlier open reading (raw readings are
 * kept 90 days).
 */
export async function findOpenStartBefore(
  householdId: string,
  sensorId: string,
  beforeIso: string,
): Promise<string | null> {
  try {
    return await neonDoors.findOpenStartBefore(householdId, sensorId, beforeIso);
  } catch (error) {
    throw new Error(`door open-start lookup failed: ${error instanceof Error ? error.message : error}`);
  }
}

/**
 * A door's open/close sessions from `sinceIso` on. When the door was already
 * open at the start of the window, the first session starts when it really
 * opened (possibly days earlier), not at the window edge or not at all.
 */
export async function readDoorSessions(
  householdId: string,
  sensor: { id: string; label: string },
  sinceIso: string,
): Promise<DoorOpenSession[]> {
  const readings = await fetchRecentBoolReadings(householdId, sensor.id, sinceIso);
  if (readings[0]?.value === true) {
    const start = await findOpenStartBefore(householdId, sensor.id, readings[0].recordedAt);
    if (start) readings.unshift({ value: true, recordedAt: start });
  }
  return computeDoorOpenSessions(
    readings.map((r) => ({ label: sensor.label, kind: "door", value: r.value, recordedAt: r.recordedAt })),
  );
}

/**
 * Save the finished open/close sessions for these door sensors.
 *
 * Called from ingest whenever a door reports "closed", so door history is
 * kept whether or not anyone has alert rules. (Before, sessions were only
 * saved while rules were evaluated, and raw door readings are pruned after
 * 90 days without a rollup.) The rule pass still saves too; duplicates are
 * skipped by `persistDoorSessions`.
 */
export async function recordDoorSessions(
  householdId: string,
  sensors: Array<{ id: string; label: string }>,
  now = Date.now(),
): Promise<void> {
  if (sensors.length === 0) return;
  const since = new Date(now - DOOR_SESSION_LOOKBACK_MS).toISOString();
  const sessions: DoorOpenSession[] = [];
  const sensorIdByLabel = new Map<string, string>();
  for (const sensor of sensors) {
    sensorIdByLabel.set(sensor.label, sensor.id);
    sessions.push(...(await readDoorSessions(householdId, sensor, since)));
  }
  await persistDoorSessions(householdId, sessions, sensorIdByLabel);
}

/** The door's last reported state before `beforeIso` (true = open); null when there is none. */
export async function lastDoorStateBefore(
  householdId: string,
  sensorId: string,
  beforeIso: string,
): Promise<boolean | null> {
  try {
    return await neonDoors.lastDoorStateBefore(householdId, sensorId, beforeIso);
  } catch (error) {
    throw new Error(`last door state lookup failed: ${error instanceof Error ? error.message : error}`);
  }
}

/**
 * Ingest entry point: a door just reported "closed" at `closedAt`. Only a
 * door whose previous report was "open" (or unknown) can have finished a
 * session, so repeated "closed" reports (the ProbeHarbor firmware sends the
 * door state every minute) cost one small query instead of a full save.
 */
export async function recordDoorSessionsIfJustClosed(
  householdId: string,
  sensors: Array<{ id: string; label: string }>,
  closedAt: string,
): Promise<void> {
  const justClosed: Array<{ id: string; label: string }> = [];
  for (const sensor of sensors) {
    // Unknown (lookup returned nothing) still records, so a first close isn't lost.
    if ((await lastDoorStateBefore(householdId, sensor.id, closedAt)) !== false) justClosed.push(sensor);
  }
  if (justClosed.length > 0) await recordDoorSessions(householdId, justClosed);
}

export async function listDoorEvents(
  householdId: string,
  limit = 20,
): Promise<DoorEventRow[]> {
  return neonDoors.listDoorEvents(householdId, limit);
}
