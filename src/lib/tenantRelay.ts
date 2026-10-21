import { createServerClient } from "./supabase";
import { sendEmail } from "./mailer";
import { brandedEmailParts } from "./emailLayout";
import { resolveSiteUrl } from "./schemaMarkup";
import { canEditHousehold, getUserHouseholdRole } from "./households";
import type { Locale } from "../i18n/locales";
import { fmt } from "../i18n/format";
import { alertJobsMessages } from "../i18n/messages/app/alertJobs";

export type TenantNotifySettings = {
  email: string | null;
  name: string | null;
};

export async function getTenantNotifySettings(
  householdId: string,
): Promise<TenantNotifySettings> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("households")
    .select("tenant_notify_email, tenant_notify_name")
    .eq("id", householdId)
    .maybeSingle();

  return {
    email: data?.tenant_notify_email?.trim() || null,
    name: data?.tenant_notify_name?.trim() || null,
  };
}

export async function updateTenantNotifySettings(
  householdId: string,
  settings: TenantNotifySettings,
  locale: Locale = "en",
): Promise<{ error: string | null }> {
  const email = settings.email?.trim() || null;
  const name = settings.name?.trim() || null;

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: alertJobsMessages(locale).tenant.errors.invalidEmail };
  }

  const supabase = createServerClient();
  const { error } = await supabase
    .from("households")
    .update({
      tenant_notify_email: email,
      tenant_notify_name: name,
    })
    .eq("id", householdId);

  return { error: error?.message ?? null };
}

export async function sendTenantFreezeRelay(input: {
  householdId: string;
  managerUserId: string;
  householdName: string;
  alertTitle: string;
  alertBody: string;
  siteUrl?: string;
  /** Language of the email (the account owner's; tenants have no account). */
  locale?: Locale;
}): Promise<{ ok: boolean; error?: string }> {
  const locale = input.locale ?? "en";
  const t = alertJobsMessages(locale).tenant;
  const role = await getUserHouseholdRole(input.managerUserId, input.householdId);
  if (!canEditHousehold(role)) {
    return { ok: false, error: t.errors.notAuthorized };
  }

  const tenant = await getTenantNotifySettings(input.householdId);
  if (!tenant.email) {
    return { ok: false, error: t.errors.noContact };
  }

  const siteUrl = input.siteUrl ?? resolveSiteUrl(null);
  const greeting = tenant.name ? fmt(t.greetingName, { name: tenant.name }) : t.greeting;
  const intro = `${greeting}\n\n${fmt(t.intro, { household: input.householdName })}`;

  const content: Parameters<typeof brandedEmailParts>[0] = {
    eyebrow: t.eyebrow,
    preheader: input.alertTitle,
    title: input.alertTitle,
    intro: `${intro}\n\n${input.alertBody}`,
    cta: { label: "ProbeHarbor", url: siteUrl },
    tone: "alert",
    footerNote: t.footerNote,
  };
  // English keeps the original single-argument call.
  const parts = locale === "en" ? brandedEmailParts(content) : brandedEmailParts(content, locale);

  try {
    await sendEmail(tenant.email, `[${input.householdName}] ${input.alertTitle}`, parts.text, {
      html: parts.html,
    });
    return { ok: true };
  } catch (error) {
    console.error("tenant relay email failed:", error);
    return { ok: false, error: t.errors.deliveryFailed };
  }
}
