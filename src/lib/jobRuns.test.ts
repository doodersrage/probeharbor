import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

function mockQuery(result: { data?: unknown; error?: unknown; count?: number | null }) {
  const builder: Record<string, unknown> = {};
  for (const method of ["select", "eq", "order", "limit", "lt", "not", "insert", "update", "upsert"]) {
    builder[method] = vi.fn(() => builder);
  }
  builder.delete = vi.fn(() => builder);
  builder.single = vi.fn(() => Promise.resolve(result));
  builder.maybeSingle = vi.fn(() => Promise.resolve(result));
  (builder as { then: unknown }).then = (
    resolve: (value: unknown) => unknown,
    reject?: (reason: unknown) => unknown,
  ) => Promise.resolve(result).then(resolve, reject);
  return builder;
}

const mockFrom = vi.fn();
const mockRpc = vi.fn();
vi.mock("./supabase", () => ({
  createServerClient: () => ({
    from: (...args: unknown[]) => mockFrom(...args),
    rpc: (...args: unknown[]) => mockRpc(...args),
  }),
}));

beforeEach(() => {
  mockFrom.mockReset();
  mockRpc.mockReset();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("startJobRun", () => {
  it("inserts a running job row and returns its id", async () => {
    const builder = mockQuery({ data: { id: 42 }, error: null });
    mockFrom.mockReturnValue(builder);
    const { startJobRun } = await import("./jobRuns");

    const id = await startJobRun("nightly-retention", { note: "kickoff" });

    expect(id).toBe(42);
    expect(mockFrom).toHaveBeenCalledWith("job_runs");
    expect(builder.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        job_name: "nightly-retention",
        status: "running",
        detail: { note: "kickoff" },
      }),
    );
  });

  it("returns null and logs when the insert fails", async () => {
    mockFrom.mockReturnValue(mockQuery({ data: null, error: { message: "insert failed" } }));
    const { startJobRun } = await import("./jobRuns");

    expect(await startJobRun("nightly-retention")).toBeNull();
  });
});

describe("finishJobRun", () => {
  it("updates the row with a finished timestamp and status", async () => {
    const builder = mockQuery({ error: null });
    mockFrom.mockReturnValue(builder);
    const { finishJobRun } = await import("./jobRuns");

    await finishJobRun(42, "success", { rows: 10 });

    expect(builder.update).toHaveBeenCalledWith(
      expect.objectContaining({ status: "success", detail: { rows: 10 } }),
    );
    expect(builder.eq).toHaveBeenCalledWith("id", 42);
  });

  it("does nothing when id is null", async () => {
    const { finishJobRun } = await import("./jobRuns");

    await finishJobRun(null, "error");

    expect(mockFrom).not.toHaveBeenCalled();
  });
});

describe("listRecentJobRuns", () => {
  it("returns runs ordered by supabase, defaulting the limit to 50", async () => {
    const builder = mockQuery({ data: [{ id: 1 }], error: null });
    mockFrom.mockReturnValue(builder);
    const { listRecentJobRuns } = await import("./jobRuns");

    const result = await listRecentJobRuns();

    expect(result).toEqual({ runs: [{ id: 1 }], error: null });
    expect(builder.limit).toHaveBeenCalledWith(50);
  });

  it("passes through a custom limit", async () => {
    const builder = mockQuery({ data: [], error: null });
    mockFrom.mockReturnValue(builder);
    const { listRecentJobRuns } = await import("./jobRuns");

    await listRecentJobRuns(5);

    expect(builder.limit).toHaveBeenCalledWith(5);
  });

  it("returns an empty array and the message on error", async () => {
    mockFrom.mockReturnValue(mockQuery({ data: null, error: { message: "boom" } }));
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
    mockRpc.mockResolvedValue({ data: { rolled_up: 42, deleted: 31000 }, error: null });
    const { runSensorReadingRetention } = await import("./jobRuns");

    const result = await runSensorReadingRetention(90);

    expect(mockRpc).toHaveBeenCalledWith("roll_up_and_prune_readings", {
      p_cutoff: "2024-03-17T12:00:00.000Z",
    });
    // No row-by-row reads or deletes from the Worker any more.
    expect(mockFrom).not.toHaveBeenCalled();
    expect(result).toEqual({ rolledUp: 42, deleted: 31000, error: null });
  });

  it("reports the error and deletes nothing when the function fails or is missing", async () => {
    mockRpc.mockResolvedValue({
      data: null,
      error: { message: "Could not find the function public.roll_up_and_prune_readings" },
    });
    const { runSensorReadingRetention } = await import("./jobRuns");

    expect(await runSensorReadingRetention(90)).toEqual({
      rolledUp: 0,
      deleted: 0,
      error: "Could not find the function public.roll_up_and_prune_readings",
    });
    expect(mockFrom).not.toHaveBeenCalled();
  });

  it("treats a missing count as zero", async () => {
    mockRpc.mockResolvedValue({ data: {}, error: null });
    const { runSensorReadingRetention } = await import("./jobRuns");

    expect(await runSensorReadingRetention(90)).toEqual({ rolledUp: 0, deleted: 0, error: null });
  });
});
