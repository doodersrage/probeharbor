import { beforeEach, describe, expect, it, vi } from "vitest";
import type { FeedHealthStatus } from "./collectHistory";

const jobs = vi.hoisted(() => ({
  insertFeedUptimeChecks: vi.fn(),
  /** Last successful check for a feed (null when never reachable). */
  lastOkFeedCheckAt: vi.fn(),
  markFeedUptimeAlert: vi.fn(),
}));
vi.mock("./db/jobs", () => jobs);

vi.mock("./userRecords", () => ({ getUserRecord: async () => null }));

const mockCheckFeedHealth = vi.fn();
vi.mock("./collectHistory", () => ({
  checkFeedHealth: (...a: unknown[]) => mockCheckFeedHealth(...a),
}));

const mockGetAlertSettingsForUser = vi.fn();
const mockNotifyUser = vi.fn();
vi.mock("./notify", () => ({
  getAlertSettingsForUser: (...a: unknown[]) => mockGetAlertSettingsForUser(...a),
  notifyUser: (...a: unknown[]) => mockNotifyUser(...a),
}));

const mockListAllHouseholdOwnerUserIds = vi.fn();
vi.mock("./households", () => ({
  listAllHouseholdOwnerUserIds: (...a: unknown[]) => mockListAllHouseholdOwnerUserIds(...a),
}));

function status(overrides: Partial<FeedHealthStatus> = {}): FeedHealthStatus {
  return {
    feedId: "feed-1",
    feedName: "Garage",
    url: "https://example.com/feed",
    ok: true,
    message: "ok",
    probeCount: 2,
    checkedAt: "2024-01-01T00:00:00.000Z",
    ...overrides,
  };
}

beforeEach(() => {
  jobs.insertFeedUptimeChecks.mockReset().mockResolvedValue(undefined);
  jobs.lastOkFeedCheckAt.mockReset().mockResolvedValue(null);
  jobs.markFeedUptimeAlert.mockReset().mockResolvedValue(undefined);
  mockCheckFeedHealth.mockReset().mockResolvedValue({ statuses: [], error: null });
  mockGetAlertSettingsForUser.mockReset().mockResolvedValue({
    feedUptimeAlertsEnabled: true,
    lastFeedUptimeAlertAt: null,
    email: "user@example.com",
  });
  mockNotifyUser.mockReset().mockResolvedValue(undefined);
  mockListAllHouseholdOwnerUserIds.mockReset().mockResolvedValue([]);
});

describe("storeFeedUptimeChecks", () => {
  it("does nothing for an empty status list", async () => {
    const { storeFeedUptimeChecks } = await import("./feedUptimeMonitor");

    await storeFeedUptimeChecks("user-1", []);

    expect(jobs.insertFeedUptimeChecks).not.toHaveBeenCalled();
  });

  it("maps statuses into insertable rows", async () => {
    const { storeFeedUptimeChecks } = await import("./feedUptimeMonitor");

    await storeFeedUptimeChecks("user-1", [
      status({ feedId: "f1", feedName: "Garage", ok: false, message: "timeout" }),
    ]);

    expect(jobs.insertFeedUptimeChecks).toHaveBeenCalledWith([
      {
        user_id: "user-1",
        feed_id: "f1",
        feed_name: "Garage",
        url: "https://example.com/feed",
        ok: false,
        message: "timeout",
        latency_ms: null,
        checked_at: "2024-01-01T00:00:00.000Z",
      },
    ]);
  });
});

describe("runFeedUptimeForAllUsers", () => {
  it("records a health-check error and moves on without storing or counting", async () => {
    mockListAllHouseholdOwnerUserIds.mockResolvedValue(["u1"]);
    mockCheckFeedHealth.mockResolvedValue({ statuses: [], error: "no devices" });
    const { runFeedUptimeForAllUsers } = await import("./feedUptimeMonitor");

    const result = await runFeedUptimeForAllUsers();

    expect(result).toEqual({ checked: 0, failed: 0, alertsSent: 0, errors: ["u1: no devices"] });
    expect(jobs.insertFeedUptimeChecks).not.toHaveBeenCalled();
  });

  it("counts checked/failed and skips notifying when everything is healthy", async () => {
    mockListAllHouseholdOwnerUserIds.mockResolvedValue(["u1"]);
    mockCheckFeedHealth.mockResolvedValue({
      statuses: [status({ ok: true }), status({ feedId: "f2", ok: true })],
      error: null,
    });
    const { runFeedUptimeForAllUsers } = await import("./feedUptimeMonitor");

    const result = await runFeedUptimeForAllUsers();

    expect(result).toEqual({ checked: 2, failed: 0, alertsSent: 0, errors: [] });
    expect(mockGetAlertSettingsForUser).not.toHaveBeenCalled();
  });

  it("skips notifying when feed uptime alerts are disabled", async () => {
    mockListAllHouseholdOwnerUserIds.mockResolvedValue(["u1"]);
    mockCheckFeedHealth.mockResolvedValue({
      statuses: [status({ ok: false, message: "timeout" })],
      error: null,
    });
    mockGetAlertSettingsForUser.mockResolvedValue({ feedUptimeAlertsEnabled: false });
    const { runFeedUptimeForAllUsers } = await import("./feedUptimeMonitor");

    const result = await runFeedUptimeForAllUsers();

    expect(result).toEqual({ checked: 1, failed: 1, alertsSent: 0, errors: [] });
    expect(mockNotifyUser).not.toHaveBeenCalled();
  });

  it("skips notifying while still within the 4-hour cooldown", async () => {
    mockListAllHouseholdOwnerUserIds.mockResolvedValue(["u1"]);
    mockCheckFeedHealth.mockResolvedValue({
      statuses: [status({ ok: false })],
      error: null,
    });
    mockGetAlertSettingsForUser.mockResolvedValue({
      feedUptimeAlertsEnabled: true,
      lastFeedUptimeAlertAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    });
    const { runFeedUptimeForAllUsers } = await import("./feedUptimeMonitor");

    await runFeedUptimeForAllUsers();

    expect(mockNotifyUser).not.toHaveBeenCalled();
  });

  it("notifies after the cooldown, builds the digest body, and marks the alert timestamp", async () => {
    mockListAllHouseholdOwnerUserIds.mockResolvedValue(["u1"]);
    mockCheckFeedHealth.mockResolvedValue({
      statuses: [
        status({ feedName: "Garage", ok: false, message: "timeout" }),
        status({ feedId: "f2", feedName: "Attic", ok: false, message: "503" }),
        status({ feedId: "f3", feedName: "Basement", ok: true }),
      ],
      error: null,
    });
    // Both feeds were reachable an hour ago, after the previous alert: new outages.
    jobs.lastOkFeedCheckAt.mockResolvedValue(new Date(Date.now() - 60 * 60 * 1000).toISOString());
    mockGetAlertSettingsForUser.mockResolvedValue({
      feedUptimeAlertsEnabled: true,
      lastFeedUptimeAlertAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      email: "user@example.com",
    });
    const { runFeedUptimeForAllUsers } = await import("./feedUptimeMonitor");

    const result = await runFeedUptimeForAllUsers();

    expect(mockNotifyUser).toHaveBeenCalledWith(
      "u1",
      "user@example.com",
      expect.objectContaining({ feedUptimeAlertsEnabled: true }),
      {
        title: "Feed unreachable",
        body: "Garage: timeout\nAttic: 503",
        kind: "outage",
      },
    );
    expect(jobs.lastOkFeedCheckAt).toHaveBeenCalledWith("u1", "feed-1");
    expect(jobs.lastOkFeedCheckAt).toHaveBeenCalledWith("u1", "f2");
    expect(jobs.markFeedUptimeAlert).toHaveBeenCalledWith("u1");
    expect(result).toEqual({ checked: 3, failed: 2, alertsSent: 1, errors: [] });
  });

  it("notifies immediately when there is no prior alert timestamp", async () => {
    mockListAllHouseholdOwnerUserIds.mockResolvedValue(["u1"]);
    mockCheckFeedHealth.mockResolvedValue({
      statuses: [status({ ok: false })],
      error: null,
    });
    mockGetAlertSettingsForUser.mockResolvedValue({
      feedUptimeAlertsEnabled: true,
      lastFeedUptimeAlertAt: null,
      email: "user@example.com",
    });
    const { runFeedUptimeForAllUsers } = await import("./feedUptimeMonitor");

    await runFeedUptimeForAllUsers();

    expect(mockNotifyUser).toHaveBeenCalled();
  });

  it("records but never alerts on the demo (example) feed being down", async () => {
    mockListAllHouseholdOwnerUserIds.mockResolvedValue(["u1"]);
    mockCheckFeedHealth.mockResolvedValue({
      statuses: [status({ ok: false, url: "https://probeharbor.com/api/feeds/example", feedName: "Demo" })],
      error: null,
    });
    const { runFeedUptimeForAllUsers } = await import("./feedUptimeMonitor");

    const result = await runFeedUptimeForAllUsers();

    expect(result).toMatchObject({ checked: 1, failed: 1, alertsSent: 0 });
    expect(mockNotifyUser).not.toHaveBeenCalled();
  });

  it("does not re-alert for a feed that has stayed down since the last alert", async () => {
    mockListAllHouseholdOwnerUserIds.mockResolvedValue(["u1"]);
    mockCheckFeedHealth.mockResolvedValue({
      statuses: [status({ ok: false, message: "timeout" })],
      error: null,
    });
    // Last reachable 3 days ago; already reported by the alert 5 hours ago.
    jobs.lastOkFeedCheckAt.mockResolvedValue(new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString());
    mockGetAlertSettingsForUser.mockResolvedValue({
      feedUptimeAlertsEnabled: true,
      lastFeedUptimeAlertAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      email: "user@example.com",
    });
    const { runFeedUptimeForAllUsers } = await import("./feedUptimeMonitor");

    const result = await runFeedUptimeForAllUsers();

    expect(mockNotifyUser).not.toHaveBeenCalled();
    expect(jobs.markFeedUptimeAlert).not.toHaveBeenCalled();
    expect(result.alertsSent).toBe(0);
  });

  it("truncates a very long digest body to 1500 characters", async () => {
    mockListAllHouseholdOwnerUserIds.mockResolvedValue(["u1"]);
    const longMessage = "x".repeat(2000);
    mockCheckFeedHealth.mockResolvedValue({
      statuses: [status({ ok: false, message: longMessage })],
      error: null,
    });
    const { runFeedUptimeForAllUsers } = await import("./feedUptimeMonitor");

    await runFeedUptimeForAllUsers();

    const call = mockNotifyUser.mock.calls[0]!;
    expect((call[3] as { body: string }).body).toHaveLength(1500);
  });

  it("isolates a per-user error without stopping the batch", async () => {
    mockListAllHouseholdOwnerUserIds.mockResolvedValue(["u1", "u2"]);
    mockCheckFeedHealth.mockImplementation(async (userId: string) => {
      if (userId === "u1") throw new Error("boom");
      return { statuses: [], error: null };
    });
    const { runFeedUptimeForAllUsers } = await import("./feedUptimeMonitor");

    const result = await runFeedUptimeForAllUsers();

    expect(result.errors).toEqual(["u1: boom"]);
    expect(result.checked).toBe(0);
  });

  it("uses a generic message for a non-Error throw", async () => {
    mockListAllHouseholdOwnerUserIds.mockResolvedValue(["u1"]);
    mockCheckFeedHealth.mockRejectedValue("nope");
    const { runFeedUptimeForAllUsers } = await import("./feedUptimeMonitor");

    const result = await runFeedUptimeForAllUsers();

    expect(result.errors).toEqual(["u1: Unknown error"]);
  });
});

describe("isNewFeedOutage", () => {
  const alertAt = "2026-01-10T12:00:00.000Z";

  it("treats any outage as new before the first feed alert", async () => {
    const { isNewFeedOutage } = await import("./feedUptimeMonitor");
    expect(isNewFeedOutage(null, null)).toBe(true);
    expect(isNewFeedOutage("2025-01-01T00:00:00.000Z", null)).toBe(true);
  });

  it("is new only when the feed was reachable after the last alert", async () => {
    const { isNewFeedOutage } = await import("./feedUptimeMonitor");
    expect(isNewFeedOutage("2026-01-10T13:00:00.000Z", alertAt)).toBe(true);
    expect(isNewFeedOutage("2026-01-10T11:00:00.000Z", alertAt)).toBe(false);
    expect(isNewFeedOutage(null, alertAt)).toBe(false);
  });
});
