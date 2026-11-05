/**
 * What happened to one alert_events row, told from what notifyUser stores
 * (src/lib/notify.ts):
 *
 * - `channels_sent`: channels whose provider accepted the message. That's
 *   "accepted", not "delivered": ProbeHarbor can't confirm it reached the
 *   person, so the wording stays "Accepted by …".
 * - `channels_skipped`: one entry per enabled channel that didn't send, plus
 *   reasons. "quiet_hours" and "snooze_or_vacation" mean the alert was held
 *   back on purpose. A bare channel name ("email", "sms") means that channel
 *   was on but the send failed OR its destination was missing; the row
 *   doesn't record which, so both read as failed. Others are reason codes
 *   ("sms_not_configured", "push_no_subscription", …), also failures.
 *
 * Limits of the stored data, mapped conservatively (never as delivered):
 * - Snooze and vacation share one reason, so "held" can't say which.
 * - Both lists empty means nothing was tried: no channel on, or routing /
 *   severity rules left none for this alert. A row that is still being sent
 *   (notifyUser records it first, then fills the lists) looks the same for
 *   those few seconds. All of these read as "not_set_up".
 */

export type AlertHeldReason = "quiet_hours" | "snooze_or_vacation";

export type AlertDeliveryState =
  /** Every channel tried was accepted by its provider. */
  | { state: "sent"; sent: string[] }
  /** Some channels were accepted, others failed. */
  | { state: "partial"; sent: string[]; failed: string[] }
  /** Held back on purpose; `failed` lists channels that also failed (SMS-only quiet hours). */
  | { state: "held"; reason: AlertHeldReason; failed: string[] }
  /** Channels were tried and none accepted it. */
  | { state: "failed"; failed: string[] }
  /** Nothing was tried: no channel set up for this alert. */
  | { state: "not_set_up" };

export const ALERT_HELD_REASONS: readonly AlertHeldReason[] = ["quiet_hours", "snooze_or_vacation"];

function isHeldReason(entry: string): entry is AlertHeldReason {
  return (ALERT_HELD_REASONS as readonly string[]).includes(entry);
}

type DeliveryColumns = {
  channels_sent: string[] | null | undefined;
  channels_skipped: string[] | null | undefined;
};

export function alertDeliveryState(event: DeliveryColumns): AlertDeliveryState {
  const sent = [...new Set(event.channels_sent ?? [])];
  const skipped = [...new Set(event.channels_skipped ?? [])];
  const held = skipped.find(isHeldReason);
  const failed = skipped.filter((entry) => !isHeldReason(entry));

  if (sent.length > 0) {
    return failed.length > 0 ? { state: "partial", sent, failed } : { state: "sent", sent };
  }
  if (held) return { state: "held", reason: held, failed };
  if (failed.length > 0) return { state: "failed", failed };
  return { state: "not_set_up" };
}

/**
 * Safety alerts: an unattended one can mean property damage, so when nobody
 * was told (held, failed, nothing set up) it still needs attention on the
 * dashboard. Stored kinds: "threshold" (freeze and humidity; "freeze" on
 * legacy rows), "flood" (leak), "power" (power off), "outage" (sensor
 * silent / device offline), the early freeze warnings "forecast", "runway"
 * and "nws" (the same kinds quiet hours treat as critical; they expire after a
 * day), and "stuck" (a frozen reading hides a freeze like a silent sensor;
 * closes when the probe recovers). Routine kinds (rule, battery, rssi, rate, …)
 * count as unhandled only once they reached someone; informational kinds
 * (test messages, digests, recovery notices) never do.
 */
export const SAFETY_ALERT_KINDS = [
  "threshold",
  "freeze",
  "flood",
  "power",
  "outage",
  "forecast",
  "runway",
  "nws",
  "stuck",
] as const;

export function isSafetyAlertKind(kind: string | null | undefined): boolean {
  return typeof kind === "string" && (SAFETY_ALERT_KINDS as readonly string[]).includes(kind);
}
