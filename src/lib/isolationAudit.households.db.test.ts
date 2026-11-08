/**
 * Household-isolation audit (IMPLEMENTATION_PLAN.md, "Cross-household
 * tests"): one test per exported query in src/lib/db/{households,
 * householdTools,access,shareLinks,statusPages}.ts that the module's own db
 * test didn't already prove can't reach another household's, user's or
 * token's rows. Each test sets up two tenants and checks the other one is
 * untouched. The gap the audit found (accepting an invite could demote the
 * owner) was fixed on 2026-11-08; its test now passes like the rest.
 */
import type { APIContext } from "astro";
import { env as workerEnv } from "cloudflare:workers";
import { afterAll, describe, expect, it, vi } from "vitest";
import { insertTestUser, useTestDatabase } from "../test/db";

vi.mock("./runtimeEnv", () => ({
  getRuntimeEnv: () => undefined,
  hasRuntimeEnv: () => false,
}));
vi.mock("./mailer", () => ({ sendEmail: async () => {} }));

import { GET as shareReadingsRoute } from "../pages/api/share/[token]/readings";
import { getChartShareByToken } from "./chartShare";
import { createClaimsPackExport, getClaimsPackExportByToken } from "./claimsPackExports";
import { markInviteAccepted } from "./db/access";
import { oldReadings, setSignatureFormat } from "./db/householdTools";
import { insertHouseholdWithOwner, upsertHouseholdMember } from "./db/households";
import { findChartShare, insertChartShare } from "./db/shareLinks";
import { createHistorySavedView, listHistorySavedViews } from "./historySavedViews";
import { acceptHouseholdInvite, createHouseholdInvite, getInviteByToken, getInviteTokenState } from "./householdInvites";
import {
  addHouseholdMemberByUserId,
  countOwnedHouseholds,
  getOwnedHouseholdId,
  getUserHouseholdRole,
  isUserInHousehold,
  listHouseholdIdsForCron,
  removeHouseholdMember,
} from "./households";
import { createInboundWebhook, listInboundWebhooks, resolveInboundWebhook } from "./inboundWebhooks";
import { createHouseholdApiKey, listHouseholdApiKeys } from "./apiKeys";
import { storedShareTokenFields } from "./shareLinkTokens";
import { insertShareLink } from "./shareLinksStore";
import { createStatusPageToken, listStatusPageTokens } from "./statusPage";
import { unsubscribeStatusSubscription } from "./statusSubscriptions";

const db = useTestDatabase();
const sql = async <T = Record<string, unknown>>(text: string, params: unknown[] = []) =>
  (await db.client().query(text, params)).rows as T[];

/** A user plus the household the signup trigger made for them. */
async function userWithHome(email: string) {
  const id = await insertTestUser(db.client(), email);
  const [m] = await sql<{ household_id: string }>(
    "select household_id from public.household_members where user_id = $1 and role = 'owner'",
    [id],
  );
  return { id, email, home: m!.household_id };
}

async function sensorIn(householdId: string) {
  const [d] = await sql<{ id: string }>(
    "insert into public.devices (household_id, name, source) values ($1, 'P', 'push') returning id",
    [householdId],
  );
  const [s] = await sql<{ id: string }>(
    "insert into public.device_sensors (device_id, key, label, kind) values ($1, 't', 'T', 'temperature') returning id",
    [d!.id],
  );
  return s!.id;
}

const fakeBucket = {
  get: async () => ({ arrayBuffer: async () => new ArrayBuffer(4) }),
  put: async () => {},
} as unknown as R2Bucket;
(workerEnv as unknown as Record<string, unknown>).HISTORY_ARCHIVE = fakeBucket;
afterAll(() => {
  delete (workerEnv as unknown as Record<string, unknown>).HISTORY_ARCHIVE;
});

// ---- households.ts ----------------------------------------------------------

describe("isolation audit: households", () => {
  it("insertHouseholdWithOwner makes only the caller the owner and adds no one else", async () => {
    const a = await userWithHome("a@example.com");
    const b = await userWithHome("b@example.com");
    const created = await insertHouseholdWithOwner(a.id, "Cabin");
    expect(created.error).toBeNull();
    expect(await sql("select user_id, role from public.household_members where household_id = $1", [created.householdId])).toEqual([
      { user_id: a.id, role: "owner" },
    ]);
    await expect(isUserInHousehold(b.id, created.householdId)).resolves.toBe(false);
    await expect(countOwnedHouseholds(b.id)).resolves.toBe(1);
  });

  it("getOwnedHouseholdId ignores a household they only belong to, even when it's their active one", async () => {
    const a = await userWithHome("a@example.com");
    const b = await userWithHome("b@example.com");
    const c = await userWithHome("c@example.com");
    await addHouseholdMemberByUserId(b.home, a.id, "member");
    // Active points at a shared household (member, not owner), then at one they're not in at all.
    await sql("insert into public.user_profiles (user_id, metadata) values ($1, jsonb_build_object('active_household_id', $2::text))", [
      a.id,
      b.home,
    ]);
    await expect(getOwnedHouseholdId(a.id)).resolves.toBe(a.home);
    await sql("update public.user_profiles set metadata = jsonb_build_object('active_household_id', $2::text) where user_id = $1", [
      a.id,
      c.home,
    ]);
    await expect(getOwnedHouseholdId(a.id)).resolves.toBe(a.home);
  });

  it("countOwnedHouseholds counts only households the user owns, not ones they're a member of", async () => {
    const a = await userWithHome("a@example.com");
    const b = await userWithHome("b@example.com");
    await addHouseholdMemberByUserId(b.home, a.id, "member");
    await expect(countOwnedHouseholds(a.id)).resolves.toBe(1);
    await expect(countOwnedHouseholds(b.id)).resolves.toBe(1);
  });

  it("upsertHouseholdMember changes only that household's membership row for the user", async () => {
    const a = await userWithHome("a@example.com");
    const b = await userWithHome("b@example.com");
    const c = await userWithHome("c@example.com");
    await addHouseholdMemberByUserId(b.home, c.id, "member");
    await expect(upsertHouseholdMember(a.home, c.id, "viewer")).resolves.toEqual({ error: null });
    await expect(getUserHouseholdRole(c.id, a.home)).resolves.toBe("viewer");
    await expect(getUserHouseholdRole(c.id, b.home)).resolves.toBe("member");
    await expect(getUserHouseholdRole(c.id, c.home)).resolves.toBe("owner");
  });

  it("removeHouseholdMember through another household's id doesn't remove the member", async () => {
    const a = await userWithHome("a@example.com");
    const b = await userWithHome("b@example.com");
    const c = await userWithHome("c@example.com");
    await addHouseholdMemberByUserId(a.home, c.id, "member");
    // B's manager names A's member: nothing happens to A.
    await expect(removeHouseholdMember(b.home, c.id)).resolves.toEqual({ error: null });
    await expect(getUserHouseholdRole(c.id, a.home)).resolves.toBe("member");
    // Nor can B's id be used to remove A's owner.
    await removeHouseholdMember(b.home, a.id);
    await expect(getUserHouseholdRole(a.id, a.home)).resolves.toBe("owner");
  });

  // Fixed 2026-11-08 (audit gap): accepting an invite upserted the membership with
  //   on conflict (household_id, user_id) do update set role = excluded.role
  // (src/lib/db/households.ts upsertHouseholdMember), and acceptHouseholdInvite
  // (src/lib/householdInvites.ts) never checked the current role. Accepting now
  // inserts only when absent (insertHouseholdMemberIfAbsent), so no existing
  // member's role changes (households.db.test.ts). An invite
  // addressed to the owner's own email (created by the owner by mistake, or by
  // any full member — canManageHousehold allows members to invite) turns the
  // owner into a viewer when they click it. The household is then ownerless:
  // it drops out of listHouseholdIdsForCron (history collection, thermostat
  // snapshots), owner digests and getOwnedHouseholdId.
  it("accepting an invite never demotes the household owner", async () => {
    const owner = await userWithHome("owner@example.com");
    const member = await userWithHome("member@example.com");
    await addHouseholdMemberByUserId(owner.home, member.id, "member");
    const { token } = await createHouseholdInvite(owner.home, "owner@example.com", member.id, 7, "viewer");
    await acceptHouseholdInvite(token!, owner.id, "owner@example.com");
    await expect(getUserHouseholdRole(owner.id, owner.home)).resolves.toBe("owner");
    expect((await listHouseholdIdsForCron()).map((h) => h.householdId)).toContain(owner.home);
  });
});

// ---- access.ts (invites) ----------------------------------------------------

describe("isolation audit: invites", () => {
  it("an accepted invite can't be used again by anyone, and doesn't add the second user", async () => {
    const a = await userWithHome("a@example.com");
    const guest = await userWithHome("guest@example.com");
    const stranger = await userWithHome("stranger@example.com");
    const { token, invite } = await createHouseholdInvite(a.home, "guest@example.com", a.id, 7, "viewer");
    expect((await acceptHouseholdInvite(token!, guest.id, "guest@example.com")).error).toBeNull();
    const acceptedAtOf = async (id: string) =>
      (await sql<{ accepted_at: Date | null }>("select accepted_at from public.household_invites where id = $1", [id]))[0]?.accepted_at;
    const acceptedAt = await acceptedAtOf(invite!.id);
    expect(acceptedAt).not.toBeNull();

    await acceptHouseholdInvite(token!, stranger.id, "stranger@example.com");
    await expect(isUserInHousehold(stranger.id, a.home)).resolves.toBe(false);

    // markInviteAccepted only stamps an invite not yet accepted.
    await new Promise((r) => setTimeout(r, 5));
    await markInviteAccepted(invite!.id);
    expect(await acceptedAtOf(invite!.id)).toEqual(acceptedAt);
  });

  it("markInviteAccepted touches only the named invite, not another household's", async () => {
    const a = await userWithHome("a@example.com");
    const b = await userWithHome("b@example.com");
    const ia = await createHouseholdInvite(a.home, "x@example.com", a.id);
    const ib = await createHouseholdInvite(b.home, "x@example.com", b.id);
    await markInviteAccepted(ia.invite!.id);
    // Accepted: no longer returned as usable, and the state says why.
    await expect(getInviteByToken(ia.token!)).resolves.toBeNull();
    await expect(getInviteTokenState(ia.token!)).resolves.toEqual({ householdId: a.home, accepted: true, expired: false });
    expect((await getInviteByToken(ib.token!))?.accepted_at).toBeNull();
  });

  it("an invite's token only finds that invite (not one for the same address elsewhere)", async () => {
    const a = await userWithHome("a@example.com");
    const b = await userWithHome("b@example.com");
    const ia = await createHouseholdInvite(a.home, "x@example.com", a.id);
    await createHouseholdInvite(b.home, "x@example.com", b.id);
    expect((await getInviteByToken(ia.token!))?.household_id).toBe(a.home);
    await expect(getInviteByToken("0".repeat(48))).resolves.toBeNull();
  });

  it("insertApiKey's key lists and resolves only for its own household", async () => {
    const a = await userWithHome("a@example.com");
    const b = await userWithHome("b@example.com");
    const { key } = await createHouseholdApiKey({ householdId: a.home, name: "k", createdBy: a.id });
    expect((await listHouseholdApiKeys(a.home)).map((k) => k.id)).toEqual([key!.id]);
    expect(await listHouseholdApiKeys(b.home)).toEqual([]);
  });
});

// ---- householdTools.ts ------------------------------------------------------

describe("isolation audit: household tools", () => {
  it("setSignatureFormat changes only the named webhook", async () => {
    const a = await userWithHome("a@example.com");
    const b = await userWithHome("b@example.com");
    await createInboundWebhook(a.home, a.id, "A");
    await createInboundWebhook(b.home, b.id, "B");
    const [wa] = (await listInboundWebhooks(a.home)).webhooks;
    await setSignatureFormat(wa!.id, "hmac-sha256");
    expect(await sql("select household_id, last_signature_format from public.inbound_webhooks order by name")).toEqual([
      { household_id: a.home, last_signature_format: "hmac-sha256" },
      { household_id: b.home, last_signature_format: null },
    ]);
  });

  it("resolveInboundWebhook doesn't resolve an unknown token or stamp other webhooks", async () => {
    const a = await userWithHome("a@example.com");
    await createInboundWebhook(a.home, a.id, "A");
    await expect(resolveInboundWebhook("not-a-real-token")).resolves.toBeNull();
    expect((await listInboundWebhooks(a.home)).webhooks[0]?.last_used_at).toBeNull();
  });

  it("an expired claims pack doesn't open", async () => {
    const a = await userWithHome("a@example.com");
    const pack = { rangeFrom: "2026-01-01T00:00:00Z", rangeTo: "2026-02-01T00:00:00Z", householdName: "Home" } as never;
    const { token } = await createClaimsPackExport(a.home, pack, a.id);
    await sql("update public.claims_pack_exports set expires_at = now() - interval '1 minute' where token = $1", [token]);
    await expect(getClaimsPackExportByToken(token!)).resolves.toBeNull();
  });

  it("a saved view is listed only for the user who saved it, even within one household", async () => {
    const a = await userWithHome("a@example.com");
    const c = await userWithHome("c@example.com");
    await addHouseholdMemberByUserId(a.home, c.id, "member");
    await createHistorySavedView({ userId: a.id, householdId: a.home, name: "Mine", params: { days: 7 } as never });
    expect(await listHistorySavedViews(c.id)).toEqual([]);
  });

  it("oldReadings returns only the named household's readings", async () => {
    const a = await userWithHome("a@example.com");
    const b = await userWithHome("b@example.com");
    const sa = await sensorIn(a.home);
    const sb = await sensorIn(b.home);
    await sql(
      `insert into public.sensor_readings (sensor_id, household_id, recorded_at, value_num) values
       ($1, $2, now() - interval '120 days', 1), ($3, $4, now() - interval '120 days', 2)`,
      [sa, a.home, sb, b.home],
    );
    const rows = await oldReadings(a.home, new Date().toISOString(), 100);
    expect(rows.map((r) => [r.sensor_id, r.value_num])).toEqual([[sa, 1]]);
  });
});

// ---- shareLinks.ts ----------------------------------------------------------

describe("isolation audit: share links", () => {
  async function shareContext(token: string): Promise<APIContext> {
    return {
      params: { token },
      url: new URL(`https://example.com/api/share/${token}/readings`),
      request: new Request(`https://example.com/api/share/${token}/readings`),
      clientAddress: `198.51.100.${Math.floor(Math.random() * 200) + 1}`,
      cookies: { get: () => undefined },
      locals: {},
    } as unknown as APIContext;
  }

  it("the public readings route refuses an expired link and serves only its own household", async () => {
    const a = await userWithHome("a@example.com");
    const b = await userWithHome("b@example.com");
    await sql("insert into public.devices (household_id, name, source) values ($1, 'A-probe', 'push'), ($2, 'B-probe', 'push')", [
      a.home,
      b.home,
    ]);
    await insertShareLink({
      ...(await storedShareTokenFields("live-token-aaaa")),
      household_id: a.home,
      scope: "live",
      label: null,
      expires_at: new Date(Date.now() + 86400_000).toISOString(),
      created_by: a.id,
    });
    await insertShareLink({
      ...(await storedShareTokenFields("old-token-bbbb")),
      household_id: a.home,
      scope: "live",
      label: null,
      expires_at: new Date(Date.now() - 60_000).toISOString(),
      created_by: a.id,
    });

    const live = await shareReadingsRoute(await shareContext("live-token-aaaa"));
    expect(live.status).toBe(200);
    const body = (await live.json()) as { devices: Array<{ name: string }> };
    expect(body.devices.map((d) => d.name)).toEqual(["A-probe"]);

    const expired = await shareReadingsRoute(await shareContext("old-token-bbbb"));
    expect(expired.status).toBe(404);
    const unknown = await shareReadingsRoute(await shareContext("nope-token-cccc"));
    expect(unknown.status).toBe(404);
  });

  it("an expired chart share doesn't open; another token doesn't find it", async () => {
    const a = await userWithHome("a@example.com");
    await insertChartShare({
      token: "chart-live",
      user_id: a.id,
      r2_key: "chart-shares/chart-live.png",
      title: null,
      expires_at: new Date(Date.now() + 86400_000).toISOString(),
    });
    await insertChartShare({
      token: "chart-old",
      user_id: a.id,
      r2_key: "chart-shares/chart-old.png",
      title: null,
      expires_at: new Date(Date.now() - 60_000).toISOString(),
    });
    await expect(getChartShareByToken("chart-live")).resolves.not.toBeNull();
    await expect(getChartShareByToken("chart-old")).resolves.toBeNull();
    await expect(findChartShare("chart-liv")).resolves.toBeNull();
  });
});

// ---- statusPages.ts ---------------------------------------------------------

describe("isolation audit: status pages and subscriptions", () => {
  it("insertStatusPage's page lists only for its own household", async () => {
    const a = await userWithHome("a@example.com");
    const b = await userWithHome("b@example.com");
    await createStatusPageToken(a.home, "Cabin");
    expect(await listStatusPageTokens(a.home)).toHaveLength(1);
    expect(await listStatusPageTokens(b.home)).toEqual([]);
  });

  it("unsubscribing with one token removes only that subscriber", async () => {
    // Tokens are stored hashed: seed legacy raw tokens (pre-0004 rows) to drive the link.
    await sql("insert into public.status_subscriptions (email, token) values ('one@example.com', 'tok-one'), ('two@example.com', 'tok-two')");
    expect((await unsubscribeStatusSubscription("not-a-token")).ok).toBe(false);
    expect((await unsubscribeStatusSubscription("tok-one")).ok).toBe(true);
    expect(await sql("select email from public.status_subscriptions")).toEqual([{ email: "two@example.com" }]);
  });
});
