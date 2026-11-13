/**
 * Revealing a device's ingest key on Better Auth, against a local Postgres:
 * real session, real two-factor rule (TOTP or YubiKey users need a verified
 * session), real household scoping and the stored, encrypted key.
 */
import type { APIContext } from "astro";
import { describe, expect, it, vi } from "vitest";
import { testDatabaseUrl, useTestDatabase } from "../../../test/db";

const ENV: Record<string, string> = {
  BETTER_AUTH_SECRET: "test-secret-for-database-tests-only-0123456789",
  CRON_SECRET: "test-step-up-secret-0123456789",
  INGEST_KEY_ENCRYPTION_SECRET: "test-vault-secret-0123456789",
};
vi.mock("../../../lib/runtimeEnv", () => ({
  getRuntimeEnv: (key: string) => (key === "DATABASE_URL" ? testDatabaseUrl(process.env.PROBEHARBOR_TEST_DB!) : ENV[key]),
  hasRuntimeEnv: () => false,
}));
vi.mock("@neondatabase/serverless", async (orig) => ({
  ...(await orig<typeof import("@neondatabase/serverless")>()),
  Pool: (await import("pg")).default.Pool,
}));
vi.mock("../../../lib/turnstile", () => ({ getTurnstileToken: () => "ok", verifyTurnstileToken: async () => ({ success: true }) }));
vi.mock("../../../lib/mailer", () => ({ sendEmail: async () => {} }));

import { createPushDevice } from "../../../lib/devices";
import { createMfaStepUpProof } from "../../../lib/mfaStepUpProof";
import { persistEncryptedIngestKey } from "../../../lib/persistIngestKey";
import { POST as signin } from "../auth/signin";
import { POST as reveal } from "./reveal-ingest-key";

const db = useTestDatabase();
const sql = async <T = Record<string, unknown>>(text: string, params: unknown[] = []) =>
  (await db.client().query(text, params)).rows as T[];

type Browser = Map<string, string>;
function ctx(browser: Browser, path: string, form: Record<string, string> = {}, json?: unknown) {
  const headers = new Headers({ cookie: [...browser].map(([n, v]) => `${n}=${v}`).join("; ") });
  if (json) headers.set("content-type", "application/json");
  const request = new Request(`http://localhost:4321${path}`, {
    method: "POST",
    headers,
    body: json ? JSON.stringify(json) : new URLSearchParams(form),
  });
  const jar = new Map([...browser].map(([n, v]) => [n, decodeURIComponent(v)]));
  return {
    request,
    url: new URL(request.url),
    cookies: {
      get: (n: string) => (jar.has(n) ? { value: jar.get(n)! } : undefined),
      set: (n: string, v: string) => void jar.set(n, v),
      delete: (n: string) => void jar.delete(n),
      has: (n: string) => jar.has(n),
    },
    redirect: (location: string) => new Response(null, { status: 302, headers: { Location: location } }),
    clientAddress: "127.0.0.1",
    locals: { locale: "en" },
    site: undefined,
  } as unknown as APIContext;
}

async function account(email: string) {
  const { createBetterAuth } = await import("../../../lib/betterAuthConfig");
  const pg = (await import("pg")).default;
  const pool = new pg.Pool({ connectionString: testDatabaseUrl(process.env.PROBEHARBOR_TEST_DB!), max: 1 });
  const auth = createBetterAuth({
    database: pool,
    secret: ENV.BETTER_AUTH_SECRET!,
    baseURL: "http://localhost:4321",
    rpID: "localhost",
    sendVerificationEmail: async () => {},
    sendResetPassword: async () => {},
  });
  await auth.api.signUpEmail({ body: { email, password: "pw-123456", name: email } });
  await pool.end();
  await sql(`update public.auth_users set "emailVerified" = true where email = $1`, [email]);
  const id = (await sql<{ id: string }>("select id from public.auth_users where email = $1", [email]))[0]!.id;
  const browser: Browser = new Map();
  const res = await signin(ctx(browser, "/api/auth/signin", { email, password: "pw-123456" }));
  for (const c of res.headers.getSetCookie()) {
    const pair = c.split(";")[0]!;
    const cut = pair.indexOf("=");
    if (pair.slice(cut + 1)) browser.set(pair.slice(0, cut), pair.slice(cut + 1));
  }
  const [s] = await sql<{ token: string }>(`select token from public.auth_sessions where "userId" = $1`, [id]);
  return { id, browser, token: s!.token };
}

async function deviceWithKey(userId: string, key: string) {
  const [{ household_id }] = await sql<{ household_id: string }>("select household_id from public.household_members where user_id = $1", [userId]);
  const { device, error } = await createPushDevice(household_id!, "Garage probe", `hash-${key}`, key.slice(0, 8));
  expect(error).toBeNull();
  await persistEncryptedIngestKey(household_id!, device!.id, key);
  return device!.id;
}
const revealFor = (browser: Browser, deviceId: string) => reveal(ctx(browser, "/api/devices/reveal-ingest-key", {}, { device_id: deviceId }));

describe("reveal ingest key (Better Auth)", () => {
  it("shows the stored key to its household's editor, and logs it", async () => {
    const { id, browser } = await account("a@example.com");
    const deviceId = await deviceWithKey(id, "th_live_abcdef0123456789");
    const res = await revealFor(browser, deviceId);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, ingest_key: "th_live_abcdef0123456789" });
    expect(await sql("select 1 from public.household_activity where action = 'ingest_key_revealed'")).toHaveLength(1);
  });

  it("without a session: 401", async () => {
    const { id } = await account("a@example.com");
    const deviceId = await deviceWithKey(id, "th_live_abcdef0123456789");
    expect((await revealFor(new Map(), deviceId)).status).toBe(401);
  });

  it("another household's device: not found", async () => {
    const owner = await account("a@example.com");
    const other = await account("b@example.com");
    const deviceId = await deviceWithKey(owner.id, "th_live_abcdef0123456789");
    const res = await revealFor(other.browser, deviceId);
    expect(res.status).toBe(404);
    expect(JSON.stringify(await res.json())).not.toContain("th_live");
  });

  it("a YubiKey user needs the step-up first, then sees the key", async () => {
    const { id, browser } = await account("y@example.com");
    await sql("insert into public.user_profiles (user_id, metadata) values ($1, $2)", [id, JSON.stringify({ yubikey_otp_public_ids: ["ccccccbcdefg"] })]);
    const deviceId = await deviceWithKey(id, "th_live_abcdef0123456789");
    const refused = await revealFor(browser, deviceId);
    expect(refused.status).toBe(401);
    expect(JSON.stringify(await refused.json())).not.toContain("th_live");

    browser.set("sb-mfa-stepup", encodeURIComponent((await createMfaStepUpProof(id))!));
    const shown = await revealFor(browser, deviceId);
    expect(shown.status).toBe(200);
    expect(((await shown.json()) as { ingest_key: string }).ingest_key).toBe("th_live_abcdef0123456789");
  });
});
