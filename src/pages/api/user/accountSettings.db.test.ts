/**
 * Step 4g on Better Auth, against a local Postgres:
 * settings written to user_metadata (now user_profiles.metadata) and
 * account deletion. Real routes and helpers; the runtime's Neon pool is pg.
 */
import type { APIContext } from "astro";
import { describe, expect, it, vi } from "vitest";
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
// Deletion cancels any Stripe subscription first; there is none here.
vi.mock("../../../lib/stripeSubscriptions", async (orig) => ({
  ...(await orig<typeof import("../../../lib/stripeSubscriptions")>()),
  getUserSubscription: async () => null,
}));

import { updateDashboardOverviewMode } from "../../../lib/dashboardOverviewMode";
import { POST as setSession } from "../auth/set-session";
import { POST as signin } from "../auth/signin";
import { POST as locale } from "../locale";
import { POST as deleteAccount } from "./account/delete";
import { POST as onboarding } from "./onboarding";

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
const loc = (res: Response) => res.headers.get("Location") ?? "";

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
const metadataOf = async (id: string) =>
  (await sql<{ metadata: Record<string, unknown> }>("select metadata from public.user_profiles where user_id = $1", [id]))[0]?.metadata;

describe("settings in user_metadata (Neon)", () => {
  it("helpers write user_profiles.metadata from the session token and keep other keys", async () => {
    const { id, token } = await account("a@example.com");
    await sql("insert into public.user_profiles (user_id, metadata) values ($1, $2)", [id, JSON.stringify({ theme: "dark" })]);
    const { user, error } = await updateDashboardOverviewMode(token, "", "insights");
    expect(error).toBeNull();
    expect(user?.user_metadata).toEqual({ theme: "dark", dashboard_overview_mode: "insights" });
    expect(await metadataOf(id)).toEqual({ theme: "dark", dashboard_overview_mode: "insights" });
  });

  it("an expired or unknown session token writes nothing", async () => {
    const { id, token } = await account("a@example.com");
    expect((await updateDashboardOverviewMode("not-a-session", "", "insights")).error?.message).toBe("Invalid session");
    await sql(`update public.auth_sessions set "expiresAt" = now() - interval '1 minute'`);
    expect((await updateDashboardOverviewMode(token, "", "insights")).error?.message).toBe("Invalid session");
    expect(await metadataOf(id)).toBeUndefined();
  });

  it("the language and onboarding routes save on the account", async () => {
    const { id, browser } = await account("a@example.com");
    const changed = await locale(ctx(browser, "/api/locale", { locale: "fr", redirect: "/dashboard/settings" }));
    expect(changed.status).toBe(302);
    await onboarding(ctx(browser, "/api/user/onboarding", { action: "dismiss", redirect: "/dashboard" }));
    expect(await metadataOf(id)).toMatchObject({ locale: "fr", onboarding_dismissed: true });
  });

  it("set-session (Supabase tokens) doesn't exist on Neon", async () => {
    const { browser } = await account("a@example.com");
    const res = await setSession(ctx(browser, "/api/auth/set-session", {}, { access_token: "a", refresh_token: "b" }));
    expect(res.status).toBe(404);
  });
});

describe("account deletion (Neon)", () => {
  it("needs the right password, then removes the user with its logins and sessions", async () => {
    const { id, browser } = await account("a@example.com");
    const wrong = await deleteAccount(ctx(browser, "/api/user/account/delete", { confirm: "DELETE", password: "nope-nope" }));
    expect(loc(wrong)).toBe("/dashboard/settings?delete_error=password");
    expect(await sql("select 1 from public.auth_users")).toHaveLength(1);

    const done = await deleteAccount(ctx(browser, "/api/user/account/delete", { confirm: "DELETE", password: "pw-123456", redirect: "/" }));
    expect(loc(done)).toContain("account_deleted=1");
    expect(done.headers.getSetCookie().some((c) => /session_token=;.*Max-Age=0/.test(c))).toBe(true);
    for (const table of ["auth_users", "auth_sessions", "auth_accounts", "household_members"]) {
      expect(await sql(`select 1 from public.${table} where ${table === "auth_users" ? "id" : table === "household_members" ? "user_id" : '"userId"'} = $1`, [id])).toHaveLength(0);
    }
  });

  it("an account without a password confirms with its email", async () => {
    const { id, browser } = await account("oauth@example.com");
    await sql(`delete from public.auth_accounts where "userId" = $1`, [id]);
    await sql(`insert into public.auth_accounts ("accountId", "providerId", "userId", "updatedAt") values ('g1', 'google', $1, now())`, [id]);
    const wrong = await deleteAccount(ctx(browser, "/api/user/account/delete", { confirm: "DELETE", confirm_email: "other@example.com" }));
    expect(loc(wrong)).toBe("/dashboard/settings?delete_error=email");
    const done = await deleteAccount(ctx(browser, "/api/user/account/delete", { confirm: "DELETE", confirm_email: "OAUTH@example.com" }));
    expect(loc(done)).toContain("account_deleted=1");
    expect(await sql("select 1 from public.auth_users")).toHaveLength(0);
  });

  it("a YubiKey user without the step-up can't delete", async () => {
    const { id, browser } = await account("y@example.com");
    await sql("insert into public.user_profiles (user_id, metadata) values ($1, $2)", [id, JSON.stringify({ yubikey_otp_public_ids: ["ccccccbcdefg"] })]);
    const res = await deleteAccount(ctx(browser, "/api/user/account/delete", { confirm: "DELETE", password: "pw-123456" }));
    expect(loc(res)).toBe("/dashboard/settings?delete_error=mfa");
    expect(await sql("select 1 from public.auth_users")).toHaveLength(1);
  });
});
