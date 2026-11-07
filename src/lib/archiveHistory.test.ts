import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mockHouseholdIds = vi.fn();
const mockOldReadings = vi.fn();
const mockInsertArchive = vi.fn();
vi.mock("./db/householdTools", () => ({
  householdIds: (...a: unknown[]) => mockHouseholdIds(...a),
  oldReadings: (...a: unknown[]) => mockOldReadings(...a),
  insertArchive: (...a: unknown[]) => mockInsertArchive(...a),
}));

function r2Bucket() {
  return { put: vi.fn().mockResolvedValue(undefined) };
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2024-06-15T12:00:00.000Z"));
  mockHouseholdIds.mockReset().mockResolvedValue([]);
  mockOldReadings.mockReset().mockResolvedValue([]);
  mockInsertArchive.mockReset().mockResolvedValue(undefined);
});

afterEach(() => {
  vi.useRealTimers();
});

describe("archiveOldReadings", () => {
  it("returns the error immediately when the households query fails", async () => {
    mockHouseholdIds.mockRejectedValue(new Error("db down"));
    const { archiveOldReadings } = await import("./archiveHistory");

    const result = await archiveOldReadings({ r2: r2Bucket() as never });

    expect(result).toEqual({ archived: 0, skipped: false, error: "db down" });
    expect(mockOldReadings).not.toHaveBeenCalled();
  });

  it("reads at most 500 households", async () => {
    const { archiveOldReadings } = await import("./archiveHistory");

    await archiveOldReadings({ r2: r2Bucket() as never });

    expect(mockHouseholdIds).toHaveBeenCalledWith(500);
  });

  it("skips archiving (without querying readings) when no r2 binding is given", async () => {
    mockHouseholdIds.mockResolvedValue(["house-1"]);
    const { archiveOldReadings } = await import("./archiveHistory");

    const result = await archiveOldReadings();

    expect(result).toEqual({ archived: 0, skipped: true, error: null });
    expect(mockOldReadings).not.toHaveBeenCalled();
  });

  it("skips a household with no aged readings", async () => {
    mockHouseholdIds.mockResolvedValue(["house-1"]);
    const r2 = r2Bucket();
    const { archiveOldReadings } = await import("./archiveHistory");

    const result = await archiveOldReadings({ r2: r2 as never });

    expect(result).toEqual({ archived: 0, skipped: false, error: null });
    expect(r2.put).not.toHaveBeenCalled();
    expect(mockInsertArchive).not.toHaveBeenCalled();
  });

  it("archives readings for a household, uploading to r2 and recording the archive row", async () => {
    mockHouseholdIds.mockResolvedValue(["house-1"]);
    const readings = [{ id: 1, value_num: 30, recorded_at: "2024-01-01", sensor_id: "s1" }];
    mockOldReadings.mockResolvedValue(readings);
    const r2 = r2Bucket();
    const { archiveOldReadings } = await import("./archiveHistory");

    const result = await archiveOldReadings({ r2: r2 as never, retentionDays: 90 });

    // cutoff = now (2024-06-15T12:00) - 90 days = 2024-03-17T12:00:00.000Z
    expect(mockOldReadings).toHaveBeenCalledWith("house-1", "2024-03-17T12:00:00.000Z", 5000);
    expect(r2.put).toHaveBeenCalledWith(
      "archives/house-1/2024-03-17.json",
      JSON.stringify(readings),
      { httpMetadata: { contentType: "application/json" } },
    );
    expect(mockInsertArchive).toHaveBeenCalledWith({
      household_id: "house-1",
      period_start: "2024-03-17",
      period_end: "2024-06-15",
      object_key: "archives/house-1/2024-03-17.json",
      row_count: 1,
    });
    expect(result).toEqual({ archived: 1, skipped: false, error: null });
  });

  it("uses a custom retentionDays for the cutoff instead of the default", async () => {
    mockHouseholdIds.mockResolvedValue(["house-1"]);
    const { archiveOldReadings } = await import("./archiveHistory");

    await archiveOldReadings({ r2: r2Bucket() as never, retentionDays: 30 });

    // cutoff = now - 30 days = 2024-05-16T12:00:00.000Z
    expect(mockOldReadings).toHaveBeenCalledWith("house-1", "2024-05-16T12:00:00.000Z", 5000);
  });

  it("archives each household's own readings and sums the counts", async () => {
    mockHouseholdIds.mockResolvedValue(["house-1", "house-2"]);
    const rowsByHousehold: Record<string, unknown[]> = {
      "house-1": [{ id: 1, sensor_id: "s1" }],
      "house-2": [{ id: 2, sensor_id: "s2" }, { id: 3, sensor_id: "s2" }],
    };
    mockOldReadings.mockImplementation(async (householdId: string) => rowsByHousehold[householdId] ?? []);
    const r2 = r2Bucket();
    const { archiveOldReadings } = await import("./archiveHistory");

    const result = await archiveOldReadings({ r2: r2 as never, retentionDays: 90 });

    expect(mockOldReadings.mock.calls.map((call) => call[0])).toEqual(["house-1", "house-2"]);
    expect(r2.put).toHaveBeenCalledWith(
      "archives/house-1/2024-03-17.json",
      JSON.stringify(rowsByHousehold["house-1"]),
      expect.anything(),
    );
    expect(r2.put).toHaveBeenCalledWith(
      "archives/house-2/2024-03-17.json",
      JSON.stringify(rowsByHousehold["house-2"]),
      expect.anything(),
    );
    expect(result).toEqual({ archived: 3, skipped: false, error: null });
  });

  it("handles no households as nothing to archive", async () => {
    const { archiveOldReadings } = await import("./archiveHistory");

    const result = await archiveOldReadings({ r2: r2Bucket() as never });

    expect(result).toEqual({ archived: 0, skipped: false, error: null });
  });
});
