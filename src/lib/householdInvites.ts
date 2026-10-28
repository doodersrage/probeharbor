import { createServerClient } from "./supabase";
import { addHouseholdMemberByUserId, setActiveHouseholdForUser } from "./households";
import { ensureLocale } from "../i18n/catalog";
import { fmt } from "../i18n/format";
import type { Locale } from "../i18n/locales";
import { inviteEmailMessages } from "../i18n/messages/app/email/invite";

export type HouseholdInviteRole =
  | "member"
  | "viewer"
  | "alert_only"
  | "property_manager";

export type HouseholdInvite = {
  id: string;
  household_id: string;
  email: string;
  token: string;
  invited_by: string | null;
  expires_at: string;
  accepted_at: string | null;
  created_at: string;
  role: HouseholdInviteRole;
};

const INVITE_ROLES = new Set<HouseholdInviteRole>([
  "member",
  "viewer",
  "alert_only",
  "property_manager",
]);

/** Parse invite role from form input; returns null when invalid. */
export function parseHouseholdInviteRole(
  raw: string | null | undefined,
): HouseholdInviteRole | null {
  const value = raw?.trim();
  if (!value || !INVITE_ROLES.has(value as HouseholdInviteRole)) return null;
  return value as HouseholdInviteRole;
}

function randomToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Invite links carry a random token; the database stores only its SHA-256
 * hash, so the link is shown once (email + the inviter's page) and "Resend"
 * issues a new one.
 *
 * Invites created before 2026-10-28 stored the raw 48-hex token. Those still
 * match until they expire (7 days). Only that exact legacy shape is looked up
 * raw, so a stored 64-hex hash used as a token matches nothing.
 * After 2026-11-05 the legacy branch can be removed.
 */
const LEGACY_RAW_TOKEN = /^[0-9a-f]{48}$/;

export async function inviteTokenLookupKeys(token: string): Promise<string[]> {
  const keys = [await sha256Hex(token)];
  if (LEGACY_RAW_TOKEN.test(token)) keys.push(token);
  return keys;
}

/** Pending-invite fields safe to render; never includes the token. */
export type PendingInvite = Omit<HouseholdInvite, "token">;
const PENDING_INVITE_COLUMNS =
  "id, household_id, email, invited_by, expires_at, accepted_at, created_at, role";

export async function createHouseholdInvite(
  householdId: string,
  email: string,
  invitedBy: string,
  expiresInDays = 7,
  role: HouseholdInviteRole = "member",
): Promise<{ invite: PendingInvite | null; token: string | null; error: string | null }> {
  const supabase = createServerClient();
  const normalized = email.trim().toLowerCase();
  const token = randomToken();
  const expires_at = new Date(
    Date.now() + expiresInDays * 24 * 60 * 60 * 1000,
  ).toISOString();

  const { data, error } = await supabase
    .from("household_invites")
    .insert({
      household_id: householdId,
      email: normalized,
      token: await sha256Hex(token),
      invited_by: invitedBy,
      expires_at,
      role,
    })
    .select(PENDING_INVITE_COLUMNS)
    .single();

  if (error || !data) {
    return { invite: null, token: null, error: error?.message ?? "Failed to create invite" };
  }

  return { invite: data as PendingInvite, token, error: null };
}

/**
 * Give a pending invite a new link (the old one stops working) and another
 * 7 days. Returns the new raw token to email and show once.
 */
export async function reissueHouseholdInvite(
  householdId: string,
  inviteId: string,
  expiresInDays = 7,
): Promise<{ invite: PendingInvite | null; token: string | null; error: string | null }> {
  const supabase = createServerClient();
  const token = randomToken();
  const expires_at = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from("household_invites")
    .update({ token: await sha256Hex(token), expires_at })
    .eq("id", inviteId)
    .eq("household_id", householdId)
    .is("accepted_at", null)
    .select(PENDING_INVITE_COLUMNS)
    .maybeSingle();

  if (error || !data) {
    return { invite: null, token: null, error: error?.message ?? "Invite not found" };
  }
  return { invite: data as PendingInvite, token, error: null };
}

export async function listPendingInvites(
  householdId: string,
): Promise<{ invites: PendingInvite[]; error: string | null }> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("household_invites")
    .select(PENDING_INVITE_COLUMNS)
    .eq("household_id", householdId)
    .is("accepted_at", null)
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false });

  if (error) {
    return { invites: [], error: error.message };
  }

  return { invites: (data ?? []) as PendingInvite[], error: null };
}

export async function getInviteByToken(
  token: string,
): Promise<HouseholdInvite | null> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("household_invites")
    .select("*")
    .in("token", await inviteTokenLookupKeys(token.trim()))
    .limit(1)
    .maybeSingle();

  return (data as HouseholdInvite | null) ?? null;
}

export async function acceptHouseholdInvite(
  token: string,
  userId: string,
  userEmail: string | null | undefined,
): Promise<{ householdId: string | null; error: string | null }> {
  const invite = await getInviteByToken(token);
  if (!invite) {
    return { householdId: null, error: "Invite not found" };
  }

  if (invite.accepted_at) {
    return { householdId: invite.household_id, error: null };
  }

  if (Date.parse(invite.expires_at) < Date.now()) {
    return { householdId: null, error: "Invite expired" };
  }

  if (
    !userEmail?.trim() ||
    invite.email.toLowerCase() !== userEmail.trim().toLowerCase()
  ) {
    return {
      householdId: null,
      error: "Sign in with the invited email address to accept",
    };
  }

  const role =
    invite.role === "viewer" ||
    invite.role === "alert_only" ||
    invite.role === "property_manager"
      ? invite.role
      : "member";
  const add = await addHouseholdMemberByUserId(
    invite.household_id,
    userId,
    role,
  );
  if (add.error) {
    return { householdId: null, error: add.error };
  }

  await setActiveHouseholdForUser(userId, invite.household_id);

  const supabase = createServerClient();
  await supabase
    .from("household_invites")
    .update({ accepted_at: new Date().toISOString() })
    .eq("id", invite.id);

  return { householdId: invite.household_id, error: null };
}

export async function revokeHouseholdInvite(
  householdId: string,
  inviteId: string,
): Promise<{ error: string | null }> {
  const supabase = createServerClient();
  const { error } = await supabase
    .from("household_invites")
    .delete()
    .eq("id", inviteId)
    .eq("household_id", householdId)
    .is("accepted_at", null);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}

/** Invite email, written in the inviter's language (`locale`). */
export async function sendInviteEmail(
  to: string,
  acceptUrl: string,
  householdName: string,
  invitedByEmail: string | null,
  locale: Locale = "en",
): Promise<void> {
  try {
    const { sendEmail } = await import("./mailer");
    const { brandedEmailParts } = await import("./emailLayout");
    await ensureLocale(locale, ["app"]);
    const t = inviteEmailMessages(locale);
    const who = invitedByEmail ?? t.someone;
    const vars = { who, household: householdName };
    const parts = brandedEmailParts(
      {
        eyebrow: t.eyebrow,
        preheader: fmt(t.preheader, vars),
        title: fmt(t.title, vars),
        intro: fmt(t.intro, vars),
        paragraphs: [t.body],
        cta: { label: t.cta, url: acceptUrl },
        tone: "brand",
        footerNote: t.footerNote,
      },
      locale,
    );
    await sendEmail(to, fmt(t.subject, vars), parts.text, {
      html: parts.html,
    });
  } catch (error) {
    console.error("Failed to send household invite email:", error);
  }
}
