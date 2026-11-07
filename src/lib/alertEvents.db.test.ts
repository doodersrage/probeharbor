import { describe, expect, it, vi } from "vitest";
import { insertTestUser, useTestDatabase } from "../test/db";

vi.mock("./runtimeEnv", () => ({
  getRuntimeEnv: () => undefined,
  hasRuntimeEnv: () => false,
}));

import {
  acknowledgeAlertEvent,
  acknowledgeAllUnackedAlerts,
  acknowledgeLatestUnackedAlert,
  autoResolveAlerts,
  countUnacknowledgedAlerts,
  getAlertEventForUser,
  hasDeliveredAnyAlert,
  hasUnhandledAlertOfKinds,
  INFORMATIONAL_ALERT_KINDS,
  isUnhandledAlertEvent,
  listAlertEventsInRange,
  listRecentAlertEvents,
  listRecentAlertEventsFiltered,
  recordAlertEvent,
  updateAlertEventChannels,
  updateAlertEventMeta,
} from "./alertEvents";
import { SAFETY_ALERT_KINDS } from "./alertDeliveryState";

const db = useTestDatabase();
const sql = async <T = Record<string, unknown>>(text: string, params: unknown[] = []) =>
  (await db.client().query(text, params)).rows as T[];

async function event(
  userId: string,
  kind: string,
  sent: string[],
  options: { minutesAgo?: number; acked?: boolean; meta?: object } = {},
): Promise<number> {
  const [row] = await sql<{ id: number }>(
    `insert into public.alert_events (user_id, kind, title, body, channels_sent, created_at, acknowledged_at, meta)
     values ($1, $2, 't', 'b', $3::text[], now() - ($4 || ' minutes')::interval,
             case when $5 then now() end, $6::jsonb) returning id`,
    [userId, kind, sent, options.minutesAgo ?? 0, options.acked ?? false, JSON.stringify(options.meta ?? {})],
  );
  return row!.id;
}

/** One event for every combination that matters to "unhandled". */
async function everyCombination(userId: string) {
  const kinds = [...INFORMATIONAL_ALERT_KINDS, ...SAFETY_ALERT_KINDS, "rule", "rate", "battery"];
  let minute = 0;
  for (const kind of kinds) {
    for (const sent of [[], ["email"], ["email", "push"]]) {
      for (const acked of [false, true]) {
        minute += 1;
        await event(userId, kind, sent, { minutesAgo: minute, acked });
      }
    }
  }
}

describe("the unhandled rule matches isUnhandledAlertEvent exactly (Neon)", () => {
  it("count, unhandled list and kind check agree with the app's rule on every combination", async () => {
    const userId = await insertTestUser(db.client(), "a@example.com");
    await everyCombination(userId);
    const all = await sql<{ id: number; kind: string; channels_sent: string[]; acknowledged_at: string | null }>(
      "select id, kind, channels_sent, acknowledged_at from public.alert_events where user_id = $1",
      [userId],
    );
    const expected = all.filter((e) => isUnhandledAlertEvent(e));
    expect(expected.length).toBeGreaterThan(5); // sanity: the fixture has unhandled rows

    await expect(countUnacknowledgedAlerts(userId)).resolves.toBe(expected.length);
    const listed = await listRecentAlertEventsFiltered(userId, { unackedOnly: true, limit: 50 });
    expect(listed.events.map((e) => e.id).sort()).toEqual(expected.map((e) => e.id).sort());
    for (const kind of ["freeze", "rule", "digest"]) {
      await expect(hasUnhandledAlertOfKinds(userId, [kind])).resolves.toBe(expected.some((e) => e.kind === kind));
    }
  });

  it("acknowledge-all closes exactly the unhandled ones and leaves the rest", async () => {
    const userId = await insertTestUser(db.client(), "a@example.com");
    await everyCombination(userId);
    const before = await countUnacknowledgedAlerts(userId);

    const result = await acknowledgeAllUnackedAlerts(userId, 500);
    expect(result).toEqual({ ok: true, count: before });
    await expect(countUnacknowledgedAlerts(userId)).resolves.toBe(0);
    // Informational and undelivered non-safety alerts stay open (they were never "unhandled").
    const [{ n }] = (await sql<{ n: number }>(
      "select count(*) as n from public.alert_events where user_id = $1 and acknowledged_at is null",
      [userId],
    )) as [{ n: number }];
    expect(n).toBeGreaterThan(0);
    expect((await acknowledgeAllUnackedAlerts(userId)).ok).toBe(false);
  });
});

describe("acknowledging (Neon)", () => {
  it("latest picks the newest unhandled alert; then the next; then says there's none", async () => {
    const userId = await insertTestUser(db.client(), "a@example.com");
    const older = await event(userId, "freeze", [], { minutesAgo: 30 });
    const newer = await event(userId, "rule", ["email"], { minutesAgo: 10 });
    await event(userId, "digest", ["email"], { minutesAgo: 1 }); // informational: skipped

    await expect(acknowledgeLatestUnackedAlert(userId)).resolves.toEqual({ ok: true, eventId: newer });
    await expect(acknowledgeLatestUnackedAlert(userId)).resolves.toEqual({ ok: true, eventId: older });
    const none = await acknowledgeLatestUnackedAlert(userId);
    expect(none.ok).toBe(false);
    expect(none.error).toBeTruthy();
  });

  it("acknowledge-all respects the cap, newest first", async () => {
    const userId = await insertTestUser(db.client(), "a@example.com");
    const ids = [];
    for (let i = 5; i >= 1; i -= 1) ids.push(await event(userId, "rule", ["email"], { minutesAgo: i }));
    await expect(acknowledgeAllUnackedAlerts(userId, 2)).resolves.toEqual({ ok: true, count: 2 });
    const open = await sql<{ id: number }>(
      "select id from public.alert_events where user_id = $1 and acknowledged_at is null order by id",
      [userId],
    );
    expect(open.map((r) => r.id)).toEqual(ids.slice(0, 3)); // the 3 oldest stay open
  });

  it("can't touch another user's alerts", async () => {
    const a = await insertTestUser(db.client(), "a@example.com");
    const b = await insertTestUser(db.client(), "b@example.com");
    const theirs = await event(b, "freeze", ["email"]);

    await acknowledgeAlertEvent(a, theirs);
    expect((await updateAlertEventMeta(a, theirs, { feedback: "false_alarm" })).ok).toBe(false);
    await updateAlertEventChannels(theirs, a, [], ["email"]);
    await expect(getAlertEventForUser(a, theirs)).resolves.toBeNull();
    expect((await acknowledgeAllUnackedAlerts(a)).ok).toBe(false);
    await autoResolveAlerts(a);

    const row = await getAlertEventForUser(b, theirs);
    expect(row).toMatchObject({ acknowledged_at: null, channels_sent: ["email"], meta: {} });
  });
});

describe("auto-resolve (Neon)", () => {
  it("closes matching unhandled alerts, marks why, keeps other meta, reports the channels used", async () => {
    const userId = await insertTestUser(db.client(), "a@example.com");
    const freeze = await event(userId, "freeze", ["email"], { meta: { probeLabel: "Pipe" } });
    const held = await event(userId, "freeze", []); // safety alert nobody was told about
    const flood = await event(userId, "flood", ["push"]);

    const result = await autoResolveAlerts(userId, { kinds: ["freeze"] });
    expect(result.resolved).toBe(2);
    expect(result.channels).toEqual(["email"]);
    expect((await getAlertEventForUser(userId, freeze))?.meta).toEqual({ probeLabel: "Pipe", autoResolved: "recovered" });
    expect((await getAlertEventForUser(userId, held))?.acknowledged_at).not.toBeNull();
    expect((await getAlertEventForUser(userId, flood))?.acknowledged_at).toBeNull();
  });

  it("'expired' only closes alerts older than the cutoff", async () => {
    const userId = await insertTestUser(db.client(), "a@example.com");
    const old = await event(userId, "rule", ["email"], { minutesAgo: 3 * 24 * 60 });
    const recent = await event(userId, "rule", ["email"], { minutesAgo: 5 });
    await expect(autoResolveAlerts(userId, { olderThanMs: 24 * 3600_000, reason: "expired" })).resolves.toMatchObject({
      resolved: 1,
    });
    expect((await getAlertEventForUser(userId, old))?.meta?.autoResolved).toBe("expired");
    expect((await getAlertEventForUser(userId, recent))?.acknowledged_at).toBeNull();
  });
});

describe("recording and listing (Neon)", () => {
  it("records an event and reads it back the way Supabase returned it", async () => {
    const userId = await insertTestUser(db.client(), "a@example.com");
    const id = await recordAlertEvent({
      userId,
      kind: "freeze",
      title: "Freeze risk",
      body: "Pipe is 31°F",
      channelsSent: ["email"],
      channelsSkipped: ["sms"],
      meta: { probeLabel: "Pipe", thresholdF: 34 },
    });
    expect(typeof id).toBe("number");
    const row = await getAlertEventForUser(userId, id!);
    expect(row).toMatchObject({
      id,
      user_id: userId,
      kind: "freeze",
      channels_sent: ["email"],
      channels_skipped: ["sms"],
      acknowledged_at: null,
      meta: { probeLabel: "Pipe", thresholdF: 34 },
    });
    expect(row?.created_at).toMatch(/\+00:00$/);
    await expect(hasDeliveredAnyAlert(userId)).resolves.toBe(true);

    await updateAlertEventMeta(userId, id!, { feedback: "false_alarm" });
    expect((await getAlertEventForUser(userId, id!))?.meta).toMatchObject({ probeLabel: "Pipe", feedback: "false_alarm" });
  });

  it("pages the log newest first and says whether there's more; range export is oldest first", async () => {
    const userId = await insertTestUser(db.client(), "a@example.com");
    for (let i = 1; i <= 5; i += 1) await event(userId, i % 2 ? "rule" : "freeze", ["email"], { minutesAgo: i * 10 });

    const page1 = await listRecentAlertEventsFiltered(userId, { limit: 2 });
    expect(page1.hasMore).toBe(true);
    const page3 = await listRecentAlertEventsFiltered(userId, { limit: 2, offset: 4 });
    expect(page3).toMatchObject({ hasMore: false });
    expect(page3.events).toHaveLength(1);
    expect((await listRecentAlertEventsFiltered(userId, { kinds: ["freeze"] })).events).toHaveLength(2);
    expect((await listRecentAlertEventsFiltered(userId, { kind: "ree" })).events).toHaveLength(2);
    expect((await listRecentAlertEvents(userId, 3)).map((e) => e.created_at)).toEqual(
      [...(await listRecentAlertEvents(userId, 3)).map((e) => e.created_at)].sort().reverse(),
    );
    const range = await listAlertEventsInRange(userId, new Date(Date.now() - 3600_000).toISOString(), new Date().toISOString());
    expect(range.map((e) => e.created_at)).toEqual([...range.map((e) => e.created_at)].sort());
    expect(range).toHaveLength(5);
  });
});

describe("has the user ever been alerted (Neon)", () => {
  it("false with no alerts, or with only alerts that went nowhere; true once one went out", async () => {
    const userId = await insertTestUser(db.client(), "a@example.com");
    await expect(hasDeliveredAnyAlert(userId)).resolves.toBe(false);
    await event(userId, "rule", []);
    await expect(hasDeliveredAnyAlert(userId)).resolves.toBe(false);
    const other = await insertTestUser(db.client(), "b@example.com");
    await event(other, "rule", ["email"]);
    await expect(hasDeliveredAnyAlert(userId)).resolves.toBe(false);
    await event(userId, "rule", ["push"]);
    await expect(hasDeliveredAnyAlert(userId)).resolves.toBe(true);
  });
});
