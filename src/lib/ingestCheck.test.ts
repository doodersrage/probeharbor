import { describe, expect, it } from "vitest";
import { checkIngestPayload } from "./ingestCheck";

describe("checkIngestPayload", () => {
  it("reads flat keys the way the endpoint does", () => {
    const result = checkIngestPayload({ temp1: 42.5, door1: false, battery: 87, rssi: -62, fw: "1.2.0" });
    expect(result.accepted).toBe(true);
    expect(result.readings.map((r) => [r.key, r.kind])).toEqual([
      ["temp1", "temperature"],
      ["door1", "door"],
    ]);
    expect(result.device).toEqual({ batteryPct: 87, rssi: -62, firmwareVersion: "1.2.0" });
    expect(result.warnings).toEqual([]);
  });

  it("reads the classic temp shape as temperature plus humidity", () => {
    const result = checkIngestPayload({ temp: { probe1: { c: 5, f: 41, h: 60 } } });
    expect(result.readings.map((r) => [r.kind, r.value_num])).toEqual([
      ["temperature", 41],
      ["humidity", 60],
    ]);
  });

  it("explains a payload that would be rejected", () => {
    const result = checkIngestPayload({ temp1: "42.5" });
    expect(result.accepted).toBe(false);
    expect(result.warnings[0]).toContain("400");
    expect(result.warnings.join(" ")).toContain('"temp1" is the string "42.5"');
    expect(result.ignoredKeys).toEqual(["temp1"]);
  });

  it("rejects non-objects", () => {
    expect(checkIngestPayload([1, 2]).warnings[0]).toContain("not an array");
    expect(checkIngestPayload("hi").accepted).toBe(false);
  });

  it("warns about Celsius, fault values, and untyped keys", () => {
    const result = checkIngestPayload({
      sensors: [
        { key: "t1", kind: "temperature", value: 4, unit: "°C" },
        { key: "t2", kind: "temperature", value: 185 },
        { key: "xyz", value: 3 },
      ],
    });
    const text = result.warnings.join("\n");
    expect(text).toContain("°C");
    expect(text).toContain("DS18B20");
    expect(text).toContain('"xyz" didn\'t match a sensor type');
  });
});
