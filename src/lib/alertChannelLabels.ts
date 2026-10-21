import type { Locale } from "../i18n/locales";
import { alertMessages } from "../i18n/messages/app/alertMessages";

/** Human-readable labels (English) for alert delivery channels and skip reasons. */
export const ALERT_CHANNEL_LABELS: Record<string, string> = alertMessages.en.channelLabels;

export function formatAlertChannelList(channels: string[], locale: Locale = "en"): string {
  const labels = alertMessages(locale).channelLabels;
  return channels
    .map((key) => labels[key] ?? key.replaceAll("_", " "))
    .join(", ");
}

export function formatAlertChannelsCsv(raw: string | null | undefined, locale: Locale = "en"): string {
  if (!raw) return "";
  return formatAlertChannelList(raw.split(",").filter(Boolean), locale);
}

/** Ops / Alerts smoke-test flash copy for skip and failure codes. */
export function channelTestErrorMessage(code: string | null | undefined, locale: Locale = "en"): string | null {
  if (!code) return null;
  const t = alertMessages(locale);
  if (code === "sms_no_phone") return t.channelErrors.smsNoPhone;
  if (code === "sms_send_failed") return t.channelErrors.smsSendFailed;
  if (code === "unknown_kind") return t.channelErrors.unknownKind;
  return t.channelLabels[code] ?? code.replaceAll("_", " ");
}
