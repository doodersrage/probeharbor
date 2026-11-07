import type { SignInErrorCode } from "./signInErrors";

/**
 * Glue between Better Auth's `asResponse: true` results and the app's
 * form routes: keep the routes' own redirects and messages, but carry the
 * session cookies Better Auth set (or cleared).
 */

/** A 302 to `location` carrying every Set-Cookie from Better Auth's response. */
export function redirectWithAuthCookies(location: string, from: Response): Response {
  const headers = new Headers({ Location: location });
  for (const cookie of from.headers.getSetCookie()) headers.append("Set-Cookie", cookie);
  return new Response(null, { status: 302, headers });
}

/** Better Auth's error code from a failed response (`INVALID_EMAIL_OR_PASSWORD`, ...), or null. */
export async function betterAuthErrorCode(res: Response): Promise<string | null> {
  if (res.ok) return null;
  try {
    const body = (await res.clone().json()) as { code?: unknown };
    return typeof body.code === "string" ? body.code : "UNKNOWN";
  } catch {
    return "UNKNOWN";
  }
}

/** Better Auth codes → the sign-in page's existing error codes (see mapSignInError). */
export function signInErrorFromBetterAuth(code: string | null): SignInErrorCode {
  if (code === "EMAIL_NOT_VERIFIED") return "email_not_confirmed";
  if (code === "INVALID_EMAIL_OR_PASSWORD" || code === "INVALID_PASSWORD" || code === "USER_NOT_FOUND") return "invalid_credentials";
  return "generic";
}

/** Set-Cookie values that expire Better Auth's session cookies (both names). */
export function expiredBetterAuthCookies(): string[] {
  return ["__Secure-better-auth.session_token", "better-auth.session_token"].map(
    (name) => `${name}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax${name.startsWith("__Secure-") ? "; Secure" : ""}`,
  );
}
