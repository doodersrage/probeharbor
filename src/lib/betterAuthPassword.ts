/**
 * Password changes on Better Auth (DB_BACKEND=neon) that keep today's
 * Supabase behavior.
 *
 * - The emailed reset token is kept in an httpOnly cookie between the link
 *   (/api/auth/confirm) and the form (/api/auth/update-password), so it
 *   doesn't sit in the address bar or browser history.
 * - A signed-in user changes the password without the current one
 *   (Supabase: secure_password_change = false). Accounts without a password
 *   yet (OAuth sign-up) get one, as Supabase's updateUser did.
 */
import type { AstroCookies } from "astro";
import type { ProbeHarborAuth } from "./betterAuthConfig";

export const RESET_TOKEN_COOKIE = "ph_reset_token";
/** Same lifetime as the reset link (Better Auth's default, Supabase's otp_expiry). */
const RESET_TOKEN_MAX_AGE = 60 * 60;

export function setResetTokenCookie(cookies: AstroCookies, token: string): void {
  cookies.set(RESET_TOKEN_COOKIE, token, {
    path: "/",
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: "lax",
    maxAge: RESET_TOKEN_MAX_AGE,
  });
}

export function clearResetTokenCookie(cookies: AstroCookies): void {
  cookies.delete(RESET_TOKEN_COOKIE, { path: "/" });
}

/** The user a reset token belongs to, or null when unknown or expired. Doesn't use it up. */
export async function resetTokenUserId(auth: ProbeHarborAuth, token: string): Promise<string | null> {
  if (!token) return null;
  const ctx = await auth.$context;
  const found = await ctx.internalAdapter.findVerificationValue(`reset-password:${token}`);
  return found && new Date(found.expiresAt) > new Date() ? found.value : null;
}

/** Signed-in password change: no current password, creates one if the account has none. */
export async function setPasswordForUser(auth: ProbeHarborAuth, userId: string, newPassword: string): Promise<void> {
  const ctx = await auth.$context;
  const hash = await ctx.password.hash(newPassword);
  if (await ctx.internalAdapter.findCredentialAccount(userId)) {
    await ctx.internalAdapter.updatePassword(userId, hash);
  } else {
    await ctx.internalAdapter.createAccount({ userId, providerId: "credential", accountId: userId, password: hash });
  }
}

/** Following a reset link proves the inbox is theirs (Supabase's recovery confirmed it too). */
export async function markEmailVerified(auth: ProbeHarborAuth, userId: string): Promise<void> {
  const ctx = await auth.$context;
  await ctx.internalAdapter.updateUser(userId, { emailVerified: true });
}
