/**
 * Neon versions of the queries on the push-ingest path (POST /api/ingest/…):
 * device lookup by key, sensor discovery, device meta / last seen, readings,
 * and daily ingest counts. Called from devices.ts, sensorReadings.ts and
 * ingestStats.ts.
 *
 * Differences from the Supabase path, all deliberate:
 * - Ingest counts and device meta change in one statement. The Supabase path
 *   reads, adds in JS and writes back, so two uploads at the same moment
 *   could lose a count or a meta key.
 * - Device + sensors load in one query (one round trip on every upload).
 * - Lists that had no order (sensor ties on sort_order) are ordered by
 *   created_at, id as well.
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

/**
 * Enabled device with this ingest-key hash, with its sensors. Null when there
 * is none, or (never expected) more than one: an ambiguous key must not pick
 * a household at random. The Supabase path's maybeSingle() also gave null.
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

/** Existing sensor for (device, key, kind), or a new visible one. */
export async function upsertDeviceSensor(
  deviceId: string,
  key: string,
  label: string,
  kind: SensorKind,
  unit?: string | null,
): Promise<{ sensor: DeviceSensor | null; error: string | null }> {
  try {
    const select = () =>
      query<DeviceSensor>(
        `select ${SENSOR_COLUMNS} from public.device_sensors where device_id = $1 and key = $2 and kind = $3`,
        [deviceId, key, kind],
      );
    let [current] = await select();
    if (!current) {
      // A concurrent upload may create it first; then this inserts nothing
      // and the second select finds theirs.
      [current] = await query<DeviceSensor>(
        `insert into public.device_sensors (device_id, key, label, kind, unit, visible)
         values ($1, $2, $3, $4, $5, true)
         on conflict (device_id, key, kind) do nothing
         returning ${SENSOR_COLUMNS}`,
        [deviceId, key, label, kind, unit ?? null],
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

/** Shallow-merge `patch` into devices.meta (as the Supabase path's spread did). */
export async function updateDeviceMeta(
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
       where id = $1`,
      [deviceId, JSON.stringify(patch), touchLastSeen],
    );
  } catch (error) {
    console.error("updateDeviceMeta failed:", message(error));
  }
}

export async function touchDeviceLastSeen(deviceId: string): Promise<void> {
  try {
    await query("update public.devices set last_seen_at = now(), updated_at = now() where id = $1", [deviceId]);
  } catch (error) {
    console.error("touchDeviceLastSeen failed:", message(error));
  }
}

/** All rows in one statement: all are stored or none (as Supabase's bulk insert). */
export async function insertSensorReadings(rows: SensorReadingInsert[]): Promise<{ error: string | null }> {
  if (rows.length === 0) return { error: null };
  try {
    await query(
      `insert into public.sensor_readings (sensor_id, household_id, recorded_at, value_num, value_bool, value_text, meta)
       select r.sensor_id, r.household_id, coalesce(r.recorded_at, now()), r.value_num, r.value_bool, r.value_text,
              coalesce(r.meta, '{}'::jsonb)
       from jsonb_to_recordset($1::jsonb) as r(sensor_id uuid, household_id uuid, recorded_at timestamptz,
            value_num double precision, value_bool boolean, value_text text, meta jsonb)`,
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
    return { error: null };
  } catch (error) {
    return { error: message(error) };
  }
}

/** +1 success or error for today's (UTC) row, created if missing. */
export async function recordIngestStat(deviceId: string, success: boolean, day: string): Promise<void> {
  try {
    await query(
      `insert into public.ingest_stats (device_id, day, success_count, error_count)
       values ($1, $2::date, $3, $4)
       on conflict (device_id, day) do update
         set success_count = public.ingest_stats.success_count + excluded.success_count,
             error_count = public.ingest_stats.error_count + excluded.error_count`,
      [deviceId, day, success ? 1 : 0, success ? 0 : 1],
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
