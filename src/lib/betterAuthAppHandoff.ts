/**
 * Sign-in for the native apps (desktop, Bay Buddy, Android) on Better Auth
 * (DB_BACKEND=neon; step 4f). The browser part is unchanged: the app opens
 * /api/auth/companion/start or /api/auth/mobile/start, the user signs in on
 * the web, and the app gets a one-time exchange token it swaps at
 * /api/auth/mobile/exchange for { access_token, refresh_token }.
 *
 * With Better Auth, both are the same value: a session token of the app's
 * own (not the browser's), sent back as `Authorization: Bearer`. The desktop
 * apps already do exactly that and never refresh, so they need no update.
 * The session lasts like a web session (Better Auth's default, extended
 * while used); signing out of the browser doesn't end it, "sign out
 * everywhere" does.
 */
import { withBetterAuth } from "./betterAuthRuntime";
import { redirectWithAuthCookies } from "./betterAuthResponse";
import type { OAuthProviderId } from "./betterAuthOAuth";

/** A new session for this user, for an app; returns its bearer token. */
export async function createAppSessionToken(request: Request, userId: string): Promise<string> {
  return withBetterAuth(request, async (auth) => {
    const ctx = await auth.$context;
    const session = await ctx.internalAdapter.createSession(userId);
    if (!session?.token) throw new Error("Could not create an app session");
    return session.token;
  });
}

/**
 * Start Google / Discord / GitHub sign-in on Better Auth: a redirect to the
 * provider carrying Better Auth's state cookie, or null when it can't start
 * (provider not configured). Provider returns to the app's callback routes,
 * then /api/auth/oauth-done.
 */
export async function startBetterAuthOAuth(request: Request, provider: OAuthProviderId): Promise<Response | null> {
  const res = await withBetterAuth(request, (auth) =>
    auth.api.signInSocial({
      body: {
        provider,
        callbackURL: "/api/auth/oauth-done",
        newUserCallbackURL: "/api/auth/oauth-done?new=1",
        errorCallbackURL: "/api/auth/oauth-done",
      },
      asResponse: true,
    }),
  ).catch((error: unknown) => {
    console.error(`OAuth sign-in start failed (${provider}):`, error instanceof Error ? error.message : error);
    return null;
  });
  const started = res?.ok ? ((await res.clone().json()) as { url?: string }) : null;
  if (!res || !started?.url) return null;
  return redirectWithAuthCookies(started.url, res);
}
