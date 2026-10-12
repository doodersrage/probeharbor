import type { LatestSensorRow } from "./sensorReadings";

/** How much warmer than the other probes before we suggest moving the sensor. */
const WARM_GAP_F = 12;
const FRESH_MS = 2 * 60 * 60 * 1000;

export type WarmSensorHint = { deviceName: string; label: string; gapF: number };

/**
 * DHT22s and I2C sensors are often mounted right next to their ESP32, which runs
 * warm: one read ~18°F above the house in testing. Flag a temperature+humidity
 * sensor that reads far above the household's other probes. Only sensors with
 * humidity on the same device (DHT/I2C style) are flagged, since a DS18B20 that
 * reads warm is usually just in a warm spot.
 */
export function findWarmBoardSensors(latest: LatestSensorRow[], now = Date.now()): WarmSensorHint[] {
  const fresh = latest.filter(
    (row) => row.value_num != null && now - Date.parse(row.recorded_at) < FRESH_MS,
  );
  const temps = fresh.filter((row) => row.sensor.kind === "temperature");
  const devicesWithHumidity = new Set(
    fresh.filter((row) => row.sensor.kind === "humidity").map((row) => row.sensor.device_id),
  );
  const hints: WarmSensorHint[] = [];
  for (const row of temps) {
    if (!devicesWithHumidity.has(row.sensor.device_id)) continue;
    const others = temps
      .filter((other) => other.sensor.device_id !== row.sensor.device_id)
      .map((other) => other.value_num as number)
      .sort((a, b) => a - b);
    if (others.length === 0) continue;
    const median = others[Math.floor(others.length / 2)] as number;
    const gap = (row.value_num as number) - median;
    if (gap >= WARM_GAP_F) {
      hints.push({ deviceName: row.deviceName, label: row.sensor.label, gapF: Math.round(gap) });
    }
  }
  return hints;
}
