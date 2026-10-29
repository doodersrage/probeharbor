import { beforeEach, describe, expect, it, vi } from "vitest";
import type { APIContext } from "astro";

const mockGetAuthFromCookies = vi.fn();
vi.mock("../../../lib/auth", () => ({
  getAuthFromCookies: (...a: unknown[]) => mockGetAuthFromCookies(...a),
}));

const mockGetUserEntitlements = vi.fn();
vi.mock("../../../lib/entitlements", () => ({
  getUserEntitlements: (...a: unknown[]) => mockGetUserEntitlements(...a),
}));

const mockGetOrCreateHouseholdForUser = vi.fn();
vi.mock("../../../lib/households", () => ({
  getOrCreateHouseholdForUser: (...a: unknown[]) => mockGetOrCreateHouseholdForUser(...a),
}));

const mockListHouseholdDevices = vi.fn();
vi.mock("../../../lib/devices", () => ({
  listHouseholdDevices: (...a: unknown[]) => mockListHouseholdDevices(...a),
}));

const mockLoadDoorReport = vi.fn();
vi.mock("../../../lib/doorEventReport", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../../lib/doorEventReport")>();
  return { ...actual, loadDoorReport: (...a: unknown[]) => mockLoadDoorReport(...a) };
});

function makeContext(query: string, timeZone?: string): APIContext {
  const url = new URL(`https://example.com/api/door-events/export.csv${query}`);
  const cookies = { get: (name: string) => (name === "ph_tz" && timeZone ? { value: timeZone } : undefined) };
  return { url, cookies, locals: {} } as unknown as APIContext;
}

const row = {
  id: "ev-1",
  sensorId: "door-1",
  label: "Garage door",
  openedAt: "2026-10-29T10:00:00.000Z",
  closedAt: "2026-10-29T10:20:00.000Z",
  durationMs: 20 * 60 * 1000,
  temperatureSensor: { id: "t-1", label: "Bay", offset: 0, match: "device" },
  humiditySensor: null,
  temperature: { atOpen: 50, atClose: 44, change: -6 },
  humidity: { atOpen: null, atClose: null, change: null },
};

beforeEach(() => {
  mockGetAuthFromCookies.mockReset().mockResolvedValue({ session: { access_token: "t" }, user: { id: "user-1", email: "a@example.com" } });
  mockGetUserEntitlements.mockReset().mockResolvedValue({ canDownloadCsv: true, historyDays: 365 });
  mockGetOrCreateHouseholdForUser.mockReset().mockResolvedValue({ householdId: "hh-1" });
  mockListHouseholdDevices.mockReset().mockResolvedValue({ devices: [{ id: "esp" }] });
  mockLoadDoorReport.mockReset().mockResolvedValue({ rows: [row], truncated: false, error: null, readingsError: null });
});

describe("GET /api/door-events/export.csv", () => {
  it("returns 401 when not signed in", async () => {
    mockGetAuthFromCookies.mockResolvedValue({ session: null, user: null });
    const { GET } = await import("./export.csv");
    expect((await GET(makeContext(""))).status).toBe(401);
  });

  it("returns 403 without CSV access, before reading any household data", async () => {
    mockGetUserEntitlements.mockResolvedValue({ canDownloadCsv: false, historyDays: 7 });
    const { GET } = await import("./export.csv");
    const response = await GET(makeContext(""));
    expect(response.status).toBe(403);
    expect(mockLoadDoorReport).not.toHaveBeenCalled();
  });

  it("exports the household's door events for whole days in the browser's zone", async () => {
    const { GET } = await import("./export.csv");

    const response = await GET(makeContext("?from=2026-10-01&to=2026-10-05", "America/New_York"));

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("text/csv; charset=utf-8");
    expect(response.headers.get("Content-Disposition")).toMatch(/probeharbor-door-events-\d{4}-\d{2}-\d{2}\.csv/);
    expect(mockLoadDoorReport).toHaveBeenCalledWith(
      "hh-1",
      [{ id: "esp" }],
      "2026-10-01T04:00:00.000Z",
      "2026-10-06T03:59:59.999Z",
      5000,
    );
    const body = await response.text();
    expect(body.split("\n")[1]).toBe(
      "Garage door,2026-10-29T10:00:00.000Z,2026-10-29T10:20:00.000Z,20.0,Bay,device,50.0,44.0,-6.0,,,,,",
    );
  });

  it("refuses a partial file when there are more openings than one CSV holds", async () => {
    mockLoadDoorReport.mockResolvedValue({ rows: [row], truncated: true, error: null, readingsError: null });
    const { GET } = await import("./export.csv");
    const response = await GET(makeContext(""));
    expect(response.status).toBe(422);
    expect(await response.text()).toContain("Pick fewer days");
  });

  it("returns just the header row when the user has no household", async () => {
    mockGetOrCreateHouseholdForUser.mockResolvedValue({ householdId: null });
    const { GET } = await import("./export.csv");
    const response = await GET(makeContext(""));
    expect(response.status).toBe(200);
    expect((await response.text()).split("\n")).toHaveLength(1);
  });

  it("answers 500 instead of an empty-looking file when events or readings fail to load", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { GET } = await import("./export.csv");

    mockLoadDoorReport.mockResolvedValueOnce({ rows: [], truncated: false, error: "db down", readingsError: null });
    expect((await GET(makeContext(""))).status).toBe(500);

    mockLoadDoorReport.mockResolvedValueOnce({ rows: [row], truncated: false, error: null, readingsError: "rpc missing" });
    expect((await GET(makeContext(""))).status).toBe(500);

    errorSpy.mockRestore();
  });
});
