import { type ApiKeyScope, parseApiKeyScope } from "./apiKeyScope";
import * as neonAccess from "./db/access";

export type { ApiKeyScope } from "./apiKeyScope";

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value),
  );
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function randomApiKey(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return `gtm_${[...bytes].map((b) => b.toString(16).padStart(2, "0")).join("")}`;
}

export type ApiKeyRow = {
  id: string;
  household_id: string;
  name: string;
  key_prefix: string;
  /** "read" (metrics, device list) or "write" (also changes devices and setup). */
  scope: ApiKeyScope;
  created_at: string;
  last_used_at: string | null;
  revoked_at: string | null;
};

export async function listHouseholdApiKeys(
  householdId: string,
): Promise<ApiKeyRow[]> {
  return neonAccess.listApiKeys(householdId);
}

export async function createHouseholdApiKey(input: {
  householdId: string;
  name: string;
  createdBy: string;
  /** Defaults to read-only. */
  scope?: ApiKeyScope;
}): Promise<{ plaintext: string | null; key: ApiKeyRow | null; error: string | null }> {
  const plaintext = randomApiKey();
  const key_hash = await sha256Hex(plaintext);
  const key_prefix = plaintext.slice(0, 10);
  const created = await neonAccess.insertApiKey({
    householdId: input.householdId,
    name: input.name.trim() || "Metrics key",
    keyPrefix: key_prefix,
    keyHash: key_hash,
    createdBy: input.createdBy,
    scope: parseApiKeyScope(input.scope),
  });
  return created.key ? { plaintext, key: created.key, error: null } : { plaintext: null, key: null, error: created.error };
}

export async function revokeHouseholdApiKey(
  householdId: string,
  keyId: string,
): Promise<{ error: string | null }> {
  return neonAccess.revokeApiKey(householdId, keyId);
}

export async function resolveApiKey(
  bearer: string,
): Promise<{ householdId: string; keyId: string; scope: ApiKeyScope } | null> {
  const token = bearer.trim();
  if (!token.startsWith("gtm_")) return null;
  const key_hash = await sha256Hex(token);
  return neonAccess.resolveApiKey(key_hash);
}
