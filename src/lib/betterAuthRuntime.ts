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
import { buildSiteUrl } from "./siteUrl";
import { resolveWebAuthnRp } from "./webauthnRp";

export type WithBetterAuthOptions = {
  /** Language for emails sent during this call (sign-up, resend, password reset). Default English. */
  emailLocale?: Locale;
};

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
