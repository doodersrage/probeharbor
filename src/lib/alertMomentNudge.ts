/**
 * Pitch SMS right after it would have mattered: the latest freeze, flood, or
 * forecast alert in the last two weeks reached this account by email only.
 * A generic "upgrade" tip on day 7 means little before anything has fired.
 */
import type { NotifyKind } from "./alerts";
import { isCriticalNotifyKind } from "./quietHours";

type EventLike = {
  id: number;
  kind: string;
  created_at: string;
  channels_sent: string[] | null;
};

export type AlertMoment = {
  eventId: number;
  kind: string;
  createdAt: string;
  /** "freeze alert", "leak alert", ... for the card copy. */
  label: string;
};

const MOMENT_WINDOW_MS = 14 * 24 * 60 * 60 * 1000;
const FAST_CHANNELS = new Set(["sms", "push", "whatsapp", "telegram", "pushover", "ntfy"]);

function momentLabel(kind: string): string {
  if (kind === "flood") return "leak alert";
  if (kind === "forecast" || kind === "nws") return "freeze forecast";
  return "freeze alert";
}

export function findAlertMoment(events: EventLike[], nowMs = Date.now()): AlertMoment | null {
  const latest = events
    .filter((e) => isCriticalNotifyKind(e.kind as NotifyKind))
    .filter((e) => (e.channels_sent ?? []).length > 0)
    .filter((e) => {
      const at = Date.parse(e.created_at);
      return Number.isFinite(at) && nowMs - at <= MOMENT_WINDOW_MS;
    })
    .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))[0];
  if (!latest) return null;
  // Already reaching a phone some other way: nothing to sell.
  if ((latest.channels_sent ?? []).some((c) => FAST_CHANNELS.has(c))) return null;
  return {
    eventId: latest.id,
    kind: latest.kind,
    createdAt: latest.created_at,
    label: momentLabel(latest.kind),
  };
}
