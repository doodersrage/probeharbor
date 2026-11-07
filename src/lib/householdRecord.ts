/**
 * Small reads and writes of one household's own columns (name, freeze-map
 * and tenant-relay fields), and its first owner. Used by many pages and jobs
 * that only need a field or two. Supabase: the same queries those callers
 * ran; Neon: one parameterized query. Column names are allow-listed.
 */
import { dbBackend, query } from "./db/client";
import { createServerClient } from "./supabase";
import type { Database } from "../types/supabase";

const HOUSEHOLD_COLUMNS = [
  "name",
  "freeze_map_opt_in",
  "freeze_map_city_id",
  "freeze_map_lat",
  "freeze_map_lon",
  "freeze_map_label",
  "tenant_notify_email",
  "tenant_notify_name",
] as const;
export type HouseholdColumn = (typeof HOUSEHOLD_COLUMNS)[number];

function checkColumns(columns: readonly string[]): void {
  const unknown = columns.filter((c) => !(HOUSEHOLD_COLUMNS as readonly string[]).includes(c));
  if (unknown.length) throw new Error(`Unknown household columns: ${unknown.join(", ")}`);
}

/** The household's row with just these columns; data null when not found. */
export async function getHouseholdFields<C extends HouseholdColumn>(
  householdId: string,
  columns: readonly C[],
): Promise<{ data: Record<C, unknown> | null; error: string | null }> {
  checkColumns(columns);
  if (dbBackend() === "neon") {
    try {
      const [row] = await query<Record<C, unknown>>(
        `select ${columns.map((c) => `"${c}"`).join(", ")} from public.households where id = $1`,
        [householdId],
      );
      return { data: row ?? null, error: null };
    } catch (error) {
      return { data: null, error: error instanceof Error ? error.message : String(error) };
    }
  }
  const { data, error } = await createServerClient()
    .from("households")
    .select(columns.join(", "))
    .eq("id", householdId)
    .maybeSingle();
  return { data: (data as Record<C, unknown> | null) ?? null, error: error?.message ?? null };
}

export async function updateHouseholdFields(
  householdId: string,
  patch: Partial<Record<HouseholdColumn, unknown>>,
): Promise<{ error: string | null }> {
  const columns = Object.keys(patch) as HouseholdColumn[];
  checkColumns(columns);
  if (columns.length === 0) return { error: null };
  if (dbBackend() === "neon") {
    try {
      await query(
        `update public.households set ${columns.map((c, i) => `"${c}" = $${i + 2}`).join(", ")} where id = $1`,
        [householdId, ...columns.map((c) => patch[c] ?? null)],
      );
      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error.message : String(error) };
    }
  }
  // Columns are allow-listed above; values come from the caller's typed settings.
  const { error } = await createServerClient()
    .from("households")
    .update(patch as Database["public"]["Tables"]["households"]["Update"])
    .eq("id", householdId);
  return { error: error?.message ?? null };
}

/** The household's earliest owner, or null. Throws when the lookup fails (callers decide). */
export async function getFirstOwnerId(householdId: string): Promise<string | null> {
  if (dbBackend() === "neon") {
    const [row] = await query<{ user_id: string }>(
      `select user_id from public.household_members where household_id = $1 and role = 'owner'
       order by created_at, id limit 1`,
      [householdId],
    );
    return row?.user_id ?? null;
  }
  const { data, error } = await createServerClient()
    .from("household_members")
    .select("user_id")
    .eq("household_id", householdId)
    .eq("role", "owner")
    .limit(1);
  if (error) throw new Error(error.message);
  return data?.[0]?.user_id ?? null;
}
