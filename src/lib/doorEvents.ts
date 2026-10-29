import { createServerClient } from "./supabase";
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

/** Build insert rows for closed sessions, skipping duplicates already in `existingKeys`. */
export function buildDoorEventRows(
  householdId: string,
  sessions: DoorOpenSession[],
  existingKeys: Set<string>,
  sensorIdByLabel?: Map<string, string>,
): DoorEventInsert[] {
  return sessions
    .filter((s) => !s.stillOpen && s.closedAt && s.durationMs != null)
    .filter((s) => !existingKeys.has(`${s.label}:${s.openedAt}`))
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

  const supabase = createServerClient();
  const since = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

  const { data: recent, error: fetchError } = await supabase
    .from("door_open_events")
    .select("label, opened_at")
    .eq("household_id", householdId)
    .gte("opened_at", since);

  if (fetchError) {
    throw new Error(`door_open_events fetch failed: ${fetchError.message}`);
  }

  const existing = new Set(
    (recent ?? []).map((r) => `${r.label}:${r.opened_at}`),
  );

  const rows = buildDoorEventRows(householdId, sessions, existing, sensorIdByLabel);
  if (rows.length === 0) return;

  const { error: insertError } = await supabase.from("door_open_events").insert(rows);
  if (insertError) {
    throw new Error(`door_open_events insert failed: ${insertError.message}`);
  }
}

/** How far back to look for the "opened" reading that a close completes. */
const DOOR_SESSION_LOOKBACK_MS = 24 * 60 * 60 * 1000;

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
    const readings = await fetchRecentBoolReadings(sensor.id, since);
    sessions.push(
      ...computeDoorOpenSessions(
        readings.map((r) => ({
          label: sensor.label,
          kind: "door",
          value: r.value,
          recordedAt: r.recordedAt,
        })),
      ),
    );
  }
  await persistDoorSessions(householdId, sessions, sensorIdByLabel);
}

export async function listDoorEvents(
  householdId: string,
  limit = 20,
): Promise<DoorEventRow[]> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("door_open_events")
    .select("id, household_id, label, opened_at, closed_at, duration_ms")
    .eq("household_id", householdId)
    .order("opened_at", { ascending: false })
    .limit(limit);

  return (data ?? []) as DoorEventRow[];
}
