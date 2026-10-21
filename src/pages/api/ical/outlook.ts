import type { APIRoute } from "astro";
import { getAuthFromCookies } from "../../../lib/auth";
import { getAlertSettingsForUser } from "../../../lib/notify";
import { getUserPreferences } from "../../../lib/userPreferences";
import { fetchNightsAtRisk } from "../../../lib/FetchWeather";
import { buildFreezeOutlookIcal } from "../../../lib/icalFeed";
import { apiLocale, apiMoreCommonMessages } from "../../../i18n/messages/app/apiMore/common";

export const GET: APIRoute = async (context) => {
  const { cookies } = context;
  const { session, user } = await getAuthFromCookies(cookies);
  if (!session || !user) {
    return new Response(apiMoreCommonMessages(apiLocale(context)).unauthorized, { status: 401 });
  }

  const [settings, preferences] = await Promise.all([
    getAlertSettingsForUser(user.id, user.user_metadata as Record<string, unknown>),
    getUserPreferences(user),
  ]);

  const nights = await fetchNightsAtRisk({
    cityId: preferences.weatherCityId,
    freezeThresholdF: settings.freezeThresholdF,
  });

  const body = buildFreezeOutlookIcal(nights);
  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="probeharbor-freeze-outlook.ics"',
      "Cache-Control": "no-store",
    },
  });
};
