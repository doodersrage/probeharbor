import { beforeEach, describe, expect, it, vi } from "vitest";

const mockRpc = vi.fn();
vi.mock("./supabase", () => ({ createServerClient: () => ({ rpc: (...a: unknown[]) => mockRpc(...a) }) }));

import { fetchTemperatureReadingCounts, temperatureSensorIdsForFilter } from "./readingCounts";
import { buildClaimsPackData, buildClaimsPackHtml } from "./claimsPack";

beforeEach(() => {
  mockRpc.mockReset();
});

describe("fetchTemperatureReadingCounts", () => {
  it("returns recorded totals from the database", async () => {
    mockRpc.mockResolvedValue({ data: [{ total_count: 43200, below_count: 7, from_rollups: false }], error: null });
    expect(await fetchTemperatureReadingCounts("hh-1", "a", "b", 34, ["t"])).toEqual({ total: 43200, below: 7, approximate: false });
    expect(mockRpc).toHaveBeenCalledWith("temperature_reading_counts", {
      p_household_id: "hh-1",
      p_from: "a",
      p_to: "b",
      p_threshold_f: 34,
      p_sensor_ids: ["t"],
    });
  });

  it("returns null (caller keeps its old figure) when the function is missing or the call throws", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    mockRpc.mockResolvedValueOnce({ data: null, error: { message: "function not found" } });
    expect(await fetchTemperatureReadingCounts("hh-1", "a", "b", 34)).toBeNull();
    mockRpc.mockRejectedValueOnce(new Error("network"));
    expect(await fetchTemperatureReadingCounts("hh-1", "a", "b", 34)).toBeNull();
    warn.mockRestore();
  });
});

describe("temperatureSensorIdsForFilter", () => {
  const devices = [
    { name: "Garage ESP", sensors: [{ id: "t1", key: "temp1", kind: "temperature" }, { id: "h1", key: "humidity1", kind: "humidity" }] },
    { name: "Attic", sensors: [{ id: "t2", key: "temp1", kind: "temperature" }] },
  ];
  it("is null without a filter, else the matching temperature sensors", () => {
    expect(temperatureSensorIdsForFilter(devices, {})).toBeNull();
    expect(temperatureSensorIdsForFilter(devices, { feedName: "Garage ESP" })).toEqual(["t1"]);
    expect(temperatureSensorIdsForFilter(devices, { probeKey: "temp1" })).toEqual(["t1", "t2"]);
  });
});

describe("claims pack counts", () => {
  const base = {
    householdLabel: "Home",
    rangeFrom: "2026-10-01T00:00:00Z",
    rangeTo: "2026-10-05T00:00:00Z",
    freezeThresholdF: 34,
    points: [
      { timestamp: "2026-10-01T00:00:00Z", tempf: 40, humidity: null, probeLabel: "Bay" },
      { timestamp: "2026-10-01T01:00:00Z", tempf: 33, humidity: null, probeLabel: "Bay" },
    ],
    events: [],
    devices: [],
    readingsCsvUrl: "r",
    alertsCsvUrl: "a",
  };

  it("states recorded readings, not chart samples", () => {
    const data = buildClaimsPackData({ ...base, readingCounts: { total: 5760, below: 3, approximate: false } });
    expect(data.freezeHours.totalReadings).toBe(5760);
    expect(data.freezeHours.readingsBelow34).toBe(3);
    expect(data.executiveSummary).toContain("recorded 5760 temperature readings");
  });

  it("marks the below-threshold count as a minimum when older hours are summaries", () => {
    const html = buildClaimsPackHtml(
      buildClaimsPackData({ ...base, readingCounts: { total: 90000, below: 40, approximate: true } }),
    );
    expect(html).toContain("≥ 40");
    expect(html).toContain("at least: older hours are kept as hourly summaries");
  });

  it("keeps the chart's figures when counts aren't available", () => {
    expect(buildClaimsPackData(base).freezeHours.totalReadings).toBe(2);
  });
});
