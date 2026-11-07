/**
 * Neon versions of the query helpers in src/lib/garageTempsHistory.ts and
 * src/lib/readingCounts.ts. They return the same row shapes as the Supabase
 * queries (sensor + device nested as `device_sensors.devices`), so pairing,
 * filtering and thinning stay shared.
 *
 * Every query is scoped to one household: readings by their household_id,
 * sensors through their device's household.
 *
 * Differences from the Supabase path, all deliberate:
 * - Full-history reads (CSV export) page by position (recorded_at, id), 5000
 *   rows a request, instead of by offset; same rows, and later pages don't
 *   get slower.
 * - The hourly-rollup fallback (for databases without
 *   rollup_bucket_averages) isn't needed: the function is in the baseline.
 * - Lists with no order (sensors per device) are ordered by sort_order,
 *   created_at, id.
 */
import { query } from "./client";

/** Same shape as garageTempsHistory's SensorRow. */
export type HistorySensorRow = {
  recorded_at: string;
  value_num: number | null;
  meta: Record<string, unknown> | null;
  device_sensors: {
    key: string;
    label: string;
    kind: string;
    offset_num?: number | null;
    devices: { name: string } | null;
  } | null;
};

export type HistoryFilterInput = { feedName?: string; probeKey?: string; from?: string; to?: string };

const message = (error: unknown) => (error instanceof Error ? error.message : String(error));

/** Rows per request when reading a whole history. */
export const HISTORY_PAGE_ROWS = 5000;

const SENSOR_OBJECT = `json_build_object(
  'key', s.key, 'label', s.label, 'kind', s.kind, 'offset_num', s.offset_num,
  'devices', json_build_object('name', d.name))`;

const READING_FROM = `from public.sensor_readings r
  join public.device_sensors s on s.id = r.sensor_id
  join public.devices d on d.id = s.device_id`;

/** WHERE clause for a household + History filters; params start at $1 = household id. */
function historyWhere(
  householdId: string,
  filters: HistoryFilterInput,
  kinds: string[],
): { where: string; params: unknown[] } {
  const params: unknown[] = [householdId, kinds];
  const clauses = ["r.household_id = $1", "s.kind = any($2::text[])"];
  if (filters.from) {
    params.push(filters.from);
    clauses.push(`r.recorded_at >= $${params.length}`);
  }
  if (filters.to) {
    params.push(filters.to);
    clauses.push(`r.recorded_at <= $${params.length}`);
  }
  if (filters.probeKey) {
    params.push(filters.probeKey);
    clauses.push(`s.key = $${params.length}`);
  }
  if (filters.feedName) {
    params.push(filters.feedName);
    clauses.push(`d.name = $${params.length}`);
  }
  return { where: clauses.join(" and "), params };
}

/** Every matching temperature/humidity reading, in recorded_at order. */
export async function fetchAllRawSensorRows(
  householdId: string,
  filters: HistoryFilterInput,
  kinds: string[],
  ascending: boolean,
): Promise<{ rows: HistorySensorRow[]; error: string | null }> {
  const { where, params } = historyWhere(householdId, filters, kinds);
  const dir = ascending ? "asc" : "desc";
  const cmp = ascending ? ">" : "<";
  const rows: HistorySensorRow[] = [];
  let after: { at: string; id: number } | null = null;
  try {
    for (;;) {
      const pageParams = [...params];
      let keyset = "";
      if (after) {
        pageParams.push(after.at, after.id);
        keyset = ` and (r.recorded_at, r.id) ${cmp} ($${pageParams.length - 1}::timestamptz, $${pageParams.length}::bigint)`;
      }
      const page: Array<HistorySensorRow & { id: number }> = await query(
        `select r.id, r.recorded_at, r.value_num, r.meta, ${SENSOR_OBJECT} as device_sensors
         ${READING_FROM}
         where ${where}${keyset}
         order by r.recorded_at ${dir}, r.id ${dir}
         limit ${HISTORY_PAGE_ROWS}`,
        pageParams,
      );
      for (const { id: _id, ...row } of page) rows.push(row);
      if (page.length < HISTORY_PAGE_ROWS) break;
      const last = page[page.length - 1]!;
      after = { at: last.recorded_at, id: last.id };
    }
    return { rows, error: null };
  } catch (error) {
    return { rows: [], error: message(error) };
  }
}

export async function countTemperatureHistoryRows(
  householdId: string,
  filters: HistoryFilterInput,
): Promise<{ count: number; error: string | null }> {
  const { where, params } = historyWhere(householdId, filters, ["temperature"]);
  try {
    const [row] = await query<{ n: number }>(`select count(*) as n ${READING_FROM} where ${where}`, params);
    return { count: row?.n ?? 0, error: null };
  } catch (error) {
    return { count: 0, error: message(error) };
  }
}

/** One History table page of temperature readings, newest first. */
export async function fetchTemperatureHistoryPage(
  householdId: string,
  filters: HistoryFilterInput,
  offset: number,
  pageSize: number,
): Promise<{ rows: HistorySensorRow[]; error: string | null }> {
  const { where, params } = historyWhere(householdId, filters, ["temperature"]);
  params.push(pageSize, offset);
  try {
    const rows = await query<HistorySensorRow>(
      `select r.recorded_at, r.value_num, r.meta, ${SENSOR_OBJECT} as device_sensors
       ${READING_FROM}
       where ${where}
       order by r.recorded_at desc, r.id desc
       limit $${params.length - 1} offset $${params.length}`,
      params,
    );
    return { rows, error: null };
  } catch (error) {
    return { rows: [], error: message(error) };
  }
}

/** Humidity readings at exactly these times (the times of a temperature page). */
export async function fetchHumidityRowsAt(
  householdId: string,
  timestamps: string[],
): Promise<{ rows: HistorySensorRow[]; error: string | null }> {
  if (timestamps.length === 0) return { rows: [], error: null };
  try {
    const rows = await query<HistorySensorRow>(
      `select r.recorded_at, r.value_num, r.meta, ${SENSOR_OBJECT} as device_sensors
       ${READING_FROM}
       where r.household_id = $1 and s.kind = 'humidity' and r.recorded_at = any($2::timestamptz[])`,
      [householdId, timestamps],
    );
    return { rows, error: null };
  } catch (error) {
    return { rows: [], error: message(error) };
  }
}

export type ChartSensor = {
  id: string;
  key: string;
  label: string;
  kind: string;
  offset_num: number | null;
  devices: { name: string } | null;
};

/** The household's temperature and humidity sensors (for sampled charts); null on failure. */
export async function listChartSensors(householdId: string): Promise<ChartSensor[] | null> {
  try {
    return await query<ChartSensor>(
      `select s.id, s.key, s.label, s.kind, s.offset_num, json_build_object('name', d.name) as devices
       from public.device_sensors s join public.devices d on d.id = s.device_id
       where d.household_id = $1 and s.kind in ('temperature', 'humidity')
       order by d.sort_order, d.created_at, d.id, s.sort_order, s.created_at, s.id`,
      [householdId],
    );
  } catch (error) {
    console.warn("Chart sensors lookup failed, reading raw rows:", message(error));
    return null;
  }
}

/** sensor_bucket_samples for one group of sensors; null on failure. */
export async function sensorBucketSamples(
  householdId: string,
  sensorIds: string[],
  extremeSensorIds: string[],
  fromIso: string,
  toIso: string,
  bucketSeconds: number,
): Promise<Array<{ sensor_id: string; recorded_at: string; value_num: number | null }> | null> {
  try {
    return await query(
      "select sensor_id, recorded_at, value_num from public.sensor_bucket_samples($1, $2::uuid[], $3::uuid[], $4, $5, $6)",
      [householdId, sensorIds, extremeSensorIds, fromIso, toIso, bucketSeconds],
    );
  } catch (error) {
    console.warn("sensor_bucket_samples failed, reading raw rows:", message(error));
    return null;
  }
}

export async function countChartSensors(householdId: string): Promise<number> {
  const [row] = await query<{ n: number }>(
    `select count(*) as n from public.device_sensors s join public.devices d on d.id = s.device_id
     where d.household_id = $1 and s.kind in ('temperature', 'humidity')`,
    [householdId],
  );
  return row?.n ?? 0;
}

export type RollupBucketRow = {
  bucket_start: string;
  avg_num: number | null;
  key: string;
  label: string;
  kind: string;
  offset_num: number | null;
  device_name: string;
};

/** rollup_bucket_averages; throws on failure (caller logs and shows no rollup points). */
export function rollupBucketAverages(
  householdId: string,
  fromIso: string,
  toIso: string,
  bucketSeconds: number,
): Promise<RollupBucketRow[]> {
  return query<RollupBucketRow>(
    `select bucket_start, avg_num, key, label, kind, offset_num, device_name
     from public.rollup_bucket_averages($1, $2, $3, $4)`,
    [householdId, fromIso, toIso, bucketSeconds],
  );
}

export async function fetchEarliestSensorReadingAt(householdId: string): Promise<string | null> {
  try {
    const [row] = await query<{ recorded_at: string }>(
      "select recorded_at from public.sensor_readings where household_id = $1 order by recorded_at limit 1",
      [householdId],
    );
    return row?.recorded_at ?? null;
  } catch {
    return null;
  }
}

/** Devices (sort order) with their sensors, for History's device/probe filters. */
export async function listDevicesWithSensorsForFilters(
  householdId: string,
): Promise<{ data: Array<{ name: string; device_sensors: Array<{ key: string; label: string; kind: string }> }>; error: string | null }> {
  try {
    const data = await query<{ name: string; device_sensors: Array<{ key: string; label: string; kind: string }> }>(
      `select d.name,
              coalesce((select json_agg(json_build_object('key', s.key, 'label', s.label, 'kind', s.kind)
                                 order by s.sort_order, s.created_at, s.id)
                        from public.device_sensors s where s.device_id = d.id), '[]'::json) as device_sensors
       from public.devices d where d.household_id = $1
       order by d.sort_order, d.created_at, d.id`,
      [householdId],
    );
    return { data, error: null };
  } catch (error) {
    return { data: [], error: message(error) };
  }
}

export async function temperatureReadingCounts(
  householdId: string,
  fromIso: string,
  toIso: string,
  thresholdF: number,
  sensorIds: string[] | null,
): Promise<{ total_count: number; below_count: number; from_rollups: boolean } | null> {
  const [row] = await query<{ total_count: number; below_count: number; from_rollups: boolean }>(
    "select total_count, below_count, from_rollups from public.temperature_reading_counts($1, $2, $3, $4, $5::uuid[])",
    [householdId, fromIso, toIso, thresholdF, sensorIds],
  );
  return row ?? null;
}
