import bcrypt from "bcryptjs";
import pg from "pg";
import { afterAll, describe, expect, it } from "vitest";
import { testDatabaseUrl, useTestDatabase } from "../test/db";
import { type AuthEmail, createBetterAuth, upgradeCopiedPasswordHash, verifyStoredPassword } from "./betterAuthConfig";

const db = useTestDatabase();
const sql = async <T = Record<string, unknown>>(text: string, params: unknown[] = []) =>
  (await db.client().query(text, params)).rows as T[];

const pool = new pg.Pool({ connectionString: testDatabaseUrl(process.env.PROBEHARBOR_TEST_DB!), max: 3 });
afterAll(() => pool.end());

const sent: { verify: AuthEmail[]; reset: AuthEmail[] } = { verify: [], reset: [] };
const auth = createBetterAuth({
  database: pool,
  secret: "test-secret-for-database-tests-only-0123456789",
  baseURL: "http://localhost:4321",
  rpID: "localhost",
  sendVerificationEmail: async (e) => void sent.verify.push(e),
  sendResetPassword: async (e) => void sent.reset.push(e),
});

describe("Better Auth on the baseline tables", () => {
  it("sign-up creates the user, runs the household trigger and asks for email confirmation", async () => {
    sent.verify.length = 0;
    await auth.api.signUpEmail({ body: { email: "new@example.com", password: "a-good-password", name: "New" } });
    const [user] = await sql<{ id: string; emailVerified: boolean }>(`select id, "emailVerified" from public.auth_users`);
    expect(user!.emailVerified).toBe(false);
    expect(await sql("select role from public.household_members where user_id = $1", [user!.id])).toEqual([{ role: "owner" }]);
    expect(sent.verify.map((e) => e.email)).toEqual(["new@example.com"]);

    // Unconfirmed: no sign-in.
    await expect(auth.api.signInEmail({ body: { email: "new@example.com", password: "a-good-password" } })).rejects.toThrow();
    await auth.api.verifyEmail({ query: { token: sent.verify[0]!.token } });
    const signedIn = await auth.api.signInEmail({ body: { email: "new@example.com", password: "a-good-password" } });
    expect(signedIn.user.id).toBe(user!.id);
  });

  it("refuses short passwords", async () => {
    await expect(auth.api.signUpEmail({ body: { email: "s@example.com", password: "short", name: "S" } })).rejects.toThrow();
    expect(await sql("select 1 from public.auth_users")).toHaveLength(0);
  });

  it("a bcrypt password copied from Supabase signs in; a wrong one doesn't; the bearer token resolves", async () => {
    const [u] = await sql<{ id: string }>(
      `insert into public.auth_users (name, email, "emailVerified") values ('Old', 'old@example.com', true) returning id`,
    );
    await sql(
      `insert into public.auth_accounts ("accountId", "providerId", "userId", password, "updatedAt")
       values ($1::text, 'credential', $1::uuid, $2, now())`,
      [u!.id, bcrypt.hashSync("supabase-era-password", 10)],
    );
    await expect(auth.api.signInEmail({ body: { email: "old@example.com", password: "wrong-password" } })).rejects.toThrow();
    const ok = await auth.api.signInEmail({ body: { email: "old@example.com", password: "supabase-era-password" } });
    expect(ok.user.id).toBe(u!.id);

    const session = await auth.api.getSession({ headers: new Headers({ authorization: `Bearer ${ok.token}` }) });
    expect(session?.user.id).toBe(u!.id);
    await expect(auth.api.getSession({ headers: new Headers({ authorization: "Bearer not-a-token" }) })).resolves.toBeNull();
  });

  it("a copied bcrypt password is re-hashed on its first good sign-in, not on a wrong one, and still works after", async () => {
    const [u] = await sql<{ id: string }>(
      `insert into public.auth_users (name, email, "emailVerified") values ('Old', 'rehash@example.com', true) returning id`,
    );
    const copied = bcrypt.hashSync("supabase-era-password", 4);
    await sql(
      `insert into public.auth_accounts ("accountId", "providerId", "userId", password, "updatedAt")
       values ($1::text, 'credential', $1::uuid, $2, now())`,
      [u!.id, copied],
    );
    const stored = async () =>
      (await sql<{ password: string }>(`select password from public.auth_accounts where "userId" = $1`, [u!.id]))[0]!.password;

    await expect(auth.api.signInEmail({ body: { email: "rehash@example.com", password: "wrong-password" } })).rejects.toThrow();
    expect(await stored()).toBe(copied);

    await auth.api.signInEmail({ body: { email: "rehash@example.com", password: "supabase-era-password" } });
    const upgraded = await stored();
    expect(upgraded).not.toBe(copied);
    expect(upgraded).not.toMatch(/^\$2[aby]\$/);
    await expect(verifyStoredPassword({ hash: upgraded, password: "supabase-era-password" })).resolves.toBe(true);

    const again = await auth.api.signInEmail({ body: { email: "rehash@example.com", password: "supabase-era-password" } });
    expect(again.user.id).toBe(u!.id);
    expect(await stored()).toBe(upgraded);
    await expect(auth.api.signInEmail({ body: { email: "rehash@example.com", password: "wrong-password" } })).rejects.toThrow();
  });
});

describe("upgradeCopiedPasswordHash", () => {
  it("only replaces the exact old hash (a changed password wins) and never throws", async () => {
    const [u] = await sql<{ id: string }>(
      `insert into public.auth_users (name, email, "emailVerified") values ('Race', 'race@example.com', true) returning id`,
    );
    await sql(
      `insert into public.auth_accounts ("accountId", "providerId", "userId", password, "updatedAt")
       values ($1::text, 'credential', $1::uuid, 'changed-meanwhile', now())`,
      [u!.id],
    );
    await expect(upgradeCopiedPasswordHash(pool, bcrypt.hashSync("x-password", 4), "x-password")).resolves.toBe(false);
    expect((await sql<{ password: string }>(`select password from public.auth_accounts where "userId" = $1`, [u!.id]))[0]!.password).toBe(
      "changed-meanwhile",
    );
    const broken = { query: async () => { throw new Error("db down"); } };
    await expect(upgradeCopiedPasswordHash(broken, "$2a$04$x", "x-password")).resolves.toBe(false);
  });
});

describe("verifyStoredPassword", () => {
  it("accepts bcrypt ($2a/$2b) and Better Auth hashes, nothing else", async () => {
    const b = bcrypt.hashSync("pw-123456", 4);
    await expect(verifyStoredPassword({ hash: b, password: "pw-123456" })).resolves.toBe(true);
    await expect(verifyStoredPassword({ hash: b.replace("$2b$", "$2a$"), password: "pw-123456" })).resolves.toBe(true);
    await expect(verifyStoredPassword({ hash: b, password: "pw-1234567" })).resolves.toBe(false);
    const { hashPassword } = await import("better-auth/crypto");
    const s = await hashPassword("pw-123456");
    await expect(verifyStoredPassword({ hash: s, password: "pw-123456" })).resolves.toBe(true);
    await expect(verifyStoredPassword({ hash: s, password: "nope-nope" })).resolves.toBe(false);
  });
});
