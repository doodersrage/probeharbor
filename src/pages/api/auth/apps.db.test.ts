/**
 * Native-app sign-in on Better Auth (DB_BACKEND=neon), the way the desktop
 * app, Bay Buddy and Android drive it: companion/mobile start → web sign-in
 * → companion/complete → one-time exchange token → /api/auth/mobile/exchange
 * → bearer token. Local Postgres; GitHub's servers stubbed for OAuth.
 */
import { createHmac } from "node:crypto";
import type { APIContext } from "astro";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { testDatabaseUrl, useTestDatabase } from "../../../test/db";

const ENV: Record<string, string> = {
  DB_BACKEND: "neon",
  BETTER_AUTH_SECRET: "test-secret-for-database-tests-only-0123456789",
  CRON_SECRET: "test-step-up-and-exchange-secret-0123456789",
  GITHUB_CLIENT_ID: "gh-id",
  GITHUB_CLIENT_SECRET: "gh-secret",
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

import { getAuthFromRequest } from "../../../lib/auth";
import { GET as companionComplete } from "./companion/complete";
import { GET as companionStart } from "./companion/start";
import { GET as githubCallback } from "./github/callback";
import { POST as manage } from "./mfa-manage";
import { POST as mfaVerify } from "./mfa-verify";
import { POST as exchange } from "./mobile/exchange";
import { GET as mobileStart } from "./mobile/start";
import { GET as oauthDone } from "./oauth-done";
import { POST as signin } from "./signin";
import { POST as signout } from "./signout";
import { POST as signoutEverywhere } from "./signout-everywhere";

const db = useTestDatabase();
const sql = async <T = Record<string, unknown>>(text: string, params: unknown[] = []) =>
  (await db.client().query(text, params)).rows as T[];

// ---- a tiny browser ------------------------------------------------------------------
type Browser = Map<string, string>;
function ctx(browser: Browser, method: "GET" | "POST", path: string, opts: { form?: Record<string, string>; json?: unknown; params?: Record<string, string> } = {}) {
  const headers = new Headers({ cookie: [...browser].map(([n, v]) => `${n}=${v}`).join("; ") });
  if (opts.json) headers.set("content-type", "application/json");
  const request = new Request(`http://localhost:4321${path}`, {
    method,
    headers,
    body: opts.json ? JSON.stringify(opts.json) : opts.form ? new URLSearchParams(opts.form) : undefined,
  });
  const jar = new Map([...browser].map(([n, v]) => [n, decodeURIComponent(v)]));
  return {
    request,
    url: new URL(request.url),
    params: opts.params ?? {},
    cookies: {
      get: (n: string) => (jar.has(n) ? { value: jar.get(n)! } : undefined),
      set: (n: string, v: string) => void jar.set(n, v),
      delete: (n: string) => void jar.delete(n),
      has: (n: string) => jar.has(n),
      jar,
    },
    redirect: (location: string) => new Response(null, { status: 302, headers: { Location: location } }),
    clientAddress: "127.0.0.1",
    locals: { locale: "en" },
    site: undefined,
  } as unknown as APIContext & { cookies: { jar: Map<string, string> } };
}
async function go(browser: Browser, route: (c: APIContext) => Promise<Response> | Response, c: ReturnType<typeof ctx>) {
  const before = new Map(c.cookies.jar);
  const res = await route(c);
  for (const sc of res.headers.getSetCookie()) {
    const pair = sc.split(";")[0]!;
    const cut = pair.indexOf("=");
    const [n, v] = [pair.slice(0, cut), pair.slice(cut + 1)];
    if (!v || /Max-Age=0/i.test(sc)) browser.delete(n);
    else browser.set(n, v);
  }
  for (const [n, v] of c.cookies.jar) if (before.get(n) !== v) browser.set(n, encodeURIComponent(v));
  for (const n of before.keys()) if (!c.cookies.jar.has(n)) browser.delete(n);
  return res;
}
const loc = (res: Response) => res.headers.get("Location") ?? "";
const bearer = (token: string) => getAuthFromRequest(new Request("http://x/", { headers: { authorization: `Bearer ${token}` } }), { get: () => undefined } as never);

/** The app's side: read the exchange token from the hand-off URL and swap it. */
async function appExchange(handoff: Response) {
  const exchangeToken = new URL(loc(handoff), "http://localhost:4321").searchParams.get("exchange");
  expect(exchangeToken).toBeTruthy();
  const res = await exchange(ctx(new Map(), "POST", "/api/auth/mobile/exchange", { json: { exchange_token: exchangeToken } }));
  expect(res.status).toBe(200);
  return (await res.json()) as { access_token: string; refresh_token: string };
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
  return (await sql<{ id: string }>("select id from public.auth_users where email = $1", [email]))[0]!.id;
}
const emailSignIn = (browser: Browser, email: string) =>
  go(browser, signin, ctx(browser, "POST", "/api/auth/signin", { form: { email, password: "pw-123456", next: "/api/auth/companion/complete" } }));
const desktopStart = (browser: Browser, extra = "") =>
  go(browser, companionStart, ctx(browser, "GET", `/api/auth/companion/start?client=desktop&loopback=${encodeURIComponent("http://127.0.0.1:53111/oauth")}${extra}`));

let ghProfile = { id: 1, email: "" };
const realFetch = globalThis.fetch;
beforeEach(() => {
  lastTotpUri = "";
  vi.stubGlobal("fetch", async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input instanceof Request ? input.url : input);
    const json = (b: unknown) => new Response(JSON.stringify(b), { headers: { "content-type": "application/json" } });
    if (url.startsWith("https://github.com/login/oauth/access_token")) return json({ access_token: "t", token_type: "Bearer", scope: "x" });
    if (url === "https://api.github.com/user") return json({ id: ghProfile.id, login: "octo", name: "Octo", email: ghProfile.email });
    if (url === "https://api.github.com/user/emails") return json([{ email: ghProfile.email, primary: true, verified: true }]);
    return realFetch(input, init);
  });
});
afterEach(() => vi.unstubAllGlobals());

describe("app sign-in on Better Auth (Neon)", () => {
  it("desktop: email sign-in in the browser hands the app its own bearer session", async () => {
    const id = await account("a@example.com");
    const browser: Browser = new Map();
    expect(loc(await desktopStart(browser))).toBe("/signin?next=%2Fapi%2Fauth%2Fcompanion%2Fcomplete");
    await emailSignIn(browser, "a@example.com");
    const handoff = await go(browser, companionComplete, ctx(browser, "GET", "/api/auth/companion/complete"));
    const tokens = await appExchange(handoff);
    expect(tokens.access_token).toBe(tokens.refresh_token);
    expect((await bearer(tokens.access_token)).user?.id).toBe(id);

    // Its own session: signing out of the browser leaves the app signed in...
    await go(browser, signout, ctx(browser, "POST", "/api/auth/signout"));
    expect((await bearer(tokens.access_token)).user?.id).toBe(id);
    // ...and "sign out everywhere" (from another browser) ends it.
    const other: Browser = new Map();
    await emailSignIn(other, "a@example.com");
    await go(other, signoutEverywhere, ctx(other, "POST", "/api/auth/signout-everywhere"));
    expect((await bearer(tokens.access_token)).user).toBeNull();
  });

  it("an exchange token works once", async () => {
    await account("a@example.com");
    const browser: Browser = new Map();
    await desktopStart(browser);
    await emailSignIn(browser, "a@example.com");
    const handoff = await go(browser, companionComplete, ctx(browser, "GET", "/api/auth/companion/complete"));
    await appExchange(handoff);
    const exchangeToken = new URL(loc(handoff), "http://localhost:4321").searchParams.get("exchange");
    const again = await exchange(ctx(new Map(), "POST", "/api/auth/mobile/exchange", { json: { exchange_token: exchangeToken } }));
    expect(again.status).toBe(400);
  });

  it("already signed in: companion start hands off straight away", async () => {
    const id = await account("a@example.com");
    const browser: Browser = new Map();
    await emailSignIn(browser, "a@example.com");
    const handoff = await desktopStart(browser);
    expect((await bearer((await appExchange(handoff)).access_token)).user?.id).toBe(id);
  });

  it("YubiKey users step up before the app gets a session", async () => {
    const id = await account("y@example.com");
    await sql("insert into public.user_profiles (user_id, metadata) values ($1, $2)", [id, JSON.stringify({ yubikey_otp_public_ids: ["ccccccbcdefg"] })]);
    const browser: Browser = new Map();
    await desktopStart(browser);
    await emailSignIn(browser, "y@example.com");
    const res = await go(browser, companionComplete, ctx(browser, "GET", "/api/auth/companion/complete"));
    expect(loc(res)).toBe("/signin/mfa?next=%2Fapi%2Fauth%2Fcompanion%2Fcomplete");
    expect(await sql("select 1 from public.mobile_oauth_exchanges")).toHaveLength(0);
  });

  it("TOTP users: after the code, the challenge ends at the app hand-off", async () => {
    await account("t@example.com");
    const setup: Browser = new Map();
    await emailSignIn(setup, "t@example.com");
    await go(setup, manage, ctx(setup, "POST", "/api/auth/mfa-manage", { json: { action: "enroll", password: "pw-123456" } }));
    const secret = new URL(lastTotpUri).searchParams.get("secret")!;
    await go(setup, manage, ctx(setup, "POST", "/api/auth/mfa-manage", { json: { action: "verify", code: totp(secret) } }));

    const browser: Browser = new Map();
    await desktopStart(browser);
    expect(loc(await emailSignIn(browser, "t@example.com"))).toContain("/signin/mfa");
    const verified = await go(browser, mfaVerify, ctx(browser, "POST", "/api/auth/mfa-verify", { form: { code: totp(secret, Date.now() + 30_000) } }));
    expect(loc(verified)).toBe("/api/auth/companion/complete");
    const handoff = await go(browser, companionComplete, ctx(browser, "GET", "/api/auth/companion/complete"));
    expect((await bearer((await appExchange(handoff)).access_token)).user).toBeTruthy();
  });

  it("Android: OAuth from mobile/start comes back through oauth-done to the app", async () => {
    ghProfile = { id: 4242, email: "droid@example.com" };
    const browser: Browser = new Map();
    const started = await go(browser, mobileStart, ctx(browser, "GET", "/api/auth/mobile/start?provider=github&app=dev.probeharbor.android"));
    const authorize = new URL(loc(started));
    expect(authorize.hostname).toBe("github.com");
    const back = await go(browser, githubCallback, ctx(browser, "GET", `/api/auth/github/callback?code=c&state=${authorize.searchParams.get("state")}`));
    const done = await go(browser, oauthDone, ctx(browser, "GET", loc(back)));
    expect(loc(done)).toBe("/api/auth/companion/complete");
    const handoff = await go(browser, companionComplete, ctx(browser, "GET", "/api/auth/companion/complete"));
    expect(loc(handoff)).toMatch(/exchange=/);
    const [u] = await sql<{ id: string }>("select id from public.auth_users where email = 'droid@example.com'");
    expect((await bearer((await appExchange(handoff)).access_token)).user?.id).toBe(u!.id);
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
