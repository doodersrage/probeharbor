import type { Locale } from "../i18n/locales";
import { alertMessages } from "../i18n/messages/app/alertMessages";

/** Plain names for alert_events.kind, for the Activity list and filters. */
export function formatAlertKind(kind: string | null | undefined, locale: Locale = "en"): string {
  const t = alertMessages(locale);
  if (!kind) return t.kindFallback;
  return t.kindLabels[kind] ?? kind.replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase());
}
