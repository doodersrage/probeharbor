import { defineMiddleware } from "astro:middleware";
import {
  companionMfaHeaderValue,
  getAuthFromRequest,
} from "./lib/auth";
import { prefersJsonAuthError } from "./lib/authResponse";
import { pathRequiresAuth } from "./lib/routeAuth";
import {
  buildMfaChallengeUrl,
  getAalClaim,
  isMfaRequiredCookieSet,
  sessionNeedsMfaStepUp,
  setMfaRequiredCookie,
} from "./lib/mfa";
import { hasValidMfaStepUpProof } from "./lib/mfaStepUpProof";
import { recordServerError } from "./lib/serverErrors";
import {
  CANONICAL_HOST,
  shouldRedirectLegacyHost,
  trailingSlashRedirectPath,
} from "./lib/siteConfig";
import {
  HA_BLUEPRINT_LEGACY_URL,
  HA_BLUEPRINT_URL,
  HA_ENTITIES_LEGACY_URL,
  HA_ENTITIES_YAML,
} from "./lib/homeAssistantIntegration";
import { THERMALTRACE_STATIC_REDIRECTS } from "./lib/rebrand";
import type { AstroCookies } from "astro";
import { DEFAULT_LOCALE, LOCALE_META, localizePath, splitLocalePath } from "./i18n/locales";
import { ensureLocale } from "./i18n/catalog";
import { resolveRequestLocale, translationGroupsForPath } from "./i18n/requestLocale";
import { isLocalizablePath, localizeHtmlLinks } from "./i18n/routes";
import { LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE } from "./i18n/userLocale";

const LEGACY_STATIC_REDIRECTS: Record<string, string> = {
  [HA_BLUEPRINT_LEGACY_URL]: HA_BLUEPRINT_URL,
  [HA_ENTITIES_LEGACY_URL]: HA_ENTITIES_YAML,
  ...THERMALTRACE_STATIC_REDIRECTS,
};

function isMfaExemptPath(pathname: string): boolean {
  return (
    pathname === "/signin/mfa" ||
    pathname === "/api/auth/mfa-verify" ||
    pathname === "/api/auth/mfa-manage" ||
    pathname === "/api/auth/signout" ||
    pathname === "/api/auth/set-session" ||
    // Password recovery session is typically aal1; allow completing reset.
    pathname === "/api/auth/update-password" ||
    pathname === "/reset-password"
  );
}

/** Header "1" or cookie "1" force MFA. Never treat client header "0" as clearance. */
function isMfaRequired(request: Request, cookies: AstroCookies): boolean {
  if (companionMfaHeaderValue(request) === "1") return true;
  return isMfaRequiredCookieSet(cookies);
}

export const onRequest = defineMiddleware(async (context, next) => {
  const { hostname, protocol } = context.url;
  let { pathname } = context.url;

  if (shouldRedirectLegacyHost(hostname, context.request.method, pathname)) {
    const dest = new URL(context.url);
    dest.hostname = CANONICAL_HOST;
    dest.protocol = "https:";
    return context.redirect(dest.toString(), 301);
  }

  if (hostname === CANONICAL_HOST && protocol === "http:") {
    const dest = new URL(context.url);
    dest.protocol = "https:";
    return context.redirect(dest.toString(), 301);
  }

  const withoutSlash = trailingSlashRedirectPath(pathname, context.request.method);
  if (withoutSlash) {
    const dest = new URL(context.url);
    dest.pathname = withoutSlash;
    return context.redirect(dest.toString(), 301);
  }

  const legacyStatic = LEGACY_STATIC_REDIRECTS[pathname];
  if (legacyStatic) {
    return context.redirect(legacyStatic, 301);
  }

  // /es/pricing → render /pricing in Spanish. Untranslated paths go to English.
  const { locale: prefixLocale, path: unprefixedPath } = splitLocalePath(pathname);
  const localized = prefixLocale !== DEFAULT_LOCALE;
  if (localized) {
    if (!isLocalizablePath(unprefixedPath)) {
      return context.redirect(`${unprefixedPath}${context.url.search}`, 302);
    }
    pathname = unprefixedPath;
  }
  const cookieLocale = context.cookies.get(LOCALE_COOKIE)?.value;
  // Before auth: URL prefix, cookie or browser language. Signed-in routes
  // switch to the account language below once the user is known.
  let locale = resolveRequestLocale({
    path: pathname,
    prefixLocale,
    user: null,
    cookieLocale,
    acceptLanguage: context.request.headers.get("Accept-Language"),
  });
  context.locals.locale = locale;

  let userId: string | null = null;

  try {
    if (pathRequiresAuth(pathname)) {
      const { session, user } = await getAuthFromRequest(
        context.request,
        context.cookies,
      );

      if (!session) {
        if (pathname.startsWith("/api/") && prefersJsonAuthError(context.request)) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }
        return context.redirect(localizePath("/signin", locale));
      }

      userId = user?.id ?? null;
      locale = resolveRequestLocale({
        path: pathname,
        prefixLocale,
        user: user ?? null,
        cookieLocale,
        acceptLanguage: context.request.headers.get("Accept-Language"),
      });
      context.locals.locale = locale;

      context.locals.session = session;
      context.locals.user = user ?? null;

      if (
        user &&
        pathname.startsWith("/dashboard") &&
        !pathname.startsWith("/api/")
      ) {
        const { loadDashboardShellForUser } = await import("./lib/dashboardShell");
        context.locals.dashboardShell = await loadDashboardShellForUser(
          user,
          session,
          { includeLiveLag: true },
        );
      }

      if (!isMfaExemptPath(pathname)) {
        const aal = getAalClaim(session.access_token);
        let needsMfa = false;

        if (aal === "aal2") {
          setMfaRequiredCookie(context.cookies, false);
        } else {
          const hasStepUp =
            !!userId &&
            (await hasValidMfaStepUpProof(
              context.request,
              context.cookies,
              userId,
            ));

          if (hasStepUp) {
            needsMfa = false;
          } else if (isMfaRequired(context.request, context.cookies)) {
            needsMfa = true;
          } else if (aal === "aal1") {
            // Never trust cookie/header "0" alone for aal1 — always re-check.
            needsMfa = await sessionNeedsMfaStepUp(
              session.access_token,
              session.refresh_token,
              user,
            );
            setMfaRequiredCookie(context.cookies, needsMfa);
          }
        }

        if (needsMfa) {
          if (pathname.startsWith("/api/") && prefersJsonAuthError(context.request)) {
            return new Response(JSON.stringify({ error: "MFA required" }), {
              status: 401,
              headers: { "Content-Type": "application/json" },
            });
          }
          return context.redirect(buildMfaChallengeUrl(pathname));
        }
      }
    }

    await ensureLocale(locale, translationGroupsForPath(pathname));
    const response = localized ? await next(`${pathname}${context.url.search}`) : await next();
    const headers = new Headers(response.headers);
    if (!headers.has("X-Content-Type-Options")) {
      headers.set("X-Content-Type-Options", "nosniff");
    }
    if (!headers.has("Referrer-Policy")) {
      headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    }
    // /embed/* pages are read-only widgets meant for other sites' iframes
    // (freeze map, share-link readings); SAMEORIGIN silently broke every embed.
    const embeddable = pathname.startsWith("/embed/");
    if (!embeddable && !headers.has("X-Frame-Options")) {
      headers.set("X-Frame-Options", "SAMEORIGIN");
    }
    if (!headers.has("Permissions-Policy")) {
      // The public pipe freeze forecast offers "Use my location"; nothing else asks.
      const geolocation = pathname === "/pipe-freeze-forecast" ? "(self)" : "()";
      headers.set(
        "Permissions-Policy",
        `camera=(), microphone=(), geolocation=${geolocation}`,
      );
    }
    if (!headers.has("Content-Security-Policy-Report-Only")) {
      // Report-Only first: gather violations without breaking dashboard/analytics.
      headers.set(
        "Content-Security-Policy-Report-Only",
        [
          "default-src 'self'",
          "base-uri 'self'",
          "form-action 'self'",
          embeddable ? "frame-ancestors *" : "frame-ancestors 'self'",
          "object-src 'none'",
          "img-src 'self' data: blob: https:",
          "font-src 'self' data:",
          "style-src 'self' 'unsafe-inline'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://analytics.ahrefs.com https://challenges.cloudflare.com",
          "connect-src 'self' https: wss:",
          "frame-src 'self' https://challenges.cloudflare.com",
          "worker-src 'self' blob:",
        ].join("; "),
      );
    }
    // Page redirects (e.g. a missing story → /stories) keep the visitor's language.
    const translated = locale !== DEFAULT_LOCALE;
    const location = translated ? headers.get("Location") : null;
    if (location?.startsWith("/") && !location.startsWith("//")) {
      const cut = location.search(/[?#]/);
      const target = cut === -1 ? location : location.slice(0, cut);
      if (isLocalizablePath(target)) {
        headers.set("Location", `${localizePath(target, locale)}${cut === -1 ? "" : location.slice(cut)}`);
      }
    }
    const isHtml = headers.get("Content-Type")?.includes("text/html") ?? false;
    if (isHtml) {
      headers.set("Content-Language", LOCALE_META[locale].htmlLang);
      // Single-URL pages pick their language from the cookie/browser, so caches must key on them.
      if (!isLocalizablePath(pathname)) {
        for (const name of ["Cookie", "Accept-Language"]) {
          const vary = headers.get("Vary") ?? "";
          if (!vary.toLowerCase().split(/\s*,\s*/).includes(name.toLowerCase())) {
            headers.set("Vary", vary ? `${vary}, ${name}` : name);
          }
        }
      }
      // Remember the language of the last marketing/sign-in page viewed, so
      // the dashboard and emails can follow it before an account language is saved.
      if (isLocalizablePath(pathname) && cookieLocale !== locale && response.status === 200) {
        const secure = context.url.protocol === "https:" ? "; Secure" : "";
        headers.append(
          "Set-Cookie",
          `${LOCALE_COOKIE}=${locale}; Path=/; Max-Age=${LOCALE_COOKIE_MAX_AGE}; HttpOnly; SameSite=Lax${secure}`,
        );
      }
    }
    if (translated && isHtml) {
      const html = localizeHtmlLinks(await response.text(), locale);
      headers.delete("Content-Length");
      return new Response(html, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    }
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  } catch (error) {
    // Avoid recursive logging when serving the error page itself.
    if (pathname !== "/500") {
      await recordServerError({
        path: pathname,
        method: context.request.method,
        error,
        userId,
      });
    }

    if (pathname.startsWith("/api/")) {
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (pathname === "/500") {
      return new Response("Internal Server Error", { status: 500 });
    }

    try {
      return context.rewrite("/500");
    } catch {
      return new Response("Internal Server Error", { status: 500 });
    }
  }
});
