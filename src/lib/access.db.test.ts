import { describe, expect, it, vi } from "vitest";
import { insertTestUser, useTestDatabase } from "../test/db";

vi.mock("./runtimeEnv", () => ({
  getRuntimeEnv: () => undefined,
  hasRuntimeEnv: () => false,
}));

import { createHouseholdApiKey, listHouseholdApiKeys, resolveApiKey, revokeHouseholdApiKey } from "./apiKeys";
import {
  acceptHouseholdInvite,
  createHouseholdInvite,
  getInviteByToken,
  getInviteTokenState,
  inviteTokenLookupKeys,
  listPendingInvites,
  reissueHouseholdInvite,
  revokeHouseholdInvite,
} from "./householdInvites";
import { findInviteByTokenKeys, findInviteStateByTokenKeys } from "./db/access";
import { getUserHouseholdRole } from "./households";

const db = useTestDatabase();
const sql = async <T = Record<string, unknown>>(text: string, params: unknown[] = []) =>
  (await db.client().query(text, params)).rows as T[];

async function owner(email: string) {
  const id = await insertTestUser(db.client(), email);
  const [m] = await sql<{ household_id: string }>("select household_id from public.household_members where user_id = $1", [id]);
  return { id, home: m!.household_id };
}

describe("household invites (Neon)", () => {
  it("only the invited address can accept, with the invited role; the link is stored hashed", async () => {
    const a = await owner("owner@example.com");
    const guest = await owner("guest@example.com");
    const stranger = await owner("stranger@example.com");
    const { token, error } = await createHouseholdInvite(a.home, " Guest@Example.com ", a.id, 7, "viewer");
    expect(error).toBeNull();
    expect(await sql("select 1 from public.household_invites where token = $1", [token])).toEqual([]); // not stored raw

    expect((await acceptHouseholdInvite(token!, stranger.id, "stranger@example.com")).error).toBeTruthy();
    await expect(getUserHouseholdRole(stranger.id, a.home)).resolves.toBeNull();

    await expect(acceptHouseholdInvite(token!, guest.id, "guest@example.com")).resolves.toEqual({
      householdId: a.home,
      error: null,
    });
    await expect(getUserHouseholdRole(guest.id, a.home)).resolves.toBe("viewer");
    await expect(getInviteByToken(token!)).resolves.toBeNull(); // used up
    await expect(getInviteTokenState(token!)).resolves.toEqual({ householdId: a.home, accepted: true, expired: false });
    expect((await listPendingInvites(a.home)).invites).toEqual([]);
    // Clicking the link again still lands the guest in the household, as before.
    await expect(acceptHouseholdInvite(token!, guest.id, "guest@example.com")).resolves.toEqual({
      householdId: a.home,
      error: null,
    });
  });

  it("the token lookup returns only a usable invite; the state lookup says why not, without the invite's details", async () => {
    const a = await owner("owner@example.com");
    const { invite, token } = await createHouseholdInvite(a.home, "guest@example.com", a.id);
    const keys = await inviteTokenLookupKeys(token!);
    await expect(findInviteByTokenKeys(keys)).resolves.toMatchObject({ id: invite!.id, email: "guest@example.com" });
    await expect(findInviteStateByTokenKeys(keys)).resolves.toEqual({ household_id: a.home, accepted: false, expired: false });

    await sql("update public.household_invites set expires_at = now() - interval '1 minute' where id = $1", [invite!.id]);
    await expect(findInviteByTokenKeys(keys)).resolves.toBeNull();
    await expect(findInviteStateByTokenKeys(keys)).resolves.toEqual({ household_id: a.home, accepted: false, expired: true });

    await sql("update public.household_invites set expires_at = now() + interval '1 day', accepted_at = now() where id = $1", [
      invite!.id,
    ]);
    await expect(findInviteByTokenKeys(keys)).resolves.toBeNull();
    await expect(findInviteStateByTokenKeys(keys)).resolves.toEqual({ household_id: a.home, accepted: true, expired: false });

    await expect(findInviteStateByTokenKeys(await inviteTokenLookupKeys("0".repeat(48)))).resolves.toBeNull();
  });

  it("expired links are refused; a reissued link replaces the old one", async () => {
    const a = await owner("owner@example.com");
    const guest = await owner("guest@example.com");
    const first = await createHouseholdInvite(a.home, "guest@example.com", a.id);
    await sql("update public.household_invites set expires_at = now() - interval '1 minute' where id = $1", [first.invite!.id]);
    expect((await acceptHouseholdInvite(first.token!, guest.id, "guest@example.com")).error).toBe("Invite expired");
    await expect(getInviteByToken(first.token!)).resolves.toBeNull();
    await expect(getInviteTokenState(first.token!)).resolves.toEqual({ householdId: a.home, accepted: false, expired: true });
    await expect(getUserHouseholdRole(guest.id, a.home)).resolves.toBeNull();

    const again = await reissueHouseholdInvite(a.home, first.invite!.id);
    expect(again.error).toBeNull();
    expect((await acceptHouseholdInvite(first.token!, guest.id, "guest@example.com")).error).toBe("Invite not found");
    expect((await acceptHouseholdInvite(again.token!, guest.id, "guest@example.com")).error).toBeNull();
  });

  it("another household can't reissue, revoke or list this household's invites", async () => {
    const a = await owner("a@example.com");
    const b = await owner("b@example.com");
    const { invite, token } = await createHouseholdInvite(a.home, "x@example.com", a.id);

    expect((await reissueHouseholdInvite(b.home, invite!.id)).invite).toBeNull();
    await revokeHouseholdInvite(b.home, invite!.id);
    expect(await getInviteByToken(token!)).not.toBeNull();
    expect((await listPendingInvites(b.home)).invites).toEqual([]);
    expect((await listPendingInvites(a.home)).invites.map((i) => i.id)).toEqual([invite!.id]);

    await revokeHouseholdInvite(a.home, invite!.id);
    expect(await getInviteByToken(token!)).toBeNull();
  });
});

describe("API keys (Neon)", () => {
  it("a new key resolves to its household and records use; a revoked key doesn't resolve", async () => {
    const a = await owner("a@example.com");
    const { plaintext, key } = await createHouseholdApiKey({ householdId: a.home, name: " ", createdBy: a.id });
    expect(plaintext?.startsWith("gtm_")).toBe(true);
    expect(key).toMatchObject({ household_id: a.home, name: "Metrics key", last_used_at: null });
    expect(await sql("select 1 from public.api_keys where key_hash = $1", [plaintext])).toEqual([]); // stored hashed

    await expect(resolveApiKey(plaintext!)).resolves.toEqual({ householdId: a.home, keyId: key!.id, scope: "read" });
    expect((await listHouseholdApiKeys(a.home))[0]?.last_used_at).not.toBeNull();

    await revokeHouseholdApiKey(a.home, key!.id);
    await expect(resolveApiKey(plaintext!)).resolves.toBeNull();
    expect(await listHouseholdApiKeys(a.home)).toEqual([]);
  });

  it("revoking a key again keeps the first revoke time", async () => {
    const a = await owner("a@example.com");
    const { key } = await createHouseholdApiKey({ householdId: a.home, name: "k", createdBy: a.id });
    const revokedAt = async () =>
      (await sql<{ revoked_at: Date | null }>("select revoked_at from public.api_keys where id = $1", [key!.id]))[0]?.revoked_at;
    await revokeHouseholdApiKey(a.home, key!.id);
    const first = await revokedAt();
    expect(first).not.toBeNull();
    await new Promise((r) => setTimeout(r, 5));
    await expect(revokeHouseholdApiKey(a.home, key!.id)).resolves.toEqual({ error: null });
    expect(await revokedAt()).toEqual(first);
  });

  it("another household can't revoke or see the key; garbage doesn't resolve", async () => {
    const a = await owner("a@example.com");
    const b = await owner("b@example.com");
    const { plaintext, key } = await createHouseholdApiKey({ householdId: a.home, name: "Grafana", createdBy: a.id });
    await revokeHouseholdApiKey(b.home, key!.id);
    await expect(resolveApiKey(plaintext!)).resolves.toMatchObject({ householdId: a.home });
    expect(await listHouseholdApiKeys(b.home)).toEqual([]);
    await expect(resolveApiKey("gtm_notarealkey")).resolves.toBeNull();
    await expect(resolveApiKey("not-even-the-prefix")).resolves.toBeNull();
  });
});
