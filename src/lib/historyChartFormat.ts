/**
 * Pure helpers for the history chart (src/components/HistoryChart.tsx):
 * locale-aware number text, `{name}` templates, and the browser-stored
 * high/target lines. No JSX, no component state.
 */

export function isEnglishLocale(locale?: string): boolean {
  return !locale || locale.toLowerCase().startsWith("en");
}

/** `toFixed`, or the locale's decimal separator when a non-English locale is given. */
export function fixed(value: number, digits: number, locale?: string): string {
  if (isEnglishLocale(locale)) return value.toFixed(digits);
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
    useGrouping: false,
  }).format(value);
}

/** Replace `{name}` placeholders with plain values. */
export function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m));
}

export function readStoredNumber(key: string): number | null {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null || raw === "") return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

export function writeStoredNumber(key: string, value: number | null) {
  try {
    if (value == null) localStorage.removeItem(key);
    else localStorage.setItem(key, String(value));
  } catch {
    /* ignore quota / private mode */
  }
}
