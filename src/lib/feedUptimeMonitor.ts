import { getUserRecord } from "./userRecords";
import * as neonJobs from "./db/jobs";
import { checkFeedHealth, type FeedHealthStatus } from "./collectHistory";
import { feedHealthMessage } from "./feedErrorText";
import { isDemoFeedUrl } from "./demoFeed";
import { getAlertSettingsForUser, notifyUser } from "./notify";
import { listAllHouseholdOwnerUserIds } from "./households";
import type { Locale } from "../i18n/locales";
import { localeFromMetadata } from "../i18n/userLocale";
import { alertJobsMessages } from "../i18n/messages/app/alertJobs";

/** Account language of a user (English when it can't be read). */
async function ownerLocale(userId: string): Promise<Locale> {
  try {
    const data = { user: await getUserRecord(userId) };
    return localeFromMetadata(data.user?.user_metadata as Record<string, unknown> | undefined);
  } catch {
    return "en";
  }
}

export async function storeFeedUptimeChecks(
  userId: string,
  statuses: FeedHealthStatus[],
): Promise<void> {
  if (statuses.length === 0) return;
  const rows = statuses.map((s) => ({
    user_id: userId,
    feed_id: s.feedId,
    feed_name: s.feedName,
    url: s.url,
    ok: s.ok,
    message: s.message,
    latency_ms: null,
    checked_at: s.checkedAt,
  }));
  return neonJobs.insertFeedUptimeChecks(rows);
}

/**
 * True when a down feed has not been reported yet: it was last reachable after
 * the previous feed alert (or has never been alerted on). A feed that stays
 * down is reported once instead of every cooldown window.
 */
export function isNewFeedOutage(lastOkAt: string | null, lastAlertAt: string | null): boolean {
  const lastAlert = lastAlertAt ? Date.parse(lastAlertAt) : NaN;
  if (Number.isNaN(lastAlert)) return true;
  if (!lastOkAt) return false;
  const lastOk = Date.parse(lastOkAt);
  return !Number.isNaN(lastOk) && lastOk > lastAlert;
}

async function lastOkCheckAt(userId: string, feedId: string): Promise<string | null> {
  return neonJobs.lastOkFeedCheckAt(userId, feedId);
}

export async function runFeedUptimeForAllUsers(): Promise<{
  checked: number;
  failed: number;
  alertsSent: number;
  errors: string[];
}> {
  const errors: string[] = [];
  let checked = 0;
  let failed = 0;
  let alertsSent = 0;
  const userIds = await listAllHouseholdOwnerUserIds();

  for (const userId of userIds) {
    try {
      const health = await checkFeedHealth(userId);
      if (health.error) {
        errors.push(`${userId}: ${health.error}`);
        continue;
      }
      await storeFeedUptimeChecks(userId, health.statuses);
      checked += health.statuses.length;
      const down = health.statuses.filter((s) => !s.ok);
      failed += down.length;

      // The demo (example) feed being down is not worth an alert.
      const alertable = down.filter((s) => !isDemoFeedUrl(s.url));
      if (alertable.length === 0) continue;

      const settings = await getAlertSettingsForUser(userId);
      if (!settings.feedUptimeAlertsEnabled) continue;

      const lastAt = settings.lastFeedUptimeAlertAt
        ? Date.parse(settings.lastFeedUptimeAlertAt)
        : 0;
      if (Date.now() - lastAt < 4 * 60 * 60 * 1000) continue;

      const newlyDown: FeedHealthStatus[] = [];
      for (const s of alertable) {
        const lastOk = await lastOkCheckAt(userId, s.feedId);
        if (isNewFeedOutage(lastOk, settings.lastFeedUptimeAlertAt)) newlyDown.push(s);
      }
      if (newlyDown.length === 0) continue;

      const locale = await ownerLocale(userId);
      const body = newlyDown
        .map((s) => `${s.feedName}: ${feedHealthMessage(s, locale)}`)
        .join("\n")
        .slice(0, 1500);

      const payload = { title: alertJobsMessages(locale).feedUptime.title, body, kind: "outage" as const };
      // English keeps the original call shape.
      if (locale === "en") await notifyUser(userId, settings.email, settings, payload);
      else await notifyUser(userId, settings.email, settings, payload, undefined, locale);

      await neonJobs.markFeedUptimeAlert(userId);

      alertsSent += 1;
    } catch (err) {
      errors.push(
        `${userId}: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    }
  }

  return { checked, failed, alertsSent, errors };
}
