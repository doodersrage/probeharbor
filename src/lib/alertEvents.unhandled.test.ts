import { beforeEach, describe, expect, it, vi } from "vitest";
import { FakeSupabase } from "../test/fakeSupabase";

let db: FakeSupabase;
vi.mock("./supabase", () => ({ createServerClient: () => db }));

const minutesAgo = (m: number) => new Date(Date.now() - m * 60 * 1000).toISOString();

type Seed = {
  id: number;
  kind: string;
  channels_sent?: string[];
  channels_skipped?: string[];
  acknowledged_at?: string | null;
  minutes?: number;
  meta?: Record<string, unknown>;
};

function seed(rows: Seed[]) {
  db.seed(
    "alert_events",
    rows.map((row) => ({
      user_id: "u1",
      title: row.kind,
      body: "",
      channels_sent: [],
      channels_skipped: [],
      acknowledged_at: null,
      meta: {},
      ...row,
      created_at: minutesAgo(row.minutes ?? row.id),
    })),
  );
}

beforeEach(() => {
  db = new FakeSupabase();
  seed([
    { id: 1, kind: "threshold", channels_sent: ["email"], minutes: 30 },
    { id: 2, kind: "generic", channels_sent: ["email"], minutes: 10 },
    { id: 3, kind: "digest", channels_sent: ["email"], minutes: 5 },
  ]);
});

describe("unhandled alerts", () => {
  it("counts only actionable alerts, not test alerts or digests", async () => {
    const { countUnacknowledgedAlerts } = await import("./alertEvents");
    expect(await countUnacknowledgedAlerts("u1")).toBe(1);
  });

  it("acknowledges the latest actionable alert, skipping newer informational sends", async () => {
    const { acknowledgeLatestUnackedAlert } = await import("./alertEvents");

    const result = await acknowledgeLatestUnackedAlert("u1");

    expect(result).toEqual(expect.objectContaining({ ok: true, eventId: 1 }));
    expect(db.table("alert_events").find((e) => e.id === 2)!.acknowledged_at).toBeNull();
  });

  it("classifies kinds for the activity list", async () => {
    const { isActionableAlertKind } = await import("./alertEvents");
    expect(isActionableAlertKind("threshold")).toBe(true);
    expect(isActionableAlertKind("flood")).toBe(true);
    expect(isActionableAlertKind("generic")).toBe(false);
    expect(isActionableAlertKind("digest")).toBe(false);
  });
});

describe("undelivered safety alerts count as unhandled", () => {
  beforeEach(() => {
    db = new FakeSupabase();
  });

  it("counts a freeze alert held by quiet hours", async () => {
    seed([{ id: 1, kind: "threshold", channels_skipped: ["quiet_hours"] }]);
    const { countUnacknowledgedAlerts } = await import("./alertEvents");
    expect(await countUnacknowledgedAlerts("u1")).toBe(1);
  });

  it("counts a leak alert where every channel failed", async () => {
    seed([{ id: 1, kind: "flood", channels_skipped: ["email", "sms"] }]);
    const { countUnacknowledgedAlerts } = await import("./alertEvents");
    expect(await countUnacknowledgedAlerts("u1")).toBe(1);
  });

  it("counts held/failed/not-set-up power, sensor-silent and legacy freeze alerts", async () => {
    seed([
      { id: 1, kind: "power", channels_skipped: ["snooze_or_vacation"] },
      { id: 2, kind: "outage", channels_skipped: [] },
      { id: 3, kind: "freeze", channels_skipped: ["push_no_subscription"] },
    ]);
    const { countUnacknowledgedAlerts } = await import("./alertEvents");
    expect(await countUnacknowledgedAlerts("u1")).toBe(3);
  });

  it("counts held or failed early freeze warnings and stuck-probe alerts", async () => {
    seed([
      { id: 1, kind: "forecast", channels_skipped: ["quiet_hours"] },
      { id: 2, kind: "runway", channels_skipped: ["email"] },
      { id: 3, kind: "nws", channels_skipped: [] },
      { id: 4, kind: "stuck", channels_skipped: ["snooze_or_vacation"] },
    ]);
    const { countUnacknowledgedAlerts } = await import("./alertEvents");
    expect(await countUnacknowledgedAlerts("u1")).toBe(4);
  });

  it("does not count held or failed routine and informational alerts", async () => {
    seed([
      { id: 1, kind: "rule", channels_skipped: ["quiet_hours"] },
      { id: 2, kind: "battery", channels_skipped: ["snooze_or_vacation"] },
      { id: 3, kind: "rate", channels_skipped: ["email"] },
      { id: 4, kind: "generic", channels_skipped: ["quiet_hours"] },
      { id: 5, kind: "digest", channels_skipped: ["email"] },
      { id: 6, kind: "recovery", channels_skipped: [] },
    ]);
    const { countUnacknowledgedAlerts } = await import("./alertEvents");
    expect(await countUnacknowledgedAlerts("u1")).toBe(0);
  });

  it("still counts a routine alert that reached someone", async () => {
    seed([{ id: 1, kind: "rule", channels_sent: ["email"] }]);
    const { countUnacknowledgedAlerts } = await import("./alertEvents");
    expect(await countUnacknowledgedAlerts("u1")).toBe(1);
  });

  it("does not count a sent alert once acknowledged, nor an acknowledged held one", async () => {
    seed([
      { id: 1, kind: "threshold", channels_sent: ["email"], acknowledged_at: minutesAgo(1) },
      { id: 2, kind: "flood", channels_skipped: ["quiet_hours"], acknowledged_at: minutesAgo(1) },
    ]);
    const { countUnacknowledgedAlerts } = await import("./alertEvents");
    expect(await countUnacknowledgedAlerts("u1")).toBe(0);
  });

  it("acknowledge all clears held safety alerts and leaves routine held ones alone", async () => {
    seed([
      { id: 1, kind: "threshold", channels_skipped: ["quiet_hours"] },
      { id: 2, kind: "flood", channels_skipped: ["email"] },
      { id: 3, kind: "threshold", channels_sent: ["email"] },
      { id: 4, kind: "rule", channels_skipped: ["quiet_hours"] },
    ]);
    const { acknowledgeAllUnackedAlerts, countUnacknowledgedAlerts } = await import("./alertEvents");

    const result = await acknowledgeAllUnackedAlerts("u1");

    expect(result).toEqual({ ok: true, count: 3 });
    expect(await countUnacknowledgedAlerts("u1")).toBe(0);
    const byId = (id: number) => db.table("alert_events").find((e) => e.id === id)!;
    expect(byId(1).acknowledged_at).toEqual(expect.any(String));
    expect(byId(2).acknowledged_at).toEqual(expect.any(String));
    expect(byId(4).acknowledged_at).toBeNull();
    // Acknowledging never rewrites what was (not) sent.
    expect(byId(1).channels_sent).toEqual([]);
    expect(byId(1).channels_skipped).toEqual(["quiet_hours"]);
  });

  it("acknowledge latest picks a held safety alert when it is the newest", async () => {
    seed([
      { id: 1, kind: "threshold", channels_sent: ["email"], minutes: 60 },
      { id: 2, kind: "flood", channels_skipped: ["quiet_hours"], minutes: 5 },
    ]);
    const { acknowledgeLatestUnackedAlert } = await import("./alertEvents");
    expect(await acknowledgeLatestUnackedAlert("u1")).toEqual({ ok: true, eventId: 2 });
  });

  it("the unhandled-only activity filter lists exactly the counted rows", async () => {
    seed([
      { id: 1, kind: "threshold", channels_skipped: ["quiet_hours"] },
      { id: 2, kind: "rule", channels_skipped: ["quiet_hours"] },
      { id: 3, kind: "rule", channels_sent: ["email"] },
      { id: 4, kind: "generic", channels_sent: ["email"] },
    ]);
    const { listRecentAlertEventsFiltered, countUnacknowledgedAlerts } = await import("./alertEvents");
    const { events } = await listRecentAlertEventsFiltered("u1", { unackedOnly: true });
    expect(events.map((e) => e.id).sort()).toEqual([1, 3]);
    expect(await countUnacknowledgedAlerts("u1")).toBe(2);
  });

  it("auto-resolve closes a held freeze alert without adding recovery channels", async () => {
    seed([
      { id: 1, kind: "threshold", channels_skipped: ["quiet_hours"] },
      { id: 2, kind: "threshold", channels_sent: ["email"] },
    ]);
    const { autoResolveAlerts, countUnacknowledgedAlerts } = await import("./alertEvents");
    const result = await autoResolveAlerts("u1", { kinds: ["threshold"], reason: "recovered" });
    expect(result).toEqual({ resolved: 2, channels: ["email"] });
    expect(await countUnacknowledgedAlerts("u1")).toBe(0);
    expect(db.table("alert_events").find((e) => e.id === 1)!.meta).toEqual({ autoResolved: "recovered" });
  });

  it("finds an open freeze or leak alert for the claims-pack link, held ones included", async () => {
    const { hasUnhandledAlertOfKinds, CLAIMS_PACK_ALERT_KINDS } = await import("./alertEvents");
    seed([
      { id: 1, kind: "rule", channels_sent: ["email"] },
      { id: 2, kind: "power", channels_sent: ["email"] },
    ]);
    expect(await hasUnhandledAlertOfKinds("u1", CLAIMS_PACK_ALERT_KINDS)).toBe(false);
    seed([{ id: 3, kind: "flood", channels_skipped: ["quiet_hours"] }]);
    expect(await hasUnhandledAlertOfKinds("u1", CLAIMS_PACK_ALERT_KINDS)).toBe(true);
  });

  it("an acknowledged freeze alert doesn't make the claims-pack link relevant", async () => {
    const { hasUnhandledAlertOfKinds, CLAIMS_PACK_ALERT_KINDS } = await import("./alertEvents");
    seed([{ id: 1, kind: "threshold", channels_sent: ["email"], acknowledged_at: minutesAgo(1) }]);
    expect(await hasUnhandledAlertOfKinds("u1", CLAIMS_PACK_ALERT_KINDS)).toBe(false);
  });

  it("isUnhandledAlertEvent matches the count's rule", async () => {
    const { isUnhandledAlertEvent } = await import("./alertEvents");
    const ev = (kind: string, sent: string[], acked: string | null = null) => ({
      kind,
      channels_sent: sent,
      acknowledged_at: acked,
    });
    expect(isUnhandledAlertEvent(ev("threshold", []))).toBe(true);
    expect(isUnhandledAlertEvent(ev("flood", []))).toBe(true);
    expect(isUnhandledAlertEvent(ev("rule", []))).toBe(false);
    expect(isUnhandledAlertEvent(ev("rule", ["email"]))).toBe(true);
    expect(isUnhandledAlertEvent(ev("generic", ["email"]))).toBe(false);
    expect(isUnhandledAlertEvent(ev("threshold", ["email"], minutesAgo(1)))).toBe(false);
  });
});
