/**
 * Two-factor routes on Better Auth against a local
 * Postgres: settings (/api/auth/mfa-manage), the sign-in challenge
 * (/api/auth/mfa-verify) and YubiKey step-up. YubiCloud is mocked; the QR
 * helper is wrapped so the test can read the TOTP secret.
 */
import { createHmac } from "node:crypto";
import type { APIContext } from "astro";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { testDatabaseUrl, useTestDatabase } from "../../../test/db";

const ENV: Record<string, string> = {
  BETTER_AUTH_SECRET: "test-secret-for-database-tests-only-0123456789",
  CRON_SECRET: "test-step-up-secret-0123456789",
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
let lastTotpUri = "";
vi.mock("../../../lib/qrSvg", async (orig) => {
  const real = await orig<typeof import("../../../lib/qrSvg")>();
  return {
    ...real,
    renderIngestQrDataUrl: (text: string, size?: number) => {
      lastTotpUri = text;
      return real.renderIngestQrDataUrl(text, size);
    },
  };
});
let yubiResult: { ok: true; publicId: string } | { ok: false; error: string } = { ok: false, error: "no" };
vi.mock("../../../lib/yubikeyOtp", async (orig) => ({
  ...(await orig<typeof import("../../../lib/yubikeyOtp")>()),
  isYubiKeyOtpConfigured: () => true,
  verifyYubiKeyOtpWithYubiCloud: async () => yubiResult,
}));

import { GET as listFactors, POST as manage } from "./mfa-manage";
import { POST as mfaVerify } from "./mfa-verify";
import { POST as signin } from "./signin";

const db = useTestDatabase();
const sql = async <T = Record<string, unknown>>(text: string, params: unknown[] = []) =>
  (await db.client().query(text, params)).rows as T[];

function fakeCookies(initial: Record<string, string> = {}) {
  const jar = new Map(Object.entries(initial));
  return {
    get: (n: string) => (jar.has(n) ? { value: jar.get(n)! } : undefined),
    set: (n: string, v: string) => void jar.set(n, v),
    delete: (n: string) => void jar.delete(n),
    has: (n: string) => jar.has(n),
    jar,
  };
}
/** Browser cookies as both the request header (encoded) and Astro's cookies (decoded). */
type Browser = Map<string, string>;
const newBrowser = (): Browser => new Map();
function remember(browser: Browser, res: Response) {
  for (const c of res.headers.getSetCookie()) {
    const pair = c.split(";")[0]!;
    const cut = pair.indexOf("=");
    const [name, value] = [pair.slice(0, cut), pair.slice(cut + 1)];
    if (!value || /Max-Age=0/i.test(c)) browser.delete(name);
    else browser.set(name, value);
  }
}
function ctx(browser: Browser, method: "GET" | "POST", path: string, opts: { form?: Record<string, string>; json?: unknown } = {}) {
  const headers = new Headers({ cookie: [...browser].map(([n, v]) => `${n}=${v}`).join("; ") });
  if (opts.json) {
    headers.set("content-type", "application/json");
    headers.set("accept", "application/json");
  }
  const request = new Request(`http://localhost:4321${path}`, {
    method,
    headers,
    body: opts.json ? JSON.stringify(opts.json) : opts.form ? new URLSearchParams(opts.form) : undefined,
  });
  const cookies = fakeCookies(Object.fromEntries([...browser].map(([n, v]) => [n, decodeURIComponent(v)])));
  return Object.assign(
    {
      request,
      url: new URL(request.url),
      cookies,
      redirect: (location: string) => new Response(null, { status: 302, headers: { Location: location } }),
      clientAddress: "127.0.0.1",
      locals: { locale: "en" },
      site: undefined,
    } as unknown as APIContext,
    { appCookies: cookies },
  );
}
/** Run a route and keep the cookies it set, both Better Auth's (headers) and the app's (Astro cookies). */
async function call(browser: Browser, route: (c: APIContext) => Promise<Response> | Response, c: ReturnType<typeof ctx>) {
  const before = new Map(c.appCookies.jar);
  const res = await route(c);
  remember(browser, res);
  for (const [n, v] of c.appCookies.jar) if (before.get(n) !== v) browser.set(n, encodeURIComponent(v));
  return res;
}
const loc = (res: Response) => res.headers.get("Location") ?? "";
const body = async (res: Response) => (await res.clone().json()) as Record<string, unknown>;

async function signUpConfirmed(email: string, password = "pw-123456") {
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
  await auth.api.signUpEmail({ body: { email, password, name: email } });
  await pool.end();
  await sql(`update public.auth_users set "emailVerified" = true where email = $1`, [email]);
  const [u] = await sql<{ id: string }>("select id from public.auth_users where email = $1", [email]);
  return u!.id;
}
async function signIn(email: string, password = "pw-123456") {
  const browser = newBrowser();
  const res = await call(browser, signin, ctx(browser, "POST", "/api/auth/signin", { form: { email, password } }));
  return { browser, res };
}
const secretOf = (uri: string) => new URL(uri).searchParams.get("secret")!;
/** Set TOTP up through the settings routes; returns the secret. */
async function setUpTotp(browser: Browser, password = "pw-123456") {
  const enrolled = await call(browser, manage, ctx(browser, "POST", "/api/auth/mfa-manage", { json: { action: "enroll", password } }));
  expect(enrolled.status).toBe(200);
  const secret = secretOf(lastTotpUri);
  const verified = await call(browser, manage, ctx(browser, "POST", "/api/auth/mfa-manage", { json: { action: "verify", factorId: "totp", code: totp(secret) } }));
  expect(verified.status).toBe(200);
  return secret;
}

beforeEach(() => {
  lastTotpUri = "";
  yubiResult = { ok: false, error: "no" };
});

describe("TOTP in settings (Neon)", () => {
  it("asks for the password, sets up after the code, refuses a second one, removes with the password", async () => {
    await signUpConfirmed("a@example.com");
    const { browser } = await signIn("a@example.com");

    const listed = await body(await listFactors(ctx(browser, "GET", "/api/auth/mfa-manage")));
    expect(listed).toMatchObject({ totp: [], passwordRequired: true, webauthn: [] });

    const noPw = await manage(ctx(browser, "POST", "/api/auth/mfa-manage", { json: { action: "enroll" } }));
    expect(noPw.status).toBe(400);
    const wrongPw = await manage(ctx(browser, "POST", "/api/auth/mfa-manage", { json: { action: "enroll", password: "nope-nope" } }));
    expect(await body(wrongPw)).toEqual({ error: "That password isn't right." });

    const enrolled = await call(browser, manage, ctx(browser, "POST", "/api/auth/mfa-manage", { json: { action: "enroll", password: "pw-123456" } }));
    expect(await body(enrolled)).toMatchObject({ factorId: "totp", qrCode: expect.stringMatching(/^data:image\/svg\+xml/) });
    expect((await body(await listFactors(ctx(browser, "GET", "/api/auth/mfa-manage")))).totp).toEqual([
      { id: "totp", friendly_name: null, status: "unverified" },
    ]);

    const secret = secretOf(lastTotpUri);
    const bad = await manage(ctx(browser, "POST", "/api/auth/mfa-manage", { json: { action: "verify", code: "000000" } }));
    expect(bad.status).toBe(400);
    const ok = await call(browser, manage, ctx(browser, "POST", "/api/auth/mfa-manage", { json: { action: "verify", code: totp(secret) } }));
    expect(ok.status).toBe(200);
    expect((await body(await listFactors(ctx(browser, "GET", "/api/auth/mfa-manage")))).totp).toEqual([
      { id: "totp", friendly_name: null, status: "verified" },
    ]);

    const again = await manage(ctx(browser, "POST", "/api/auth/mfa-manage", { json: { action: "enroll", password: "pw-123456" } }));
    expect((await body(again)).error).toMatch(/already set up/);

    const removeWrong = await manage(ctx(browser, "POST", "/api/auth/mfa-manage", { json: { action: "unenroll", factorId: "totp", password: "nope-nope" } }));
    expect(removeWrong.status).toBe(400);
    expect((await sql<{ t: boolean }>(`select "twoFactorEnabled" as t from public.auth_users`))[0]!.t).toBe(true);
    const removed = await call(browser, manage, ctx(browser, "POST", "/api/auth/mfa-manage", { json: { action: "unenroll", factorId: "totp", password: "pw-123456" } }));
    expect(removed.status).toBe(200);
    expect((await sql<{ t: boolean }>(`select "twoFactorEnabled" as t from public.auth_users`))[0]!.t).toBe(false);
  });

  it("an account without a password (OAuth-only) isn't asked for one", async () => {
    const id = await signUpConfirmed("oauth@example.com");
    const { browser } = await signIn("oauth@example.com");
    await sql(`delete from public.auth_accounts where "userId" = $1`, [id]);
    await sql(`insert into public.auth_accounts ("accountId", "providerId", "userId", "updatedAt") values ('g1', 'google', $1, now())`, [id]);
    expect((await body(await listFactors(ctx(browser, "GET", "/api/auth/mfa-manage")))).passwordRequired).toBe(false);
    const enrolled = await manage(ctx(browser, "POST", "/api/auth/mfa-manage", { json: { action: "enroll" } }));
    expect(enrolled.status).toBe(200);
  });

  it("security-key actions say they moved to passkeys", async () => {
    await signUpConfirmed("a@example.com");
    const { browser } = await signIn("a@example.com");
    const res = await manage(ctx(browser, "POST", "/api/auth/mfa-manage", { json: { action: "webauthn_enroll" } }));
    expect((await body(res)).error).toMatch(/passkeys/);
  });
});

describe("account with both an authenticator app and a YubiKey (Neon)", () => {
  async function bothFactors(email: string) {
    const id = await signUpConfirmed(email);
    await sql("insert into public.user_profiles (user_id, metadata) values ($1, $2)", [id, JSON.stringify({ yubikey_otp_public_ids: ["ccccccbcdefg"] })]);
    const first = await signIn(email);
    // Adding TOTP needs the YubiKey step first (a second factor).
    yubiResult = { ok: true, publicId: "ccccccbcdefg" };
    await call(first.browser, mfaVerify, ctx(first.browser, "POST", "/api/auth/mfa-verify", { form: { yubikey_otp: "x".repeat(44) } }));
    await setUpTotp(first.browser);
    await sql("delete from public.auth_sessions");
    const second = await signIn(email);
    expect(loc(second.res)).toBe("/signin/mfa");
    return { id, browser: second.browser };
  }

  it("the YubiKey finishes the pending challenge; the session then counts as verified", async () => {
    const { id, browser } = await bothFactors("both@example.com");
    yubiResult = { ok: true, publicId: "ccccccbcdefg" };
    const done = await call(browser, mfaVerify, ctx(browser, "POST", "/api/auth/mfa-verify", { form: { yubikey_otp: "y".repeat(44), next: "/dashboard/alerts" } }));
    expect(loc(done)).toBe("/dashboard/alerts");
    expect(await sql("select 1 from public.auth_sessions")).toHaveLength(1);

    const { getAuthFromRequest } = await import("../../../lib/auth");
    const { betterAuthNeedsStepUp } = await import("../../../lib/betterAuthMfaGate");
    const cookie = [...browser].map(([n, v]) => `${n}=${v}`).join("; ");
    const { user } = await getAuthFromRequest(new Request("http://x/", { headers: { cookie } }), { get: () => undefined } as never);
    expect(user?.id).toBe(id);
    // No second prompt for the YubiKey (or the app) on the next page.
    await expect(betterAuthNeedsStepUp(user, async () => false)).resolves.toBe(false);
  });

  it("another key or a replayed code doesn't finish it", async () => {
    const { browser } = await bothFactors("both@example.com");
    yubiResult = { ok: true, publicId: "cccccchijklm" };
    const other = await call(browser, mfaVerify, ctx(browser, "POST", "/api/auth/mfa-verify", { form: { yubikey_otp: "y".repeat(44) } }));
    expect(loc(other)).toContain("error=yubikey_not_enrolled");
    yubiResult = { ok: false, error: "OTP already used" };
    const replay = await call(browser, mfaVerify, ctx(browser, "POST", "/api/auth/mfa-verify", { form: { yubikey_otp: "y".repeat(44) } }));
    expect(loc(replay)).toContain("error=replayed_otp");
    expect(await sql("select 1 from public.auth_sessions")).toHaveLength(0);
  });
});

describe("sign-in challenge (Neon)", () => {
  it("TOTP: password step, then a wrong code, then the right code signs in to the next page", async () => {
    await signUpConfirmed("a@example.com");
    const first = await signIn("a@example.com");
    const secret = await setUpTotp(first.browser);
    await sql("delete from public.auth_sessions");

    const { browser, res } = await signIn("a@example.com");
    expect(loc(res)).toBe("/signin/mfa");
    const wrong = await call(browser, mfaVerify, ctx(browser, "POST", "/api/auth/mfa-verify", { form: { code: "000000", next: "/dashboard/alerts" } }));
    expect(loc(wrong)).toContain("error=invalid_code");
    expect(await sql("select 1 from public.auth_sessions")).toHaveLength(0);
    const right = await call(browser, mfaVerify, ctx(browser, "POST", "/api/auth/mfa-verify", { form: { code: totp(secret, Date.now() + 30_000), next: "/dashboard/alerts" } }));
    expect(loc(right)).toBe("/dashboard/alerts");
    expect(await sql("select 1 from public.auth_sessions")).toHaveLength(1);
  });

  it("YubiKey: an enrolled key's OTP sets the step-up proof; another key is refused", async () => {
    const id = await signUpConfirmed("y@example.com");
    await sql("insert into public.user_profiles (user_id, metadata) values ($1, $2)", [id, JSON.stringify({ yubikey_otp_public_ids: ["ccccccbcdefg"] })]);
    const { browser } = await signIn("y@example.com");

    yubiResult = { ok: true, publicId: "cccccchijklm" };
    const other = await call(browser, mfaVerify, ctx(browser, "POST", "/api/auth/mfa-verify", { form: { yubikey_otp: "x".repeat(44) } }));
    expect(loc(other)).toContain("error=yubikey_not_enrolled");
    expect(browser.has("sb-mfa-stepup")).toBe(false);

    yubiResult = { ok: true, publicId: "ccccccbcdefg" };
    const ok = await call(browser, mfaVerify, ctx(browser, "POST", "/api/auth/mfa-verify", { form: { yubikey_otp: "x".repeat(44) } }));
    expect(loc(ok)).toBe("/dashboard");
    expect(browser.has("sb-mfa-stepup")).toBe(true);
  });

  it("a YubiKey-only user must step up before adding TOTP; removing the key needs that key's OTP", async () => {
    const id = await signUpConfirmed("y@example.com");
    await sql("insert into public.user_profiles (user_id, metadata) values ($1, $2)", [id, JSON.stringify({ yubikey_otp_public_ids: ["ccccccbcdefg"] })]);
    const { browser } = await signIn("y@example.com");

    const blocked = await manage(ctx(browser, "POST", "/api/auth/mfa-manage", { json: { action: "enroll", password: "pw-123456" } }));
    expect(blocked.status).toBe(401);

    const noTap = await manage(ctx(browser, "POST", "/api/auth/mfa-manage", { json: { action: "yubikey_unenroll", publicId: "ccccccbcdefg" } }));
    expect(noTap.status).toBe(400);
    yubiResult = { ok: true, publicId: "ccccccbcdefg" };
    const removed = await manage(ctx(browser, "POST", "/api/auth/mfa-manage", { json: { action: "yubikey_unenroll", publicId: "ccccccbcdefg", otp: "x".repeat(44) } }));
    expect(removed.status).toBe(200);
    expect(await sql("select metadata from public.user_profiles where user_id = $1", [id])).toEqual([{ metadata: { yubikey_otp_public_ids: [] } }]);
  });

  it("after the YubiKey step-up, adding TOTP is allowed", async () => {
    const id = await signUpConfirmed("y@example.com");
    await sql("insert into public.user_profiles (user_id, metadata) values ($1, $2)", [id, JSON.stringify({ yubikey_otp_public_ids: ["ccccccbcdefg"] })]);
    const { browser } = await signIn("y@example.com");
    yubiResult = { ok: true, publicId: "ccccccbcdefg" };
    await call(browser, mfaVerify, ctx(browser, "POST", "/api/auth/mfa-verify", { form: { yubikey_otp: "x".repeat(44) } }));
    const enrolled = await manage(ctx(browser, "POST", "/api/auth/mfa-manage", { json: { action: "enroll", password: "pw-123456" } }));
    expect(enrolled.status).toBe(200);
  });
});

/** RFC 6238 TOTP (SHA-1, 6 digits, 30 s) for the test only. */
function totp(base32Secret: string, now = Date.now()): string {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let bits = "";
  for (const ch of base32Secret.replace(/=+$/, "").toUpperCase()) bits += alphabet.indexOf(ch).toString(2).padStart(5, "0");
  const key = Buffer.from(bits.match(/.{8}/g)!.map((b) => parseInt(b, 2)));
  const counter = Buffer.alloc(8);
  counter.writeBigUInt64BE(BigInt(Math.floor(now / 30000)));
  const h = createHmac("sha1", key).update(counter).digest();
  const o = h[h.length - 1]! & 0xf;
  return String((h.readUInt32BE(o) & 0x7fffffff) % 1_000_000).padStart(6, "0");
}
