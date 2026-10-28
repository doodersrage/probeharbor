import { interpretIngestPayload, type InterpretedReading } from "./ingestInterpret";

export type IngestCheckResult = {
  /** What the real endpoint would answer: 200 with readings, or 400 "No sensor values found". */
  accepted: boolean;
  readings: InterpretedReading[];
  device: { batteryPct: number | null; rssi: number | null; firmwareVersion: string | null };
  /** Things that will be stored but are probably not what was meant. */
  warnings: string[];
  /** Top-level keys nothing read. */
  ignoredKeys: string[];
};

/** Keys the endpoint reads that aren't sensor values. */
const DEVICE_KEYS = new Set(["battery", "battery_pct", "rssi", "fw", "meta", "name", "device", "labels"]);


/**
 * Dry-run a push payload: what the ingest endpoint would store, plus
 * plain-language warnings for the mistakes that make a first reading go
 * missing or come out wrong. Writes nothing.
 */
export function checkIngestPayload(payload: unknown): IngestCheckResult {
  const empty = { batteryPct: null, rssi: null, firmwareVersion: null };
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return {
      accepted: false,
      readings: [],
      device: empty,
      warnings: [
        Array.isArray(payload)
          ? "Send one JSON object, not an array. Wrap several sensors as {\"sensors\": [...]}."
          : "Send a JSON object, like {\"temp1\": 42.5}.",
      ],
      ignoredKeys: [],
    };
  }

  const interpreted = interpretIngestPayload(payload);
  const body = payload as Record<string, unknown>;
  const warnings: string[] = [];

  const readKeys = new Set(interpreted.readings.map((reading) => reading.key));
  const structured = Boolean(body.temp) || Array.isArray(body.sensors);
  const ignoredKeys = structured
    ? []
    : Object.keys(body).filter((key) => !readKeys.has(key) && !DEVICE_KEYS.has(key));

  for (const key of ignoredKeys) {
    const value = body[key];
    if (typeof value === "string" && value.trim() !== "" && Number.isFinite(Number(value))) {
      warnings.push(`"${key}" is the string "${value}". Send it as a number (${Number(value)}) or it's skipped.`);
    }
  }

  for (const rejected of interpreted.rejected) {
    const label = interpreted.discovered.find((d) => d.key === rejected.key)?.label ?? rejected.key;
    warnings.push(
      rejected.reason === "sensor_fault"
        ? `${label} is ${rejected.value}°F, a DS18B20 error value (reset or disconnected), not a real temperature. It won't be stored. Check the probe wiring and power.`
        : rejected.kind === "humidity"
          ? `${label} is ${rejected.value}%, outside 0–100. It won't be stored. Check the sensor or the field.`
          : `${label} is ${rejected.value}°F, outside -100 to 250°F. It won't be stored. Check the sensor or its unit.`,
    );
  }

  for (const reading of interpreted.readings) {
    if (reading.kind === "generic") {
      warnings.push(
        `"${reading.key}" didn't match a sensor type, so it's stored as a generic value with no alerts. Put the type in the name (temp, humidity, door, leak, …) or use {"sensors": [{"key": "${reading.key}", "kind": "temperature", "value": …}]}.`,
      );
    }
  }

  const battery = interpreted.batteryPct;
  if (battery != null && (battery < 0 || battery > 100)) {
    warnings.push(`battery is ${battery}. Send a percentage from 0 to 100.`);
  }
  if (typeof body.fw === "string" && !interpreted.firmwareVersion) {
    warnings.push(`fw "${body.fw}" isn't a version like 1.2.0, so it's ignored.`);
  }

  const accepted = interpreted.readings.length > 0;
  if (!accepted) {
    warnings.unshift(
      'No sensor values found; the endpoint would answer 400. Send numbers or true/false, e.g. {"temp1": 42.5, "door1": false}.',
    );
  }

  return {
    accepted,
    readings: interpreted.readings,
    device: {
      batteryPct: interpreted.batteryPct,
      rssi: interpreted.rssi,
      firmwareVersion: interpreted.firmwareVersion,
    },
    warnings,
    ignoredKeys,
  };
}
