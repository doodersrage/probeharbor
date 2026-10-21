import type { APIRoute } from "astro";
import { getAuthFromCookies } from "../../../lib/auth";
import {
  redirectUnlessEditor,
  requireHouseholdEditor,
  householdEditorCtx,
} from "../../../lib/householdAuth";
import { updateTenantNotifySettings } from "../../../lib/tenantRelay";
import { formRedirectPath, withQuery } from "../../../lib/siteUrl";
import { apiLocale } from "../../../i18n/messages/app/apiMore/common";

export const POST: APIRoute = async (context) => {
  const { request, cookies, redirect } = context;
  const { user } = await getAuthFromCookies(cookies);
  if (!user) {
    return redirect("/signin");
  }

  const formData = await request.formData();
  const redirectTo = formRedirectPath(formData, "/dashboard/settings");
  const householdId = formData.get("household_id")?.toString();

  const editor = await requireHouseholdEditor(user.id);
  const blocked = redirectUnlessEditor(editor, redirectTo, redirect);
  if (blocked) return blocked;
  const { householdId: editorHouseholdId } = householdEditorCtx(editor);

  if (!householdId || householdId !== editorHouseholdId) {
    return redirect(withQuery(redirectTo, { tenant_error: "1" }));
  }

  const result = await updateTenantNotifySettings(householdId, {
    email: formData.get("tenant_email")?.toString() ?? null,
    name: formData.get("tenant_name")?.toString() ?? null,
  }, apiLocale(context));

  if (result.error) {
    // The settings page shows this text as is (already in the request language).
    return redirect(withQuery(redirectTo, { tenant_error: result.error }));
  }

  return redirect(withQuery(redirectTo, { tenant_saved: "1" }));
};
