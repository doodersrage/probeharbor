/**
 * Pairing codes: a short code typed into a probe instead of its long device
 * key (IMPLEMENTATION_LOG.md, "Pairing codes").
 *
 * 8 characters from an alphabet without look-alikes (no 0/O, 1/I/L), shown
 * as XXXX-XXXX; case, spaces and hyphens don't matter when typed. 31^8 ≈
 * 8.5 × 10^11 codes; each is single-use and lasts 30 minutes, and the claim
 * endpoint is rate-limited, so guessing a live one is not practical. Only the
 * SHA-256 of the normalised code is stored.
 */

export const PAIRING_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
export const PAIRING_CODE_LENGTH = 8;
export const PAIRING_TTL_MS = 30 * 60 * 1000;

/** A new random code, normalised (no hyphen). Rejection sampling keeps it uniform. */
export function generatePairingCode(): string {
  const n = PAIRING_ALPHABET.length;
  const limit = 256 - (256 % n);
  let out = "";
  while (out.length < PAIRING_CODE_LENGTH) {
    for (const b of crypto.getRandomValues(new Uint8Array(16))) {
      if (b < limit && out.length < PAIRING_CODE_LENGTH) out += PAIRING_ALPHABET[b % n];
    }
  }
  return out;
}

/** Shown to people: XXXX-XXXX. */
export function formatPairingCode(code: string): string {
  return `${code.slice(0, 4)}-${code.slice(4)}`;
}

/**
 * What someone typed, normalised, or null when it can't be a code (wrong
 * length or a character outside the alphabet). Device keys (48 hex
 * characters) are never codes.
 */
export function normalizePairingCode(input: string): string | null {
  const s = input.replace(/[\s-]/g, "").toUpperCase();
  if (s.length !== PAIRING_CODE_LENGTH) return null;
  for (const ch of s) if (!PAIRING_ALPHABET.includes(ch)) return null;
  return s;
}

export async function hashPairingCode(normalized: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(`pairing:${normalized}`),
  );
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** A new device key (as the devices API makes them): 24 random bytes, hex. */
export function generateDeviceKey(): string {
  return [...crypto.getRandomValues(new Uint8Array(24))]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
