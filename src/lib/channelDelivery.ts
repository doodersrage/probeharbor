import type { AlertChannelName } from "./alerts";

export const ALERT_CHANNEL_NAMES: readonly AlertChannelName[] = [
  "email",
  "sms",
  "discord",
  "push",
  "webhook",
  "telegram",
  "slack",
  "teams",
  "ntfy",
  "pushover",
  "whatsapp",
];

export function isAlertChannelName(value: string): value is AlertChannelName {
  return (ALERT_CHANNEL_NAMES as readonly string[]).includes(value);
}

export type ChannelDelivery = {
  lastSentAt: string | null;
  /** Latest attempt where the channel was skipped (failed or not configured). */
  lastFailedAt: string | null;
};

type DeliveryEvent = {
  created_at: string;
  channels_sent: string[] | null;
  channels_skipped: string[] | null;
};

function later(a: string | null, b: string): string {
  if (!a) return b;
  return Date.parse(b) > Date.parse(a) ? b : a;
}

/** Per-channel last success / last failure from recent alert_events rows. */
export function summarizeChannelDelivery(
  events: DeliveryEvent[],
): Partial<Record<AlertChannelName, ChannelDelivery>> {
  const out: Partial<Record<AlertChannelName, ChannelDelivery>> = {};
  const entry = (channel: AlertChannelName) => {
    out[channel] ??= { lastSentAt: null, lastFailedAt: null };
    return out[channel];
  };
  for (const event of events) {
    if (!Number.isFinite(Date.parse(event.created_at))) continue;
    for (const channel of event.channels_sent ?? []) {
      if (isAlertChannelName(channel)) {
        const row = entry(channel);
        row.lastSentAt = later(row.lastSentAt, event.created_at);
      }
    }
    for (const channel of event.channels_skipped ?? []) {
      if (isAlertChannelName(channel)) {
        const row = entry(channel);
        row.lastFailedAt = later(row.lastFailedAt, event.created_at);
      }
    }
  }
  return out;
}

/** Whether the channel's most recent attempt failed (no success since). */
export function channelLastAttemptFailed(delivery: ChannelDelivery | undefined): boolean {
  if (!delivery?.lastFailedAt) return false;
  if (!delivery.lastSentAt) return true;
  return Date.parse(delivery.lastFailedAt) > Date.parse(delivery.lastSentAt);
}
