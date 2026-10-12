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

  for (const [key, reading] of Object.entries(classic)) {
    readings.push({
      key,
      label: labelForPushSensorKey(discovered, key, "temperature") ?? `Probe ${key}`,
      kind: "temperature",
      unit: "F",
      value_num: reading.f,
      value_bool: null,
      value_text: null,
      meta: { tempc: reading.c, tempf: reading.f },
    });
    readings.push({
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
    readings.push({
      key: item.key,
      label: item.label ?? labelForPushSensorKey(discovered, item.key, kind) ?? item.key,
      kind,
      unit: item.unit ?? null,
      value_num: item.value ?? null,
      value_bool: item.bool ?? null,
      value_text: item.text ?? null,
      meta: {},
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
