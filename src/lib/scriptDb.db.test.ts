/**
 * The ops scripts' sign-in and password helpers (scripts/lib/scriptDb.mjs)
 * against a local Postgres. The session they create must be one Better Auth
 * itself accepts, since ops:dogfood uses it against the live site.
 */
import bcrypt from "bcryptjs";
import { hashPassword } from "better-auth/crypto";
import { describe, expect, it } from "vitest";
import { insertTestUser, testDatabaseUrl, useTestDatabase } from "../test/db";
import { openDb, setAccountPassword, signInForScript } from "../../scripts/lib/scriptDb.mjs";
import { createBetterAuth } from "./betterAuthConfig";

const SECRET = "test-secret-for-database-tests-only-0123456789";
const db = useTestDatabase();
const sql = async <T = Record<string, unknown>>(text: string, params: unknown[] = []) =>
  (await db.client().query(text, params)).rows as T[];

async function accountWithHash(email: string, hash: string) {
  const id = await insertTestUser(db.client(), email);
  await sql(
    `insert into public.auth_accounts ("accountId", "providerId", "userId", password, "updatedAt") values ($1::text, 'credential', $1::uuid, $2, now())`,
    [id, hash],
  );
  return id;
}

async function withScriptDb<T>(fn: (scriptDb: ReturnType<typeof openDb>) => Promise<T>): Promise<T> {
  const scriptDb = openDb(testDatabaseUrl(process.env.PROBEHARBOR_TEST_DB!));
  try {
    return await fn(scriptDb);
  } finally {
    await scriptDb.end();
  }
}

/** Who Better Auth (the app's own setup, secure cookies as in production) says the cookie belongs to. */
async function sessionUser(cookie: string): Promise<string | null> {
  const pg = (await import("pg")).default;
  const pool = new pg.Pool({ connectionString: testDatabaseUrl(process.env.PROBEHARBOR_TEST_DB!), max: 1 });
  try {
    const auth = createBetterAuth({
      database: pool,
      secret: SECRET,
      baseURL: "https://probeharbor.dev",
      rpID: "probeharbor.dev",
      secureCookies: true,
      sendVerificationEmail: async () => {},
      sendResetPassword: async () => {},
    });
    const found = await auth.api.getSession({ headers: new Headers({ cookie }) });
    return found?.user.id ?? null;
  } finally {
    await pool.end();
  }
}

describe("ops script sign-in", () => {
  it("a password copied from Supabase (bcrypt) signs in; Better Auth accepts the cookie; end() removes it", async () => {
    const id = await accountWithHash("e2e@example.com", await bcrypt.hash("pw-123456", 4));
    await withScriptDb(async (scriptDb) => {
      const session = await signInForScript(scriptDb, { email: "E2E@example.com", password: "pw-123456", secret: SECRET, userAgent: "test" });
      expect(session.userId).toBe(id);
      expect(session.cookie).toMatch(/^__Secure-better-auth\.session_token=/);
      expect(await sessionUser(session.cookie)).toBe(id);
      await session.end();
      expect(await sessionUser(session.cookie)).toBeNull();
    });
  });

  it("a Better Auth (scrypt) password signs in too", async () => {
    const id = await accountWithHash("e2e@example.com", await hashPassword("pw-123456"));
    await withScriptDb(async (scriptDb) => {
      const session = await signInForScript(scriptDb, { email: "e2e@example.com", password: "pw-123456", secret: SECRET, userAgent: "test" });
      expect(await sessionUser(session.cookie)).toBe(id);
    });
  });

  it("refuses a wrong password, an unknown email and an account with an authenticator app; no session is created", async () => {
    const id = await accountWithHash("e2e@example.com", await hashPassword("pw-123456"));
    await withScriptDb(async (scriptDb) => {
      const attempt = (email: string, password: string) =>
        signInForScript(scriptDb, { email, password, secret: SECRET, userAgent: "test" });
      await expect(attempt("e2e@example.com", "nope-nope")).rejects.toThrow(/Sign-in failed/);
      await expect(attempt("nobody@example.com", "pw-123456")).rejects.toThrow(/Sign-in failed/);
      await sql(`update public.auth_users set "twoFactorEnabled" = true where id = $1`, [id]);
      await expect(attempt("e2e@example.com", "pw-123456")).rejects.toThrow(/authenticator app/);
    });
    expect(await sql("select 1 from public.auth_sessions")).toHaveLength(0);
  });
});

describe("e2e password reset", () => {
  it("sets a new password, ends the account's sessions, leaves others alone; unknown email is false", async () => {
    const id = await accountWithHash("e2e@example.com", await bcrypt.hash("old-pass-1", 4));
    const other = await accountWithHash("other@example.com", await hashPassword("theirs-123"));
    await withScriptDb(async (scriptDb) => {
      const before = await signInForScript(scriptDb, { email: "e2e@example.com", password: "old-pass-1", secret: SECRET, userAgent: "test" });
      const theirs = await signInForScript(scriptDb, { email: "other@example.com", password: "theirs-123", secret: SECRET, userAgent: "test" });

      expect(await setAccountPassword(scriptDb, "e2e@example.com", "new-pass-2")).toBe(true);
      expect(await sessionUser(before.cookie)).toBeNull();
      expect(await sessionUser(theirs.cookie)).toBe(other);
      await expect(
        signInForScript(scriptDb, { email: "e2e@example.com", password: "old-pass-1", secret: SECRET, userAgent: "test" }),
      ).rejects.toThrow(/Sign-in failed/);
      const after = await signInForScript(scriptDb, { email: "e2e@example.com", password: "new-pass-2", secret: SECRET, userAgent: "test" });
      expect(await sessionUser(after.cookie)).toBe(id);

      expect(await setAccountPassword(scriptDb, "nobody@example.com", "x-123456")).toBe(false);
    });
  });
});
