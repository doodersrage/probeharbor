import { describe, expect, it } from "vitest";
import { buildReadingsFromResults } from "./alertReadings";
import { interpretIngestPayload } from "./ingestInterpret";
import { implausibleReason } from "./readingPlausibility";
import { buildReadingRowsFromTempResults } from "./sensorReadings";
import type { TempFeedResult, TempProbeConfig } from "./tempFeedConfig";

describe("implausibleReason", () => {
  it.each([
    ["temperature", 185, "sensor_fault"],
    ["temperature", -196.6, "sensor_fault"],
    ["temperature", -100.1, "out_of_range"],
    ["temperature", 250.1, "out_of_range"],
    ["humidity", -0.1, "out_of_range"],
    ["humidity", 100.1, "out_of_range"],
  ] as const)("rejects %s %s (%s)", (kind, value, reason) => {
    expect(implausibleReason(kind, value)).toBe(reason);
  });

  it.each([
    ["temperature", -100],
    ["temperature", 250],
    ["temperature", 184.9],
    ["temperature", 32],
    ["humidity", 0],
    ["humidity", 100],
    ["pressure", 5000],
    ["temperature", null],
  ] as const)("accepts %s %s", (kind, value) => {
    expect(implausibleReason(kind, value)).toBeNull();
  });
});

describe("ingest rejects implausible values instead of storing them", () => {
  it("drops a disconnected DS18B20 and keeps the rest", () => {
    const result = interpretIngestPayload({ temp1: -196.6, temp2: 41, humidity1: 55 });
    expect(result.readings.map((r) => `${r.key}=${r.value_num}`)).toEqual(["temp2=41", "humidity1=55"]);
    expect(result.rejected).toEqual([{ key: "temp1", kind: "temperature", value: -196.6, reason: "sensor_fault" }]);
  });

  it("checks °C after conversion (85°C power-on reset = 185°F)", () => {
    const result = interpretIngestPayload({ sensors: [{ key: "t", kind: "temperature", value: 85, unit: "C" }] });
    expect(result.readings).toEqual([]);
    expect(result.rejected[0]).toMatchObject({ value: 185, reason: "sensor_fault" });
  });

  it("rejects humidity outside 0-100", () => {
    expect(interpretIngestPayload({ humidity1: 140 }).rejected[0]).toMatchObject({ reason: "out_of_range" });
  });
});

describe("pull feeds skip implausible values", () => {
  const probe: TempProbeConfig = { id: "p", feedId: "f", key: "a", label: "Garage", visible: true };
  const result = (f: number, h: number): TempFeedResult => ({
    id: "f",
    name: "Feed",
    url: "https://example.com",
    probes: { a: { c: null, f, h } },
  });
  const device = {
    id: "f",
    sensors: [
      { id: "t", key: "a", kind: "temperature" },
      { id: "h", key: "a", kind: "humidity" },
    ],
  } as never;

  it("stores neither a fault temperature nor impossible humidity", () => {
    expect(buildReadingRowsFromTempResults("house", [device], [result(-196.6, 140)], [probe])).toEqual([]);
  });

  it("never alerts on a fault temperature", () => {
    expect(buildReadingsFromResults([result(-196.6, 50)], [probe])).toEqual([]);
  });
});
