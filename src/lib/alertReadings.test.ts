import { describe, expect, it } from "vitest";
import {
  buildAlertReadingsFromLatestSensors,
  buildFloodReadingsFromLatestSensors,
  mergeAlertReadings,
} from "./alertReadings";
import type { DeviceSensor } from "./devices";
import { DEFAULT_ALERT_SETTINGS, evaluateAlertDetails, isStaleAlertReading } from "./alerts";

function sensor(
  partial: Partial<DeviceSensor> & Pick<DeviceSensor, "id" | "device_id" | "key" | "kind">,
): DeviceSensor {
  return {
    label: partial.label ?? partial.key,
    unit: partial.unit ?? null,
    visible: partial.visible ?? true,
    sort_order: partial.sort_order ?? 0,
    offset_num: partial.offset_num ?? 0,
    ...partial,
  };
}

describe("buildAlertReadingsFromLatestSensors", () => {
  it("pairs temperature and humidity by device key", () => {
    const readings = buildAlertReadingsFromLatestSensors([
      {
        sensor: sensor({
          id: "t1",
          device_id: "d1",
          key: "0",
          kind: "temperature",
          label: "Probe 0",
        }),
        deviceName: "Garage ESP",
        value_num: 31,
      },
      {
        sensor: sensor({
          id: "h1",
          device_id: "d1",
          key: "0",
          kind: "humidity",
          label: "Probe 0 humidity",
        }),
        deviceName: "Garage ESP",
        value_num: 80,
      },
      {
        sensor: sensor({
          id: "door",
          device_id: "d1",
          key: "door1",
          kind: "door",
          label: "Door",
        }),
        deviceName: "Garage ESP",
        value_num: null,
      },
    ]);

    expect(readings).toEqual([
      { label: "Probe 0", tempf: 31, humidity: 80, space: null, sensorId: "t1", recordedAt: null },
    ]);
  });

  it("includes temperature-only probes with no humidity (null, not 0%)", () => {
    const readings = buildAlertReadingsFromLatestSensors([
      {
        sensor: sensor({
          id: "t2",
          device_id: "d2",
          key: "temp1",
          kind: "temperature",
          label: "Bay",
        }),
        deviceName: "Push",
        value_num: 40,
      },
    ]);

    expect(readings).toEqual([
      { label: "Bay", tempf: 40, humidity: null, space: null, sensorId: "t2", recordedAt: null },
    ]);
  });
});

describe("buildFloodReadingsFromLatestSensors", () => {
  it("returns only wet flood sensors", () => {
    const readings = buildFloodReadingsFromLatestSensors([
      {
        sensor: sensor({
          id: "f1",
          device_id: "d1",
          key: "leak",
          kind: "flood",
          label: "Sump pit",
        }),
        deviceSpace: "garage",
        value_bool: true,
      },
      {
        sensor: sensor({
          id: "f2",
          device_id: "d1",
          key: "leak2",
          kind: "flood",
          label: "Water heater",
        }),
        value_bool: false,
      },
      {
        sensor: sensor({
          id: "door",
          device_id: "d1",
          key: "door1",
          kind: "door",
          label: "Bay door",
        }),
        value_bool: true,
      },
    ]);

    expect(readings).toEqual([{ label: "Sump pit", space: "garage" }]);
  });
});

describe("mergeAlertReadings", () => {
  it("prefers live feed readings over stored sensor readings", () => {
    const merged = mergeAlertReadings(
      [{ label: "Probe 0", tempf: 33, humidity: 40 }],
      [
        { label: "Probe 0", tempf: 31, humidity: 80 },
        { label: "Probe 1", tempf: 42, humidity: 50 },
      ],
    );

    expect(merged).toEqual(
      expect.arrayContaining([
        { label: "Probe 0", tempf: 33, humidity: 40 },
        { label: "Probe 1", tempf: 42, humidity: 50 },
      ]),
    );
    expect(merged).toHaveLength(2);
  });
});

describe("DHT22 and same-named probes", () => {
  it("pairs a push device's temp1 with humidity1 so humidity alerts can fire", () => {
    const readings = buildAlertReadingsFromLatestSensors([
      { sensor: sensor({ id: "t", device_id: "dht", key: "temp1", kind: "temperature", label: "Temp1" }), deviceName: "Workshop probe 2", value_num: 39.9 },
      { sensor: sensor({ id: "h", device_id: "dht", key: "humidity1", kind: "humidity", label: "Humidity1" }), deviceName: "Workshop probe 2", value_num: 82 },
    ]);
    expect(readings).toEqual([{ label: "Temp1", tempf: 39.9, humidity: 82, space: null, sensorId: "t", recordedAt: null }]);
  });

  it("pairs suffixed keys (garage_temp + garage_rh) so humidity alerts can fire", () => {
    const readings = buildAlertReadingsFromLatestSensors([
      { sensor: sensor({ id: "t", device_id: "esp", key: "garage_temp", kind: "temperature", label: "Garage" }), deviceName: "Garage ESP", value_num: 48.2 },
      { sensor: sensor({ id: "h", device_id: "esp", key: "garage_rh", kind: "humidity", label: "Garage humidity" }), deviceName: "Garage ESP", value_num: 61 },
    ]);
    expect(readings).toEqual([{ label: "Garage", tempf: 48.2, humidity: 61, space: null, sensorId: "t", recordedAt: null }]);
  });

  it("keeps both devices' 'Temp1' probes when merging feed and stored readings", () => {
    const stored = [
      { label: "Temp1", tempf: 70, humidity: 0, sensorId: "ds18b20" },
      { label: "Temp1", tempf: 30, humidity: 40, sensorId: "dht22" },
    ];
    const merged = mergeAlertReadings([], stored);
    expect(merged.map((r) => r.sensorId).sort()).toEqual(["dht22", "ds18b20"]);
  });

  it("still lets a live feed reading replace the stored reading for the same sensor", () => {
    const merged = mergeAlertReadings(
      [{ label: "Probe 0", tempf: 31, humidity: 50, sensorId: "s0" }],
      [{ label: "Probe 0", tempf: 35, humidity: 50, sensorId: "s0" }],
    );
    expect(merged).toEqual([{ label: "Probe 0", tempf: 31, humidity: 50, sensorId: "s0" }]);
  });
});

describe("buildPowerOffReadingsFromLatestSensors", () => {
  it("returns power sensors that read off, with their space", async () => {
    const { buildPowerOffReadingsFromLatestSensors } = await import("./alertReadings");
    const sensor = (id: string, kind: "power" | "flood") => ({
      id, device_id: "d", key: id, label: id, kind, unit: null, visible: true, sort_order: 0, offset_num: 0,
    });
    expect(
      buildPowerOffReadingsFromLatestSensors([
        { sensor: sensor("mains", "power"), deviceSpace: "Garage", value_bool: false },
        { sensor: sensor("ups", "power"), deviceSpace: null, value_bool: true },
        { sensor: sensor("sump", "flood"), deviceSpace: null, value_bool: false },
      ]),
    ).toEqual([{ label: "mains", space: "Garage" }]);
  });
});

describe("stale readings don't drive freeze alerts or recovery", () => {
  const hoursAgo = (h: number) => new Date(Date.now() - h * 3600_000).toISOString();
  const settings = { ...DEFAULT_ALERT_SETTINGS, enabled: true, freezeThresholdF: 34, freezeDwellMinutes: 0, outageHours: 2 };

  it("carries each reading's time", () => {
    const at = hoursAgo(3);
    const [reading] = buildAlertReadingsFromLatestSensors([
      { sensor: sensor({ id: "t", device_id: "d", key: "temp1", kind: "temperature", label: "Pipe" }), deviceName: "Pi", value_num: 20, recorded_at: at },
    ]);
    expect(reading?.recordedAt).toBe(at);
  });

  it("ignores a cold reading older than the outage window", () => {
    const stale = { label: "Pipe", tempf: 20, humidity: null, recordedAt: hoursAgo(3) };
    const fresh = { label: "Pipe", tempf: 20, humidity: null, recordedAt: hoursAgo(1) };
    expect(evaluateAlertDetails(settings, [stale])).toEqual([]);
    expect(evaluateAlertDetails(settings, [fresh]).map((d) => d.kind)).toEqual(["freeze"]);
  });

  it("keeps the old behavior when outage alerts are off (nothing else would cover a dead probe)", () => {
    const stale = { label: "Pipe", tempf: 20, humidity: null, recordedAt: hoursAgo(30) };
    expect(evaluateAlertDetails({ ...settings, outageHours: 0 }, [stale]).map((d) => d.kind)).toEqual(["freeze"]);
  });

  it("treats live pull readings (no time) as current", () => {
    expect(isStaleAlertReading(settings, { label: "Pipe", tempf: 20, humidity: null })).toBe(false);
  });
});
