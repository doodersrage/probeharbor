import type { APIRoute } from "astro";
import { getAuthFromRequest } from "../../../../lib/auth";
import {
  countUnacknowledgedAlerts,
  listRecentAlertEvents,
} from "../../../../lib/alertEvents";
import { apiCommonMessages, apiLocale } from "../../../../i18n/messages/app/api/common";

export const GET: APIRoute = async ({ request, cookies, url, locals }) => {
  const locale = apiLocale({ locals });
  const tc = apiCommonMessages(locale);
  const { session, user } = await getAuthFromRequest(request, cookies);
  if (!session || !user) {
    return new Response(JSON.stringify({ error: tc.unauthorized }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const limitRaw = Number(url.searchParams.get("limit") ?? "30");
  const limit = Number.isFinite(limitRaw)
    ? Math.min(Math.max(Math.floor(limitRaw), 1), 100)
    : 30;

  const [events, unackedCount] = await Promise.all([
    listRecentAlertEvents(user.id, limit),
    countUnacknowledgedAlerts(user.id),
  ]);

  return new Response(
    JSON.stringify({
      events,
      unacked_count: unackedCount,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    },
  );
};
