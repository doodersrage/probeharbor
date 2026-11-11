/**
 * Neon versions of the share-link and chart-share queries (via
 * src/lib/shareLinksStore.ts and src/lib/chartShare.ts). Share links give read access to one household,
 * so every change names that household; lookups by token are by hash.
 */
import type { ShareLinkRow } from "../shareLinksStore";
import { query } from "./client";

const message = (error: unknown) => (error instanceof Error ? error.message : String(error));
const LINK_COLUMNS = "id, token, token_hash, token_preview, scope, label, expires_at, created_at";

/** Throws on failure. */
export function listShareLinks(householdId: string): Promise<ShareLinkRow[]> {
  return query<ShareLinkRow>(
    `select ${LINK_COLUMNS} from public.share_links where household_id = $1 order by created_at desc, id`,
    [householdId],
  );
}

export async function deleteShareLink(householdId: string, id: string): Promise<void> {
  try {
    await query("delete from public.share_links where id = $1 and household_id = $2", [id, householdId]);
  } catch (error) {
    console.error("Failed to revoke share link:", message(error));
  }
}

export async function findShareLink(householdId: string, id: string): Promise<{ id: string; scope: string } | null> {
  try {
    const [row] = await query<{ id: string; scope: string }>(
      "select id, scope from public.share_links where id = $1 and household_id = $2",
      [id, householdId],
    );
    return row ?? null;
  } catch {
    return null;
  }
}

export async function replaceShareLinkToken(
  householdId: string,
  id: string,
  fields: { token: null; token_hash: string; token_preview: string },
): Promise<{ error: string | null }> {
  try {
    const rows = await query(
      `update public.share_links set token = null, token_hash = $3, token_preview = $4
       where id = $1 and household_id = $2 returning id`,
      [id, householdId, fields.token_hash, fields.token_preview],
    );
    return rows.length > 0 ? { error: null } : { error: "Share link not found" };
  } catch (error) {
    return { error: message(error) };
  }
}

export async function countLiveShareLinks(householdId: string): Promise<number> {
  const [row] = await query<{ n: number }>(
    "select count(*) as n from public.share_links where household_id = $1 and scope = 'live'",
    [householdId],
  );
  return row?.n ?? 0;
}

export async function insertShareLink(row: {
  token_hash: string;
  token_preview: string;
  household_id: string;
  scope: string;
  label: string | null;
  expires_at: string | null;
  created_by: string;
}): Promise<{ error: string | null }> {
  try {
    await query(
      `insert into public.share_links (token, token_hash, token_preview, household_id, scope, label, expires_at, created_by)
       values (null, $1, $2, $3, $4, $5, $6, $7)`,
      [row.token_hash, row.token_preview, row.household_id, row.scope, row.label, row.expires_at, row.created_by],
    );
    return { error: null };
  } catch (error) {
    return { error: message(error) };
  }
}

export type ResolvedShare = { id: string; household_id: string; scope: string; label: string | null; expires_at: string | null };

/** Not past its expiry (no expiry = no limit). The caller checks again. */
const SHARE_UNEXPIRED = "(expires_at is null or expires_at >= now())";

/** By hash only. Only an unexpired link. Throws on failure. */
export async function resolveShareToken(tokenHash: string): Promise<ResolvedShare | null> {
  const [byHash] = await query<ResolvedShare>(
    `select id, household_id, scope, label, expires_at from public.share_links
     where token_hash = $1 and ${SHARE_UNEXPIRED}`,
    [tokenHash],
  );
  return byHash ?? null;
}

// ---- chart image shares -----------------------------------------------------

export async function insertChartShare(row: {
  token: string;
  user_id: string;
  r2_key: string;
  title: string | null;
  expires_at: string;
}): Promise<{ error: string | null }> {
  try {
    await query(
      "insert into public.chart_share_tokens (token, user_id, r2_key, title, expires_at) values ($1, $2, $3, $4, $5)",
      [row.token, row.user_id, row.r2_key, row.title, row.expires_at],
    );
    return { error: null };
  } catch (error) {
    return { error: message(error) };
  }
}

/** An unexpired chart share only. The caller checks again. */
export async function findChartShare(token: string): Promise<{ r2_key: string; title: string | null; expires_at: string } | null> {
  try {
    const [row] = await query<{ r2_key: string; title: string | null; expires_at: string }>(
      "select r2_key, title, expires_at from public.chart_share_tokens where token = $1 and expires_at >= now()",
      [token],
    );
    return row ?? null;
  } catch {
    return null;
  }
}
