/**
 * Push registrations on the Neon path, through the real API routes (only the
 * sign-in and plan checks are stubbed). The Supabase client must never be
 * created on this path.
 */
import type { APIContext } from "astro";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { insertTestUser, useTestDatabase } from "../test/db";

vi.mock("./runtimeEnv", () => ({
  getRuntimeEnv: (key: string) => (key === "DB_BACKEND" ? "neon" : undefined),
  hasRuntimeEnv: () => false,
}));
const signedIn = vi.hoisted(() => ({ userId: "" }));
vi.mock("./auth", () => ({
  getAuthFromRequest: async () => ({ user: signedIn.userId ? { id: signedIn.userId } : null }),
}));
vi.mock("./entitlements", () => ({ getUserEntitlements: async () => ({ canUsePush: true }) }));
vi.mock("./supabase", () => ({
  createAdminClient: () => {
    throw new Error("Supabase client created on the Neon path");
  },
  createServerClient: () => {
    throw new Error("Supabase client created on the Neon path");
  },
}));

import * as fcmRoute from "../pages/api/push/fcm";
import * as subscribeRoute from "../pages/api/push/subscribe";
import { countFcmTokens, releaseFcmTokenFromOtherUsers } from "./fcm";
import { countPushSubscriptions, releasePushSubscriptionFromOtherUsers } from "./webPush";

const db = useTestDatabase();
const sql = async <T = Record<string, unknown>>(text: string, params: unknown[] = []) =>
  (await db.client().query(text, params)).rows as T[];

function call(handler: (ctx: APIContext) => Promise<Response> | Response, method: string, body: unknown) {
  return handler({
    request: new Request("https://example.com/api/push", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
    cookies: {},
    locals: {},
  } as unknown as APIContext);
}

// Real FCM tokens are long; the route rejects anything under 20 characters.
const TOKEN_1 = "fcm-token-one-0123456789abcdef";
const PHONE = "fcm-token-phone-0123456789abcdef";

const sub = (endpoint: string, key = "k1") => ({ endpoint, keys: { p256dh: key, auth: "a1" } });

beforeEach(() => {
  signedIn.userId = "";
});

describe("browser push subscriptions (Neon)", () => {
  it("subscribe saves, re-subscribe updates keys, unsubscribe removes", async () => {
    const a = await insertTestUser(db.client(), "a@example.com");
    signedIn.userId = a;

    expect((await call(subscribeRoute.POST, "POST", sub("https://push.example/1"))).status).toBe(200);
    expect((await call(subscribeRoute.POST, "POST", sub("https://push.example/1", "k2"))).status).toBe(200);
    expect(await sql("select p256dh from public.push_subscriptions where user_id = $1", [a])).toEqual([{ p256dh: "k2" }]);
    await expect(countPushSubscriptions(a)).resolves.toBe(1);

    expect((await call(subscribeRoute.DELETE, "DELETE", { endpoint: "https://push.example/1" })).status).toBe(200);
    await expect(countPushSubscriptions(a)).resolves.toBe(0);
  });

  it("subscribing a browser hands it over from the previous account", async () => {
    const a = await insertTestUser(db.client(), "a@example.com");
    const b = await insertTestUser(db.client(), "b@example.com");
    signedIn.userId = a;
    await call(subscribeRoute.POST, "POST", sub("https://push.example/shared"));
    signedIn.userId = b;
    await call(subscribeRoute.POST, "POST", sub("https://push.example/shared"));

    await expect(countPushSubscriptions(a)).resolves.toBe(0);
    await expect(countPushSubscriptions(b)).resolves.toBe(1);
  });

  it("unsubscribing can't remove another user's subscription", async () => {
    const a = await insertTestUser(db.client(), "a@example.com");
    const b = await insertTestUser(db.client(), "b@example.com");
    signedIn.userId = a;
    await call(subscribeRoute.POST, "POST", sub("https://push.example/a"));
    signedIn.userId = b;
    await call(subscribeRoute.DELETE, "DELETE", { endpoint: "https://push.example/a" });
    await expect(countPushSubscriptions(a)).resolves.toBe(1);
  });
});

describe("app tokens (Neon)", () => {
  it("register saves platform and app, re-register updates, delete removes", async () => {
    const a = await insertTestUser(db.client(), "a@example.com");
    signedIn.userId = a;
    expect((await call(fcmRoute.POST, "POST", { token: TOKEN_1, platform: "android", appId: "app.one" })).status).toBe(200);
    expect((await call(fcmRoute.POST, "POST", { token: TOKEN_1, platform: "ios", appId: "app.two" })).status).toBe(200);
    expect(await sql("select platform, app_id from public.fcm_device_tokens where user_id = $1", [a])).toEqual([
      { platform: "ios", app_id: "app.two" },
    ]);
    await expect(countFcmTokens(a)).resolves.toBe(1);

    expect((await call(fcmRoute.DELETE, "DELETE", { token: TOKEN_1 })).status).toBe(200);
    await expect(countFcmTokens(a)).resolves.toBe(0);
  });

  it("a phone that signs in as someone else stops getting the old account's alerts", async () => {
    const a = await insertTestUser(db.client(), "a@example.com");
    const b = await insertTestUser(db.client(), "b@example.com");
    signedIn.userId = a;
    await call(fcmRoute.POST, "POST", { token: PHONE });
    signedIn.userId = b;
    await call(fcmRoute.POST, "POST", { token: PHONE });
    await expect(countFcmTokens(a)).resolves.toBe(0);
    await expect(countFcmTokens(b)).resolves.toBe(1);

    // And deleting with another user's token does nothing to theirs.
    signedIn.userId = a;
    await call(fcmRoute.DELETE, "DELETE", { token: PHONE });
    await expect(countFcmTokens(b)).resolves.toBe(1);
  });
});

describe("hand-off on its own keeps the current user's registration (Neon)", () => {
  it("removes the endpoint / token from other users only", async () => {
    const a = await insertTestUser(db.client(), "a@example.com");
    const b = await insertTestUser(db.client(), "b@example.com");
    for (const u of [a, b]) {
      await sql("insert into public.push_subscriptions (user_id, endpoint, p256dh, auth) values ($1, 'https://push.example/x', 'k', 'a')", [u]);
      await sql("insert into public.fcm_device_tokens (user_id, token) values ($1, $2)", [u, PHONE]);
    }
    await releasePushSubscriptionFromOtherUsers(null, b, "https://push.example/x");
    await releaseFcmTokenFromOtherUsers(null, b, PHONE);
    await expect(countPushSubscriptions(a)).resolves.toBe(0);
    await expect(countPushSubscriptions(b)).resolves.toBe(1);
    await expect(countFcmTokens(a)).resolves.toBe(0);
    await expect(countFcmTokens(b)).resolves.toBe(1);
  });
});
