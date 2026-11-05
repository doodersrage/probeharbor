/** Default post-auth destination for new accounts — connect a probe first. */
export const REGISTER_NEXT_DEVICES = "/dashboard/devices";

export type RegisterUrlOptions = {
  next?: string | null;
  ref?: string | null;
  /** Extra query params (e.g. email). */
  params?: Record<string, string | undefined | null>;
};

/** Build `/register?...` with a safe `next` (defaults to Devices). */
export function buildRegisterHref(options: RegisterUrlOptions = {}): string {
  const params = new URLSearchParams();
  const next = sanitizeRegisterNext(options.next) ?? REGISTER_NEXT_DEVICES;
  params.set("next", next);

  const ref = options.ref?.trim().toLowerCase();
  if (ref) params.set("ref", ref);

  for (const [key, value] of Object.entries(options.params ?? {})) {
    const trimmed = value?.trim();
    if (trimmed) params.set(key, trimmed);
  }

  return `/register?${params.toString()}`;
}

/** Same rules as sanitizeNextPath (siteUrl.ts): same-site paths only. */
export function sanitizeRegisterNext(next: string | null | undefined): string | null {
  if (!next) return null;
  const trimmed = next.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) return null;
  // Browsers read a backslash as a slash, so "/" + "\evil" acts like "//evil".
  // NUL has no place in a path either.
  if (trimmed.includes("\\") || trimmed.includes("\0")) return null;
  return trimmed;
}

/** Longest address RFC 5321 allows; anything longer is not worth echoing back. */
const MAX_EMAIL_LENGTH = 254;

/**
 * Where a failed sign-up goes: back to /register with the error code, keeping
 * what the visitor typed (email, never the password), the safe `next` and the
 * referral code, so a retry doesn't lose them.
 */
export function buildRegisterErrorHref(
  error: string,
  form: { email?: string | null; next?: string | null; ref?: string | null } = {},
): string {
  const email = form.email?.trim();
  return buildRegisterHref({
    next: form.next,
    ref: form.ref,
    params: {
      error,
      email: email && email.length <= MAX_EMAIL_LENGTH ? email : undefined,
    },
  });
}
