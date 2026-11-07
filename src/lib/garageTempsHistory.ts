import * as neonHistory from "./db/history";
import { probePairingKey } from "./probePairing";
import { escapeCsvField } from "./csvEscape";
import { getUserHouseholdId } from "./households";
import { applySensorOffset } from "./sensorCalibration";
import { formatDateTime } from "../i18n/format";
import type { Locale } from "../i18n/locales";

export type GarageTempReading = {
  /** null when this probe has no temperature at this time (humidity-only). */
  tempc: number | null;
  tempf: number | null;
  /** null when this probe has no humidity at this time. */
  humidity: number | null;
  timestamp: string;
  feed_name?: string | null;
  probe_label?: string | null;
  probe_key?: string | null;
  user_id?: string | null;
};

export type PaginatedGarageTemps = {
  readings: GarageTempReading[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  error: string | null;
};

export const GARAGE_TEMPS_PAGE_SIZE = 20;

export type HistoryFilters = {
  feedName?: string;
  probeKey?: string;
  from?: string;
  to?: string;
};

export type ChartPoint = {
  timestamp: string;
  tempf: number;
  /** null = no humidity measured at this time; never draw it as 0. */
  humidity: number | null;
  probeLabel: string;
  /** Device name, so equal sensor labels on different devices stay separate lines. */
  device?: string;
};

/**
 * Two devices can both have a sensor named "Temp1"; charts draw one line per
 * label, so prefix the device name wherever a label is shared across devices.
 */
export function disambiguateChartLabels(points: ChartPoint[]): ChartPoint[] {
  const devicesByLabel = new Map<string, Set<string>>();
  for (const point of points) {
    if (!point.device) continue;
    const devices = devicesByLabel.get(point.probeLabel) ?? new Set<string>();
    devices.add(point.device);
    devicesByLabel.set(point.probeLabel, devices);
  }
  const shared = new Set(
    [...devicesByLabel].filter(([, devices]) => devices.size > 1).map(([label]) => label),
  );
  if (shared.size === 0) return points;
  return points.map((point) =>
    point.device && shared.has(point.probeLabel)
      ? { ...point, probeLabel: `${point.device} · ${point.probeLabel}` }
      : point,
  );
}

/** Rollups fill gaps without replacing raw points; one point per line per timestamp. */
function mergeChartPoints(points: ChartPoint[], extra: ChartPoint[]): ChartPoint[] {
  const key = (p: ChartPoint) => `${p.timestamp}|${p.device ?? ""}|${p.probeLabel}`;
  const merged = new Map(points.map((p) => [key(p), p]));
  for (const point of extra) {
    if (!merged.has(key(point))) merged.set(key(point), point);
  }
  return [...merged.values()].sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp));
}



type SensorRow = {
  recorded_at: string;
  value_num: number | null;
  meta: Record<string, unknown> | null;
  device_sensors: {
    key: string;
    label: string;
    kind: string;
    offset_num?: number | null;
    devices: {
      name: string;
    } | null;
  } | null;
};

/** Max chart points after full-window fetch; applied per-probe so lines stay balanced. */
export const CHART_DISPLAY_CAP = 500;

/** `timeZone`: an IANA zone (the browser's, from the ph_tz cookie); omitted = the server's. */
export function formatReadingTimestamp(timestamp: string, locale: Locale = "en", timeZone?: string): string {
  return formatDateTime(timestamp, locale, { dateStyle: "medium", timeStyle: "short", ...(timeZone ? { timeZone } : {}) });
}

export function getReadingFeedName(reading: GarageTempReading): string {
  return reading.feed_name?.trim() || "Garage";
}

export function getReadingProbeLabel(reading: GarageTempReading): string {
  return reading.probe_label?.trim() || "Average";
}

export function pairTempHumidityRows(
  rows: SensorRow[],
  userId: string,
): GarageTempReading[] {
  const temps = new Map<string, SensorRow>();
  const humidities = new Map<string, SensorRow>();

  for (const row of rows) {
    const sensor = row.device_sensors;
    if (!sensor || row.value_num == null) continue;
    const deviceName = sensor.devices?.name ?? "Device";
    if (sensor.kind === "temperature") {
      temps.set(`${deviceName}::${sensor.key}::${row.recorded_at}`, row);
    }
    if (sensor.kind === "humidity") {
      humidities.set(`${deviceName}::${probePairingKey(sensor.key)}::${row.recorded_at}`, row);
    }
  }

  const readings: GarageTempReading[] = [];
  const seen = new Set<string>();

  for (const [key, tempRow] of temps) {
    const sensor = tempRow.device_sensors!;
    const deviceName = sensor.devices?.name ?? "Device";
    const humidityKey = `${deviceName}::${probePairingKey(sensor.key)}::${tempRow.recorded_at}`;
    const humidityRow = humidities.get(humidityKey);
    const rawTempF = Number(tempRow.value_num);
    const tempOffset =
      typeof sensor.offset_num === "number" ? sensor.offset_num : 0;
    const tempf = applySensorOffset(rawTempF, tempOffset);
    const meta = tempRow.meta ?? {};
    const tempc =
      typeof meta.tempc === "number" && tempOffset === 0
        ? meta.tempc
        : Number((((tempf - 32) * 5) / 9).toFixed(1));
    // No humidity reported for this probe at this time: null, never 0%.
    const humidityRaw =
      humidityRow?.value_num != null
        ? Number(humidityRow.value_num)
        : typeof meta.humidity === "number"
          ? Number(meta.humidity)
          : null;
    const humidityOffset =
      typeof humidityRow?.device_sensors?.offset_num === "number"
        ? humidityRow.device_sensors.offset_num
        : 0;
    const humidity = humidityRaw == null ? null : applySensorOffset(humidityRaw, humidityOffset);

    readings.push({
      tempc,
      tempf,
      humidity,
      timestamp: tempRow.recorded_at,
      feed_name: deviceName,
      probe_label: sensor.label.replace(/ humidity$/i, ""),
      probe_key: sensor.key,
      user_id: userId,
    });
    if (humidityRow) seen.add(humidityKey);
  }

  for (const [key, humidityRow] of humidities) {
    if (seen.has(key)) continue;
    const sensor = humidityRow.device_sensors!;
    const deviceName = sensor.devices?.name ?? "Device";
    // Humidity-only probe: no temperature at this time (was shown as 0°F).
    readings.push({
      tempc: null,
      tempf: null,
      humidity: applySensorOffset(
        Number(humidityRow.value_num ?? 0),
        typeof sensor.offset_num === "number" ? sensor.offset_num : 0,
      ),
      timestamp: humidityRow.recorded_at,
      feed_name: deviceName,
      probe_label: sensor.label.replace(/ humidity$/i, ""),
      probe_key: sensor.key,
      user_id: userId,
    });
  }

  readings.sort(
    (a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp),
  );
  return readings;
}

function matchesFilters(
  reading: GarageTempReading,
  filters: HistoryFilters,
): boolean {
  if (filters.feedName && getReadingFeedName(reading) !== filters.feedName) {
    return false;
  }
  if (filters.probeKey && (reading.probe_key?.trim() || "") !== filters.probeKey) {
    return false;
  }
  if (filters.from && Date.parse(reading.timestamp) < Date.parse(filters.from)) {
    return false;
  }
  if (filters.to && Date.parse(reading.timestamp) > Date.parse(filters.to)) {
    return false;
  }
  return true;
}

async function fetchAllRawSensorRows(
  householdId: string,
  filters: HistoryFilters,
  options: {
    kinds?: Array<"temperature" | "humidity">;
    ascending?: boolean;
  } = {},
): Promise<{ rows: SensorRow[]; error: string | null }> {
  const kinds = options.kinds ?? ["temperature", "humidity"];
  return neonHistory.fetchAllRawSensorRows(householdId, filters, kinds, options.ascending === true);
}

async function countTemperatureHistoryRows(
  householdId: string,
  filters: HistoryFilters,
): Promise<{ count: number; error: string | null }> {
  return neonHistory.countTemperatureHistoryRows(householdId, filters);
}

export async function householdHasTemperatureHistory(userId: string): Promise<boolean> {
  const householdId = await getUserHouseholdId(userId);
  if (!householdId) return false;
  const { count, error } = await countTemperatureHistoryRows(householdId, {});
  if (error) return false;
  return count > 0;
}

async function fetchTemperatureHistoryPage(
  householdId: string,
  filters: HistoryFilters,
  page: number,
  pageSize: number,
): Promise<{ rows: SensorRow[]; error: string | null }> {
  const offset = (page - 1) * pageSize;
  return neonHistory.fetchTemperatureHistoryPage(householdId, filters, offset, pageSize);
}

async function fetchHumidityRowsForTemps(
  householdId: string,
  tempRows: SensorRow[],
): Promise<{ rows: SensorRow[]; error: string | null }> {
  if (tempRows.length === 0) {
    return { rows: [], error: null };
  }

  const wantedKeys = new Set<string>();
  const timestamps = new Set<string>();
  for (const row of tempRows) {
    const sensor = row.device_sensors;
    if (!sensor) continue;
    const deviceName = sensor.devices?.name ?? "Device";
    wantedKeys.add(`${deviceName}::${sensor.key}`);
    timestamps.add(row.recorded_at);
  }

  const humidity = await neonHistory.fetchHumidityRowsAt(householdId, [...timestamps]);
  if (humidity.error) return humidity;
  return {
    rows: humidity.rows.filter((row) => {
      const sensor = row.device_sensors;
      return sensor != null && wantedKeys.has(`${sensor.devices?.name ?? "Device"}::${sensor.key}`);
    }),
    error: null,
  };
}

/** Downsample chart/history points evenly per probe so one zone does not dominate. */
export function limitPairedReadingsFairly(
  readings: GarageTempReading[],
  limit: number,
  ascending: boolean,
): GarageTempReading[] {
  if (readings.length <= limit) {
    return readings;
  }

  const groups = new Map<string, GarageTempReading[]>();
  for (const reading of readings) {
    const groupKey = `${getReadingFeedName(reading)}::${reading.probe_key ?? ""}`;
    const bucket = groups.get(groupKey) ?? [];
    bucket.push(reading);
    groups.set(groupKey, bucket);
  }

  const perProbe = Math.max(1, Math.floor(limit / groups.size));
  const picked: GarageTempReading[] = [];

  for (const group of groups.values()) {
    const sorted = [...group].sort(
      (a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp),
    );
    if (sorted.length <= perProbe) {
      picked.push(...sorted);
      continue;
    }
    const stride = sorted.length / perProbe;
    for (let index = 0; index < perProbe; index += 1) {
      const sampleIndex = Math.min(
        sorted.length - 1,
        Math.floor(index * stride + stride / 2),
      );
      picked.push(sorted[sampleIndex]!);
    }
  }

  picked.sort((a, b) => {
    const diff = Date.parse(a.timestamp) - Date.parse(b.timestamp);
    return ascending ? diff : -diff;
  });

  return picked.slice(0, limit);
}

async function fetchPairedFromSensorReadings(
  userId: string,
  filters: HistoryFilters = {},
  options: { limit?: number; ascending?: boolean } = {},
): Promise<{ readings: GarageTempReading[]; error: string | null }> {
  const householdId = await getUserHouseholdId(userId);
  if (!householdId) {
    return { readings: [], error: null };
  }

  const { rows, error } = await fetchAllRawSensorRows(householdId, filters, {
    ascending: options.ascending,
  });
  if (error) {
    return { readings: [], error };
  }

  let readings = pairTempHumidityRows(rows, userId);
  readings = readings.filter((reading) => matchesFilters(reading, filters));
  if (options.limit && readings.length > options.limit) {
    readings = limitPairedReadingsFairly(
      readings,
      options.limit,
      options.ascending === true,
    );
  }
  return { readings, error: null };
}

export async function fetchGarageTempHistory(
  userId: string,
  page = 1,
  pageSize = GARAGE_TEMPS_PAGE_SIZE,
  filters: HistoryFilters = {},
): Promise<PaginatedGarageTemps> {
  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const householdId = await getUserHouseholdId(userId);
  if (!householdId) {
    return {
      readings: [],
      page: safePage,
      pageSize,
      totalCount: 0,
      totalPages: 0,
      error: null,
    };
  }

  const [{ count, error: countError }, tempPage] = await Promise.all([
    countTemperatureHistoryRows(householdId, filters),
    fetchTemperatureHistoryPage(householdId, filters, safePage, pageSize),
  ]);

  if (countError || tempPage.error) {
    return {
      readings: [],
      page: safePage,
      pageSize,
      totalCount: 0,
      totalPages: 0,
      error: countError ?? tempPage.error,
    };
  }

  const humidityPage = await fetchHumidityRowsForTemps(householdId, tempPage.rows);
  if (humidityPage.error) {
    return {
      readings: [],
      page: safePage,
      pageSize,
      totalCount: 0,
      totalPages: 0,
      error: humidityPage.error,
    };
  }

  const readings = pairTempHumidityRows(
    [...tempPage.rows, ...humidityPage.rows],
    userId,
  ).filter((reading) => matchesFilters(reading, filters));

  const totalCount = count;
  const totalPages = totalCount === 0 ? 0 : Math.ceil(totalCount / pageSize);

  return {
    readings,
    page: safePage,
    pageSize,
    totalCount,
    totalPages,
    error: null,
  };
}

export async function fetchAllGarageTempReadings(
  userId: string,
  filters: HistoryFilters = {},
): Promise<{
  readings: GarageTempReading[];
  error: string | null;
}> {
  const householdId = await getUserHouseholdId(userId);
  if (!householdId) {
    return { readings: [], error: null };
  }

  const { rows, error } = await fetchAllRawSensorRows(householdId, filters, {
    ascending: false,
  });
  if (error) {
    return { readings: [], error };
  }

  const readings = pairTempHumidityRows(rows, userId).filter((reading) =>
    matchesFilters(reading, filters),
  );
  return { readings, error: null };
}

/** Most expected readings per sample call, so each response stays bounded. */
const SAMPLE_ROWS_PER_CALL = 900;
/** Aim for about this many temperature points in total (first + min + max per bucket). */
const SAMPLE_TARGET_TEMP_POINTS = 1000;

/** Buckets per sensor for `tempSensors` temperature sensors: 50–300. */
export function sampleBucketCount(tempSensors: number): number {
  return Math.min(300, Math.max(50, Math.floor(SAMPLE_TARGET_TEMP_POINTS / (3 * Math.max(1, tempSensors)))));
}

/** Split sensors into calls whose expected rows (temperature 3 per bucket, humidity 1) fit one response. */
export function groupSensorsForSampling<T extends { kind: string }>(sensors: T[], buckets: number): T[][] {
  const groups: T[][] = [];
  let current: T[] = [];
  let rows = 0;
  for (const sensor of sensors) {
    const cost = (sensor.kind === "temperature" ? 3 : 1) * buckets;
    if (current.length > 0 && rows + cost > SAMPLE_ROWS_PER_CALL) {
      groups.push(current);
      current = [];
      rows = 0;
    }
    current.push(sensor);
    rows += cost;
  }
  if (current.length > 0) groups.push(current);
  return groups;
}

/**
 * Temperature/humidity chart readings for [fromIso, toIso] via bucket
 * samples: per time bucket the first reading, plus the lowest and highest
 * temperature. Real readings, so dips survive and same-post humidity still
 * pairs. Shaped like raw rows for pairTempHumidityRows. null when the sensor
 * lookup or a sample call fails (callers then read raw rows).
 */
async function fetchSampledSensorRows(
  householdId: string,
  fromIso: string,
  toIso?: string,
): Promise<{ rows: SensorRow[]; bucketMs: number } | null> {
  const to = toIso ?? new Date().toISOString();
  const list = await neonHistory.listChartSensors(householdId);
  if (!list) return null;
  if (list.length === 0) return { rows: [], bucketMs: 0 };

  const buckets = sampleBucketCount(list.filter((s) => s.kind === "temperature").length);
  const spanSec = Math.max(0, (Date.parse(to) - Date.parse(fromIso)) / 1000);
  const bucketSeconds = Math.max(60, Math.ceil(spanSec / buckets));
  const byId = new Map(list.map((s) => [s.id, s]));

  const results = await Promise.all(
    groupSensorsForSampling(list, buckets).map((group) =>
      neonHistory.sensorBucketSamples(
        householdId,
        group.map((s) => s.id),
        group.filter((s) => s.kind === "temperature").map((s) => s.id),
        fromIso,
        to,
        bucketSeconds,
      ),
    ),
  );
  if (results.some((r) => r === null)) return null;

  const rows: SensorRow[] = [];
  for (const result of results) {
    for (const row of result ?? []) {
      const sensor = byId.get(row.sensor_id);
      if (!sensor || typeof row.value_num !== "number") continue;
      rows.push({
        recorded_at: row.recorded_at,
        value_num: row.value_num,
        meta: {},
        device_sensors: {
          key: sensor.key,
          label: sensor.label,
          kind: sensor.kind,
          offset_num: sensor.offset_num,
          devices: { name: sensor.devices?.name ?? "Device" },
        },
      });
    }
  }
  return { rows, bucketMs: bucketSeconds * 1000 };
}

/**
 * Start of a rolling "last N days" chart window: exactly N × 24 h before now.
 * Local calendar math (setDate) gives 23 or 25 h days across a DST change;
 * Workers run in UTC, so this matches what production already got.
 */
export function rollingWindowStart(days: number, now: number = Date.now()): Date {
  return new Date(now - days * 24 * 60 * 60 * 1000);
}

/** Humidity from a sensor whose key matched no temperature probe (see probePairingKey). */
export type HumidityOnlyPoint = { timestamp: string; humidity: number; probeLabel: string };

export async function fetchGarageTempChartData(
  userId: string,
  days = 7,
  filters: HistoryFilters = {},
): Promise<{
  points: ChartPoint[];
  humidityOnly?: HumidityOnlyPoint[];
  /** Bucket width when points are samples (for the chart's gap rule); 0 for raw readings. */
  sampleIntervalMs?: number;
  error: string | null;
}> {
  const since = rollingWindowStart(days);
  const sinceIso = filters.from ?? since.toISOString();
  const chartFilters = { ...filters, from: sinceIso };

  // Preferred: sampled readings in a few calls (first/min/max per bucket).
  // Fallback: every raw row, then 500 evenly spaced readings (as before).
  const householdId = await getUserHouseholdId(userId);
  const sampled = householdId ? await fetchSampledSensorRows(householdId, sinceIso, filters.to) : null;
  let fromSensor: { readings: GarageTempReading[]; error: string | null };
  if (sampled) {
    fromSensor = {
      readings: pairTempHumidityRows(sampled.rows, userId).filter((reading) => matchesFilters(reading, chartFilters)),
      error: null,
    };
  } else {
    fromSensor = await fetchPairedFromSensorReadings(userId, chartFilters, {
      ascending: true,
      limit: CHART_DISPLAY_CAP,
    });
  }

  if (fromSensor.error) {
    return { points: [], error: fromSensor.error };
  }

  const readings = [...fromSensor.readings].sort(
    (a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp),
  );

  const points: ChartPoint[] = readings.flatMap((row) =>
    // Temperature charts only plot readings that have a temperature.
    row.tempf == null
      ? []
      : [{
          timestamp: row.timestamp,
          tempf: row.tempf,
          humidity: row.humidity,
          probeLabel: row.probe_label?.trim() || row.probe_key || "Probe",
          device: row.feed_name ?? undefined,
        }],
  );
  // Humidity that paired with no temperature: the chart can still draw it (no dew point).
  const humidityOnly: HumidityOnlyPoint[] = readings.flatMap((row) =>
    row.tempf == null && row.humidity != null && Number.isFinite(row.humidity)
      ? [{ timestamp: row.timestamp, humidity: row.humidity, probeLabel: row.probe_label?.trim() || row.probe_key || "Humidity" }]
      : [],
  );

  // For windows beyond raw retention, fill gaps from hourly rollups.
  if (days > 90 || points.length < 10) {
    const householdId = await getUserHouseholdId(userId);
    const rollupPoints = householdId
      ? await fetchRollupChartPointsForHousehold(householdId, sinceIso, filters)
      : [];
    if (rollupPoints.length > 0) {
      return {
        points: disambiguateChartLabels(mergeChartPoints(points, rollupPoints)),
        humidityOnly,
        sampleIntervalMs: sampled?.bucketMs ?? 0,
        error: null,
      };
    }
  }

  return { points: disambiguateChartLabels(points), humidityOnly, sampleIntervalMs: sampled?.bucketMs ?? 0, error: null };
}

/** Most rollup points handed to a chart; longer series are averaged into wider buckets. */
export const ROLLUP_POINT_CAP = 1500;

/**
 * Average a long series down to about `maxPoints`, per probe (device +
 * label): every `factor` consecutive points become one, at the first
 * point's time. Humidity averages only real values (null stays null).
 */
export function thinChartPoints(points: ChartPoint[], maxPoints = ROLLUP_POINT_CAP): ChartPoint[] {
  if (points.length <= maxPoints) return points;
  const factor = Math.ceil(points.length / maxPoints);
  const byProbe = new Map<string, ChartPoint[]>();
  for (const p of points) {
    const key = `${p.device ?? ""}|${p.probeLabel}`;
    const list = byProbe.get(key) ?? [];
    list.push(p);
    byProbe.set(key, list);
  }
  const out: ChartPoint[] = [];
  for (const list of byProbe.values()) {
    list.sort((x, y) => Date.parse(x.timestamp) - Date.parse(y.timestamp));
    for (let i = 0; i < list.length; i += factor) {
      const chunk = list.slice(i, i + factor);
      const hums = chunk.map((c) => c.humidity).filter((h): h is number => h != null && Number.isFinite(h));
      out.push({
        ...chunk[0]!,
        tempf: chunk.reduce((sum, c) => sum + c.tempf, 0) / chunk.length,
        humidity: hums.length ? hums.reduce((x, y) => x + y, 0) / hums.length : null,
      });
    }
  }
  return out.sort((x, y) => Date.parse(x.timestamp) - Date.parse(y.timestamp));
}

type RollupRow = {
  bucket_start: string;
  avg_num: number | null;
  device_sensors: {
    key: string;
    label: string;
    kind: string;
    offset_num?: number | null;
    devices: { name: string } | null;
  } | null;
};

/**
 * Hourly rollups as chart points, temperature with its paired humidity
 * (same pairing rule as raw readings: device + probePairingKey + hour),
 * averaged into wider buckets so any range length fits in one call.
 */
export async function fetchRollupChartPointsForHousehold(
  householdId: string,
  sinceIso: string,
  filters: HistoryFilters = {},
): Promise<ChartPoint[]> {
  try {
    const to = filters.to ?? new Date().toISOString();
    const sensorCount = await neonHistory.countChartSensors(householdId);
    const rows = await neonHistory.rollupBucketAverages(
      householdId,
      sinceIso,
      to,
      rollupBucketSeconds(sinceIso, to, sensorCount || 1),
    );
    const shaped: RollupRow[] = rows.map((row) => ({
      bucket_start: row.bucket_start,
      avg_num: row.avg_num,
      device_sensors: {
        key: row.key,
        label: row.label,
        kind: row.kind,
        offset_num: row.offset_num,
        devices: { name: row.device_name },
      },
    }));
    return thinChartPoints(rollupRowsToPoints(shaped, filters));
  } catch (error) {
    console.error("fetchRollupChartPointsForHousehold failed:", error instanceof Error ? error.message : error);
    return [];
  }
}

/** Rows per call: buckets × sensors ≈ this. */
const ROLLUP_TARGET_ROWS = 900;

/** Bucket width (s) for `sensorCount` sensors over [from, to]: at least an hour. */
export function rollupBucketSeconds(fromIso: string, toIso: string, sensorCount: number): number {
  const spanSec = Math.max(0, (Date.parse(toIso) - Date.parse(fromIso)) / 1000);
  return Math.max(3600, Math.ceil((spanSec * Math.max(1, sensorCount)) / ROLLUP_TARGET_ROWS));
}

/** Pair each bucket's humidity with its temperature (device + probePairingKey + bucket). */
function rollupRowsToPoints(rows: RollupRow[], filters: HistoryFilters): ChartPoint[] {
  const offsetOf = (s: NonNullable<RollupRow["device_sensors"]>) =>
    typeof s.offset_num === "number" ? s.offset_num : 0;
  const humidityByPair = new Map<string, number>();
  for (const row of rows) {
    const sensor = row.device_sensors;
    if (row.avg_num == null || sensor?.kind !== "humidity") continue;
    const device = sensor.devices?.name ?? "Device";
    humidityByPair.set(
      `${device}::${probePairingKey(sensor.key)}::${Date.parse(row.bucket_start)}`,
      applySensorOffset(Number(row.avg_num), offsetOf(sensor)),
    );
  }

  const points: ChartPoint[] = [];
  for (const row of rows) {
    const sensor = row.device_sensors;
    if (row.avg_num == null || sensor?.kind !== "temperature") continue;
    const probeLabel = sensor.label.replace(/ humidity$/i, "") || sensor.key || "Probe";
    const feedName = sensor.devices?.name ?? "Device";
    if (filters.feedName && feedName !== filters.feedName) continue;
    if (filters.probeKey && sensor.key !== filters.probeKey) continue;
    points.push({
      timestamp: row.bucket_start,
      tempf: applySensorOffset(Number(row.avg_num), offsetOf(sensor)),
      // Hourly mean humidity of the paired sensor; null when none (never 0).
      humidity: humidityByPair.get(`${feedName}::${probePairingKey(sensor.key)}::${Date.parse(row.bucket_start)}`) ?? null,
      probeLabel,
      device: feedName,
    });
  }
  return points;
}

export async function fetchHouseholdChartData(
  householdId: string,
  days = 7,
): Promise<{ points: ChartPoint[]; error: string | null }> {
  const since = rollingWindowStart(days);
  const sinceIso = since.toISOString();

  // Same sampled path as the signed-in charts; raw rows only as a fallback.
  const sampled = await fetchSampledSensorRows(householdId, sinceIso);
  const { rows, error } = sampled
    ? { rows: sampled.rows, error: null }
    : await fetchAllRawSensorRows(householdId, { from: sinceIso }, { ascending: true });

  if (error) {
    return { points: [], error };
  }

  const readings = pairTempHumidityRows(
    rows.filter((row) => {
      const kind = row.device_sensors?.kind;
      return kind === "temperature" || kind === "humidity";
    }),
    householdId,
  );

  let points: ChartPoint[] = readings.flatMap((row) =>
    // Temperature charts only plot readings that have a temperature.
    row.tempf == null
      ? []
      : [{
          timestamp: row.timestamp,
          tempf: row.tempf,
          humidity: row.humidity,
          probeLabel: row.probe_label?.trim() || row.probe_key || "Probe",
          device: row.feed_name ?? undefined,
        }],
  );

  if (points.length < 10) {
    const rollups = await fetchRollupChartPointsForHousehold(householdId, sinceIso);
    if (rollups.length > 0) {
      points = mergeChartPoints(points, rollups);
    }
  }

  return { points: disambiguateChartLabels(points), error: null };
}

/** Chart points from the same calendar window one year earlier (rollups + raw). */
export async function fetchGarageTempChartDataPriorYear(
  userId: string,
  days = 30,
  filters: HistoryFilters = {},
): Promise<{ points: ChartPoint[]; error: string | null }> {
  const end = new Date();
  end.setFullYear(end.getFullYear() - 1);
  const start = new Date(end);
  start.setDate(start.getDate() - days);

  const priorFilters: HistoryFilters = {
    ...filters,
    from: start.toISOString(),
    to: end.toISOString(),
  };

  const fromSensor = await fetchPairedFromSensorReadings(userId, priorFilters, {
    ascending: true,
    limit: CHART_DISPLAY_CAP,
  });
  if (fromSensor.error) {
    return { points: [], error: fromSensor.error };
  }

  let points: ChartPoint[] = fromSensor.readings.flatMap((row) =>
    // Temperature charts only plot readings that have a temperature.
    row.tempf == null
      ? []
      : [{
          timestamp: row.timestamp,
          tempf: row.tempf,
          humidity: row.humidity,
          probeLabel: row.probe_label?.trim() || row.probe_key || "Probe",
          device: row.feed_name ?? undefined,
        }],
  );

  const householdId = await getUserHouseholdId(userId);
  const rollups = householdId
    ? await fetchRollupChartPointsForHousehold(
        householdId,
        start.toISOString(),
        priorFilters,
      )
    : [];
  const endMs = end.getTime();
  const filteredRollups = rollups.filter((p) => Date.parse(p.timestamp) <= endMs);
  if (filteredRollups.length > 0) {
    points = mergeChartPoints(points, filteredRollups);
  }

  return { points: disambiguateChartLabels(points), error: null };
}

/** Earliest stored sensor reading for empty-state copy on YoY comparisons. */
export async function fetchEarliestSensorReadingAt(
  householdId: string,
): Promise<string | null> {
  return neonHistory.fetchEarliestSensorReadingAt(householdId);
}

export async function fetchHistoryFilterOptions(userId: string): Promise<{
  feeds: string[];
  probes: { key: string; label: string }[];
  error: string | null;
}> {
  const householdId = await getUserHouseholdId(userId);
  if (!householdId) {
    return { feeds: [], probes: [], error: null };
  }

  const { data, error } = await neonHistory.listDevicesWithSensorsForFilters(householdId);

  if (error) {
    return { feeds: [], probes: [], error };
  }

  const feeds = [
    ...new Set(
      (data ?? [])
        .map((device) => device.name?.trim())
        .filter((name): name is string => Boolean(name)),
    ),
  ];
  const probeMap = new Map<string, string>();

  for (const device of data ?? []) {
    for (const sensor of device.device_sensors ?? []) {
      if (sensor.kind !== "temperature") continue;
      const key = sensor.key?.trim();
      if (!key || probeMap.has(key)) continue;
      probeMap.set(key, sensor.label.replace(/ humidity$/i, "").trim() || key);
    }
  }

  return {
    feeds,
    probes: [...probeMap.entries()].map(([key, label]) => ({ key, label })),
    error: null,
  };
}

export function buildGarageTempsCsv(readings: GarageTempReading[]): string {
  const headers = [
    "recorded_at",
    "feed_name",
    "probe_label",
    "probe_key",
    "temperature_f",
    "temperature_c",
    "humidity_percent",
  ];

  const rows = readings.map((reading) =>
    [
      new Date(reading.timestamp).toISOString(),
      getReadingFeedName(reading),
      getReadingProbeLabel(reading),
      reading.probe_key?.trim() || "",
      // Empty cell when not measured (never 0.0).
      reading.tempf == null ? "" : reading.tempf.toFixed(1),
      reading.tempc == null ? "" : reading.tempc.toFixed(1),
      reading.humidity == null ? "" : reading.humidity.toFixed(1),
    ]
      .map(escapeCsvField)
      .join(","),
  );

  return [headers.join(","), ...rows].join("\n");
}
