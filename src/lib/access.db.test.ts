import { describe, expect, it, vi } from "vitest";
import { insertTestUser, useTestDatabase } from "../test/db";

vi.mock("./runtimeEnv", () => ({
  getRuntimeEnv: (key: string) => (key === "DB_BACKEND" ? "neon" : undefined),
  hasRuntimeEnv: () => false,
}));

import { createHouseholdApiKey, listHouseholdApiKeys, resolveApiKey, revokeHouseholdApiKey } from "./apiKeys";
import {
  acceptHouseholdInvite,
  createHouseholdInvite,
  getInviteByToken,
  listPendingInvites,
  reissueHouseholdInvite,
  revokeHouseholdInvite,
} from "./householdInvites";
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
    expect((await getInviteByToken(token!))?.accepted_at).not.toBeNull();
    expect((await listPendingInvites(a.home)).invites).toEqual([]);
  });

  it("expired links are refused; a reissued link replaces the old one", async () => {
    const a = await owner("owner@example.com");
    const guest = await owner("guest@example.com");
    const first = await createHouseholdInvite(a.home, "guest@example.com", a.id);
    await sql("update public.household_invites set expires_at = now() - interval '1 minute' where id = $1", [first.invite!.id]);
    expect((await acceptHouseholdInvite(first.token!, guest.id, "guest@example.com")).error).toBe("Invite expired");

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

    await expect(resolveApiKey(plaintext!)).resolves.toEqual({ householdId: a.home, keyId: key!.id });
    expect((await listHouseholdApiKeys(a.home))[0]?.last_used_at).not.toBeNull();

    await revokeHouseholdApiKey(a.home, key!.id);
    await expect(resolveApiKey(plaintext!)).resolves.toBeNull();
    expect(await listHouseholdApiKeys(a.home)).toEqual([]);
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
