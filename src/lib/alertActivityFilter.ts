import type { Locale } from "../i18n/locales";
import { formatAlertKind } from "./alertKindLabels";

/**
 * Alerts Activity "Type" filter. Each option maps to the exact
 * alert_events.kind values it covers (queried with `.in`, not a substring
 * match): freeze alerts are stored as kind "threshold", and test sends as
 * "generic", so a substring search for "freeze" or "test" found nothing.
 */
export const ALERT_ACTIVITY_FILTERS: ReadonlyArray<{ id: string; kinds: readonly string[] }> = [
  // Freeze and humidity threshold alerts; "freeze" covers any legacy rows.
  { id: "threshold", kinds: ["threshold", "freeze"] },
  { id: "flood", kinds: ["flood"] },
  { id: "power", kinds: ["power"] },
  { id: "runway", kinds: ["runway"] },
  { id: "forecast", kinds: ["forecast"] },
  { id: "nws", kinds: ["nws"] },
  { id: "rate", kinds: ["rate"] },
  { id: "outage", kinds: ["outage"] },
  { id: "stuck", kinds: ["stuck"] },
  { id: "rule", kinds: ["rule"] },
  { id: "battery", kinds: ["battery"] },
  { id: "rssi", kinds: ["rssi"] },
  { id: "recovery", kinds: ["recovery"] },
  // Test sends, freeze drills and playbook messages; "test" for legacy rows.
  { id: "generic", kinds: ["generic", "test"] },
];

/** Old ?activity_kind= values from before the exact mapping. */
const LEGACY_ALIASES: Record<string, string> = {
  freeze: "threshold",
  test: "generic",
};

export type AlertActivityFilter = { id: string; kinds: string[] };

/** The filter for a ?activity_kind= value, or null (show everything) when unknown or empty. */
export function resolveAlertActivityFilter(raw: string | null | undefined): AlertActivityFilter | null {
  const value = raw?.trim().toLowerCase() ?? "";
  if (!value) return null;
  const id = LEGACY_ALIASES[value] ?? value;
  const match = ALERT_ACTIVITY_FILTERS.find((filter) => filter.id === id);
  return match ? { id: match.id, kinds: [...match.kinds] } : null;
}

/** Select options, labelled with the same names the Activity list uses. */
export function alertActivityFilterOptions(
  locale: Locale,
  genericLabel: string,
): Array<{ id: string; label: string }> {
  return ALERT_ACTIVITY_FILTERS.map((filter) => ({
    id: filter.id,
    label: filter.id === "generic" ? genericLabel : formatAlertKind(filter.id, locale),
  }));
}
