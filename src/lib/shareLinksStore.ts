/**
 * Share-link storage, shared by /api/share/manage, the public
 * /api/share/[token]/readings endpoint and the Share page; the queries are in
 * src/lib/db/shareLinks.ts. Callers keep their own permission and plan checks.
 */
import * as neonShare from "./db/shareLinks";

export type ShareLinkRow = {
  id: string;
  token: string | null;
  token_hash: string | null;
  token_preview: string | null;
  scope: string;
  label: string | null;
  expires_at: string | null;
  created_at: string;
};

/** The household's links, newest first. */
export async function listShareLinks(householdId: string): Promise<{ links: ShareLinkRow[]; error: string | null }> {
  try {
    return { links: await neonShare.listShareLinks(householdId), error: null };
  } catch (error) {
    return { links: [], error: error instanceof Error ? error.message : String(error) };
  }
}

export async function deleteShareLink(householdId: string, id: string): Promise<void> {
  return neonShare.deleteShareLink(householdId, id);
}

export async function findShareLink(householdId: string, id: string): Promise<{ id: string; scope: string } | null> {
  return neonShare.findShareLink(householdId, id);
}

export async function replaceShareLinkToken(
  householdId: string,
  id: string,
  fields: { token: null; token_hash: string; token_preview: string },
): Promise<{ error: string | null }> {
  return neonShare.replaceShareLinkToken(householdId, id, fields);
}

export async function countLiveShareLinks(householdId: string): Promise<number> {
  return neonShare.countLiveShareLinks(householdId).catch(() => 0);
}

export async function insertShareLink(row: {
  token: null;
  token_hash: string;
  token_preview: string;
  household_id: string;
  scope: string;
  label: string | null;
  expires_at: string | null;
  created_by: string;
}): Promise<{ error: string | null }> {
  return neonShare.insertShareLink(row);
}

export type ResolvedShare = neonShare.ResolvedShare;

/** The link for a public token, by its hash. Null on no match or error. */
export async function resolveShareToken(tokenHash: string): Promise<ResolvedShare | null> {
  return neonShare.resolveShareToken(tokenHash).catch(() => null);
}
