/**
 * MFA gate for Better Auth sessions (DB_BACKEND=neon), used by middleware.
 *
 * TOTP: Better Auth only issues the session after the code on email/password
 * sign-in, so nothing to check here. OAuth sign-in (step 4d) must add its own
 * TOTP check before it ships.
 * YubiKey OTP: the app's own factor (public ids in user_metadata, a signed
 * step-up proof after /signin/mfa), so it gates here as it does for Supabase
 * sessions. Fails closed: enrolled and no valid proof → step up.
 *
 * Imports nothing that loads cloudflare:workers (middleware-safe).
 */
import { userHasYubiKeyOtpEnrolled } from "./yubikeyOtpMetadata";

export async function betterAuthNeedsStepUp(
  user: { id?: string; user_metadata?: Record<string, unknown> } | null | undefined,
  hasValidProof: (userId: string) => Promise<boolean>,
): Promise<boolean> {
  if (!userHasYubiKeyOtpEnrolled(user)) return false;
  if (!user?.id) return true;
  return !(await hasValidProof(user.id));
}
