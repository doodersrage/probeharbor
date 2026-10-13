import type { DeviceWithSensors } from "./devices";
import { SENSOR_KIND_LABELS, type SensorKind } from "./sensorKinds";

export type ReplacementOption = {
  sensorId: string;
  kind: SensorKind;
  label: string;
};

/**
 * Sensors that can take part in a replacement, grouped by kind. A kind needs
 * at least two sensors (the retired one and its replacement) to be offered.
 */
export function replacementOptionsByKind(
  devices: DeviceWithSensors[],
): Array<{ kind: SensorKind; kindLabel: string; options: ReplacementOption[] }> {
  const byKind = new Map<SensorKind, ReplacementOption[]>();
  for (const device of devices) {
    for (const sensor of device.sensors) {
      const option = { sensorId: sensor.id, kind: sensor.kind, label: `${device.name} · ${sensor.label}` };
      byKind.set(sensor.kind, [...(byKind.get(sensor.kind) ?? []), option]);
    }
  }
  return [...byKind]
    .filter(([, options]) => options.length >= 2)
    .map(([kind, options]) => ({
      kind,
      kindLabel: SENSOR_KIND_LABELS[kind],
      options: options.sort((a, b) => a.label.localeCompare(b.label)),
    }))
    .sort((a, b) => a.kindLabel.localeCompare(b.kindLabel));
}

const REPLACEMENT_ERRORS = {
  same_sensor: "Pick two different sensors.",
  kind_mismatch: "Both sensors need to be the same type (temperature with temperature).",
  sensor_not_found: "One of those sensors isn't in this property anymore.",
  failed: "Couldn't replace the sensor. Nothing was changed.",
} as const;

export type ReplacementErrorCode = keyof typeof REPLACEMENT_ERRORS;

/** Error code for a replace_device_sensor failure (safe to put in a URL). */
export function replacementErrorCode(raw: string | null | undefined): ReplacementErrorCode {
  for (const code of ["same_sensor", "kind_mismatch", "sensor_not_found"] as const) {
    if (raw?.includes(code)) return code;
  }
  return "failed";
}

/** Flash text for a code; unknown codes get the generic message, never the raw value. */
export function replacementErrorMessage(code: string | null | undefined): string {
  return code && code in REPLACEMENT_ERRORS
    ? REPLACEMENT_ERRORS[code as ReplacementErrorCode]
    : REPLACEMENT_ERRORS.failed;
}
