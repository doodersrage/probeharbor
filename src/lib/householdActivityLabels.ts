import type { Locale } from "../i18n/locales";
import { householdMessages } from "../i18n/messages/app/household";

/** Human-readable label for household_activity.action values. */
export function formatHouseholdActivityAction(action: string, locale: Locale = "en"): string {
  const labels: Record<string, string> = householdMessages(locale).actions;
  return Object.hasOwn(labels, action) ? labels[action] : action.replace(/_/g, " ");
}
