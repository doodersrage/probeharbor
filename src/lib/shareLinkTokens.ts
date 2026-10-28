/**
 * Share-link tokens (`/share/<token>`, `/embed/<token>`,
 * `/api/share/<token>/readings`). Only a SHA-256 hash and the last 4
 * characters are stored (migration 20261028150000), so a new link is shown
 * once and "Regenerate" replaces it. Links created earlier still have their
 * raw `token` until a later cleanup clears it.
 */

/** Old links are 48 hex characters; only that shape is ever matched raw. */
export const LEGACY_RAW_SHARE_TOKEN = /^[0-9a-f]{48}$/;

export function randomShareToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Columns to store for a new or regenerated link. Never includes the token. */
export async function storedShareTokenFields(
  token: string,
): Promise<{ token: null; token_hash: string; token_preview: string }> {
  return { token: null, token_hash: await sha256Hex(token), token_preview: token.slice(-4) };
}
