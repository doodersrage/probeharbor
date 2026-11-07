/**
 * Neon versions of the door-history queries in doorEvents.ts,
 * doorEventReport.ts and chartDoorBands.server.ts. Door sessions are scoped by household; door
 * readings by sensor (callers pass the household's own sensors).
 *
 * Differences from the Supabase path, all deliberate:
 * - Session saves rely on the unique index door_open_events_session_key
 *   (in the baseline), so there is no plain-insert fallback for databases
 *   without it.
 * - The door report reads its rows in one query (Supabase: 1000-row pages).
 */
import type { DoorEventInsert, DoorEventRow } from "../doorEvents";
import { query } from "./client";

export async function savedSessionKeysSince(
  householdId: string,
  sinceIso: string,
): Promise<Array<{ label: string; opened_at: string }>> {
  return query(
    "select label, opened_at from public.door_open_events where household_id = $1 and opened_at >= $2",
    [householdId, sinceIso],
  );
}

/** Insert sessions; ones already saved (same household, label, opened_at) are skipped. Throws on failure. */
export async function insertDoorSessions(rows: DoorEventInsert[]): Promise<void> {
  if (rows.length === 0) return;
  await query(
    `insert into public.door_open_events (household_id, sensor_id, label, opened_at, closed_at, duration_ms)
     select r.household_id, r.sensor_id, r.label, r.opened_at, r.closed_at, r.duration_ms
     from jsonb_to_recordset($1::jsonb) as r(household_id uuid, sensor_id uuid, label text,
          opened_at timestamptz, closed_at timestamptz, duration_ms bigint)
     on conflict (household_id, label, opened_at) do nothing`,
    [JSON.stringify(rows)],
  );
}

/** First "open" reading after the last "closed" one before `beforeIso` (see findOpenStartBefore). Throws on failure. */
export async function findOpenStartBefore(sensorId: string, beforeIso: string): Promise<string | null> {
  const [row] = await query<{ recorded_at: string }>(
    `select r.recorded_at from public.sensor_readings r
     where r.sensor_id = $1 and r.value_bool = true and r.recorded_at < $2
       and r.recorded_at > coalesce((
         select c.recorded_at from public.sensor_readings c
         where c.sensor_id = $1 and c.value_bool = false and c.recorded_at < $2
         order by c.recorded_at desc limit 1
       ), '-infinity'::timestamptz)
     order by r.recorded_at limit 1`,
    [sensorId, beforeIso],
  );
  return row?.recorded_at ?? null;
}

/** Last reported door state before `beforeIso`; null when none. Throws on failure. */
export async function lastDoorStateBefore(sensorId: string, beforeIso: string): Promise<boolean | null> {
  const [row] = await query<{ value_bool: boolean }>(
    `select value_bool from public.sensor_readings
     where sensor_id = $1 and value_bool is not null and recorded_at < $2
     order by recorded_at desc, id desc limit 1`,
    [sensorId, beforeIso],
  );
  return typeof row?.value_bool === "boolean" ? row.value_bool : null;
}

export async function listDoorEvents(householdId: string, limit: number): Promise<DoorEventRow[]> {
  try {
    return await query<DoorEventRow>(
      `select id, household_id, label, opened_at, closed_at, duration_ms from public.door_open_events
       where household_id = $1 order by opened_at desc, id limit $2`,
      [householdId, limit],
    );
  } catch {
    return [];
  }
}

export type DoorReportRow = {
  id: string;
  sensor_id: string | null;
  label: string;
  opened_at: string;
  closed_at: string | null;
  duration_ms: number | null;
};

/** Closed sessions that opened in [from, to], newest first; up to `wanted` rows. Throws on failure. */
export function listClosedDoorSessions(
  householdId: string,
  fromIso: string,
  toIso: string,
  wanted: number,
  doorLabel?: string | null,
): Promise<DoorReportRow[]> {
  return query<DoorReportRow>(
    `select id, sensor_id, label, opened_at, closed_at, duration_ms from public.door_open_events
     where household_id = $1 and opened_at >= $2 and opened_at <= $3 and closed_at is not null
       and ($5::text is null or label = $5)
     order by opened_at desc, id limit $4`,
    [householdId, fromIso, toIso, wanted, doorLabel ?? null],
  );
}

/** sensor_values_before for one batch of times. Throws on failure. */
export function sensorValuesBefore(
  householdId: string,
  sensorIds: string[],
  times: string[],
  maxAgeSeconds: number,
): Promise<Array<{ sensor_id: string; at_time: string; value_num: number | null }>> {
  return query(
    `select sensor_id, at_time, value_num
     from public.sensor_values_before($1, $2::uuid[], $3::timestamptz[], $4)`,
    [householdId, sensorIds, times, maxAgeSeconds],
  );
}

/** Saved sessions overlapping [from, to], newest first, at most `limit`. Throws on failure. */
export function doorBandsOverlapping(
  householdId: string,
  fromIso: string,
  toIso: string,
  limit: number,
): Promise<Array<{ label: string; opened_at: string; closed_at: string | null }>> {
  return query(
    `select label, opened_at, closed_at from public.door_open_events
     where household_id = $1 and opened_at <= $3 and closed_at >= $2
     order by opened_at desc, id limit $4`,
    [householdId, fromIso, toIso, limit],
  );
}
