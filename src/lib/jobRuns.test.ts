import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mockClose = vi.fn();
const mockStart = vi.fn();
const mockFinish = vi.fn();
const mockList = vi.fn();
const mockRollUp = vi.fn();
vi.mock("./db/jobs", () => ({
  closeAbandonedJobRuns: (...args: unknown[]) => mockClose(...args),
  startJobRun: (...args: unknown[]) => mockStart(...args),
  finishJobRun: (...args: unknown[]) => mockFinish(...args),
  listRecentJobRuns: (...args: unknown[]) => mockList(...args),
  rollUpAndPruneReadings: (...args: unknown[]) => mockRollUp(...args),
}));

beforeEach(() => {
  mockClose.mockReset().mockResolvedValue(0);
  mockStart.mockReset();
  mockFinish.mockReset().mockResolvedValue(undefined);
  mockList.mockReset();
  mockRollUp.mockReset();
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("startJobRun", () => {
  it("starts a running job row and returns its id", async () => {
    mockStart.mockResolvedValue(42);
    const { startJobRun } = await import("./jobRuns");

    const id = await startJobRun("nightly-retention", { note: "kickoff" });

    expect(id).toBe(42);
    expect(mockStart).toHaveBeenCalledWith("nightly-retention", { note: "kickoff" });
  });

  it("returns null and logs when the insert fails", async () => {
    mockStart.mockRejectedValue(new Error("insert failed"));
    const { startJobRun } = await import("./jobRuns");

    expect(await startJobRun("nightly-retention")).toBeNull();
    expect(console.error).toHaveBeenCalledWith("Failed to start job run:", "insert failed");
  });
});

describe("closeAbandonedJobRuns", () => {
  it("marks this job's runs stuck in running for over 30 min as errors", async () => {
    mockClose.mockResolvedValue(2);
    const { closeAbandonedJobRuns } = await import("./jobRuns");
    const now = Date.parse("2026-10-28T12:00:00Z");

    expect(await closeAbandonedJobRuns("collect-history", now)).toBe(2);
    expect(mockClose).toHaveBeenCalledWith(
      "collect-history",
      "2026-10-28T12:00:00.000Z",
      "2026-10-28T11:30:00.000Z",
      expect.objectContaining({ abandoned: true }),
    );
    expect(console.error).toHaveBeenCalledWith("job collect-history: 2 run(s) never finished; marked as errors");
  });

  it("returns 0 instead of throwing when the update fails", async () => {
    mockClose.mockRejectedValue(new Error("db down"));
    const { closeAbandonedJobRuns } = await import("./jobRuns");

    expect(await closeAbandonedJobRuns("collect-history")).toBe(0);
  });
});

describe("startJobRun closes abandoned runs first", () => {
  it("cleans up, then inserts the new run", async () => {
    mockStart.mockResolvedValue(43);
    const { startJobRun } = await import("./jobRuns");

    expect(await startJobRun("collect-history")).toBe(43);
    expect(mockClose).toHaveBeenCalledWith("collect-history", expect.any(String), expect.any(String), expect.any(Object));
    expect(mockClose.mock.invocationCallOrder[0]).toBeLessThan(mockStart.mock.invocationCallOrder[0]!);
  });

  it("still starts the run when the cleanup fails", async () => {
    mockClose.mockRejectedValue(new Error("timeout"));
    mockStart.mockResolvedValue(44);
    const { startJobRun } = await import("./jobRuns");

    expect(await startJobRun("collect-history")).toBe(44);
  });
});

describe("finishJobRun", () => {
  it("finishes the row with its status and detail", async () => {
    const { finishJobRun } = await import("./jobRuns");

    await finishJobRun(42, "success", { rows: 10 });

    expect(mockFinish).toHaveBeenCalledWith(42, "success", { rows: 10 });
  });

  it("does nothing when id is null", async () => {
    const { finishJobRun } = await import("./jobRuns");

    await finishJobRun(null, "error");

    expect(mockFinish).not.toHaveBeenCalled();
  });
});

describe("listRecentJobRuns", () => {
  it("returns runs, defaulting the limit to 50", async () => {
    mockList.mockResolvedValue([{ id: 1 }]);
    const { listRecentJobRuns } = await import("./jobRuns");

    const result = await listRecentJobRuns();

    expect(result).toEqual({ runs: [{ id: 1 }], error: null });
    expect(mockList).toHaveBeenCalledWith(50);
  });

  it("passes through a custom limit", async () => {
    mockList.mockResolvedValue([]);
    const { listRecentJobRuns } = await import("./jobRuns");

    await listRecentJobRuns(5);

    expect(mockList).toHaveBeenCalledWith(5);
  });

  it("returns an empty array and the message on error", async () => {
    mockList.mockRejectedValue(new Error("boom"));
    const { listRecentJobRuns } = await import("./jobRuns");

    expect(await listRecentJobRuns()).toEqual({ runs: [], error: "boom" });
  });
});

describe("retentionCutoff", () => {
  it("starts at the UTC hour, retentionDays back, so no hour is split across runs", async () => {
    const { retentionCutoff } = await import("./jobRuns");
    expect(retentionCutoff(90, new Date("2024-06-15T12:34:56.000Z"))).toBe("2024-03-17T12:00:00.000Z");
  });
});

describe("runSensorReadingRetention", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-06-15T12:34:56.000Z"));
  });

  it("rolls up and prunes in one database call with an hour-aligned cutoff", async () => {
    mockRollUp.mockResolvedValue({ rolled_up: 42, deleted: 31000 });
    const { runSensorReadingRetention } = await import("./jobRuns");

    const result = await runSensorReadingRetention(90);

    expect(mockRollUp).toHaveBeenCalledWith("2024-03-17T12:00:00.000Z");
    expect(result).toEqual({ rolledUp: 42, deleted: 31000, error: null });
  });

  it("reports the error and deletes nothing when the function fails or is missing", async () => {
    mockRollUp.mockRejectedValue(new Error("function public.roll_up_and_prune_readings does not exist"));
    const { runSensorReadingRetention } = await import("./jobRuns");

    expect(await runSensorReadingRetention(90)).toEqual({
      rolledUp: 0,
      deleted: 0,
      error: "function public.roll_up_and_prune_readings does not exist",
    });
  });

  it("treats a missing count as zero", async () => {
    mockRollUp.mockResolvedValue({});
    const { runSensorReadingRetention } = await import("./jobRuns");

    expect(await runSensorReadingRetention(90)).toEqual({ rolledUp: 0, deleted: 0, error: null });
  });
});
