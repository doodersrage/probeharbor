import { createAdminClient } from "./supabase";
import { getAlertSettingsForUser, notifyUser } from "./notify";
import { brandedEmailParts, formatEmailValue } from "./emailLayout";
import { fmt } from "../i18n/format";
import type { Locale } from "../i18n/locales";
import { getUserLocale } from "../i18n/userLocale";
import { freezeDrillEmailMessages } from "../i18n/messages/app/email/freezeDrill";
import { resolveSiteUrl } from "./schemaMarkup";
import { sendEmail, isMailDeliveryBounceError } from "./mailer";
import { computeFreezeReadiness } from "./freezeReadiness";
import { listAllHouseholdOwnerUserIds } from "./households";
import { listHouseholdDevices } from "./devices";
import { fetchLatestSensorValues } from "./sensorReadings";
import { getUserEntitlements } from "./entitlements";
import { hasDeliveredAnyAlert } from "./alertEvents";
import { getUserPreferences, personalWeatherConfigFromPreferences } from "./userPreferences";
import { isWeatherLocationConfigured } from "./personalWeatherStations";
import {
  isEmailSuppressed,
  isPlausibleEmailAddress,
  suppressEmail,
} from "./emailSuppressions";
import { buildUnsubscribeUrl, unsubscribeHeaders } from "./emailUnsubscribe";

/** Sep 1 – Nov 15 (Northern Hemisphere pre-season). */
export function shouldSendFreezeDrill(now = new Date()): boolean {
  const month = now.getUTCMonth() + 1;
  const day = now.getUTCDate();
  if (month === 9 || month === 10) return true;
  if (month === 11 && day <= 15) return true;
  return false;
}

export function buildFreezeDrillEmailParts(
  input: {
    score: number;
    checks: Array<{ ok: boolean; label: string }>;
    siteUrl: string;
    unsubscribeUrl?: string | null;
  },
  locale: Locale = "en",
) {
  const t = freezeDrillEmailMessages(locale);
  const score = formatEmailValue(input.score, locale);
  const readinessTone =
    input.score >= 80 ? "success" : input.score >= 50 ? "brand" : "alert";
  return brandedEmailParts(
    {
      eyebrow: t.eyebrow,
      preheader: fmt(t.preheader, { score }),
      title: t.title,
      intro: t.intro,
      sections: [
        {
          type: "callout",
          tone: readinessTone,
          title: t.readiness,
          body: fmt(t.score, { score }),
        },
      ],
      bullets: input.checks.map((c) => `${c.ok ? "✓" : "○"} ${c.label}`),
      cta: { label: t.ctaDashboard, url: `${input.siteUrl}/dashboard` },
      secondaryCta: {
        label: t.ctaTest,
        url: `${input.siteUrl}/dashboard/alerts?tab=settings#send-test-alert`,
      },
      tone: "brand",
      footerNote: t.footerNote,
      unsubscribeUrl: input.unsubscribeUrl,
    },
    locale,
  );
}

export function monthsSince(iso: string | null | undefined, now = Date.now()): number {
  if (!iso) return Infinity;
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return Infinity;
  return (now - t) / (30 * 24 * 60 * 60 * 1000);
}

export async function sendFreezeDrillsForAllUsers(): Promise<{
  sent: number;
  skipped: number;
  errors: string[];
}> {
  if (!shouldSendFreezeDrill()) {
    return { sent: 0, skipped: 0, errors: [] };
  }

  const admin = createAdminClient();
  const ownerIds = await listAllHouseholdOwnerUserIds();
  let sent = 0;
  let skipped = 0;
  const errors: string[] = [];
  const siteUrl = resolveSiteUrl(null);

  for (const userId of ownerIds) {
    try {
      const { data: userData, error: userError } = await admin.auth.admin.getUserById(userId);
      if (userError || !userData.user) {
        skipped += 1;
        continue;
      }
      const user = userData.user;
      const settings = await getAlertSettingsForUser(userId, user.user_metadata as Record<string, unknown>);
      const locale = getUserLocale(user);
      const t = freezeDrillEmailMessages(locale);

      if (settings.freezeDrillEnabled === false) {
        skipped += 1;
        continue;
      }

      if (monthsSince(settings.lastFreezeDrillAt) < 11) {
        skipped += 1;
        continue;
      }

      const entitlements = await getUserEntitlements(userId);
      const prefs = await getUserPreferences(user);
      const { data: member } = await admin
        .from("household_members")
        .select("household_id")
        .eq("user_id", userId)
        .eq("role", "owner")
        .limit(1)
        .maybeSingle();

      const householdId = member?.household_id ?? null;
      const devicesResult = householdId
        ? await listHouseholdDevices(householdId)
        : { devices: [] };
      const latest = householdId ? await fetchLatestSensorValues(householdId) : [];

      const readiness = computeFreezeReadiness({
        alertSettings: settings,
        devices: devicesResult.devices,
        latest,
        weatherLocationConfigured: isWeatherLocationConfigured(
          personalWeatherConfigFromPreferences(prefs),
        ),
        canUseForecast: entitlements.canUseForecastAlerts,
        canUseNws: entitlements.canUseNwsAlerts,
        hasSentAnyAlert:
          Boolean(settings.lastAlertSentAt) || (await hasDeliveredAnyAlert(userId)),
      }, locale);

      const unsubscribeUrl = await buildUnsubscribeUrl(siteUrl, userId, "freeze_drill", locale);
      const parts = buildFreezeDrillEmailParts({
        score: readiness.score,
        checks: readiness.checks,
        siteUrl,
        unsubscribeUrl,
      }, locale);

      if (user.email) {
        if (
          !isPlausibleEmailAddress(user.email) ||
          (await isEmailSuppressed(user.email))
        ) {
          skipped += 1;
          continue;
        }
        try {
          await sendEmail(user.email, fmt(t.subject, { score: formatEmailValue(readiness.score, locale) }), parts.text, {
            html: parts.html,
            headers: unsubscribeHeaders(unsubscribeUrl),
          });
        } catch (error) {
          if (isMailDeliveryBounceError(error)) {
            await suppressEmail(
              user.email,
              "bounce",
              error instanceof Error ? error.message : String(error),
            );
            skipped += 1;
            continue;
          }
          throw error;
        }
      }

      await notifyUser(
        userId,
        user.email,
        settings,
        {
          title: t.notifyTitle,
          body: fmt(t.notifyBody, { score: formatEmailValue(readiness.score, locale) }),
          kind: "generic",
        },
        undefined,
        locale,
      );

      await admin
        .from("alert_settings")
        .update({ last_freeze_drill_at: new Date().toISOString() })
        .eq("user_id", userId);

      sent += 1;
    } catch (error) {
      errors.push(`${userId}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  return { sent, skipped, errors };
}
