import { describe, expect, it, vi } from "vitest";
import { insertTestUser, useTestDatabase } from "../test/db";

vi.mock("./runtimeEnv", () => ({
  getRuntimeEnv: () => undefined,
  hasRuntimeEnv: () => false,
}));

import {
  applyReferralForNewUser,
  countReferralSignups,
  fetchReferralAdminStats,
  getOrCreateReferralCode,
  grantReferrerRewardOnSubscription,
  resolveReferrerUserId,
} from "./referrals";

const db = useTestDatabase();
const sql = async <T = Record<string, unknown>>(text: string, params: unknown[] = []) =>
  (await db.client().query(text, params)).rows as T[];

const profile = async (userId: string) =>
  (await sql<{ metadata: Record<string, unknown>; app_metadata: Record<string, unknown> }>(
    "select metadata, app_metadata from public.user_profiles where user_id = $1",
    [userId],
  ))[0];

describe("referral codes (Neon)", () => {
  it("one code per user, stable, even when asked for twice at once", async () => {
    const a = await insertTestUser(db.client(), "a@example.com");
    const [c1, c2] = await Promise.all([getOrCreateReferralCode(a), getOrCreateReferralCode(a)]);
    expect(c1).toBe(c2);
    await expect(getOrCreateReferralCode(a)).resolves.toBe(c1);
    await expect(resolveReferrerUserId(` ${c1.toUpperCase()} `)).resolves.toBe(a);
    await expect(resolveReferrerUserId("nosuchcode")).resolves.toBeNull();
  });
});

describe("referral sign-ups and rewards (Neon)", () => {
  it("a new user's referral is recorded once, in the server-only fields", async () => {
    const referrer = await insertTestUser(db.client(), "ref@example.com");
    const newbie = await insertTestUser(db.client(), "new@example.com");
    const other = await insertTestUser(db.client(), "other@example.com");
    const code = await getOrCreateReferralCode(referrer);
    const otherCode = await getOrCreateReferralCode(other);

    await applyReferralForNewUser(newbie, code, {});
    await applyReferralForNewUser(newbie, otherCode, {}); // already referred: ignored
    expect(await profile(newbie)).toMatchObject({ app_metadata: { referred_by: code }, metadata: {} });
    await expect(countReferralSignups(referrer)).resolves.toBe(1);
    await expect(countReferralSignups(other)).resolves.toBe(0);

    await applyReferralForNewUser(referrer, code, {}); // self-referral
    await expect(countReferralSignups(referrer)).resolves.toBe(1);
  });

  it("the referrer earns 7 days once per friend, even if two subscription events arrive together", async () => {
    const referrer = await insertTestUser(db.client(), "ref@example.com");
    const friend1 = await insertTestUser(db.client(), "f1@example.com");
    const friend2 = await insertTestUser(db.client(), "f2@example.com");
    const code = await getOrCreateReferralCode(referrer);
    await applyReferralForNewUser(friend1, code, {});
    await applyReferralForNewUser(friend2, code, {});

    await Promise.all([grantReferrerRewardOnSubscription(friend1), grantReferrerRewardOnSubscription(friend1)]);
    expect((await profile(referrer))?.app_metadata.referral_reward_days).toBe(7);
    await grantReferrerRewardOnSubscription(friend2);
    expect((await profile(referrer))?.app_metadata.referral_reward_days).toBe(14);

    const stats = await fetchReferralAdminStats();
    expect(stats).toEqual({ totalSignups: 2, rewardedSignups: 2, topReferrers: [{ userId: referrer, count: 2 }] });
  });

  it("two different friends subscribing at the same moment both count", async () => {
    const referrer = await insertTestUser(db.client(), "ref@example.com");
    const friends = await Promise.all([1, 2, 3].map((i) => insertTestUser(db.client(), `f${i}@example.com`)));
    const code = await getOrCreateReferralCode(referrer);
    for (const f of friends) await applyReferralForNewUser(f, code, {});
    await Promise.all(friends.map((f) => grantReferrerRewardOnSubscription(f)));
    expect((await profile(referrer))?.app_metadata.referral_reward_days).toBe(21);
  });

  it("keeps the old cap: the stored value counts as at most 28 before adding 7", async () => {
    const referrer = await insertTestUser(db.client(), "ref@example.com");
    const friend = await insertTestUser(db.client(), "f@example.com");
    await sql(`insert into public.user_profiles (user_id, app_metadata) values ($1, '{"referral_reward_days": 40}')`, [referrer]);
    await applyReferralForNewUser(friend, await getOrCreateReferralCode(referrer), {});
    await grantReferrerRewardOnSubscription(friend);
    expect((await profile(referrer))?.app_metadata.referral_reward_days).toBe(35);
  });
});
