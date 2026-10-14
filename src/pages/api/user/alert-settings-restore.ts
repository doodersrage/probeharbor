import type { APIRoute } from "astro";
import { getAuthFromRequest } from "../../../lib/auth";
import { restoreAlertSettings } from "../../../lib/alertSettingsHistory";
import { redirectUnlessEditor, requireHouseholdEditor } from "../../../lib/householdAuth";
import { recordHouseholdActivity } from "../../../lib/householdActivity";
import { getUserHouseholdId } from "../../../lib/households";
import { formRedirectPath, withQuery } from "../../../lib/siteUrl";

/** Put alert settings back to how they were before one saved change. */
export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const { session, user } = await getAuthFromRequest(request, cookies);
  if (!session || !user) return redirect("/signin");

  const formData = await request.formData();
  const redirectTo = formRedirectPath(formData, "/dashboard/alerts?tab=settings");
  const editor = await requireHouseholdEditor(user.id);
  const blocked = redirectUnlessEditor(editor, redirectTo, redirect);
  if (blocked) return blocked;

  const id = Number(formData.get("history_id"));
  if (!Number.isInteger(id) || id <= 0) return redirect(withQuery(redirectTo, { alert_error: "restore_failed" }));

  const result = await restoreAlertSettings(user.id, id);
  if (result.error) return redirect(withQuery(redirectTo, { alert_error: "restore_failed" }));

  const householdId = await getUserHouseholdId(user.id);
  if (householdId) {
    await recordHouseholdActivity({ householdId, userId: user.id, action: "alert_settings_restored", detail: null });
  }
  return redirect(withQuery(redirectTo, { alert_saved: "restored" }));
};
