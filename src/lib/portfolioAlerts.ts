import { fetchCrossPropertySnapshots } from "./crossProperty";
import { getAlertSettingsForUser, notifyUser } from "./notify";
import { createServerClient } from "./supabase";
import { listUserHouseholds } from "./households";
import { getUserEntitlements } from "./entitlements";
import type { Locale } from "../i18n/locales";
import { fmt, formatNumber, plural } from "../i18n/format";
import { localeFromMetadata } from "../i18n/userLocale";
import { alertJobsMessages } from "../i18n/messages/app/alertJobs";

type AtRiskProperty = { name: string; minTempF?: number | null; freezeThresholdF: number };

/** Landlord digest title and body, in the owner's language. */
export function buildPortfolioDigest(
  atRisk: AtRiskProperty[],
  locale: Locale = "en",
): { title: string; body: string } {
  const t = alertJobsMessages(locale).portfolio;
  const num = (value: number | null | undefined, digits?: number): string => {
    if (locale === "en") return digits == null ? String(value) : `${value?.toFixed(digits)}`;
    if (value == null) return "—";
    return formatNumber(
      value,
      locale,
      digits == null ? undefined : { minimumFractionDigits: digits, maximumFractionDigits: digits },
    );
  };
  const lines = atRisk
    .map((p) => fmt(t.line, { name: p.name, temp: num(p.minTempF, 1), threshold: num(p.freezeThresholdF) }))
    .join("\n");
  const count = atRisk.length;
  return {
    title: fmt(t.title, { count: locale === "en" ? String(count) : formatNumber(count, locale) }),
    body: `${plural(t.intro, count, locale)}\n${lines}`,
  };
}

const PORTFOLIO_COOLDOWN_MS = 4 * 60 * 60 * 1000;

export async function sendPortfolioAlertsForAllUsers(): Promise<{
  sent: number;
  skipped: number;
  errors: string[];
}> {
  const errors: string[] = [];
  let sent = 0;
  let skipped = 0;
  const supabase = createServerClient();
  const { createAdminClient } = await import("./supabase");
  const admin = createAdminClient();

  const { data: owners } = await supabase
    .from("household_members")
    .select("user_id")
    .eq("role", "owner");

  const userIds = [...new Set((owners ?? []).map((r) => r.user_id))];

  for (const userId of userIds) {
    try {
      const entitlements = await getUserEntitlements(userId);
      if (!entitlements.canUsePortfolio) {
        skipped += 1;
        continue;
      }

      const { households } = await listUserHouseholds(userId);
      if (households.length < 2) {
        skipped += 1;
        continue;
      }

      const { data: userData } = await admin.auth.admin.getUserById(userId);
      const email = userData.user?.email ?? null;
      const settings = await getAlertSettingsForUser(
        userId,
        userData.user?.user_metadata as Record<string, unknown>,
      );

      if (!settings.enabled || !settings.portfolioAlertsEnabled) {
        skipped += 1;
        continue;
      }

      if (settings.lastPortfolioAlertAt) {
        const last = Date.parse(settings.lastPortfolioAlertAt);
        if (Date.now() - last < PORTFOLIO_COOLDOWN_MS) {
          skipped += 1;
          continue;
        }
      }

      const { properties } = await fetchCrossPropertySnapshots(userId);
      const atRisk = properties.filter((p) => p.atRisk);
      if (atRisk.length === 0) {
        skipped += 1;
        continue;
      }

      const locale = localeFromMetadata(userData.user?.user_metadata as Record<string, unknown> | undefined);
      const digest = buildPortfolioDigest(atRisk, locale);

      const payload = { title: digest.title, body: digest.body, kind: "threshold" as const };
      // English keeps the original call shape.
      if (locale === "en") await notifyUser(userId, email, settings, payload);
      else await notifyUser(userId, email, settings, payload, undefined, locale);

      await supabase
        .from("alert_settings")
        .update({
          last_portfolio_alert_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId);

      sent += 1;
    } catch (err) {
      errors.push(
        `${userId}: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    }
  }

  return { sent, skipped, errors };
}
