/**
 * Household-level snooze / vacation (inbound webhook) against a real
 * database, through the real cron pass (collectHistoryForAllUsers) and the
 * real inbound route. Only outbound HTTP (the Discord channel) is faked.
 *
 * Setup: owner A has household HA; S has their own household HB and is also
 * a member of HA. HA's inbound webhook must hold HA's routine alerts for its
 * members (A and S) and leave S's alerts for HB alone; freeze alerts always
 * send; members' own alert settings are never written.
 */
import { createHmac } from "node:crypto";
import type { APIContext } from "astro";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { insertTestUser, useTestDatabase } from "../test/db";

vi.mock("./runtimeEnv", () => ({
  getRuntimeEnv: () => undefined,
  hasRuntimeEnv: () => false,
}));
// The dashboard resume route's session: whoever `signedIn` names.
const signedIn = vi.hoisted(() => ({ userId: null as string | null }));
vi.mock("./auth", () => ({
  getAuthFromRequest: async () =>
    signedIn.userId
      ? { session: { access_token: "t" }, user: { id: signedIn.userId, user_metadata: {} } }
      : { session: null, user: null },
}));

import { DEFAULT_ALERT_SETTINGS } from "./alerts";
import { collectHistoryForAllUsers } from "./collectHistory";
import { getHouseholdAlertHold, setHouseholdSnoozeUntil } from "./db/householdHolds";
import { mergeUserMetadata } from "./db/userMetadata";
import { addHouseholdMemberByUserId } from "./households";
import { createInboundWebhook } from "./inboundWebhooks";
import { getAlertSettingsForUser, saveAlertSettingsForUser } from "./notify";
import { POST as inboundPost } from "../pages/api/inbound/[token]";
import { POST as resumePost } from "../pages/api/user/household-alert-hold";

const db = useTestDatabase();
const sql = async <T = Record<string, unknown>>(text: string, params: unknown[] = []) =>
  (await db.client().query(text, params)).rows as T[];

const DISCORD_A = "https://discord.com/api/webhooks/1/owner-a";
const DISCORD_S = "https://discord.com/api/webhooks/2/shared-s";
const fetchMock = vi.fn();

beforeEach(() => {
  fetchMock.mockReset().mockImplementation(async (url: string) =>
    url.startsWith("https://discord.com/") ? new Response(null, { status: 204 }) : new Response("no", { status: 404 }),
  );
  vi.stubGlobal("fetch", fetchMock);
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const householdOf = async (userId: string) =>
  (await sql<{ household_id: string }>(
    "select household_id from public.household_members where user_id = $1 and role = 'owner'",
    [userId],
  ))[0]!.household_id;

/** A push device reporting now; battery as given, one temperature probe at `tempF`. */
async function device(householdId: string, name: string, batteryPct: number, tempF: number) {
  const [d] = await sql<{ id: string }>(
    `insert into public.devices (household_id, name, source, enabled, last_seen_at, meta)
     values ($1, $2, 'push', true, now(), $3::jsonb) returning id`,
    [householdId, name, JSON.stringify({ battery_pct: batteryPct })],
  );
  const [s] = await sql<{ id: string }>(
    `insert into public.device_sensors (device_id, key, label, kind, unit, visible)
     values ($1, 't0', $2, 'temperature', 'F', true) returning id`,
    [d!.id, `${name} temp`],
  );
  await sql(
    `insert into public.sensor_readings (sensor_id, household_id, value_num, recorded_at)
     values ($1, $2, $3, now() - interval '1 minute')`,
    [s!.id, householdId, tempF],
  );
}

async function setup(options: { aBattery?: number; aTemp?: number; bBattery?: number; bTemp?: number } = {}) {
  const a = await insertTestUser(db.client(), "owner-a@example.com");
  const s = await insertTestUser(db.client(), "shared-s@example.com");
  const ha = await householdOf(a);
  const hb = await householdOf(s);
  await addHouseholdMemberByUserId(ha, s, "member");
  // S owns HB and is also a member of HA, and HA is S's preferred household.
  // The cron must still evaluate HB (it used to go through S's preferred
  // household and skip HB entirely).
  await mergeUserMetadata(s, { active_household_id: ha });
  for (const [userId, url] of [
    [a, DISCORD_A],
    [s, DISCORD_S],
  ] as const) {
    await saveAlertSettingsForUser(userId, {
      ...DEFAULT_ALERT_SETTINGS,
      enabled: true,
      channelEmail: false,
      channelDiscord: true,
      discordWebhookUrl: url,
      batteryAlertsEnabled: true,
      batteryThresholdPct: 20,
      freezeThresholdF: 32,
      freezeDwellMinutes: 0,
      forecastFreezeEnabled: false,
      runwayAlertEnabled: false,
      nwsFreezeAlertsEnabled: false,
    });
  }
  await device(ha, "HA probe", options.aBattery ?? 90, options.aTemp ?? 50);
  await device(hb, "HB probe", options.bBattery ?? 90, options.bTemp ?? 50);
  const hook = await createInboundWebhook(ha, a, "HA automation");
  return { a, s, ha, hb, token: hook.token!, secret: hook.signingSecret! };
}

/** POST the inbound webhook with a current timestamped (v2) signature. */
async function inbound(token: string, secret: string, body: Record<string, unknown>) {
  const raw = JSON.stringify(body);
  const ts = String(Math.floor(Date.now() / 1000));
  const sig = createHmac("sha256", secret).update(`${ts}.${raw}`).digest("hex");
  const request = new Request(`https://example.com/api/inbound/${token}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-ProbeHarbor-Timestamp": ts,
      "X-ProbeHarbor-Signature-V2": `sha256=${sig}`,
    },
    body: raw,
  });
  const response = await inboundPost({ params: { token }, request } as unknown as APIContext);
  return { status: response.status, json: (await response.json()) as Record<string, unknown> };
}

type EventRow = { kind: string; body: string; channels_sent: string[]; channels_skipped: string[] };
const eventsOf = (userId: string, kind: string) =>
  sql<EventRow>(
    "select kind, body, channels_sent, channels_skipped from public.alert_events where user_id = $1 and kind = $2 order by id",
    [userId, kind],
  );
const ownHolds = async (userId: string) =>
  (await sql<{ snooze_until: unknown; vacation_until: unknown }>(
    "select snooze_until, vacation_until from public.alert_settings where user_id = $1",
    [userId],
  ))[0];

describe("inbound webhook: household snooze / vacation", () => {
  it("snooze sets only this household's hold, never a member's own settings", async () => {
    const { a, s, ha, hb, token, secret } = await setup();

    const res = await inbound(token, secret, { action: "snooze", hours: 3 });

    expect(res.status).toBe(200);
    expect(res.json).toEqual({ ok: true, action: "snooze", members: 2 });
    const hold = await getHouseholdAlertHold(ha);
    expect(Date.parse(hold.snoozeUntil!) - Date.now()).toBeGreaterThan(2.9 * 3600_000);
    expect(hold.vacationUntil).toBeNull();
    expect(await getHouseholdAlertHold(hb)).toEqual({ snoozeUntil: null, vacationUntil: null });
    expect(await ownHolds(a)).toEqual({ snooze_until: null, vacation_until: null });
    expect(await ownHolds(s)).toEqual({ snooze_until: null, vacation_until: null });

    const status = await inbound(token, secret, { action: "status" });
    expect((status.json.alertHold as Record<string, unknown>).snoozedUntil).toBe(
      new Date(Date.parse(hold.snoozeUntil!)).toISOString(),
    );

    const vac = await inbound(token, secret, { action: "vacation", days: 2 });
    expect(vac.json).toEqual({ ok: true, action: "vacation", members: 2 });
    expect((await getHouseholdAlertHold(ha)).vacationUntil).not.toBeNull();
    expect(await ownHolds(s)).toEqual({ snooze_until: null, vacation_until: null });

    await inbound(token, secret, { action: "clear_snooze" });
    await inbound(token, secret, { action: "clear_vacation" });
    expect(await getHouseholdAlertHold(ha)).toEqual({ snoozeUntil: null, vacationUntil: null });
  });

  it("holds the household's routine alerts for every member; freeze alerts still send", async () => {
    const { a, s, token, secret } = await setup({ aBattery: 5, aTemp: 20 });
    await inbound(token, secret, { action: "snooze", hours: 3 });

    const run = await collectHistoryForAllUsers();
    expect(run.errors).toEqual([]);

    for (const userId of [a, s]) {
      const battery = await eventsOf(userId, "battery");
      expect(battery).toHaveLength(1);
      expect(battery[0]!.body).toContain("HA probe");
      expect(battery[0]!.channels_sent).toEqual([]);
      expect(battery[0]!.channels_skipped).toEqual(["snooze_or_vacation"]);
      // Safety: the freeze in HA reaches both members despite the snooze.
      const freeze = await eventsOf(userId, "threshold");
      expect(freeze).toHaveLength(1);
      expect(freeze[0]!.channels_sent).toEqual(["discord"]);
    }
    // The evaluation never wrote the household hold into anyone's settings.
    expect(await ownHolds(s)).toEqual(expect.objectContaining({ snooze_until: null, vacation_until: null }));
    expect((await getAlertSettingsForUser(s, {})).snoozeUntil).toBeNull();
  });

  it("does not hold the same member's alerts for their other household", async () => {
    const { s, token, secret } = await setup({ bBattery: 5 });
    await inbound(token, secret, { action: "snooze", hours: 3 });
    await inbound(token, secret, { action: "vacation", days: 7 });

    await collectHistoryForAllUsers();

    const battery = await eventsOf(s, "battery");
    expect(battery).toHaveLength(1);
    expect(battery[0]!.body).toContain("HB probe");
    expect(battery[0]!.channels_sent).toEqual(["discord"]);
    expect(fetchMock.mock.calls.filter(([url]) => url === DISCORD_S)).toHaveLength(1);
  });

  it("clear_snooze lifts the hold: the household's alerts send again", async () => {
    const { a, token, secret } = await setup({ aBattery: 5 });
    await inbound(token, secret, { action: "snooze", hours: 3 });
    await inbound(token, secret, { action: "clear_snooze" });

    await collectHistoryForAllUsers();

    const battery = await eventsOf(a, "battery");
    expect(battery).toHaveLength(1);
    expect(battery[0]!.channels_sent).toEqual(["discord"]);
  });

  it("an expired household hold holds nothing", async () => {
    const { a, ha } = await setup({ aBattery: 5 });
    await setHouseholdSnoozeUntil(ha, new Date(Date.now() - 60_000).toISOString());

    await collectHistoryForAllUsers();

    expect((await eventsOf(a, "battery"))[0]!.channels_sent).toEqual(["discord"]);
  });

  it("a member's own snooze still holds their alerts for every household", async () => {
    const { s } = await setup({ bBattery: 5 });
    const own = await getAlertSettingsForUser(s, {});
    await saveAlertSettingsForUser(s, { ...own, snoozeUntil: new Date(Date.now() + 3600_000).toISOString() });

    await collectHistoryForAllUsers();

    const battery = await eventsOf(s, "battery");
    expect(battery).toHaveLength(1);
    expect(battery[0]!.body).toContain("HB probe");
    expect(battery[0]!.channels_skipped).toEqual(["snooze_or_vacation"]);
  });

  it("household vacation holds routine (battery) alerts; freeze still sends", async () => {
    const { s, token, secret } = await setup({ aBattery: 5, aTemp: 20 });
    await inbound(token, secret, { action: "vacation", days: 3 });

    await collectHistoryForAllUsers();

    expect((await eventsOf(s, "battery"))[0]!.channels_skipped).toEqual(["snooze_or_vacation"]);
    expect((await eventsOf(s, "threshold"))[0]!.channels_sent).toEqual(["discord"]);
  });
});

/** POST the dashboard "Resume alerts" form as `userId`; returns the redirect location. */
async function resume(userId: string, fields: Record<string, string>) {
  signedIn.userId = userId;
  const form = new FormData();
  for (const [k, v] of Object.entries(fields)) form.set(k, v);
  const request = new Request("https://example.com/api/user/household-alert-hold", { method: "POST", body: form });
  const redirect = (path: string) => new Response(null, { status: 302, headers: { Location: path } });
  const response = await resumePost({ request, cookies: {}, redirect } as unknown as APIContext);
  return response.headers.get("Location");
}

describe("dashboard resume of the household hold", () => {
  it("an owner lifts only their current household's hold; its alerts send again", async () => {
    const { a, ha, hb, token, secret } = await setup({ aBattery: 5 });
    await inbound(token, secret, { action: "snooze", hours: 3 });
    await inbound(token, secret, { action: "vacation", days: 2 });
    const hbUntil = new Date(Date.now() + 3600_000).toISOString();
    await setHouseholdSnoozeUntil(hb, hbUntil);

    // A household id in the form is ignored: the session's household (HA) is used.
    expect(await resume(a, { action: "clear_snooze", redirect: "/dashboard", household_id: hb })).toBe(
      "/dashboard?snooze_cleared=1",
    );
    expect(await resume(a, { action: "clear_vacation", redirect: "/dashboard" })).toBe("/dashboard?vacation_cleared=1");

    expect(await getHouseholdAlertHold(ha)).toEqual({ snoozeUntil: null, vacationUntil: null });
    expect(Date.parse((await getHouseholdAlertHold(hb)).snoozeUntil!)).toBe(Date.parse(hbUntil));
    expect(await ownHolds(a)).toEqual({ snooze_until: null, vacation_until: null });
    expect(
      await sql("select user_id, action from public.household_activity where household_id = $1 and action like 'household_%' order by action", [ha]),
    ).toEqual([
      { user_id: a, action: "household_snooze_cleared" },
      { user_id: a, action: "household_vacation_cleared" },
    ]);

    await collectHistoryForAllUsers();
    const battery = await eventsOf(a, "battery");
    expect(battery).toHaveLength(1);
    expect(battery[0]!.channels_sent).toEqual(["discord"]);
  });

  it.each(["viewer", "alert_only"] as const)("a %s member is refused and the hold stays", async (role) => {
    const { ha, token, secret } = await setup();
    const v = await insertTestUser(db.client(), `${role}@example.com`);
    await addHouseholdMemberByUserId(ha, v, role);
    await mergeUserMetadata(v, { active_household_id: ha });
    await inbound(token, secret, { action: "snooze", hours: 3 });

    expect(await resume(v, { action: "clear_snooze", redirect: "/dashboard" })).toBe("/dashboard?error=viewer");

    expect((await getHouseholdAlertHold(ha)).snoozeUntil).not.toBeNull();
    expect(
      await sql("select action from public.household_activity where household_id = $1 and action = 'household_snooze_cleared'", [ha]),
    ).toEqual([]);
  });
});

