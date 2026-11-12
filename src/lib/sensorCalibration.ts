/** Clamp and apply per-sensor calibration offsets (display + alerts; raw DB stays unchanged). */

export const TEMP_OFFSET_MAX_F = 10;
export const HUMIDITY_OFFSET_MAX = 15;

export function clampSensorOffset(
  offset: number,
  kind: "temperature" | "humidity" | string,
): number {
  if (!Number.isFinite(offset)) return 0;
  const max =
    kind === "humidity" ? HUMIDITY_OFFSET_MAX : kind === "temperature" ? TEMP_OFFSET_MAX_F : 10;
  return Math.max(-max, Math.min(max, offset));
}

export function applySensorOffset(
  value: number,
  offset: number | null | undefined,
): number {
  if (!Number.isFinite(value)) return value;
  const o = typeof offset === "number" && Number.isFinite(offset) ? offset : 0;
  return value + o;
}

export function parseOffsetFormValue(raw: FormDataEntryValue | null): number {
  if (raw == null || String(raw).trim() === "") return 0;
  const n = Number.parseFloat(String(raw));
  return Number.isFinite(n) ? n : 0;
}

/**
 * The unit a sensor's calibration offset is in: the unit its readings are
 * stored in. Temperatures are stored in °F (°C payloads are converted at
 * ingest), so a temperature offset is in °F whatever the display preference.
 * Empty when the sensor has no unit.
 */
export function calibrationOffsetUnit(kind: string | null | undefined, unit: string | null | undefined): string {
  if (kind === "temperature") return "°F";
  if (kind === "humidity") return "%";
  return unit?.trim() ?? "";
}

