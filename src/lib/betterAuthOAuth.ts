/**
 * OAuth sign-in rules for Better Auth (step 4d of the move off Supabase).
 *
 * Linking, as decided 2026-11-07 ("keep today's rules"):
 * - Google and Discord join an existing account with the same email when
 *   both sides have a verified email (Better Auth's default; Supabase's
 *   rule today).
 * - GitHub never joins an existing account that isn't already linked to
 *   GitHub (the app's own GitHub flow refused this before the move).
 *
 * Two-factor: Better Auth only asks for the TOTP code on email/password
 * sign-in. `oauthTwoFactorPlugin` closes the gap: after an OAuth callback
 * for a user with two-factor on, it swaps the new session for the same
 * challenge the email sign-in uses (verification row + signed two_factor
 * cookie), so /signin/mfa finishes it.
 */
import type { BetterAuthPlugin } from "better-auth";
import { createAuthMiddleware } from "better-auth/api";
import { deleteSessionCookie } from "better-auth/cookies";
import { generateRandomString } from "better-auth/crypto";

/** Same lifetime as Better Auth's own two-factor challenge (10 minutes). */
const CHALLENGE_SECONDS = 600;

export type OAuthProviderId = "google" | "discord" | "github";

export function isOAuthCallbackPath(path: string | undefined): boolean {
  return !!path && path.startsWith("/callback/");
}

export function oauthTwoFactorPlugin(challengeUrl: string): BetterAuthPlugin {
  return {
    id: "probeharbor-oauth-two-factor",
    hooks: {
      after: [
        {
          matcher: (ctx) => isOAuthCallbackPath(ctx.path),
          handler: createAuthMiddleware(async (ctx) => {
            const created = ctx.context.newSession;
            if (!created?.user || !(created.user as { twoFactorEnabled?: boolean }).twoFactorEnabled) return;
            deleteSessionCookie(ctx, true);
            await ctx.context.internalAdapter.deleteSession(created.session.token);
            ctx.context.setNewSession(null);
            const identifier = `2fa-${generateRandomString(20)}`;
            const expiresAt = new Date(Date.now() + CHALLENGE_SECONDS * 1000);
            await ctx.context.internalAdapter.createVerificationValue({ value: created.user.id, identifier, expiresAt });
            await ctx.context.internalAdapter.createVerificationValue({
              value: "0",
              identifier: `2fa-attempts-${identifier}`,
              expiresAt,
            });
            const cookie = ctx.context.createAuthCookie("two_factor", { maxAge: CHALLENGE_SECONDS });
            await ctx.setSignedCookie(cookie.name, identifier, ctx.context.secret, cookie.attributes);
            throw ctx.redirect(challengeUrl);
          }),
        },
      ],
    },
  };
}

/**
 * `databaseHooks.account.create.before`: refuse to add a GitHub login to a
 * user who already has another way in (an implicit link by email). A brand
 * new GitHub user has no other accounts yet, so sign-up still works.
 */
export async function refuseGitHubImplicitLink(
  account: { providerId: string; userId: string },
  findAccounts: (userId: string) => Promise<Array<{ providerId: string }>>,
): Promise<boolean> {
  if (account.providerId !== "github") return true;
  const existing = await findAccounts(account.userId);
  return existing.length === 0;
}
