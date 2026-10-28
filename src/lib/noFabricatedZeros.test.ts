import { describe, expect, it } from "vitest";
import { buildReadingsFromResults } from "./alertReadings";
import { explainCondition, type RuleEvalContext } from "./alertRules";
import { DEFAULT_ALERT_SETTINGS, evaluateAlertDetails } from "./alerts";
import { interpretIngestPayload } from "./ingestInterpret";
import { buildReadingRowsFromTempResults } from "./sensorReadings";
import { parseTempFeedPayload, type TempFeedResult, type TempProbeConfig } from "./tempFeedConfig";

// A value the feed didn't report must stay missing all the way to storage and
// alerts. It must never become a real-looking 0°F or 0% reading.

const stored = (payload: unknown) =>
  interpretIngestPayload(payload, "Garage").readings.map((r) => `${r.key}/${r.kind}=${r.value_num}`);

describe("push ingest stores only reported values", () => {
  it("humidity-only SenML stores humidity and no temperature", () => {
    expect(stored([{ bn: "dev/", n: "rh", u: "%RH", v: 55 }])).toEqual(["0/humidity=55"]);
  });

  it("humidity-only Home Assistant state stores humidity and no temperature", () => {
    expect(stored({ state: "55", attributes: { unit_of_measurement: "%" } })).toEqual(["state/humidity=55"]);
  });

  it("temperature-only probe stores no humidity row", () => {
    expect(stored({ temp: { p1: { c: 5, f: 41 } } })).toEqual(["p1/temperature=41", "avg/temperature=41"]);
  });

  it("keeps a real 0°F and a real 0% from Home Assistant", () => {
    expect(stored({ state: "0", attributes: { unit_of_measurement: "°F" } })).toContain("state/temperature=0");
    expect(stored({ state: "0", attributes: { unit_of_measurement: "%" } })).toContain("state/humidity=0");
  });

  it("leaves ProbeHarbor firmware payloads unchanged", () => {
    expect(stored({ temp1: 41, fw: "1.2.2" })).toEqual(["temp1/temperature=41"]);
    expect(stored({ temp_air: 41, humidity_air: 55, pressure_air: 1013, fw: "1.2.2" })).toEqual([
      "temp_air/temperature=41",
      "humidity_air/humidity=55",
      "pressure_air/pressure=1013",
    ]);
  });
});

describe("pull feed parsing", () => {
  it("derives °F from a Celsius-only probe instead of using 0", () => {
    expect(parseTempFeedPayload({ temp: { a: { c: 5, h: 50 } } }).a).toEqual({ c: 5, f: 41, h: 50 });
  });

  it("marks unreported values null and averages only what was reported", () => {
    const probes = parseTempFeedPayload({ temp: { a: { f: 40 }, b: { h: 60 } } });
    expect(probes.a).toEqual({ c: 4.4, f: 40, h: null });
    expect(probes.b).toEqual({ c: null, f: null, h: 60 });
    expect(probes.avg).toEqual({ c: 4.4, f: 40, h: 60 });
  });

  it("drops a probe that reports nothing", () => {
    expect(parseTempFeedPayload({ temp: { a: { f: 40 }, empty: {} } }).empty).toBeUndefined();
  });
});

describe("pull results into storage and alerts", () => {
  const probe: TempProbeConfig = { id: "p", feedId: "feed-1", key: "a", label: "Garage", visible: true };
  const result = (reading: TempFeedResult["probes"][string]): TempFeedResult => ({
    id: "feed-1",
    name: "Feed",
    url: "https://example.com",
    probes: { a: reading },
  });
  const device = {
    id: "feed-1",
    sensors: [
      { id: "t", key: "a", kind: "temperature" },
      { id: "h", key: "a", kind: "humidity" },
    ],
  } as never;

  it("writes no row for a missing value", () => {
    const rows = buildReadingRowsFromTempResults("house", [device], [result({ c: null, f: null, h: 55 })], [probe]);
    expect(rows.map((r) => [r.sensor_id, r.value_num])).toEqual([["h", 55]]);
  });

  it("skips freeze evaluation when a probe has no temperature", () => {
    expect(buildReadingsFromResults([result({ c: null, f: null, h: 55 })], [probe])).toEqual([]);
  });

  it("never raises a humidity alert for a probe without humidity", () => {
    const readings = buildReadingsFromResults([result({ c: 20, f: 68, h: null })], [probe]);
    expect(readings).toEqual([expect.objectContaining({ tempf: 68, humidity: null })]);
    const details = evaluateAlertDetails({ ...DEFAULT_ALERT_SETTINGS, enabled: true, humidityThreshold: 0 }, readings);
    expect(details.filter((d) => d.kind === "humidity")).toEqual([]);
  });

  it("leaves probes without humidity out of humidity rules", () => {
    const ctx = {
      readings: [{ label: "Garage", tempf: 68, humidity: null }],
      humidityThreshold: 0,
    } as unknown as RuleEvalContext;
    expect(explainCondition({ type: "humidity_above", value: 0 } as never, ctx).matched).toBe(false);
  });
});
