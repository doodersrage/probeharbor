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

  it("warns about fault values (in °F or the °C the device sent) and untyped keys", () => {
    const result = checkIngestPayload({
      sensors: [
        { key: "t1", kind: "temperature", value: 4, unit: "°C" },
        { key: "t2", kind: "temperature", value: 185 },
        { key: "t3", kind: "temperature", value: 85, unit: "C" },
        { key: "xyz", value: 3 },
      ],
    });
    const text = result.warnings.join("\n");
    expect(text).not.toContain("would read as");
    // t2 (185°F) and t3 (85°C = 185°F) are both DS18B20 fault codes and are not stored.
    expect(text.match(/185°F, a DS18B20 error value/g)).toHaveLength(2);
    expect(text).toContain("won't be stored");
    expect(result.readings.map((r) => r.key)).toEqual(["t1", "xyz"]);
    expect(text).toContain('"xyz" didn\'t match a sensor type');
  });
});

describe("checkIngestPayload and recorded_at", () => {
  it("doesn't list recorded_at as an ignored key or read it as a sensor", () => {
    const result = checkIngestPayload({ temp1: 42.5, recorded_at: 1794575880 });

    expect(result.accepted).toBe(true);
    expect(result.ignoredKeys).not.toContain("recorded_at");
    expect(result.readings.map((r) => r.key)).toEqual(["temp1"]);
  });
});

describe("checkIngestPayload with batches and times", () => {
  const NOW = Date.parse("2026-11-13T12:00:00Z");
  const S = NOW / 1000;

  it("accepts a batch the endpoint accepts, counting every item's readings", () => {
    const result = checkIngestPayload(
      { fw: "1.3.0", rssi: -60, readings: [{ temp1: 40, recorded_at: S - 120 }, { temp1: 41, recorded_at: S - 60 }] },
      NOW,
    );
    expect(result.accepted).toBe(true);
    expect(result.readings).toHaveLength(2);
    expect(result.device).toEqual({ batteryPct: null, rssi: -60, firmwareVersion: "1.3.0" });
    expect(result.warnings).toEqual([]);
    expect(result.ignoredKeys).toEqual([]);
  });

  it("names the batch items the endpoint would skip, and why", () => {
    const result = checkIngestPayload(
      { readings: [{ temp1: 40 }, { temp1: 41, recorded_at: S - 4 * 86400 }, { temp1: 42, recorded_at: NOW }, 7, { temp1: 43, recorded_at: S }] },
      NOW,
    );
    expect(result.accepted).toBe(true);
    expect(result.readings).toHaveLength(1);
    expect(result.warnings).toHaveLength(4);
    expect(result.warnings[0]).toMatch(/^readings\[0\]: recorded_at is missing/);
    expect(result.warnings[1]).toMatch(/^readings\[1\].*72 hours/);
    expect(result.warnings[2]).toMatch(/^readings\[2\].*Milliseconds/);
    expect(result.warnings[3]).toMatch(/^readings\[3\] isn't a JSON object/);
  });

  it("says a batch with no usable item would be a 400", () => {
    const result = checkIngestPayload({ readings: [{ temp1: 40 }] }, NOW);
    expect(result.accepted).toBe(false);
    expect(result.warnings[0]).toMatch(/would answer 400/);
  });

  it("repeats a per-item warning once, not per item", () => {
    const result = checkIngestPayload(
      { readings: [{ widget: 1, recorded_at: S - 60 }, { widget: 2, recorded_at: S }] },
      NOW,
    );
    expect(result.warnings.filter((w) => w.includes('"widget"'))).toHaveLength(1);
  });

  it("fails a single payload with a bad recorded_at, as the endpoint does", () => {
    const result = checkIngestPayload({ temp1: 40, recorded_at: "2026-11-13T11:00:00" }, NOW);
    expect(result.accepted).toBe(false);
    expect(result.warnings).toEqual([expect.stringMatching(/unreadable \(400\).*time zone/)]);
  });

  it("rejects empty and oversized batches", () => {
    expect(checkIngestPayload({ readings: [] }, NOW).warnings[0]).toMatch(/readings is empty/);
    const many = Array.from({ length: 101 }, () => ({ temp1: 40, recorded_at: S }));
    expect(checkIngestPayload({ readings: many }, NOW).warnings[0]).toMatch(/at most 100/);
  });
});
