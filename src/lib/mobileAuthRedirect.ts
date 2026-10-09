import type { AstroCookies } from "astro";
import { resolveConfiguredSiteUrl } from "./siteConfig";
import {
  ANDROID_APP_IDS,
  createMobileExchangeToken,
  resolveAndroidAppId,
  type AndroidAppId,
  MOBILE_OAUTH_COOKIE,
  MOBILE_OAUTH_HOST,
  MOBILE_OAUTH_HTTPS_PATH,
} from "./mobileAuthExchange";

/**
 * Mark a native-app OAuth round trip. The value is the Android app ID when the
 * app sent one, else "1" (legacy Android installs and desktop companions).
 */
export function setMobileOAuthCookie(cookies: AstroCookies, appId?: string | null): void {
  const value = (ANDROID_APP_IDS as readonly string[]).includes(appId?.trim() ?? "")
    ? appId!.trim()
    : "1";
  cookies.set(MOBILE_OAUTH_COOKIE, value, {
    path: "/",
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: "lax",
    maxAge: 60 * 15,
  });
}

export function hasMobileOAuthCookie(cookies: AstroCookies): boolean {
  const value = cookies.get(MOBILE_OAUTH_COOKIE)?.value;
  return value === "1" || (ANDROID_APP_IDS as readonly string[]).includes(value ?? "");
}

/** Android app that started the round trip, or null when it didn't say. */
function mobileOAuthAppId(cookies: AstroCookies): AndroidAppId | null {
  const value = cookies.get(MOBILE_OAUTH_COOKIE)?.value;
  return value && value !== "1" ? resolveAndroidAppId(value) : null;
}

export function consumeMobileOAuthCookie(cookies: AstroCookies): boolean {
  const value = hasMobileOAuthCookie(cookies);
  cookies.delete(MOBILE_OAUTH_COOKIE, { path: "/" });
  return value;
}

export function buildMobileOAuthCustomUrl(
  exchange: string,
  appId: AndroidAppId = resolveAndroidAppId(null),
): string {
  return `${appId}://${MOBILE_OAUTH_HOST}?exchange=${encodeURIComponent(exchange)}`;
}

export function buildMobileOAuthHttpsUrl(
  exchange: string,
  siteUrl?: string | URL | null,
  appId?: AndroidAppId | null,
): string {
  const origin = resolveConfiguredSiteUrl(siteUrl);
  const app = appId ? `&app=${encodeURIComponent(appId)}` : "";
  return `${origin}${MOBILE_OAUTH_HTTPS_PATH}?exchange=${encodeURIComponent(exchange)}${app}`;
}

/** Chrome-friendly intent URI; user taps or JS navigates here after YubiKey/WebAuthn. */
export function buildMobileOAuthIntentUrl(
  exchange: string,
  appId: AndroidAppId = resolveAndroidAppId(null),
): string {
  const encoded = encodeURIComponent(exchange);
  return `intent://${MOBILE_OAUTH_HOST}?exchange=${encoded}#Intent;scheme=${appId};package=${appId};end`;
}

/**
 * Hand tokens back to the Android app via HTTPS `/app/oauth` (Chrome blocks
 * custom-scheme 302s after Google / security-key flows).
 */
export async function redirectMobileOAuthComplete(
  accessToken: string,
  refreshToken: string,
  siteUrl?: string | URL | null,
  appId?: AndroidAppId | null,
): Promise<Response | null> {
  const exchange = await createMobileExchangeToken(accessToken, refreshToken);
  if (!exchange) return null;

  return new Response(null, {
    status: 302,
    headers: {
      Location: buildMobileOAuthHttpsUrl(exchange, siteUrl, appId),
      "Cache-Control": "no-store",
    },
  });
}

/**
 * If this request is part of a native-app OAuth round trip, finish by sending
 * the session back to the app. Consumes the mobile cookie only on success so a
 * failed exchange can still recover via web MFA → app return.
 */
export async function maybeRedirectMobileOAuth(
  cookies: AstroCookies,
  accessToken: string,
  refreshToken: string,
  siteUrl?: string | URL | null,
): Promise<Response | null> {
  if (!hasMobileOAuthCookie(cookies)) return null;
  const redirect = await redirectMobileOAuthComplete(
    accessToken,
    refreshToken,
    siteUrl,
    mobileOAuthAppId(cookies),
  );
  if (!redirect) return null;
  consumeMobileOAuthCookie(cookies);
  return redirect;
}
