import { beforeEach, describe, expect, it, vi } from "vitest";
import type { DeviceSensor, DeviceWithSensors } from "./devices";
import type { TempFeedResult, TempProbeConfig } from "./tempFeedConfig";

const mockInsert = vi.fn();
vi.mock("./db/ingest", () => ({
  insertSensorReadings: (...args: unknown[]) => mockInsert(...args),
}));

const readings = vi.hoisted(() => ({
  getDwellAnchor: vi.fn(),
  getRecentNumericReadingSamples: vi.fn(),
  fetchLatestSensorValuesResult: vi.fn(),
}));
vi.mock("./db/readings", () => readings);

function sensor(overrides: Partial<DeviceSensor> = {}): DeviceSensor {
  return {
    id: "sensor-1",
    device_id: "device-1",
    key: "avg",
    label: "Garage",
    kind: "temperature",
    unit: "F",
    visible: true,
    sort_order: 0,
    offset_num: 0,
    ...overrides,
  };
}

function device(overrides: Partial<DeviceWithSensors> = {}): DeviceWithSensors {
  return {
    id: "device-1",
    household_id: "house-1",
    name: "Garage Feed",
    source: "pull",
    pull_url: null,
    ingest_key_prefix: null,
    enabled: true,
    last_seen_at: null,
    sort_order: 0,
    meta: {},
    space: null,
    sensors: [sensor()],
    ...overrides,
  } as unknown as DeviceWithSensors;
}

beforeEach(() => {
  mockInsert.mockReset();
  for (const fn of Object.values(readings)) fn.mockReset();
});

describe("insertSensorReadings", () => {
  it("returns no error for an empty list without hitting the database", async () => {
    const { insertSensorReadings } = await import("./sensorReadings");

    const result = await insertSensorReadings([]);

    expect(result).toEqual({ error: null });
    expect(mockInsert).not.toHaveBeenCalled();
  });

  it("stores the rows and passes the database result through", async () => {
    mockInsert.mockResolvedValue({ error: null });
    const { insertSensorReadings } = await import("./sensorReadings");
    const rows = [{ sensor_id: "s1", household_id: "h1", value_num: 40 }];

    const result = await insertSensorReadings(rows);

    expect(result).toEqual({ error: null });
    expect(mockInsert).toHaveBeenCalledWith(rows);
  });

  it("returns the error message on failure", async () => {
    mockInsert.mockResolvedValue({ error: "boom" });
    const { insertSensorReadings } = await import("./sensorReadings");

    const result = await insertSensorReadings([{ sensor_id: "s1", household_id: "h1" }]);

    expect(result).toEqual({ error: "boom" });
  });
});

describe("buildReadingRowsFromTempResults", () => {
  const probe: TempProbeConfig = {
    id: "probe-1",
    feedId: "device-1",
    key: "avg",
    label: "Garage",
    visible: true,
  };

  const result: TempFeedResult = {
    id: "device-1",
    name: "Garage Feed",
    url: "https://example.com",
    probes: { avg: { c: 4.4, f: 40, h: 55 } },
  };

  it("builds temp and humidity rows for visible probes with matching sensors", async () => {
    const dev = device({
      sensors: [
        sensor({ id: "temp-sensor", kind: "temperature" }),
        sensor({ id: "humidity-sensor", kind: "humidity" }),
      ],
    });
    const { buildReadingRowsFromTempResults } = await import("./sensorReadings");

    const rows = buildReadingRowsFromTempResults("house-1", [dev], [result], [probe]);

    expect(rows).toHaveLength(2);
    expect(rows[0]).toMatchObject({
      sensor_id: "temp-sensor",
      household_id: "house-1",
      value_num: 40,
      meta: { tempc: 4.4, tempf: 40 },
    });
    expect(rows[1]).toMatchObject({
      sensor_id: "humidity-sensor",
      household_id: "house-1",
      value_num: 55,
      meta: { humidity: 55 },
    });
  });

  it("skips a probe marked not visible", async () => {
    const dev = device();
    const { buildReadingRowsFromTempResults } = await import("./sensorReadings");

    const rows = buildReadingRowsFromTempResults(
      "house-1",
      [dev],
      [result],
      [{ ...probe, visible: false }],
    );

    expect(rows).toEqual([]);
  });

  it("skips when the device or its feed result is missing", async () => {
    const { buildReadingRowsFromTempResults } = await import("./sensorReadings");

    expect(buildReadingRowsFromTempResults("house-1", [], [result], [probe])).toEqual([]);
    expect(buildReadingRowsFromTempResults("house-1", [device()], [], [probe])).toEqual([]);
  });

  it("skips a feed result that carries an error", async () => {
    const dev = device();
    const { buildReadingRowsFromTempResults } = await import("./sensorReadings");

    const rows = buildReadingRowsFromTempResults(
      "house-1",
      [dev],
      [{ ...result, error: "offline" }],
      [probe],
    );

    expect(rows).toEqual([]);
  });

  it("skips a probe whose key has no reading in the feed result", async () => {
    const dev = device();
    const { buildReadingRowsFromTempResults } = await import("./sensorReadings");

    const rows = buildReadingRowsFromTempResults(
      "house-1",
      [dev],
      [{ ...result, probes: {} }],
      [probe],
    );

    expect(rows).toEqual([]);
  });
});

describe("getFreezeDwellSamples", () => {
  it("prepends the latest pre-cutoff reading to the window samples", async () => {
    readings.getDwellAnchor.mockResolvedValue([{ at: "2024-01-01T11:20:00Z", tempF: 31 }]);
    readings.getRecentNumericReadingSamples.mockResolvedValue([{ at: "2024-01-01T11:40:00Z", tempF: 30 }]);
    const { getFreezeDwellSamples } = await import("./sensorReadings");

    const result = await getFreezeDwellSamples("sensor-1", "2024-01-01T11:30:00.000Z");

    expect(result).toEqual([
      { at: "2024-01-01T11:20:00Z", tempF: 31 },
      { at: "2024-01-01T11:40:00Z", tempF: 30 },
    ]);
    // The anchor is looked for in the 24 hours before the cutoff.
    expect(readings.getDwellAnchor).toHaveBeenCalledWith(
      "sensor-1",
      "2023-12-31T11:30:00.000Z",
      "2024-01-01T11:30:00.000Z",
    );
    expect(readings.getRecentNumericReadingSamples).toHaveBeenCalledWith("sensor-1", "2024-01-01T11:30:00.000Z");
  });
});

describe("fetchLatestSensorValues", () => {
  it("returns the rows of the result, a failed lookup as no rows", async () => {
    const row = { sensor: sensor(), deviceName: "Garage", value_num: 40, value_bool: null, value_text: null, recorded_at: "2024-01-01T00:00:00Z" };
    readings.fetchLatestSensorValuesResult
      .mockResolvedValueOnce({ rows: [row], error: null })
      .mockResolvedValueOnce({ rows: [], error: "connection lost" });
    const { fetchLatestSensorValues } = await import("./sensorReadings");

    expect(await fetchLatestSensorValues("house-1")).toEqual([row]);
    expect(await fetchLatestSensorValues("house-1")).toEqual([]);
    expect(readings.fetchLatestSensorValuesResult).toHaveBeenCalledWith("house-1");
  });
});
