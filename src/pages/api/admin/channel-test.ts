import type { APIRoute } from "astro";
import { getAuthFromCookies } from "../../../lib/auth";
import { isUserAdmin } from "../../../lib/adminAccess";
import {
  getAlertSettingsForUser,
  isTwilioConfigured,
  sendTwilioSms,
} from "../../../lib/notify";
import { isVapidConfigured, sendWebPushToUser } from "../../../lib/webPush";
import { getLocale } from "../../../i18n";
import { adminMessages } from "../../../i18n/messages/app/admin";

function opsRedirect(params: Record<string, string>): Response {
  const qs = new URLSearchParams(params);
  return new Response(null, {
    status: 302,
    headers: { Location: `/dashboard/ops?${qs.toString()}` },
  });
}

export const POST: APIRoute = async ({ request, cookies, locals }) => {
  const { session, user } = await getAuthFromCookies(cookies);
  if (!session || !user || !(await isUserAdmin(user.id))) {
    return new Response("Forbidden", { status: 403 });
  }
  // Tests call the route without locals; fall back to English.
  const t = adminMessages(getLocale({ locals: locals ?? ({} as App.Locals) })).api;

  const formData = await request.formData().catch(() => null);
  const kind = formData?.get("kind")?.toString() ?? "sms";

  if (kind === "sms") {
    if (!isTwilioConfigured()) {
      return opsRedirect({ channel_error: "sms_not_configured" });
    }

    const settings = await getAlertSettingsForUser(
      user.id,
      user.user_metadata as Record<string, unknown>,
    );
    const phone =
      formData?.get("phone")?.toString().trim() || settings.smsPhone || null;
    if (!phone) {
      return opsRedirect({ channel_error: "sms_no_phone" });
    }

    const ok = await sendTwilioSms(
      phone,
      t.smsTest,
    );
    if (!ok) {
      return opsRedirect({ channel_error: "sms_send_failed" });
    }

    return opsRedirect({ channel_test: "1", channel_kind: "sms" });
  }

  if (kind === "push") {
    if (!isVapidConfigured()) {
      return opsRedirect({ channel_error: "push_not_configured" });
    }

    const result = await sendWebPushToUser(user.id, {
      title: t.pushTestTitle,
      body: t.pushTestBody,
    });

    if (result.delivered <= 0) {
      const reason = result.skippedReason ?? "push_delivery_failed";
      return opsRedirect({ channel_error: reason });
    }

    return opsRedirect({ channel_test: "1", channel_kind: "push" });
  }

  return opsRedirect({ channel_error: "unknown_kind" });
};
