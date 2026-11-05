import type { APIRoute } from "astro";
import { getAuthFromCookies } from "../../../lib/auth";
import { getOrCreateHouseholdForUser, getUserHouseholdRole } from "../../../lib/households";
import { getAlertSettingsForUser } from "../../../lib/notify";
import { listHouseholdDevices } from "../../../lib/devices";
import { fetchLatestSensorValuesResult } from "../../../lib/sensorReadings";
import { formatRelativeAge, STALE_MS } from "../../../lib/relativeTime";
import { summarizeStaleSensors } from "../../../lib/sensorFreshness";
import { computeGarageRiskStatus } from "../../../lib/garageRiskStatus";
import { getDisplayPreferencesFromMetadata } from "../../../lib/userPreferences";
import { countUnacknowledgedAlerts } from "../../../lib/alertEvents";
import {
  formatAlertPauseUntil,
  getAlertPauseState,
  isSnoozeActive,
  isVacationActive,
} from "../../../lib/alertSnooze";
import { fetchWeatherForUser } from "../../../lib/weatherContext";
import { overviewCardsMessages } from "../../../i18n/messages/app/overviewCards";
import { apiCommonMessages, apiLocale } from "../../../i18n/messages/app/api/common";
import { shellMessages } from "../../../i18n/messages/app/shell";

export const GET: APIRoute = async ({ cookies, locals }) => {
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
  const householdId = household.householdId;
  const [devicesResult, latestResult, alertSettings, unacked, role, weather] =
    await Promise.all([
      householdId
        ? listHouseholdDevices(householdId)
        : Promise.resolve({
            devices: [] as Awaited<ReturnType<typeof listHouseholdDevices>>["devices"],
            error: null,
          }),
      householdId
        ? fetchLatestSensorValuesResult(householdId)
        : Promise.resolve({ rows: [], error: null }),
      getAlertSettingsForUser(user.id, user.user_metadata as Record<string, unknown>),
      countUnacknowledgedAlerts(user.id),
      householdId ? getUserHouseholdRole(user.id, householdId) : Promise.resolve(null),
      fetchWeatherForUser(user).catch(() => null),
    ]);

  // Don't let a failed query refresh the card into "add your first probe":
  // the page keeps what it rendered and shows its offline banner.
  const loadError = devicesResult.error || latestResult.error;
  if (loadError) {
    console.error("dashboard-snapshot devices/readings load failed:", loadError);
    return new Response(JSON.stringify({ error: shellMessages(locale).loadError.title }), {
      status: 503,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  }
  const latest = latestResult.rows;
  const devices = devicesResult.devices;
  const newestReading =
    latest
      .map((row) => row.recorded_at)
      .filter(Boolean)
      .sort((a, b) => Date.parse(b!) - Date.parse(a!))[0] ?? null;
  const lastAge = formatRelativeAge(newestReading, tc.never, locale);
  const staleSummary = summarizeStaleSensors(latest, devices, undefined, locale);
  const coldestProbeTempF = (() => {
    // Match Overview: skip probes whose last reading is stale.
    const temps = latest
      .filter(
        (row) =>
          row.sensor.kind === "temperature" &&
          row.value_num != null &&
          Date.now() - Date.parse(row.recorded_at) < STALE_MS,
      )
      .map((row) => row.value_num as number);
    return temps.length > 0 ? Math.min(...temps) : null;
  })();
  const wetFloodCount = latest.filter(
    (row) => row.sensor.kind === "flood" && row.value_bool === true,
  ).length;
  const sensorCount = devices.reduce((sum, device) => sum + device.sensors.length, 0);
  const liveSensorCount = latest.filter(
    (row) => row.recorded_at && !formatRelativeAge(row.recorded_at, tc.never, locale).stale,
  ).length;
  const coldestMarginF =
    coldestProbeTempF != null
      ? coldestProbeTempF - alertSettings.freezeThresholdF
      : null;
  const outdoorTempF =
    typeof weather?.temp === "number" && Number.isFinite(weather.temp)
      ? weather.temp
      : null;
  const showColdSnapChecklist =
    alertSettings.forecastFreezeEnabled &&
    outdoorTempF != null &&
    outdoorTempF <= alertSettings.freezeThresholdF + 10;

  const risk = computeGarageRiskStatus({
    hasDevices: devices.length > 0,
    hasLiveReading: latest.length > 0,
    coldestProbeTempF,
    freezeThresholdF: alertSettings.freezeThresholdF,
    staleSensorCount: staleSummary.total,
    nightsRiskCount: 0,
    alertsEnabled: alertSettings.enabled,
    hasEmailAlerts: alertSettings.channelEmail,
    outdoorTempF,
    showColdSnapChecklist,
    hoursUntilFreeze: null,
    hitsAtLabel: null,
    wetFloodCount,
    // riskDetail is display text for the Overview, so it follows the °C preference;
    // the numeric fields below stay °F.
    useCelsius: getDisplayPreferencesFromMetadata(user).useCelsius,
  }, locale, overviewCardsMessages(locale).garageRisk);

  const alertPause = alertSettings.enabled ? getAlertPauseState(alertSettings) : null;

  const body = {
    at: new Date().toISOString(),
    householdId,
    role,
    risk: risk.level,
    riskTitle: risk.title,
    riskDetail: risk.detail,
    riskActionLabel: risk.actionLabel,
    riskActionHref: risk.actionHref,
    lastReadingAt: newestReading,
    lastReadingAge: lastAge.label,
    lastReadingLagging: lastAge.lagging,
    staleSensors: staleSummary.total,
    staleBannerMessage: staleSummary.bannerMessage,
    sensorCount,
    liveSensorCount,
    unackedAlerts: unacked,
    coldestProbeTempF,
    coldestMarginF,
    freezeThresholdF: alertSettings.freezeThresholdF,
    outdoorTempF,
    alertsEnabled: alertSettings.enabled,
    snoozeActive: isSnoozeActive(alertSettings),
    vacationActive: isVacationActive(alertSettings),
    snoozeUntil: alertSettings.snoozeUntil,
    vacationUntil: alertSettings.vacationUntil,
    /** When routine alerts resume (snooze/vacation), formatted; null when not paused. */
    alertsPausedUntilLabel: alertPause
      ? formatAlertPauseUntil(alertPause.until, locale, alertSettings.quietHoursTimezone)
      : null,
  };

  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "private, max-age=30",
    },
  });
};
