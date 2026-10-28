import type { APIRoute } from "astro";
import { getAuthFromRequest } from "../../../lib/auth";
import { getOrCreateHouseholdForUser } from "../../../lib/households";
import { getUserEntitlements } from "../../../lib/entitlements";
import { createServerClient } from "../../../lib/supabase";
import {
  redirectUnlessManager,
  requireHouseholdManager,
} from "../../../lib/householdAuth";
import { recordHouseholdActivity } from "../../../lib/householdActivity";
import { formRedirectPath, withQuery } from "../../../lib/siteUrl";
import { FLASH_SHARE_TOKEN, setSecretFlash } from "../../../lib/secretFlash";
import { apiLocale, apiMoreCommonMessages } from "../../../i18n/messages/app/apiMore/common";
import { randomShareToken, storedShareTokenFields } from "../../../lib/shareLinkTokens";

const FAMILY_MAX_LIVE_LINKS = 1;
const FAMILY_DEFAULT_EXPIRES_DAYS = 7;


export const GET: APIRoute = async ({ request, cookies }) => {
  const { user } = await getAuthFromRequest(request, cookies);
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const household = await getOrCreateHouseholdForUser(user.id, user.email);
  if (!household.householdId) {
    return new Response(JSON.stringify({ error: household.error }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const manager = await requireHouseholdManager(user.id);
  const canManage = manager.ok;

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("share_links")
    .select("id, token, token_preview, scope, label, expires_at, created_at")
    .eq("household_id", household.householdId)
    .order("created_at", { ascending: false });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  // `token` is only present for links created before hashing (and only for
  // managers); newer links are shown once at creation.
  const links = (data ?? []).map(({ token, token_preview, ...rest }) => ({
    ...rest,
    ...(canManage ? { token } : {}),
    token_preview: token_preview ?? token?.slice(-4) ?? null,
  }));

  return new Response(JSON.stringify({ links }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const POST: APIRoute = async (context) => {
  const { request, cookies, redirect } = context;
  const { user } = await getAuthFromRequest(request, cookies);
  if (!user) {
    return redirect("/signin");
  }

  const entitlements = await getUserEntitlements(user.id);
  const formData = await request.formData();
  const redirectTo = formRedirectPath(formData, "/dashboard/share");
  const action = formData.get("action")?.toString() ?? "create";

  const manager = await requireHouseholdManager(user.id);
  const blocked = redirectUnlessManager(manager, redirectTo, redirect);
  if (blocked) return blocked;

  const household = await getOrCreateHouseholdForUser(user.id, user.email);
  if (!household.householdId) {
    return redirect(withQuery(redirectTo, { error: "1" }));
  }

  const supabase = createServerClient();

  // Revoking stays available after a downgrade so old credentials can be shut off.
  if (action === "revoke") {
    const id = formData.get("id")?.toString();
    if (id) {
      await supabase
        .from("share_links")
        .delete()
        .eq("id", id)
        .eq("household_id", household.householdId);
    }
    return redirect(withQuery(redirectTo, { revoked: "1" }));
  }

  if (action === "regenerate") {
    const id = formData.get("id")?.toString();
    const { data: link } = id
      ? await supabase
          .from("share_links")
          .select("id, scope")
          .eq("id", id)
          .eq("household_id", household.householdId)
          .maybeSingle()
      : { data: null };
    if (!link) return redirect(withQuery(redirectTo, { error: "1" }));
    const allowed =
      entitlements.canCreateShareLinks ||
      (entitlements.canCreateFamilyShareLink && link.scope === "live");
    if (!allowed) return redirect(withQuery(redirectTo, { error: "pro_required" }));

    const token = randomShareToken();
    const { error } = await supabase
      .from("share_links")
      .update(await storedShareTokenFields(token))
      .eq("id", link.id)
      .eq("household_id", household.householdId);
    if (error) return redirect(withQuery(redirectTo, { error: "1" }));

    await recordHouseholdActivity({
      householdId: household.householdId,
      userId: user.id,
      action: "share_link_regenerated",
      detail: link.scope,
    });
    setSecretFlash(cookies, FLASH_SHARE_TOKEN, token);
    return redirect(withQuery(redirectTo, { regenerated: "1" }));
  }

  const familyOnly =
    !entitlements.canCreateShareLinks && entitlements.canCreateFamilyShareLink;
  if (!entitlements.canCreateShareLinks && !entitlements.canCreateFamilyShareLink) {
    return redirect(withQuery(redirectTo, { error: "pro_required" }));
  }

  const scopeRaw = formData.get("scope")?.toString() ?? "live";
  let scope =
    scopeRaw === "history"
      ? "history"
      : scopeRaw === "metrics"
        ? "metrics"
        : "live";
  let label = formData.get("label")?.toString().trim() || null;
  let expiresDays = Number(formData.get("expires_days") ?? 0);

  if (familyOnly || formData.get("family_quick") === "1") {
    scope = "live";
    label = label || apiMoreCommonMessages(apiLocale(context)).defaults.familyLiveView;
    if (!(expiresDays > 0)) {
      expiresDays = FAMILY_DEFAULT_EXPIRES_DAYS;
    }
    // Cap free/member family links at one live view.
    if (familyOnly) {
      const { count } = await supabase
        .from("share_links")
        .select("id", { count: "exact", head: true })
        .eq("household_id", household.householdId)
        .eq("scope", "live");
      if ((count ?? 0) >= FAMILY_MAX_LIVE_LINKS) {
        return redirect(withQuery(redirectTo, { error: "family_limit" }));
      }
      // Free/member: never allow never-expire or non-live.
      expiresDays = Math.min(Math.max(expiresDays, 1), 30);
    }
  } else if (!entitlements.canCreateShareLinks) {
    return redirect(withQuery(redirectTo, { error: "pro_required" }));
  }

  const expires_at =
    expiresDays > 0
      ? new Date(Date.now() + expiresDays * 24 * 60 * 60 * 1000).toISOString()
      : null;

  const token = randomShareToken();
  const { error } = await supabase.from("share_links").insert({
    ...(await storedShareTokenFields(token)),
    household_id: household.householdId,
    scope,
    label,
    expires_at,
    created_by: user.id,
  });

  if (error) {
    return redirect(withQuery(redirectTo, { error: "1" }));
  }

  await recordHouseholdActivity({
    householdId: household.householdId,
    userId: user.id,
    action: "share_link_created",
    detail: scope,
  });

  setSecretFlash(cookies, FLASH_SHARE_TOKEN, token);
  return redirect(withQuery(redirectTo, { created: "1" }));
};
