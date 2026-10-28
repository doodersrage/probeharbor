import type { APIRoute } from "astro";
import { getAuthFromCookies } from "../../../lib/auth";
import { canDownloadHistoryCsv } from "../../../lib/adminAccess";
import { getUserEntitlements } from "../../../lib/entitlements";
import { clampIsoToHistoryWindow } from "../../../lib/retentionSchedule";
import { timeZoneFromCookie, zonedDayEndIso, zonedDayStartIso } from "../../../lib/zonedDay";
import {
  buildGarageTempsCsv,
  fetchAllGarageTempReadings,
  type HistoryFilters,
} from "../../../lib/garageTempsHistory";
import { apiCommonMessages, apiLocale } from "../../../i18n/messages/app/api/common";
import { apiUserMessages } from "../../../i18n/messages/app/api/user";

/** A YYYY-MM-DD day in the browser's zone (ph_tz cookie), as on the History page; UTC when unknown. */
function parseDateParam(value: string | null, timeZone: string, endOfDay = false): string | undefined {
  if (!value?.trim()) return undefined;
  const iso = endOfDay ? zonedDayEndIso(value, timeZone) : zonedDayStartIso(value, timeZone);
  return iso ?? undefined;
}

export const GET: APIRoute = async ({ cookies, url, locals }) => {
  const locale = apiLocale({ locals });
  const tc = apiCommonMessages(locale);
  const { session, user } = await getAuthFromCookies(cookies);

  if (!session || !user) {
    return new Response(tc.unauthorized, { status: 401 });
  }

  const allowed = await canDownloadHistoryCsv(user.id);

  if (!allowed) {
    return new Response(apiUserMessages(locale).csvRequiresPlan, {
      status: 403,
    });
  }

  const entitlements = await getUserEntitlements(user.id);
  const timeZone = timeZoneFromCookie(cookies);
  const filters: HistoryFilters = {
    feedName: url.searchParams.get("feed")?.trim() || undefined,
    probeKey: url.searchParams.get("probe")?.trim() || undefined,
    from: clampIsoToHistoryWindow(
      parseDateParam(url.searchParams.get("from"), timeZone),
      entitlements.historyDays,
    ),
    to: parseDateParam(url.searchParams.get("to"), timeZone, true),
  };

  const { readings, error } = await fetchAllGarageTempReadings(user.id, filters);

  if (error) {
    return new Response(error, { status: 500 });
  }

  const csv = buildGarageTempsCsv(readings);
  const filename = `probeharbor-readings-${new Date().toISOString().slice(0, 10)}.csv`;

  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
};
