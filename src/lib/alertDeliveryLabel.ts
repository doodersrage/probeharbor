import { fmt } from "../i18n/format";
import type { Locale } from "../i18n/locales";
import { alertsMessages } from "../i18n/messages/app/alerts";
import { formatAlertChannelList } from "./alertChannelLabels";
import type { AlertDeliveryState } from "./alertDeliveryState";

export const ALERT_CHANNEL_SETTINGS_HREF = "/dashboard/alerts?tab=settings#alert-section-channels";
export const ALERT_PAUSE_SETTINGS_HREF = "/dashboard/alerts?tab=settings#alert-section-quiet";

export type AlertDeliveryLabel = {
  /** "Accepted by email", "Held (quiet hours)", "Failed: email, SMS", … */
  label: string;
  /** Second line for held alerts where a channel also failed. */
  extra: string | null;
  /** Longer explanation (tooltip). */
  title: string | null;
  /** "ok" for accepted; "warn" when someone may not have been told. */
  tone: "ok" | "warn";
  /** Short next step, for people who can edit settings. */
  fix: { href: string; label: string } | null;
};

/** Plain words for an Activity row's delivery state. Never says "delivered": providers only accept. */
export function formatAlertDeliveryState(state: AlertDeliveryState, locale: Locale = "en"): AlertDeliveryLabel {
  const messages = alertsMessages(locale);
  const t = messages.deliveryState;
  const list = (channels: string[]) => formatAlertChannelList(channels, locale);
  const fixChannels = { href: ALERT_CHANNEL_SETTINGS_HREF, label: t.fixChannels };
  switch (state.state) {
    case "sent":
      return { label: fmt(messages.list.sent, { channels: list(state.sent) }), extra: null, title: null, tone: "ok", fix: null };
    case "partial":
      return {
        label: fmt(t.partial, { sent: list(state.sent), failed: list(state.failed) }),
        extra: null,
        title: t.failedTitle,
        tone: "warn",
        fix: fixChannels,
      };
    case "held":
      return {
        label: state.reason === "quiet_hours" ? t.heldQuietHours : t.heldSnooze,
        extra: state.failed.length > 0 ? fmt(t.alsoFailed, { channels: list(state.failed) }) : null,
        title: t.heldTitle,
        tone: "warn",
        fix: { href: ALERT_PAUSE_SETTINGS_HREF, label: t.fixPause },
      };
    case "failed":
      return {
        label: fmt(t.failed, { channels: list(state.failed) }),
        extra: null,
        title: t.failedTitle,
        tone: "warn",
        fix: fixChannels,
      };
    case "not_set_up":
      return { label: t.notSetUp, extra: null, title: t.notSetUpTitle, tone: "warn", fix: fixChannels };
  }
}
