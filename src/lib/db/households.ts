/**
 * Neon versions of the queries in src/lib/households.ts. Same inputs, same
 * results and error shapes; households.ts calls these when
 * `dbBackend() === "neon"`.
 *
 * Differences from the Supabase path, all deliberate:
 * - Creating a household and its owner row is one statement, so a failure
 *   can't leave a household with no owner (Supabase path: two inserts plus
 *   a cleanup delete, or none for additional households).
 * - Lists the Supabase path returned in unspecified order are ordered by
 *   created_at, id (what Postgres returned in practice: insertion order).
 */
import type { HouseholdMember, HouseholdRole, UserHousehold } from "../households";
import { query } from "./client";
import { getUserMetadata, mergeUserMetadata } from "./userMetadata";

const message = (error: unknown) => (error instanceof Error ? error.message : String(error));

/** New household with `userId` as owner; returns its id. */
export async function insertHouseholdWithOwner(
  userId: string,
  name: string,
): Promise<{ householdId: string; error: string | null }> {
  try {
    const rows = await query<{ id: string }>(
      `with h as (insert into public.households (name) values ($1) returning id)
       insert into public.household_members (household_id, user_id, role)
       select id, $2, 'owner' from h
       returning household_id as id`,
      [name, userId],
    );
    const id = rows[0]?.id;
    return id ? { householdId: id, error: null } : { householdId: "", error: "Failed to create household" };
  } catch (error) {
    return { householdId: "", error: message(error) };
  }
}

async function activeHouseholdId(userId: string): Promise<string | null> {
  try {
    const active = (await getUserMetadata(userId)).active_household_id;
    return typeof active === "string" ? active : null;
  } catch {
    return null; // same as the Supabase path: fall back to the default choice
  }
}

export async function getOwnedHouseholdId(userId: string): Promise<string | null> {
  let owned: string[];
  try {
    const rows = await query<{ household_id: string }>(
      `select household_id from public.household_members
       where user_id = $1 and role = 'owner' order by created_at, id`,
      [userId],
    );
    owned = rows.map((r) => r.household_id);
  } catch {
    return null; // the Supabase path treated a failed read as "none"
  }
  if (owned.length === 0) return null;
  const active = await activeHouseholdId(userId);
  return active && owned.includes(active) ? active : (owned[0] ?? null);
}

export async function countOwnedHouseholds(userId: string): Promise<number> {
  try {
    const rows = await query<{ n: number }>(
      "select count(*) as n from public.household_members where user_id = $1 and role = 'owner'",
      [userId],
    );
    return rows[0]?.n ?? 0;
  } catch (error) {
    console.error("countOwnedHouseholds failed:", message(error));
    return 0;
  }
}

export async function listUserHouseholds(
  userId: string,
): Promise<{ households: UserHousehold[]; error: string | null }> {
  try {
    const rows = await query<{ household_id: string; role: HouseholdRole; name: string | null }>(
      `select m.household_id, m.role, h.name
       from public.household_members m
       left join public.households h on h.id = m.household_id
       where m.user_id = $1
       order by m.created_at, m.id`,
      [userId],
    );
    return {
      households: rows.map((r) => ({ household_id: r.household_id, role: r.role, name: r.name ?? "Household" })),
      error: null,
    };
  } catch (error) {
    return { households: [], error: message(error) };
  }
}

/** The household to show by default: active one, else one with devices (shared first), else owned, else any. */
export async function getPreferredHouseholdId(userId: string): Promise<string | null> {
  let members: Array<{ household_id: string; role: string; has_devices: boolean }>;
  try {
    members = await query(
      `select m.household_id, m.role,
              exists (select 1 from public.devices d where d.household_id = m.household_id) as has_devices
       from public.household_members m
       where m.user_id = $1
       order by m.created_at, m.id`,
      [userId],
    );
  } catch {
    return null;
  }
  if (members.length === 0) return null;

  const active = await activeHouseholdId(userId);
  if (active && members.some((m) => m.household_id === active)) return active;

  const shared = members.find((m) => m.role === "member" && m.has_devices);
  if (shared) return shared.household_id;
  const withDevices = members.find((m) => m.has_devices);
  if (withDevices) return withDevices.household_id;
  const owner = members.find((m) => m.role === "owner");
  return (owner ?? members[0]!).household_id;
}

export async function setActiveHousehold(userId: string, householdId: string): Promise<{ error: string | null }> {
  try {
    await mergeUserMetadata(userId, { active_household_id: householdId });
    return { error: null };
  } catch (error) {
    return { error: message(error) };
  }
}

export async function listHouseholdMembers(
  householdId: string,
): Promise<{ members: HouseholdMember[]; error: string | null }> {
  try {
    const members = await query<HouseholdMember>(
      `select id, household_id, user_id, role, created_at, digest_opt_in
       from public.household_members where household_id = $1 order by created_at, id`,
      [householdId],
    );
    return { members, error: null };
  } catch (error) {
    return { members: [], error: message(error) };
  }
}

export async function getUserHouseholdRole(userId: string, householdId: string): Promise<HouseholdRole | null> {
  try {
    const rows = await query<{ role: HouseholdRole }>(
      "select role from public.household_members where user_id = $1 and household_id = $2",
      [userId, householdId],
    );
    return rows[0]?.role ?? null;
  } catch {
    return null; // no role = no access, as before
  }
}

export async function isUserInHousehold(userId: string, householdId: string): Promise<boolean> {
  try {
    const rows = await query(
      "select 1 from public.household_members where user_id = $1 and household_id = $2",
      [userId, householdId],
    );
    return rows.length > 0;
  } catch {
    return false;
  }
}

export async function upsertHouseholdMember(
  householdId: string,
  userId: string,
  role: HouseholdRole,
): Promise<{ error: string | null }> {
  try {
    await query(
      `insert into public.household_members (household_id, user_id, role) values ($1, $2, $3)
       on conflict (household_id, user_id) do update set role = excluded.role`,
      [householdId, userId, role],
    );
    return { error: null };
  } catch (error) {
    return { error: message(error) };
  }
}

export async function removeHouseholdMember(householdId: string, userId: string): Promise<{ error: string | null }> {
  try {
    const role = await getUserHouseholdRole(userId, householdId);
    if (role === "owner") return { error: "Cannot remove the household owner" };
    // role <> 'owner' again here, so a concurrent promotion can't be undone by this delete.
    await query(
      "delete from public.household_members where household_id = $1 and user_id = $2 and role <> 'owner'",
      [householdId, userId],
    );
    return { error: null };
  } catch (error) {
    return { error: message(error) };
  }
}

export async function updateHouseholdName(householdId: string, name: string): Promise<{ error: string | null }> {
  try {
    await query("update public.households set name = $2 where id = $1", [householdId, name]);
    return { error: null };
  } catch (error) {
    return { error: message(error) };
  }
}

export async function listAllHouseholdOwnerUserIds(): Promise<string[]> {
  try {
    const rows = await query<{ user_id: string }>(
      "select distinct user_id from public.household_members where role = 'owner'",
    );
    return rows.map((r) => r.user_id);
  } catch {
    return [];
  }
}

export async function listHouseholdIdsForCron(): Promise<Array<{ householdId: string; ownerUserId: string }>> {
  try {
    // One row per household: its earliest owner.
    const rows = await query<{ household_id: string; user_id: string }>(
      `select distinct on (household_id) household_id, user_id
       from public.household_members where role = 'owner'
       order by household_id, created_at, id`,
    );
    return rows.map((r) => ({ householdId: r.household_id, ownerUserId: r.user_id }));
  } catch {
    return [];
  }
}
