import { describe, expect, it } from "vitest";
import { formatBatteryEta, scoreDeviceHealth } from "./deviceHealthScore";
import type { DeviceWithSensors } from "./devices";

function device(partial: Partial<DeviceWithSensors> & Pick<DeviceWithSensors, "id" | "name">): DeviceWithSensors {
  return {
    household_id: "h1",
    source: "push",
    pull_url: null,
    ingest_key_prefix: "abcd",
    enabled: true,
    last_seen_at: new Date().toISOString(),
    sort_order: 0,
    meta: {},
    space: null,
    sensors: [],
    ...partial,
  };
}

describe("deviceHealthScore", () => {
  it("scores a fresh device as healthy", () => {
    const health = scoreDeviceHealth(device({ id: "d1", name: "Probe" }));
    expect(health.label).toBe("healthy");
    expect(health.score).toBeGreaterThan(80);
  });

  it("watches a reporting device whose probe reading is stuck", () => {
    const sensor = { id: "s1", device_id: "d1", key: "temp1", label: "Crawlspace", kind: "temperature" as const, unit: null, visible: true, sort_order: 0, offset_num: 0 };
    const health = scoreDeviceHealth(device({ id: "d1", name: "Probe", sensors: [sensor] }), [], Date.now(), -80, [
      { sensorId: "s1", label: "Crawlspace", message: "", detail: "Crawlspace stuck at 41.0°F for 30 hours" },
    ]);
    expect(health.label).toBe("watch");
    expect(health.detail).toBe("Crawlspace stuck at 41.0°F for 30 hours");
  });

  it("flags disabled devices offline", () => {
    const health = scoreDeviceHealth(
      device({ id: "d1", name: "Probe", enabled: false }),
    );
    expect(health.label).toBe("offline");
  });

  it("watches a device silent for a few hours", () => {
    const now = Date.parse("2026-01-10T12:00:00.000Z");
    const health = scoreDeviceHealth(
      device({ id: "d1", name: "Probe", last_seen_at: new Date(now - 3 * 3_600_000).toISOString() }),
      [],
      now,
    );
    expect(health.label).toBe("watch");
  });

  it("calls a device silent for a day or more offline", () => {
    const now = Date.parse("2026-01-10T12:00:00.000Z");
    const health = scoreDeviceHealth(
      device({ id: "d1", name: "Probe", last_seen_at: new Date(now - 31 * 86_400_000).toISOString() }),
      [],
      now,
    );
    expect(health.label).toBe("offline");
    expect(health.detail).toBe("No data for 31 days, check power/Wi‑Fi");
  });

  it("formats battery ETA", () => {
    expect(formatBatteryEta(null)).toBe("—");
    expect(formatBatteryEta(1)).toBe("Replace soon");
    expect(formatBatteryEta(10)).toBe("~10 days");
  });
});
