/**
 * Share-link storage, shared by /api/share/manage, the public
 * /api/share/[token]/readings endpoint and the Share page. Each function runs
 * the same query as the code it came from on Supabase, or the Neon version in
 * src/lib/db/shareLinks.ts when DB_BACKEND=neon. Callers keep their own
 * permission and plan checks.
 */
import { dbBackend } from "./db/client";
import * as neonShare from "./db/shareLinks";
import { createServerClient } from "./supabase";

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
  if (dbBackend() === "neon") {
    try {
      return { links: await neonShare.listShareLinks(householdId), error: null };
    } catch (error) {
      return { links: [], error: error instanceof Error ? error.message : String(error) };
    }
  }
  const { data, error } = await createServerClient()
    .from("share_links")
    .select("id, token, token_hash, token_preview, scope, label, expires_at, created_at")
    .eq("household_id", householdId)
    .order("created_at", { ascending: false });
  return { links: (data ?? []) as ShareLinkRow[], error: error?.message ?? null };
}

export async function deleteShareLink(householdId: string, id: string): Promise<void> {
  if (dbBackend() === "neon") return neonShare.deleteShareLink(householdId, id);
  await createServerClient().from("share_links").delete().eq("id", id).eq("household_id", householdId);
}

export async function findShareLink(householdId: string, id: string): Promise<{ id: string; scope: string } | null> {
  if (dbBackend() === "neon") return neonShare.findShareLink(householdId, id);
  const { data } = await createServerClient()
    .from("share_links")
    .select("id, scope")
    .eq("id", id)
    .eq("household_id", householdId)
    .maybeSingle();
  return (data as { id: string; scope: string } | null) ?? null;
}

export async function replaceShareLinkToken(
  householdId: string,
  id: string,
  fields: { token: null; token_hash: string; token_preview: string },
): Promise<{ error: string | null }> {
  if (dbBackend() === "neon") return neonShare.replaceShareLinkToken(householdId, id, fields);
  const { error } = await createServerClient()
    .from("share_links")
    .update(fields)
    .eq("id", id)
    .eq("household_id", householdId);
  return { error: error?.message ?? null };
}

export async function countLiveShareLinks(householdId: string): Promise<number> {
  if (dbBackend() === "neon") return neonShare.countLiveShareLinks(householdId).catch(() => 0);
  const { count } = await createServerClient()
    .from("share_links")
    .select("id", { count: "exact", head: true })
    .eq("household_id", householdId)
    .eq("scope", "live");
  return count ?? 0;
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
  if (dbBackend() === "neon") return neonShare.insertShareLink(row);
  const { error } = await createServerClient().from("share_links").insert(row);
  return { error: error?.message ?? null };
}

export type ResolvedShare = neonShare.ResolvedShare;

/**
 * The link for a public token: by hash, or (for links made before hashing)
 * by the raw token when `legacyRaw` is given. Null on no match or error.
 */
export async function resolveShareToken(tokenHash: string, legacyRaw: string | null): Promise<ResolvedShare | null> {
  if (dbBackend() === "neon") return neonShare.resolveShareToken(tokenHash, legacyRaw).catch(() => null);
  const supabase = createServerClient();
  const columns = "id, household_id, scope, label, expires_at";
  let { data, error } = await supabase.from("share_links").select(columns).eq("token_hash", tokenHash).maybeSingle();
  if (!data && legacyRaw) {
    ({ data, error } = await supabase
      .from("share_links")
      .select(columns)
      .eq("token", legacyRaw)
      .is("token_hash", null)
      .maybeSingle());
  }
  if (error || !data) return null;
  return data as ResolvedShare;
}
