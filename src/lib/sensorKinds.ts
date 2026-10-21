import type { Locale } from "../i18n/locales";
import { libTextMessages } from "../i18n/messages/app/libText";

export const SENSOR_KINDS = [
  "temperature",
  "humidity",
  "co2",
  "pressure",
  "pm25",
  "voc",
  "level",
  "energy",
  "door",
  "power",
  "flood",
  "motion",
  "generic",
] as const;

export type SensorKind = (typeof SENSOR_KINDS)[number];

export const SENSOR_KIND_LABELS: Record<SensorKind, string> = {
  temperature: "Temperature",
  humidity: "Humidity",
  co2: "CO₂",
  pressure: "Barometric pressure",
  pm25: "PM2.5",
  voc: "VOC",
  level: "Water / sump level",
  energy: "Energy",
  door: "Door",
  power: "Power",
  flood: "Flood / leak",
  motion: "Motion",
  generic: "Generic",
};

/** {@link SENSOR_KIND_LABELS} in the given language. */
export function sensorKindLabels(locale: Locale = "en"): Record<SensorKind, string> {
  return locale === "en" ? SENSOR_KIND_LABELS : libTextMessages(locale).sensorKinds;
}

/** One kind's label in the given language; unknown kinds come back as given. */
export function sensorKindLabel(kind: string, locale: Locale = "en"): string {
  return isSensorKind(kind) ? sensorKindLabels(locale)[kind] : kind;
}

export const SENSOR_KIND_UNITS: Partial<Record<SensorKind, string>> = {
  temperature: "°F",
  humidity: "%",
  co2: "ppm",
  pressure: "hPa",
  pm25: "µg/m³",
  voc: "ppb",
  level: "%",
  energy: "W",
};

export const BOOL_SENSOR_KINDS = ["door", "power", "flood", "motion"] as const satisfies readonly SensorKind[];

export const NUMERIC_SENSOR_KINDS = [
  "temperature",
  "humidity",
  "co2",
  "pressure",
  "pm25",
  "voc",
  "level",
  "energy",
  "generic",
] as const satisfies readonly SensorKind[];

export function isSensorKind(value: string): value is SensorKind {
  return (SENSOR_KINDS as readonly string[]).includes(value);
}

export function isBoolSensorKind(kind: string): boolean {
  return (BOOL_SENSOR_KINDS as readonly string[]).includes(kind);
}

export function isNumericSensorKind(kind: string): boolean {
  return (NUMERIC_SENSOR_KINDS as readonly string[]).includes(kind);
}

export function formatBoolSensorValue(kind: string, value: boolean, locale: Locale = "en"): string {
  const t = libTextMessages(locale).sensorValues;
  if (kind === "door") return value ? t.open : t.closed;
  if (kind === "power") return value ? t.on : t.off;
  if (kind === "flood") return value ? t.wet : t.dry;
  if (kind === "motion") return value ? t.detected : t.clear;
  return value ? t.on : t.off;
}

export function defaultUnitForKind(kind: SensorKind): string | null {
  return SENSOR_KIND_UNITS[kind] ?? null;
}
