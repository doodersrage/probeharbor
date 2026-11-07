import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AlertEventRow } from "./alertEvents";
import { SAFETY_ALERT_KINDS } from "./alertDeliveryState";

const neon = vi.hoisted(() => ({
  acknowledgeLatestUnackedAlert: vi.fn(),
  autoResolveAlerts: vi.fn(),
  listRecentAlertEventsFiltered: vi.fn(),
  countUnacknowledgedAlerts: vi.fn(),
}));
vi.mock("./db/alertEvents", () => neon);

function row(overrides: Partial<AlertEventRow> = {}): AlertEventRow {
  return {
    id: 1,
    user_id: "user-1",
    kind: "freeze",
    title: "Freeze warning",
    body: "Garage is freezing",
    channels_sent: ["email"],
    channels_skipped: [],
    created_at: "2024-01-01T00:00:00.000Z",
    acknowledged_at: null,
    meta: {},
    ...overrides,
  };
}

beforeEach(() => {
  for (const fn of Object.values(neon)) fn.mockReset();
});

describe("acknowledgeLatestUnackedAlert", () => {
  it("passes the unhandled rule's kinds and the localized 'none' message", async () => {
    neon.acknowledgeLatestUnackedAlert.mockResolvedValue({ ok: false, error: "No unhandled alerts." });
    const { acknowledgeLatestUnackedAlert, INFORMATIONAL_ALERT_KINDS } = await import("./alertEvents");

    const result = await acknowledgeLatestUnackedAlert("user-1");

    expect(result).toEqual({ ok: false, error: "No unhandled alerts." });
    expect(neon.acknowledgeLatestUnackedAlert).toHaveBeenCalledWith(
      "user-1",
      INFORMATIONAL_ALERT_KINDS,
      SAFETY_ALERT_KINDS,
      "No unhandled alerts.",
    );
  });
});

describe("autoResolveAlerts", () => {
  it("turns olderThanMs into a cutoff time and defaults the reason to recovered", async () => {
    neon.autoResolveAlerts.mockResolvedValue({ resolved: 0, channels: [] });
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-01-02T00:00:00.000Z"));
    try {
      const { autoResolveAlerts } = await import("./alertEvents");
      await autoResolveAlerts("user-1", { kinds: ["freeze"], olderThanMs: 3_600_000 });
      await autoResolveAlerts("user-1");
    } finally {
      vi.useRealTimers();
    }

    expect(neon.autoResolveAlerts.mock.calls[0]?.[3]).toEqual({
      kinds: ["freeze"],
      olderThanIso: "2024-01-01T23:00:00.000Z",
      reason: "recovered",
    });
    expect(neon.autoResolveAlerts.mock.calls[1]?.[3]).toEqual({
      kinds: undefined,
      olderThanIso: undefined,
      reason: "recovered",
    });
  });
});

describe("listRecentAlertEventsFiltered", () => {
  it("clamps limit and offset and passes exact kinds through", async () => {
    neon.listRecentAlertEventsFiltered.mockResolvedValue({ events: [row({ kind: "threshold" })], hasMore: false });
    const { listRecentAlertEventsFiltered } = await import("./alertEvents");

    const result = await listRecentAlertEventsFiltered("user-1", { limit: 500, offset: -3, kinds: ["threshold", "freeze"] });
    await listRecentAlertEventsFiltered("user-1", { limit: 0 });

    expect(result.events).toHaveLength(1);
    expect(neon.listRecentAlertEventsFiltered.mock.calls[0]?.[3]).toMatchObject({
      limit: 50,
      offset: 0,
      kinds: ["threshold", "freeze"],
    });
    expect(neon.listRecentAlertEventsFiltered.mock.calls[1]?.[3]).toMatchObject({ limit: 1, offset: 0 });
  });
});

describe("countUnacknowledgedAlerts", () => {
  it("returns the count on success", async () => {
    neon.countUnacknowledgedAlerts.mockResolvedValue(3);
    const { countUnacknowledgedAlerts } = await import("./alertEvents");

    expect(await countUnacknowledgedAlerts("user-1")).toBe(3);
  });

  it("reports a failed count and falls back to 0", async () => {
    neon.countUnacknowledgedAlerts.mockRejectedValue(new Error("db down"));
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { countUnacknowledgedAlerts } = await import("./alertEvents");

    expect(await countUnacknowledgedAlerts("user-1")).toBe(0);
    expect(errorSpy).toHaveBeenCalledWith("countUnacknowledgedAlerts failed", "db down");
    errorSpy.mockRestore();
  });
});

describe("buildAlertEventsCsv", () => {
  it("builds a header row plus one row per event", async () => {
    const { buildAlertEventsCsv } = await import("./alertEvents");

    const csv = buildAlertEventsCsv([row()]);
    const lines = csv.split("\n");

    expect(lines[0]).toBe(
      "created_at,kind,title,body,channels_sent,channels_skipped,acknowledged_at",
    );
    expect(lines[1]).toBe(
      "2024-01-01T00:00:00.000Z,freeze,Freeze warning,Garage is freezing,email,,",
    );
  });

  it("joins multiple channels with a pipe and escapes commas in text fields", async () => {
    const { buildAlertEventsCsv } = await import("./alertEvents");

    const csv = buildAlertEventsCsv([
      row({
        title: "Freeze, flood risk",
        channels_sent: ["email", "sms"],
        channels_skipped: ["push"],
        acknowledged_at: "2024-01-02T00:00:00.000Z",
      }),
    ]);
    const lines = csv.split("\n");

    expect(lines[1]).toBe(
      '2024-01-01T00:00:00.000Z,freeze,"Freeze, flood risk",Garage is freezing,email|sms,push,2024-01-02T00:00:00.000Z',
    );
  });

  it("produces just the header row for an empty list", async () => {
    const { buildAlertEventsCsv } = await import("./alertEvents");

    expect(buildAlertEventsCsv([])).toBe(
      "created_at,kind,title,body,channels_sent,channels_skipped,acknowledged_at",
    );
  });
});
