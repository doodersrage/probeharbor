/**
 * Neon versions of the admin and ops queries: user manager (the
 * caller-checked Postgres functions), group membership (admin check),
 * server error log, contact submissions, checkout analytics, app status.
 *
 * Difference from the old Supabase code: contact search text is a bound
 * parameter. The old code pasted it into a PostgREST `or` filter, where
 * commas or parentheses in a search could add filter conditions (admin-only
 * page, so low risk, but not repeated here).
 */
import type { ContactSubmission } from "../contactSubmissions";
import type { ManagedUser } from "../userManager";
import { query } from "./client";

const message = (error: unknown) => (error instanceof Error ? error.message : String(error));

// ---- users and groups -------------------------------------------------------

export async function listManagedUsers(args: {
  callerId: string;
  page: number;
  pageSize: number;
  search: string | null;
  group: string | null;
  sortBy: string;
  sortDir: string;
}): Promise<{ users: ManagedUser[]; total: number; error: string | null }> {
  try {
    const [users, [count]] = await Promise.all([
      query<ManagedUser>(
        "select * from public.list_managed_users($1, $2, $3, $4, $5, $6, $7)",
        [args.callerId, args.page, args.pageSize, args.search, args.group, args.sortBy, args.sortDir],
      ),
      query<{ n: number }>("select public.count_managed_users($1, $2, $3) as n", [args.callerId, args.search, args.group]),
    ]);
    return { users, total: Number(count?.n ?? 0), error: null };
  } catch (error) {
    // Includes "Forbidden" from the functions when the caller isn't an admin.
    const cause = (error as { cause?: unknown }).cause;
    return { users: [], total: 0, error: cause instanceof Error ? cause.message : message(error) };
  }
}

export async function setUserAdminMembership(callerId: string, targetUserId: string, makeAdmin: boolean): Promise<{ error: string | null }> {
  try {
    await query("select public.set_user_admin_membership($1, $2, $3)", [callerId, targetUserId, makeAdmin]);
    return { error: null };
  } catch (error) {
    const cause = (error as { cause?: unknown }).cause;
    return { error: cause instanceof Error ? cause.message : message(error) };
  }
}

/** Membership in a named group; any failure reads as "not in it". */
export async function isUserInGroup(userId: string, groupName: string): Promise<boolean> {
  try {
    const rows = await query(
      `select 1 from public.group_members gm join public.groups g on g.id = gm.group_id
       where gm.user_id = $1 and g.name = $2 limit 1`,
      [userId, groupName],
    );
    return rows.length > 0;
  } catch {
    return false;
  }
}

// ---- server errors ----------------------------------------------------------

export async function insertServerError(row: {
  path: string;
  method: string;
  message: string;
  stack: string | null;
  user_id: string | null;
}): Promise<void> {
  await query("insert into public.server_errors (path, method, message, stack, user_id) values ($1, $2, $3, $4, $5)", [
    row.path,
    row.method,
    row.message,
    row.stack,
    row.user_id,
  ]);
}

export async function listServerErrors<T>(limit: number): Promise<T[]> {
  try {
    return await query<T & Record<string, unknown>>(
      `select id, path, method, message, stack, user_id, created_at from public.server_errors
       order by created_at desc, id limit $1`,
      [limit],
    );
  } catch {
    return [];
  }
}

// ---- contact submissions ----------------------------------------------------

const CONTACT_COLUMNS = "id, name, email, message, created_at, status, admin_notes";

export async function pageContacts(
  filters: { status?: string; search?: string },
  offset: number,
  limit: number,
): Promise<{ rows: ContactSubmission[]; total: number; error: string | null }> {
  const params: unknown[] = [];
  const clauses: string[] = [];
  if (filters.status) {
    params.push(filters.status);
    clauses.push(`status = $${params.length}`);
  }
  if (filters.search) {
    params.push(`%${filters.search}%`);
    const p = `$${params.length}`;
    clauses.push(`(name ilike ${p} or email ilike ${p} or message ilike ${p})`);
  }
  const where = clauses.length ? `where ${clauses.join(" and ")}` : "";
  try {
    const [rows, [count]] = await Promise.all([
      query<ContactSubmission>(
        `select ${CONTACT_COLUMNS} from public.contacts ${where}
         order by created_at desc nulls last, id desc limit $${params.length + 1} offset $${params.length + 2}`,
        [...params, limit, offset],
      ),
      query<{ n: number }>(`select count(*) as n from public.contacts ${where}`, params),
    ]);
    return { rows, total: count?.n ?? 0, error: null };
  } catch (error) {
    return { rows: [], total: 0, error: message(error) };
  }
}

/** Every submission, newest first (contacts are few; export only). */
export async function allContacts(): Promise<{ rows: ContactSubmission[]; error: string | null }> {
  try {
    const rows = await query<ContactSubmission>(
      `select ${CONTACT_COLUMNS} from public.contacts order by created_at desc nulls last, id desc`,
    );
    return { rows, error: null };
  } catch (error) {
    return { rows: [], error: message(error) };
  }
}

export async function updateContact(id: number, updates: { status?: string; admin_notes?: string }): Promise<{ error: string | null }> {
  try {
    await query(
      `update public.contacts
       set status = coalesce($2, status),
           admin_notes = case when $4 then $3 else admin_notes end
       where id = $1`,
      [id, updates.status ?? null, updates.admin_notes ?? null, updates.admin_notes !== undefined],
    );
    return { error: null };
  } catch (error) {
    return { error: message(error) };
  }
}

// ---- ops dashboards ---------------------------------------------------------

export async function recentCheckoutRows(): Promise<Array<{ id: string; user_id: string | null; detail: string | null; created_at: string }>> {
  try {
    return await query(
      `select id, user_id, detail, created_at from public.household_activity
       where action = 'checkout_started' order by created_at desc, id limit 500`,
    );
  } catch {
    return [];
  }
}

export async function jobRunsSince(sinceIso: string): Promise<Array<{ job_name: string; status: string; started_at: string }>> {
  try {
    return await query(
      `select job_name, status, started_at from public.job_runs
       where started_at >= $1 order by started_at desc, id desc limit 50`,
      [sinceIso],
    );
  } catch {
    return [];
  }
}
