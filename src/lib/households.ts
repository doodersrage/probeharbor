import * as neon from "./db/households";

export type HouseholdRole =
  | "owner"
  | "member"
  | "viewer"
  | "alert_only"
  | "property_manager";

export type Household = {
  id: string;
  name: string;
  created_at: string;
};

export type HouseholdMember = {
  id: string;
  household_id: string;
  user_id: string;
  role: HouseholdRole;
  created_at: string;
  email?: string | null;
  digest_opt_in?: boolean;
};

export type UserHousehold = {
  household_id: string;
  role: HouseholdRole;
  name: string;
};

export async function getOrCreateHouseholdForUser(
  userId: string,
  email?: string | null,
): Promise<{ householdId: string; error: string | null }> {
  const preferred = await getPreferredHouseholdId(userId);
  if (preferred) {
    return { householdId: preferred, error: null };
  }

  const owned = await getOwnedHouseholdId(userId);
  if (owned) {
    return { householdId: owned, error: null };
  }

  const name = `${(email ?? "My").split("@")[0]}'s household`;
  return neon.insertHouseholdWithOwner(userId, name);
}

export async function getOwnedHouseholdId(userId: string): Promise<string | null> {
  return neon.getOwnedHouseholdId(userId);
}

export async function countOwnedHouseholds(userId: string): Promise<number> {
  return neon.countOwnedHouseholds(userId);
}

export async function listUserHouseholds(
  userId: string,
): Promise<{ households: UserHousehold[]; error: string | null }> {
  return neon.listUserHouseholds(userId);
}

async function getPreferredHouseholdId(userId: string): Promise<string | null> {
  return neon.getPreferredHouseholdId(userId);
}

export async function getUserHouseholdId(
  userId: string,
): Promise<string | null> {
  return getPreferredHouseholdId(userId);
}

export async function setActiveHouseholdForUser(
  userId: string,
  householdId: string,
): Promise<{ error: string | null }> {
  if (!(await isUserInHousehold(userId, householdId))) {
    return { error: "Not a member of that household" };
  }
  return neon.setActiveHousehold(userId, householdId);
}

export async function listHouseholdMembers(
  householdId: string,
): Promise<{ members: HouseholdMember[]; error: string | null }> {
  return neon.listHouseholdMembers(householdId);
}

export async function getUserHouseholdRole(
  userId: string,
  householdId: string,
): Promise<HouseholdRole | null> {
  return neon.getUserHouseholdRole(userId, householdId);
}

export function canEditHousehold(role: HouseholdRole | null): boolean {
  return role === "owner" || role === "member" || role === "property_manager";
}

/** Billing, invites, share links, API keys — owner and full members only. */
export function canManageHousehold(role: HouseholdRole | null): boolean {
  return role === "owner" || role === "member";
}

/**
 * Sending, resending and cancelling invites: the owner and editors
 * (`member`), the same people who manage share links and billing
 * integrations (`canManageHousehold`). Viewers, alert-only members and
 * property managers can't invite. Both invite paths (the
 * `inviteHouseholdMember` action and `POST /api/household`) use this.
 */
export function canInviteToHousehold(role: HouseholdRole | null): boolean {
  return canManageHousehold(role);
}

/**
 * Removing members and changing their roles: the owner only. Editors can
 * invite but can't remove or demote other members (the household page only
 * shows these controls to the owner).
 */
export function canManageHouseholdMembers(role: HouseholdRole | null): boolean {
  return role === "owner";
}

export function canViewAlerts(role: HouseholdRole | null): boolean {
  return role != null;
}

export async function createAdditionalHouseholdForUser(
  userId: string,
  name: string,
): Promise<{ householdId: string; error: string | null }> {
  const trimmed = name.trim() || "My property";
  const created = await neon.insertHouseholdWithOwner(userId, trimmed);
  if (!created.error) await setActiveHouseholdForUser(userId, created.householdId);
  return created;
}

export async function isUserInHousehold(
  userId: string,
  householdId: string,
): Promise<boolean> {
  return neon.isUserInHousehold(userId, householdId);
}

export async function addHouseholdMemberByUserId(
  householdId: string,
  userId: string,
  role: HouseholdRole = "member",
): Promise<{ error: string | null }> {
  return neon.upsertHouseholdMember(householdId, userId, role);
}

/**
 * Join a household from an accepted invite. A person who already belongs
 * keeps their current role: accepting a re-invite never changes it (use
 * `changeHouseholdMemberRole` for that). `added` is false when they were
 * already a member.
 */
export async function joinHouseholdFromInvite(
  householdId: string,
  userId: string,
  role: Exclude<HouseholdRole, "owner">,
): Promise<{ added: boolean; error: string | null }> {
  return neon.insertHouseholdMemberIfAbsent(householdId, userId, role);
}

/**
 * Explicit role change by the owner (the caller checks
 * `canManageHouseholdMembers`). Never changes or grants `owner`.
 */
export async function changeHouseholdMemberRole(
  householdId: string,
  userId: string,
  role: Exclude<HouseholdRole, "owner">,
): Promise<{ error: string | null }> {
  return neon.updateHouseholdMemberRole(householdId, userId, role);
}

export async function removeHouseholdMember(
  householdId: string,
  userId: string,
): Promise<{ error: string | null }> {
  return neon.removeHouseholdMember(householdId, userId);
}

/** Member leaves their current household (not allowed for owners). */
export async function leaveHousehold(
  userId: string,
  householdId: string,
): Promise<{ error: string | null }> {
  const result = await removeHouseholdMember(householdId, userId);
  if (result.error) {
    return result;
  }

  const remaining = await listUserHouseholds(userId);
  const next = remaining.households[0]?.household_id ?? null;
  if (next) {
    await setActiveHouseholdForUser(userId, next);
  } else {
    // Fall back to owned household or recreate personal one
    const owned = await getOwnedHouseholdId(userId);
    if (owned) {
      await setActiveHouseholdForUser(userId, owned);
    }
  }

  return { error: null };
}

export async function updateHouseholdName(
  householdId: string,
  name: string,
): Promise<{ error: string | null }> {
  return neon.updateHouseholdName(householdId, name.trim() || "My household");
}

export async function listAllHouseholdOwnerUserIds(): Promise<string[]> {
  return neon.listAllHouseholdOwnerUserIds();
}

/** Unique households that should be polled by cron (those with devices, else all owned). */
export async function listHouseholdIdsForCron(): Promise<
  Array<{ householdId: string; ownerUserId: string }>
> {
  return neon.listHouseholdIdsForCron();
}
