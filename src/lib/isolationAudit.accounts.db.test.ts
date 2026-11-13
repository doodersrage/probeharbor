/**
 * Household/user isolation audit for db/admin.ts, db/referrals.ts,
 * db/billing.ts, db/accounts.ts and db/userMetadata.ts (IMPLEMENTATION_LOG:
 * "Cross-household tests ... every path"). Each test proves that one user's
 * call can't read or change another user's or household's rows, that trusted
 * fields stay server-only, or that an admin-only path refuses non-admins.
 * Paths already proven elsewhere are listed in the audit table, not repeated.
 *
 * The two gaps the audit found (self-referral, and a referral claimed by an
 * existing account via oauth-done?new=1) were fixed on 2026-11-08; their
 * tests now pass like the rest.
 */
import type { APIContext } from "astro";
import { describe, expect, it, vi } from "vitest";
import { insertTestUser, useTestDatabase } from "../test/db";

vi.mock("./runtimeEnv", () => ({
  getRuntimeEnv: () => undefined,
  hasRuntimeEnv: () => false,
}));
vi.mock("./opsNotify", () => ({ notifyOps: async () => {} }));

// Routes read the signed-in user from here; tests choose who that is.
const signedIn: { id: string | null } = { id: null };
vi.mock("./auth", () => {
  const result = () =>
    signedIn.id
      ? { session: { access_token: "t", refresh_token: "" }, user: { id: signedIn.id, app_metadata: {}, user_metadata: {} } }
      : { session: null, user: null };
  return {
    getAuthFromCookies: async () => result(),
    getAuthFromRequest: async () => result(),
  };
});

import { POST as contactStatus } from "../pages/api/admin/contacts/status";
import { POST as toggleAdmin } from "../pages/api/admin/users/toggle-admin";
import { GET as oauthDone } from "../pages/api/auth/oauth-done";
import { GET as contactsCsv } from "../pages/api/contacts/export.csv";
import { isUserAdmin } from "./adminAccess";
import { chartShareKeys, deleteUserRow, releaseOwnedHouseholds } from "./db/accounts";
import { listManagedUsers, setUserAdminMembership } from "./db/admin";
import {
  claimWebhookEvent,
  findUserIdBySubscriptionId,
  releaseWebhookEvent,
  storedSubscription,
  syncPlanGroup,
  upsertSubscriptionRow,
} from "./db/billing";
import {
  addReferralRewardDays,
  claimReferralReward,
  findReferralCode,
  insertReferralCode,
  recordSignup,
  referredBy,
  setReferredBy,
} from "./db/referrals";
import { getPreferredHouseholdId } from "./db/households";
import { getUserMetadata, mergeUserMetadata } from "./db/userMetadata";
import { addHouseholdMemberByUserId, getUserHouseholdRole } from "./households";
import { applyReferralForNewUser, getOrCreateReferralCode } from "./referrals";
import { getUserRecord } from "./userRecords";

const db = useTestDatabase();
const sql = async <T = Record<string, unknown>>(text: string, params: unknown[] = []) =>
  (await db.client().query(text, params)).rows as T[];

async function person(email: string) {
  const id = await insertTestUser(db.client(), email);
  const [m] = await sql<{ household_id: string }>("select household_id from public.household_members where user_id = $1", [id]);
  return { id, home: m!.household_id };
}

const profile = async (userId: string) =>
  (
    await sql<{ metadata: Record<string, unknown>; app_metadata: Record<string, unknown> }>(
      "select metadata, app_metadata from public.user_profiles where user_id = $1",
      [userId],
    )
  )[0];

const groupsOf = async (userId: string) =>
  (
    await sql<{ name: string }>(
      "select g.name from public.group_members gm join public.groups g on g.id = gm.group_id where gm.user_id = $1 order by g.name",
      [userId],
    )
  ).map((r) => r.name);

async function makeAdmin(userId: string) {
  await sql(
    "insert into public.group_members (user_id, group_id, role) select $1, id, 'member' from public.groups where name = 'admin'",
    [userId],
  );
}

const subRow = (userId: string, subId: string, status = "active", tier = "pro") => ({
  user_id: userId,
  stripe_customer_id: `cus_${subId}`,
  stripe_subscription_id: subId,
  status,
  current_period_end: null,
  stripe_price_id: "price_x",
  plan_tier: tier,
});

/** Minimal Astro context for the routes under test. */
function ctx(path: string, opts: { method?: string; form?: Record<string, string>; cookies?: Record<string, string> } = {}) {
  const method = opts.method ?? "POST";
  const request = new Request(`http://localhost:4321${path}`, {
    method,
    body: method === "GET" ? undefined : new URLSearchParams(opts.form ?? {}),
  });
  const jar = new Map(Object.entries(opts.cookies ?? {}));
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

// ---- userMetadata.ts ----------------------------------------------------------

describe("user settings (user_profiles.metadata) stay per user", () => {
  it("getUserMetadata returns only the asked-for user's settings", async () => {
    const a = await person("a@example.com");
    const b = await person("b@example.com");
    await mergeUserMetadata(a.id, { theme: "dark", active_household_id: a.home });
    await expect(getUserMetadata(b.id)).resolves.toEqual({});
    await expect(getUserMetadata(a.id)).resolves.toEqual({ theme: "dark", active_household_id: a.home });
  });

  it("mergeUserMetadata changes only that user's row, and never the server-only app_metadata", async () => {
    const a = await person("a@example.com");
    const b = await person("b@example.com");
    await sql(`insert into public.user_profiles (user_id, metadata, app_metadata) values ($1, '{"theme":"light"}', '{"referral_reward_days": 7}')`, [
      a.id,
    ]);
    // A patch naming trusted keys only lands in the user-facing metadata.
    await mergeUserMetadata(b.id, { theme: "dark", referral_reward_days: 28, referred_by: "x", app_metadata: { referral_reward_days: 28 } });
    expect(await profile(a.id)).toEqual({ metadata: { theme: "light" }, app_metadata: { referral_reward_days: 7 } });
    expect((await profile(b.id))?.app_metadata).toEqual({});
    expect((await getUserRecord(b.id))?.app_metadata).toEqual({});
  });

  it("an active_household_id pointing at someone else's household doesn't grant it", async () => {
    const a = await person("a@example.com");
    const b = await person("b@example.com");
    await mergeUserMetadata(b.id, { active_household_id: a.home });
    // a.home has devices, so without the membership check it would win even as a fallback.
    await sql("insert into public.devices (household_id, name, source) values ($1, 'Probe', 'push')", [a.home]);
    await expect(getPreferredHouseholdId(b.id)).resolves.toBe(b.home);
    await expect(getUserHouseholdRole(b.id, a.home)).resolves.toBeNull();
  });
});

// ---- accounts.ts ----------------------------------------------------------------

describe("account deletion touches only the deleting user's households", () => {
  it("releaseOwnedHouseholds: deletes only the user's solo households, promotes only in households they own", async () => {
    const a = await person("a@example.com"); // deleting user; a.home is solo
    const shared = await person("owner2@example.com"); // a joins as member here
    const peer = await person("peer@example.com"); // also a member of shared.home
    const bystander = await person("bystander@example.com");
    const friend = await person("friend@example.com"); // member of a's second household
    await addHouseholdMemberByUserId(shared.home, a.id, "member");
    await addHouseholdMemberByUserId(shared.home, peer.id, "member");
    const [second] = await sql<{ id: string }>("insert into public.households (name) values ('A second') returning id");
    await sql("insert into public.household_members (household_id, user_id, role) values ($1, $2, 'owner')", [second!.id, a.id]);
    await addHouseholdMemberByUserId(second!.id, friend.id, "member");

    const deleted = await releaseOwnedHouseholds(a.id);
    expect(deleted).toEqual([a.home]);
    expect(await sql("select id from public.households where id = any($1)", [[shared.home, bystander.home, second!.id, friend.home]])).toHaveLength(4);
    // Where a was only a member, nobody gets promoted and the owner stays.
    await expect(getUserHouseholdRole(shared.id, shared.home)).resolves.toBe("owner");
    await expect(getUserHouseholdRole(peer.id, shared.home)).resolves.toBe("member");
    // Where a owned a shared household, the other member takes over.
    await expect(getUserHouseholdRole(friend.id, second!.id)).resolves.toBe("owner");
    await expect(getUserHouseholdRole(bystander.id, bystander.home)).resolves.toBe("owner");
  });

  it("chartShareKeys lists only the user's own shared chart images", async () => {
    const a = await person("a@example.com");
    const b = await person("b@example.com");
    await sql(
      `insert into public.chart_share_tokens (token, user_id, r2_key, expires_at) values
       ('ta', $1, 'chart-shares/a.png', now() + interval '1 day'), ('tb', $2, 'chart-shares/b.png', now() + interval '1 day')`,
      [a.id, b.id],
    );
    await expect(chartShareKeys(a.id)).resolves.toEqual(["chart-shares/a.png"]);
  });

  it("deleteUserRow removes exactly one user", async () => {
    const a = await person("a@example.com");
    const b = await person("b@example.com");
    await expect(deleteUserRow(a.id)).resolves.toBe(true);
    await expect(deleteUserRow(a.id)).resolves.toBe(false);
    expect(await sql("select id from public.auth_users")).toEqual([{ id: b.id }]);
    await expect(getUserHouseholdRole(b.id, b.home)).resolves.toBe("owner");
  });
});

// ---- billing.ts -------------------------------------------------------------------

describe("subscription rows and plan groups stay per user", () => {
  it("storedSubscription and upsertSubscriptionRow see and write only the given user's row", async () => {
    const a = await person("a@example.com");
    const b = await person("b@example.com");
    expect((await upsertSubscriptionRow(subRow(a.id, "sub_a"))).error).toBeNull();
    await expect(storedSubscription(b.id)).resolves.toBeNull();
    expect((await upsertSubscriptionRow(subRow(b.id, "sub_b", "canceled", "member"))).error).toBeNull();
    await expect(storedSubscription(a.id)).resolves.toEqual({ stripe_subscription_id: "sub_a", status: "active" });
  });

  it("a second user's row can't take over another user's Stripe subscription id", async () => {
    const a = await person("a@example.com");
    const b = await person("b@example.com");
    await upsertSubscriptionRow(subRow(a.id, "sub_a"));
    const res = await upsertSubscriptionRow(subRow(b.id, "sub_a"));
    expect(res.error).toMatch(/stripe_subscription_id/);
    await expect(findUserIdBySubscriptionId("sub_a")).resolves.toBe(a.id);
    await expect(storedSubscription(b.id)).resolves.toBeNull();
    await expect(findUserIdBySubscriptionId("sub_nope")).resolves.toBeNull();
  });

  it("syncPlanGroup changes only that user's plan groups, never anyone's admin or user group", async () => {
    const a = await person("a@example.com");
    const b = await person("b@example.com");
    await makeAdmin(b.id);
    await syncPlanGroup(a.id, "portfolio", true);
    await syncPlanGroup(b.id, "pro", true);
    await syncPlanGroup(b.id, "pro", false);
    expect(await groupsOf(a.id)).toEqual(["member", "portfolio", "pro", "user"]);
    expect(await groupsOf(b.id)).toEqual(["admin", "user"]);
  });

  it("releasing one webhook event id leaves other event ids claimed", async () => {
    await claimWebhookEvent("evt_a", "invoice.paid");
    await claimWebhookEvent("evt_b", "invoice.paid");
    await releaseWebhookEvent("evt_a");
    await expect(claimWebhookEvent("evt_b", "invoice.paid")).resolves.toEqual({ alreadyProcessed: true });
    await expect(claimWebhookEvent("evt_a", "invoice.paid")).resolves.toEqual({ alreadyProcessed: false });
  });
});

// ---- referrals.ts ------------------------------------------------------------------

describe("referral rows and trusted referral fields stay per user", () => {
  it("findReferralCode / insertReferralCode: a user can't see or take another user's code", async () => {
    const a = await person("a@example.com");
    const b = await person("b@example.com");
    await expect(insertReferralCode(a.id, "aaaa1111")).resolves.toBe(true);
    await expect(findReferralCode(b.id)).resolves.toBeNull();
    await expect(insertReferralCode(b.id, "aaaa1111")).resolves.toBe(false);
    await expect(insertReferralCode(a.id, "bbbb2222")).resolves.toBe(false); // one code per user, not replaced
    expect(await sql("select user_id, code from public.referral_codes")).toEqual([{ user_id: a.id, code: "aaaa1111" }]);
  });

  it("referredBy / setReferredBy: per user, and an existing referral is never overwritten", async () => {
    const a = await person("a@example.com");
    const b = await person("b@example.com");
    await setReferredBy(a.id, "first");
    await setReferredBy(a.id, "second");
    await expect(referredBy(a.id)).resolves.toBe("first");
    await expect(referredBy(b.id)).resolves.toBeNull();
    expect((await profile(b.id))?.app_metadata ?? {}).toEqual({});
  });

  it("claimReferralReward marks only that friend's signup; addReferralRewardDays credits only that referrer", async () => {
    const r1 = await person("r1@example.com");
    const r2 = await person("r2@example.com");
    const f1 = await person("f1@example.com");
    const f2 = await person("f2@example.com");
    await recordSignup(r1.id, f1.id);
    await recordSignup(r2.id, f2.id);
    await expect(claimReferralReward(f1.id)).resolves.toBe(r1.id);
    await expect(claimReferralReward(f1.id)).resolves.toBeNull();
    expect(await sql("select referrer_rewarded_at from public.referral_signups where referred_user_id = $1", [f2.id])).toEqual([
      { referrer_rewarded_at: null },
    ]);
    await addReferralRewardDays(r1.id);
    expect((await profile(r1.id))?.app_metadata).toEqual({ referral_reward_days: 7 });
    expect(await profile(r2.id)).toBeUndefined();
  });

  // Fixed 2026-11-08 (audit gap, src/lib/referrals.ts applyReferralForNewUser): recordReferralSignup
  // skips a self-referral, but setReferredBy still runs, so the user's own
  // code lands in app_metadata.referred_by and checkout adds the 7-day
  // referral bonus (referralBonusTrialDays). Reachable with the oauth-done gap below.
  it("a user's own code is not recorded as their referral", async () => {
    const a = await person("a@example.com");
    const code = await getOrCreateReferralCode(a.id);
    await applyReferralForNewUser(a.id, code, {});
    await expect(referredBy(a.id)).resolves.toBeNull();
  });

  // Fixed 2026-11-08 (audit gap, src/pages/api/auth/oauth-done.ts:38,52): "new account" is read from
  // the URL (?new=1) and the code from the oauth_ref cookie, both client
  // input, so any signed-in, not-yet-referred user can apply a referral at
  // any time and get app_metadata.referred_by (+7 trial days at checkout).
  it("an existing account can't claim a referral by visiting /api/auth/oauth-done?new=1", async () => {
    const referrer = await person("ref@example.com");
    const old = await person("old@example.com");
    await sql(`update public.auth_users set "createdAt" = now() - interval '30 days' where id = $1`, [old.id]);
    const code = await getOrCreateReferralCode(referrer.id);
    signedIn.id = old.id;
    try {
      await oauthDone(ctx("/api/auth/oauth-done?new=1", { method: "GET", cookies: { oauth_ref: code } }));
    } finally {
      signedIn.id = null;
    }
    await expect(referredBy(old.id)).resolves.toBeNull();
  });
});

// ---- admin.ts ---------------------------------------------------------------------

describe("admin-only paths refuse non-admins", () => {
  it("count_managed_users and list_managed_users both refuse a non-admin caller", async () => {
    const user = await person("user@example.com");
    const listed = await listManagedUsers({ callerId: user.id, page: 1, pageSize: 20, search: null, group: null, sortBy: "created_at", sortDir: "desc" });
    expect(listed).toMatchObject({ users: [], total: 0 });
    expect(listed.error).toMatch(/Forbidden/);
    await expect(sql("select public.count_managed_users($1, null, null)", [user.id])).rejects.toThrow(/Forbidden/);
  });

  it("a non-admin can't remove another user's admin access", async () => {
    const admin = await person("admin@example.com");
    const user = await person("user@example.com");
    await makeAdmin(admin.id);
    expect((await setUserAdminMembership(user.id, admin.id, false)).error).toMatch(/Forbidden/);
    await expect(isUserAdmin(admin.id)).resolves.toBe(true);
  });

  it("toggle-admin route: a non-admin is sent away and nothing changes", async () => {
    const user = await person("user@example.com");
    signedIn.id = user.id;
    try {
      const res = await toggleAdmin(ctx("/api/admin/users/toggle-admin", { form: { user_id: user.id, make_admin: "true" } }));
      expect(res.headers.get("Location")).toBe("/dashboard");
    } finally {
      signedIn.id = null;
    }
    await expect(isUserAdmin(user.id)).resolves.toBe(false);
  });

  it("contact routes: a non-admin can't export or update contact submissions", async () => {
    const user = await person("user@example.com");
    const [c] = await sql<{ id: number }>(
      "insert into public.contacts (name, email, message) values ('Alice', 'alice@example.com', 'secret message') returning id",
    );
    signedIn.id = user.id;
    try {
      const csv = await contactsCsv(ctx("/api/contacts/export.csv", { method: "GET" }));
      expect(csv.status).toBe(403);
      expect(await csv.text()).not.toContain("alice@example.com");
      const upd = await contactStatus(ctx("/api/admin/contacts/status", { form: { id: String(c!.id), status: "spam", admin_notes: "x" } }));
      expect(upd.status).toBe(403);
    } finally {
      signedIn.id = null;
    }
    expect(await sql("select status, admin_notes from public.contacts")).toEqual([{ status: "new", admin_notes: null }]);

    // The same routes work for an admin (so the 403 above is the gate, not a broken route).
    const admin = await person("admin@example.com");
    await makeAdmin(admin.id);
    signedIn.id = admin.id;
    try {
      const csv = await contactsCsv(ctx("/api/contacts/export.csv", { method: "GET" }));
      expect(csv.status).toBe(200);
      expect(await csv.text()).toContain("alice@example.com");
    } finally {
      signedIn.id = null;
    }
  });
});
