/**
 * OAuth sign-in through the app's routes on Better Auth (DB_BACKEND=neon):
 * /api/auth/signin (start) → provider (stubbed) → the app's callback route
 * → /api/auth/oauth-done. Local Postgres; the runtime's Neon pool is pg.
 */
import bcrypt from "bcryptjs";
import type { APIContext } from "astro";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { testDatabaseUrl, useTestDatabase } from "../../../test/db";

const ENV: Record<string, string> = {
  DB_BACKEND: "neon",
  BETTER_AUTH_SECRET: "test-secret-for-database-tests-only-0123456789",
  GITHUB_CLIENT_ID: "gh-id",
  GITHUB_CLIENT_SECRET: "gh-secret",
  DISCORD_CLIENT_ID: "dc-id",
  DISCORD_CLIENT_SECRET: "dc-secret",
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

import { GET as providerCallback } from "./callback/[provider]";
import { GET as githubCallback } from "./github/callback";
import { GET as oauthDone } from "./oauth-done";
import { POST as signin } from "./signin";

const db = useTestDatabase();
const sql = async <T = Record<string, unknown>>(text: string, params: unknown[] = []) =>
  (await db.client().query(text, params)).rows as T[];

let profile: { id: string; email: string; verified: boolean };
const realFetch = globalThis.fetch;
beforeEach(() => {
  vi.stubGlobal("fetch", async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input instanceof Request ? input.url : input);
    const json = (body: unknown) => new Response(JSON.stringify(body), { headers: { "content-type": "application/json" } });
    if (url.startsWith("https://github.com/login/oauth/access_token") || url.startsWith("https://discord.com/api/oauth2/token")) {
      return json({ access_token: "t", token_type: "Bearer", scope: "x", expires_in: 3600 });
    }
    if (url === "https://api.github.com/user") return json({ id: Number(profile.id), login: "octo", name: "Octo", email: profile.email });
    if (url === "https://api.github.com/user/emails") return json([{ email: profile.email, primary: true, verified: profile.verified }]);
    if (url.startsWith("https://discord.com/api/users/")) {
      return json({ id: profile.id, username: "d", discriminator: "0", email: profile.email, verified: profile.verified, avatar: null });
    }
    return realFetch(input, init);
  });
});
afterEach(() => vi.unstubAllGlobals());

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
function ctx(method: "GET" | "POST", path: string, opts: { form?: Record<string, string>; cookie?: string; jar?: Record<string, string>; params?: Record<string, string>; locale?: string } = {}) {
  const request = new Request(`http://localhost:4321${path}`, {
    method,
    headers: opts.cookie ? { cookie: opts.cookie } : {},
    body: opts.form ? new URLSearchParams(opts.form) : undefined,
  });
  return {
    request,
    url: new URL(request.url),
    cookies: fakeCookies(opts.jar),
    params: opts.params ?? {},
    redirect: (location: string) => new Response(null, { status: 302, headers: { Location: location } }),
    clientAddress: "127.0.0.1",
    locals: { locale: opts.locale ?? "en" },
    site: undefined,
  } as unknown as APIContext & { cookies: ReturnType<typeof fakeCookies> };
}
const loc = (res: Response) => res.headers.get("Location") ?? "";
const cookiesOf = (res: Response) =>
  res.headers
    .getSetCookie()
    .map((c) => c.split(";")[0]!)
    .filter((c) => !c.endsWith("="))
    .join("; ");

/** Start on /api/auth/signin, come back through the app's callback route. */
async function viaRoutes(provider: "github" | "discord", form: Record<string, string> = {}) {
  const start = ctx("POST", "/api/auth/signin", { form: { provider, ...form } });
  const started = await signin(start);
  const authorize = new URL(loc(started));
  expect(authorize.hostname).toBe(provider === "github" ? "github.com" : "discord.com");
  expect(authorize.searchParams.get("redirect_uri")).toBe(
    provider === "github" ? "http://localhost:4321/api/auth/github/callback" : "http://localhost:4321/api/auth/callback/discord",
  );
  const query = `?code=c&state=${authorize.searchParams.get("state")}`;
  const back =
    provider === "github"
      ? await githubCallback(ctx("GET", `/api/auth/github/callback${query}`, { cookie: cookiesOf(started) }))
      : await providerCallback(ctx("GET", `/api/auth/callback/discord${query}`, { cookie: cookiesOf(started), params: { provider } }));
  return { back, appCookies: Object.fromEntries(start.cookies.jar) };
}

async function passwordUser(email: string) {
  const [u] = await sql<{ id: string }>(`insert into public.auth_users (name, email, "emailVerified") values ('P', $1, true) returning id`, [email]);
  await sql(
    `insert into public.auth_accounts ("accountId", "providerId", "userId", password, "updatedAt") values ($1::text, 'credential', $1::uuid, $2, now())`,
    [u!.id, bcrypt.hashSync("pw-123456", 4)],
  );
  return u!.id;
}

describe("OAuth through the app's routes (Neon)", () => {
  it("new GitHub user: lands on oauth-done, gets the sign-up language, the next page and a session", async () => {
    profile = { id: "5150", email: "octo@example.com", verified: true };
    const { back, appCookies } = await viaRoutes("github", { next: "/dashboard/alerts" });
    expect(loc(back)).toBe("/api/auth/oauth-done?new=1");
    const done = await oauthDone(ctx("GET", "/api/auth/oauth-done?new=1", { cookie: cookiesOf(back), jar: appCookies, locale: "de" }));
    expect(loc(done)).toBe("/dashboard/alerts");
    const [u] = await sql<{ id: string }>("select id from public.auth_users");
    expect(await sql("select metadata from public.user_profiles where user_id = $1", [u!.id])).toEqual([{ metadata: { locale: "de" } }]);
  });

  it("refused GitHub link shows the 'account already exists' message", async () => {
    await passwordUser("taken@example.com");
    profile = { id: "6000", email: "taken@example.com", verified: true };
    const { back } = await viaRoutes("github");
    expect(loc(back)).toMatch(/^\/api\/auth\/oauth-done\?error=/);
    const done = await oauthDone(ctx("GET", loc(back)));
    expect(loc(done)).toContain("error=oauth_account_exists");
  });

  it("Discord returns through /api/auth/callback/discord and joins a verified account", async () => {
    const id = await passwordUser("both@example.com");
    profile = { id: "7001", email: "both@example.com", verified: true };
    const { back } = await viaRoutes("discord");
    expect(loc(back)).toBe("/api/auth/oauth-done");
    expect(loc(await oauthDone(ctx("GET", "/api/auth/oauth-done", { cookie: cookiesOf(back) })))).toBe("/dashboard");
    expect((await sql<{ p: string }>(`select "providerId" as p from public.auth_accounts where "userId" = $1 order by 1`, [id])).map((r) => r.p)).toEqual([
      "credential",
      "discord",
    ]);
  });

  it("two-factor user is sent to /signin/mfa without a session", async () => {
    const id = await passwordUser("mfa@example.com");
    await sql(`update public.auth_users set "twoFactorEnabled" = true where id = $1`, [id]);
    await sql(`insert into public.auth_two_factors (secret, "backupCodes", "userId", verified) values ('x', 'y', $1, true)`, [id]);
    await sql(`insert into public.auth_accounts ("accountId", "providerId", "userId", "updatedAt") values ('7009', 'discord', $1, now())`, [id]);
    profile = { id: "7009", email: "mfa@example.com", verified: true };
    const { back } = await viaRoutes("discord");
    expect(loc(back)).toBe("/signin/mfa");
    expect(cookiesOf(back)).not.toMatch(/session_token=/);
    expect(await sql("select 1 from public.auth_sessions")).toHaveLength(0);
  });

  it("oauth-done without a session or with an unknown error goes back to sign-in", async () => {
    expect(loc(await oauthDone(ctx("GET", "/api/auth/oauth-done")))).toContain("error=oauth_exchange_failed");
    expect(loc(await oauthDone(ctx("GET", "/api/auth/oauth-done?error=state_mismatch")))).toContain("error=oauth_exchange_failed");
    expect(loc(await oauthDone(ctx("GET", "/api/auth/oauth-done?error=access_denied")))).toContain("error=oauth_denied");
  });

  it("the Google/Discord callback route only answers on Neon and for known providers", async () => {
    const res = await providerCallback(ctx("GET", "/api/auth/callback/twitter", { params: { provider: "twitter" } }));
    expect(res.status).toBe(404);
  });
});
