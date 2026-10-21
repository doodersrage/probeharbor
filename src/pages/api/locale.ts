import type { APIRoute } from "astro";
import { isLocale, localizePath, splitLocalePath } from "../../i18n/locales";
import { isLocalizablePath } from "../../i18n/routes";
import { LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE } from "../../i18n/userLocale";
import { getAuthFromRequest, setAuthCookies } from "../../lib/auth";
import { formRedirectPath } from "../../lib/siteUrl";
import { createAuthClient } from "../../lib/supabase";

/**
 * Change the interface language. Form fields: `locale` (en, es, fr, de,
 * pt-br) and `redirect` (same-site path to return to). Saves it on the
 * account when signed in (dashboard, emails and alerts follow it) and in a
 * cookie either way. Marketing and sign-in paths come back with the new
 * locale prefix; dashboard paths stay as they are.
 */
export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const locale = formData.get("locale")?.toString();
  const target = formRedirectPath(formData, "/dashboard/settings");
  if (!isLocale(locale)) {
    return new Response(JSON.stringify({ error: "Unknown language" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: new URL(request.url).protocol === "https:",
    maxAge: LOCALE_COOKIE_MAX_AGE,
  });

  const { session, user } = await getAuthFromRequest(request, cookies);
  if (session && user && user.user_metadata?.locale !== locale) {
    const client = createAuthClient();
    const { error: sessionError } = await client.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    });
    if (!sessionError) {
      const { error } = await client.auth.updateUser({ data: { locale } });
      if (!error) {
        // The access token carries user_metadata; refresh so the next page sees the new language.
        const { data } = await client.auth.refreshSession({ refresh_token: session.refresh_token });
        if (data.session) {
          setAuthCookies(cookies, data.session.access_token, data.session.refresh_token);
        }
      }
    }
  }

  const cut = target.search(/[?#]/);
  const pathPart = cut === -1 ? target : target.slice(0, cut);
  const rest = cut === -1 ? "" : target.slice(cut);
  const { path } = splitLocalePath(pathPart);
  const next = isLocalizablePath(path) ? localizePath(path, locale) : path;
  return redirect(`${next}${rest}`, 303);
};
