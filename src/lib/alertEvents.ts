import * as neonEvents from "./db/alertEvents";
import { escapeCsvField } from "./csvEscape";
import type { Locale } from "../i18n/locales";
import { alertJobsMessages } from "../i18n/messages/app/alertJobs";
import { SAFETY_ALERT_KINDS, isSafetyAlertKind } from "./alertDeliveryState";

export type AlertEventMeta = {
  thresholdF?: number;
  probeLabel?: string;
  probeTempF?: number;
  outdoorTempF?: number | null;
  deltaTF?: number | null;
  runwayHours?: number | null;
  doorOpen?: boolean;
  feedback?: "false_alarm" | string;
  feedbackAt?: string;
  suggestedTipId?: string;
  reasonSummary?: string;
  /** Closed by the system because the condition cleared (or aged out), not by a person. */
  autoResolved?: "recovered" | "expired";
  /** On a recovery notice: the kind of alert that cleared. */
  recoveredKind?: string;
  /** On a digest: it's the recap sent when quiet hours ended. */
  quietHoursSummary?: boolean;
  /** On a rule alert: a matched rule involves a door, so clearing gets a short notice. */
  doorRule?: boolean;
};

export type AlertEventRow = {
  id: number;
  user_id: string;
  kind: string;
  title: string;
  body: string;
  channels_sent: string[];
  channels_skipped: string[];
  created_at: string;
  acknowledged_at: string | null;
  meta?: AlertEventMeta;
};

export async function recordAlertEvent(input: {
  userId: string;
  kind: string;
  title: string;
  body: string;
  channelsSent: string[];
  channelsSkipped: string[];
  meta?: AlertEventMeta;
}): Promise<number | null> {
  return neonEvents.recordAlertEvent(input);
}

export async function updateAlertEventMeta(
  userId: string,
  eventId: number,
  patch: AlertEventMeta,
  locale: Locale = "en",
): Promise<{ ok: boolean; error?: string }> {
  return neonEvents.updateAlertEventMeta(userId, eventId, patch, alertJobsMessages(locale).events.notFound);
}

export async function updateAlertEventChannels(
  eventId: number,
  userId: string,
  channelsSent: string[],
  channelsSkipped: string[],
): Promise<void> {
  return neonEvents.updateAlertEventChannels(eventId, userId, channelsSent, channelsSkipped);
}

export async function acknowledgeAlertEvent(
  userId: string,
  eventId: number,
): Promise<{ ok: boolean; error?: string }> {
  return neonEvents.acknowledgeAlertEvent(userId, eventId);
}

/** Acknowledge the most recent alert that is still unhandled (see isUnhandledAlertEvent). */
export async function acknowledgeLatestUnackedAlert(
  userId: string,
  locale: Locale = "en",
): Promise<{ ok: boolean; eventId?: number; error?: string }> {
  return neonEvents.acknowledgeLatestUnackedAlert(
    userId,
    INFORMATIONAL_ALERT_KINDS,
    SAFETY_ALERT_KINDS,
    alertJobsMessages(locale).events.noUnhandled,
  );
}

/** Acknowledge every alert that is still unhandled, held safety alerts included (capped). */
export async function acknowledgeAllUnackedAlerts(
  userId: string,
  limit = 50,
  locale: Locale = "en",
): Promise<{ ok: boolean; count: number; error?: string }> {
  return neonEvents.acknowledgeAllUnackedAlerts(
    userId,
    limit,
    INFORMATIONAL_ALERT_KINDS,
    SAFETY_ALERT_KINDS,
    alertJobsMessages(locale).events.noUnhandled,
  );
}

/**
 * Close still-open alerts whose condition has cleared, so the unhandled count
 * means "needs attention now" instead of growing forever. Marks them handled
 * with meta.autoResolved so the Alerts page can say "Recovered". Closes the
 * same rows the count counts, held/failed safety alerts included; those add
 * no channels, so a recovery notice still only goes where an alert went.
 */
export type AutoResolveResult = {
  resolved: number;
  /** Channels the closed alerts reached, so a recovery notice goes to the same places. */
  channels: string[];
};

export async function autoResolveAlerts(
  userId: string,
  options: { kinds?: string[]; olderThanMs?: number; reason?: "recovered" | "expired" } = {},
): Promise<AutoResolveResult> {
  return neonEvents.autoResolveAlerts(userId, INFORMATIONAL_ALERT_KINDS, SAFETY_ALERT_KINDS, {
    kinds: options.kinds,
    olderThanIso: options.olderThanMs ? new Date(Date.now() - options.olderThanMs).toISOString() : undefined,
    reason: options.reason ?? "recovered",
  });
}

export async function listRecentAlertEventsFiltered(
  userId: string,
  options: {
    limit?: number;
    offset?: number;
    /** Substring match on kind (internal callers pass one NotifyKind). */
    kind?: string | null;
    /** Exact kinds (Activity filter); empty means no filter. */
    kinds?: readonly string[] | null;
    unackedOnly?: boolean;
  } = {},
): Promise<{ events: AlertEventRow[]; hasMore: boolean }> {
  const limit = Math.min(Math.max(options.limit ?? 20, 1), 50);
  const offset = Math.max(options.offset ?? 0, 0);
  return neonEvents.listRecentAlertEventsFiltered(userId, INFORMATIONAL_ALERT_KINDS, SAFETY_ALERT_KINDS, {
    limit,
    offset,
    kind: options.kind,
    kinds: options.kinds,
    unackedOnly: options.unackedOnly,
  });
}

export async function getAlertEventForUser(
  userId: string,
  eventId: number,
): Promise<AlertEventRow | null> {
  return neonEvents.getAlertEventForUser(userId, eventId);
}

export async function listRecentAlertEvents(
  userId: string,
  limit = 20,
): Promise<AlertEventRow[]> {
  return neonEvents.listRecentAlertEvents(userId, limit);
}

/** Recent send attempts, only the columns per-channel delivery status needs. */
export async function listRecentDeliveryAttempts(
  userId: string,
  limit = 100,
): Promise<Array<Pick<AlertEventRow, "created_at" | "channels_sent" | "channels_skipped">>> {
  return neonEvents.listRecentDeliveryAttempts(userId, limit);
}

export const ALERT_EVENTS_EXPORT_MAX = 5000;

/** Alert events in [fromIso, toIso], oldest first, capped for export. */
export async function listAlertEventsInRange(
  userId: string,
  fromIso: string,
  toIso: string,
  limit = ALERT_EVENTS_EXPORT_MAX,
): Promise<AlertEventRow[]> {
  return neonEvents.listAlertEventsInRange(userId, fromIso, toIso, limit);
}

export function buildAlertEventsCsv(events: AlertEventRow[]): string {
  const headers = [
    "created_at",
    "kind",
    "title",
    "body",
    "channels_sent",
    "channels_skipped",
    "acknowledged_at",
  ];

  const rows = events.map((event) =>
    [
      event.created_at,
      event.kind,
      event.title,
      event.body,
      (event.channels_sent ?? []).join("|"),
      (event.channels_skipped ?? []).join("|"),
      event.acknowledged_at ?? "",
    ]
      .map(escapeCsvField)
      .join(","),
  );

  return [headers.join(","), ...rows].join("\n");
}

/**
 * True when any alert (test or real) actually reached a channel. Test sends
 * don't touch the cooldown timestamps, so setup checklists use this as the
 * fallback "has a test gone out?" signal.
 */
export async function hasDeliveredAnyAlert(userId: string): Promise<boolean> {
  return neonEvents.hasDeliveredAnyAlert(userId);
}

/**
 * Sends that inform rather than demand action: test alerts, digests and
 * reports, freeze drills, playbook follow-ups (the original event is
 * the one to acknowledge), and "back to normal" recovery notices. They never count as "unhandled".
 */
export const INFORMATIONAL_ALERT_KINDS = ["generic", "digest", "recovery"] as const;

export function isActionableAlertKind(kind: string): boolean {
  return !(INFORMATIONAL_ALERT_KINDS as readonly string[]).includes(kind);
}

/**
 * Needs attention until someone acknowledges it (or it auto-resolves):
 * an actionable alert that reached someone, or a safety alert (freeze, leak,
 * power off, sensor silent) that nobody was told about because it was held
 * (quiet hours, snooze, vacation), every channel failed, or none was set up.
 * Matches countUnacknowledgedAlerts and the acknowledge-all query.
 */
export function isUnhandledAlertEvent(
  event: Pick<AlertEventRow, "kind" | "channels_sent" | "acknowledged_at">,
): boolean {
  if (event.acknowledged_at) return false;
  if (!isActionableAlertKind(event.kind)) return false;
  return (event.channels_sent ?? []).length > 0 || isSafetyAlertKind(event.kind);
}

/** Freeze and leak alerts: the incidents a claims evidence pack documents. */
export const CLAIMS_PACK_ALERT_KINDS = ["threshold", "freeze", "flood"] as const;

/** Any unhandled alert of these kinds (same rule as the count). */
export async function hasUnhandledAlertOfKinds(userId: string, kinds: readonly string[]): Promise<boolean> {
  return neonEvents.hasUnhandledAlertOfKinds(userId, kinds, INFORMATIONAL_ALERT_KINDS, SAFETY_ALERT_KINDS);
}

export async function countUnacknowledgedAlerts(userId: string): Promise<number> {
  try {
    return await neonEvents.countUnacknowledgedAlerts(userId, INFORMATIONAL_ALERT_KINDS, SAFETY_ALERT_KINDS);
  } catch (error) {
    // A failed count must not pass silently as "nothing unhandled": report it so a
    // broken filter or an outage is noticed (Sentry groups repeats).
    await reportCountFailure(error instanceof Error ? error.message : String(error));
    return 0;
  }
}

async function reportCountFailure(reason: string): Promise<void> {
  console.error("countUnacknowledgedAlerts failed", reason);
  try {
    const Sentry = await import("@sentry/cloudflare");
    Sentry.captureException(new Error(`countUnacknowledgedAlerts: ${reason}`));
  } catch {
    /* Sentry optional at build/test time */
  }
}
