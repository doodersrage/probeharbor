/**
 * Language helpers for the /api/auth routes (the leading underscore keeps
 * this file out of Astro's routing).
 *
 * The request locale on these routes comes from middleware: the account
 * language, else the `ph_locale` cookie that the localized sign-in and
 * register pages set when viewed (/es/register → `es`).
 */
import type { Session, SupabaseClient, User } from "@supabase/supabase-js";
import { DEFAULT_LOCALE, isLocale, type Locale } from "../../../i18n/locales";
import { getSavedUserLocale } from "../../../i18n/userLocale";

/** `getLocale` that tolerates a context without `locals` (unit tests). */
export function requestLocale(context: { locals?: App.Locals }): Locale {
  const value = context.locals?.locale;
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

/**
 * Save the visitor's language on an account that has none yet, so emails and
 * alerts follow it. Only non-English requests save by default (English is the
 * fallback anyway); pass `always` for brand-new accounts. Best effort: any
 * failure keeps the original session and never blocks sign-in.
 *
 * `client` is a fresh request-scoped auth client (never the shared
 * singleton); `session` is set on it first. Returns the session to store in
 * cookies (refreshed when the language was saved, so the access token carries
 * the new user_metadata).
 */
export async function saveLocaleIfMissing(
  client: Pick<SupabaseClient, "auth">,
  session: Session,
  user: Pick<User, "user_metadata"> | null | undefined,
  locale: Locale,
  options: { always?: boolean } = {},
): Promise<Session> {
  const account = user ?? session.user;
  if (getSavedUserLocale(account)) return session;
  if (locale === DEFAULT_LOCALE && !options.always) return session;
  try {
    const { data: current, error: sessionError } = await client.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    });
    if (sessionError || !current?.session) return session;
    const active = current.session;
    const { error } = await client.auth.updateUser({ data: { locale } });
    if (error) return active;
    const { data } = await client.auth.refreshSession({ refresh_token: active.refresh_token });
    return data?.session ?? active;
  } catch (error) {
    console.error("auth: could not save account language", error);
    return session;
  }
}
