import type { APIRoute } from "astro";
import { getAuthFromRequest } from "../../../lib/auth";
import {
  clearHouseholdSnooze,
  clearHouseholdVacation,
  getHouseholdAlertHold,
} from "../../../lib/alertSnoozeTokens";
import {
  householdEditorCtx,
  redirectUnlessEditor,
  requireHouseholdEditor,
} from "../../../lib/householdAuth";
import { recordHouseholdActivity } from "../../../lib/householdActivity";
import { formRedirectPath, withQuery } from "../../../lib/siteUrl";

export const prerender = false;

/**
 * Lift the household-wide alert hold (households.alerts_snoozed_until /
 * alerts_vacation_until, set by the household's inbound webhook) from the
 * dashboard. "Resume alerts" in AlertPauseNotice posts here.
 *
 * Owners and editors only (requireHouseholdEditor: view-only and alert-only
 * members are refused). It acts on the signed-in user's current household; a
 * household id in the form is never read. Members' own snooze / vacation are
 * not touched (that is /api/user/alert-snooze). Redirects back with the same
 * snooze_cleared / vacation_cleared flash the personal resume uses.
 */
export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const { session, user } = await getAuthFromRequest(request, cookies);
  if (!session || !user) return redirect("/signin");

  const formData = await request.formData();
  const redirectTo = formRedirectPath(formData, "/dashboard/alerts");

  const editor = await requireHouseholdEditor(user.id);
  const blocked = redirectUnlessEditor(editor, redirectTo, redirect);
  if (blocked) return blocked;
  const { householdId } = householdEditorCtx(editor);

  const action = formData.get("action")?.toString();
  if (action !== "clear_snooze" && action !== "clear_vacation") {
    return redirect(redirectTo);
  }
  const kind = action === "clear_snooze" ? "snooze" : "vacation";

  const before = await getHouseholdAlertHold(householdId);
  const wasSet = kind === "snooze" ? before.snoozeUntil != null : before.vacationUntil != null;
  if (kind === "snooze") await clearHouseholdSnooze(householdId);
  else await clearHouseholdVacation(householdId);

  if (wasSet) {
    // The hold is already lifted; a failed activity write must not report the resume as failed.
    try {
      await recordHouseholdActivity({
        householdId,
        userId: user.id,
        action: kind === "snooze" ? "household_snooze_cleared" : "household_vacation_cleared",
        detail: null,
      });
    } catch (error) {
      console.error("Household activity write failed after lifting the alert hold:", error);
    }
  }

  return redirect(withQuery(redirectTo, kind === "snooze" ? { snooze_cleared: "1" } : { vacation_cleared: "1" }));
};
