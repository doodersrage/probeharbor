import { beforeEach, describe, expect, it, vi } from "vitest";

const mockFetchRecentBoolReadings = vi.fn();
vi.mock("./sensorReadings", () => ({
  fetchRecentBoolReadings: (...a: unknown[]) => mockFetchRecentBoolReadings(...a),
}));

// Neon door queries: saved-session keys (duplicate check), insert, and the
// two lookups for a door already open at the window start.
const mockSavedSessionKeysSince = vi.fn();
const mockInsertDoorSessions = vi.fn();
const mockFindOpenStartBefore = vi.fn();
const mockLastDoorStateBefore = vi.fn();
vi.mock("./db/doors", () => ({
  savedSessionKeysSince: (...a: unknown[]) => mockSavedSessionKeysSince(...a),
  insertDoorSessions: (...a: unknown[]) => mockInsertDoorSessions(...a),
  findOpenStartBefore: (...a: unknown[]) => mockFindOpenStartBefore(...a),
  lastDoorStateBefore: (...a: unknown[]) => mockLastDoorStateBefore(...a),
  listDoorEvents: vi.fn(),
}));

/** Every row handed to insertDoorSessions (an empty batch saves nothing). */
function savedRows(): unknown[] {
  return mockInsertDoorSessions.mock.calls.flatMap((call) => call[0] as unknown[]);
}

const NOW = Date.parse("2026-10-29T12:00:00Z");

beforeEach(() => {
  mockFetchRecentBoolReadings.mockReset();
  mockSavedSessionKeysSince.mockReset().mockResolvedValue([]);
  mockInsertDoorSessions.mockReset().mockResolvedValue(undefined);
  mockFindOpenStartBefore.mockReset().mockResolvedValue(null);
  mockLastDoorStateBefore.mockReset().mockResolvedValue(null);
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
    expect(mockInsertDoorSessions).toHaveBeenCalledWith([
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
    mockSavedSessionKeysSince.mockResolvedValue([{ label: "Garage door", opened_at: "2026-10-29T10:00:00Z" }]);
    const { recordDoorSessions } = await import("./doorEvents");

    await recordDoorSessions("hh-1", [{ id: "door-1", label: "Garage door" }], NOW);

    expect(savedRows()).toEqual([]);
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
    expect(savedRows()).toEqual([]);
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
    mockInsertDoorSessions.mockRejectedValue(new Error("db down"));
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
    mockFindOpenStartBefore.mockResolvedValue("2026-10-26T08:00:00+00:00");
    const { recordDoorSessions } = await import("./doorEvents");

    await recordDoorSessions("hh-1", [{ id: "door-1", label: "Garage door" }], NOW);

    expect(mockFindOpenStartBefore).toHaveBeenCalledWith("door-1", "2026-10-28T12:00:00Z");
    expect(mockInsertDoorSessions).toHaveBeenCalledWith([
      expect.objectContaining({
        opened_at: "2026-10-26T08:00:00+00:00",
        closed_at: "2026-10-29T11:00:00Z",
        duration_ms: Date.parse("2026-10-29T11:00:00Z") - Date.parse("2026-10-26T08:00:00Z"),
      }),
    ]);
    // Duplicate check reaches back to that start, not just 48 h.
    expect(mockSavedSessionKeysSince).toHaveBeenCalledWith("hh-1", "2026-10-26T08:00:00.000Z");
  });

  it("doesn't save the long session again on the next minute's 'closed' report", async () => {
    mockFetchRecentBoolReadings.mockResolvedValue([
      { value: true, recordedAt: "2026-10-28T12:01:00Z" },
      { value: false, recordedAt: "2026-10-29T11:00:00Z" },
      { value: false, recordedAt: "2026-10-29T11:01:00Z" },
    ]);
    mockFindOpenStartBefore.mockResolvedValue("2026-10-26T08:00:00+00:00");
    mockSavedSessionKeysSince.mockResolvedValue([{ label: "Garage door", opened_at: "2026-10-26T08:00:00+00:00" }]);
    const { recordDoorSessions } = await import("./doorEvents");

    await recordDoorSessions("hh-1", [{ id: "door-1", label: "Garage door" }], NOW);

    expect(savedRows()).toEqual([]);
  });

  it("looks no further back when the window starts with the door closed", async () => {
    mockFetchRecentBoolReadings.mockResolvedValue([
      { value: false, recordedAt: "2026-10-28T12:00:00Z" },
      { value: true, recordedAt: "2026-10-29T10:00:00Z" },
      { value: false, recordedAt: "2026-10-29T10:20:00Z" },
    ]);
    const { recordDoorSessions } = await import("./doorEvents");

    await recordDoorSessions("hh-1", [{ id: "door-1", label: "Garage door" }], NOW);

    expect(mockFindOpenStartBefore).not.toHaveBeenCalled();
    expect(mockInsertDoorSessions).toHaveBeenCalledWith([expect.objectContaining({ opened_at: "2026-10-29T10:00:00Z" })]);
  });

  describe("recordDoorSessionsIfJustClosed", () => {
    const session = [
      { value: true, recordedAt: "2026-10-29T10:00:00Z" },
      { value: false, recordedAt: "2026-10-29T10:20:00Z" },
    ];

    it("saves when the previous report was open", async () => {
      mockLastDoorStateBefore.mockResolvedValue(true);
      mockFetchRecentBoolReadings.mockResolvedValue(session);
      const { recordDoorSessionsIfJustClosed } = await import("./doorEvents");

      await recordDoorSessionsIfJustClosed("hh-1", [{ id: "door-1", label: "Garage door" }], "2026-10-29T10:20:00Z");

      expect(mockLastDoorStateBefore).toHaveBeenCalledWith("door-1", "2026-10-29T10:20:00Z");
      expect(savedRows()).toHaveLength(1);
    });

    it("does nothing more on a repeated 'closed' report", async () => {
      mockLastDoorStateBefore.mockResolvedValue(false);
      const { recordDoorSessionsIfJustClosed } = await import("./doorEvents");

      await recordDoorSessionsIfJustClosed("hh-1", [{ id: "door-1", label: "Garage door" }], "2026-10-29T10:21:00Z");

      expect(mockFetchRecentBoolReadings).not.toHaveBeenCalled();
      expect(savedRows()).toEqual([]);
    });

    it("still saves when there is no earlier reading to compare with", async () => {
      mockFetchRecentBoolReadings.mockResolvedValue(session);
      const { recordDoorSessionsIfJustClosed } = await import("./doorEvents");

      await recordDoorSessionsIfJustClosed("hh-1", [{ id: "door-1", label: "Garage door" }], "2026-10-29T10:20:00Z");

      expect(mockFetchRecentBoolReadings).toHaveBeenCalledTimes(1);
    });
  });

  describe("lookup failures", () => {
    const session = [
      { value: true, recordedAt: "2026-10-29T10:00:00Z" },
      { value: false, recordedAt: "2026-10-29T10:20:00Z" },
    ];

    it("reports a failed duplicate check instead of saving blind", async () => {
      mockFetchRecentBoolReadings.mockResolvedValue(session);
      mockSavedSessionKeysSince.mockRejectedValue(new Error("timeout"));
      const { recordDoorSessions } = await import("./doorEvents");
      await expect(recordDoorSessions("hh-1", [{ id: "door-1", label: "Garage door" }], NOW)).rejects.toThrow(
        "door_open_events fetch failed: timeout",
      );
      expect(mockInsertDoorSessions).not.toHaveBeenCalled();
    });

    it("reports a failed open-start lookup", async () => {
      mockFetchRecentBoolReadings.mockResolvedValue([{ value: true, recordedAt: "2026-10-28T12:00:00Z" }]);
      mockFindOpenStartBefore.mockRejectedValue(new Error("timeout"));
      const { recordDoorSessions } = await import("./doorEvents");
      await expect(recordDoorSessions("hh-1", [{ id: "door-1", label: "Garage door" }], NOW)).rejects.toThrow(
        "door open-start lookup failed: timeout",
      );
    });

    it("reports a failed last-state lookup", async () => {
      mockLastDoorStateBefore.mockRejectedValue(new Error("timeout"));
      const { recordDoorSessionsIfJustClosed } = await import("./doorEvents");
      await expect(
        recordDoorSessionsIfJustClosed("hh-1", [{ id: "door-1", label: "Garage door" }], "2026-10-29T10:20:00Z"),
      ).rejects.toThrow("last door state lookup failed: timeout");
    });
  });
});
