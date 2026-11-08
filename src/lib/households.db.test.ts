import { describe, expect, it, vi } from "vitest";
import { insertTestUser, useTestDatabase } from "../test/db";

vi.mock("./runtimeEnv", () => ({
  getRuntimeEnv: () => undefined,
  hasRuntimeEnv: () => false,
}));

import { insertHouseholdWithOwner } from "./db/households";
import {
  addHouseholdMemberByUserId,
  changeHouseholdMemberRole,
  countOwnedHouseholds,
  createAdditionalHouseholdForUser,
  getOrCreateHouseholdForUser,
  getOwnedHouseholdId,
  getUserHouseholdId,
  getUserHouseholdRole,
  isUserInHousehold,
  joinHouseholdFromInvite,
  leaveHousehold,
  listAllHouseholdOwnerUserIds,
  listHouseholdIdsForCron,
  listHouseholdMembers,
  listUserHouseholds,
  removeHouseholdMember,
  setActiveHouseholdForUser,
  updateHouseholdName,
} from "./households";
import { acceptHouseholdInvite, createHouseholdInvite, getInviteByToken } from "./householdInvites";

const db = useTestDatabase();
const sql = async <T = Record<string, unknown>>(text: string, params: unknown[] = []) =>
  (await db.client().query(text, params)).rows as T[];

/** A user plus the household the signup trigger made for them. */
async function userWithHome(email: string) {
  const id = await insertTestUser(db.client(), email);
  const [row] = await sql<{ household_id: string }>(
    "select household_id from public.household_members where user_id = $1 and role = 'owner'",
    [id],
  );
  return { id, home: row!.household_id };
}

async function addDevice(householdId: string) {
  await sql("insert into public.devices (household_id, name, source) values ($1, 'Probe', 'push')", [householdId]);
}

async function metadataOf(userId: string) {
  const [row] = await sql<{ metadata: Record<string, unknown> }>(
    "select metadata from public.user_profiles where user_id = $1",
    [userId],
  );
  return row?.metadata ?? null;
}

describe("creating households (Neon)", () => {
  it("returns the existing household instead of creating another", async () => {
    const a = await userWithHome("a@example.com");
    await expect(getOrCreateHouseholdForUser(a.id, "a@example.com")).resolves.toEqual({
      householdId: a.home,
      error: null,
    });
    await expect(countOwnedHouseholds(a.id)).resolves.toBe(1);
  });

  it("creates one named after the email, with the user as owner, when they have none", async () => {
    const a = await userWithHome("pat@example.com");
    await sql("delete from public.households where id = $1", [a.home]);

    const result = await getOrCreateHouseholdForUser(a.id, "pat@example.com");
    expect(result.error).toBeNull();
    await expect(getUserHouseholdRole(a.id, result.householdId)).resolves.toBe("owner");
    const [h] = await sql<{ name: string }>("select name from public.households where id = $1", [result.householdId]);
    expect(h?.name).toBe("pat's household");
  });

  it("leaves no ownerless household behind when the owner row can't be written", async () => {
    const before = await sql<{ n: number }>("select count(*) as n from public.households");
    const result = await insertHouseholdWithOwner("00000000-0000-4000-8000-000000000000", "Ghost");
    expect(result.householdId).toBe("");
    expect(result.error).toMatch(/household_members/);
    const after = await sql<{ n: number }>("select count(*) as n from public.households");
    expect(after[0]?.n).toBe(before[0]?.n);
  });

  it("an additional property becomes the active one and keeps other settings", async () => {
    const a = await userWithHome("a@example.com");
    await sql("insert into public.user_profiles (user_id, metadata) values ($1, '{\"locale\":\"de\"}')", [a.id]);

    const second = await createAdditionalHouseholdForUser(a.id, "  Cabin  ");
    expect(second.error).toBeNull();
    const [h] = await sql<{ name: string }>("select name from public.households where id = $1", [second.householdId]);
    expect(h?.name).toBe("Cabin");
    expect(await metadataOf(a.id)).toEqual({ locale: "de", active_household_id: second.householdId });
    await expect(getOwnedHouseholdId(a.id)).resolves.toBe(second.householdId);
    await expect(countOwnedHouseholds(a.id)).resolves.toBe(2);
  });
});

describe("which household a user sees (Neon)", () => {
  it("prefers a shared household with devices over an empty one they own", async () => {
    const owner = await userWithHome("owner@example.com");
    const guest = await userWithHome("guest@example.com");
    await addDevice(owner.home);
    await addHouseholdMemberByUserId(owner.home, guest.id, "member");

    await expect(getUserHouseholdId(guest.id)).resolves.toBe(owner.home);
  });

  it("an explicit active household wins, but only if they're still a member", async () => {
    const owner = await userWithHome("owner@example.com");
    const guest = await userWithHome("guest@example.com");
    await addDevice(owner.home);
    await addHouseholdMemberByUserId(owner.home, guest.id, "member");

    await expect(setActiveHouseholdForUser(guest.id, guest.home)).resolves.toEqual({ error: null });
    await expect(getUserHouseholdId(guest.id)).resolves.toBe(guest.home);

    // Stale setting pointing at a household they were removed from is ignored.
    await sql("update public.user_profiles set metadata = jsonb_build_object('active_household_id', $2::text) where user_id = $1", [
      guest.id,
      owner.home,
    ]);
    await removeHouseholdMember(owner.home, guest.id);
    await expect(getUserHouseholdId(guest.id)).resolves.toBe(guest.home);
  });

  it("refuses to make another user's household active", async () => {
    const a = await userWithHome("a@example.com");
    const b = await userWithHome("b@example.com");
    await expect(setActiveHouseholdForUser(a.id, b.home)).resolves.toEqual({ error: "Not a member of that household" });
    expect(await metadataOf(a.id)).toBeNull();
  });

  it("lists only the user's own households, with names, oldest first", async () => {
    const a = await userWithHome("a@example.com");
    const b = await userWithHome("b@example.com");
    await updateHouseholdName(a.home, "Home");
    await addHouseholdMemberByUserId(b.home, a.id, "viewer");

    const { households, error } = await listUserHouseholds(a.id);
    expect(error).toBeNull();
    expect(households).toEqual([
      { household_id: a.home, role: "owner", name: "Home" },
      { household_id: b.home, role: "viewer", name: "b's household" },
    ]);
    expect((await listUserHouseholds(b.id)).households.map((h) => h.household_id)).toEqual([b.home]);
  });
});

describe("cross-household access (Neon)", () => {
  it("membership and role checks say no for someone else's household", async () => {
    const a = await userWithHome("a@example.com");
    const b = await userWithHome("b@example.com");
    await expect(isUserInHousehold(a.id, b.home)).resolves.toBe(false);
    await expect(getUserHouseholdRole(a.id, b.home)).resolves.toBeNull();
    await expect(isUserInHousehold(a.id, a.home)).resolves.toBe(true);
    await expect(getUserHouseholdRole(a.id, a.home)).resolves.toBe("owner");
  });

  it("member lists contain only that household's members", async () => {
    const a = await userWithHome("a@example.com");
    const b = await userWithHome("b@example.com");
    const c = await userWithHome("c@example.com");
    await addHouseholdMemberByUserId(a.home, c.id, "viewer");

    const { members } = await listHouseholdMembers(a.home);
    expect(members.map((m) => [m.user_id, m.role])).toEqual([
      [a.id, "owner"],
      [c.id, "viewer"],
    ]);
    expect(members.every((m) => m.household_id === a.home)).toBe(true);
    expect((await listHouseholdMembers(b.home)).members.map((m) => m.user_id)).toEqual([b.id]);
  });

  it("renaming touches only the named household", async () => {
    const a = await userWithHome("a@example.com");
    const b = await userWithHome("b@example.com");
    await updateHouseholdName(a.home, "   ");
    const rows = await sql<{ id: string; name: string }>(
      "select id, name from public.households where id = any($1::uuid[])",
      [[a.home, b.home]],
    );
    expect(Object.fromEntries(rows.map((r) => [r.id, r.name]))).toEqual({
      [a.home]: "My household",
      [b.home]: "b's household",
    });
  });
});

describe("changing membership (Neon)", () => {
  it("adding an existing member changes their role instead of duplicating them", async () => {
    const a = await userWithHome("a@example.com");
    const c = await userWithHome("c@example.com");
    await addHouseholdMemberByUserId(a.home, c.id, "viewer");
    await expect(addHouseholdMemberByUserId(a.home, c.id, "member")).resolves.toEqual({ error: null });
    const rows = await sql("select role from public.household_members where household_id = $1 and user_id = $2", [
      a.home,
      c.id,
    ]);
    expect(rows).toEqual([{ role: "member" }]);
  });

  it("can't remove the owner", async () => {
    const a = await userWithHome("a@example.com");
    await expect(removeHouseholdMember(a.home, a.id)).resolves.toEqual({ error: "Cannot remove the household owner" });
    await expect(isUserInHousehold(a.id, a.home)).resolves.toBe(true);
  });

  it("removing a member leaves their other memberships alone", async () => {
    const a = await userWithHome("a@example.com");
    const b = await userWithHome("b@example.com");
    const c = await userWithHome("c@example.com");
    await addHouseholdMemberByUserId(a.home, c.id, "member");
    await addHouseholdMemberByUserId(b.home, c.id, "member");

    await expect(removeHouseholdMember(a.home, c.id)).resolves.toEqual({ error: null });
    await expect(isUserInHousehold(c.id, a.home)).resolves.toBe(false);
    await expect(isUserInHousehold(c.id, b.home)).resolves.toBe(true);
    await expect(isUserInHousehold(c.id, c.home)).resolves.toBe(true);
  });

  it("leaving moves the active household to one they still belong to", async () => {
    const a = await userWithHome("a@example.com");
    const c = await userWithHome("c@example.com");
    await addHouseholdMemberByUserId(a.home, c.id, "member");
    await setActiveHouseholdForUser(c.id, a.home);

    await expect(leaveHousehold(c.id, a.home)).resolves.toEqual({ error: null });
    expect((await metadataOf(c.id))?.active_household_id).toBe(c.home);
  });
});

describe("cron and admin lists (Neon)", () => {
  it("one entry per household with its first owner, and distinct owner ids", async () => {
    const a = await userWithHome("a@example.com");
    const b = await userWithHome("b@example.com");
    const second = await createAdditionalHouseholdForUser(a.id, "Cabin");

    const cron = await listHouseholdIdsForCron();
    expect(cron).toHaveLength(3);
    expect(new Set(cron.map((r) => r.householdId))).toEqual(new Set([a.home, b.home, second.householdId]));
    expect(cron.find((r) => r.householdId === second.householdId)?.ownerUserId).toBe(a.id);

    expect((await listAllHouseholdOwnerUserIds()).sort()).toEqual([a.id, b.id].sort());
  });
});

describe("invites never change an existing member's role (Neon)", () => {
  const roleOf = async (userId: string, householdId: string) => getUserHouseholdRole(userId, householdId);

  it.each([
    ["member", "viewer"],
    ["viewer", "member"],
    ["alert_only", "member"],
    ["property_manager", "viewer"],
  ] as const)("a %s who accepts a %s re-invite keeps their role", async (current, invited) => {
    const owner = await userWithHome("owner@example.com");
    const guest = await userWithHome("guest@example.com");
    await addHouseholdMemberByUserId(owner.home, guest.id, current);
    const { token } = await createHouseholdInvite(owner.home, "guest@example.com", owner.id, 7, invited);

    await expect(acceptHouseholdInvite(token!, guest.id, "guest@example.com")).resolves.toEqual({
      householdId: owner.home,
      error: null,
    });

    await expect(roleOf(guest.id, owner.home)).resolves.toBe(current);
    expect((await getInviteByToken(token!))?.accepted_at).toBeTruthy();
    await expect(getUserHouseholdId(guest.id)).resolves.toBe(owner.home);
    const rows = await sql("select 1 from public.household_members where household_id = $1 and user_id = $2", [
      owner.home,
      guest.id,
    ]);
    expect(rows).toHaveLength(1);
  });

  it("a brand-new invitee joins with the invite's role", async () => {
    const owner = await userWithHome("owner@example.com");
    const guest = await userWithHome("guest@example.com");
    const { token } = await createHouseholdInvite(owner.home, "guest@example.com", owner.id, 7, "alert_only");

    await expect(acceptHouseholdInvite(token!, guest.id, "guest@example.com")).resolves.toEqual({
      householdId: owner.home,
      error: null,
    });

    await expect(roleOf(guest.id, owner.home)).resolves.toBe("alert_only");
    await expect(getUserHouseholdId(guest.id)).resolves.toBe(owner.home);
  });

  it("joinHouseholdFromInvite reports whether it added anyone and never touches an existing row", async () => {
    const owner = await userWithHome("owner@example.com");
    const guest = await userWithHome("guest@example.com");
    await expect(joinHouseholdFromInvite(owner.home, guest.id, "viewer")).resolves.toEqual({ added: true, error: null });
    await expect(joinHouseholdFromInvite(owner.home, guest.id, "member")).resolves.toEqual({ added: false, error: null });
    await expect(joinHouseholdFromInvite(owner.home, owner.id, "viewer")).resolves.toEqual({ added: false, error: null });
    await expect(roleOf(guest.id, owner.home)).resolves.toBe("viewer");
    await expect(roleOf(owner.id, owner.home)).resolves.toBe("owner");
  });
});

describe("changeHouseholdMemberRole (Neon)", () => {
  it("changes a non-owner member's role in that household only", async () => {
    const a = await userWithHome("a@example.com");
    const b = await userWithHome("b@example.com");
    const c = await userWithHome("c@example.com");
    await addHouseholdMemberByUserId(a.home, c.id, "member");
    await addHouseholdMemberByUserId(b.home, c.id, "member");

    await expect(changeHouseholdMemberRole(a.home, c.id, "viewer")).resolves.toEqual({ error: null });

    await expect(getUserHouseholdRole(c.id, a.home)).resolves.toBe("viewer");
    await expect(getUserHouseholdRole(c.id, b.home)).resolves.toBe("member");
  });

  it("never changes the owner's role, and doesn't add non-members", async () => {
    const a = await userWithHome("a@example.com");
    const stranger = await userWithHome("stranger@example.com");

    await expect(changeHouseholdMemberRole(a.home, a.id, "viewer")).resolves.toEqual({ error: "cannot_change_owner" });
    await expect(getUserHouseholdRole(a.id, a.home)).resolves.toBe("owner");

    await expect(changeHouseholdMemberRole(a.home, stranger.id, "member")).resolves.toEqual({ error: "not_a_member" });
    await expect(isUserInHousehold(stranger.id, a.home)).resolves.toBe(false);
  });
});
