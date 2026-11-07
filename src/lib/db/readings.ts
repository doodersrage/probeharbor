/**
 * Neon versions of the reading queries in src/lib/sensorReadings.ts. Called
 * when `dbBackend() === "neon"`.
 *
 * Row cap: Supabase returned at most 1000 rows per request. Series here are
 * read newest first with a cap of MAX_SERIES_ROWS (the same 10 x 1000 the
 * paged Supabase reads use, src/lib/pagedRows.ts) and returned oldest first,
 * so a long window drops its OLDEST rows, never the newest.
 *
 * Deliberate difference: getRecentNumericReadings and
 * getRecentNumericReadingSamples were not paged on the Supabase path, so a
 * window with more than 1000 rows (a 7-day window on a sensor reporting
 * every few minutes) got the oldest 1000. Here they get the newest rows.
 * See IMPLEMENTATION_PLAN.md for the Supabase-path fix.
 */
import { isDemoDevice } from "../demoFeed";
import type { DeviceSensor } from "../devices";
import { reportIntervalMsFromMeta } from "../reportInterval";
import { applySensorOffset } from "../sensorCalibration";
import type { LatestSensorRow } from "../sensorReadings";
import { query } from "./client";

/** Newest rows kept for one series (10 Supabase pages). */
export const MAX_SERIES_ROWS = 10_000;

const message = (error: unknown) => (error instanceof Error ? error.message : String(error));

type NumericRow = { value_num: number; recorded_at: string };

/** Numeric readings since `sinceIso`, oldest first, newest MAX_SERIES_ROWS kept. */
async function numericSeries(sensorId: string, sinceIso: string): Promise<NumericRow[]> {
  const rows = await query<NumericRow>(
    `select value_num, recorded_at from public.sensor_readings
     where sensor_id = $1 and recorded_at >= $2 and value_num is not null
     order by recorded_at desc, id desc
     limit ${MAX_SERIES_ROWS}`,
    [sensorId, sinceIso],
  );
  if (rows.length === MAX_SERIES_ROWS) {
    console.warn(`numeric series for ${sensorId}: row cap hit; oldest readings not included`);
  }
  return rows.reverse();
}

export async function getRecentNumericReadings(sensorId: string, sinceIso: string): Promise<number[]> {
  try {
    return (await numericSeries(sensorId, sinceIso)).map((r) => r.value_num);
  } catch (error) {
    console.error("getRecentNumericReadings failed:", message(error));
    return []; // a failed read was an empty list on the Supabase path too
  }
}

export async function getRecentNumericReadingSamples(
  sensorId: string,
  sinceIso: string,
): Promise<Array<{ at: string; tempF: number }>> {
  try {
    return (await numericSeries(sensorId, sinceIso)).map((r) => ({ at: r.recorded_at, tempF: r.value_num }));
  } catch (error) {
    console.error("getRecentNumericReadingSamples failed:", message(error));
    return [];
  }
}

export async function getNumericReadingInWindow(
  sensorId: string,
  notBeforeIso: string,
  atOrBeforeIso: string,
): Promise<{ value: number; at: string } | null> {
  try {
    const [row] = await query<NumericRow>(
      `select value_num, recorded_at from public.sensor_readings
       where sensor_id = $1 and recorded_at >= $2 and recorded_at <= $3
       order by recorded_at desc, id desc limit 1`,
      [sensorId, notBeforeIso, atOrBeforeIso],
    );
    // The Supabase path took the newest row even if its value was null, then returned null.
    return row && typeof row.value_num === "number" ? { value: row.value_num, at: row.recorded_at } : null;
  } catch {
    return null;
  }
}

export async function hasNumericReadingAboveSince(sensorId: string, sinceIso: string, thresholdF: number): Promise<boolean> {
  try {
    const rows = await query(
      "select 1 from public.sensor_readings where sensor_id = $1 and recorded_at >= $2 and value_num > $3 limit 1",
      [sensorId, sinceIso, thresholdF],
    );
    return rows.length > 0;
  } catch {
    return false;
  }
}

/** The last numeric reading in [anchorSinceIso, cutoffIso), or none. */
export async function getDwellAnchor(
  sensorId: string,
  anchorSinceIso: string,
  cutoffIso: string,
): Promise<Array<{ at: string; tempF: number }>> {
  try {
    const rows = await query<NumericRow>(
      `select value_num, recorded_at from public.sensor_readings
       where sensor_id = $1 and recorded_at >= $2 and recorded_at < $3 and value_num is not null
       order by recorded_at desc, id desc limit 1`,
      [sensorId, anchorSinceIso, cutoffIso],
    );
    return rows.map((r) => ({ at: r.recorded_at, tempF: r.value_num }));
  } catch {
    return [];
  }
}

export async function fetchRecentBoolReadings(
  sensorId: string,
  sinceIso: string,
): Promise<Array<{ value: boolean; recordedAt: string }>> {
  try {
    const rows = await query<{ value_bool: boolean; recorded_at: string }>(
      `select value_bool, recorded_at from public.sensor_readings
       where sensor_id = $1 and recorded_at >= $2 and value_bool is not null
       order by recorded_at desc, id desc
       limit ${MAX_SERIES_ROWS}`,
      [sensorId, sinceIso],
    );
    if (rows.length === MAX_SERIES_ROWS) {
      console.warn(`fetchRecentBoolReadings(${sensorId}): row cap hit; oldest readings not included`);
    }
    return rows.reverse().map((r) => ({ value: r.value_bool, recordedAt: r.recorded_at }));
  } catch (error) {
    console.error(`fetchRecentBoolReadings(${sensorId}) failed:`, message(error));
    return [];
  }
}

type LatestJoinedRow = DeviceSensor & {
  device_name: string;
  device_space: string | null;
  device_source: string;
  device_pull_url: string | null;
  device_meta: Record<string, unknown> | null;
  value_num: number | null;
  value_bool: boolean | null;
  value_text: string | null;
  recorded_at: string;
};

/**
 * Latest reading per visible sensor on the household's enabled devices,
 * with calibration offsets applied to temperature and humidity. Sensors
 * that never reported are left out, as on the Supabase path.
 */
export async function fetchLatestSensorValuesResult(
  householdId: string,
): Promise<{ rows: LatestSensorRow[]; error: string | null }> {
  let rows: LatestJoinedRow[];
  try {
    rows = await query<LatestJoinedRow>(
      `with sens as (
         select s.id, s.device_id, s.key, s.label, s.kind, s.unit, s.visible, s.sort_order, s.offset_num,
                s.created_at as sensor_created_at,
                d.name as device_name, d.space as device_space, d.source as device_source,
                d.pull_url as device_pull_url, d.meta as device_meta,
                d.sort_order as device_sort, d.created_at as device_created_at
         from public.devices d
         join public.device_sensors s on s.device_id = d.id
         where d.household_id = $1 and d.enabled and s.visible
       )
       select sens.id, sens.device_id, sens.key, sens.label, sens.kind, sens.unit, sens.visible,
              sens.sort_order, sens.offset_num, sens.device_name, sens.device_space, sens.device_source,
              sens.device_pull_url, sens.device_meta,
              l.value_num, l.value_bool, l.value_text, l.recorded_at
       from sens
       join public.latest_sensor_readings(array(select id from sens)) l on l.sensor_id = sens.id
       order by sens.device_sort, sens.device_created_at, sens.device_id,
                sens.sort_order, sens.sensor_created_at, sens.id`,
      [householdId],
    );
  } catch (error) {
    return { rows: [], error: message(error) };
  }

  return {
    rows: rows.map((r) => {
      const sensor: DeviceSensor = {
        id: r.id,
        device_id: r.device_id,
        key: r.key,
        label: r.label,
        kind: r.kind,
        unit: r.unit,
        visible: r.visible,
        sort_order: r.sort_order,
        offset_num: r.offset_num,
      };
      const offset = typeof r.offset_num === "number" ? r.offset_num : 0;
      const valueNum =
        r.value_num != null && (r.kind === "temperature" || r.kind === "humidity")
          ? applySensorOffset(r.value_num, offset)
          : r.value_num;
      return {
        sensor,
        deviceName: r.device_name ?? "Device",
        deviceSpace: typeof r.device_space === "string" ? r.device_space : null,
        value_num: valueNum,
        value_bool: r.value_bool,
        value_text: r.value_text,
        recorded_at: r.recorded_at,
        deviceDemo: isDemoDevice({ source: r.device_source, pull_url: r.device_pull_url, meta: r.device_meta }),
        reportIntervalMs: reportIntervalMsFromMeta(r.device_meta) ?? null,
      };
    }),
    error: null,
  };
}
