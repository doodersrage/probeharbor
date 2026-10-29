import type { APIRoute } from "astro";
import { getAuthFromCookies } from "../../../lib/auth";
import { computeDoorOpenSessions } from "../../../lib/doorDuration";
import { listDoorEvents } from "../../../lib/doorEvents";
import { listHouseholdDevices } from "../../../lib/devices";
import { getOrCreateHouseholdForUser } from "../../../lib/households";
import { fetchRecentBoolReadings } from "../../../lib/sensorReadings";
import { listDoorEventsForReport, DOOR_REPORT_LIMIT } from "../../../lib/doorEventReport";
import { getUserEntitlements } from "../../../lib/entitlements";
import { clampIsoToHistoryWindow } from "../../../lib/retentionSchedule";
import { parseRangeBound, timeZoneFromCookie } from "../../../lib/zonedDay";
import { apiCommonMessages, apiLocale } from "../../../i18n/messages/app/api/common";
import { apiUserMessages } from "../../../i18n/messages/app/api/user";

/** Openings per response when a date range is given (default / max). */
const RANGE_DEFAULT_LIMIT = 100;

/**
 * Door openings for the signed-in household.
 *
 * Without from/to: the latest `limit` saved openings (default 12, max 50),
 * as before. With `from` and/or `to`: openings that started in that range,
 * newest first, clamped to the plan's history window; `limit` default 100,
 * max 500; the response adds `range` and `truncated` (more than `limit`).
 * `live_sessions` (door open/close in the last 24 h) is unchanged.
 */
export const GET: APIRoute = async ({ cookies, url, locals }) => {
  const locale = apiLocale({ locals });
  const tc = apiCommonMessages(locale);
  const { session, user } = await getAuthFromCookies(cookies);
  if (!session || !user) {
    return new Response(JSON.stringify({ error: tc.unauthorized }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const household = await getOrCreateHouseholdForUser(user.id, user.email);
  if (!household.householdId) {
    return new Response(JSON.stringify({ live_sessions: [], history: [] }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const timeZone = timeZoneFromCookie(cookies);
  const fromBound = parseRangeBound(url.searchParams.get("from"), timeZone, false);
  const toBound = parseRangeBound(url.searchParams.get("to"), timeZone, true);
  const rangeMode = fromBound !== undefined || toBound !== undefined;
  const tu = apiUserMessages(locale);
  if (fromBound === null || toBound === null) {
    return new Response(JSON.stringify({ error: tu.doorEventsInvalidDate }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const limitRaw = Number(url.searchParams.get("limit") ?? (rangeMode ? RANGE_DEFAULT_LIMIT : 12));
  const maxLimit = rangeMode ? DOOR_REPORT_LIMIT : 50;
  const fallbackLimit = rangeMode ? RANGE_DEFAULT_LIMIT : 12;
  const limit = Number.isFinite(limitRaw)
    ? Math.min(Math.max(Math.floor(limitRaw), 1), maxLimit)
    : fallbackLimit;

  let range: { from: string; to: string } | null = null;
  if (rangeMode) {
    const { historyDays } = await getUserEntitlements(user.id);
    const from = clampIsoToHistoryWindow(fromBound, historyDays);
    const to = toBound ?? new Date().toISOString();
    if (Date.parse(from) > Date.parse(to)) {
      return new Response(JSON.stringify({ error: tu.doorEventsRangeOrder }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    range = { from, to };
  }

  const [{ devices }, history, ranged] = await Promise.all([
    listHouseholdDevices(household.householdId),
    range ? Promise.resolve([]) : listDoorEvents(household.householdId, limit),
    range ? listDoorEventsForReport(household.householdId, range.from, range.to, limit) : Promise.resolve(null),
  ]);
  if (ranged?.error) {
    console.error("door-events range query failed:", ranged.error);
    return new Response(JSON.stringify({ error: tu.doorEventsFailed }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const doorSince = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const liveSessions = [];

  for (const device of devices) {
    for (const sensor of device.sensors) {
      if (sensor.kind !== "door") continue;
      const readings = await fetchRecentBoolReadings(sensor.id, doorSince);
      liveSessions.push(
        ...computeDoorOpenSessions(
          readings.map((r) => ({
            label: sensor.label,
            kind: "door",
            value: r.value,
            recordedAt: r.recordedAt,
          })),
        ),
      );
    }
  }

  return new Response(
    JSON.stringify({
      live_sessions: liveSessions.map((session) => ({
        label: session.label,
        opened_at: session.openedAt,
        closed_at: session.closedAt,
        duration_ms: session.durationMs,
        still_open: session.stillOpen,
      })),
      history: ranged
        ? ranged.events.map((event) => ({
            id: event.id,
            label: event.label,
            opened_at: event.openedAt,
            closed_at: event.closedAt,
            duration_ms: event.durationMs,
          }))
        : history.map((event) => ({
            id: event.id,
            label: event.label,
            opened_at: event.opened_at,
            closed_at: event.closed_at,
            duration_ms: event.duration_ms,
          })),
      ...(range ? { range, truncated: ranged?.truncated === true } : {}),
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    },
  );
};
