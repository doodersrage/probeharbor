/**
 * Household / user isolation audit for the device-side Neon modules
 * (src/lib/db/devices.ts, deviceActions.ts, pucks.ts, thermostats.ts,
 * legacyTempConfig.ts, pushTokens.ts, remaining.ts).
 *
 * Each test calls the src/lib/db function directly (not the wrapper in
 * src/lib), so the SQL predicate itself is what is proved: another household
 * or user can neither read nor change the data. Functions already covered by
 * an isolation test elsewhere are not repeated here.
 */
import { describe, expect, it, vi } from "vitest";
import { insertTestUser, useTestDatabase } from "../test/db";

vi.mock("./runtimeEnv", () => ({
  getRuntimeEnv: () => undefined,
  hasRuntimeEnv: () => false,
}));

import * as devices from "./db/devices";
import * as legacy from "./db/legacyTempConfig";
import * as pucks from "./db/pucks";
import * as push from "./db/pushTokens";
import * as remaining from "./db/remaining";
import * as thermostats from "./db/thermostats";

const db = useTestDatabase();
const sql = async <T = Record<string, unknown>>(text: string, params: unknown[] = []) =>
  (await db.client().query(text, params)).rows as T[];

async function home(email: string) {
  const id = await insertTestUser(db.client(), email);
  const [m] = await sql<{ household_id: string }>("select household_id from public.household_members where user_id = $1", [id]);
  return { id, home: m!.household_id };
}

async function device(householdId: string, source: "push" | "pull_url" = "push", name = "Probe") {
  const [d] = await sql<{ id: string }>(
    `insert into public.devices (household_id, name, source, pull_url) values ($1, $2, $3, $4) returning id`,
    [householdId, name, source, source === "pull_url" ? `https://feeds.example/${Math.random()}` : null],
  );
  return d!.id;
}

async function sensor(deviceId: string, key: string, kind = "temperature") {
  const [s] = await sql<{ id: string }>(
    "insert into public.device_sensors (device_id, key, label, kind, unit) values ($1, $2, $2, $3, 'F') returning id",
    [deviceId, key, kind],
  );
  return s!.id;
}

describe("devices.ts: SQL refuses another household's device (isolation audit)", () => {
  it("getDeviceSource returns nothing for another household's device", async () => {
    const a = await home("a@example.com");
    const b = await home("b@example.com");
    const theirs = await device(b.home);
    await expect(devices.getDeviceSource(a.home, theirs)).resolves.toBeNull();
    await expect(devices.getDeviceSource(b.home, theirs)).resolves.toBe("push");
  });

  it("updateDeviceDetails (the SQL, without the wrapper's source check) leaves another household's device alone", async () => {
    const a = await home("a@example.com");
    const b = await home("b@example.com");
    const theirs = await device(b.home, "push", "Theirs");
    await sql("update public.devices set space = 'Shed' where id = $1", [theirs]);

    await expect(devices.updateDeviceDetails(a.home, theirs, true, "Hijacked", false, "Mine")).resolves.toEqual({ error: null });
    expect(await sql("select name, enabled, space from public.devices where id = $1", [theirs])).toEqual([
      { name: "Theirs", enabled: true, space: "Shed" },
    ]);
  });

  it("replaceDeviceSensor refuses a sensor from another household, in either position, and moves no readings", async () => {
    const a = await home("a@example.com");
    const b = await home("b@example.com");
    const mine = await sensor(await device(a.home), "t");
    const theirs = await sensor(await device(b.home), "t");
    await sql("insert into public.sensor_readings (sensor_id, household_id, value_num) values ($1, $2, 40)", [theirs, b.home]);

    const pull = await devices.replaceDeviceSensor(a.home, theirs, mine); // pull their history into my sensor
    expect(pull.error).toContain("sensor_not_found");
    const push = await devices.replaceDeviceSensor(a.home, mine, theirs); // delete mine onto theirs
    expect(push.error).toContain("sensor_not_found");

    expect(await sql("select sensor_id, household_id from public.sensor_readings")).toEqual([
      { sensor_id: theirs, household_id: b.home },
    ]);
    expect((await sql("select id from public.device_sensors order by id")).length).toBe(2);
  });

  it("savePullDevicesForHousehold never updates or deletes another household's pull device with the same URL", async () => {
    const a = await home("a@example.com");
    const b = await home("b@example.com");
    const url = "https://shared.example/feed";
    const [theirs] = await sql<{ id: string }>(
      "insert into public.devices (household_id, name, source, pull_url) values ($1, 'Theirs', 'pull_url', $2) returning id",
      [b.home, url],
    );
    const theirSensor = await sensor(theirs!.id, "0");

    const feed = { id: "f1", name: "Mine", url, enabled: false, jsonRoot: "temp" };
    await expect(devices.savePullDevicesForHousehold(a.home, [feed], [])).resolves.toEqual({ error: null });
    await expect(devices.savePullDevicesForHousehold(a.home, [], [])).resolves.toEqual({ error: null });

    expect(await sql("select name, enabled, household_id from public.devices where id = $1", [theirs!.id])).toEqual([
      { name: "Theirs", enabled: true, household_id: b.home },
    ]);
    expect(await sql("select 1 from public.device_sensors where id = $1", [theirSensor])).toHaveLength(1);
  });
});

describe("legacyTempConfig.ts: per user / per household (isolation audit)", () => {
  async function legacyRows(userId: string, url: string) {
    await sql("insert into public.user_temp_feeds (user_id, feed_id, name, url, enabled, sort_order) values ($1, 'f1', 'Feed', $2, true, 0)", [
      userId,
      url,
    ]);
    await sql(
      "insert into public.user_temp_probes (user_id, probe_id, feed_id, probe_key, label, visible, sort_order) values ($1, 'p0', 'f1', '0', 'Bay', true, 0)",
      [userId],
    );
  }

  it("legacyFeeds / legacyProbes read only the user's rows; clearLegacy removes only theirs", async () => {
    const a = await home("a@example.com");
    const b = await home("b@example.com");
    await legacyRows(a.id, "https://a.example/feed");
    await legacyRows(b.id, "https://b.example/feed");

    expect((await legacy.legacyFeeds(a.id)).map((f) => f.url)).toEqual(["https://a.example/feed"]);
    expect(await legacy.legacyProbes(a.id)).toHaveLength(1);

    await legacy.clearLegacy(a.id);
    await expect(legacy.legacyFeeds(a.id)).resolves.toEqual([]);
    await expect(legacy.legacyProbes(a.id)).resolves.toEqual([]);
    expect((await legacy.legacyFeeds(b.id)).map((f) => f.url)).toEqual(["https://b.example/feed"]);
    expect(await legacy.legacyProbes(b.id)).toHaveLength(1);
    await expect(legacy.usersWithLegacyFeeds()).resolves.toEqual([b.id]);
  });

  it("updatePullDevice leaves another household's device alone", async () => {
    const a = await home("a@example.com");
    const b = await home("b@example.com");
    const theirs = await device(b.home, "pull_url", "Theirs");
    await legacy.updatePullDevice(a.home, theirs, { name: "Hijacked", enabled: false }, 9, "x");
    expect(await sql("select name, enabled, sort_order, meta from public.devices where id = $1", [theirs])).toEqual([
      { name: "Theirs", enabled: true, sort_order: 0, meta: {} },
    ]);
  });
});

describe("pucks.ts: SQL scoped to the household (isolation audit)", () => {
  const DEVICE = "0123456789abcdef0123456789abcdef";

  it("bindClaimedBay with a valid nonce but another household binds nothing", async () => {
    const a = await home("a@example.com");
    const b = await home("b@example.com");
    await expect(pucks.registerPuck(DEVICE, "a".repeat(64), a.home, a.id)).resolves.toBe("ok");
    const expires = new Date(Date.now() + 60_000).toISOString();
    await pucks.savePendingClaim(DEVICE, "bay-1", "ab".repeat(16), expires);

    await expect(pucks.bindClaimedBay(DEVICE, b.home, "bay-1", "ab".repeat(16), "Theirs")).resolves.toBe("gone");
    await expect(pucks.getPuck(DEVICE)).resolves.toMatchObject({ household_id: a.home, bay_id: null, space_name: null });
  });

  it("bayPuck and setMoodOverride only see the household's own bay", async () => {
    const a = await home("a@example.com");
    const b = await home("b@example.com");
    await pucks.registerPuck(DEVICE, "a".repeat(64), a.home, a.id);
    await sql("update public.pucks set bay_id = 'bay-1', space_name = 'Garage' where device_id = $1", [DEVICE]);

    await expect(pucks.bayPuck(b.home, "bay-1")).resolves.toBeNull();
    await expect(pucks.setMoodOverride(b.home, "bay-1", "panic")).resolves.toBe(false);
    await expect(pucks.bayPuck(a.home, "bay-1")).resolves.toEqual({ space_name: "Garage", mood_override: null, mood_override_at: null });
  });

  it("firstOwnerAlertSettings returns the household's own owner, never another household's", async () => {
    const a = await home("a@example.com");
    const b = await home("b@example.com");
    await sql("insert into public.alert_settings (user_id) values ($1)", [b.id]);
    await expect(pucks.firstOwnerAlertSettings(a.home)).resolves.toBeNull();
    await expect(pucks.firstOwnerAlertSettings(b.home)).resolves.toMatchObject({ user_id: b.id });
  });
});

describe("thermostats.ts (isolation audit)", () => {
  it("saveConnection for one household never overwrites another's connection", async () => {
    const a = await home("a@example.com");
    const b = await home("b@example.com");
    const base = { provider: "nest", accessToken: null, accessTokenExpiresAt: null, externalDeviceId: null, connectedBy: null };
    await thermostats.saveConnection({ ...base, householdId: a.home, refreshToken: "a-secret" });
    await thermostats.saveConnection({ ...base, householdId: b.home, refreshToken: "b-secret" });
    expect((await thermostats.getConnection(a.home, "nest"))?.refresh_token).toBe("a-secret");
    expect((await thermostats.getConnection(b.home, "nest"))?.refresh_token).toBe("b-secret");
    expect((await thermostats.listConnections(b.home)).map((c) => c.household_id)).toEqual([b.home]);
  });
});

describe("pushTokens.ts: one user's registrations (isolation audit)", () => {
  const TOKEN = "fcm-token-0123456789abcdef";

  it("listPushSubscriptions / listFcmTokens / countFcmTokens see only the user's rows", async () => {
    const a = await home("a@example.com");
    const b = await home("b@example.com");
    await push.savePushSubscription(b.id, "https://push.example/b", "k", "s");
    await push.saveFcmToken(b.id, TOKEN, "android", null);
    await expect(push.listPushSubscriptions(a.id)).resolves.toEqual([]);
    await expect(push.listFcmTokens(a.id)).resolves.toEqual([]);
    await expect(push.countFcmTokens(a.id)).resolves.toBe(0);
    await expect(push.listFcmTokens(b.id)).resolves.toEqual([{ token: TOKEN }]);
  });

  it("savePushSubscription / saveFcmToken for the same endpoint/token don't change another user's row", async () => {
    const a = await home("a@example.com");
    const b = await home("b@example.com");
    await push.savePushSubscription(b.id, "https://push.example/x", "b-key", "b-auth");
    await push.saveFcmToken(b.id, TOKEN, "android", "b.app");
    // Without the route's hand-off delete, saving as A adds A's own row only.
    await push.savePushSubscription(a.id, "https://push.example/x", "a-key", "a-auth");
    await push.saveFcmToken(a.id, TOKEN, "ios", "a.app");
    await expect(push.listPushSubscriptions(b.id)).resolves.toEqual([{ endpoint: "https://push.example/x", p256dh: "b-key", auth: "b-auth" }]);
    expect(await sql("select platform, app_id from public.fcm_device_tokens where user_id = $1", [b.id])).toEqual([
      { platform: "android", app_id: "b.app" },
    ]);
  });

  it("deletePushSubscription / deleteFcmToken (the SQL) remove only the caller's row", async () => {
    const a = await home("a@example.com");
    const b = await home("b@example.com");
    await push.savePushSubscription(b.id, "https://push.example/b", "k", "s");
    await push.saveFcmToken(b.id, TOKEN, "android", null);
    await push.deletePushSubscription(a.id, "https://push.example/b");
    await push.deleteFcmToken(a.id, TOKEN);
    await expect(push.listPushSubscriptions(b.id)).resolves.toHaveLength(1);
    await expect(push.countFcmTokens(b.id)).resolves.toBe(1);
  });
});

describe("remaining.ts (isolation audit)", () => {
  it("freeze-estimate snapshots are per household: reading or saving one never touches another's", async () => {
    const a = await home("a@example.com");
    const b = await home("b@example.com");
    await remaining.saveEstimateSnapshot(b.home, { v: "b" }, "2026-11-01T00:00:00.000Z");
    await expect(remaining.getEstimateSnapshot(a.home)).resolves.toBeNull();
    await remaining.saveEstimateSnapshot(a.home, { v: "a" }, "2026-11-02T00:00:00.000Z");
    await expect(remaining.getEstimateSnapshot(b.home)).resolves.toMatchObject({ data: { v: "b" } });
  });

  it("stampPortfolioAlert stamps only that user", async () => {
    const a = await home("a@example.com");
    const b = await home("b@example.com");
    await sql("insert into public.alert_settings (user_id) values ($1), ($2)", [a.id, b.id]);
    await remaining.stampPortfolioAlert(a.id);
    const rows = await sql<{ user_id: string; stamped: boolean }>(
      "select user_id, last_portfolio_alert_at is not null as stamped from public.alert_settings",
    );
    expect(Object.fromEntries(rows.map((r) => [r.user_id, r.stamped]))).toEqual({ [a.id]: true, [b.id]: false });
  });

  it("a Telegram secret two users share resolves to nobody", async () => {
    const a = await home("a@example.com");
    const b = await home("b@example.com");
    await sql("insert into public.alert_settings (user_id, telegram_command_secret) values ($1, 'dup'), ($2, 'dup')", [a.id, b.id]);
    await expect(remaining.userByTelegramSecret("dup")).resolves.toBeNull();
  });

  it("setDigestOptIn for a household the user isn't in changes nothing anywhere", async () => {
    const a = await home("a@example.com");
    const b = await home("b@example.com");
    await expect(remaining.setDigestOptIn(b.home, a.id, true)).resolves.toEqual({ error: null });
    expect(await sql("select count(*)::int as n from public.household_members where digest_opt_in")).toEqual([{ n: 0 }]);
    await expect(remaining.getDigestOptIn(b.home, a.id)).resolves.toBeNull();
  });
});
