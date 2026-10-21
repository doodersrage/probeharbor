import { LOCALE_META, type Locale } from "./locales";

/** Values substituted into `{name}` placeholders. */
export type FormatVars = Record<string, string | number>;

const PLACEHOLDER = /\{([a-zA-Z_][a-zA-Z0-9_]*)\}/g;

/**
 * Fill `{name}` placeholders: `fmt("{price}/mo", { price: "$4" })` → "$4/mo".
 * Unknown placeholders are left as written so a missing value is visible.
 * Numbers are inserted as given; format them first (see `formatNumber`).
 */
export function fmt(template: string, vars: FormatVars = {}): string {
  return template.replace(PLACEHOLDER, (whole, name: string) =>
    Object.hasOwn(vars, name) ? String(vars[name]) : whole,
  );
}

/** Placeholder names used in a template, sorted (for translation parity tests). */
export function placeholdersOf(template: string): string[] {
  return [...new Set([...template.matchAll(PLACEHOLDER)].map((m) => m[1]))].sort();
}

/**
 * Plural forms keyed by CLDR category. English needs `one` and `other`;
 * translations may add `zero`, `two`, `few` or `many` where the language uses them.
 */
export type PluralForms = {
  zero?: string;
  one: string;
  two?: string;
  few?: string;
  many?: string;
  other: string;
};

const pluralRules = new Map<Locale, Intl.PluralRules>();

/**
 * Pick the plural form for `count` and fill it. `{count}` is the count
 * formatted for the locale; pass extra placeholders in `vars`.
 * `plural({ one: "{count} probe", other: "{count} probes" }, 3, "en")` → "3 probes".
 */
export function plural(forms: PluralForms, count: number, locale: Locale, vars: FormatVars = {}): string {
  let rules = pluralRules.get(locale);
  if (!rules) {
    rules = new Intl.PluralRules(LOCALE_META[locale].intl);
    pluralRules.set(locale, rules);
  }
  const category = rules.select(count) as keyof PluralForms;
  const template = forms[category] ?? forms.other;
  return fmt(template, { count: formatNumber(count, locale), ...vars });
}

/** `1234.5` → "1,234.5" (en), "1.234,5" (de). */
export function formatNumber(value: number, locale: Locale, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(LOCALE_META[locale].intl, options).format(value);
}

/** Date/time in the locale's conventions. Pass `timeZone` in options when it matters. */
export function formatDateTime(
  value: Date | string | number,
  locale: Locale,
  options: Intl.DateTimeFormatOptions = { dateStyle: "medium", timeStyle: "short" },
): string {
  return new Intl.DateTimeFormat(LOCALE_META[locale].intl, options).format(new Date(value));
}

/** "3 hours ago" / "hace 3 horas". */
export function formatRelativeTime(
  value: number,
  unit: Intl.RelativeTimeFormatUnit,
  locale: Locale,
  options: Intl.RelativeTimeFormatOptions = { numeric: "auto" },
): string {
  return new Intl.RelativeTimeFormat(LOCALE_META[locale].intl, options).format(value, unit);
}
