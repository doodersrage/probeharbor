/**
 * Household-wide alert holds (migration 0003): `households.alerts_snoozed_until`
 * and `households.alerts_vacation_until`, set by the household's inbound
 * webhook. They hold that household's routine alerts for its members, the same
 * way a member's own snooze / vacation does (src/lib/alertSnooze.ts), but only
 * for this household: a member's alerts for their other households are not
 * affected, and the members' own alert settings are never written.
 */
import { query } from "./client";

export type HouseholdAlertHoldRow = {
  snoozeUntil: string | null;
  vacationUntil: string | null;
};

const iso = (value: unknown): string | null =>
  value == null ? null : value instanceof Date ? value.toISOString() : String(value);

/** The household's hold columns (null, null for an unknown household). Throws on a database error. */
export async function getHouseholdAlertHold(householdId: string): Promise<HouseholdAlertHoldRow> {
  const [row] = await query<{ alerts_snoozed_until: unknown; alerts_vacation_until: unknown }>(
    "select alerts_snoozed_until, alerts_vacation_until from public.households where id = $1",
    [householdId],
  );
  return {
    snoozeUntil: iso(row?.alerts_snoozed_until),
    vacationUntil: iso(row?.alerts_vacation_until),
  };
}

/**
 * Set (or with null, clear) one hold column on this household only. Returns
 * how many members the household has (the people whose alerts for it the
 * hold affects), or null when the household doesn't exist.
 */
async function setHold(
  column: "alerts_snoozed_until" | "alerts_vacation_until",
  householdId: string,
  until: string | null,
): Promise<number | null> {
  const [row] = await query<{ members: number | string }>(
    `update public.households set ${column} = $2::timestamptz where id = $1
     returning (select count(*) from public.household_members m where m.household_id = $1) as members`,
    [householdId, until],
  );
  return row ? Number(row.members) : null;
}

export function setHouseholdSnoozeUntil(householdId: string, until: string | null): Promise<number | null> {
  return setHold("alerts_snoozed_until", householdId, until);
}

export function setHouseholdVacationUntil(householdId: string, until: string | null): Promise<number | null> {
  return setHold("alerts_vacation_until", householdId, until);
}
