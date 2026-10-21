import { createAdminClient } from "./supabase";
import { PRO_MAX_DEVICES } from "./entitlements";
import { resolveSiteUrl } from "./schemaMarkup";
import {
  brandedEmailParts,
  type BrandedEmailContent,
} from "./emailLayout";
import {
  isMailerRecipientNotAllowed,
  partitionMailErrors,
  sendEmail,
} from "./mailer";
import { buildUnsubscribeUrl, unsubscribeHeaders } from "./emailUnsubscribe";
import { isEmailSuppressed } from "./emailSuppressions";
import { fmt, formatNumber } from "../i18n/format";
import type { Locale } from "../i18n/locales";
import { getUserLocale } from "../i18n/userLocale";
import { dripEmailMessages, type DripEmailMessages } from "../i18n/messages/app/email/drip";

export type DripStageId = "day1" | "day3" | "day7";
/** Stage ids plus the variants sent to people who have no reading yet. */
export type DripEmailId = DripStageId | "day3_setup" | "day7_setup" | "confirm";

type DripCopyKey = keyof DripEmailMessages;

type DripStage = {
  id: DripStageId;
  day: number;
  /** English subject (the recipient's language comes from `buildDripEmail`). */
  subject: string;
  content: (siteUrl: string, locale?: Locale) => BrandedEmailContent;
};

type DripEmail = Omit<DripStage, "id" | "day">;

type DripLinks = {
  cta: string;
  secondaryCta: string;
  tone: BrandedEmailContent["tone"];
};

function dripEmail(key: DripCopyKey, links: (site: string) => DripLinks): DripEmail {
  return {
    subject: dripEmailMessages.en[key].subject,
    content: (site, locale = "en") => {
      const copy = dripEmailMessages(locale)[key];
      const urls = links(site);
      const content: BrandedEmailContent = {
        eyebrow: copy.eyebrow,
        preheader: copy.preheader,
        title: copy.title,
        intro: copy.intro,
      };
      if (copy.paragraphs.length > 0) content.paragraphs = [...copy.paragraphs];
      if (copy.bullets.length > 0) {
        content.bullets = copy.bullets.map((bullet) =>
          fmt(bullet, { maxDevices: formatNumber(PRO_MAX_DEVICES, locale) }),
        );
      }
      content.cta = { label: copy.cta, url: urls.cta };
      content.secondaryCta = { label: copy.secondaryCta, url: urls.secondaryCta };
      content.tone = urls.tone;
      return content;
    },
  };
}

export const DRIP_STAGES: DripStage[] = [
  {
    id: "day1",
    day: 1,
    ...dripEmail("day1", (site) => ({
      cta: `${site}/dashboard/devices?view=setup`,
      secondaryCta: `${site}/about/adding-devices`,
      tone: "brand",
    })),
  },
  {
    id: "day3",
    day: 3,
    ...dripEmail("day3", (site) => ({
      cta: `${site}/dashboard/alerts`,
      secondaryCta: `${site}/about/cold-snap-playbook`,
      tone: "alert",
    })),
  },
  {
    id: "day7",
    day: 7,
    ...dripEmail("day7", (site) => ({
      cta: `${site}/pricing`,
      secondaryCta: `${site}/dashboard`,
      tone: "brand",
    })),
  },
];

/**
 * Day 3 and day 7 assume a working sensor (alerts, then Pro). Most people who
 * stall never got a first reading, so they get setup help instead.
 */
export const DRIP_SETUP_EMAILS: Record<"day3_setup" | "day7_setup", DripEmail> = {
  day3_setup: dripEmail("day3Setup", (site) => ({
    cta: `${site}/dashboard/devices?view=setup`,
    secondaryCta: `${site}/about/esp32-freeze-kit`,
    tone: "brand",
  })),
  day7_setup: dripEmail("day7Setup", (site) => ({
    cta: `${site}/contact`,
    secondaryCta: `${site}/dashboard/devices?view=setup`,
    tone: "brand",
  })),
};

/**
 * For accounts that never confirmed their address: they can't sign in, so
 * device setup and the Pro pitch are useless until they confirm.
 */
export const DRIP_CONFIRM_EMAIL: DripEmail = dripEmail("confirm", (site) => ({
  cta: `${site}/resend-confirmation`,
  secondaryCta: `${site}/signin`,
  tone: "brand",
}));

const DRIP_COPY_KEY: Record<DripEmailId, DripCopyKey> = {
  day1: "day1",
  day3: "day3",
  day7: "day7",
  day3_setup: "day3Setup",
  day7_setup: "day7Setup",
  confirm: "confirm",
};

export function buildDripEmail(
  emailId: DripEmailId,
  siteUrl = resolveSiteUrl(null),
  unsubscribeUrl: string | null = null,
  locale: Locale = "en",
): { subject: string; text: string; html: string } {
  const email: DripEmail =
    emailId === "confirm"
      ? DRIP_CONFIRM_EMAIL
      : emailId === "day3_setup" || emailId === "day7_setup"
        ? DRIP_SETUP_EMAILS[emailId]
        : (DRIP_STAGES.find((item) => item.id === emailId) ?? DRIP_STAGES[0]);
  const parts = brandedEmailParts({ ...email.content(siteUrl, locale), unsubscribeUrl }, locale);
  const key = DRIP_COPY_KEY[emailId] ?? "day1";
  return { subject: dripEmailMessages(locale)[key].subject, ...parts };
}

/**
 * Unconfirmed accounts get a confirm reminder on day 1 and day 3, then nothing
 * (null: advance the stage without sending).
 */
export function dripEmailIdForUnconfirmed(stageId: DripStageId): DripEmailId | null {
  return stageId === "day7" ? null : "confirm";
}

/** Pick the email for a stage: setup help instead of alerts/Pro when nothing has reported. */
export function dripEmailIdForStage(stageId: DripStageId, hasReading: boolean): DripEmailId {
  if (hasReading || stageId === "day1") return stageId;
  return stageId === "day3" ? "day3_setup" : "day7_setup";
}

type AdminClient = ReturnType<typeof createAdminClient>;

/** Any push device that has posted, or any pull-feed reading. Errors count as "yes" so the usual email goes out. */
async function userHasFirstReading(admin: AdminClient, userId: string): Promise<boolean> {
  try {
    const { data: memberships, error: memberError } = await admin
      .from("household_members")
      .select("household_id")
      .eq("user_id", userId);
    if (memberError) return true;
    const householdIds = (memberships ?? []).map((m) => m.household_id);
    if (householdIds.length > 0) {
      const { data: seen, error } = await admin
        .from("devices")
        .select("id")
        .in("household_id", householdIds)
        .not("last_seen_at", "is", null)
        .limit(1);
      if (error) return true;
      if ((seen ?? []).length > 0) return true;
    }
    const { data: pulled, error: pullError } = await admin
      .from("garage_temps")
      .select("id")
      .eq("user_id", userId)
      .limit(1);
    if (pullError) return true;
    return (pulled ?? []).length > 0;
  } catch {
    return true;
  }
}

export async function sendDripEmailsForAllUsers(
  deps: { hasFirstReading?: (userId: string) => Promise<boolean> } = {},
): Promise<{
  sent: number;
  skipped: number;
  errors: string[];
  restricted: number;
}> {
  const admin = createAdminClient();
  const hasFirstReading = deps.hasFirstReading ?? ((userId: string) => userHasFirstReading(admin, userId));
  const siteUrl = resolveSiteUrl(null);
  let sent = 0;
  let skipped = 0;
  let restricted = 0;
  const errors: string[] = [];

  const { data: settingsRows } = await admin
    .from("alert_settings")
    .select("user_id, drip_emails_enabled, drip_email_stage, last_drip_email_at")
    .eq("drip_emails_enabled", true);

  for (const row of settingsRows ?? []) {
    try {
      const { data: userData } = await admin.auth.admin.getUserById(row.user_id);
      const user = userData.user;
      if (!user?.email || !user.created_at) {
        skipped += 1;
        continue;
      }

      const ageMs = Date.now() - Date.parse(user.created_at);
      const ageDays = Math.floor(ageMs / (24 * 60 * 60 * 1000));
      const ageHours = ageMs / (60 * 60 * 1000);
      const nextStage = DRIP_STAGES.find((stage) => {
        if (stage.day <= (row.drip_email_stage ?? 0)) return false;
        // First “day1” tip can go out about an hour after signup; later stages stay day-based.
        if (stage.id === "day1") return ageHours >= 1;
        return ageDays >= stage.day;
      });
      if (!nextStage) {
        skipped += 1;
        continue;
      }

      // Bounced or invalid addresses: the mailer would refuse anyway, and
      // logging that as an error every hourly run hides real failures.
      if (await isEmailSuppressed(user.email)) {
        skipped += 1;
        continue;
      }

      if (row.last_drip_email_at) {
        const hoursSince = (Date.now() - Date.parse(row.last_drip_email_at)) / (60 * 60 * 1000);
        if (hoursSince < 20) {
          skipped += 1;
          continue;
        }
      }

      const emailId = !user.email_confirmed_at
        ? dripEmailIdForUnconfirmed(nextStage.id)
        : nextStage.id === "day1"
          ? nextStage.id
          : dripEmailIdForStage(nextStage.id, await hasFirstReading(row.user_id));
      if (emailId) {
        const unsubscribeUrl = await buildUnsubscribeUrl(siteUrl, row.user_id, "drip", getUserLocale(user));
        const mail = buildDripEmail(emailId, siteUrl, unsubscribeUrl, getUserLocale(user));
        await sendEmail(user.email, mail.subject, mail.text, {
          html: mail.html,
          headers: unsubscribeHeaders(unsubscribeUrl),
        });
      }
      await admin
        .from("alert_settings")
        .update({
          drip_email_stage: nextStage.day,
          last_drip_email_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", row.user_id);
      if (emailId) sent += 1;
      else skipped += 1;
    } catch (error) {
      if (isMailerRecipientNotAllowed(error)) {
        // Cloudflare Email binding is destination-restricted; do not fail the cron.
        restricted += 1;
        errors.push(
          `${row.user_id}: ${error instanceof Error ? error.message : "recipient not allowed"}`,
        );
        continue;
      }
      errors.push(
        `${row.user_id}: ${error instanceof Error ? error.message : "unknown"}`,
      );
    }
  }

  return { sent, skipped, errors, restricted };
}

export function dripJobShouldFail(errors: string[]): boolean {
  return partitionMailErrors(errors).hardErrors.length > 0;
}
