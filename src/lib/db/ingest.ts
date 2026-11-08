/**
 * Neon versions of the queries on the push-ingest path (POST /api/ingest/…):
 * device lookup by key, sensor discovery, device meta / last seen, readings,
 * and daily ingest counts. Called from devices.ts, sensorReadings.ts and
 * ingestStats.ts.
 *
 * Differences from the old Supabase code, all deliberate:
 * - Ingest counts and device meta change in one statement. The old code
 *   read, added in JS and wrote back, so two uploads at the same moment
 *   could lose a count or a meta key.
 * - Device + sensors load in one query (one round trip on every upload).
 * - Lists that had no order (sensor ties on sort_order) are ordered by
 *   created_at, id as well.
 *
 * Household checks in SQL: every helper that names a device or sensor also
 * takes the household and only reads or writes it when the device belongs to
 * that household (a join or an exists in the same statement; no extra round
 * trip). Reading inserts refuse the whole batch when any row's sensor is not
 * in that row's household.
 */
import type { DeviceSensor, DeviceWithSensors } from "../devices";
import type { IngestStatRow } from "../ingestStats";
import type { SensorKind } from "../sensorKinds";
import type { SensorReadingInsert } from "../sensorReadings";
import { query } from "./client";

const message = (error: unknown) => (error instanceof Error ? error.message : String(error));

/** One device_sensors row (alias s) as JSON, same keys as DeviceSensor. */
export const SENSOR_JSON = `json_build_object(
  'id', s.id, 'device_id', s.device_id, 'key', s.key, 'label', s.label, 'kind', s.kind,
  'unit', s.unit, 'visible', s.visible, 'sort_order', s.sort_order, 'offset_num', s.offset_num)`;

export const SENSOR_COLUMNS = "id, device_id, key, label, kind, unit, visible, sort_order, offset_num";
/** SENSOR_COLUMNS of device_sensors alias s. */
const SENSOR_COLUMNS_S = "s.id, s.device_id, s.key, s.label, s.kind, s.unit, s.visible, s.sort_order, s.offset_num";

/**
 * Enabled device with this ingest-key hash, with its sensors. Null when there
 * is none, or (never expected) more than one: an ambiguous key must not pick
 * a household at random.
 */
export async function findDeviceByIngestKeyHash(keyHash: string): Promise<DeviceWithSensors | null> {
  let rows: DeviceWithSensors[];
  try {
    rows = await query<DeviceWithSensors>(
      `select d.id, d.household_id, d.name, d.source, d.pull_url, d.ingest_key_prefix, d.enabled,
              d.last_seen_at, d.sort_order, d.meta, d.space,
              coalesce((select json_agg(${SENSOR_JSON} order by s.sort_order, s.created_at, s.id)
                        from public.device_sensors s where s.device_id = d.id), '[]'::json) as sensors
       from public.devices d
       where d.ingest_key_hash = $1 and d.enabled
       limit 2`,
      [keyHash],
    );
  } catch (error) {
    console.error("findDeviceByIngestKeyHash failed:", message(error));
    return null;
  }
  return rows.length === 1 ? (rows[0] as DeviceWithSensors) : null;
}

/** Existing sensor for (device, key, kind), or a new visible one; an error when the device isn't in the household. */
export async function upsertDeviceSensor(
  householdId: string,
  deviceId: string,
  key: string,
  label: string,
  kind: SensorKind,
  unit?: string | null,
): Promise<{ sensor: DeviceSensor | null; error: string | null }> {
  try {
    const select = () =>
      query<DeviceSensor>(
        `select ${SENSOR_COLUMNS_S}
         from public.device_sensors s join public.devices d on d.id = s.device_id
         where s.device_id = $1 and s.key = $2 and s.kind = $3 and d.household_id = $4`,
        [deviceId, key, kind, householdId],
      );
    let [current] = await select();
    if (!current) {
      // A concurrent upload may create it first; then this inserts nothing
      // and the second select finds theirs.
      [current] = await query<DeviceSensor>(
        `insert into public.device_sensors (device_id, key, label, kind, unit, visible)
         select d.id, $2, $3, $4, $5, true from public.devices d where d.id = $1 and d.household_id = $6
         on conflict (device_id, key, kind) do nothing
         returning ${SENSOR_COLUMNS}`,
        [deviceId, key, label, kind, unit ?? null, householdId],
      );
      if (current) return { sensor: current, error: null };
      [current] = await select();
      if (!current) return { sensor: null, error: "Failed to create sensor" };
    }
    // Temperatures are stored in °F. A sensor first created from °C readings
    // still says "C"; correct it so the card doesn't label °F values as °C.
    if (kind === "temperature" && unit === "F" && current.unit != null && current.unit !== "F") {
      await query("update public.device_sensors set unit = 'F' where id = $1", [current.id]);
      return { sensor: { ...current, unit: "F" }, error: null };
    }
    return { sensor: current, error: null };
  } catch (error) {
    return { sensor: null, error: message(error) };
  }
}

/** Shallow-merge `patch` into devices.meta (top-level keys replaced, others kept); only a device of the household. */
export async function updateDeviceMeta(
  householdId: string,
  deviceId: string,
  patch: Record<string, unknown>,
  touchLastSeen: boolean,
): Promise<void> {
  try {
    await query(
      `update public.devices
       set meta = (case when jsonb_typeof(meta) = 'object' then meta else '{}'::jsonb end) || $2::jsonb,
           last_seen_at = case when $3 then now() else last_seen_at end,
           updated_at = now()
       where id = $1 and household_id = $4`,
      [deviceId, JSON.stringify(patch), touchLastSeen, householdId],
    );
  } catch (error) {
    console.error("updateDeviceMeta failed:", message(error));
  }
}

export async function touchDeviceLastSeen(householdId: string, deviceId: string): Promise<void> {
  try {
    await query(
      "update public.devices set last_seen_at = now(), updated_at = now() where id = $1 and household_id = $2",
      [deviceId, householdId],
    );
  } catch (error) {
    console.error("touchDeviceLastSeen failed:", message(error));
  }
}

/**
 * All rows in one statement: all are stored or none. A row whose sensor is not
 * a sensor of a device in that row's household fails the whole batch (nothing
 * stored, an error returned and logged with the offending sensor ids), so a
 * misattributed reading is never stored silently. The check is part of the
 * same statement (primary-key lookups per row, no extra round trip).
 */
export async function insertSensorReadings(rows: SensorReadingInsert[]): Promise<{ error: string | null }> {
  if (rows.length === 0) return { error: null };
  try {
    const [result] = await query<{ rejected: number; rejected_sensor_ids: string[] | null }>(
      `with input as (
         select r.sensor_id, r.household_id, coalesce(r.recorded_at, now()) as recorded_at, r.value_num,
                r.value_bool, r.value_text, coalesce(r.meta, '{}'::jsonb) as meta
         from jsonb_to_recordset($1::jsonb) as r(sensor_id uuid, household_id uuid, recorded_at timestamptz,
              value_num double precision, value_bool boolean, value_text text, meta jsonb)
       ), bad as (
         select i.sensor_id from input i
         where not exists (
           select 1 from public.device_sensors s join public.devices d on d.id = s.device_id
           where s.id = i.sensor_id and d.household_id = i.household_id)
       ), ins as (
         insert into public.sensor_readings (sensor_id, household_id, recorded_at, value_num, value_bool, value_text, meta)
         select sensor_id, household_id, recorded_at, value_num, value_bool, value_text, meta from input
         where not exists (select 1 from bad)
         returning 1
       )
       select (select count(*) from bad)::int as rejected,
              (select array_agg(distinct sensor_id) from bad) as rejected_sensor_ids`,
      [
        JSON.stringify(
          rows.map((row) => ({
            sensor_id: row.sensor_id,
            household_id: row.household_id,
            recorded_at: row.recorded_at ?? null,
            value_num: row.value_num ?? null,
            value_bool: row.value_bool ?? null,
            value_text: row.value_text ?? null,
            meta: row.meta ?? {},
          })),
        ),
      ],
    );
    if (result && result.rejected > 0) {
      const ids = (result.rejected_sensor_ids ?? []).slice(0, 5).join(", ");
      console.error(
        `insertSensorReadings: ${result.rejected} of ${rows.length} reading(s) name a sensor outside their household (${ids}); batch not stored`,
      );
      return { error: "reading names a sensor outside its household" };
    }
    return { error: null };
  } catch (error) {
    return { error: message(error) };
  }
}

/** +1 success or error for today's (UTC) row, created if missing; nothing for a device outside the household. */
export async function recordIngestStat(
  householdId: string,
  deviceId: string,
  success: boolean,
  day: string,
): Promise<void> {
  try {
    await query(
      `insert into public.ingest_stats (device_id, day, success_count, error_count)
       select d.id, $2::date, $3::int, $4::int from public.devices d where d.id = $1 and d.household_id = $5
       on conflict (device_id, day) do update
         set success_count = public.ingest_stats.success_count + excluded.success_count,
             error_count = public.ingest_stats.error_count + excluded.error_count`,
      [deviceId, day, success ? 1 : 0, success ? 0 : 1, householdId],
    );
  } catch (error) {
    console.error("recordIngestStat failed:", message(error));
  }
}

export async function listIngestStatsForHousehold(householdId: string, sinceDay: string): Promise<IngestStatRow[]> {
  try {
    return await query<IngestStatRow>(
      `select s.device_id, s.day, s.success_count, s.error_count, d.name as device_name
       from public.ingest_stats s join public.devices d on d.id = s.device_id
       where d.household_id = $1 and s.day >= $2::date
       order by s.day desc, d.name, s.device_id`,
      [householdId, sinceDay],
    );
  } catch {
    return [];
  }
}

export async function listRecentIngestStatsAdmin(sinceDay: string): Promise<IngestStatRow[]> {
  try {
    return await query<IngestStatRow>(
      `select s.device_id, s.day, s.success_count, s.error_count, coalesce(d.name, 'Device') as device_name
       from public.ingest_stats s left join public.devices d on d.id = s.device_id
       where s.day >= $1::date
       order by s.day desc, s.device_id`,
      [sinceDay],
    );
  } catch {
    return [];
  }
}
