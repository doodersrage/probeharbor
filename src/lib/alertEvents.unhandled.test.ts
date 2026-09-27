import { beforeEach, describe, expect, it, vi } from "vitest";
import { FakeSupabase } from "../test/fakeSupabase";

let db: FakeSupabase;
vi.mock("./supabase", () => ({ createServerClient: () => db }));

const minutesAgo = (m: number) => new Date(Date.now() - m * 60 * 1000).toISOString();

beforeEach(() => {
  db = new FakeSupabase();
  db.seed("alert_events", [
    { id: 1, user_id: "u1", kind: "threshold", channels_sent: ["email"], acknowledged_at: null, created_at: minutesAgo(30) },
    { id: 2, user_id: "u1", kind: "generic", channels_sent: ["email"], acknowledged_at: null, created_at: minutesAgo(10) },
    { id: 3, user_id: "u1", kind: "digest", channels_sent: ["email"], acknowledged_at: null, created_at: minutesAgo(5) },
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
