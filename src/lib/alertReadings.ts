import type { TempFeedResult, TempProbeConfig } from "./tempFeedConfig";
import type { AlertReading } from "./alerts";
import type { DeviceSensor, DeviceWithSensors } from "./devices";
import { probePairingKey } from "./probePairing";
import { applySensorOffset } from "./sensorCalibration";

export function buildReadingsFromResults(
  results: TempFeedResult[],
  probes: TempProbeConfig[],
  devices: DeviceWithSensors[] = [],
): AlertReading[] {
  const spaceByFeedId = new Map(
    devices.filter((d) => d.pull_url).map((d) => [d.id, d.space ?? null]),
  );
  const devicesById = new Map(devices.map((d) => [d.id, d]));

  return probes.flatMap((probe) => {
    const feed = results.find((result) => result.id === probe.feedId);
    const data = feed?.probes[probe.key];
    if (!feed || feed.error || !data) return [];
    const device = devicesById.get(probe.feedId);
    const tempSensor = device?.sensors.find(
      (s) => s.key === probe.key && s.kind === "temperature",
    );
    const humiditySensor = device?.sensors.find(
      (s) => s.key === probe.key && s.kind === "humidity",
    );
    return [{
      label: probe.label,
      tempf: applySensorOffset(data.f, tempSensor?.offset_num ?? 0),
      humidity: applySensorOffset(data.h, humiditySensor?.offset_num ?? 0),
      space: spaceByFeedId.get(probe.feedId) ?? null,
      sensorId: tempSensor?.id,
    }];
  });
}

/** Wet flood / leak sensors from latest DB values (push + pull). */
export function buildFloodReadingsFromLatestSensors(
  latest: Array<{
    sensor: DeviceSensor;
    deviceSpace?: string | null;
    value_bool?: boolean | null;
  }>,
): Array<{ label: string; space?: string | null }> {
  return latest
    .filter((row) => row.sensor.kind === "flood" && row.value_bool === true)
    .map((row) => ({
      label: row.sensor.label,
      space: row.deviceSpace ?? null,
    }));
}

/** Build freeze/humidity alert readings from latest DB sensor values (push + pull). */
export function buildAlertReadingsFromLatestSensors(
  latest: Array<{
    sensor: DeviceSensor;
    deviceName: string;
    deviceSpace?: string | null;
    value_num: number | null;
  }>,
): AlertReading[] {
  type Acc = {
    label: string;
    tempf?: number;
    humidity?: number;
    space?: string | null;
    sensorId?: string;
  };
  const byKey = new Map<string, Acc>();
  // Humidity is matched to its temperature probe on the shared part of the key
  // ("humidity1" ↔ "temp1"); temperatures keep their full key.
  const humidityByPair = new Map<string, number>();
  for (const row of latest) {
    if (row.value_num == null || row.sensor.kind !== "humidity") continue;
    humidityByPair.set(`${row.sensor.device_id}:${probePairingKey(row.sensor.key)}`, row.value_num);
  }

  for (const row of latest) {
    if (row.value_num == null) continue;
    if (row.sensor.kind !== "temperature") {
      continue;
    }

    const mapKey = `${row.sensor.device_id}:${row.sensor.key}`;
    const entry = byKey.get(mapKey) ?? {
      label: row.sensor.label.replace(/\s+humidity$/i, "") || row.sensor.label,
      space: row.deviceSpace ?? null,
    };

    entry.tempf = row.value_num;
    entry.label = row.sensor.label.replace(/\s+humidity$/i, "") || row.sensor.label;
    entry.sensorId = row.sensor.id;
    entry.humidity = humidityByPair.get(`${row.sensor.device_id}:${probePairingKey(row.sensor.key)}`);

    byKey.set(mapKey, entry);
  }

  return [...byKey.values()]
    .filter((entry) => typeof entry.tempf === "number")
    .map((entry) => ({
      label: entry.label,
      tempf: entry.tempf!,
      humidity: entry.humidity ?? 0,
      space: entry.space ?? null,
      sensorId: entry.sensorId,
    }));
}

/** Prefer live feed readings; fill gaps from stored sensor readings. */
export function mergeAlertReadings(
  preferred: AlertReading[],
  fallback: AlertReading[],
): AlertReading[] {
  // Key by sensor: two devices can both have a probe labeled "Temp1", and
  // keying by label alone silently dropped one of them from alerts.
  const key = (reading: AlertReading) => reading.sensorId ?? `label:${reading.label}`;
  const merged = new Map<string, AlertReading>();
  for (const reading of fallback) {
    merged.set(key(reading), reading);
  }
  for (const reading of preferred) {
    merged.set(key(reading), reading);
  }
  return [...merged.values()];
}
