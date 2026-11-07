/**
 * Better Auth for ProbeHarbor (step 4 of the move off Supabase).
 *
 * A factory, not a singleton: on Workers a database pool can't be shared
 * between requests, so the caller builds one instance per request with its
 * own pool. Tests pass a pool to a local Postgres. Nothing here imports
 * `cloudflare:workers`, so the middleware and prerendered pages can load it.
 *
 * Table names, the uuid ids and the plugin list must stay in step with
 * db/tools/better-auth-schema.mjs, which generated the auth_* tables in
 * db/migrations/0001_baseline.sql.
 *
 * Not yet used by any route: sign-in still goes through Supabase. Routes
 * move over in later parts of step 4.
 */
import { passkey } from "@better-auth/passkey";
import bcrypt from "bcryptjs";
import { betterAuth } from "better-auth";
import { hashPassword, verifyPassword } from "better-auth/crypto";
import { bearer, twoFactor } from "better-auth/plugins";
import { type OAuthProviderId, oauthTwoFactorPlugin, refuseGitHubImplicitLink } from "./betterAuthOAuth";
import { type YubiKeyVerifier, yubikeyTwoFactorPlugin } from "./betterAuthYubiKey";

/** Same rule as the Supabase sign-up and reset forms today. */
export const MIN_PASSWORD_LENGTH = 8;

const BCRYPT_PREFIX = /^\$2[aby]\$\d{2}\$/;

/**
 * Passwords copied from Supabase are bcrypt hashes ($2a$10$...); new and
 * changed passwords use Better Auth's default (scrypt). Accept both, so
 * existing passwords keep working after the move.
 */
export async function verifyStoredPassword({ hash, password }: { hash: string; password: string }): Promise<boolean> {
  if (BCRYPT_PREFIX.test(hash)) return bcrypt.compare(password, hash);
  return verifyPassword({ hash, password });
}

export type AuthEmail = { email: string; url: string; token: string };

export type BetterAuthDeps = {
  /** A pg-compatible Pool (pg locally, @neondatabase/serverless Pool on Workers). */
  database: unknown;
  /** BETTER_AUTH_SECRET: signs sessions and encrypts TOTP secrets. */
  secret: string;
  /** Public site origin, e.g. https://probeharbor.dev */
  baseURL: string;
  /** WebAuthn relying party (see webauthnRp.ts). */
  rpID: string;
  sendVerificationEmail: (email: AuthEmail) => Promise<void>;
  sendResetPassword: (email: AuthEmail) => Promise<void>;
  /**
   * "__Secure-" cookie names and the Secure flag. Fixed per deployment, not
   * guessed from baseURL: a call without a request falls back to the
   * configured site URL, which can differ in scheme from the request's.
   */
  secureCookies?: boolean;
  /**
   * OAuth apps with credentials set. Each provider returns to the app's
   * existing callback path (see `redirectURI`), not Better Auth's own.
   */
  oauth?: Partial<Record<OAuthProviderId, { clientId: string; clientSecret: string; redirectURI: string }>>;
  /** YubiKey OTP check for finishing the two-factor challenge (unset when YubiCloud isn't configured). */
  verifyYubiKey?: YubiKeyVerifier;
};

/** Where the two-factor challenge lives (also after OAuth). */
export const MFA_CHALLENGE_PATH = "/signin/mfa";

export function createBetterAuth(deps: BetterAuthDeps) {
  return betterAuth({
    database: deps.database as Parameters<typeof betterAuth>[0]["database"],
    secret: deps.secret,
    baseURL: deps.baseURL,
    basePath: "/api/better-auth",
    appName: "ProbeHarbor",
    telemetry: { enabled: false },
    // Info lines include email addresses (e.g. sign-up attempts for an existing address).
    logger: { level: "warn" },
    user: { modelName: "auth_users" },
    session: { modelName: "auth_sessions" },
    account: { modelName: "auth_accounts" },
    verification: { modelName: "auth_verifications" },
    advanced: { database: { generateId: "uuid" }, useSecureCookies: deps.secureCookies ?? false },
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      minPasswordLength: MIN_PASSWORD_LENGTH,
      password: { hash: hashPassword, verify: verifyStoredPassword },
      sendResetPassword: async ({ user, url, token }) => deps.sendResetPassword({ email: user.email, url, token }),
      revokeSessionsOnPasswordReset: true,
    },
    emailVerification: {
      sendOnSignUp: true,
      // As with Supabase: following the confirmation link signs the user in.
      autoSignInAfterVerification: true,
      sendVerificationEmail: async ({ user, url, token }) => deps.sendVerificationEmail({ email: user.email, url, token }),
    },
    socialProviders: {
      ...(deps.oauth?.google ? { google: { ...deps.oauth.google, prompt: "select_account" as const } } : {}),
      ...(deps.oauth?.discord ? { discord: deps.oauth.discord } : {}),
      // Same scopes as before, so accounts with a private email still work.
      ...(deps.oauth?.github ? { github: { ...deps.oauth.github, scope: ["read:user", "user:email"] } } : {}),
    },
    databaseHooks: {
      account: {
        create: {
          before: async (account, ctx) => {
            if (!ctx) return;
            const allowed = await refuseGitHubImplicitLink(account, (userId) => ctx.context.internalAdapter.findAccounts(userId));
            return allowed ? undefined : false;
          },
        },
      },
    },
    plugins: [
      oauthTwoFactorPlugin(MFA_CHALLENGE_PATH),
      yubikeyTwoFactorPlugin(deps.verifyYubiKey),
      twoFactor({
        issuer: "ProbeHarbor",
        // Accounts without a password (OAuth-only) can turn TOTP on and off;
        // Better Auth still asks for the password whenever the account has one.
        allowPasswordless: true,
        schema: { twoFactor: { modelName: "auth_two_factors" } },
      }),
      passkey({ rpID: deps.rpID, rpName: "ProbeHarbor", origin: deps.baseURL, schema: { passkey: { modelName: "auth_passkeys" } } }),
      bearer(),
    ],
  });
}

export type ProbeHarborAuth = ReturnType<typeof createBetterAuth>;
