import { beforeEach, describe, expect, it, vi } from "vitest";
import type { DeviceSensor, DeviceWithSensors } from "./devices";

const mockRpc = vi.fn();
const mockListResult = vi.fn();
const listCalls: Array<[string, unknown[]]> = [];
vi.mock("./supabase", () => ({
  createServerClient: () => {
    const builder: Record<string, unknown> = {};
    for (const method of ["from", "select", "eq", "gte", "lte", "not", "order"]) {
      builder[method] = (...args: unknown[]) => {
        listCalls.push([method, args]);
        return builder;
      };
    }
    builder.range = (...args: unknown[]) => {
      listCalls.push(["range", args]);
      return mockListResult(...args);
    };
    builder.rpc = (...args: unknown[]) => mockRpc(...args);
    return builder;
  },
}));

import {
  buildDoorEventsCsv,
  buildDoorReportRows,
  doorReportRange,
  fetchValuesBefore,
  listDoorEventsForReport,
  pairDoorSensors,
  summarizeDoorReport,
  valueKey,
  type DoorEventRecord,
} from "./doorEventReport";

function sensor(id: string, kind: string, extra: Partial<DeviceSensor> = {}): DeviceSensor {
  return {
    id,
    device_id: "",
    key: id,
    label: id,
    kind: kind as DeviceSensor["kind"],
    unit: null,
    visible: true,
    sort_order: 0,
    offset_num: 0,
    ...extra,
  };
}

function device(id: string, sensors: DeviceSensor[], extra: Partial<DeviceWithSensors> = {}): DeviceWithSensors {
  return {
    id,
    household_id: "hh-1",
    name: id,
    source: "push",
    pull_url: null,
    ingest_key_prefix: null,
    enabled: true,
    last_seen_at: null,
    sort_order: 0,
    space: null,
    sensors,
    ...extra,
  };
}

const event = (over: Partial<DoorEventRecord> = {}): DoorEventRecord => ({
  id: "ev-1",
  sensorId: "door-1",
  label: "Garage door",
  openedAt: "2026-10-29T10:00:00.000Z",
  closedAt: "2026-10-29T10:20:00.000Z",
  durationMs: 20 * 60 * 1000,
  ...over,
});

describe("pairDoorSensors", () => {
  it("prefers a sensor on the door's own device", () => {
    const pairs = pairDoorSensors([
      device("esp", [sensor("door-1", "door"), sensor("t-own", "temperature"), sensor("h-own", "humidity")], {
        space: "Garage",
      }),
      device("other", [sensor("t-other", "temperature")], { space: "Garage" }),
    ]);
    expect(pairs.get("door-1")).toEqual({
      temperature: expect.objectContaining({ id: "t-own", match: "device" }),
      humidity: expect.objectContaining({ id: "h-own", match: "device" }),
    });
  });

  it("falls back to another device in the same space (ignoring case and spaces)", () => {
    const pairs = pairDoorSensors([
      device("reed", [sensor("door-1", "door")], { space: " garage " }),
      device("probe", [sensor("t-hidden", "temperature", { visible: false }), sensor("t-1", "temperature")], {
        space: "Garage",
      }),
      device("attic", [sensor("h-attic", "humidity")], { space: "Attic" }),
    ]);
    expect(pairs.get("door-1")).toEqual({
      temperature: expect.objectContaining({ id: "t-1", match: "space" }),
      humidity: null,
    });
  });

  it("pairs nothing when the door's device has no space and no sensors of its own", () => {
    const pairs = pairDoorSensors([
      device("reed", [sensor("door-1", "door")]),
      device("probe", [sensor("t-1", "temperature")]),
    ]);
    expect(pairs.get("door-1")).toEqual({ temperature: null, humidity: null });
  });
});

describe("buildDoorReportRows", () => {
  const devices = [
    device("esp", [
      sensor("door-1", "door", { label: "Garage door" }),
      sensor("t-1", "temperature", { label: "Bay", offset_num: -1 }),
      sensor("h-1", "humidity", { label: "Bay humidity" }),
    ]),
  ];

  it("reads the values at open and close, applies the offset, and works out the change", () => {
    const values = new Map([
      [valueKey("t-1", "2026-10-29T10:00:00.000Z"), 50],
      [valueKey("t-1", "2026-10-29T10:20:00.000Z"), 43.5],
      [valueKey("h-1", "2026-10-29T10:00:00.000Z"), 40],
      [valueKey("h-1", "2026-10-29T10:20:00.000Z"), 52],
    ]);
    const [row] = buildDoorReportRows([event()], devices, values);
    expect(row?.temperature).toEqual({ atOpen: 49, atClose: 42.5, change: -6.5 });
    expect(row?.humidity).toEqual({ atOpen: 40, atClose: 52, change: 12 });
    expect(row?.temperatureSensor?.label).toBe("Bay");
  });

  it("leaves a missing reading as null, never 0", () => {
    const values = new Map([[valueKey("t-1", "2026-10-29T10:00:00.000Z"), 50]]);
    const [row] = buildDoorReportRows([event()], devices, values);
    expect(row?.temperature).toEqual({ atOpen: 49, atClose: null, change: null });
    expect(row?.humidity).toEqual({ atOpen: null, atClose: null, change: null });
  });

  it("matches an event saved without a sensor id by its label", () => {
    const values = new Map([
      [valueKey("t-1", "2026-10-29T10:00:00.000Z"), 50],
      [valueKey("t-1", "2026-10-29T10:20:00.000Z"), 48],
    ]);
    const [row] = buildDoorReportRows([event({ sensorId: null })], devices, values);
    expect(row?.temperature.change).toBe(-2);
  });

  it("has no comparison for a door that no longer exists", () => {
    const [row] = buildDoorReportRows([event({ sensorId: "gone", label: "Old door" })], devices, new Map());
    expect(row?.temperatureSensor).toBeNull();
    expect(row?.temperature.change).toBeNull();
  });
});

describe("summarizeDoorReport", () => {
  it("averages changes only over openings that have both readings", () => {
    const base = { temperatureSensor: null, humiditySensor: null };
    const summary = summarizeDoorReport([
      { ...event(), ...base, temperature: { atOpen: 50, atClose: 44, change: -6 }, humidity: { atOpen: null, atClose: null, change: null } },
      { ...event({ id: "ev-2", label: "Shop door", durationMs: 10 * 60 * 1000 }), ...base, temperature: { atOpen: 50, atClose: 48, change: -2 }, humidity: { atOpen: null, atClose: null, change: null } },
      { ...event({ id: "ev-3" }), ...base, temperature: { atOpen: null, atClose: null, change: null }, humidity: { atOpen: 40, atClose: 45, change: 5 } },
    ]);
    expect(summary).toEqual({
      openings: 3,
      totalOpenMs: 50 * 60 * 1000,
      doors: ["Garage door", "Shop door"],
      avgTemperatureChange: -4,
      temperatureSamples: 2,
      avgHumidityChange: 5,
      humiditySamples: 1,
    });
  });

  it("has no average when no opening has readings", () => {
    expect(summarizeDoorReport([]).avgTemperatureChange).toBeNull();
  });
});

describe("buildDoorEventsCsv", () => {
  it("writes UTC times, blank cells for missing readings, and guards labels", () => {
    const csv = buildDoorEventsCsv([
      {
        ...event({ label: "=HYPERLINK(1)" }),
        temperatureSensor: { id: "t-1", label: "Bay, north", offset: 0, match: "space" },
        humiditySensor: null,
        temperature: { atOpen: 50, atClose: 44.25, change: -5.75 },
        humidity: { atOpen: null, atClose: null, change: null },
      },
    ]);
    const [header, line] = csv.split("\n");
    expect(header).toBe(
      "door,opened_at_utc,closed_at_utc,open_minutes,temperature_sensor,temperature_sensor_match,temp_at_open_f,temp_at_close_f,temp_change_f,humidity_sensor,humidity_sensor_match,humidity_at_open_pct,humidity_at_close_pct,humidity_change_pct",
    );
    expect(line).toBe(
      "'=HYPERLINK(1),2026-10-29T10:00:00.000Z,2026-10-29T10:20:00.000Z,20.0,\"Bay, north\",space,50.0,44.3,-5.8,,,,,",
    );
  });
});

describe("doorReportRange", () => {
  const now = new Date("2026-10-29T12:00:00Z");
  const start = (day: string) => `${day}T04:00:00.000Z`;
  const end = (day: string) => `${day}T03:59:59.999Z`;

  it("defaults to the last 7 days ending now", () => {
    expect(doorReportRange({}, 365, start, end, now)).toEqual({
      fromIso: "2026-10-22T12:00:00.000Z",
      toIso: "2026-10-29T12:00:00.000Z",
    });
  });

  it("uses whole days from the browser's zone when given", () => {
    expect(doorReportRange({ from: "2026-10-01", to: "2026-10-05" }, 365, start, end, now)).toEqual({
      fromIso: "2026-10-01T04:00:00.000Z",
      toIso: "2026-10-05T03:59:59.999Z",
    });
  });

  it("never starts before the plan's history window", () => {
    expect(doorReportRange({ days: 90 }, 30, start, end, now).fromIso).toBe("2026-09-29T12:00:00.000Z");
    expect(doorReportRange({ from: "2026-01-01" }, 30, start, end, now).fromIso).toBe("2026-09-29T12:00:00.000Z");
  });
});

describe("database access", () => {
  beforeEach(() => {
    listCalls.length = 0;
    mockRpc.mockReset();
    mockListResult.mockReset();
  });

  it("keys values by instant, so Postgres' +00:00 echo still matches", async () => {
    mockRpc.mockResolvedValue({
      data: [
        { sensor_id: "t-1", at_time: "2026-10-29T10:00:00+00:00", value_num: 50, recorded_at: "2026-10-29T09:58:00+00:00" },
      ],
      error: null,
    });
    const { values, error } = await fetchValuesBefore("hh-1", ["t-1", "t-1"], ["2026-10-29T10:00:00.000Z"]);
    expect(error).toBeNull();
    expect(values.get(valueKey("t-1", "2026-10-29T10:00:00.000Z"))).toBe(50);
    expect(mockRpc).toHaveBeenCalledWith("sensor_values_before", {
      p_household_id: "hh-1",
      p_sensor_ids: ["t-1"],
      p_times: ["2026-10-29T10:00:00.000Z"],
      p_max_age_seconds: 1800,
    });
  });

  it("splits many times into calls of 1000 and skips the call when there is nothing to ask", async () => {
    mockRpc.mockResolvedValue({ data: [], error: null });
    const times = Array.from({ length: 1500 }, (_, i) => new Date(Date.UTC(2026, 9, 1, 0, i)).toISOString());
    await fetchValuesBefore("hh-1", ["t-1"], times);
    expect(mockRpc).toHaveBeenCalledTimes(2);
    expect((mockRpc.mock.calls[1]![1] as { p_times: string[] }).p_times).toHaveLength(500);

    mockRpc.mockClear();
    await fetchValuesBefore("hh-1", [], times);
    expect(mockRpc).not.toHaveBeenCalled();
  });

  it("pages through more than 1000 events, stopping at the limit", async () => {
    const rows = (start: number, end: number) =>
      Array.from({ length: end - start + 1 }, (_, i) => ({
        id: `e${start + i}`,
        sensor_id: "door-1",
        label: "Garage door",
        opened_at: "2026-10-29T10:00:00Z",
        closed_at: "2026-10-29T10:01:00Z",
        duration_ms: 60000,
      }));
    mockListResult.mockImplementation(async (start: number, end: number) => ({ data: rows(start, end), error: null }));

    const result = await listDoorEventsForReport("hh-1", "a", "b", 2500);

    expect(listCalls.filter(([m]) => m === "range").map(([, a]) => a)).toEqual([
      [0, 999],
      [1000, 1999],
      [2000, 2500],
    ]);
    expect(result.events).toHaveLength(2500);
    expect(result.truncated).toBe(true);
  });

  it("stops after a short page and reports no truncation", async () => {
    mockListResult.mockResolvedValue({ data: [], error: null });
    const result = await listDoorEventsForReport("hh-1", "a", "b", 5000);
    expect(listCalls.filter(([m]) => m === "range")).toHaveLength(1);
    expect(result).toEqual({ events: [], truncated: false, error: null });
  });

  it("returns the database error", async () => {
    mockRpc.mockResolvedValue({ data: null, error: { message: "function missing" } });
    const result = await fetchValuesBefore("hh-1", ["t-1"], ["2026-10-29T10:00:00.000Z"]);
    expect(result.error).toBe("function missing");
  });

  it("lists closed events in the window and flags when there are more than the limit", async () => {
    mockListResult.mockResolvedValue({
      data: [
        { id: "a", sensor_id: "door-1", label: "Garage door", opened_at: "2026-10-29T10:00:00Z", closed_at: "2026-10-29T10:20:00Z", duration_ms: 1200000 },
        { id: "b", sensor_id: null, label: "Garage door", opened_at: "2026-10-28T10:00:00Z", closed_at: "2026-10-28T10:05:00Z", duration_ms: null },
        { id: "c", sensor_id: null, label: "Garage door", opened_at: "2026-10-27T10:00:00Z", closed_at: "2026-10-27T10:05:00Z", duration_ms: 300000 },
      ],
      error: null,
    });
    const result = await listDoorEventsForReport("hh-1", "2026-10-22T00:00:00Z", "2026-10-29T23:59:59Z", 2);
    expect(listCalls).toEqual(
      expect.arrayContaining([
        ["eq", ["household_id", "hh-1"]],
        ["gte", ["opened_at", "2026-10-22T00:00:00Z"]],
        ["lte", ["opened_at", "2026-10-29T23:59:59Z"]],
        ["not", ["closed_at", "is", null]],
        ["range", [0, 2]],
      ]),
    );
    expect(result.truncated).toBe(true);
    expect(result.events.map((e) => e.id)).toEqual(["a", "b"]);
    expect(result.events[1]?.durationMs).toBe(5 * 60 * 1000);
  });
});
