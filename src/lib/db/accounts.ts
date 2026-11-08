/**
 * Neon version of account deletion (accountLifecycle.ts).
 *
 * Same rules as the old Supabase code, done in fewer, atomic steps:
 * 1. One statement: delete households the user solely belongs to; in shared
 *    households they own, promote the earliest "member" (else the longest-
 *    standing other member) to owner. Returns the deleted household ids.
 * 2. The caller removes stored files (needs the user's chart keys first).
 * 3. Delete the user row; foreign keys remove or detach everything else
 *    (memberships, settings, alerts, tokens, sessions).
 */
import { query } from "./client";

/** Step 1. Throws on failure (nothing is deleted then). */
export async function releaseOwnedHouseholds(userId: string): Promise<string[]> {
  const [row] = await query<{ deleted: string[] }>(
    `with owned as (
       select m.household_id,
              (select count(*) from public.household_members x where x.household_id = m.household_id) as members
       from public.household_members m
       where m.user_id = $1 and m.role = 'owner'
     ),
     solo as (
       delete from public.households h using owned o
       where h.id = o.household_id and o.members <= 1
       returning h.id
     ),
     promotee as (
       select distinct on (m.household_id) m.id
       from public.household_members m join owned o on o.household_id = m.household_id
       where o.members > 1 and m.user_id <> $1
       order by m.household_id, (m.role = 'member') desc, m.created_at, m.id
     ),
     promoted as (
       update public.household_members m set role = 'owner'
       from promotee p where m.id = p.id
       returning m.id
     )
     select coalesce(array(select id from solo), '{}') as deleted, (select count(*) from promoted) as promoted`,
    [userId],
  );
  return row?.deleted ?? [];
}

/** The user's shared chart image keys (before the user row and its tokens go). */
export async function chartShareKeys(userId: string): Promise<string[]> {
  try {
    const rows = await query<{ r2_key: string }>("select r2_key from public.chart_share_tokens where user_id = $1", [userId]);
    return rows.map((r) => r.r2_key);
  } catch {
    return [];
  }
}

/** Step 3. Throws on failure. */
export async function deleteUserRow(userId: string): Promise<boolean> {
  const rows = await query("delete from public.auth_users where id = $1 returning id", [userId]);
  return rows.length > 0;
}
