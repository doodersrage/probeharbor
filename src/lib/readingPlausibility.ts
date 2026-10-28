import type { SensorKind } from "./sensorKinds";

/**
 * Values that can't be a real measurement are rejected at the boundary, not
 * stored. They would otherwise read as real and fire (or mask) alerts: a
 * disconnected DS18B20 reports -127°C (-196.6°F), a freeze; one that just
 * powered up reports 85°C (185°F).
 *
 * Temperatures are °F here (after any unit conversion).
 */
export type ImplausibleReason = "sensor_fault" | "out_of_range";

const DS18B20_FAULTS_F = [185, -196.6];
const TEMP_MIN_F = -100;
const TEMP_MAX_F = 250;

export function implausibleReason(kind: SensorKind, value: number | null): ImplausibleReason | null {
  if (value == null) return null;
  if (kind === "temperature") {
    if (DS18B20_FAULTS_F.some((fault) => Math.abs(value - fault) < 0.05)) return "sensor_fault";
    if (value < TEMP_MIN_F || value > TEMP_MAX_F) return "out_of_range";
  }
  if (kind === "humidity" && (value < 0 || value > 100)) return "out_of_range";
  return null;
}
