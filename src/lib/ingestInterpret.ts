import type { SensorKind } from "./sensorKinds";
import { inferSensorKind, parseIngestPayload } from "./ingestPayload";
import { parseTempFeedPayload } from "./tempFeedConfig";
import { discoverIngestPayload } from "./feedDiscovery";
import { labelForPushSensorKey, type DiscoveredPushSensor } from "./pushSensorDiscovery";

/** One value the ingest endpoint would store, before it has a sensor id. */
export type InterpretedReading = {
  key: string;
  label: string;
  kind: SensorKind;
  unit: string | null;
  value_num: number | null;
  value_bool: boolean | null;
  value_text: string | null;
  meta: Record<string, unknown>;
};

export type InterpretedIngest = {
  discovered: DiscoveredPushSensor[];
  readings: InterpretedReading[];
  batteryPct: number | null;
  rssi: number | null;
  /** Browser-flasher firmware (1.2.1+) reports its version so Devices can offer updates. */
  firmwareVersion: string | null;
};

const round2 = (value: number) => Math.round(value * 100) / 100;

/**
 * Temperatures are stored and alerted on in °F. Convert a °C or K value sent
 * in `sensors[]`, keeping what the device sent in meta. Returns null when the
 * unit is already °F or isn't a recognised temperature unit.
 */
export function temperatureToFahrenheit(
  value: number,
  unit: string | null | undefined,
): { f: number; from: "C" | "K" } | null {
  const u = (unit ?? "").trim().toLowerCase().replace("°", "").replace("º", "");
  if (u === "c" || u === "cel" || u === "celsius" || u === "degc") {
    return { f: round2((value * 9) / 5 + 32), from: "C" };
  }
  if (u === "k" || u === "kelvin") {
    return { f: round2(((value - 273.15) * 9) / 5 + 32), from: "K" };
  }
  return null;
}

/**
 * A number, or a numeric string. `Number()` alone would turn `null`, `""`,
 * and `false` into 0, which reads as a dead battery.
 */
export function numericField(value: unknown): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

/**
 * What a push payload means: the readings and device fields the ingest
 * endpoint stores. Shared by the endpoint and the payload checker so the
 * checker can't disagree with what really happens.
 */
export function interpretIngestPayload(payload: unknown, deviceName?: string | null): InterpretedIngest {
  const discovered = discoverIngestPayload(payload, deviceName);
  const { tempProbes, typed } = parseIngestPayload(payload);
  const readings: InterpretedReading[] = [];

  // Classic Arduino temp JSON
  const classic =
    Object.keys(tempProbes).length > 0
      ? tempProbes
      : (() => {
          try {
            return parseTempFeedPayload(payload);
          } catch {
            return {};
          }
        })();

  // Only store values the payload actually reported: a probe without
  // humidity gets no humidity row (never a fake 0%), and vice versa.
  for (const [key, reading] of Object.entries(classic)) {
    if (reading.f != null) readings.push({
      key,
      label: labelForPushSensorKey(discovered, key, "temperature") ?? `Probe ${key}`,
      kind: "temperature",
      unit: "F",
      value_num: reading.f,
      value_bool: null,
      value_text: null,
      meta: { tempc: reading.c, tempf: reading.f },
    });
    if (reading.h != null) readings.push({
      key,
      label: labelForPushSensorKey(discovered, key, "humidity") ?? `Probe ${key} humidity`,
      kind: "humidity",
      unit: "%",
      value_num: reading.h,
      value_bool: null,
      value_text: null,
      meta: { humidity: reading.h },
    });
  }

  for (const item of typed) {
    const kind = inferSensorKind(item.key, item);
    const converted =
      kind === "temperature" && item.value != null ? temperatureToFahrenheit(item.value, item.unit) : null;
    readings.push({
      key: item.key,
      label: item.label ?? labelForPushSensorKey(discovered, item.key, kind) ?? item.key,
      kind,
      unit: converted ? "F" : (item.unit ?? null),
      value_num: converted ? converted.f : (item.value ?? null),
      value_bool: item.bool ?? null,
      value_text: item.text ?? null,
      meta: converted ? { sent_value: item.value, sent_unit: item.unit } : {},
    });
  }

  const fields = payload && typeof payload === "object" ? (payload as Record<string, unknown>) : {};
  const firmware = typeof fields.fw === "string" ? fields.fw.trim().slice(0, 24) : "";
  return {
    discovered,
    readings,
    batteryPct: numericField(fields.battery ?? fields.battery_pct),
    rssi: numericField(fields.rssi),
    firmwareVersion: /^\d+\.\d+\.\d+$/.test(firmware) ? firmware : null,
  };
}
