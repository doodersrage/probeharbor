import type { APIRoute } from "astro";
import { getTurnstileToken, verifyTurnstileToken } from "../../../lib/turnstile";
import {
  checkStatusSubscribeRateLimit,
  isStatusSubscribeHoneypotTriggered,
  STATUS_SUBSCRIBE_HONEYPOT_FIELD,
} from "../../../lib/statusSubscribeLimits";
import { subscribeToFreezeAlerts } from "../../../lib/freezeAlerts";
import { apiLocale } from "../../../i18n/messages/app/apiMore/common";
import { apiMorePublicFormsMessages } from "../../../i18n/messages/app/apiMore/publicForms";

export const prerender = false;

function json(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

/** Form POST from the pipe freeze forecast: email + the place the visitor just looked up. */
export const POST: APIRoute = async (context) => {
  const { request, clientAddress } = context;
  const locale = apiLocale(context);
  const t = apiMorePublicFormsMessages(locale).freezeAlerts;
  const SUCCESS = t.success;
  const formData = await request.formData();

  // Bots that fill the hidden field get the normal success message and nothing else.
  if (isStatusSubscribeHoneypotTriggered(formData.get(STATUS_SUBSCRIBE_HONEYPOT_FIELD))) {
    return json({ ok: true, message: SUCCESS });
  }

  // Same per-IP limit as status subscriptions, in its own bucket.
  const rate = checkStatusSubscribeRateLimit(`freeze-alerts:${clientAddress || "unknown"}`, Date.now(), locale);
  if (!rate.ok) {
    return json({ ok: false, message: rate.error ?? t.tooMany }, 429);
  }

  const turnstile = await verifyTurnstileToken(getTurnstileToken(formData), clientAddress, locale);
  if (!turnstile.success) {
    return json({ ok: false, message: t.verificationFailed }, 400);
  }

  const result = await subscribeToFreezeAlerts({
    email: formData.get("email")?.toString() ?? "",
    lat: Number(formData.get("lat")),
    lon: Number(formData.get("lon")),
    label: formData.get("label")?.toString() ?? "",
  }, locale);
  if (!result.ok) {
    return json({ ok: false, message: result.error ?? t.genericError }, 400);
  }
  return json({ ok: true, message: SUCCESS });
};
