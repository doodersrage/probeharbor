import type { User } from "@supabase/supabase-js";
import { DEFAULT_LOCALE, isLocale, LOCALES, type Locale } from "./locales";

/** Cookie remembering the last language a visitor chose or browsed in. */
export const LOCALE_COOKIE = "ph_locale";
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/** Account language saved in `user_metadata.locale`, if any. */
export function getSavedUserLocale(user: Pick<User, "user_metadata"> | null | undefined): Locale | null {
  const value = user?.user_metadata?.locale;
  return isLocale(value) ? value : null;
}

/**
 * Language for anything sent to a user (emails, alerts, push, SMS, Telegram).
 * Users who never picked one get English.
 */
export function getUserLocale(user: Pick<User, "user_metadata"> | null | undefined): Locale {
  return getSavedUserLocale(user) ?? DEFAULT_LOCALE;
}

/** Locale from a raw user_metadata object (rows read with the admin API). */
export function localeFromMetadata(metadata: Record<string, unknown> | null | undefined): Locale {
  const value = metadata?.locale;
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

/** Best supported match for an Accept-Language header, or null. */
export function localeFromAcceptLanguage(header: string | null | undefined): Locale | null {
  if (!header) return null;
  const ranked = header
    .split(",")
    .map((part, index) => {
      const [tag, ...params] = part.trim().toLowerCase().split(";");
      const q = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
      const quality = q ? Number.parseFloat(q.slice(2)) : 1;
      return { tag, quality: Number.isFinite(quality) ? quality : 0, index };
    })
    .filter((entry) => entry.tag && entry.quality > 0)
    .sort((a, b) => b.quality - a.quality || a.index - b.index);
  for (const { tag } of ranked) {
    if (tag === "*") continue;
    if (isLocale(tag)) return tag;
    const base = tag.split("-")[0];
    if (base === "pt") return "pt-br";
    const match = LOCALES.find((l) => l === base);
    if (match) return match;
  }
  return null;
}
