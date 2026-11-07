/**
 * Small reads and writes of one household's own columns (name, freeze-map
 * and tenant-relay fields), and its first owner. Used by many pages and jobs
 * that only need a field or two, each with one parameterized query. Column
 * names are allow-listed.
 */
import { query } from "./db/client";

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

export async function updateHouseholdFields(
  householdId: string,
  patch: Partial<Record<HouseholdColumn, unknown>>,
): Promise<{ error: string | null }> {
  const columns = Object.keys(patch) as HouseholdColumn[];
  checkColumns(columns);
  if (columns.length === 0) return { error: null };
  // Columns are allow-listed above; values come from the caller's typed settings.
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

/** The household's earliest owner, or null. Throws when the lookup fails (callers decide). */
export async function getFirstOwnerId(householdId: string): Promise<string | null> {
  const [row] = await query<{ user_id: string }>(
    `select user_id from public.household_members where household_id = $1 and role = 'owner'
     order by created_at, id limit 1`,
    [householdId],
  );
  return row?.user_id ?? null;
}
