import { dbBackend } from "./db/client";
import { insertSensorReadings as neonInsertSensorReadings } from "./db/ingest";
import * as neonReadings from "./db/readings";
import { createServerClient } from "./supabase";
import type { Json } from "../types/supabase";
import type { DeviceSensor, DeviceWithSensors } from "./devices";
import type { TempFeedResult, TempProbeConfig } from "./tempFeedConfig";
import { applySensorOffset } from "./sensorCalibration";
import { implausibleReason } from "./readingPlausibility";
import { fetchNewestFirstPages } from "./pagedRows";
import { isDemoDevice } from "./demoFeed";
import { reportIntervalMsFromMeta } from "./reportInterval";
export type { TypedSensorValue } from "./ingestPayload";
export { parseIngestPayload, inferSensorKind } from "./ingestPayload";

export type SensorReadingInsert = {
  sensor_id: string;
  household_id: string;
  recorded_at?: string;
  value_num?: number | null;
  value_bool?: boolean | null;
  value_text?: string | null;
  meta?: Record<string, unknown>;
};

export type GarageTempCompat = {
  tempc: number;
  tempf: number;
  humidity: number;
  timestamp: string;
  feed_name?: string | null;
  probe_label?: string | null;
  probe_key?: string | null;
  user_id?: string | null;
};

export async function insertSensorReadings(
  rows: SensorReadingInsert[],
): Promise<{ error: string | null }> {
  if (rows.length === 0) return { error: null };
  if (dbBackend() === "neon") return neonInsertSensorReadings(rows);

  const supabase = createServerClient();
  const { error } = await supabase.from("sensor_readings").insert(
    rows.map((row) => ({
      sensor_id: row.sensor_id,
      household_id: row.household_id,
      recorded_at: row.recorded_at ?? new Date().toISOString(),
      value_num: row.value_num ?? null,
      value_bool: row.value_bool ?? null,
      value_text: row.value_text ?? null,
      meta: (row.meta ?? {}) as Json,
    })),
  );

  return { error: error?.message ?? null };
}

export function buildReadingRowsFromTempResults(
  householdId: string,
  devices: DeviceWithSensors[],
  results: TempFeedResult[],
  probes: TempProbeConfig[],
): SensorReadingInsert[] {
  const recordedAt = new Date().toISOString();
  const rows: SensorReadingInsert[] = [];
  const devicesById = new Map(devices.map((d) => [d.id, d]));

  for (const probe of probes.filter((p) => p.visible)) {
    const device = devicesById.get(probe.feedId);
    const result = results.find((r) => r.id === probe.feedId);
    if (!device || !result || result.error) continue;

    const reading = result.probes[probe.key];
    if (!reading) continue;

    const tempSensor = device.sensors.find(
      (s) => s.key === probe.key && s.kind === "temperature",
    );
    const humiditySensor = device.sensors.find(
      (s) => s.key === probe.key && s.kind === "humidity",
    );

    if (tempSensor && reading.f != null && !implausibleReason("temperature", reading.f)) {
      rows.push({
        sensor_id: tempSensor.id,
        household_id: householdId,
        recorded_at: recordedAt,
        value_num: reading.f,
        meta: { tempc: reading.c, tempf: reading.f },
      });
    }

    if (humiditySensor && reading.h != null && !implausibleReason("humidity", reading.h)) {
      rows.push({
        sensor_id: humiditySensor.id,
        household_id: householdId,
        recorded_at: recordedAt,
        value_num: reading.h,
        meta: { humidity: reading.h },
      });
    }
  }

  return rows;
}

export async function getRecentNumericReadings(
  sensorId: string,
  sinceIso: string,
): Promise<number[]> {
  if (dbBackend() === "neon") return neonReadings.getRecentNumericReadings(sensorId, sinceIso);
  const supabase = createServerClient();
  const { data } = await supabase
    .from("sensor_readings")
    .select("value_num")
    .eq("sensor_id", sensorId)
    .gte("recorded_at", sinceIso)
    .order("recorded_at", { ascending: true });

  return (data ?? [])
    .map((row) => row.value_num)
    .filter((v): v is number => typeof v === "number");
}

/**
 * The latest numeric reading in [notBeforeIso, atOrBeforeIso], or null.
 * One row; used for "change over the last N hours" comparisons.
 */
export async function getNumericReadingInWindow(
  sensorId: string,
  notBeforeIso: string,
  atOrBeforeIso: string,
): Promise<{ value: number; at: string } | null> {
  if (dbBackend() === "neon") return neonReadings.getNumericReadingInWindow(sensorId, notBeforeIso, atOrBeforeIso);
  const supabase = createServerClient();
  const { data } = await supabase
    .from("sensor_readings")
    .select("value_num, recorded_at")
    .eq("sensor_id", sensorId)
    .gte("recorded_at", notBeforeIso)
    .lte("recorded_at", atOrBeforeIso)
    .order("recorded_at", { ascending: false })
    .limit(1);
  const row = data?.[0];
  return row && typeof row.value_num === "number" && typeof row.recorded_at === "string"
    ? { value: row.value_num, at: row.recorded_at }
    : null;
}

/** True when the sensor reported a value above `thresholdF` at or after `sinceIso` (one-row probe). */
export async function hasNumericReadingAboveSince(
  sensorId: string,
  sinceIso: string,
  thresholdF: number,
): Promise<boolean> {
  if (dbBackend() === "neon") return neonReadings.hasNumericReadingAboveSince(sensorId, sinceIso, thresholdF);
  const supabase = createServerClient();
  const { data } = await supabase
    .from("sensor_readings")
    .select("id")
    .eq("sensor_id", sensorId)
    .gte("recorded_at", sinceIso)
    .gt("value_num", thresholdF)
    .limit(1);
  return (data ?? []).length > 0;
}

export async function getRecentNumericReadingSamples(
  sensorId: string,
  sinceIso: string,
): Promise<Array<{ at: string; tempF: number }>> {
  if (dbBackend() === "neon") return neonReadings.getRecentNumericReadingSamples(sensorId, sinceIso);
  const supabase = createServerClient();
  const { data } = await supabase
    .from("sensor_readings")
    .select("value_num, recorded_at")
    .eq("sensor_id", sensorId)
    .gte("recorded_at", sinceIso)
    .order("recorded_at", { ascending: true });

  return (data ?? [])
    .filter((row) => typeof row.value_num === "number" && typeof row.recorded_at === "string")
    .map((row) => ({
      at: row.recorded_at as string,
      tempF: row.value_num as number,
    }));
}

/** Anchor lookback: how far back to look for the last reading before a dwell window. */
const DWELL_ANCHOR_LOOKBACK_MS = 24 * 60 * 60 * 1000;

/**
 * Samples for a freeze-dwell check: every reading since `cutoffIso`, plus the
 * most recent reading before it. That anchor proves the probe was already cold
 * when the window opened, however often the device reports.
 */
export async function getFreezeDwellSamples(
  sensorId: string,
  cutoffIso: string,
): Promise<Array<{ at: string; tempF: number }>> {
  const anchorSinceIso = new Date(
    Date.parse(cutoffIso) - DWELL_ANCHOR_LOOKBACK_MS,
  ).toISOString();
  if (dbBackend() === "neon") {
    const [neonAnchor, neonWindow] = await Promise.all([
      neonReadings.getDwellAnchor(sensorId, anchorSinceIso, cutoffIso),
      getRecentNumericReadingSamples(sensorId, cutoffIso),
    ]);
    return [...neonAnchor, ...neonWindow];
  }
  const supabase = createServerClient();
  const [anchor, window] = await Promise.all([
    supabase
      .from("sensor_readings")
      .select("value_num, recorded_at")
      .eq("sensor_id", sensorId)
      .gte("recorded_at", anchorSinceIso)
      .lt("recorded_at", cutoffIso)
      .not("value_num", "is", null)
      .order("recorded_at", { ascending: false })
      .limit(1),
    getRecentNumericReadingSamples(sensorId, cutoffIso),
  ]);

  const anchorSamples = (anchor.data ?? [])
    .filter((row) => typeof row.value_num === "number" && typeof row.recorded_at === "string")
    .map((row) => ({ at: row.recorded_at as string, tempF: row.value_num as number }));
  return [...anchorSamples, ...window];
}

export async function fetchRecentBoolReadings(
  sensorId: string,
  sinceIso: string,
): Promise<Array<{ value: boolean; recordedAt: string }>> {
  if (dbBackend() === "neon") return neonReadings.fetchRecentBoolReadings(sensorId, sinceIso);
  const supabase = createServerClient();
  // A device posting every minute sends 1440 door states a day, past the
  // 1000-row limit. Reading oldest-first cut off the newest ~7 hours, so
  // door alerts, door history and "open now" saw a stale state. Page
  // through newest-first (10 pages ≈ a week at one reading a minute).
  const { rows: data, error, capped } = await fetchNewestFirstPages((start, end) =>
    supabase
      .from("sensor_readings")
      .select("value_bool, recorded_at")
      .eq("sensor_id", sensorId)
      .gte("recorded_at", sinceIso)
      .not("value_bool", "is", null)
      .order("recorded_at", { ascending: false })
      .range(start, end),
  );
  if (error) {
    console.error(`fetchRecentBoolReadings(${sensorId}) failed:`, error);
    return [];
  }
  if (capped) console.warn(`fetchRecentBoolReadings(${sensorId}): row cap hit; oldest readings not included`);

  return data
    .filter((row) => typeof row.value_bool === "boolean")
    .map((row) => ({
      value: row.value_bool as boolean,
      recordedAt: row.recorded_at as string,
    }));
}

export type LatestSensorRow = {
  sensor: DeviceSensor;
  deviceName: string;
  deviceSpace?: string | null;
  value_num: number | null;
  value_bool: boolean | null;
  value_text: string | null;
  recorded_at: string;
  /** From a demo (simulated) feed: label it, never alert on it (see demoFeed). */
  deviceDemo?: boolean;
  /**
   * The device's learned report interval (ms), null when not yet learned, so
   * freshness checks can use the shared rule (relativeTime `readingFreshness`).
   */
  reportIntervalMs?: number | null;
};

type LatestReading = {
  value_num: number | null;
  value_bool: boolean | null;
  value_text: string | null;
  recorded_at: string;
};

/**
 * Latest reading per sensor in one call (latest_sensor_readings). Falls back
 * to one query per sensor if the function isn't deployed yet.
 */
async function fetchLatestReadingsBySensor(
  supabase: ReturnType<typeof createServerClient>,
  sensorIds: string[],
): Promise<{ bySensor: Map<string, LatestReading>; error: string | null }> {
  const bySensor = new Map<string, LatestReading>();
  const { data, error } = await supabase.rpc("latest_sensor_readings", {
    p_sensor_ids: sensorIds,
  });
  if (!error && Array.isArray(data)) {
    for (const row of data) bySensor.set(row.sensor_id, row);
    return { bySensor, error: null };
  }

  console.warn("latest_sensor_readings unavailable, using per-sensor queries:", error?.message);
  let fallbackError: string | null = null;
  const rows = await Promise.all(
    sensorIds.map(async (sensorId) => {
      const { data: reading, error: readError } = await supabase
        .from("sensor_readings")
        .select("value_num, value_bool, value_text, recorded_at")
        .eq("sensor_id", sensorId)
        .order("recorded_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (readError) fallbackError ??= readError.message;
      return [sensorId, reading] as const;
    }),
  );
  for (const [sensorId, reading] of rows) {
    if (reading) bySensor.set(sensorId, reading);
  }
  return { bySensor, error: fallbackError };
}

/**
 * Latest reading per visible sensor, plus whether the lookup failed. `error`
 * is set when a database query failed, so callers can say "couldn't load"
 * instead of showing an empty (no devices / waiting for a reading) state.
 * `rows` holds whatever did load.
 */
export async function fetchLatestSensorValuesResult(
  householdId: string,
): Promise<{ rows: LatestSensorRow[]; error: string | null }> {
  if (dbBackend() === "neon") return neonReadings.fetchLatestSensorValuesResult(householdId);
  const supabase = createServerClient();
  const { data: devices, error: devicesError } = await supabase
    .from("devices")
    .select("id, name, space, source, pull_url, meta")
    .eq("household_id", householdId)
    .eq("enabled", true);

  if (devicesError) return { rows: [], error: devicesError.message };
  if (!devices || devices.length === 0) return { rows: [], error: null };

  const { data: sensors, error: sensorsError } = await supabase
    .from("device_sensors")
    .select("id, device_id, key, label, kind, unit, visible, sort_order, offset_num")
    .in(
      "device_id",
      devices.map((d) => d.id),
    )
    .eq("visible", true);

  if (sensorsError) return { rows: [], error: sensorsError.message };
  if (!sensors || sensors.length === 0) return { rows: [], error: null };

  const deviceName = new Map(devices.map((d) => [d.id, d.name]));
  const deviceSpace = new Map(
    devices.map((d) => [d.id, typeof d.space === "string" ? d.space : null]),
  );
  const demoDeviceIds = new Set(devices.filter((d) => isDemoDevice(d)).map((d) => d.id));
  const intervalByDevice = new Map(devices.map((d) => [d.id, reportIntervalMsFromMeta(d.meta)]));

  const { bySensor: readingBySensor, error: readingsError } = await fetchLatestReadingsBySensor(
    supabase,
    sensors.map((s) => s.id),
  );
  const readingRows = sensors.map((sensor) => ({
    sensor,
    reading: readingBySensor.get(sensor.id) ?? null,
  }));

  const results: LatestSensorRow[] = [];
  for (const { sensor, reading } of readingRows) {
    if (!reading) continue;

    const offset =
      typeof (sensor as { offset_num?: number }).offset_num === "number"
        ? (sensor as { offset_num: number }).offset_num
        : 0;
    const valueNum =
      reading.value_num != null &&
      (sensor.kind === "temperature" || sensor.kind === "humidity")
        ? applySensorOffset(reading.value_num, offset)
        : reading.value_num;

    results.push({
      sensor: sensor as DeviceSensor,
      deviceName: deviceName.get(sensor.device_id) ?? "Device",
      deviceSpace: deviceSpace.get(sensor.device_id) ?? null,
      value_num: valueNum,
      value_bool: reading.value_bool,
      value_text: reading.value_text,
      recorded_at: reading.recorded_at,
      deviceDemo: demoDeviceIds.has(sensor.device_id),
      reportIntervalMs: intervalByDevice.get(sensor.device_id) ?? null,
    });
  }

  return { rows: results, error: readingsError };
}

/** Latest reading per visible sensor; a failed query reads as no rows (see fetchLatestSensorValuesResult). */
export async function fetchLatestSensorValues(
  householdId: string,
): Promise<LatestSensorRow[]> {
  return (await fetchLatestSensorValuesResult(householdId)).rows;
}
