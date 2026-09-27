import { signWithAlertLinkSecret, verifyWithAlertLinkSecret } from "./alertAckTokens";
import type { AlertSettings } from "./alerts";
import { getAlertSettingsForUser, saveAlertSettingsForUser } from "./notify";
import { createAdminClient } from "./supabase";

/** Recurring (non-alert) emails a recipient can unsubscribe from. */
export type UnsubscribeKind =
  | "digest"
  | "monthly_report"
  | "quarterly_report"
  | "drip"
  | "freeze_drill";

const SETTINGS_FIELD: Record<UnsubscribeKind, keyof AlertSettings> = {
  digest: "digestEnabled",
  monthly_report: "monthlyReportEnabled",
  quarterly_report: "quarterlyReportEnabled",
  drip: "dripEmailsEnabled",
  freeze_drill: "freezeDrillEnabled",
};

export const UNSUBSCRIBE_LABELS: Record<UnsubscribeKind, string> = {
  digest: "weekly digest emails",
  monthly_report: "monthly report emails",
  quarterly_report: "quarterly report emails",
  drip: "tips and onboarding emails",
  freeze_drill: "freeze-readiness drill emails",
};

export function isUnsubscribeKind(value: string): value is UnsubscribeKind {
  return Object.hasOwn(SETTINGS_FIELD, value);
}

function unsubscribePayload(userId: string, kind: UnsubscribeKind): string {
  return `unsubscribe:${userId}:${kind}`;
}

/** Signed one-click unsubscribe URL, or null when no signing secret is configured. */
export async function buildUnsubscribeUrl(
  siteUrl: string,
  userId: string,
  kind: UnsubscribeKind,
): Promise<string | null> {
  const sig = await signWithAlertLinkSecret(unsubscribePayload(userId, kind));
  if (!sig) return null;
  const params = new URLSearchParams({ uid: userId, kind, sig });
  return `${siteUrl.replace(/\/$/, "")}/api/email/unsubscribe?${params.toString()}`;
}

export function verifyUnsubscribeToken(
  userId: string,
  kind: UnsubscribeKind,
  sig: string,
): Promise<boolean> {
  if (!userId) return Promise.resolve(false);
  return verifyWithAlertLinkSecret(unsubscribePayload(userId, kind), sig);
}

/** RFC 2369 / RFC 8058 headers so mail clients can offer one-click unsubscribe. */
export function unsubscribeHeaders(url: string | null): Record<string, string> {
  if (!url) return {};
  return {
    "List-Unsubscribe": `<${url}>`,
    "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
  };
}

/** Turn off one kind of recurring email for a user. */
export async function applyUnsubscribe(
  userId: string,
  kind: UnsubscribeKind,
): Promise<{ error: string | null }> {
  // Load then save (upsert): users without a settings row still get drip and
  // freeze-drill emails by default, so a bare UPDATE would change nothing.
  const settings = await getAlertSettingsForUser(userId);
  const { error } = await saveAlertSettingsForUser(userId, {
    ...settings,
    [SETTINGS_FIELD[kind]]: false,
  });
  if (error) return { error };

  if (kind === "digest") {
    const admin = createAdminClient();
    // Members also receive digests fanned out from households they opted into.
    const { error: memberError } = await admin
      .from("household_members")
      .update({ digest_opt_in: false })
      .eq("user_id", userId);
    if (memberError) return { error: memberError.message };
  }

  return { error: null };
}
