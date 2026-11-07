/**
 * Email + password routes on Better Auth (DB_BACKEND=neon), end to end
 * against a local Postgres: the real route handlers, the real Better Auth
 * runtime (its Neon pool swapped for pg) and the real email builder (only
 * the final send is captured).
 */
import pg from "pg";
import type { APIContext } from "astro";
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import { testDatabaseUrl, useTestDatabase } from "../../../test/db";

const SECRET = "test-secret-for-database-tests-only-0123456789";
vi.mock("../../../lib/runtimeEnv", () => ({
  getRuntimeEnv: (key: string) =>
    ({ DB_BACKEND: "neon", DATABASE_URL: testDatabaseUrl(process.env.PROBEHARBOR_TEST_DB!), BETTER_AUTH_SECRET: SECRET })[key],
  hasRuntimeEnv: () => false,
}));
vi.mock("@neondatabase/serverless", async (orig) => ({
  ...(await orig<typeof import("@neondatabase/serverless")>()),
  Pool: (await import("pg")).default.Pool,
}));
vi.mock("../../../lib/turnstile", () => ({
  getTurnstileToken: () => "ok",
  verifyTurnstileToken: async () => ({ success: true }),
}));
const mail: Array<{ to: string; subject: string; text: string; html?: string }> = [];
vi.mock("../../../lib/mailer", () => ({
  sendEmail: async (to: string, subject: string, text: string, options?: { html?: string }) =>
    void mail.push({ to, subject, text, html: options?.html }),
}));

import { getAuthFromRequest } from "../../../lib/auth";
import { GET as confirm } from "./confirm";
import { POST as register } from "./register";
import { POST as resend } from "./resend-confirmation";
import { POST as signin } from "./signin";
import { POST as signout } from "./signout";
import { POST as signoutEverywhere } from "./signout-everywhere";

const db = useTestDatabase();
const sql = async <T = Record<string, unknown>>(text: string, params: unknown[] = []) =>
  (await db.client().query(text, params)).rows as T[];
const pool = new pg.Pool({ connectionString: testDatabaseUrl(process.env.PROBEHARBOR_TEST_DB!), max: 2 });
afterAll(() => pool.end());

function fakeCookies() {
  const jar = new Map<string, string>();
  return {
    get: (n: string) => (jar.has(n) ? { value: jar.get(n)! } : undefined),
    set: (n: string, v: string) => void jar.set(n, v),
    delete: (n: string) => void jar.delete(n),
    has: (n: string) => jar.has(n),
  };
}
const redirect = (location: string) => new Response(null, { status: 302, headers: { Location: location } });

function ctx(method: "GET" | "POST", path: string, opts: { form?: Record<string, string>; cookie?: string; locale?: string } = {}) {
  const headers = new Headers();
  if (opts.cookie) headers.set("cookie", opts.cookie);
  const request = new Request(`http://localhost:4321${path}`, {
    method,
    headers,
    body: opts.form ? new URLSearchParams(opts.form) : undefined,
  });
  return {
    request,
    url: new URL(request.url),
    cookies: fakeCookies(),
    redirect,
    clientAddress: "127.0.0.1",
    locals: { locale: opts.locale ?? "en" },
    site: undefined,
  } as unknown as APIContext;
}

const location = (res: Response) => res.headers.get("Location") ?? "";
/** "name=value" pairs from Set-Cookie, ready for a Cookie header. */
const cookieHeader = (res: Response) =>
  res.headers
    .getSetCookie()
    .map((c) => c.split(";")[0]!)
    .filter((c) => !c.endsWith("="))
    .join("; ");
const linkFrom = (text: string) => new URL(/https?:\/\/\S+\/api\/auth\/confirm\?\S+/.exec(text)![0]);

beforeEach(() => {
  mail.length = 0;
});

async function registerAndConfirm(email: string, password = "a-good-password") {
  await register(ctx("POST", "/api/auth/register", { form: { email, password } }));
  const link = linkFrom(mail.at(-1)!.text);
  return confirm(ctx("GET", `${link.pathname}${link.search}`));
}

describe("register and confirm (Neon)", () => {
  it("sends a translated confirmation link; following it confirms and signs in", async () => {
    const res = await register(ctx("POST", "/api/auth/register", { form: { email: "new@example.com", password: "a-good-password" }, locale: "es" }));
    expect(location(res)).toMatch(/^\/signin\?registered=1&next=/);
    expect(mail).toHaveLength(1);
    expect(mail[0]).toMatchObject({ to: "new@example.com", subject: "Confirma tu dirección de correo" });
    const [user] = await sql<{ id: string }>("select id from public.auth_users");
    expect(await sql("select metadata from public.user_profiles where user_id = $1", [user!.id])).toEqual([{ metadata: { locale: "es" } }]);

    // Before confirming: the sign-in page's "confirm your email" error.
    const early = await signin(ctx("POST", "/api/auth/signin", { form: { email: "new@example.com", password: "a-good-password" } }));
    expect(location(early)).toContain("error=email_not_confirmed");

    const link = linkFrom(mail[0]!.text);
    expect(link.searchParams.get("type")).toBe("signup");
    const confirmed = await confirm(ctx("GET", `${link.pathname}${link.search}`));
    expect(location(confirmed)).toBe("/dashboard/devices"); // dashboard paths aren't language-prefixed
    const auth = await getAuthFromRequest(new Request("http://x/", { headers: { cookie: cookieHeader(confirmed) } }), fakeCookies() as never);
    expect(auth.user?.id).toBe(user!.id);

    // The same link again: already used.
    const again = await confirm(ctx("GET", `${link.pathname}${link.search}`));
    expect(location(again)).toBe("/signin?error=confirm_link");
  });

  it("an address that already has an account gets the same answer, no new user and no email", async () => {
    await registerAndConfirm("taken@example.com");
    mail.length = 0;
    const res = await register(ctx("POST", "/api/auth/register", { form: { email: "taken@example.com", password: "another-password" } }));
    expect(location(res)).toMatch(/^\/signin\?registered=1/);
    expect(mail).toHaveLength(0);
    expect(await sql("select 1 from public.auth_users")).toHaveLength(1);
  });

  it("a forged confirmation token is refused", async () => {
    const res = await confirm(ctx("GET", "/api/auth/confirm?token_hash=forged.token.value&type=signup"));
    expect(location(res)).toBe("/signin?error=confirm_link");
  });

  it("resend: unknown addresses get the same answer and no email", async () => {
    const res = await resend(ctx("POST", "/api/auth/resend-confirmation", { form: { email: "nobody@example.com" } }));
    expect(location(res)).toBe("/resend-confirmation?sent=1");
    expect(mail).toHaveLength(0);
    await register(ctx("POST", "/api/auth/register", { form: { email: "late@example.com", password: "a-good-password" } }));
    mail.length = 0;
    await resend(ctx("POST", "/api/auth/resend-confirmation", { form: { email: "late@example.com" } }));
    expect(mail.map((m) => m.to)).toEqual(["late@example.com"]);
  });
});

describe("sign in and out (Neon)", () => {
  it("right password signs in; wrong password is the usual error", async () => {
    await registerAndConfirm("a@example.com");
    const bad = await signin(ctx("POST", "/api/auth/signin", { form: { email: "a@example.com", password: "wrong-password" } }));
    expect(location(bad)).toContain("error=invalid_credentials");
    expect(cookieHeader(bad)).toBe("");

    const ok = await signin(ctx("POST", "/api/auth/signin", { form: { email: "a@example.com", password: "a-good-password", next: "/dashboard/devices" } }));
    expect(location(ok)).toBe("/dashboard/devices");
    expect(cookieHeader(ok)).toMatch(/better-auth\.session_token=/);
  });

  it("with two-factor on, the password step sends to /signin/mfa without a session", async () => {
    await registerAndConfirm("mfa@example.com");
    await sql(`update public.auth_users set "twoFactorEnabled" = true`);
    const [u] = await sql<{ id: string }>("select id from public.auth_users");
    await sql(`insert into public.auth_two_factors (secret, "backupCodes", "userId", verified) values ('x', 'y', $1, true)`, [u!.id]);
    await sql("delete from public.auth_sessions");
    const res = await signin(ctx("POST", "/api/auth/signin", { form: { email: "mfa@example.com", password: "a-good-password" } }));
    expect(location(res)).toBe("/signin/mfa");
    expect(cookieHeader(res)).not.toMatch(/session_token=/);
    expect(await sql("select 1 from public.auth_sessions")).toHaveLength(0);
  });

  it("sign out ends this session; sign out everywhere ends all of them", async () => {
    await registerAndConfirm("a@example.com");
    const one = cookieHeader(await signin(ctx("POST", "/api/auth/signin", { form: { email: "a@example.com", password: "a-good-password" } })));
    const two = cookieHeader(await signin(ctx("POST", "/api/auth/signin", { form: { email: "a@example.com", password: "a-good-password" } })));
    const before = (await sql("select 1 from public.auth_sessions")).length;

    const out = await signout(ctx("POST", "/api/auth/signout", { cookie: one }));
    expect(location(out)).toBe("/signin");
    expect(out.headers.getSetCookie().some((c) => /session_token=;.*Max-Age=0/.test(c))).toBe(true);
    expect((await sql("select 1 from public.auth_sessions")).length).toBe(before - 1);
    const stillTwo = await getAuthFromRequest(new Request("http://x/", { headers: { cookie: two } }), fakeCookies() as never);
    expect(stillTwo.user).toBeTruthy();

    // signout-everywhere reads the session from cookies: hand it the signed value.
    const c = ctx("POST", "/api/auth/signout-everywhere", { cookie: two });
    const cut = two.indexOf("=");
    const [name, value] = [two.slice(0, cut), two.slice(cut + 1)];
    (c.cookies as unknown as ReturnType<typeof fakeCookies>).set(name, decodeURIComponent(value));
    const all = await signoutEverywhere(c);
    expect(location(all)).toBe("/signin?signed_out=all");
    expect(await sql("select 1 from public.auth_sessions")).toHaveLength(0);
  });
});
