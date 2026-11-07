import { createHmac } from "node:crypto";
import pg from "pg";
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import { testDatabaseUrl, useTestDatabase } from "../test/db";
import { type AuthEmail, createBetterAuth, type ProbeHarborAuth } from "./betterAuthConfig";

vi.mock("./runtimeEnv", () => ({
  getRuntimeEnv: () => undefined,
  hasRuntimeEnv: () => false,
}));

const pool = new pg.Pool({ connectionString: testDatabaseUrl(process.env.PROBEHARBOR_TEST_DB!), max: 3 });
const sent: AuthEmail[] = [];
const auth = createBetterAuth({
  database: pool,
  secret: "test-secret-for-database-tests-only-0123456789",
  baseURL: "http://localhost:4321",
  rpID: "localhost",
  sendVerificationEmail: async (e) => void sent.push(e),
  sendResetPassword: async () => {},
});
// getAuthFromRequest builds its instance through the runtime; point it at the test pool.
vi.mock("./betterAuthRuntime", () => ({
  withBetterAuth: async <T>(_r: unknown, run: (a: ProbeHarborAuth) => Promise<T>) => run(auth),
}));
afterAll(() => pool.end());

import { getAuthFromCookies, getAuthFromRequest } from "./auth";
import { BETTER_AUTH_COOKIE } from "./betterAuthSession";

const db = useTestDatabase();
const sql = async <T = Record<string, unknown>>(text: string, params: unknown[] = []) =>
  (await db.client().query(text, params)).rows as T[];

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

async function confirmedUser(email: string, password = "a-good-password") {
  sent.length = 0;
  await auth.api.signUpEmail({ body: { email, password, name: email } });
  await auth.api.verifyEmail({ query: { token: sent[0]!.token } });
  return auth.api.signInEmail({ body: { email, password } });
}

beforeEach(() => {
  sent.length = 0;
});

describe("Better Auth sessions in the app's AuthResult shape (Neon)", () => {
  it("bearer header and cookie both resolve to a Supabase-shaped user with profile metadata", async () => {
    const { token, user } = await confirmedUser("a@example.com");
    await sql("insert into public.user_profiles (user_id, metadata, app_metadata) values ($1, $2, $3)", [
      user.id,
      JSON.stringify({ locale: "de" }),
      JSON.stringify({ plan: "pro" }),
    ]);

    const viaBearer = await getAuthFromRequest(new Request("http://x/", { headers: { authorization: `Bearer ${token}` } }), {
      get: () => undefined,
    } as never);
    expect(viaBearer.source).toBe("better-auth");
    expect(viaBearer.user).toMatchObject({ id: user.id, email: "a@example.com", user_metadata: { locale: "de" }, app_metadata: { plan: "pro" } });
    expect(viaBearer.user?.email_confirmed_at).toBeTruthy();
    expect(viaBearer.session?.access_token).toBe(token);

    // Cookie path: Better Auth's cookie holds the signed token (token.signature).
    const signed = await signedCookieValue(token);
    const viaCookie = await getAuthFromCookies({ get: (n: string) => (n === BETTER_AUTH_COOKIE ? { value: signed } : undefined) } as never);
    expect(viaCookie.user?.id).toBe(user.id);
  });

  it("unknown, revoked or missing tokens give no session", async () => {
    const { token } = await confirmedUser("a@example.com");
    const req = (t: string) => new Request("http://x/", { headers: { authorization: `Bearer ${t}` } });
    await expect(getAuthFromRequest(req("nope"), { get: () => undefined } as never)).resolves.toMatchObject({ session: null, user: null });
    await sql("delete from public.auth_sessions");
    await expect(getAuthFromRequest(req(token), { get: () => undefined } as never)).resolves.toMatchObject({ session: null });
    await expect(getAuthFromCookies({ get: () => undefined } as never)).resolves.toMatchObject({ session: null });
  });

  it("with two-factor on, email sign-in gives no session until the code is checked", async () => {
    const first = await confirmedUser("mfa@example.com");
    const headers = new Headers({ authorization: `Bearer ${first.token}` });
    const enabled = await auth.api.enableTwoFactor({ body: { password: "a-good-password" }, headers });
    if (enabled.method !== "totp") throw new Error("expected a TOTP setup");
    const secret = new URL(enabled.totpURI).searchParams.get("secret")!;
    await auth.api.verifyTOTP({ body: { code: totp(secret) }, headers });
    expect((await sql<{ t: boolean }>(`select "twoFactorEnabled" as t from public.auth_users`))[0]!.t).toBe(true);

    await sql("delete from public.auth_sessions");
    const second = (await auth.api.signInEmail({ body: { email: "mfa@example.com", password: "a-good-password" } })) as Record<string, unknown>;
    expect(second.twoFactorRedirect).toBe(true);
    expect(second.token).toBeUndefined();
    expect(await sql("select 1 from public.auth_sessions")).toHaveLength(0);
  });
});

async function signedCookieValue(token: string): Promise<string> {
  const mac = createHmac("sha256", "test-secret-for-database-tests-only-0123456789").update(token).digest("base64");
  return `${token}.${mac}`;
}
