import { beforeEach, describe, expect, it, vi } from "vitest";
import type { APIContext } from "astro";

const mockGetAuthFromCookies = vi.fn();
vi.mock("../../../lib/auth", () => ({
  getAuthFromCookies: (...a: unknown[]) => mockGetAuthFromCookies(...a),
}));

const mockComputeDoorOpenSessions = vi.fn();
vi.mock("../../../lib/doorDuration", () => ({
  computeDoorOpenSessions: (...a: unknown[]) => mockComputeDoorOpenSessions(...a),
}));

const mockListDoorEvents = vi.fn();
vi.mock("../../../lib/doorEvents", () => ({
  listDoorEvents: (...a: unknown[]) => mockListDoorEvents(...a),
}));

const mockListHouseholdDevices = vi.fn();
vi.mock("../../../lib/devices", () => ({
  listHouseholdDevices: (...a: unknown[]) => mockListHouseholdDevices(...a),
}));

const mockGetOrCreateHouseholdForUser = vi.fn();
vi.mock("../../../lib/households", () => ({
  getOrCreateHouseholdForUser: (...a: unknown[]) => mockGetOrCreateHouseholdForUser(...a),
}));

const mockListDoorEventsForReport = vi.fn();
vi.mock("../../../lib/doorEventReport", () => ({
  DOOR_REPORT_LIMIT: 500,
  listDoorEventsForReport: (...a: unknown[]) => mockListDoorEventsForReport(...a),
}));

const mockGetUserEntitlements = vi.fn();
vi.mock("../../../lib/entitlements", () => ({
  getUserEntitlements: (...a: unknown[]) => mockGetUserEntitlements(...a),
}));

const mockFetchRecentBoolReadings = vi.fn();
vi.mock("../../../lib/sensorReadings", () => ({
  fetchRecentBoolReadings: (...a: unknown[]) => mockFetchRecentBoolReadings(...a),
}));

function makeContext(search = "", timeZone?: string): APIContext {
  return {
    cookies: { get: (name: string) => (name === "ph_tz" && timeZone ? { value: timeZone } : undefined) },
    url: new URL(`https://example.com/api/user/door-events${search}`),
  } as unknown as APIContext;
}

beforeEach(() => {
  mockGetAuthFromCookies.mockReset().mockResolvedValue({
    session: { access_token: "tok" },
    user: { id: "user-1", email: "user@example.com" },
  });
  mockGetOrCreateHouseholdForUser.mockReset().mockResolvedValue({ householdId: "house-1" });
  mockListHouseholdDevices.mockReset().mockResolvedValue({ devices: [] });
  mockListDoorEvents.mockReset().mockResolvedValue([]);
  mockFetchRecentBoolReadings.mockReset().mockResolvedValue([]);
  mockComputeDoorOpenSessions.mockReset().mockReturnValue([]);
  mockListDoorEventsForReport.mockReset().mockResolvedValue({ events: [], truncated: false, error: null });
  mockGetUserEntitlements.mockReset().mockResolvedValue({ historyDays: 3650 });
});

describe("GET /api/user/door-events", () => {
  it("returns 401 when not authenticated", async () => {
    mockGetAuthFromCookies.mockResolvedValue({ session: null, user: null });
    const { GET } = await import("./door-events");

    const response = await GET(makeContext());

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: "Unauthorized" });
  });

  it("returns empty results when the user has no household", async () => {
    mockGetOrCreateHouseholdForUser.mockResolvedValue({ householdId: null });
    const { GET } = await import("./door-events");

    const response = await GET(makeContext());

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ live_sessions: [], history: [] });
    expect(mockListHouseholdDevices).not.toHaveBeenCalled();
  });

  it("defaults the limit to 12 and clamps out-of-range values", async () => {
    const { GET } = await import("./door-events");

    await GET(makeContext());
    expect(mockListDoorEvents).toHaveBeenCalledWith("house-1", 12);

    await GET(makeContext("?limit=500"));
    expect(mockListDoorEvents).toHaveBeenCalledWith("house-1", 50);

    await GET(makeContext("?limit=0"));
    expect(mockListDoorEvents).toHaveBeenCalledWith("house-1", 1);

    await GET(makeContext("?limit=not-a-number"));
    expect(mockListDoorEvents).toHaveBeenCalledWith("house-1", 12);
  });

  it("builds live sessions only from door-kind sensors", async () => {
    mockListHouseholdDevices.mockResolvedValue({
      devices: [
        {
          id: "device-1",
          sensors: [
            { id: "door-sensor", kind: "door", label: "Garage Door" },
            { id: "temp-sensor", kind: "temperature", label: "Garage Temp" },
          ],
        },
      ],
    });
    mockFetchRecentBoolReadings.mockResolvedValue([
      { value: true, recordedAt: "2024-01-01T00:00:00Z" },
    ]);
    mockComputeDoorOpenSessions.mockReturnValue([
      {
        label: "Garage Door",
        openedAt: "2024-01-01T00:00:00Z",
        closedAt: null,
        durationMs: null,
        stillOpen: true,
      },
    ]);
    const { GET } = await import("./door-events");

    const response = await GET(makeContext());
    const json = await response.json();

    expect(mockFetchRecentBoolReadings).toHaveBeenCalledTimes(1);
    expect(mockFetchRecentBoolReadings).toHaveBeenCalledWith(
      "door-sensor",
      expect.any(String),
    );
    expect(json).toEqual({
      live_sessions: [
        {
          label: "Garage Door",
          opened_at: "2024-01-01T00:00:00Z",
          closed_at: null,
          duration_ms: null,
          still_open: true,
        },
      ],
      history: [],
    });
  });

  it("maps history events into the response shape", async () => {
    mockListDoorEvents.mockResolvedValue([
      {
        id: "evt-1",
        label: "Garage Door",
        opened_at: "2024-01-01T00:00:00Z",
        closed_at: "2024-01-01T00:05:00Z",
        duration_ms: 300000,
      },
    ]);
    const { GET } = await import("./door-events");

    const json = (await (await GET(makeContext())).json()) as Record<string, unknown>;

    expect(json.history).toEqual([
      {
        id: "evt-1",
        label: "Garage Door",
        opened_at: "2024-01-01T00:00:00Z",
        closed_at: "2024-01-01T00:05:00Z",
        duration_ms: 300000,
      },
    ]);
  });

  it("sets a no-store cache control header", async () => {
    const { GET } = await import("./door-events");

    const response = await GET(makeContext());

    expect(response.headers.get("Cache-Control")).toBe("no-store");
  });

  describe("date range", () => {
    it("returns openings that started in a range of whole days (browser zone), newest first", async () => {
      mockListDoorEventsForReport.mockResolvedValue({
        events: [
          {
            id: "evt-2",
            sensorId: "door-1",
            label: "Garage door",
            openedAt: "2026-10-03T12:00:00Z",
            closedAt: "2026-10-03T12:10:00Z",
            durationMs: 600000,
          },
        ],
        truncated: false,
        error: null,
      });
      const { GET } = await import("./door-events");

      const json = (await (await GET(makeContext("?from=2026-10-01&to=2026-10-05", "America/New_York"))).json()) as Record<
        string,
        unknown
      >;

      expect(mockListDoorEvents).not.toHaveBeenCalled();
      expect(mockListDoorEventsForReport).toHaveBeenCalledWith(
        "house-1",
        "2026-10-01T04:00:00.000Z",
        "2026-10-06T03:59:59.999Z",
        100,
      );
      expect(json.range).toEqual({ from: "2026-10-01T04:00:00.000Z", to: "2026-10-06T03:59:59.999Z" });
      expect(json.truncated).toBe(false);
      expect(json.history).toEqual([
        {
          id: "evt-2",
          label: "Garage door",
          opened_at: "2026-10-03T12:00:00Z",
          closed_at: "2026-10-03T12:10:00Z",
          duration_ms: 600000,
        },
      ]);
    });

    it("accepts full timestamps, only `from`, and limits up to 500", async () => {
      const { GET } = await import("./door-events");

      await GET(makeContext("?from=2026-10-01T06:30:00Z&limit=9999"));

      const [, from, to, limit] = mockListDoorEventsForReport.mock.calls[0]!;
      expect(from).toBe("2026-10-01T06:30:00.000Z");
      expect(Date.parse(to as string)).toBeGreaterThan(Date.now() - 60000);
      expect(limit).toBe(500);
    });

    it("never starts before the plan's history window", async () => {
      mockGetUserEntitlements.mockResolvedValue({ historyDays: 7 });
      const { GET } = await import("./door-events");

      await GET(makeContext("?from=2020-01-01"));

      const from = mockListDoorEventsForReport.mock.calls[0]![1] as string;
      expect(Date.parse(from)).toBeGreaterThan(Date.now() - 8 * 24 * 60 * 60 * 1000);
    });

    it("says so when there are more openings than the limit", async () => {
      mockListDoorEventsForReport.mockResolvedValue({ events: [], truncated: true, error: null });
      const { GET } = await import("./door-events");
      const json = (await (await GET(makeContext("?from=2026-10-01"))).json()) as Record<string, unknown>;
      expect(json.truncated).toBe(true);
    });

    it("answers 400 for a date it can't read, or from after to", async () => {
      const { GET } = await import("./door-events");

      const bad = await GET(makeContext("?from=last-tuesday"));
      expect(bad.status).toBe(400);
      expect(((await bad.json()) as { error: string }).error).toContain("YYYY-MM-DD");

      const backwards = await GET(makeContext("?from=2026-10-05&to=2026-10-01"));
      expect(backwards.status).toBe(400);
      expect(mockListDoorEventsForReport).not.toHaveBeenCalled();
    });

    it("answers 500 instead of an empty list when the query fails", async () => {
      mockListDoorEventsForReport.mockResolvedValue({ events: [], truncated: false, error: "timeout" });
      const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      const { GET } = await import("./door-events");

      const response = await GET(makeContext("?from=2026-10-01"));

      expect(response.status).toBe(500);
      errorSpy.mockRestore();
    });
  });
});
