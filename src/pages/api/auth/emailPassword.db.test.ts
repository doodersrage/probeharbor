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
import { POST as forgot } from "./forgot-password";
import { POST as updatePassword } from "./update-password";

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

function ctx(
  method: "GET" | "POST",
  path: string,
  opts: { form?: Record<string, string>; cookie?: string; locale?: string; jar?: Record<string, string> } = {},
) {
  const headers = new Headers();
  if (opts.cookie) headers.set("cookie", opts.cookie);
  const request = new Request(`http://localhost:4321${path}`, {
    method,
    headers,
    body: opts.form ? new URLSearchParams(opts.form) : undefined,
  });
  const cookies = fakeCookies();
  for (const [name, value] of Object.entries(opts.jar ?? {})) cookies.set(name, value);
  return {
    request,
    url: new URL(request.url),
    cookies,
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

/** The decoded session cookie, as Astro's cookies.get() would give it. */
function sessionJar(res: Response): Record<string, string> {
  const pair = cookieHeader(res).split("; ").find((c) => c.includes("session_token="))!;
  const cut = pair.indexOf("=");
  return { [pair.slice(0, cut)]: decodeURIComponent(pair.slice(cut + 1)) };
}
const signIn = (email: string, password: string) =>
  signin(ctx("POST", "/api/auth/signin", { form: { email, password } }));

describe("password reset (Neon)", () => {
  async function requestReset(email: string, locale = "en") {
    mail.length = 0;
    const res = await forgot(ctx("POST", "/api/auth/forgot-password", { form: { email }, locale }));
    expect(location(res)).toBe("/forgot-password?sent=1");
    return mail;
  }
  async function followLink(text: string) {
    const link = linkFrom(text);
    const c = ctx("GET", `${link.pathname}${link.search}`);
    const res = await confirm(c);
    return { res, token: c.cookies.get("ph_reset_token")?.value };
  }

  it("unknown address: same answer, no email", async () => {
    expect(await requestReset("nobody@example.com")).toHaveLength(0);
  });

  it("the emailed link resets the password once and signs in; old password and other sessions end", async () => {
    await registerAndConfirm("a@example.com", "old-password-123");
    const other = await signIn("a@example.com", "old-password-123");
    const sent = await requestReset("a@example.com", "fr");
    expect(sent).toHaveLength(1);
    expect(sent[0]!.subject).toBe("Réinitialisez votre mot de passe");
    expect(linkFrom(sent[0]!.text).searchParams.get("type")).toBe("recovery");

    const { res, token } = await followLink(sent[0]!.text);
    expect(location(res)).toBe("/reset-password");
    expect(token).toBeTruthy();

    const mismatch = await updatePassword(
      ctx("POST", "/api/auth/update-password", { form: { password: "new-password-456", confirm: "nope-nope-nope" }, jar: { ph_reset_token: token! } }),
    );
    expect(location(mismatch)).toBe("/reset-password?error=mismatch");

    const c = ctx("POST", "/api/auth/update-password", {
      form: { password: "new-password-456", confirm: "new-password-456" },
      jar: { ph_reset_token: token! },
    });
    const done = await updatePassword(c);
    expect(location(done)).toBe("/dashboard?password=updated");
    expect(cookieHeader(done)).toMatch(/session_token=/);
    expect(c.cookies.get("ph_reset_token")).toBeUndefined();

    expect(location(await signIn("a@example.com", "old-password-123"))).toContain("error=invalid_credentials");
    expect(location(await signIn("a@example.com", "new-password-456"))).toBe("/dashboard");
    const stale = await getAuthFromRequest(new Request("http://x/", { headers: { cookie: cookieHeader(other) } }), fakeCookies() as never);
    expect(stale.user).toBeNull();

    // The same token again: used up.
    const again = await updatePassword(
      ctx("POST", "/api/auth/update-password", { form: { password: "third-password-789", confirm: "third-password-789" }, jar: { ph_reset_token: token! } }),
    );
    expect(location(again)).toBe("/reset-password?error=session");
  });

  it("an expired link is refused", async () => {
    await registerAndConfirm("a@example.com", "old-password-123");
    const sent = await requestReset("a@example.com");
    await sql(`update public.auth_verifications set "expiresAt" = now() - interval '1 minute' where identifier like 'reset-password:%'`);
    const { res, token } = await followLink(sent[0]!.text);
    expect(location(res)).toBe("/reset-password?error=session");
    expect(token).toBeUndefined();
  });

  it("a forged reset token is refused at the link and at the form", async () => {
    const res = await confirm(ctx("GET", "/api/auth/confirm?token_hash=forged-token&type=recovery"));
    expect(location(res)).toBe("/reset-password?error=session");
    const post = await updatePassword(
      ctx("POST", "/api/auth/update-password", { form: { password: "new-password-456", confirm: "new-password-456" }, jar: { ph_reset_token: "forged-token" } }),
    );
    expect(location(post)).toBe("/reset-password?error=session");
  });

  it("signed in, no token: changes the password without the current one", async () => {
    await registerAndConfirm("a@example.com", "old-password-123");
    const session = await signIn("a@example.com", "old-password-123");
    const res = await updatePassword(
      ctx("POST", "/api/auth/update-password", { form: { password: "changed-pass-1", confirm: "changed-pass-1" }, jar: sessionJar(session) }),
    );
    expect(location(res)).toBe("/dashboard?password=updated");
    expect(location(await signIn("a@example.com", "changed-pass-1"))).toBe("/dashboard");
    const anon = await updatePassword(ctx("POST", "/api/auth/update-password", { form: { password: "changed-pass-2", confirm: "changed-pass-2" } }));
    expect(location(anon)).toBe("/signin?error=generic");
  });

  it("resetting proves the inbox: an unconfirmed account ends up confirmed and signed in", async () => {
    await register(ctx("POST", "/api/auth/register", { form: { email: "late@example.com", password: "old-password-123" } }));
    const sent = await requestReset("late@example.com");
    const { token } = await followLink(sent[0]!.text);
    const done = await updatePassword(
      ctx("POST", "/api/auth/update-password", { form: { password: "new-password-456", confirm: "new-password-456" }, jar: { ph_reset_token: token! } }),
    );
    expect(location(done)).toBe("/dashboard?password=updated");
    expect(await sql(`select "emailVerified" as v from public.auth_users`)).toEqual([{ v: true }]);
  });
});
