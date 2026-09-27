import { listRecentAlertEvents, type AlertEventRow } from "./alertEvents";
import { buildAlertReadingsFromLatestSensors } from "./alertReadings";
import { evaluateAlerts, type AlertSettings } from "./alerts";
import { shouldSuppressForSnoozeOrVacation } from "./alertSnooze";
import { hasConfiguredAlertChannel } from "./freezeReadiness";
import { listHouseholdIdsForCron, listHouseholdMembers } from "./households";
import { getAlertSettingsForUser } from "./notify";
import { fetchLatestSensorValues, getFreezeDwellSamples, type LatestSensorRow } from "./sensorReadings";
import { createAdminClient } from "./supabase";
import { freezeThresholdForReading } from "./thresholdSensorScope";

/** Only readings this fresh count: a stale cold probe is the outage monitor's job. */
const FRESH_READING_MS = 2 * 60 * 60 * 1000;
/** Extra time past the user's dwell before we expect an alert to exist. */
const GRACE_MINUTES = 30;
/** Look-back for an alert event; longer than the 4h cooldown. */
const ALERT_WINDOW_MS = 6 * 60 * 60 * 1000;

/** Skip reasons that mean "suppressed on purpose", not "delivery broken". */
const INTENTIONAL_SKIPS = new Set(["quiet_hours", "snooze_or_vacation"]);

export type WatchdogFinding = {
  userId: string;
  householdId: string;
  reason: "no_alert" | "delivery_failed";
  detail: string;
};

/**
 * Decide whether a member who should have a freeze alert got one: none at all
 * means the pipeline went silent; only failed attempts means delivery is broken.
 */
export function classifyAlertDelivery(
  events: Pick<AlertEventRow, "kind" | "created_at" | "channels_sent" | "channels_skipped">[],
  nowMs: number,
): "ok" | "no_alert" | "delivery_failed" {
  const recent = events.filter((event) => {
    const at = Date.parse(event.created_at);
    return event.kind === "threshold" && Number.isFinite(at) && nowMs - at <= ALERT_WINDOW_MS;
  });
  if (recent.length === 0) return "no_alert";
  const anyHandled = recent.some(
    (event) =>
      event.channels_sent.length > 0 ||
      event.channels_skipped.some((reason) => INTENTIONAL_SKIPS.has(reason)),
  );
  return anyHandled ? "ok" : "delivery_failed";
}

/** Freeze messages the pipeline should have produced by now (dwell + grace). */
async function overdueFreezeMessages(
  settings: AlertSettings,
  latest: LatestSensorRow[],
  nowMs: number,
): Promise<string[]> {
  const readings = buildAlertReadingsFromLatestSensors(latest);
  const dwellMinutes = settings.freezeDwellMinutes + GRACE_MINUTES;
  const cutoffIso = new Date(nowMs - dwellMinutes * 60 * 1000).toISOString();

  // Only fetch history for probes that are cold right now.
  const cold = readings.filter(
    (reading) => reading.sensorId && reading.tempf <= freezeThresholdForReading(settings, reading),
  );
  if (cold.length === 0) return [];
  const pairs = await Promise.all(
    cold.map(async (reading) => [reading.sensorId!, await getFreezeDwellSamples(reading.sensorId!, cutoffIso)] as const),
  );

  return evaluateAlerts({ ...settings, freezeDwellMinutes: dwellMinutes }, cold, {
    dwellSamplesBySensorId: Object.fromEntries(pairs),
    nowMs,
  }).filter((message) => message.includes("freeze threshold"));
}

/**
 * Find household members whose probe has been below their freeze threshold
 * long enough that an alert should exist, but none was recorded or every
 * attempt failed. Catches silent regressions anywhere in the alert pipeline.
 */
export async function runAlertDeliveryWatchdog(nowMs = Date.now()): Promise<{
  checked: number;
  findings: WatchdogFinding[];
  errors: string[];
}> {
  const admin = createAdminClient();
  const findings: WatchdogFinding[] = [];
  const errors: string[] = [];
  let checked = 0;

  for (const { householdId } of await listHouseholdIdsForCron()) {
    try {
      const latest = (await fetchLatestSensorValues(householdId)).filter(
        (row) => nowMs - Date.parse(row.recorded_at) <= FRESH_READING_MS,
      );
      if (latest.length === 0) continue;

      const { members } = await listHouseholdMembers(householdId);
      for (const member of members) {
        try {
          const { data } = await admin.auth.admin.getUserById(member.user_id);
          const settings = await getAlertSettingsForUser(
            member.user_id,
            data.user?.user_metadata as Record<string, unknown> | undefined,
          );
          // Members who turned alerts off, paused them, or have no channel
          // aren't expected to receive anything.
          if (
            !settings.enabled ||
            shouldSuppressForSnoozeOrVacation(settings, "threshold") ||
            !hasConfiguredAlertChannel(settings, data.user?.email)
          ) {
            continue;
          }
          checked += 1;

          const overdue = await overdueFreezeMessages(settings, latest, nowMs);
          if (overdue.length === 0) continue;

          const verdict = classifyAlertDelivery(await listRecentAlertEvents(member.user_id, 50), nowMs);
          if (verdict !== "ok") {
            findings.push({
              userId: member.user_id,
              householdId,
              reason: verdict,
              detail: overdue[0]!,
            });
          }
        } catch (error) {
          errors.push(`${member.user_id}: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
    } catch (error) {
      errors.push(`${householdId}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  return { checked, findings, errors };
}

export function formatWatchdogFindings(findings: WatchdogFinding[]): string {
  return findings
    .slice(0, 20)
    .map(
      (finding) =>
        `- ${finding.reason === "no_alert" ? "No alert recorded" : "All deliveries failed"} for user ${finding.userId} (household ${finding.householdId}): ${finding.detail}`,
    )
    .join("\n");
}
