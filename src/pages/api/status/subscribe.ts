import type { APIRoute } from "astro";
import { getTurnstileToken, verifyTurnstileToken } from "../../../lib/turnstile";
import {
  checkStatusSubscribeRateLimit,
  isStatusSubscribeHoneypotTriggered,
  STATUS_SUBSCRIBE_HONEYPOT_FIELD,
} from "../../../lib/statusSubscribeLimits";
import { subscribeToStatusUpdates } from "../../../lib/statusSubscriptions";
import { withQuery } from "../../../lib/siteUrl";

export const prerender = false;

export const POST: APIRoute = async ({ request, redirect, clientAddress }) => {
  const formData = await request.formData();
  const redirectTo = "/system-status";

  if (isStatusSubscribeHoneypotTriggered(formData.get(STATUS_SUBSCRIBE_HONEYPOT_FIELD))) {
    return redirect(withQuery(redirectTo, { subscribed: "1" }));
  }

  const rate = checkStatusSubscribeRateLimit(clientAddress || "unknown");
  if (!rate.ok) {
    return redirect(withQuery(redirectTo, { status_error: "rate_limited" }));
  }

  const turnstile = await verifyTurnstileToken(
    getTurnstileToken(formData),
    clientAddress,
  );
  if (!turnstile.success) {
    return redirect(withQuery(redirectTo, { status_error: "verification" }));
  }

  const email = formData.get("email")?.toString() ?? "";
  const result = await subscribeToStatusUpdates(email);
  if (!result.ok) {
    return redirect(withQuery(redirectTo, { status_error: "invalid_email" }));
  }

  return redirect(withQuery(redirectTo, { subscribed: "1" }));
};
