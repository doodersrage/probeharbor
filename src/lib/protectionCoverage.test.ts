import { describe, expect, it } from "vitest";
import { buildProtectionCoverage, isWetSpace, UNASSIGNED_SPACE } from "./protectionCoverage";
import type { DeviceSensor, DeviceWithSensors } from "./devices";
import type { SensorKind } from "./sensorKinds";
import type { LatestSensorRow } from "./sensorReadings";

const now = Date.parse("2026-10-13T12:00:00Z");
const minutesAgo = (m: number) => new Date(now - m * 60 * 1000).toISOString();

function sensor(id: string, deviceId: string, kind: SensorKind): DeviceSensor {
  return { id, device_id: deviceId, key: id, label: id, kind, unit: null, visible: true, sort_order: 0, offset_num: 0 };
}

function device(id: string, space: string | null, kinds: SensorKind[], enabled = true): DeviceWithSensors {
  return {
    id,
    household_id: "hh",
    name: id,
    source: "push",
    pull_url: null,
    ingest_key_prefix: null,
    enabled,
    last_seen_at: null,
    sort_order: 0,
    space,
    sensors: kinds.map((kind, i) => sensor(`${id}-${kind}-${i}`, id, kind)),
  };
}

function reading(s: DeviceSensor, at: string): LatestSensorRow {
  return { sensor: s, deviceName: s.device_id, value_num: 40, value_bool: null, value_text: null, recorded_at: at };
}

describe("buildProtectionCoverage", () => {
  it("marks live, stale, and missing coverage per space", () => {
    const garage = device("g", "Garage", ["temperature", "door"]);
    const latest = [reading(garage.sensors[0]!, minutesAgo(5)), reading(garage.sensors[1]!, minutesAgo(60 * 24))];
    const [row] = buildProtectionCoverage([garage], latest, now);
    expect(row?.risks).toEqual({ freeze: "live", leak: "none", door: "stale", power: "none" });
    expect(row?.gaps).toEqual(["Door sensor hasn't reported recently."]);
  });

  it("asks for a leak sensor only in spaces with plumbing", () => {
    const crawl = device("c", "Crawlspace", ["temperature"]);
    const attic = device("a", "Attic", ["temperature"]);
    const latest = [reading(crawl.sensors[0]!, minutesAgo(1)), reading(attic.sensors[0]!, minutesAgo(1))];
    const rows = buildProtectionCoverage([crawl, attic], latest, now);
    expect(rows.find((r) => r.space === "Crawlspace")?.gaps).toEqual([
      "No leak sensor here, and this kind of space usually has plumbing.",
    ]);
    expect(rows.find((r) => r.space === "Attic")?.gaps).toEqual([]);
  });

  it("treats a sensor with no readings as stale and a space with no probe as uncovered", () => {
    const rows = buildProtectionCoverage(
      [device("w", "Workshop", ["temperature"]), device("l", "Laundry", ["flood"])],
      [],
      now,
    );
    expect(rows.find((r) => r.space === "Workshop")?.risks.freeze).toBe("stale");
    expect(rows.find((r) => r.space === "Laundry")?.gaps[0]).toContain("No temperature probe");
  });

  it("groups devices without a space last and skips disabled devices", () => {
    const rows = buildProtectionCoverage(
      [device("x", null, ["temperature"]), device("y", "Attic", ["temperature"]), device("z", "Shed", ["temperature"], false)],
      [],
      now,
    );
    expect(rows.map((r) => r.space)).toEqual(["Attic", UNASSIGNED_SPACE]);
    expect(rows[1]?.gaps[0]).toContain("Set a space");
  });

  it("recognizes common wet spaces", () => {
    expect(isWetSpace("Basement")).toBe(true);
    expect(isWetSpace("water heater closet")).toBe(true);
    expect(isWetSpace("Garage")).toBe(false);
  });
});
