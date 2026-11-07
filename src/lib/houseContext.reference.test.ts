import { beforeEach, describe, expect, it, vi } from "vitest";

const mockHouseholdSensor = vi.fn();
const mockSensorBucketAverages = vi.fn();
vi.mock("./db/places", () => ({
  householdSensor: (...a: unknown[]) => mockHouseholdSensor(...a),
  sensorBucketAverages: (...a: unknown[]) => mockSensorBucketAverages(...a),
}));

import { bucketSecondsFor, fetchReferenceSensorChartPoints } from "./houseContext";

beforeEach(() => {
  mockHouseholdSensor.mockReset().mockResolvedValue({ label: "Hallway", kind: "temperature" });
  mockSensorBucketAverages.mockReset().mockResolvedValue([]);
});

describe("bucketSecondsFor", () => {
  it("sizes buckets so a window comes out near 900 points, never under a minute", () => {
    expect(bucketSecondsFor("2026-09-29T00:00:00Z", "2026-10-29T00:00:00Z")).toBe(2880); // 30 days → 48 min
    expect(bucketSecondsFor("2026-10-29T00:00:00Z", "2026-10-29T06:00:00Z")).toBe(60);
  });
});

describe("fetchReferenceSensorChartPoints", () => {
  it("uses bucket averages for the whole window in one call", async () => {
    mockSensorBucketAverages.mockResolvedValue([
      { bucket_start: "2026-09-29T00:00:00+00:00", avg_num: 68.2 },
      { bucket_start: "2026-10-28T23:12:00+00:00", avg_num: 69 },
      // Buckets with no usable average are skipped, never charted as 0.
      { bucket_start: "2026-10-28T23:30:00+00:00", avg_num: null },
    ]);

    const points = await fetchReferenceSensorChartPoints("hh-1", "s", 30, { from: "2026-09-29T00:00:00Z", to: "2026-10-29T00:00:00Z" });

    expect(mockHouseholdSensor).toHaveBeenCalledWith("hh-1", "s");
    expect(mockSensorBucketAverages).toHaveBeenCalledWith("hh-1", "s", "2026-09-29T00:00:00Z", "2026-10-29T00:00:00Z", 2880);
    expect(points).toEqual([
      { timestamp: "2026-09-29T00:00:00+00:00", tempf: 68.2, humidity: null, probeLabel: "Hallway" },
      { timestamp: "2026-10-28T23:12:00+00:00", tempf: 69, humidity: null, probeLabel: "Hallway" },
    ]);
  });

  it("returns nothing for a sensor that isn't a temperature sensor", async () => {
    mockHouseholdSensor.mockResolvedValue({ label: "Door", kind: "door" });

    expect(await fetchReferenceSensorChartPoints("hh-1", "s", 30)).toEqual([]);
    expect(mockSensorBucketAverages).not.toHaveBeenCalled();
  });

  it("returns no points and logs when the query fails", async () => {
    mockSensorBucketAverages.mockRejectedValue(new Error("db down"));
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(await fetchReferenceSensorChartPoints("hh-1", "s", 30)).toEqual([]);
    expect(errorSpy).toHaveBeenCalledWith("fetchReferenceSensorChartPoints failed:", "db down");
    errorSpy.mockRestore();
  });
});
