import type { APIRoute } from "astro";
import { getAuthFromRequest } from "../../../lib/auth";
import { createAdminClient } from "../../../lib/supabase";
import { getUserEntitlements } from "../../../lib/entitlements";
import { releaseFcmTokenFromOtherUsers } from "../../../lib/fcm";
import { apiCommonMessages, apiLocale } from "../../../i18n/messages/app/api/common";
import { apiUserMessages } from "../../../i18n/messages/app/api/user";

const PLATFORMS = new Set(["android", "ios", "web"]);

export const POST: APIRoute = async ({ request, cookies, locals }) => {
  const locale = apiLocale({ locals });
  const tc = apiCommonMessages(locale);
  const { user } = await getAuthFromRequest(request, cookies);
  if (!user) {
    return new Response(JSON.stringify({ error: tc.unauthorized }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const entitlements = await getUserEntitlements(user.id);
  if (!entitlements.canUsePush) {
    return new Response(JSON.stringify({ error: tc.proPlanRequired }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body: { token?: string; platform?: string; appId?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: tc.invalidJson }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const token = body.token?.trim();
  if (!token || token.length < 20) {
    return new Response(JSON.stringify({ error: apiUserMessages(locale).push.invalidFcmToken }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const platform = (body.platform ?? "android").toLowerCase();
  if (!PLATFORMS.has(platform)) {
    return new Response(JSON.stringify({ error: apiUserMessages(locale).push.invalidPlatform }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabase = createAdminClient();
  await releaseFcmTokenFromOtherUsers(supabase, user.id, token);
  const { error } = await supabase.from("fcm_device_tokens").upsert(
    {
      user_id: user.id,
      token,
      platform,
      app_id: body.appId?.trim() || null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,token" },
  );

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const DELETE: APIRoute = async ({ request, cookies, locals }) => {
  const locale = apiLocale({ locals });
  const tc = apiCommonMessages(locale);
  const { user } = await getAuthFromRequest(request, cookies);
  if (!user) {
    return new Response(JSON.stringify({ error: tc.unauthorized }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body: { token?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: tc.invalidJson }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!body.token?.trim()) {
    return new Response(JSON.stringify({ error: apiUserMessages(locale).push.missingToken }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabase = createAdminClient();
  await supabase
    .from("fcm_device_tokens")
    .delete()
    .eq("user_id", user.id)
    .eq("token", body.token.trim());

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
