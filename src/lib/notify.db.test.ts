import { describe, expect, it, vi } from "vitest";
import { insertTestUser, useTestDatabase } from "../test/db";

vi.mock("./runtimeEnv", () => ({
  getRuntimeEnv: () => undefined,
  hasRuntimeEnv: () => false,
}));

import { DEFAULT_ALERT_SETTINGS, type AlertSettings } from "./alerts";
import {
  claimCooldown,
  ensureAlertDeliveryEvidence,
  getAlertSettingsForUser,
  markCooldown,
  markEscalation,
  releaseCooldown,
  saveAlertSettingsForUser,
} from "./notify";

const db = useTestDatabase();
const sql = async <T = Record<string, unknown>>(text: string, params: unknown[] = []) =>
  (await db.client().query(text, params)).rows as T[];

const column = async (userId: string, name: string) =>
  (await sql<Record<string, unknown>>(`select ${name} as v from public.alert_settings where user_id = $1`, [userId]))[0]?.v;

describe("alert settings (Neon)", () => {
  it("first load stores the defaults; later loads read them back", async () => {
    const userId = await insertTestUser(db.client(), "a@example.com");
    const first = await getAlertSettingsForUser(userId, {});
    expect(first.freezeThresholdF).toBe(DEFAULT_ALERT_SETTINGS.freezeThresholdF);
    expect(await sql("select 1 from public.alert_settings where user_id = $1", [userId])).toHaveLength(1);
    await expect(getAlertSettingsForUser(userId, {})).resolves.toEqual(first);
  });

  it("every field survives a save and load, of every type", async () => {
    const userId = await insertTestUser(db.client(), "a@example.com");
    const settings: AlertSettings = {
      ...DEFAULT_ALERT_SETTINGS,
      enabled: true,
      freezeThresholdF: 33.5,
      email: "alerts@example.com",
      channelSms: true,
      smsPhone: "+15555550100",
      quietHoursEnabled: true,
      quietHoursStart: "23:00",
      alertRules: [{ id: "r1", name: "Pipe cold", enabled: true, match: "all", all: [{ type: "temp_below", value: 33 }] } as never],
      channelSeverity: { threshold: ["email", "sms"] } as never,
      snoozeUntil: "2026-12-01T05:00:00.123+00:00",
      batteryThresholdPct: 15,
      rssiThreshold: -85,
      lastRunwayAlertAt: "2026-11-07T13:22:38.104+00:00",
    };
    await expect(saveAlertSettingsForUser(userId, settings)).resolves.toEqual({ error: null });
    const loaded = await getAlertSettingsForUser(userId, {});
    expect(loaded).toMatchObject({
      enabled: true,
      freezeThresholdF: 33.5,
      email: "alerts@example.com",
      channelSms: true,
      quietHoursStart: "23:00",
      channelSeverity: { threshold: ["email", "sms"] },
      batteryThresholdPct: 15,
      rssiThreshold: -85,
    });
    expect(Date.parse(loaded.snoozeUntil!)).toBe(Date.parse(settings.snoozeUntil!));
    expect(loaded.alertRules).toEqual([
      expect.objectContaining({ id: "r1", name: "Pipe cold", all: [expect.objectContaining({ type: "temp_below", value: 33 })] }),
    ]);

    // A second save replaces values (including back to null).
    await saveAlertSettingsForUser(userId, { ...loaded, snoozeUntil: null, email: null });
    expect(await getAlertSettingsForUser(userId, {})).toMatchObject({ snoozeUntil: null, email: null });
  });

  it("saving one user's settings never changes another's", async () => {
    const a = await insertTestUser(db.client(), "a@example.com");
    const b = await insertTestUser(db.client(), "b@example.com");
    await saveAlertSettingsForUser(b, { ...DEFAULT_ALERT_SETTINGS, freezeThresholdF: 40 });
    await saveAlertSettingsForUser(a, { ...DEFAULT_ALERT_SETTINGS, freezeThresholdF: 30 });
    expect((await getAlertSettingsForUser(b, {})).freezeThresholdF).toBe(40);
  });
});

describe("cooldowns (Neon)", () => {
  it("markCooldown stamps the field, creating the row if needed, and leaves other settings", async () => {
    const userId = await insertTestUser(db.client(), "a@example.com");
    await markCooldown(userId, "last_alert_sent_at"); // no row yet
    expect(await column(userId, "last_alert_sent_at")).toBeTruthy();

    await saveAlertSettingsForUser(userId, { ...DEFAULT_ALERT_SETTINGS, freezeThresholdF: 31 });
    await markCooldown(userId, "last_flood_alert_at");
    expect(await column(userId, "last_flood_alert_at")).toBeTruthy();
    expect(await column(userId, "freeze_threshold_f")).toBe(31);
  });

  it("of five simultaneous claims from the same value, exactly one wins", async () => {
    const userId = await insertTestUser(db.client(), "a@example.com");
    await saveAlertSettingsForUser(userId, DEFAULT_ALERT_SETTINGS);
    const previous = (await getAlertSettingsForUser(userId, {})).lastRunwayAlertAt; // null

    const results = await Promise.all(
      Array.from({ length: 5 }, () => claimCooldown(userId, "last_runway_alert_at", previous)),
    );
    expect(results.filter((r) => r.claimed)).toHaveLength(1);
    expect(results.filter((r) => r.claimed && r.claimedAt)).toHaveLength(1);
  });

  it("a claim from a stale value loses; from the current stored value (full precision) it wins", async () => {
    const userId = await insertTestUser(db.client(), "a@example.com");
    await saveAlertSettingsForUser(userId, DEFAULT_ALERT_SETTINGS);
    await sql("update public.alert_settings set last_flood_alert_at = '2026-11-07 10:00:00.123456+00' where user_id = $1", [
      userId,
    ]);
    const stored = (await getAlertSettingsForUser(userId, {})).lastFloodAlertAt;
    expect(stored).toBe("2026-11-07T10:00:00.123456+00:00");

    await expect(claimCooldown(userId, "last_flood_alert_at", "2026-11-07T09:00:00+00:00")).resolves.toEqual({
      claimed: false,
      claimedAt: null,
    });
    const won = await claimCooldown(userId, "last_flood_alert_at", stored);
    expect(won.claimed).toBe(true);
    expect(won.claimedAt).toBeTruthy();
  });

  it("release undoes only its own claim, so the alert can retry", async () => {
    const userId = await insertTestUser(db.client(), "a@example.com");
    await saveAlertSettingsForUser(userId, DEFAULT_ALERT_SETTINGS);
    const claim = await claimCooldown(userId, "last_power_alert_at", null);
    await releaseCooldown(userId, "last_power_alert_at", claim.claimedAt!, null);
    expect(await column(userId, "last_power_alert_at")).toBeNull();
    expect((await claimCooldown(userId, "last_power_alert_at", null)).claimed).toBe(true);

    // A release with someone else's claim time changes nothing.
    await releaseCooldown(userId, "last_power_alert_at", "2020-01-01T00:00:00Z", null);
    expect(await column(userId, "last_power_alert_at")).not.toBeNull();
  });

  it("with no settings row, a claim fails open (sends) instead of skipping", async () => {
    const userId = await insertTestUser(db.client(), "a@example.com");
    await expect(claimCooldown(userId, "last_alert_sent_at", null)).resolves.toEqual({ claimed: true, claimedAt: null });
  });

  it("refuses a field name that isn't a cooldown", async () => {
    const userId = await insertTestUser(db.client(), "a@example.com");
    await saveAlertSettingsForUser(userId, DEFAULT_ALERT_SETTINGS);
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    await markCooldown(userId, "email" as never);
    expect(await column(userId, "email")).toBeNull();
    spy.mockRestore();
  });
});

describe("escalation and delivery evidence (Neon)", () => {
  it("markEscalation stamps only that user's row", async () => {
    const a = await insertTestUser(db.client(), "a@example.com");
    const b = await insertTestUser(db.client(), "b@example.com");
    await saveAlertSettingsForUser(a, DEFAULT_ALERT_SETTINGS);
    await saveAlertSettingsForUser(b, DEFAULT_ALERT_SETTINGS);
    await markEscalation(a);
    expect(await column(a, "last_escalation_at")).toBeTruthy();
    expect(await column(b, "last_escalation_at")).toBeNull();
  });

  it("delivery evidence comes from a recent alert that reached a channel", async () => {
    const userId = await insertTestUser(db.client(), "a@example.com");
    expect((await ensureAlertDeliveryEvidence(userId, DEFAULT_ALERT_SETTINGS)).hasDelivery).toBe(false);
    await sql("insert into public.alert_events (user_id, kind, title, body, channels_sent) values ($1, 'generic', 't', 'b', '{email}')", [
      userId,
    ]);
    expect((await ensureAlertDeliveryEvidence(userId, DEFAULT_ALERT_SETTINGS)).hasDelivery).toBe(true);
  });
});

describe("alert settings read as one jsonb value", () => {
  it("returns exactly what select * returned, for a fully populated row", async () => {
    const { query } = await import("./db/client");
    const { getAlertSettingsRow } = await import("./db/alertSettings");
    const userId = await insertTestUser(db.client(), "a@example.com");
    await getAlertSettingsForUser(userId, {}); // creates the row

    // Give every column a non-default value of its type (skip any a check rejects).
    const columns = await sql<{ column_name: string; data_type: string }>(
      `select column_name, data_type from information_schema.columns
       where table_schema = 'public' and table_name = 'alert_settings' and column_name <> 'user_id'`,
    );
    const sample: Record<string, string> = {
      "timestamp with time zone": "2026-11-07 10:00:00.123456+00",
      "timestamp without time zone": "2026-11-07 10:00:00.123456",
      numeric: "1.25",
      "double precision": "2.5",
      integer: "7",
      smallint: "3",
      bigint: "9",
      boolean: "true",
      jsonb: '{"a": [1, "x"], "b": {"c": null}}',
      json: '{"a": 1}',
      text: "x",
      ARRAY: "{a,b}",
    };
    let populated = 0;
    for (const { column_name, data_type } of columns) {
      const value = sample[data_type];
      if (value === undefined) continue;
      try {
        await sql(`update public.alert_settings set "${column_name}" = $2 where user_id = $1`, [userId, value]);
        populated += 1;
      } catch {
        // a check constraint (e.g. HH:MM text) rejects the sample; that column keeps its default
      }
    }
    expect(populated).toBeGreaterThan(60);

    const [viaSelectStar] = await query<Record<string, unknown>>("select * from public.alert_settings where user_id = $1", [
      userId,
    ]);
    expect(await getAlertSettingsRow(userId)).toEqual(viaSelectStar);
    expect(await getAlertSettingsRow("00000000-0000-0000-0000-000000000000")).toBeNull();
  });
});
