import type { APIRoute } from "astro";
import { getTurnstileToken, verifyTurnstileToken } from "../../../lib/turnstile";
import {
  checkStatusSubscribeRateLimit,
  isStatusSubscribeHoneypotTriggered,
  STATUS_SUBSCRIBE_HONEYPOT_FIELD,
} from "../../../lib/statusSubscribeLimits";
import { subscribeToFreezeAlerts } from "../../../lib/freezeAlerts";

export const prerender = false;

const SUCCESS = "Check your email to confirm. Alerts start the next freezing night after you do.";

function json(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

/** Form POST from the pipe freeze forecast: email + the place the visitor just looked up. */
export const POST: APIRoute = async ({ request, clientAddress }) => {
  const formData = await request.formData();

  // Bots that fill the hidden field get the normal success message and nothing else.
  if (isStatusSubscribeHoneypotTriggered(formData.get(STATUS_SUBSCRIBE_HONEYPOT_FIELD))) {
    return json({ ok: true, message: SUCCESS });
  }

  // Same per-IP limit as status subscriptions, in its own bucket.
  const rate = checkStatusSubscribeRateLimit(`freeze-alerts:${clientAddress || "unknown"}`);
  if (!rate.ok) {
    return json({ ok: false, message: rate.error ?? "Too many attempts. Try again in a few minutes." }, 429);
  }

  const turnstile = await verifyTurnstileToken(getTurnstileToken(formData), clientAddress);
  if (!turnstile.success) {
    return json({ ok: false, message: "Verification failed. Please try again." }, 400);
  }

  const result = await subscribeToFreezeAlerts({
    email: formData.get("email")?.toString() ?? "",
    lat: Number(formData.get("lat")),
    lon: Number(formData.get("lon")),
    label: formData.get("label")?.toString() ?? "",
  });
  if (!result.ok) {
    return json({ ok: false, message: result.error ?? "Something went wrong. Please try again." }, 400);
  }
  return json({ ok: true, message: SUCCESS });
};
