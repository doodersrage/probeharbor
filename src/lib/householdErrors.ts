import type { Locale } from "../i18n/locales";
import { householdMessages } from "../i18n/messages/app/household";

/** User-facing text for a household `?error=` code (codes stay English). */
export function getHouseholdErrorMessage(code: string | null, locale: Locale = "en"): string | null {
  if (!code) {
    return null;
  }

  const messages: Record<string, string> = householdMessages(locale).errors;
  if (Object.hasOwn(messages, code)) {
    return messages[code];
  }

  if (code.length > 0 && code.length < 200 && !code.includes("<")) {
    return code.replace(/_/g, " ");
  }

  return messages["1"];
}
