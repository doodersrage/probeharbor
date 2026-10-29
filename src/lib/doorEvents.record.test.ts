import { beforeEach, describe, expect, it, vi } from "vitest";

const mockFetchRecentBoolReadings = vi.fn();
vi.mock("./sensorReadings", () => ({
  fetchRecentBoolReadings: (...a: unknown[]) => mockFetchRecentBoolReadings(...a),
}));

const mockRecentSelect = vi.fn();
const mockInsert = vi.fn();
vi.mock("./supabase", () => ({
  createServerClient: () => ({
    from: () => ({
      select: () => ({
        eq: () => ({ gte: () => mockRecentSelect() }),
      }),
      insert: (rows: unknown) => mockInsert(rows),
    }),
  }),
}));

const NOW = Date.parse("2026-10-29T12:00:00Z");

beforeEach(() => {
  mockFetchRecentBoolReadings.mockReset();
  mockRecentSelect.mockReset().mockResolvedValue({ data: [], error: null });
  mockInsert.mockReset().mockResolvedValue({ error: null });
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
});
