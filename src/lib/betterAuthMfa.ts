/**
 * Two-factor state and rules on Better Auth, used by
 * /api/auth/mfa-manage, /api/auth/mfa-verify and /signin/mfa.
 *
 * "Elevated" (Supabase called it aal2): a Better Auth session for a user with
 * TOTP on only exists after the code was checked (email, OAuth and reset
 * sign-in all enforce it), so such a session counts; otherwise a valid
 * YubiKey step-up proof does. Same uses as before: adding a second factor,
 * removing one.
 *
 * Turning TOTP on or off also asks for the account password when the
 * account has one (decided 2026-11-07); accounts without one (OAuth-only)
 * skip it.
 */
import type { AstroCookies } from "astro";
import { query } from "./db/client";
import { hasValidMfaStepUpProof } from "./mfaStepUpProof";

export type TotpState = {
  /** TOTP is on (the code was confirmed). */
  enabled: boolean;
  /** Set up but not confirmed yet. */
  pending: boolean;
  /** The account has a password, so changing TOTP asks for it. */
  hasPassword: boolean;
};

export async function getTotpState(userId: string): Promise<TotpState> {
  const [row] = await query<{ enabled: boolean | null; has_row: boolean; has_password: boolean }>(
    `select u."twoFactorEnabled" as enabled,
            exists(select 1 from public.auth_two_factors t where t."userId" = u.id) as has_row,
            exists(select 1 from public.auth_accounts a
                   where a."userId" = u.id and a."providerId" = 'credential' and a.password is not null) as has_password
     from public.auth_users u where u.id = $1`,
    [userId],
  );
  const enabled = row?.enabled === true;
  return { enabled, pending: !enabled && row?.has_row === true, hasPassword: row?.has_password === true };
}

export async function isElevated(
  state: TotpState,
  request: Request,
  cookies: AstroCookies,
  userId: string,
): Promise<boolean> {
  if (state.enabled) return true;
  return hasValidMfaStepUpProof(request, cookies, userId);
}

/** The factor list the settings screen shows: one authenticator app at most. */
export function totpFactors(state: TotpState): Array<{ id: string; friendly_name: null; status: string }> {
  if (state.enabled) return [{ id: "totp", friendly_name: null, status: "verified" }];
  if (state.pending) return [{ id: "totp", friendly_name: null, status: "unverified" }];
  return [];
}

/** Better Auth's pending two-factor challenge cookie (set after the password or OAuth step). */
export function hasTwoFactorChallenge(cookies: Pick<AstroCookies, "get">): boolean {
  return ["__Secure-better-auth.two_factor", "better-auth.two_factor"].some((name) => !!cookies.get(name)?.value);
}

/** A JSON response that also carries Better Auth's Set-Cookie headers (session refreshes). */
export function jsonWithAuthCookies(body: unknown, status: number, from?: Response): Response {
  const headers = new Headers({ "Content-Type": "application/json" });
  for (const cookie of from?.headers.getSetCookie() ?? []) headers.append("Set-Cookie", cookie);
  return new Response(JSON.stringify(body), { status, headers });
}
