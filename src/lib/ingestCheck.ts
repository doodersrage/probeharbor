import { interpretIngestPayload, type InterpretedReading } from "./ingestInterpret";
import {
  MAX_BATCH_READINGS,
  splitIngestBody,
  type RejectedEntry,
} from "./ingestTime";

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
const DEVICE_KEYS = new Set(["battery", "battery_pct", "rssi", "fw", "meta", "name", "device", "labels", "recorded_at", "tls"]);


const NO_VALUES =
  'No sensor values found; the endpoint would answer 400. Send numbers or true/false, e.g. {"temp1": 42.5, "door1": false}.';

function timeProblem(entry: RejectedEntry, batch: boolean): string {
  const where = batch ? `readings[${entry.index}]` : "This payload";
  switch (entry.reason) {
    case "invalid_entry":
      return `${where} isn't a JSON object, so it's skipped.`;
    case "recorded_at_too_old":
      return `${where}: recorded_at is more than 72 hours old, so it's ${batch ? "skipped" : "rejected (400)"}.`;
    case "recorded_at_in_future":
      return `${where}: recorded_at is more than 5 minutes ahead of the server, so it's ${batch ? "skipped" : "rejected (400)"}. Milliseconds instead of seconds? Send Unix seconds.`;
    default:
      return `${where}: recorded_at ${batch ? "is missing or unreadable, so it's skipped" : "is unreadable (400)"}. Send ISO 8601 with a time zone (2026-11-13T11:58:00Z) or Unix seconds.`;
  }
}

/**
 * Dry-run a push payload: what the ingest endpoint would store, plus
 * plain-language warnings for the mistakes that make a first reading go
 * missing or come out wrong. Writes nothing. Splits the body the way the
 * endpoint does (`splitIngestBody`), so `recorded_at` and `readings` batches
 * get the same answer here as there.
 */
export function checkIngestPayload(payload: unknown, nowMs = Date.now()): IngestCheckResult {
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

  const split = splitIngestBody(payload, nowMs);
  if (!split.ok) {
    const problems = split.rejectedEntries?.map((entry) => timeProblem(entry, false)) ?? [
      split.error.startsWith("Too many")
        ? `Too many items in readings: send at most ${MAX_BATCH_READINGS} per request.`
        : "readings is empty: send at least one item, or leave readings out.",
    ];
    return { accepted: false, readings: [], device: empty, warnings: problems, ignoredKeys: [] };
  }
  if (!split.batch) return checkOne(payload as Record<string, unknown>);

  // Batch: each item is a payload of its own; device fields at the top level.
  const results = split.entries.map((entry) => checkOne(entry.payload as Record<string, unknown>));
  const top = interpretIngestPayload(payload);
  const newest = split.entries.reduce<number>(
    (best, entry, i) => (best < 0 || entry.recordedAt > split.entries[best]!.recordedAt ? i : best),
    -1,
  );
  const fallback = newest >= 0 ? results[newest]!.device : empty;
  const readings = results.flatMap((result) => result.readings);
  const warnings = [
    ...split.rejectedEntries.map((entry) => timeProblem(entry, true)),
    // The same mistake in every item reads once.
    ...new Set(results.flatMap((result) => result.warnings).filter((text) => text !== NO_VALUES)),
  ];
  if (readings.length === 0) warnings.unshift(NO_VALUES);
  const topIgnored = Object.keys(payload as Record<string, unknown>).filter(
    (key) => key !== "readings" && !DEVICE_KEYS.has(key),
  );
  return {
    accepted: readings.length > 0,
    readings,
    device: {
      batteryPct: top.batteryPct ?? fallback.batteryPct,
      rssi: top.rssi ?? fallback.rssi,
      firmwareVersion: top.firmwareVersion ?? fallback.firmwareVersion,
    },
    warnings,
    ignoredKeys: [...new Set([...topIgnored, ...results.flatMap((result) => result.ignoredKeys)])],
  };
}

/** One payload object: what the endpoint would store from it. */
function checkOne(body: Record<string, unknown>): IngestCheckResult {
  const interpreted = interpretIngestPayload(body);
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
  if (!accepted) warnings.unshift(NO_VALUES);

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
