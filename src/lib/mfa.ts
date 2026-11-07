import type { AstroCookies } from "astro";
import { sanitizeNextPath } from "./siteUrl";

/**
 * Small two-factor helpers shared by the sign-in pages and routes. The rules
 * themselves live in betterAuthMfa.ts / betterAuthMfaGate.ts.
 */
export const MFA_REQUIRED_COOKIE = "sb-mfa-required";

/** Hint cookie for the sign-in pages ("1": a second factor is still needed). Never trusted as clearance. */
export function setMfaRequiredCookie(cookies: AstroCookies, required: boolean | "clear"): void {
  if (required === "clear") {
    cookies.delete(MFA_REQUIRED_COOKIE, { path: "/" });
    return;
  }
  cookies.set(MFA_REQUIRED_COOKIE, required ? "1" : "0", {
    path: "/",
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: "lax",
    maxAge: required ? 60 * 15 : 60 * 60 * 24,
  });
}

export function buildMfaChallengeUrl(next?: string | null): string {
  const safeNext = sanitizeNextPath(next ?? undefined);
  if (!safeNext || safeNext === "/dashboard") return "/signin/mfa";
  return `/signin/mfa?next=${encodeURIComponent(safeNext)}`;
}
