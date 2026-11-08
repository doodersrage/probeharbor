/**
 * MFA gate for Better Auth sessions, used by middleware.
 *
 * TOTP: Better Auth only issues the session after the code on email/password
 * sign-in, so nothing to check here; OAuth sign-in gets the same challenge
 * from oauthTwoFactorPlugin (betterAuthOAuth.ts).
 * YubiKey OTP: the app's own factor (public ids in user_metadata, a signed
 * step-up proof after /signin/mfa), so it gates here.
 * Fails closed: enrolled and no valid proof → step up.
 *
 * Imports nothing that loads cloudflare:workers (middleware-safe).
 */
import { userHasYubiKeyOtpEnrolled } from "./yubikeyOtpMetadata";

export async function betterAuthNeedsStepUp(
  user: { id?: string; user_metadata?: Record<string, unknown>; two_factor_enabled?: boolean } | null | undefined,
  hasValidProof: (userId: string) => Promise<boolean>,
): Promise<boolean> {
  if (!userHasYubiKeyOtpEnrolled(user)) return false;
  // TOTP on: this session only exists after the code (or a YubiKey) finished
  // the challenge. Passing either factor is enough.
  if (user?.two_factor_enabled === true) return false;
  if (!user?.id) return true;
  return !(await hasValidProof(user.id));
}
