import { describe, expect, it } from "vitest";
import { interpretIngestPayload, temperatureToFahrenheit } from "./ingestInterpret";

// Temperatures are stored and alerted on in °F. A °C value in sensors[] used to
// be stored as-is, so 20°C read as 20°F (a freeze).

const temp = (payload: unknown) =>
  interpretIngestPayload(payload).readings.filter((r) => r.kind === "temperature");

describe("temperatureToFahrenheit", () => {
  it.each([
    ["C", 20, 68],
    ["°C", 0, 32],
    ["Cel", -40, -40],
    ["celsius", 4, 39.2],
    ["degC", 100, 212],
    [" °c ", 20, 68],
    ["K", 273.15, 32],
    ["kelvin", 293.15, 68],
  ])("converts %s %s to %s°F", (unit, value, f) => {
    expect(temperatureToFahrenheit(value, unit)?.f).toBe(f);
  });

  it.each(["F", "°F", "degF", "", null, undefined, "%"])("leaves %s alone", (unit) => {
    expect(temperatureToFahrenheit(20, unit)).toBeNull();
  });
});

describe("sensors[] temperatures are stored in °F", () => {
  it("converts °C and records what the device sent", () => {
    expect(temp({ sensors: [{ key: "garage", kind: "temperature", value: 20, unit: "°C" }] })).toEqual([
      expect.objectContaining({ value_num: 68, unit: "F", meta: { sent_value: 20, sent_unit: "°C" } }),
    ]);
  });

  it("keeps °F and unit-less values unchanged", () => {
    const rows = temp({
      sensors: [
        { key: "a_temp", kind: "temperature", value: 65.3, unit: "F" },
        { key: "b_temp", kind: "temperature", value: 41 },
      ],
    });
    expect(rows.map((r) => [r.value_num, r.unit, r.meta])).toEqual([
      [65.3, "F", {}],
      [41, null, {}],
    ]);
  });

  it("doesn't touch a non-temperature sensor that happens to use C", () => {
    const rows = interpretIngestPayload({ sensors: [{ key: "charge", kind: "generic", value: 3, unit: "C" }] }).readings;
    expect(rows[0]).toMatchObject({ value_num: 3, unit: "C" });
  });

  it("leaves firmware flat keys (already °F) unchanged", () => {
    expect(temp({ temp1: 41, fw: "1.2.2" })).toEqual([expect.objectContaining({ value_num: 41, meta: {} })]);
  });
});
