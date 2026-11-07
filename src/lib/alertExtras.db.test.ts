import { describe, expect, it, vi } from "vitest";
import { insertTestUser, useTestDatabase } from "../test/db";

vi.mock("./runtimeEnv", () => ({
  getRuntimeEnv: () => undefined,
  hasRuntimeEnv: () => false,
}));

import { DEFAULT_ALERT_SETTINGS } from "./alerts";
import {
  HISTORY_KEEP,
  listAlertSettingsHistory,
  recordAlertSettingsChange,
  restoreAlertSettings,
} from "./alertSettingsHistory";
import {
  applySnoozeForHouseholdMembers,
  applySnoozeToken,
  clearSnoozeForHouseholdMembers,
  createSnoozeToken,
  sha256Hex,
} from "./alertSnoozeTokens";
import { addHouseholdMemberByUserId } from "./households";
import { getAlertSettingsForUser, saveAlertSettingsForUser } from "./notify";
import { listRecentWebhookDeliveries, recordWebhookDelivery } from "./webhookDeliveries";

const db = useTestDatabase();
const sql = async <T = Record<string, unknown>>(text: string, params: unknown[] = []) =>
  (await db.client().query(text, params)).rows as T[];

describe("alert settings history (Neon)", () => {
  it("keeps the newest saves only, newest first, and restores one", async () => {
    const userId = await insertTestUser(db.client(), "a@example.com");
    await saveAlertSettingsForUser(userId, DEFAULT_ALERT_SETTINGS);
    for (let i = 0; i < HISTORY_KEEP + 5; i += 1) {
      await recordAlertSettingsChange(
        userId,
        { ...DEFAULT_ALERT_SETTINGS, freezeThresholdF: 30 + i },
        { ...DEFAULT_ALERT_SETTINGS, freezeThresholdF: 31 + i },
      );
    }
    const [{ n }] = (await sql<{ n: number }>("select count(*) as n from public.alert_settings_history where user_id = $1", [
      userId,
    ])) as [{ n: number }];
    expect(n).toBe(HISTORY_KEEP);

    const list = await listAlertSettingsHistory(userId, 3);
    expect(list).toHaveLength(3);
    expect(list[0]?.changes.join(" ")).toContain(String(30 + HISTORY_KEEP + 5));

    // The newest entry kept the version before it: threshold 30 + 24.
    await expect(restoreAlertSettings(userId, list[0]!.id)).resolves.toEqual({ error: null });
    expect((await getAlertSettingsForUser(userId, {})).freezeThresholdF).toBe(30 + HISTORY_KEEP + 4);
  });

  it("a restore can't use another user's history", async () => {
    const a = await insertTestUser(db.client(), "a@example.com");
    const b = await insertTestUser(db.client(), "b@example.com");
    await saveAlertSettingsForUser(b, DEFAULT_ALERT_SETTINGS);
    await recordAlertSettingsChange(b, { ...DEFAULT_ALERT_SETTINGS, enabled: true }, DEFAULT_ALERT_SETTINGS);
    const [theirs] = await listAlertSettingsHistory(b, 1);
    await expect(restoreAlertSettings(a, theirs!.id)).resolves.toEqual({ error: "not_found" });
    expect(await listAlertSettingsHistory(a)).toEqual([]);
  });
});

describe("snooze links (Neon)", () => {
  it("a link snoozes once; a second use is refused", async () => {
    const userId = await insertTestUser(db.client(), "a@example.com");
    await saveAlertSettingsForUser(userId, DEFAULT_ALERT_SETTINGS);
    const token = await createSnoozeToken(userId, 6);
    const [stored] = await sql<{ token: string }>("select token from public.alert_snooze_tokens where user_id = $1", [userId]);
    expect(stored?.token).toBe(await sha256Hex(token)); // only the hash is stored

    const first = await applySnoozeToken(token);
    expect(first.ok).toBe(true);
    const snoozed = (await getAlertSettingsForUser(userId, {})).snoozeUntil;
    expect(Date.parse(snoozed!) - Date.now()).toBeGreaterThan(5 * 3600_000);
    expect((await applySnoozeToken(token)).ok).toBe(false);
  });

  it("three clicks at once: exactly one snoozes", async () => {
    const userId = await insertTestUser(db.client(), "a@example.com");
    await saveAlertSettingsForUser(userId, DEFAULT_ALERT_SETTINGS);
    const token = await createSnoozeToken(userId, 2);
    const results = await Promise.all([applySnoozeToken(token), applySnoozeToken(token), applySnoozeToken(token)]);
    expect(results.filter((r) => r.ok)).toHaveLength(1);
  });

  it("expired and unknown links say so, and change nothing", async () => {
    const userId = await insertTestUser(db.client(), "a@example.com");
    await saveAlertSettingsForUser(userId, DEFAULT_ALERT_SETTINGS);
    const token = await createSnoozeToken(userId, 2);
    await sql("update public.alert_snooze_tokens set expires_at = now() - interval '1 minute' where user_id = $1", [userId]);

    const expired = await applySnoozeToken(token);
    const unknown = await applySnoozeToken("f".repeat(32));
    expect(expired.ok).toBe(false);
    expect(unknown.ok).toBe(false);
    expect(expired.message).not.toBe(unknown.message);
    expect((await getAlertSettingsForUser(userId, {})).snoozeUntil).toBeNull();
  });

  it("household snooze reaches that household's members only", async () => {
    const owner = await insertTestUser(db.client(), "owner@example.com");
    const member = await insertTestUser(db.client(), "member@example.com");
    const outsider = await insertTestUser(db.client(), "out@example.com");
    const [h] = await sql<{ household_id: string }>(
      "select household_id from public.household_members where user_id = $1",
      [owner],
    );
    await addHouseholdMemberByUserId(h!.household_id, member, "member");
    for (const u of [owner, member, outsider]) await saveAlertSettingsForUser(u, DEFAULT_ALERT_SETTINGS);

    await expect(applySnoozeForHouseholdMembers(h!.household_id, 3)).resolves.toBe(2);
    expect((await getAlertSettingsForUser(owner, {})).snoozeUntil).not.toBeNull();
    expect((await getAlertSettingsForUser(member, {})).snoozeUntil).not.toBeNull();
    expect((await getAlertSettingsForUser(outsider, {})).snoozeUntil).toBeNull();

    await expect(clearSnoozeForHouseholdMembers(h!.household_id)).resolves.toBe(2);
    expect((await getAlertSettingsForUser(member, {})).snoozeUntil).toBeNull();
  });
});

describe("webhook delivery log (Neon)", () => {
  it("records only the host and lists the user's own entries, newest first", async () => {
    const a = await insertTestUser(db.client(), "a@example.com");
    const b = await insertTestUser(db.client(), "b@example.com");
    await recordWebhookDelivery({
      userId: a,
      webhookType: "outbound_alert",
      url: "https://hooks.example.com/secret/path?token=abc",
      statusCode: 500,
      success: false,
      errorMessage: "Server error",
      durationMs: 120,
    });
    await recordWebhookDelivery({ userId: a, webhookType: "reading", url: "https://n8n.example.org/x", statusCode: 200, success: true });
    await recordWebhookDelivery({ userId: b, webhookType: "reading", url: "https://other.example/x", statusCode: 200, success: true });
    await recordWebhookDelivery({ userId: null, webhookType: "reading", url: "https://x.example/", statusCode: 200, success: true });

    const rows = await listRecentWebhookDeliveries(a);
    expect(rows.map((r) => r.url_host).sort()).toEqual(["hooks.example.com", "n8n.example.org"]);
    expect(rows.find((r) => r.url_host === "hooks.example.com")).toMatchObject({ status_code: 500, success: false, duration_ms: 120 });
    const [{ n }] = (await sql<{ n: number }>("select count(*) as n from public.webhook_deliveries")) as [{ n: number }];
    expect(n).toBe(3);
  });
});
