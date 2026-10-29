import { beforeEach, describe, expect, it, vi } from "vitest";

const mockFetchRecentBoolReadings = vi.fn();
vi.mock("./sensorReadings", () => ({
  fetchRecentBoolReadings: (...a: unknown[]) => mockFetchRecentBoolReadings(...a),
}));

const mockRecentSelect = vi.fn();
// Saves go through upsert (ignore duplicates); a plain insert is the fallback.
const mockInsert = vi.fn();
const mockUpsertResult = vi.fn();
const mockPlainInsert = vi.fn();
const upsertOptions: unknown[] = [];
const dedupSince: string[] = [];
// sensor_readings lookups for findOpenStartBefore: [last closed, first open].
const mockLastClosed = vi.fn();
const mockFirstOpen = vi.fn();
// lastDoorStateBefore: the door's previous reading.
const mockLastState = vi.fn();
vi.mock("./supabase", () => ({
  createServerClient: () => ({
    from: (table: string) => {
      if (table === "sensor_readings") {
        const filters: Record<string, unknown> = {};
        const q: Record<string, unknown> = {};
        for (const m of ["select", "lt", "gt", "order", "not"]) q[m] = () => q;
        q.eq = (col: string, val: unknown) => {
          filters[col] = val;
          return q;
        };
        q.limit = () =>
          filters.value_bool === false ? mockLastClosed() : filters.value_bool === true ? mockFirstOpen() : mockLastState();
        return q;
      }
      return {
        select: () => ({
          eq: () => ({
            gte: (_col: string, since: string) => {
              dedupSince.push(since);
              return mockRecentSelect();
            },
          }),
        }),
        upsert: async (rows: unknown, options: unknown) => {
          upsertOptions.push(options);
          const result = await mockUpsertResult();
          if (!result?.error) return mockInsert(rows);
          return result;
        },
        insert: (rows: unknown) => mockPlainInsert(rows),
      };
    },
  }),
}));

const NOW = Date.parse("2026-10-29T12:00:00Z");

beforeEach(() => {
  mockFetchRecentBoolReadings.mockReset();
  mockRecentSelect.mockReset().mockResolvedValue({ data: [], error: null });
  mockLastClosed.mockReset().mockResolvedValue({ data: [], error: null });
  mockFirstOpen.mockReset().mockResolvedValue({ data: [], error: null });
  mockLastState.mockReset().mockResolvedValue({ data: [], error: null });
  dedupSince.length = 0;
  mockInsert.mockReset().mockResolvedValue({ error: null });
  mockUpsertResult.mockReset().mockResolvedValue({ error: null });
  mockPlainInsert.mockReset().mockResolvedValue({ error: null });
  upsertOptions.length = 0;
});

describe("recordDoorSessions", () => {
  it("saves a finished open/close session with its sensor id", async () => {
    mockFetchRecentBoolReadings.mockResolvedValue([
      { value: true, recordedAt: "2026-10-29T10:00:00Z" },
      { value: true, recordedAt: "2026-10-29T10:05:00Z" },
      { value: false, recordedAt: "2026-10-29T10:20:00Z" },
    ]);
    const { recordDoorSessions } = await import("./doorEvents");

    await recordDoorSessions("hh-1", [{ id: "door-1", label: "Garage door" }], NOW);

    expect(mockFetchRecentBoolReadings).toHaveBeenCalledWith("door-1", "2026-10-28T12:00:00.000Z");
    expect(mockInsert).toHaveBeenCalledWith([
      {
        household_id: "hh-1",
        sensor_id: "door-1",
        label: "Garage door",
        opened_at: "2026-10-29T10:00:00Z",
        closed_at: "2026-10-29T10:20:00Z",
        duration_ms: 20 * 60 * 1000,
      },
    ]);
  });

  it("does not save a session that was already saved (e.g. by the rule pass)", async () => {
    mockFetchRecentBoolReadings.mockResolvedValue([
      { value: true, recordedAt: "2026-10-29T10:00:00Z" },
      { value: false, recordedAt: "2026-10-29T10:20:00Z" },
    ]);
    mockRecentSelect.mockResolvedValue({
      data: [{ label: "Garage door", opened_at: "2026-10-29T10:00:00Z" }],
      error: null,
    });
    const { recordDoorSessions } = await import("./doorEvents");

    await recordDoorSessions("hh-1", [{ id: "door-1", label: "Garage door" }], NOW);

    expect(mockInsert).not.toHaveBeenCalled();
  });

  it("saves nothing while the door is still open or only closed readings exist", async () => {
    mockFetchRecentBoolReadings
      .mockResolvedValueOnce([{ value: true, recordedAt: "2026-10-29T11:00:00Z" }])
      .mockResolvedValueOnce([
        { value: false, recordedAt: "2026-10-29T11:00:00Z" },
        { value: false, recordedAt: "2026-10-29T11:30:00Z" },
      ]);
    const { recordDoorSessions } = await import("./doorEvents");

    await recordDoorSessions(
      "hh-1",
      [
        { id: "door-1", label: "Garage door" },
        { id: "door-2", label: "Shop door" },
      ],
      NOW,
    );

    expect(mockFetchRecentBoolReadings).toHaveBeenCalledTimes(2);
    expect(mockInsert).not.toHaveBeenCalled();
  });

  it("does nothing without sensors", async () => {
    const { recordDoorSessions } = await import("./doorEvents");
    await recordDoorSessions("hh-1", [], NOW);
    expect(mockFetchRecentBoolReadings).not.toHaveBeenCalled();
  });

  it("reports a failed save instead of hiding it", async () => {
    mockFetchRecentBoolReadings.mockResolvedValue([
      { value: true, recordedAt: "2026-10-29T10:00:00Z" },
      { value: false, recordedAt: "2026-10-29T10:20:00Z" },
    ]);
    mockInsert.mockResolvedValue({ error: { message: "db down" } });
    const { recordDoorSessions } = await import("./doorEvents");

    await expect(
      recordDoorSessions("hh-1", [{ id: "door-1", label: "Garage door" }], NOW),
    ).rejects.toThrow("door_open_events insert failed: db down");
  });

  it("saves a door that was open for days with its real start, not the 24 h window edge", async () => {
    // The 24 h window starts with the door already open; it closed at 11:00.
    mockFetchRecentBoolReadings.mockResolvedValue([
      { value: true, recordedAt: "2026-10-28T12:00:00Z" },
      { value: true, recordedAt: "2026-10-29T06:00:00Z" },
      { value: false, recordedAt: "2026-10-29T11:00:00Z" },
    ]);
    mockLastClosed.mockResolvedValue({ data: [{ recorded_at: "2026-10-26T07:55:00+00:00" }], error: null });
    mockFirstOpen.mockResolvedValue({ data: [{ recorded_at: "2026-10-26T08:00:00+00:00" }], error: null });
    const { recordDoorSessions } = await import("./doorEvents");

    await recordDoorSessions("hh-1", [{ id: "door-1", label: "Garage door" }], NOW);

    expect(mockInsert).toHaveBeenCalledWith([
      expect.objectContaining({
        opened_at: "2026-10-26T08:00:00+00:00",
        closed_at: "2026-10-29T11:00:00Z",
        duration_ms: Date.parse("2026-10-29T11:00:00Z") - Date.parse("2026-10-26T08:00:00Z"),
      }),
    ]);
    // Duplicate check reaches back to that start, not just 48 h.
    expect(dedupSince).toEqual(["2026-10-26T08:00:00.000Z"]);
  });

  it("doesn't save the long session again on the next minute's 'closed' report", async () => {
    mockFetchRecentBoolReadings.mockResolvedValue([
      { value: true, recordedAt: "2026-10-28T12:01:00Z" },
      { value: false, recordedAt: "2026-10-29T11:00:00Z" },
      { value: false, recordedAt: "2026-10-29T11:01:00Z" },
    ]);
    mockLastClosed.mockResolvedValue({ data: [{ recorded_at: "2026-10-26T07:55:00+00:00" }], error: null });
    mockFirstOpen.mockResolvedValue({ data: [{ recorded_at: "2026-10-26T08:00:00+00:00" }], error: null });
    mockRecentSelect.mockResolvedValue({
      data: [{ label: "Garage door", opened_at: "2026-10-26T08:00:00+00:00" }],
      error: null,
    });
    const { recordDoorSessions } = await import("./doorEvents");

    await recordDoorSessions("hh-1", [{ id: "door-1", label: "Garage door" }], NOW);

    expect(mockInsert).not.toHaveBeenCalled();
  });

  it("looks no further back when the window starts with the door closed", async () => {
    mockFetchRecentBoolReadings.mockResolvedValue([
      { value: false, recordedAt: "2026-10-28T12:00:00Z" },
      { value: true, recordedAt: "2026-10-29T10:00:00Z" },
      { value: false, recordedAt: "2026-10-29T10:20:00Z" },
    ]);
    const { recordDoorSessions } = await import("./doorEvents");

    await recordDoorSessions("hh-1", [{ id: "door-1", label: "Garage door" }], NOW);

    expect(mockLastClosed).not.toHaveBeenCalled();
    expect(mockInsert).toHaveBeenCalledWith([expect.objectContaining({ opened_at: "2026-10-29T10:00:00Z" })]);
  });

  describe("recordDoorSessionsIfJustClosed", () => {
    const session = [
      { value: true, recordedAt: "2026-10-29T10:00:00Z" },
      { value: false, recordedAt: "2026-10-29T10:20:00Z" },
    ];

    it("saves when the previous report was open", async () => {
      mockLastState.mockResolvedValue({ data: [{ value_bool: true }], error: null });
      mockFetchRecentBoolReadings.mockResolvedValue(session);
      const { recordDoorSessionsIfJustClosed } = await import("./doorEvents");

      await recordDoorSessionsIfJustClosed("hh-1", [{ id: "door-1", label: "Garage door" }], "2026-10-29T10:20:00Z");

      expect(mockInsert).toHaveBeenCalledTimes(1);
    });

    it("does nothing more on a repeated 'closed' report", async () => {
      mockLastState.mockResolvedValue({ data: [{ value_bool: false }], error: null });
      const { recordDoorSessionsIfJustClosed } = await import("./doorEvents");

      await recordDoorSessionsIfJustClosed("hh-1", [{ id: "door-1", label: "Garage door" }], "2026-10-29T10:21:00Z");

      expect(mockFetchRecentBoolReadings).not.toHaveBeenCalled();
      expect(mockInsert).not.toHaveBeenCalled();
    });

    it("still saves when there is no earlier reading to compare with", async () => {
      mockFetchRecentBoolReadings.mockResolvedValue(session);
      const { recordDoorSessionsIfJustClosed } = await import("./doorEvents");

      await recordDoorSessionsIfJustClosed("hh-1", [{ id: "door-1", label: "Garage door" }], "2026-10-29T10:20:00Z");

      expect(mockFetchRecentBoolReadings).toHaveBeenCalledTimes(1);
    });
  });

  describe("duplicate-safe saving", () => {
    const session = [
      { value: true, recordedAt: "2026-10-29T10:00:00Z" },
      { value: false, recordedAt: "2026-10-29T10:20:00Z" },
    ];

    it("inserts with ON CONFLICT DO NOTHING on the session key", async () => {
      mockFetchRecentBoolReadings.mockResolvedValue(session);
      const { recordDoorSessions } = await import("./doorEvents");
      await recordDoorSessions("hh-1", [{ id: "door-1", label: "Garage door" }], NOW);
      expect(upsertOptions).toEqual([{ onConflict: "household_id,label,opened_at", ignoreDuplicates: true }]);
      expect(mockPlainInsert).not.toHaveBeenCalled();
    });

    it("falls back to a plain insert before the unique index exists (42P10)", async () => {
      mockFetchRecentBoolReadings.mockResolvedValue(session);
      mockUpsertResult.mockResolvedValue({ error: { code: "42P10", message: "no unique constraint" } });
      const { recordDoorSessions } = await import("./doorEvents");
      await recordDoorSessions("hh-1", [{ id: "door-1", label: "Garage door" }], NOW);
      expect(mockPlainInsert).toHaveBeenCalledTimes(1);
    });

    it("reports any other save error", async () => {
      mockFetchRecentBoolReadings.mockResolvedValue(session);
      mockUpsertResult.mockResolvedValue({ error: { code: "57014", message: "timeout" } });
      const { recordDoorSessions } = await import("./doorEvents");
      await expect(recordDoorSessions("hh-1", [{ id: "door-1", label: "Garage door" }], NOW)).rejects.toThrow(
        "door_open_events insert failed: timeout",
      );
      expect(mockPlainInsert).not.toHaveBeenCalled();
    });
  });
});
