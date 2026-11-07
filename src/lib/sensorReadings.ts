import { insertSensorReadings as neonInsertSensorReadings } from "./db/ingest";
import * as neonReadings from "./db/readings";
import type { DeviceSensor, DeviceWithSensors } from "./devices";
import type { TempFeedResult, TempProbeConfig } from "./tempFeedConfig";
import { implausibleReason } from "./readingPlausibility";
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
  return neonInsertSensorReadings(rows);
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
  return neonReadings.getRecentNumericReadings(sensorId, sinceIso);
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
  return neonReadings.getNumericReadingInWindow(sensorId, notBeforeIso, atOrBeforeIso);
}

/** True when the sensor reported a value above `thresholdF` at or after `sinceIso` (one-row probe). */
export async function hasNumericReadingAboveSince(
  sensorId: string,
  sinceIso: string,
  thresholdF: number,
): Promise<boolean> {
  return neonReadings.hasNumericReadingAboveSince(sensorId, sinceIso, thresholdF);
}

export async function getRecentNumericReadingSamples(
  sensorId: string,
  sinceIso: string,
): Promise<Array<{ at: string; tempF: number }>> {
  return neonReadings.getRecentNumericReadingSamples(sensorId, sinceIso);
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
  const [anchor, window] = await Promise.all([
    neonReadings.getDwellAnchor(sensorId, anchorSinceIso, cutoffIso),
    getRecentNumericReadingSamples(sensorId, cutoffIso),
  ]);
  return [...anchor, ...window];
}

export async function fetchRecentBoolReadings(
  sensorId: string,
  sinceIso: string,
): Promise<Array<{ value: boolean; recordedAt: string }>> {
  return neonReadings.fetchRecentBoolReadings(sensorId, sinceIso);
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

/**
 * Latest reading per visible sensor, plus whether the lookup failed. `error`
 * is set when a database query failed, so callers can say "couldn't load"
 * instead of showing an empty (no devices / waiting for a reading) state.
 * `rows` holds whatever did load.
 */
export async function fetchLatestSensorValuesResult(
  householdId: string,
): Promise<{ rows: LatestSensorRow[]; error: string | null }> {
  return neonReadings.fetchLatestSensorValuesResult(householdId);
}

/** Latest reading per visible sensor; a failed query reads as no rows (see fetchLatestSensorValuesResult). */
export async function fetchLatestSensorValues(
  householdId: string,
): Promise<LatestSensorRow[]> {
  return (await fetchLatestSensorValuesResult(householdId)).rows;
}
