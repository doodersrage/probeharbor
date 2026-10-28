import { createServerClient } from "./supabase";
import { getUserEntitlements, type Entitlements } from "./entitlements";

export const API_PLAN_REQUIRED = "API access needs a Pro plan";

export type ApiPlanCheck =
  | { ok: true; entitlements: Entitlements }
  | { ok: false; status: 403 | 503; error: string };

/**
 * The Pro API (/api/v1/*) is a paid feature, so every call checks the
 * household owner's *current* plan, not just that the key exists: a key
 * created on Pro stops working after a downgrade (403). Device ingest keys
 * are separate and unaffected. If the plan can't be read, the call fails
 * with 503 instead of guessing either way.
 */
export async function checkApiPlan(householdId: string): Promise<ApiPlanCheck> {
  let ownerId: string | null = null;
  try {
    const { data, error } = await createServerClient()
      .from("household_members")
      .select("user_id")
      .eq("household_id", householdId)
      .eq("role", "owner")
      .limit(1);
    if (error) throw new Error(error.message);
    ownerId = data?.[0]?.user_id ?? null;
  } catch (error) {
    console.error("api plan check: could not read household owner", error);
    return { ok: false, status: 503, error: "Could not check the plan. Try again." };
  }
  if (!ownerId) return { ok: false, status: 403, error: API_PLAN_REQUIRED };

  let entitlements: Entitlements;
  try {
    entitlements = await getUserEntitlements(ownerId);
  } catch (error) {
    console.error("api plan check: could not read entitlements", error);
    return { ok: false, status: 503, error: "Could not check the plan. Try again." };
  }
  // API keys are created under the same Pro gate (api/api-keys/index.ts).
  if (!entitlements.canCreateShareLinks) return { ok: false, status: 403, error: API_PLAN_REQUIRED };
  return { ok: true, entitlements };
}
