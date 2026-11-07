import { describe, expect, it, vi } from "vitest";
import { insertTestUser, useTestDatabase } from "../test/db";

vi.mock("./runtimeEnv", () => ({
  getRuntimeEnv: (key: string) => (key === "DB_BACKEND" ? "neon" : undefined),
  hasRuntimeEnv: () => false,
}));

import { countPushSubscriptions, releasePushSubscriptionFromOtherUsers } from "./webPush";

const db = useTestDatabase();

async function subscribe(userId: string, endpoint: string) {
  await db
    .client()
    .query("insert into public.push_subscriptions (user_id, endpoint, p256dh, auth) values ($1, $2, 'k', 'a')", [
      userId,
      endpoint,
    ]);
}

async function endpointsOf(userId: string): Promise<string[]> {
  const { rows } = await db
    .client()
    .query<{ endpoint: string }>("select endpoint from public.push_subscriptions where user_id = $1 order by 1", [userId]);
  return rows.map((r) => r.endpoint);
}

describe("countPushSubscriptions (Neon)", () => {
  it("counts only the given user's subscriptions, as a number", async () => {
    const a = await insertTestUser(db.client(), "a@example.com");
    const b = await insertTestUser(db.client(), "b@example.com");
    await subscribe(a, "https://push.example.com/a1");
    await subscribe(a, "https://push.example.com/a2");
    await subscribe(b, "https://push.example.com/b1");

    await expect(countPushSubscriptions(a)).resolves.toBe(2);
    await expect(countPushSubscriptions(b)).resolves.toBe(1);
  });

  it("is 0 for a user with none", async () => {
    const c = await insertTestUser(db.client(), "c@example.com");
    await expect(countPushSubscriptions(c)).resolves.toBe(0);
  });
});

describe("releasePushSubscriptionFromOtherUsers (Neon)", () => {
  it("removes the endpoint from other accounts and leaves everything else", async () => {
    const shared = "https://push.example.com/shared-browser";
    const a = await insertTestUser(db.client(), "a@example.com");
    const b = await insertTestUser(db.client(), "b@example.com");
    await subscribe(a, shared);
    await subscribe(a, "https://push.example.com/a-other");
    await subscribe(b, shared);

    await releasePushSubscriptionFromOtherUsers(null as never, b, shared);

    // A no longer gets B's alerts in the shared browser; A's other device stays.
    expect(await endpointsOf(a)).toEqual(["https://push.example.com/a-other"]);
    expect(await endpointsOf(b)).toEqual([shared]);
  });

  it("does nothing when no one else had the endpoint", async () => {
    const a = await insertTestUser(db.client(), "a@example.com");
    await subscribe(a, "https://push.example.com/mine");
    await releasePushSubscriptionFromOtherUsers(null as never, a, "https://push.example.com/mine");
    expect(await endpointsOf(a)).toEqual(["https://push.example.com/mine"]);
  });
});
