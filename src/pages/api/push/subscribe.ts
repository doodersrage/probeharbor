import type { APIRoute } from "astro";
import { getAuthFromRequest } from "../../../lib/auth";
import * as neonPush from "../../../lib/db/pushTokens";
import { getUserEntitlements } from "../../../lib/entitlements";
import { releasePushSubscriptionFromOtherUsers } from "../../../lib/webPush";
import { apiCommonMessages, apiLocale } from "../../../i18n/messages/app/api/common";
import { apiUserMessages } from "../../../i18n/messages/app/api/user";

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

  let body: { endpoint?: string; keys?: { p256dh?: string; auth?: string } };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: tc.invalidJson }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!body.endpoint || !body.keys?.p256dh || !body.keys?.auth) {
    return new Response(JSON.stringify({ error: apiUserMessages(locale).push.invalidSubscription }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  await releasePushSubscriptionFromOtherUsers(null, user.id, body.endpoint);
  const saved = await neonPush.savePushSubscription(user.id, body.endpoint, body.keys.p256dh, body.keys.auth);

  if (saved.error) {
    return new Response(JSON.stringify({ error: saved.error }), {
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

  let body: { endpoint?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: tc.invalidJson }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!body.endpoint) {
    return new Response(JSON.stringify({ error: apiUserMessages(locale).push.missingEndpoint }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  await neonPush.deletePushSubscription(user.id, body.endpoint);

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
