/**
 * Neon versions of the freeze map (freezeMap.ts), the indoor reference sensor
 * (indoorReference.ts), cross-property snapshots (crossProperty.ts) and the
 * house reference line (houseContext.ts).
 *
 * Difference from the Supabase path: the house reference line's sensor-label
 * lookup is also scoped to the household (the readings already were).
 */
import type { FreezeMapSnapshot } from "../freezeMap";
import { query } from "./client";

const message = (error: unknown) => (error instanceof Error ? error.message : String(error));

// ---- freeze map -------------------------------------------------------------

export async function updateFreezeMapSettings(
  householdId: string,
  s: { optIn: boolean; cityId: string | null; lat: number | null; lon: number | null; label: string | null },
): Promise<{ error: string | null }> {
  try {
    await query(
      `update public.households set freeze_map_opt_in = $2, freeze_map_city_id = $3, freeze_map_lat = $4,
         freeze_map_lon = $5, freeze_map_label = $6 where id = $1`,
      [householdId, s.optIn, s.cityId, s.lat, s.lon, s.label],
    );
    return { error: null };
  } catch (error) {
    return { error: message(error) };
  }
}

export async function getFreezeMapSettings(householdId: string): Promise<{
  freeze_map_opt_in: boolean;
  freeze_map_city_id: string | null;
  freeze_map_lat: number | null;
  freeze_map_lon: number | null;
  freeze_map_label: string | null;
} | null> {
  try {
    const [row] = await query<{
      freeze_map_opt_in: boolean;
      freeze_map_city_id: string | null;
      freeze_map_lat: number | null;
      freeze_map_lon: number | null;
      freeze_map_label: string | null;
    }>(
      `select freeze_map_opt_in, freeze_map_city_id, freeze_map_lat, freeze_map_lon, freeze_map_label
       from public.households where id = $1`,
      [householdId],
    );
    return row ?? null;
  } catch {
    return null;
  }
}

export async function countOptIns(): Promise<number> {
  try {
    const [row] = await query<{ n: number }>("select count(*) as n from public.households where freeze_map_opt_in");
    return row?.n ?? 0;
  } catch {
    return 0;
  }
}

/** Throws on failure. */
export function optedInHouseholds(): Promise<
  Array<{ id: string; freeze_map_city_id: string | null; freeze_map_lat: number | null; freeze_map_lon: number | null; freeze_map_label: string | null }>
> {
  return query(
    `select id, freeze_map_city_id, freeze_map_lat, freeze_map_lon, freeze_map_label
     from public.households where freeze_map_opt_in order by created_at, id`,
  );
}

/** One batch, one statement. Throws on failure. */
export async function insertSnapshots(rows: Array<Record<string, unknown>>): Promise<void> {
  if (rows.length === 0) return;
  await query(
    `insert into public.freeze_map_snapshots
       (city_id, city_label, lat, lon, sample_count, avg_temp_f, min_temp_f, freeze_risk_count, captured_at)
     select city_id, city_label, lat, lon, sample_count, avg_temp_f, min_temp_f, freeze_risk_count, captured_at
     from jsonb_to_recordset($1::jsonb) as r(city_id text, city_label text, lat float8, lon float8, sample_count int,
          avg_temp_f float8, min_temp_f float8, freeze_risk_count int, captured_at timestamptz)`,
    [JSON.stringify(rows)],
  );
}

export async function pruneSnapshots(cutoffIso: string): Promise<{ deleted: number; error: string | null }> {
  try {
    const rows = await query("delete from public.freeze_map_snapshots where captured_at < $1 returning id", [cutoffIso]);
    return { deleted: rows.length, error: null };
  } catch (error) {
    return { deleted: 0, error: message(error) };
  }
}

/** Newest snapshot rows (all cities), newest first. Throws on failure. */
export function recentSnapshots(limit: number): Promise<Array<FreezeMapSnapshot>> {
  return query<FreezeMapSnapshot>(
    `select city_id, city_label, sample_count, avg_temp_f, min_temp_f, freeze_risk_count, captured_at, lat, lon
     from public.freeze_map_snapshots order by captured_at desc, id desc limit $1`,
    [limit],
  );
}

// ---- indoor reference sensor --------------------------------------------------

/** Throws on failure. */
export async function getIndoorReference(householdId: string): Promise<string | null> {
  const [row] = await query<{ v: string | null }>(
    "select indoor_reference_sensor_id as v from public.households where id = $1",
    [householdId],
  );
  return row?.v ?? null;
}

/** The sensor's kind if it belongs to this household, else null. Throws on failure. */
export async function householdSensorKind(householdId: string, sensorId: string): Promise<string | null> {
  const [row] = await query<{ kind: string }>(
    `select s.kind from public.device_sensors s join public.devices d on d.id = s.device_id
     where s.id = $1 and d.household_id = $2`,
    [sensorId, householdId],
  );
  return row?.kind ?? null;
}

export async function setIndoorReference(householdId: string, sensorId: string | null): Promise<{ error: string | null }> {
  try {
    await query("update public.households set indoor_reference_sensor_id = $2 where id = $1", [householdId, sensorId]);
    return { error: null };
  } catch (error) {
    return { error: message(error) };
  }
}

// ---- cross-property snapshots -------------------------------------------------

export async function devicesForHouseholds(
  householdIds: string[],
): Promise<Array<{ id: string; household_id: string; enabled: boolean; last_seen_at: string | null; meta: unknown }>> {
  return query(
    "select id, household_id, enabled, last_seen_at, meta from public.devices where household_id = any($1::uuid[])",
    [householdIds],
  );
}

export async function sensorsOfKinds(deviceIds: string[], kinds: string[]): Promise<Array<{ id: string; device_id: string; kind: string }>> {
  return query(
    "select id, device_id, kind from public.device_sensors where device_id = any($1::uuid[]) and kind = any($2::text[])",
    [deviceIds, kinds],
  );
}

/** Recent readings for these households and sensors, newest first. */
export function recentReadings(
  householdIds: string[],
  sensorIds: string[],
  sinceIso: string,
  limit: number,
  onlyTrue: boolean,
): Promise<Array<{ household_id: string; value_num: number | null; value_bool: boolean | null; recorded_at: string }>> {
  return query(
    `select household_id, value_num, value_bool, recorded_at from public.sensor_readings
     where household_id = any($1::uuid[]) and sensor_id = any($2::uuid[]) and recorded_at >= $3
       and (not $5 or value_bool = true)
     order by recorded_at desc, id desc limit $4`,
    [householdIds, sensorIds, sinceIso, limit, onlyTrue],
  );
}

// ---- house reference line -----------------------------------------------------

/** Label and kind of a sensor in this household. Throws on failure. */
export async function householdSensor(householdId: string, sensorId: string): Promise<{ label: string; kind: string } | null> {
  const [row] = await query<{ label: string; kind: string }>(
    `select s.label, s.kind from public.device_sensors s join public.devices d on d.id = s.device_id
     where s.id = $1 and d.household_id = $2`,
    [sensorId, householdId],
  );
  return row ?? null;
}

/** sensor_bucket_averages for one sensor. Throws on failure. */
export function sensorBucketAverages(
  householdId: string,
  sensorId: string,
  fromIso: string,
  toIso: string,
  bucketSeconds: number,
): Promise<Array<{ bucket_start: string; avg_num: number | null }>> {
  return query(
    `select bucket_start, avg_num from public.sensor_bucket_averages($1, array[$2]::uuid[], $3, $4, $5)`,
    [householdId, sensorId, fromIso, toIso, bucketSeconds],
  );
}

/** The newest freeze-map snapshot for one city key, or null. */
export async function latestSnapshotForCity(
  cityId: string,
): Promise<{ city_label: string; avg_temp_f: number | null; min_temp_f: number | null; sample_count: number } | null> {
  try {
    const [row] = await query<{ city_label: string; avg_temp_f: number | null; min_temp_f: number | null; sample_count: number }>(
      `select city_label, avg_temp_f, min_temp_f, sample_count from public.freeze_map_snapshots
       where city_id = $1 order by captured_at desc, id desc limit 1`,
      [cityId],
    );
    return row ?? null;
  } catch {
    return null;
  }
}
