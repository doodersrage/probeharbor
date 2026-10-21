import type { Locale } from "../i18n/locales";
import { fmt, plural } from "../i18n/format";
import { miscMessages } from "../i18n/messages/app/misc";

/**
 * `TempFeedResult.error` stays English (logs, stored checks); this gives the
 * text a person reads in their language. English comes back unchanged.
 */
export function localizeFeedError(message: string, locale: Locale = "en"): string {
  if (locale === "en") return message;
  const t = miscMessages(locale).feeds;
  const status = /^Temperature feed request failed \((\d+)\)$/.exec(message);
  if (status) return fmt(t.requestFailed, { status: status[1] });
  if (message === "Invalid temperature feed payload") return t.invalidPayload;
  const root = /^Temperature feed is missing a "(.*)" object$/.exec(message);
  if (root) return fmt(t.missingRoot, { root: root[1] });
  if (message === "Unknown feed error") return t.unknown;
  if (message === "Feed unreachable") return t.unreachable;
  if (/timed? ?out|timeout/i.test(message)) return t.timedOut;
  if (/JSON|Unexpected token|Unexpected end/i.test(message)) return t.invalidJson;
  return fmt(t.unreachableDetail, { detail: message });
}

/** A feed health status message (English, stored as is) in the reader's language. */
export function feedHealthMessage(
  status: { ok: boolean; message: string; probeCount: number },
  locale: Locale = "en",
): string {
  if (locale === "en") return status.message;
  if (status.ok) return plural(miscMessages(locale).feeds.responding, status.probeCount, locale);
  return localizeFeedError(status.message, locale);
}
