import type { AlertChannelName, AlertSettings } from "./alerts";

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

/** The settings switch for each channel. */
const CHANNEL_SWITCH = {
  email: "channelEmail",
  sms: "channelSms",
  discord: "channelDiscord",
  push: "channelPush",
  webhook: "channelWebhook",
  telegram: "channelTelegram",
  slack: "channelSlack",
  teams: "channelTeams",
  ntfy: "channelNtfy",
  pushover: "channelPushover",
  whatsapp: "channelWhatsapp",
} as const satisfies Record<AlertChannelName, keyof AlertSettings>;

export type FailingAlertChannel = { channel: AlertChannelName; lastFailedAt: string };

/**
 * Channels that are switched on and whose most recent attempt failed (the
 * same rule as the Settings status line), newest failure first. Empty while
 * alerts are off: nothing is being attempted then.
 */
export function failingAlertChannels(
  delivery: Partial<Record<AlertChannelName, ChannelDelivery>>,
  settings: Pick<AlertSettings, "enabled" | (typeof CHANNEL_SWITCH)[AlertChannelName]>,
): FailingAlertChannel[] {
  if (!settings.enabled) return [];
  return ALERT_CHANNEL_NAMES.filter((channel) => settings[CHANNEL_SWITCH[channel]] === true)
    .filter((channel) => channelLastAttemptFailed(delivery[channel]))
    .map((channel) => ({ channel, lastFailedAt: delivery[channel]?.lastFailedAt as string }))
    .sort((a, b) => Date.parse(b.lastFailedAt) - Date.parse(a.lastFailedAt));
}
