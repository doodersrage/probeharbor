/**
 * Household / user / token isolation audit for the alert, email-job, freeze
 * subscription and scheduled-job queries (src/lib/db/alertEvents.ts,
 * alertExtras.ts, alertSettings.ts, emailJobs.ts, freezeSubscriptions.ts,
 * jobs.ts). Each test sets up two users (and their households) and checks a
 * call made for one never reads or changes the other's rows. Functions that
 * already had such a test elsewhere are not repeated here.
 */
import { describe, expect, it, vi } from "vitest";
import { insertTestUser, useTestDatabase } from "../test/db";

vi.mock("./runtimeEnv", () => ({
  getRuntimeEnv: () => undefined,
  hasRuntimeEnv: () => false,
}));

import { SAFETY_ALERT_KINDS } from "./alertDeliveryState";
import { INFORMATIONAL_ALERT_KINDS } from "./alertEvents";
import * as events from "./db/alertEvents";
import * as extras from "./db/alertExtras";
import * as settings from "./db/alertSettings";
import * as emailJobs from "./db/emailJobs";
import * as freeze from "./db/freezeSubscriptions";
import * as jobs from "./db/jobs";
import { upsertDeviceSensor } from "./devices";
import { addHouseholdMemberByUserId } from "./households";

const db = useTestDatabase();
const sql = async <T = Record<string, unknown>>(text: string, params: unknown[] = []) =>
  (await db.client().query(text, params)).rows as T[];

const INFO = INFORMATIONAL_ALERT_KINDS;
const SAFETY = SAFETY_ALERT_KINDS;

async function home(email: string) {
  const userId = await insertTestUser(db.client(), email);
  const [m] = await sql<{ household_id: string }>("select household_id from public.household_members where user_id = $1", [
    userId,
  ]);
  return { userId, householdId: m!.household_id };
}

async function event(userId: string, kind: string, sent: string[], minutesAgo = 0): Promise<number> {
  const [row] = await sql<{ id: number }>(
    `insert into public.alert_events (user_id, kind, title, body, channels_sent, created_at)
     values ($1, $2, 't', 'b', $3::text[], now() - ($4 || ' minutes')::interval) returning id`,
    [userId, kind, sent, minutesAgo],
  );
  return row!.id;
}

const settingsColumn = async (userId: string, name: string) =>
  (await sql<Record<string, unknown>>(`select ${name} as v from public.alert_settings where user_id = $1`, [userId]))[0]?.v;

/** Two users, each with an unhandled delivered alert; returns B's event id. */
async function twoUsersWithAlerts() {
  const a = await insertTestUser(db.client(), "a@example.com");
  const b = await insertTestUser(db.client(), "b@example.com");
  await event(a, "rule", [], 5); // A: one undelivered (not unhandled)
  const theirs = await event(b, "freeze", ["email"], 1);
  await event(b, "rule", ["push"], 2);
  return { a, b, theirs };
}

describe("alert events: reads never include another user's alerts", () => {
  it("lists, range export, delivery attempts, unhandled checks and counts", async () => {
    const { a, b } = await twoUsersWithAlerts();
    const hour = new Date(Date.now() - 3600_000).toISOString();
    const now = new Date(Date.now() + 1000).toISOString();

    const filtered = await events.listRecentAlertEventsFiltered(a, INFO, SAFETY, { limit: 50, offset: 0 });
    expect(filtered.events.every((e) => e.user_id === a)).toBe(true);
    expect(filtered.events).toHaveLength(1);
    expect(
      (await events.listRecentAlertEventsFiltered(a, INFO, SAFETY, { limit: 50, offset: 0, unackedOnly: true, kinds: ["freeze"] }))
        .events,
    ).toEqual([]);
    expect((await events.listRecentAlertEventsFiltered(a, INFO, SAFETY, { limit: 50, offset: 0, kind: "free" })).events).toEqual([]);

    const recent = await events.listRecentAlertEvents(a, 50);
    expect(recent.map((e) => e.user_id)).toEqual([a]);
    const attempts = await events.listRecentDeliveryAttempts(a, 50);
    expect(attempts).toHaveLength(1);
    expect(attempts[0]!.channels_sent).toEqual([]);
    const range = await events.listAlertEventsInRange(a, hour, now, 50);
    expect(range.map((e) => e.user_id)).toEqual([a]);

    await expect(events.hasUnhandledAlertOfKinds(a, ["freeze", "rule"], INFO, SAFETY)).resolves.toBe(false);
    await expect(events.countUnacknowledgedAlerts(a, INFO, SAFETY)).resolves.toBe(0);
    await expect(settings.recentAlertReachedAChannel(a)).resolves.toBe(false);
    await expect(emailJobs.weekAlertDeliveries(a, hour)).resolves.toEqual([
      { kind: "rule", channels_sent: [], channels_skipped: [] },
    ]);

    // Sanity: B's are visible to B.
    await expect(events.countUnacknowledgedAlerts(b, INFO, SAFETY)).resolves.toBe(2);
    await expect(settings.recentAlertReachedAChannel(b)).resolves.toBe(true);
    expect(await emailJobs.weekAlertDeliveries(b, hour)).toHaveLength(2);
  });

  it("acknowledge-latest only closes the caller's newest unhandled alert", async () => {
    const { a, b, theirs } = await twoUsersWithAlerts();
    await expect(events.acknowledgeLatestUnackedAlert(a, INFO, SAFETY, "none")).resolves.toEqual({ ok: false, error: "none" });
    const left = await sql<{ id: number }>(
      "select id from public.alert_events where user_id = $1 and acknowledged_at is null order by id",
      [b],
    );
    expect(left).toHaveLength(2);
    expect(left.map((r) => r.id)).toContain(theirs);
  });

  it("recordAlertEvent writes only under the given user", async () => {
    const a = await insertTestUser(db.client(), "a@example.com");
    const b = await insertTestUser(db.client(), "b@example.com");
    const id = await events.recordAlertEvent({ userId: a, kind: "rule", title: "t", body: "b", channelsSent: [], channelsSkipped: [] });
    await expect(events.getAlertEventForUser(b, id!)).resolves.toBeNull();
    expect(await sql("select 1 from public.alert_events where user_id = $1", [b])).toEqual([]);
  });
});

describe("alert settings: one user's stamps never reach another's row", () => {
  async function twoWithSettings() {
    const a = await insertTestUser(db.client(), "a@example.com");
    const b = await insertTestUser(db.client(), "b@example.com");
    await sql("insert into public.alert_settings (user_id, freeze_threshold_f) values ($1, 30), ($2, 40)", [a, b]);
    return { a, b };
  }

  it("get / insert-defaults read and write only the given user", async () => {
    const { a, b } = await twoWithSettings();
    expect((await settings.getAlertSettingsRow(a))?.user_id).toBe(a);
    expect((await settings.getAlertSettingsRow(a))?.freeze_threshold_f).toBe(30);

    const c = await insertTestUser(db.client(), "c@example.com");
    await settings.insertDefaultAlertSettings(c, { freeze_threshold_f: 50 });
    // A row supplied with another user's id still lands on the caller.
    await settings.saveAlertSettingsRow(c, { user_id: b, freeze_threshold_f: 51 });
    expect(await settingsColumn(c, "freeze_threshold_f")).toBe(51);
    expect(await settingsColumn(b, "freeze_threshold_f")).toBe(40);
    // insert-defaults on an existing row is a no-op, never touching others.
    await settings.insertDefaultAlertSettings(a, { freeze_threshold_f: 99 });
    expect(await settingsColumn(a, "freeze_threshold_f")).toBe(30);
    expect(await settingsColumn(b, "freeze_threshold_f")).toBe(40);
  });

  it("markCooldown, claimCooldown and releaseCooldown touch only the caller", async () => {
    const { a, b } = await twoWithSettings();
    await settings.markCooldown(a, "last_flood_alert_at", {});
    expect(await settingsColumn(a, "last_flood_alert_at")).not.toBeNull();
    expect(await settingsColumn(b, "last_flood_alert_at")).toBeNull();

    const claim = await settings.claimCooldown(a, "last_power_alert_at", null);
    expect(claim.claimed).toBe(true);
    expect(await settingsColumn(b, "last_power_alert_at")).toBeNull();
    // B can still claim from its own (null) value: A's claim didn't move B's.
    const bClaim = await settings.claimCooldown(b, "last_power_alert_at", null);
    expect(bClaim).toMatchObject({ claimed: true });
    expect(bClaim.claimedAt).toBeTruthy();

    // Releasing A's claim leaves B's stamp alone, even with B's own claim time.
    await settings.releaseCooldown(a, "last_power_alert_at", bClaim.claimedAt!, null);
    expect(await settingsColumn(b, "last_power_alert_at")).not.toBeNull();
    await settings.releaseCooldown(a, "last_power_alert_at", claim.claimedAt!, null);
    expect(await settingsColumn(a, "last_power_alert_at")).toBeNull();
    expect(await settingsColumn(b, "last_power_alert_at")).not.toBeNull();
  });

  it("email-job stamps, trial-reminder read and feed-uptime stamp are per user", async () => {
    const { a, b } = await twoWithSettings();
    await emailJobs.stampSettings(a, "last_trial_reminder_at", { touchUpdatedAt: true, dripStage: 2 });
    expect(await emailJobs.lastTrialReminderAt(a)).not.toBeNull();
    await expect(emailJobs.lastTrialReminderAt(b)).resolves.toBeNull();
    expect(await settingsColumn(b, "drip_email_stage")).not.toBe(2);

    await jobs.markFeedUptimeAlert(a);
    expect(await settingsColumn(a, "last_feed_uptime_alert_at")).not.toBeNull();
    expect(await settingsColumn(b, "last_feed_uptime_alert_at")).toBeNull();
  });
});

describe("settings history and snooze links", () => {
  it("pruning one user's history never deletes another's", async () => {
    const a = await insertTestUser(db.client(), "a@example.com");
    const b = await insertTestUser(db.client(), "b@example.com");
    for (let i = 0; i < 3; i += 1) await extras.recordSettingsHistory(b, { i }, ["x"], 10);
    await extras.recordSettingsHistory(a, { i: 0 }, ["x"], 1);
    await extras.recordSettingsHistory(a, { i: 1 }, ["x"], 1);
    expect(await extras.listSettingsHistory(a, 10)).toHaveLength(1);
    expect(await extras.listSettingsHistory(b, 10)).toHaveLength(3);
  });

  it("a snooze link finds and claims only its own row", async () => {
    const a = await insertTestUser(db.client(), "a@example.com");
    const b = await insertTestUser(db.client(), "b@example.com");
    const later = new Date(Date.now() + 3600_000).toISOString();
    await extras.insertSnoozeToken("hash-a", a, 3, later);
    await extras.insertSnoozeToken("hash-b", b, 24, later);

    await expect(extras.findSnoozeToken(["hash-a", "unknown"])).resolves.toMatchObject({ user_id: a, token: "hash-a" });
    await expect(extras.findSnoozeToken(["unknown"])).resolves.toBeNull();
    await expect(extras.claimSnoozeToken(["unknown"])).resolves.toBeNull();
    await expect(extras.claimSnoozeToken(["hash-a"])).resolves.toEqual({ user_id: a, hours: 3 });
    // A's (now used) link can't be replayed into anything else.
    await expect(extras.claimSnoozeToken(["hash-a"])).resolves.toBeNull();
    const [bRow] = await sql<{ used_at: string | null }>("select used_at from public.alert_snooze_tokens where token = 'hash-b'");
    expect(bRow!.used_at).toBeNull();
  });
});

describe("email jobs: households and readings stay within the user's memberships", () => {
  it("first reading, first owned household and digest fan-out ignore other households", async () => {
    const a = await home("a@example.com");
    const b = await home("b@example.com");
    // B's household has a device that reported and a legacy reading.
    await sql("insert into public.devices (household_id, name, source, last_seen_at) values ($1, 'P', 'push', now())", [b.householdId]);
    // C joins B's household as a plain member; A stays out. Everyone opts into digests.
    const c = await insertTestUser(db.client(), "c@example.com");
    await addHouseholdMemberByUserId(b.householdId, c, "member");
    await sql("update public.household_members set digest_opt_in = true");

    await expect(emailJobs.userHasFirstReading(a.userId)).resolves.toBe(false);
    await expect(emailJobs.userHasFirstReading(b.userId)).resolves.toBe(true);
    await expect(emailJobs.firstOwnedHouseholdId(a.userId)).resolves.toBe(a.householdId);
    // C is only a member (not owner) of B's household, so it is never C's "owned" one.
    const owned = await emailJobs.firstOwnedHouseholdId(c);
    expect(owned).not.toBe(b.householdId);
    await expect(emailJobs.digestFanOutMemberIds(a.userId)).resolves.toEqual([]);
    await expect(emailJobs.digestFanOutMemberIds(b.userId)).resolves.toEqual([c]);
  });
});

describe("freeze alert subscriptions: a token only reaches its own row", () => {
  it("confirm, unsubscribe and lookup by email never touch another subscriber", async () => {
    await freeze.writeUnconfirmed("a@example.com", "A", 42, -71, "tok-a");
    await freeze.writeUnconfirmed("b@example.com", "B", 40, -74, "tok-b");
    const state = async (email: string) =>
      (await sql<{ confirmed_at: string | null }>("select confirmed_at from public.freeze_alert_subscriptions where email = $1", [email]))[0];

    await expect(freeze.confirm("tok-a")).resolves.toBe(true);
    expect((await state("a@example.com"))!.confirmed_at).not.toBeNull();
    expect((await state("b@example.com"))!.confirmed_at).toBeNull();
    await expect(freeze.confirm("")).resolves.toBe(false);
    await expect(freeze.confirm("tok-")).resolves.toBe(false);

    expect((await freeze.findByEmail("a@example.com"))?.lat).toBe(42);
    await expect(freeze.findByEmail("nobody@example.com")).resolves.toBeNull();

    await expect(freeze.unsubscribe("tok-a")).resolves.toBe(true);
    expect(await state("a@example.com")).toBeUndefined();
    expect(await state("b@example.com")).toBeDefined();
    await expect(freeze.unsubscribe("%")).resolves.toBe(false);
    expect(await state("b@example.com")).toBeDefined();
  });
});

describe("jobs: per-sensor and per-user lookups", () => {
  it("stuck-sensor facts count only that sensor's readings", async () => {
    const a = await home("a@example.com");
    const b = await home("b@example.com");
    const device = async (householdId: string) =>
      (
        await sql<{ id: string }>("insert into public.devices (household_id, name, source) values ($1, 'D', 'push') returning id", [
          householdId,
        ])
      )[0]!.id;
    const sa = (await upsertDeviceSensor(a.householdId, await device(a.householdId), "t", "T", "temperature", "F")).sensor!.id;
    const sb = (await upsertDeviceSensor(b.householdId, await device(b.householdId), "t", "T", "temperature", "F")).sensor!.id;
    await sql(
      `insert into public.sensor_readings (sensor_id, household_id, recorded_at, value_num)
       select $1, $2, now() - (g || ' minutes')::interval, 70 + g from generate_series(1, 10) g`,
      [sb, b.householdId],
    );
    await sql("insert into public.sensor_readings (sensor_id, household_id, recorded_at, value_num) values ($1, $2, now(), 41)", [
      sa,
      a.householdId,
    ]);
    const windowStart = new Date(Date.now() - 24 * 3600_000).toISOString();
    const facts = await jobs.stuckSensorFacts(sa, windowStart, windowStart);
    expect(facts).toMatchObject({ latest_value: 41, samples_in_window: 1, last_different_at: null, reported_before_window: false });
  });

  it("last OK feed check is the user's own", async () => {
    const a = await insertTestUser(db.client(), "a@example.com");
    const b = await insertTestUser(db.client(), "b@example.com");
    const at = new Date().toISOString();
    await jobs.insertFeedUptimeChecks([
      { user_id: b, feed_id: "f1", feed_name: "F", url: "https://x/", ok: true, message: null, latency_ms: 5, checked_at: at },
      { user_id: a, feed_id: "f1", feed_name: "F", url: "https://x/", ok: false, message: "down", latency_ms: null, checked_at: at },
    ]);
    await expect(jobs.lastOkFeedCheckAt(a, "f1")).resolves.toBeNull();
    await expect(jobs.lastOkFeedCheckAt(b, "f1")).resolves.not.toBeNull();
  });
});
