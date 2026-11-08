/**
 * Status-subscription tokens and the Telegram command secret are stored
 * hashed (migration 0004 converts the plaintext ones). Covers the code before
 * 0004 has run (legacy plaintext rows still work), what 0004 does to seeded
 * plaintext rows, and that links and secrets keep working after it.
 */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import type { APIContext } from "astro";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { insertTestUser, useTestDatabase } from "../test/db";

const env = vi.hoisted(() => ({ values: {} as Record<string, string | undefined> }));
vi.mock("./runtimeEnv", () => ({
  getRuntimeEnv: (key: string) => env.values[key],
  hasRuntimeEnv: (key: string) => Boolean(env.values[key]),
}));

// The link secret is read from the build env (import.meta.env) before the
// runtime env mocked above, and CI sets CRON_SECRET there: clear it so each
// test decides whether a secret exists.
beforeEach(() => {
  vi.stubEnv("ALERT_ACK_SECRET", "");
  vi.stubEnv("CRON_SECRET", "");
});
afterEach(() => {
  vi.unstubAllEnvs();
});

const sent = vi.hoisted(() => [] as Array<{ to: string; text: string }>);
vi.mock("./mailer", () => ({
  sendEmail: async (to: string, _subject: string, text: string) => {
    sent.push({ to, text });
  },
}));
const health = vi.hoisted(() => ({ healthy: true }));
vi.mock("./appStatus", () => ({ fetchAppStatusSummary: async () => ({ healthy: health.healthy }) }));

import { POST as telegramWebhook } from "../pages/api/telegram/webhook";
import { buildAlertSettingsFromFormData } from "./alertSettingsForm";
import { recordAlertSettingsChange, restoreAlertSettings } from "./alertSettingsHistory";
import { writeLastKnownHealthy } from "./db/statusPages";
import type { Entitlements } from "./entitlements";
import { getAlertSettingsForUser, saveAlertSettingsForUser } from "./notify";
import { checkAndNotifyStatusSubscribers } from "./statusNotify";
import {
  confirmStatusSubscription,
  subscribeToStatusUpdates,
  unsubscribeStatusSubscription,
} from "./statusSubscriptions";

const db = useTestDatabase();
const sql = async <T = Record<string, unknown>>(text: string, params: unknown[] = []) =>
  (await db.client().query(text, params)).rows as T[];

const sha = (v: string) => createHash("sha256").update(v, "utf8").digest("hex");
const MIGRATION_0004 = readFileSync(
  path.resolve(__dirname, "../../db/migrations/0004_hash_status_and_telegram_secrets.sql"),
  "utf8",
);
const run0004 = () => db.client().query(MIGRATION_0004);

function lastLink(kind: "confirm" | "unsubscribe", to?: string): string {
  const mail = [...sent].reverse().find((m) => !to || m.to === to);
  const token = new RegExp(`/api/status/${kind}\\?token=([^\\s"&<]+)`).exec(mail?.text ?? "")?.[1];
  if (!token) throw new Error(`no ${kind} link emailed`);
  return token;
}

async function webhook(secret: string): Promise<number> {
  const request = new Request("https://example.com/api/telegram/webhook", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Telegram-Bot-Api-Secret-Token": secret },
    body: "{}",
  });
  const res = await telegramWebhook({
    request,
    url: new URL(request.url),
    clientAddress: `198.51.100.${Math.floor(Math.random() * 250)}`,
  } as unknown as APIContext);
  return res.status;
}

const SECRET = "abcdefghijklmnop-1234_XYZ";

describe("status subscription tokens are stored hashed", () => {
  it("a new subscription stores no plaintext; confirm and unsubscribe work by hash", async () => {
    sent.length = 0;
    await subscribeToStatusUpdates("new@example.com");
    const token = lastLink("confirm");
    expect(await sql("select token, token_hash from public.status_subscriptions")).toEqual([
      { token: null, token_hash: sha(token) },
    ]);
    expect((await confirmStatusSubscription(token)).ok).toBe(true);
    expect((await unsubscribeStatusSubscription(token)).ok).toBe(true);
    expect(await sql("select id from public.status_subscriptions")).toEqual([]);
  });

  it("legacy plaintext rows still confirm and unsubscribe before 0004", async () => {
    await sql("insert into public.status_subscriptions (email, token) values ('old@example.com', 'legacy-token-1')");
    expect((await confirmStatusSubscription("legacy-token-1")).ok).toBe(true);
    expect((await unsubscribeStatusSubscription("legacy-token-1")).ok).toBe(true);
    expect(await sql("select id from public.status_subscriptions")).toEqual([]);
  });

  it("the notifier's signed links unsubscribe exactly their own subscriber, before and after 0004", async () => {
    env.values = { CRON_SECRET: "test-cron-secret" };
    try {
      await sql(
        `insert into public.status_subscriptions (email, token, confirmed_at)
         values ('legacy@example.com', 'legacy-tok', now())`,
      );
      sent.length = 0;
      await subscribeToStatusUpdates("fresh@example.com");
      await confirmStatusSubscription(lastLink("confirm"));

      await writeLastKnownHealthy(true);
      health.healthy = false;
      sent.length = 0;
      const result = await checkAndNotifyStatusSubscribers();
      expect(result).toMatchObject({ changed: true, sent: 2, errors: [] });
      const legacyLink = lastLink("unsubscribe", "legacy@example.com");
      const freshLink = lastLink("unsubscribe", "fresh@example.com");
      expect(legacyLink).toMatch(/^[0-9a-f-]{36}\.[0-9a-f]{64}$/);
      expect(legacyLink).not.toContain("legacy-tok"); // nothing stored is put in a link

      await run0004();
      expect((await unsubscribeStatusSubscription(freshLink)).ok).toBe(true);
      expect(await sql("select email from public.status_subscriptions")).toEqual([{ email: "legacy@example.com" }]);
      // The token emailed before the change still works after 0004, by its hash.
      expect((await unsubscribeStatusSubscription("legacy-tok")).ok).toBe(true);
      expect(await sql("select email from public.status_subscriptions")).toEqual([]);
      expect((await unsubscribeStatusSubscription(legacyLink)).ok).toBe(false); // row gone: link is spent
    } finally {
      env.values = {};
      health.healthy = true;
    }
  });

  it("without a signing secret the notifier still sends a working link (fresh token, hash stored)", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    await sql("insert into public.status_subscriptions (email, token, confirmed_at) values ('a@example.com', 'tok-a', now())");
    await writeLastKnownHealthy(true);
    health.healthy = false;
    sent.length = 0;
    try {
      await checkAndNotifyStatusSubscribers();
    } finally {
      health.healthy = true;
    }
    const link = lastLink("unsubscribe");
    expect(link).toMatch(/^[0-9a-f]{48}$/);
    const [row] = await sql<{ token: string | null; token_hash: string }>("select token, token_hash from public.status_subscriptions");
    expect(row).toEqual({ token: "tok-a", token_hash: sha(link) }); // raw legacy token left for 0004
    await run0004();
    expect(await sql("select token from public.status_subscriptions")).toEqual([{ token: null }]);
    expect((await unsubscribeStatusSubscription(link)).ok).toBe(true);
  });
});

describe("Telegram command secret is stored hashed", () => {
  async function userWithBot(email: string) {
    const id = await insertTestUser(db.client(), email);
    const settings = await getAlertSettingsForUser(id, {});
    await saveAlertSettingsForUser(id, { ...settings, telegramBotToken: "123:abc" });
    return id;
  }

  function saveForm(existing: Awaited<ReturnType<typeof getAlertSettingsForUser>>, secret: string) {
    const form = new FormData();
    form.set("telegram_command_secret", secret);
    return buildAlertSettingsFromFormData(form, existing, { tier: "free" } as Entitlements);
  }

  it("saving stores sha256:<hex>; the webhook matches the hashed row; an empty input keeps it", async () => {
    const id = await userWithBot("a@example.com");
    const before = await getAlertSettingsForUser(id);
    const settings = saveForm(before, SECRET);
    expect(settings.telegramCommandSecret).toBe(SECRET); // the weak-secret check sees the entered value
    await saveAlertSettingsForUser(id, settings);
    await recordAlertSettingsChange(id, before, settings);

    const [row] = await sql<{ telegram_command_secret: string }>("select telegram_command_secret from public.alert_settings");
    expect(row?.telegram_command_secret).toBe(`sha256:${sha(SECRET)}`);
    expect(await webhook(SECRET)).toBe(200);
    expect(await webhook("wrong-secret-0123456789")).toBe(401);
    expect(await webhook(row!.telegram_command_secret)).toBe(401); // a leaked hash isn't the secret

    const kept = saveForm(await getAlertSettingsForUser(id), "");
    await saveAlertSettingsForUser(id, kept);
    expect(await webhook(SECRET)).toBe(200);
    expect(await sql("select telegram_command_secret from public.alert_settings")).toEqual([
      { telegram_command_secret: `sha256:${sha(SECRET)}` },
    ]);
  });

  it("history never stores the plaintext; restoring puts the hash back (no double hashing)", async () => {
    const id = await userWithBot("b@example.com");
    const v1 = await getAlertSettingsForUser(id);
    const s1 = saveForm(v1, SECRET);
    await saveAlertSettingsForUser(id, s1);
    await recordAlertSettingsChange(id, v1, s1);
    const v2 = await getAlertSettingsForUser(id);
    const s2 = saveForm(v2, "second-secret-abcdefgh");
    await saveAlertSettingsForUser(id, s2);
    await recordAlertSettingsChange(id, v2, s2);

    const history = await sql<{ id: number; settings: Record<string, unknown>; changes: string[] }>(
      "select id, settings, changes from public.alert_settings_history order by id",
    );
    const dump = JSON.stringify(history);
    expect(dump).not.toContain(SECRET);
    expect(dump).not.toContain("second-secret-abcdefgh");
    expect(history[1]?.settings.telegram_command_secret).toBe(`sha256:${sha(SECRET)}`);

    // Re-entering the same secret isn't reported as a change.
    const v3 = await getAlertSettingsForUser(id);
    const { describeAlertSettingsChanges } = await import("./alertSettingsHistory");
    expect(describeAlertSettingsChanges(v3, saveForm(v3, "second-secret-abcdefgh"))).toEqual([]);

    expect(await restoreAlertSettings(id, history[1]!.id)).toEqual({ error: null });
    expect(await sql("select telegram_command_secret from public.alert_settings")).toEqual([
      { telegram_command_secret: `sha256:${sha(SECRET)}` },
    ]);
    expect(await webhook(SECRET)).toBe(200);
    expect(JSON.stringify(await sql("select settings from public.alert_settings_history"))).not.toContain("second-secret-abcdefgh");
  });

  it("legacy plaintext rows still match before 0004, and two users sharing a secret match nobody", async () => {
    const a = await userWithBot("c@example.com");
    await sql("update public.alert_settings set telegram_command_secret = $2 where user_id = $1", [a, SECRET]);
    expect(await webhook(SECRET)).toBe(200);

    const b = await userWithBot("d@example.com");
    await sql("update public.alert_settings set telegram_command_secret = $2 where user_id = $1", [b, `sha256:${sha(SECRET)}`]);
    expect(await webhook(SECRET)).toBe(401); // ambiguous: one legacy, one hashed
  });
});

describe("migration 0004 on plaintext data", () => {
  it("hashes status tokens, Telegram secrets and history snapshots; leaves hashed/empty values; re-runnable", async () => {
    const u1 = await insertTestUser(db.client(), "m1@example.com");
    const u2 = await insertTestUser(db.client(), "m2@example.com");
    const u3 = await insertTestUser(db.client(), "m3@example.com");
    const u4 = await insertTestUser(db.client(), "m4@example.com");
    const already = `sha256:${sha("kept-secret-abcdefgh")}`;
    await sql(
      `insert into public.alert_settings (user_id, telegram_command_secret)
       values ($1, $5), ($2, $6), ($3, ''), ($4, null)`,
      [u1, u2, u3, u4, "plain-secret-ascii-123", already],
    );
    await sql(
      `insert into public.alert_settings_history (user_id, settings, changes) values
         ($1, jsonb_build_object('telegram_command_secret', 'plain-in-history-ünïcode', 'enabled', true), '{}'),
         ($1, jsonb_build_object('telegram_command_secret', $2::text), '{}'),
         ($1, jsonb_build_object('telegram_command_secret', null), '{}'),
         ($1, '{"enabled": false}'::jsonb, '{}')`,
      [u1, already],
    );
    await sql(
      `insert into public.status_subscriptions (email, token, confirmed_at)
       values ('s1@example.com', 'raw-one', now()), ('s2@example.com', 'raw-two', null)`,
    );

    await run0004();
    const snapshot = async () => ({
      settings: await sql("select user_id, telegram_command_secret from public.alert_settings order by user_id"),
      history: await sql("select settings from public.alert_settings_history order by id"),
      subs: await sql("select email, token, token_hash from public.status_subscriptions order by email"),
    });
    const first = await snapshot();

    const byUser = Object.fromEntries(
      (first.settings as Array<{ user_id: string; telegram_command_secret: string | null }>).map((r) => [r.user_id, r.telegram_command_secret]),
    );
    expect(byUser).toEqual({
      [u1]: `sha256:${sha("plain-secret-ascii-123")}`,
      [u2]: already,
      [u3]: "",
      [u4]: null,
    });
    expect(first.history).toEqual([
      // Postgres sha256 over UTF-8 = the app's hash, non-ASCII included.
      { settings: { telegram_command_secret: `sha256:${sha("plain-in-history-ünïcode")}`, enabled: true } },
      { settings: { telegram_command_secret: already } },
      { settings: { telegram_command_secret: null } },
      { settings: { enabled: false } },
    ]);
    expect(first.subs).toEqual([
      { email: "s1@example.com", token: null, token_hash: sha("raw-one") },
      { email: "s2@example.com", token: null, token_hash: sha("raw-two") },
    ]);

    await run0004(); // second run changes nothing
    expect(await snapshot()).toEqual(first);

    // Links and secrets from before the migration keep working.
    expect((await confirmStatusSubscription("raw-two")).ok).toBe(true);
    expect((await unsubscribeStatusSubscription("raw-one")).ok).toBe(true);
    await sql("update public.alert_settings set telegram_bot_token = '123:abc' where user_id = $1", [u1]);
    expect(await webhook("plain-secret-ascii-123")).toBe(200);
  });
});
