/**
 * Passkeys through /api/auth/passkey on Better Auth,
 * against a local Postgres, with a small software authenticator (P-256 key,
 * "none" attestation) so Better Auth's WebAuthn checks run for real.
 */
import { createHash, generateKeyPairSync, randomBytes, sign, type KeyObject } from "node:crypto";
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

import { getAuthFromRequest } from "../../../lib/auth";
import { buildSiteUrl } from "../../../lib/siteUrl";
import { GET as listPasskeys, POST as passkey } from "./passkey";
import { POST as signin } from "./signin";

const db = useTestDatabase();
const sql = async <T = Record<string, unknown>>(text: string, params: unknown[] = []) =>
  (await db.client().query(text, params)).rows as T[];

// ---- a tiny browser: cookie jar + route context --------------------------------

type Browser = Map<string, string>;
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
async function call(browser: Browser, route: (c: APIContext) => Promise<Response> | Response, c: APIContext) {
  const res = await route(c);
  remember(browser, res);
  return res;
}
const body = async (res: Response) => (await res.clone().json()) as Record<string, unknown>;
const post = (browser: Browser, json: unknown) => call(browser, passkey, ctx(browser, "POST", "/api/auth/passkey", { json }));

// ---- a software authenticator ------------------------------------------------------

const b64url = (b: Uint8Array | Buffer) => Buffer.from(b).toString("base64url");
const sha256 = (b: Uint8Array | string) => createHash("sha256").update(b).digest();
function cborHead(major: number, n: number): number[] {
  if (n < 24) return [(major << 5) | n];
  if (n < 256) return [(major << 5) | 24, n];
  return [(major << 5) | 25, n >> 8, n & 0xff];
}
type Cbor = number | string | Uint8Array | Array<[Cbor, Cbor]>;
function cbor(v: Cbor): number[] {
  if (typeof v === "number") return v >= 0 ? cborHead(0, v) : cborHead(1, -1 - v);
  if (typeof v === "string") {
    const b = Buffer.from(v, "utf8");
    return [...cborHead(3, b.length), ...b];
  }
  if (v instanceof Uint8Array) return [...cborHead(2, v.length), ...v];
  return [...cborHead(5, v.length), ...v.flatMap(([k, val]) => [...cbor(k), ...cbor(val)])];
}

class SoftAuthenticator {
  readonly credentialId = randomBytes(16);
  private readonly key: KeyObject;
  private readonly cose: Uint8Array;
  private counter = 0;
  constructor() {
    const { privateKey, publicKey } = generateKeyPairSync("ec", { namedCurve: "P-256" });
    this.key = privateKey;
    const jwk = publicKey.export({ format: "jwk" }) as { x: string; y: string };
    this.cose = Uint8Array.from(
      cbor([
        [1, 2],
        [3, -7],
        [-1, 1],
        [-2, Buffer.from(jwk.x, "base64url")],
        [-3, Buffer.from(jwk.y, "base64url")],
      ]),
    );
  }
  private authData(rpId: string, flags: number, attested: boolean): Buffer {
    const count = Buffer.alloc(4);
    count.writeUInt32BE(this.counter++);
    const parts = [sha256(rpId), Buffer.from([flags]), count];
    if (attested) {
      const len = Buffer.alloc(2);
      len.writeUInt16BE(this.credentialId.length);
      parts.push(Buffer.alloc(16), len, this.credentialId, Buffer.from(this.cose));
    }
    return Buffer.concat(parts);
  }
  register(options: { challenge: string }, origin: string, rpId: string) {
    const clientData = Buffer.from(JSON.stringify({ type: "webauthn.create", challenge: options.challenge, origin, crossOrigin: false }));
    const attestation = Uint8Array.from(
      cbor([
        ["fmt", "none"],
        ["attStmt", []],
        ["authData", this.authData(rpId, 0x45, true)],
      ]),
    );
    const id = b64url(this.credentialId);
    return {
      id,
      rawId: id,
      type: "public-key",
      response: { clientDataJSON: b64url(clientData), attestationObject: b64url(attestation), transports: ["internal"] },
      clientExtensionResults: {},
      authenticatorAttachment: "platform",
    };
  }
  assert(options: { challenge: string }, origin: string, rpId: string) {
    const clientData = Buffer.from(JSON.stringify({ type: "webauthn.get", challenge: options.challenge, origin, crossOrigin: false }));
    const authData = this.authData(rpId, 0x05, false);
    const signature = sign("sha256", Buffer.concat([authData, sha256(clientData)]), this.key);
    const id = b64url(this.credentialId);
    return {
      id,
      rawId: id,
      type: "public-key",
      response: { clientDataJSON: b64url(clientData), authenticatorData: b64url(authData), signature: b64url(signature) },
      clientExtensionResults: {},
    };
  }
}

const site = () => new URL(buildSiteUrl(new Request("http://localhost:4321/")));

// ---- accounts -----------------------------------------------------------------------

async function signedIn(email: string) {
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
  const browser: Browser = new Map();
  await call(browser, signin, ctx(browser, "POST", "/api/auth/signin", { form: { email, password: "pw-123456" } }));
  const [u] = await sql<{ id: string }>("select id from public.auth_users where email = $1", [email]);
  return { browser, id: u!.id };
}
async function addPasskey(browser: Browser, key: SoftAuthenticator) {
  const started = await post(browser, { action: "register_options" });
  expect(started.status).toBe(200);
  const { options } = (await body(started)) as { options: { challenge: string; rp: { id: string } } };
  const s = site();
  return post(browser, { action: "register_verify", name: "Laptop", response: key.register(options, s.origin, s.hostname) });
}
async function signInWithPasskey(key: SoftAuthenticator, next?: string, origin = site().origin) {
  const browser: Browser = new Map();
  const { options } = (await body(await post(browser, { action: "signin_options" }))) as { options: { challenge: string } };
  const assertion = key.assert(options, origin, site().hostname);
  const res = await post(browser, { action: "signin_verify", response: assertion, next });
  return { browser, res, assertion };
}

describe("passkeys (Neon)", () => {
  it("add one in settings, then sign in with it on a fresh browser", async () => {
    const { browser, id } = await signedIn("a@example.com");
    const key = new SoftAuthenticator();
    const added = await addPasskey(browser, key);
    expect(added.status).toBe(200);
    const listed = (await body(await listPasskeys(ctx(browser, "GET", "/api/auth/passkey")))) as { passkeys: Array<{ name: string }> };
    expect(listed.passkeys.map((p) => p.name)).toEqual(["Laptop"]);

    await sql("delete from public.auth_sessions");
    const { browser: fresh, res } = await signInWithPasskey(key, "/dashboard/devices");
    expect(await body(res)).toEqual({ ok: true, redirectTo: "/dashboard/devices" });
    const cookie = [...fresh].map(([n, v]) => `${n}=${v}`).join("; ");
    const auth = await getAuthFromRequest(new Request("http://x/", { headers: { cookie } }), { get: () => undefined } as never);
    expect(auth.user?.id).toBe(id);
  });

  it("refuses an unknown key, a replayed sign-in and the wrong origin", async () => {
    const { browser } = await signedIn("a@example.com");
    const key = new SoftAuthenticator();
    await addPasskey(browser, key);

    expect((await signInWithPasskey(new SoftAuthenticator())).res.status).toBe(401);
    expect((await signInWithPasskey(key, undefined, "https://evil.example")).res.status).toBe(401);

    const { browser: b2, res, assertion } = await signInWithPasskey(key);
    expect(res.status).toBe(200);
    const replay = await post(b2, { action: "signin_verify", response: assertion });
    expect(replay.status).toBe(401);
  });

  it("with a second factor on, adding a passkey needs a verified session", async () => {
    const { browser, id } = await signedIn("y@example.com");
    await sql("insert into public.user_profiles (user_id, metadata) values ($1, $2)", [id, JSON.stringify({ yubikey_otp_public_ids: ["ccccccbcdefg"] })]);
    const blocked = await post(browser, { action: "register_options" });
    expect(blocked.status).toBe(401);
    expect(await sql("select 1 from public.auth_passkeys")).toHaveLength(0);
  });

  it("delete removes your own passkey only", async () => {
    const a = await signedIn("a@example.com");
    const b = await signedIn("b@example.com");
    await addPasskey(a.browser, new SoftAuthenticator());
    const [pk] = await sql<{ id: string }>("select id from public.auth_passkeys");
    const notYours = await post(b.browser, { action: "delete", id: pk!.id });
    expect(notYours.status).toBe(400);
    expect(await sql("select 1 from public.auth_passkeys")).toHaveLength(1);
    expect((await post(a.browser, { action: "delete", id: pk!.id })).status).toBe(200);
    expect(await sql("select 1 from public.auth_passkeys")).toHaveLength(0);
  });

  it("settings actions need a session", async () => {
    const anon: Browser = new Map();
    expect((await post(anon, { action: "register_options" })).status).toBe(401);
    expect((await listPasskeys(ctx(anon, "GET", "/api/auth/passkey"))).status).toBe(401);
  });
});
