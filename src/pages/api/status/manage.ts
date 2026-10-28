import type { APIRoute } from "astro";
import { getAuthFromCookies } from "../../../lib/auth";
import { getUserEntitlements } from "../../../lib/entitlements";
import {
  householdManagerCtx,
  redirectUnlessManager,
  requireHouseholdManager,
} from "../../../lib/householdAuth";
import { recordHouseholdActivity } from "../../../lib/householdActivity";
import {
  createStatusPageToken,
  regenerateStatusPageToken,
  revokeStatusPageToken,
} from "../../../lib/statusPage";
import { formRedirectPath, withQuery } from "../../../lib/siteUrl";
import { FLASH_STATUS_TOKEN, setSecretFlash } from "../../../lib/secretFlash";
import { apiLocale, apiMoreCommonMessages } from "../../../i18n/messages/app/apiMore/common";

export const POST: APIRoute = async (context) => {
  const { request, cookies, redirect } = context;
  const { user } = await getAuthFromCookies(cookies);
  if (!user) return redirect("/signin");

  const formData = await request.formData();
  const redirectTo = formRedirectPath(formData, "/dashboard/share");
  const action = formData.get("action")?.toString() ?? "create";

  const manager = await requireHouseholdManager(user.id);
  const blocked = redirectUnlessManager(manager, redirectTo, redirect);
  if (blocked) return blocked;

  const householdId = householdManagerCtx(manager).householdId;

  // Revoking stays available after a downgrade so old credentials can be shut off.
  if (action === "revoke") {
    const id = formData.get("id")?.toString();
    if (id) {
      await revokeStatusPageToken(householdId, id);
      await recordHouseholdActivity({
        householdId,
        userId: user.id,
        action: "status_page_revoked",
        detail: id,
      });
    }
    return redirect(withQuery(redirectTo, { status_revoked: "1" }));
  }

  const entitlements = await getUserEntitlements(user.id);
  if (!entitlements.canCreateShareLinks) {
    return redirect(withQuery(redirectTo, { status_error: "pro" }));
  }

  if (action === "regenerate") {
    const id = formData.get("id")?.toString();
    const { token, error } = id
      ? await regenerateStatusPageToken(householdId, id)
      : { token: null, error: "missing id" };
    if (error || !token) {
      return redirect(withQuery(redirectTo, { status_error: "1" }));
    }
    await recordHouseholdActivity({
      householdId,
      userId: user.id,
      action: "status_page_regenerated",
      detail: id,
    });
    setSecretFlash(cookies, FLASH_STATUS_TOKEN, token);
    return redirect(withQuery(redirectTo, { status_regenerated: "1" }));
  }

  const label = formData.get("label")?.toString() || apiMoreCommonMessages(apiLocale(context)).defaults.statusPage;
  const { token, error } = await createStatusPageToken(householdId, label);
  if (error || !token) {
    return redirect(withQuery(redirectTo, { status_error: "1" }));
  }

  await recordHouseholdActivity({
    householdId,
    userId: user.id,
    action: "status_page_created",
    detail: label,
  });

  setSecretFlash(cookies, FLASH_STATUS_TOKEN, token);
  return redirect(withQuery(redirectTo, { status_created: "1" }));
};
