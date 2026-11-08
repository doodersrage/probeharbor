import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mockRecord = vi.fn();
const mockListHousehold = vi.fn();
const mockListAdmin = vi.fn();
vi.mock("./db/ingest", () => ({
  recordIngestStat: (...args: unknown[]) => mockRecord(...args),
  listIngestStatsForHousehold: (...args: unknown[]) => mockListHousehold(...args),
  listRecentIngestStatsAdmin: (...args: unknown[]) => mockListAdmin(...args),
}));

beforeEach(() => {
  mockRecord.mockReset().mockResolvedValue(undefined);
  mockListHousehold.mockReset().mockResolvedValue([]);
  mockListAdmin.mockReset().mockResolvedValue([]);
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2024-06-15T12:00:00.000Z"));
});

afterEach(() => {
  vi.useRealTimers();
});

describe("recordIngestStat", () => {
  it("records against today's UTC day", async () => {
    const { recordIngestStat } = await import("./ingestStats");

    await recordIngestStat("house-1", "device-1", true);
    await recordIngestStat("house-1", "device-1", false);

    expect(mockRecord).toHaveBeenNthCalledWith(1, "house-1", "device-1", true, "2024-06-15");
    expect(mockRecord).toHaveBeenNthCalledWith(2, "house-1", "device-1", false, "2024-06-15");
  });
});

describe("listIngestStatsForHousehold", () => {
  it("computes the since-day cutoff from the days parameter", async () => {
    const { listIngestStatsForHousehold } = await import("./ingestStats");

    await listIngestStatsForHousehold("house-1", 3);

    expect(mockListHousehold).toHaveBeenCalledWith("house-1", "2024-06-12");
  });

  it("defaults to 7 days and returns the rows", async () => {
    const rows = [{ device_id: "d1", day: "2024-06-15", success_count: 3, error_count: 0, device_name: "Garage" }];
    mockListHousehold.mockResolvedValue(rows);
    const { listIngestStatsForHousehold } = await import("./ingestStats");

    expect(await listIngestStatsForHousehold("house-1")).toEqual(rows);
    expect(mockListHousehold).toHaveBeenCalledWith("house-1", "2024-06-08");
  });
});

describe("listRecentIngestStatsAdmin", () => {
  it("computes the since-day cutoff from the days parameter", async () => {
    const { listRecentIngestStatsAdmin } = await import("./ingestStats");

    await listRecentIngestStatsAdmin();
    await listRecentIngestStatsAdmin(1);

    expect(mockListAdmin).toHaveBeenNthCalledWith(1, "2024-06-08");
    expect(mockListAdmin).toHaveBeenNthCalledWith(2, "2024-06-14");
  });
});
