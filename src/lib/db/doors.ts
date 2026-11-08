/**
 * Neon versions of the door-history queries in doorEvents.ts,
 * doorEventReport.ts and chartDoorBands.server.ts. Door sessions are scoped by household; door
 * readings by sensor and household (a sensor id from another household reads
 * as no data). Session inserts refuse a sensor outside the row's household.
 *
 * Differences from the old Supabase code, all deliberate:
 * - Session saves rely on the unique index door_open_events_session_key
 *   (in the baseline), so there is no plain-insert fallback for databases
 *   without it.
 * - The door report reads its rows in one query (before: 1000-row pages).
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

/**
 * Insert sessions; ones already saved (same household, label, opened_at) are
 * skipped. One statement, all or nothing: a row whose sensor_id is not a
 * sensor of that row's household (null sensor_id is allowed) stores nothing
 * and throws. Throws on failure.
 */
export async function insertDoorSessions(rows: DoorEventInsert[]): Promise<void> {
  if (rows.length === 0) return;
  const [result] = await query<{ rejected: number; rejected_sensor_ids: string[] | null }>(
    `with input as (
       select r.household_id, r.sensor_id, r.label, r.opened_at, r.closed_at, r.duration_ms
       from jsonb_to_recordset($1::jsonb) as r(household_id uuid, sensor_id uuid, label text,
            opened_at timestamptz, closed_at timestamptz, duration_ms bigint)
     ), bad as (
       select i.sensor_id from input i
       where i.sensor_id is not null and not exists (
         select 1 from public.device_sensors s join public.devices d on d.id = s.device_id
         where s.id = i.sensor_id and d.household_id = i.household_id)
     ), ins as (
       insert into public.door_open_events (household_id, sensor_id, label, opened_at, closed_at, duration_ms)
       select household_id, sensor_id, label, opened_at, closed_at, duration_ms from input
       where not exists (select 1 from bad)
       on conflict (household_id, label, opened_at) do nothing
       returning 1
     )
     select (select count(*) from bad)::int as rejected,
            (select array_agg(distinct sensor_id) from bad) as rejected_sensor_ids`,
    [JSON.stringify(rows)],
  );
  if (result && result.rejected > 0) {
    const ids = (result.rejected_sensor_ids ?? []).slice(0, 5).join(", ");
    console.error(
      `insertDoorSessions: ${result.rejected} of ${rows.length} session(s) name a sensor outside their household (${ids}); batch not stored`,
    );
    throw new Error("door session names a sensor outside its household");
  }
}

/** First "open" reading after the last "closed" one before `beforeIso` (see findOpenStartBefore). Throws on failure. */
export async function findOpenStartBefore(
  householdId: string,
  sensorId: string,
  beforeIso: string,
): Promise<string | null> {
  const [row] = await query<{ recorded_at: string }>(
    `select r.recorded_at from public.sensor_readings r
     where r.sensor_id = $1 and r.household_id = $3 and r.value_bool = true and r.recorded_at < $2
       and r.recorded_at > coalesce((
         select c.recorded_at from public.sensor_readings c
         where c.sensor_id = $1 and c.household_id = $3 and c.value_bool = false and c.recorded_at < $2
         order by c.recorded_at desc limit 1
       ), '-infinity'::timestamptz)
     order by r.recorded_at limit 1`,
    [sensorId, beforeIso, householdId],
  );
  return row?.recorded_at ?? null;
}

/** Last reported door state before `beforeIso`; null when none. Throws on failure. */
export async function lastDoorStateBefore(
  householdId: string,
  sensorId: string,
  beforeIso: string,
): Promise<boolean | null> {
  const [row] = await query<{ value_bool: boolean }>(
    `select value_bool from public.sensor_readings
     where sensor_id = $1 and household_id = $3 and value_bool is not null and recorded_at < $2
     order by recorded_at desc, id desc limit 1`,
    [sensorId, beforeIso, householdId],
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
