/**
 * OAuth rules on Better Auth against a local Postgres. The providers'
 * servers are stubbed (token exchange and profile requests); everything
 * else is Better Auth's real callback handling plus our hook and plugin.
 */
import { createHmac } from "node:crypto";
import bcrypt from "bcryptjs";
import pg from "pg";
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { testDatabaseUrl, useTestDatabase } from "../test/db";
import { createBetterAuth } from "./betterAuthConfig";

const BASE = "http://localhost:4321";
const SECRET = "test-secret-for-database-tests-only-0123456789";
const db = useTestDatabase();
const sql = async <T = Record<string, unknown>>(text: string, params: unknown[] = []) =>
  (await db.client().query(text, params)).rows as T[];
const pool = new pg.Pool({ connectionString: testDatabaseUrl(process.env.PROBEHARBOR_TEST_DB!), max: 3 });
afterAll(() => pool.end());

const oauth = (p: string) => ({ clientId: `${p}-id`, clientSecret: `${p}-secret`, redirectURI: `${BASE}/api/auth/${p}/callback` });
const auth = createBetterAuth({
  database: pool,
  secret: SECRET,
  baseURL: BASE,
  rpID: "localhost",
  sendVerificationEmail: async () => {},
  sendResetPassword: async () => {},
  oauth: { github: oauth("github"), discord: oauth("discord") },
});

type Profile = { id: number | string; email: string; verified: boolean };
let profile: Profile;
const realFetch = globalThis.fetch;
beforeEach(() => {
  vi.stubGlobal("fetch", async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input instanceof Request ? input.url : input);
    const json = (body: unknown) => new Response(JSON.stringify(body), { headers: { "content-type": "application/json" } });
    if (url.startsWith("https://github.com/login/oauth/access_token") || url.startsWith("https://discord.com/api/oauth2/token")) {
      return json({ access_token: "provider-token", token_type: "Bearer", scope: "identify email", expires_in: 3600 });
    }
    if (url === "https://api.github.com/user") {
      return json({ id: profile.id, login: "octo", name: "Octo", email: profile.email, avatar_url: null });
    }
    if (url === "https://api.github.com/user/emails") {
      return json([{ email: profile.email, primary: true, verified: profile.verified, visibility: "public" }]);
    }
    if (url === "https://discord.com/api/users/@me" || url === "https://discord.com/api/users/%40me") {
      return json({ id: String(profile.id), username: "disc", discriminator: "0", global_name: "Disc", email: profile.email, verified: profile.verified, avatar: null });
    }
    return realFetch(input, init);
  });
});
afterEach(() => vi.unstubAllGlobals());

const cookiesOf = (res: Response) =>
  res.headers
    .getSetCookie()
    .map((c) => c.split(";")[0]!)
    .filter((c) => !c.endsWith("="))
    .join("; ");

/** Start sign-in, then come back from the provider. Returns Better Auth's final response. */
async function oauthSignIn(provider: "github" | "discord") {
  const start = await auth.api.signInSocial({
    body: { provider, callbackURL: "/done", newUserCallbackURL: "/welcome", errorCallbackURL: "/failed" },
    asResponse: true,
  });
  const { url } = (await start.json()) as { url: string };
  const state = new URL(url).searchParams.get("state")!;
  return auth.handler(
    new Request(`${BASE}/api/better-auth/callback/${provider}?code=provider-code&state=${state}`, {
      headers: { cookie: cookiesOf(start) },
    }),
  );
}

async function passwordUser(email: string, verified = true) {
  const [u] = await sql<{ id: string }>(
    `insert into public.auth_users (name, email, "emailVerified") values ('P', $1, $2) returning id`,
    [email, verified],
  );
  await sql(
    `insert into public.auth_accounts ("accountId", "providerId", "userId", password, "updatedAt") values ($1::text, 'credential', $1::uuid, $2, now())`,
    [u!.id, bcrypt.hashSync("pw-123456", 4)],
  );
  return u!.id;
}

const loc = (res: Response) => res.headers.get("location") ?? "";
const providersOf = async (userId: string) =>
  (await sql<{ p: string }>(`select "providerId" as p from public.auth_accounts where "userId" = $1 order by 1`, [userId])).map((r) => r.p);

describe("OAuth on Better Auth", () => {
  it("a new GitHub user is created and signed in", async () => {
    profile = { id: 4242, email: "octo@example.com", verified: true };
    const res = await oauthSignIn("github");
    expect(loc(res)).toContain("/welcome");
    expect(cookiesOf(res)).toMatch(/session_token=/);
    const [u] = await sql<{ id: string; emailVerified: boolean }>(`select id, "emailVerified" from public.auth_users`);
    expect(await providersOf(u!.id)).toEqual(["github"]);
    // The signup trigger made the household, as for email sign-up.
    expect(await sql("select role from public.household_members where user_id = $1", [u!.id])).toEqual([{ role: "owner" }]);
  });

  it("GitHub does not join an existing account that isn't linked to GitHub", async () => {
    const id = await passwordUser("taken@example.com");
    profile = { id: 99, email: "taken@example.com", verified: true };
    const res = await oauthSignIn("github");
    expect(loc(res)).toContain("/failed");
    expect(cookiesOf(res)).not.toMatch(/session_token=/);
    expect(await providersOf(id)).toEqual(["credential"]);
  });

  it("GitHub signs in to an account already linked to that GitHub user", async () => {
    const id = await passwordUser("linked@example.com");
    await sql(`insert into public.auth_accounts ("accountId", "providerId", "userId", "updatedAt") values ('777', 'github', $1, now())`, [id]);
    profile = { id: 777, email: "linked@example.com", verified: true };
    const res = await oauthSignIn("github");
    expect(loc(res)).toContain("/done");
    expect(cookiesOf(res)).toMatch(/session_token=/);
  });

  it("Discord joins an existing account when both emails are verified, not otherwise", async () => {
    const id = await passwordUser("both@example.com");
    profile = { id: "1001", email: "both@example.com", verified: true };
    expect(loc(await oauthSignIn("discord"))).toContain("/done");
    expect(await providersOf(id)).toEqual(["credential", "discord"]);

    const unverifiedLocal = await passwordUser("local-unverified@example.com", false);
    profile = { id: "1002", email: "local-unverified@example.com", verified: true };
    expect(loc(await oauthSignIn("discord"))).toContain("/failed");
    expect(await providersOf(unverifiedLocal)).toEqual(["credential"]);

    const verifiedLocal = await passwordUser("provider-unverified@example.com");
    profile = { id: "1003", email: "provider-unverified@example.com", verified: false };
    expect(loc(await oauthSignIn("discord"))).toContain("/failed");
    expect(await providersOf(verifiedLocal)).toEqual(["credential"]);
  });

  it("two-factor users get the TOTP challenge after OAuth, not a session; the code finishes it", async () => {
    const id = await passwordUser("mfa@example.com");
    await sql(`insert into public.auth_accounts ("accountId", "providerId", "userId", "updatedAt") values ('1009', 'discord', $1, now())`, [id]);
    // A real TOTP secret, enabled the normal way.
    const signedIn = await auth.api.signInEmail({ body: { email: "mfa@example.com", password: "pw-123456" } });
    const headers = new Headers({ authorization: `Bearer ${signedIn.token}` });
    const enabled = await auth.api.enableTwoFactor({ body: { password: "pw-123456" }, headers });
    if (enabled.method !== "totp") throw new Error("expected TOTP");
    const secret = new URL(enabled.totpURI).searchParams.get("secret")!;
    await auth.api.verifyTOTP({ body: { code: totp(secret) }, headers });
    await sql("delete from public.auth_sessions");

    profile = { id: "1009", email: "mfa@example.com", verified: true };
    const res = await oauthSignIn("discord");
    expect(loc(res)).toBe("/signin/mfa");
    expect(cookiesOf(res)).not.toMatch(/session_token=/);
    expect(cookiesOf(res)).toMatch(/two_factor=/);
    expect(await sql("select 1 from public.auth_sessions")).toHaveLength(0);

    const verified = await auth.api.verifyTOTP({
      body: { code: totp(secret, Date.now() + 30_000) },
      headers: new Headers({ cookie: cookiesOf(res) }),
      asResponse: true,
    });
    expect(verified.status).toBe(200);
    expect(cookiesOf(verified)).toMatch(/session_token=/);
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
