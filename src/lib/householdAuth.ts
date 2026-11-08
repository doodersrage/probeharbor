import {
  canEditHousehold,
  canInviteToHousehold,
  canManageHousehold,
  canManageHouseholdMembers,
  getOrCreateHouseholdForUser,
  getOwnedHouseholdId,
  getUserHouseholdId,
  getUserHouseholdRole,
  type HouseholdRole,
} from "./households";
import { sanitizeNextPath, withQuery } from "./siteUrl";

export type HouseholdEditorContext = {
  householdId: string;
  role: HouseholdRole;
};

export async function getHouseholdEditorContext(
  userId: string,
): Promise<HouseholdEditorContext | null> {
  const householdId = await getUserHouseholdId(userId);
  if (!householdId) return null;
  const role = await getUserHouseholdRole(userId, householdId);
  if (!role) return null;
  return { householdId, role };
}

export async function requireHouseholdEditor(
  userId: string,
): Promise<{ ok: true; ctx: HouseholdEditorContext } | { ok: false; error: string }> {
  const ctx = await getHouseholdEditorContext(userId);
  if (!ctx) {
    return { ok: false, error: "No household" };
  }
  if (!canEditHousehold(ctx.role)) {
    return { ok: false, error: ctx.role === "alert_only" ? "alert_only" : "viewer" };
  }
  return { ok: true, ctx };
}

export async function requireHouseholdManager(
  userId: string,
): Promise<{ ok: true; ctx: HouseholdEditorContext } | { ok: false; error: string }> {
  const ctx = await getHouseholdEditorContext(userId);
  if (!ctx) {
    return { ok: false, error: "No household" };
  }
  if (!canManageHousehold(ctx.role)) {
    return { ok: false, error: "manager_required" };
  }
  return { ok: true, ctx };
}

export type HouseholdPeopleAccess = {
  /** The household the household page shows and these actions target. */
  householdId: string | null;
  /** The household the user owns, if any (when set, it is `householdId`). */
  ownedId: string | null;
  role: HouseholdRole | null;
  /** Send, resend and cancel invites (owner or editor). */
  canInvite: boolean;
  /** Remove members and change their roles (owner only). */
  canManageMembers: boolean;
};

/**
 * Who may invite and manage people, and in which household. The one check
 * shared by the `inviteHouseholdMember` action, `POST /api/household` and the
 * household page.
 *
 * The target is the household the user owns, else their active one (the
 * household page shows the same one). The role is checked in that household,
 * not the active one: an owner whose active household is someone else's
 * still manages theirs.
 */
export async function getHouseholdPeopleAccess(
  userId: string,
  email?: string | null,
): Promise<HouseholdPeopleAccess> {
  const ownedId = await getOwnedHouseholdId(userId);
  const householdId = ownedId ?? ((await getOrCreateHouseholdForUser(userId, email)).householdId || null);
  const role = householdId ? await getUserHouseholdRole(userId, householdId) : null;
  return {
    householdId,
    ownedId,
    role,
    canInvite: canInviteToHousehold(role),
    canManageMembers: canManageHouseholdMembers(role),
  };
}

function safeRedirectBase(redirectTo: string): string {
  return sanitizeNextPath(redirectTo) ?? "/dashboard";
}

/** Redirect when user lacks household manager (owner/member) role. */
export function redirectUnlessManager(
  manager: Awaited<ReturnType<typeof requireHouseholdManager>>,
  redirectTo: string,
  redirect: (url: string) => Response,
): Response | null {
  const base = safeRedirectBase(redirectTo);
  if (manager.ok) return null;
  if (manager.error === "manager_required") {
    return redirect(withQuery(base, { error: "manager_required" }));
  }
  return redirect(withQuery(base, { error: "1" }));
}

export function householdManagerCtx(
  manager: Awaited<ReturnType<typeof requireHouseholdManager>>,
): HouseholdEditorContext {
  if (!manager.ok) {
    throw new Error(manager.error || "Not a household manager");
  }
  return manager.ctx;
}

/** Redirect helper for form POST routes when the user is a viewer. */
export function redirectUnlessEditor(
  editor: Awaited<ReturnType<typeof requireHouseholdEditor>>,
  redirectTo: string,
  redirect: (url: string) => Response,
): Response | null {
  const base = safeRedirectBase(redirectTo);
  if (editor.ok) return null;
  if (editor.error === "viewer" || editor.error === "alert_only") {
    return redirect(withQuery(base, { error: "viewer" }));
  }
  if (editor.error === "manager_required") {
    return redirect(withQuery(base, { error: "manager_required" }));
  }
  return redirect(withQuery(base, { error: "1" }));
}

/** Narrow after redirectUnlessEditor returns null. */
export function householdEditorCtx(
  editor: Awaited<ReturnType<typeof requireHouseholdEditor>>,
): HouseholdEditorContext {
  if (!editor.ok) {
    throw new Error(editor.error || "Not a household editor");
  }
  return editor.ctx;
}
