/**
 * Better Auth on Workers, for DB_BACKEND=neon. A database pool can't be
 * shared between requests on Workers, so each call opens a Neon pool
 * (WebSocket, pg-compatible), builds the auth instance, runs, and closes the
 * pool before returning.
 *
 * Imports cloudflare:workers (via runtimeEnv): load it with a dynamic
 * import from anything the middleware or a prerendered page imports.
 */
import { Pool } from "@neondatabase/serverless";
import type { Locale } from "../i18n/locales";
import { accountEmailLink, sendConfirmationEmail, sendPasswordResetEmail } from "./accountEmails";
import { createBetterAuth, type ProbeHarborAuth } from "./betterAuthConfig";
import { getRuntimeEnv } from "./runtimeEnv";
import { buildGitHubOAuthCallbackUrl, buildSiteUrl } from "./siteUrl";
import type { OAuthProviderId } from "./betterAuthOAuth";
import type { YubiKeyVerifier } from "./betterAuthYubiKey";
import { getYubiKeyPublicIdsFromUser, isYubiKeyOtpConfigured, verifyYubiKeyOtpWithYubiCloud } from "./yubikeyOtp";
import { getUserMetadata } from "./db/userMetadata";

/** YubiCloud check against the user's enrolled keys (user_profiles.metadata). */
const verifyYubiKey: YubiKeyVerifier = async (userId, otp) => {
  const enrolled = getYubiKeyPublicIdsFromUser({ user_metadata: await getUserMetadata(userId) });
  if (enrolled.length === 0) return "not_enrolled";
  const verified = await verifyYubiKeyOtpWithYubiCloud(otp);
  if (!verified.ok) return verified.error.includes("already used") ? "replayed" : "invalid";
  return enrolled.includes(verified.publicId) ? "ok" : "not_enrolled";
};
import { resolveWebAuthnRp } from "./webauthnRp";

export type WithBetterAuthOptions = {
  /** Language for emails sent during this call (sign-up, resend, password reset). Default English. */
  emailLocale?: Locale;
};

/**
 * OAuth apps whose credentials are set. Each returns to an app route:
 * GitHub to the existing /api/auth/github/callback (its OAuth app setting is
 * unchanged); Google and Discord to /api/auth/callback/<provider> (they
 * pointed at Supabase before, so those consoles need the new URL added).
 */
function oauthApps(request: Request | undefined, siteUrl: string) {
  const app = (id: OAuthProviderId, prefix: string, redirectURI: string) => {
    const clientId = getRuntimeEnv(`${prefix}_CLIENT_ID`);
    const clientSecret = getRuntimeEnv(`${prefix}_CLIENT_SECRET`);
    return clientId && clientSecret ? { [id]: { clientId, clientSecret, redirectURI } } : {};
  };
  return {
    ...app("google", "GOOGLE", `${siteUrl}/api/auth/callback/google`),
    ...app("discord", "DISCORD", `${siteUrl}/api/auth/callback/discord`),
    ...app("github", "GITHUB", request ? buildGitHubOAuthCallbackUrl(request) : `${siteUrl}/api/auth/github/callback`),
  };
}

export async function withBetterAuth<T>(
  request: Request | undefined,
  run: (auth: ProbeHarborAuth) => Promise<T>,
  options: WithBetterAuthOptions = {},
): Promise<T> {
  const url = getRuntimeEnv("DATABASE_URL");
  const secret = getRuntimeEnv("BETTER_AUTH_SECRET");
  if (!url || !secret) throw new Error("Better Auth needs DATABASE_URL and BETTER_AUTH_SECRET.");
  const pool = new Pool({ connectionString: url, max: 2 });
  try {
    const siteUrl = buildSiteUrl(request);
    const auth = createBetterAuth({
      database: pool,
      secret,
      baseURL: siteUrl,
      rpID: resolveWebAuthnRp(request).rpId,
      secureCookies: import.meta.env.PROD,
      oauth: oauthApps(request, siteUrl),
      verifyYubiKey: isYubiKeyOtpConfigured() ? verifyYubiKey : undefined,
      sendVerificationEmail: ({ email, token }) =>
        sendConfirmationEmail(email, accountEmailLink(siteUrl, "signup", token), options.emailLocale ?? "en"),
      sendResetPassword: ({ email, token }) =>
        sendPasswordResetEmail(email, accountEmailLink(siteUrl, "recovery", token), options.emailLocale ?? "en"),
    });
    return await run(auth);
  } finally {
    await pool.end().catch(() => {});
  }
}

/**
 * Hand a provider's return trip (…?code=&state=) to Better Auth's callback
 * handler without exposing its HTTP endpoints. Its response (a redirect with
 * the session cookie, the two-factor challenge, or the error page) is
 * returned as is.
 */
export function forwardOAuthCallback(request: Request, provider: OAuthProviderId): Promise<Response> {
  return withBetterAuth(request, (auth) => {
    const incoming = new URL(request.url);
    const target = new URL(`/api/better-auth/callback/${provider}${incoming.search}`, buildSiteUrl(request));
    return auth.handler(new Request(target, { method: "GET", headers: request.headers }));
  });
}
