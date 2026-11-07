import * as neonRemaining from "./db/remaining";

export type ActivityRow = {
  id: string;
  household_id: string;
  user_id: string | null;
  action: string;
  detail: string | null;
  created_at: string;
};

export async function recordHouseholdActivity(input: {
  householdId: string;
  userId?: string | null;
  action: string;
  detail?: string | null;
}): Promise<void> {
  return neonRemaining.recordActivity({
    household_id: input.householdId,
    user_id: input.userId ?? null,
    action: input.action,
    detail: input.detail ?? null,
  });
}

export async function listHouseholdActivity(
  householdId: string,
  limit = 40,
): Promise<ActivityRow[]> {
  return neonRemaining.listActivity<ActivityRow>(householdId, limit);
}
