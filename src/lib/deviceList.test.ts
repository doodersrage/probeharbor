import { describe, expect, it } from "vitest";
import { buildDeviceListRows, countDevicesWithoutSpace, deviceHref, spaceSuggestions } from "./deviceList";
import type { DeviceSensor, DeviceWithSensors } from "./devices";
import type { SensorKind } from "./sensorKinds";
import type { LatestSensorRow } from "./sensorReadings";

const now = Date.parse("2026-10-14T12:00:00Z");
const ago = (m: number) => new Date(now - m * 60_000).toISOString();

function sensor(id: string, kind: SensorKind, label: string, visible = true): DeviceSensor {
  return { id, device_id: "", key: id, label, kind, unit: kind === "temperature" ? "°F" : null, visible, sort_order: 0, offset_num: 0 };
}

function device(id: string, over: Partial<DeviceWithSensors> = {}): DeviceWithSensors {
  return {
    id,
    household_id: "hh",
    name: id,
    source: "push",
    pull_url: null,
    ingest_key_prefix: null,
    enabled: true,
    last_seen_at: ago(2),
    sort_order: 0,
    space: null,
    sensors: [],
    ...over,
  };
}

function reading(s: DeviceSensor, value: number | boolean): LatestSensorRow {
  return {
    sensor: s,
    deviceName: "",
    value_num: typeof value === "number" ? value : null,
    value_bool: typeof value === "boolean" ? value : null,
    value_text: null,
    recorded_at: ago(2),
  };
}

describe("buildDeviceListRows", () => {
  it("puts trouble first and shows a recognizable reading", () => {
    const pipe = sensor("t", "temperature", "Pipe");
    const door = sensor("d", "door", "Door");
    const rows = buildDeviceListRows({
      devices: [
        device("healthy", { sensors: [door, pipe] }),
        device("silent", { last_seen_at: ago(60 * 24 * 3) }),
      ],
      latest: [reading(pipe, 41.24), reading(door, true)],
      now,
    });
    expect(rows.map((r) => r.id)).toEqual(["silent", "healthy"]);
    expect(rows[1]?.headline).toBe("Pipe 41.2 °F");
    expect(rows[1]?.href).toBe("/dashboard/devices/healthy");
  });

  it("falls back to a non-temperature reading and flags failing pull feeds", () => {
    const leak = sensor("l", "flood", "Sump");
    const [row] = buildDeviceListRows({
      devices: [device("feed", { source: "pull_url", sensors: [leak] })],
      latest: [reading(leak, false)],
      feedStatuses: [{ feedId: "feed", feedName: "feed", url: "", ok: false, message: "HTTP 500", probeCount: 0, checkedAt: ago(1) }],
      now,
    });
    expect(row?.headline).toBe("Sump Dry");
    expect(row?.feedIssue).toBe("HTTP 500");
  });
});

describe("space helpers", () => {
  it("counts enabled devices with no space", () => {
    expect(countDevicesWithoutSpace([device("a"), device("b", { space: "Garage" }), device("c", { enabled: false })])).toBe(1);
  });

  it("suggests spaces already in use first, without duplicates", () => {
    expect(spaceSuggestions([device("a", { space: "Pump house" }), device("b", { space: "garage" })]).slice(0, 4)).toEqual([
      "Pump house",
      "garage",
      "Attic",
      "Crawlspace",
    ]);
  });

  it("encodes ids in links", () => {
    expect(deviceHref("a b")).toBe("/dashboard/devices/a%20b");
  });
});
