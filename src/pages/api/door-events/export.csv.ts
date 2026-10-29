import type { APIRoute } from "astro";
import { getAuthFromCookies } from "../../../lib/auth";
import { getUserEntitlements } from "../../../lib/entitlements";
import { getOrCreateHouseholdForUser } from "../../../lib/households";
import { listHouseholdDevices } from "../../../lib/devices";
import { buildDoorEventsCsv, DOOR_CSV_LIMIT, doorReportRange, loadDoorReport } from "../../../lib/doorEventReport";
import { timeZoneFromCookie, zonedDayEndIso, zonedDayStartIso } from "../../../lib/zonedDay";
import { apiCommonMessages, apiLocale } from "../../../i18n/messages/app/api/common";
import { apiUserMessages } from "../../../i18n/messages/app/api/user";

/** Door open/close events with temperature and humidity at open and close, as CSV (times in UTC). */
export const GET: APIRoute = async ({ cookies, url, locals }) => {
  const locale = apiLocale({ locals });
  const tc = apiCommonMessages(locale);
  const { session, user } = await getAuthFromCookies(cookies);
  if (!session || !user) {
    return new Response(tc.unauthorized, { status: 401 });
  }

  const entitlements = await getUserEntitlements(user.id);
  if (!entitlements.canDownloadCsv) {
    return new Response(apiUserMessages(locale).csvRequiresPlan, { status: 403 });
  }

  const household = await getOrCreateHouseholdForUser(user.id, user.email);
  const filename = `probeharbor-door-events-${new Date().toISOString().slice(0, 10)}.csv`;
  const headers = {
    "Content-Type": "text/csv; charset=utf-8",
    "Content-Disposition": `attachment; filename="${filename}"`,
    "Cache-Control": "no-store",
  };
  if (!household.householdId) {
    return new Response(buildDoorEventsCsv([]), { status: 200, headers });
  }

  const timeZone = timeZoneFromCookie(cookies);
  const daysRaw = Number(url.searchParams.get("days") ?? "7");
  const { fromIso, toIso } = doorReportRange(
    { from: url.searchParams.get("from"), to: url.searchParams.get("to"), days: daysRaw },
    entitlements.historyDays,
    (day) => zonedDayStartIso(day, timeZone),
    (day) => zonedDayEndIso(day, timeZone),
  );

  const { devices } = await listHouseholdDevices(household.householdId);
  const report = await loadDoorReport(household.householdId, devices, fromIso, toIso, DOOR_CSV_LIMIT);
  if (report.error) {
    console.error("Door events CSV failed:", report.error);
    return new Response(apiUserMessages(locale).doorCsvFailed, { status: 500 });
  }
  if (report.truncated) {
    // Never hand over a silently partial file.
    return new Response(apiUserMessages(locale).doorCsvTooMany, { status: 422 });
  }
  if (report.readingsError) {
    // Readings failed: refuse rather than export blank columns that look like "no data".
    console.error("Door events CSV readings failed:", report.readingsError);
    return new Response(apiUserMessages(locale).doorCsvFailed, { status: 500 });
  }

  return new Response(buildDoorEventsCsv(report.rows), { status: 200, headers });
};
