import type { TempFeedConfig, TempFeedResult, TempProbeConfig } from "./tempFeedConfig";
import {
  evaluateAlerts,
  evaluateAlertDetails,
  formatThresholdAlertDetail,
  thresholdAlertTitle,
  evaluateBatteryHealth,
  evaluateFloodAlerts,
  evaluatePowerAlerts,
  evaluateForecastFreeze,
  evaluateOutage,
  isNewOutage,
  evaluateRateChange,
  evaluateRssiHealth,
  isAlertCooldownActive,
  isStaleAlertReading,
  alertTemp,
  type AlertDisplay,
  ALERT_COOLDOWN_MS,
  type AlertReading,
  type AlertChannelName,
  type AlertSettings,
  type FloodAlertReading,
} from "./alerts";
import {
  autoResolveAlerts,
  listRecentAlertEvents,
  listRecentAlertEventsFiltered,
  type AutoResolveResult,
} from "./alertEvents";
import type { Locale } from "../i18n/locales";
import { ensureLocale } from "../i18n/catalog";
import { fmt, plural } from "../i18n/format";
import { localeFromMetadata } from "../i18n/userLocale";
import { alertMessages } from "../i18n/messages/app/alertMessages";
import { isInQuietHours } from "./quietHours";
import { alertNumber } from "./alerts";

/**
 * Alert text in the recipient's language. Alerts can be triggered by ingest
 * requests (English request locale), so load the user's tables first; cheap
 * after the first call per isolate, and English needs nothing.
 */
async function alertText(locale: Locale) {
  await ensureLocale(locale, ["app"]);
  return alertMessages(locale);
}

const RECOVERY_MARGIN_F = 2;
const DAY_MS = 24 * 60 * 60 * 1000;

/** Closing alerts must never get in the way of sending them. */
async function safeAutoResolve(...args: Parameters<typeof autoResolveAlerts>): Promise<AutoResolveResult> {
  try {
    return await autoResolveAlerts(...args);
  } catch (error) {
    console.error("auto-resolve alerts failed:", error);
    return { resolved: 0, channels: [] };
  }
}

/**
 * Close recovered alerts and say so once, on the channels the alert itself
 * reached (no SMS for an alert that only went by email). Nothing is sent
 * when nothing was open, so this is quiet on every later reading.
 */
async function resolveAndAnnounceRecovery(
  userId: string,
  email: string | null | undefined,
  settings: AlertSettings,
  kind: "threshold" | "flood" | "outage" | "stuck" | "power" | "rule",
  notice: { title: string; body: string },
  locale: Locale = "en",
  announce = true,
): Promise<void> {
  const { resolved, channels } = await safeAutoResolve(userId, { kinds: [kind], reason: "recovered" });
  if (!announce || resolved === 0 || channels.length === 0) return;
  try {
    await notifyUser(
      userId,
      email,
      settings,
      { ...notice, kind: "recovery", meta: { recoveredKind: kind } },
      { channelFilter: channels as AlertChannelName[] },
      locale,
    );
  } catch (error) {
    console.error("recovery notice failed:", error);
  }
}

/** "Back to normal: Garage pipe 38.2°F, Attic 41.0°F (freeze line 32°F). …" */
export function formatFreezeRecoveryBody(
  settings: AlertSettings,
  readings: AlertReading[],
  locale: Locale = "en",
  display?: AlertDisplay,
): string {
  const t = alertMessages(locale).recovery;
  if (readings.length === 0) return t.freezeBodyEmpty;
  const temps = readings
    .map((reading) => fmt(t.freezeTemp, { label: reading.label, ...alertTemp(reading.tempf, locale, display, 1) }))
    .join(", ");
  const threshold = alertTemp(settings.freezeThresholdF, locale, display, display?.useCelsius ? 1 : 0);
  return fmt(t.freezeBody, { temps, threshold: threshold.temp, unit: threshold.unit });
}
import { freezeThresholdForReading, readingIncludedInThresholdAlerts } from "./thresholdSensorScope";
import { evaluateAlertRuleMatches, explainAlertRules, type RuleEvalContext, type RuleExplanation } from "./alertRules";
import {
  claimCooldown,
  getAlertSettingsForUser,
  markCooldown,
  markEscalation,
  notifyUser,
  releaseCooldown,
  saveAlertSettingsForUser,
} from "./notify";
import type { DeviceWithSensors } from "./devices";
import {
  fetchLatestSensorValues,
  getRecentNumericReadings,
  getFreezeDwellSamples,
  getRecentNumericReadingSamples,
  hasNumericReadingAboveSince,
} from "./sensorReadings";
import { isBoolSensorKind, isNumericSensorKind } from "./sensorKinds";
import {
  detectBatteryTrendDrop,
  type BatterySample,
} from "./batteryTrend";
import {
  deviceHealthFromDevices,
  readDeviceMetaNumber,
} from "./deviceHealth";
import {
  buildAlertReadingsFromLatestSensors,
  buildFloodReadingsFromLatestSensors,
  buildPowerOffReadingsFromLatestSensors,
  buildReadingsFromResults,
  mergeAlertReadings,
} from "./alertReadings";
import { fetchForecastMinTempForConfig, fetchWeatherSnapshotForConfig } from "./weatherContext";
import { personalWeatherConfigFromMetadata } from "./personalWeatherStations";
import { fetchNwsAlerts, hasFreezeRelatedNwsAlert } from "./nwsAlerts";
import { buildSnoozeUrl } from "./alertSnoozeTokens";
import { buildSiteUrl } from "./siteUrl";
import { persistDoorSessions, readDoorSessions } from "./doorEvents";
import { createAdminClient } from "./supabase";
import type { StuckSensor } from "./stuckSensors";
import { getUserEntitlements } from "./entitlements";
import { buildFreezeAlertContext } from "./alertContext";
import {
  buildTimeToFreezeProjection,
  evaluateRunwayAlert,
  outdoorPointsFromHourly,
} from "./spaceThermalModel";
import {
  fetchOpenMeteoHourlyWindow,
  splitOpenMeteoPastAndForecast,
} from "./openMeteoHistory";

export {
  buildAlertReadingsFromLatestSensors,
  buildFloodReadingsFromLatestSensors,
  buildReadingsFromResults,
  mergeAlertReadings,
} from "./alertReadings";

/** Retry an alert that reached no channel at most this often. */
const FAILED_DELIVERY_RETRY_MS = 30 * 60 * 1000;
/** Skips that mean "held back on purpose", which should still start the cooldown. */
const INTENTIONAL_SKIPS = new Set(["quiet_hours", "snooze_or_vacation"]);

/**
 * Every channel that was tried failed, and nothing was held back on purpose.
 * No channel tried at all (none set up) isn't a failure: retrying can't help.
 */
export function reachedNoOne(delivery: { sent: string[]; skipped: string[] }): boolean {
  return (
    delivery.sent.length === 0 &&
    delivery.skipped.length > 0 &&
    !delivery.skipped.some((reason) => INTENTIONAL_SKIPS.has(reason))
  );
}

/** An attempt of this kind in the retry window reached no one. */
async function recentFailedAttempt(userId: string, kind: string): Promise<boolean> {
  const { events } = await listRecentAlertEventsFiltered(userId, { limit: 5, kind }).catch(() => ({
    events: [],
  }));
  return events.some(
    (event) =>
      event.kind === kind &&
      Date.now() - Date.parse(event.created_at) < FAILED_DELIVERY_RETRY_MS &&
      reachedNoOne({ sent: event.channels_sent, skipped: event.channels_skipped }),
  );
}

/** The most recent rule alert reached someone and nobody has closed it yet. */
async function latestRuleAlert(userId: string) {
  const { events } = await listRecentAlertEventsFiltered(userId, { limit: 1, kind: "rule" }).catch(() => ({
    events: [],
  }));
  return events.find((event) => event.kind === "rule") ?? null;
}

async function latestRuleAlertOpen(userId: string): Promise<boolean> {
  const latest = await latestRuleAlert(userId);
  return Boolean(latest && latest.channels_sent.length > 0 && !latest.acknowledged_at);
}

/** An open rule alert is closed when its rules stop matching within this long (e.g. a door left open overnight). */
const RULE_RECOVERY_WINDOW_MS = DAY_MS;

/** A recovered condition can alert again after this long (limits flapping sensors). */
const RECOVERY_REARM_MS = 10 * 60 * 1000;

/**
 * Whether the cooldown still holds back a new alert of this kind. The 4h
 * cooldown is for one ongoing incident: once that incident recovered (auto-
 * resolved as "recovered" after the cooldown started, at least 10 min ago), a
 * new one alerts right away instead of waiting out the rest of the 4 hours.
 */
async function cooldownBlocks(userId: string, kind: string, lastSentAt: string | null | undefined): Promise<boolean> {
  if (!isAlertCooldownActive(lastSentAt)) return false;
  const sentMs = Date.parse(lastSentAt as string);
  const { events } = await listRecentAlertEventsFiltered(userId, { limit: 5, kind }).catch(() => ({
    events: [],
  }));
  const recovered = events.some((event) => {
    if (event.kind !== kind || event.meta?.autoResolved !== "recovered" || !event.acknowledged_at) return false;
    const recoveredMs = Date.parse(event.acknowledged_at);
    return recoveredMs >= sentMs && Date.now() - recoveredMs >= RECOVERY_REARM_MS;
  });
  return !recovered;
}

type CooldownField = Parameters<typeof markCooldown>[1];

/**
 * Claim, send, and keep the 4h cooldown only if someone was reached (or the
 * alert was held back on purpose).
 *
 * - The claim (compare-and-set from `previous`, the value this evaluation
 *   read) means concurrent evaluations send the alert once.
 * - If every channel failed, the claim is released so it retries, at most
 *   every 30 minutes. The cooldown timestamps double as "last alert sent",
 *   so they must not stay set for an alert nobody got.
 */
async function sendThenArmCooldown(
  userId: string,
  kind: string,
  field: CooldownField,
  previous: string | null,
  send: () => Promise<{ sent: string[]; skipped: string[] }>,
): Promise<void> {
  if (await recentFailedAttempt(userId, kind)) return;
  const claim = await claimCooldown(userId, field, previous);
  if (!claim.claimed) return; // another evaluation is sending this alert
  const delivery = await send();
  if (reachedNoOne(delivery)) {
    if (claim.claimedAt) await releaseCooldown(userId, field, claim.claimedAt, previous);
    return;
  }
  // The claim couldn't stamp the row (missing row or failed write): stamp it now.
  if (!claim.claimedAt) await markCooldown(userId, field);
}

/** True when someone has already acknowledged the most recent threshold alert. */
async function latestThresholdAlertAcknowledged(userId: string): Promise<boolean> {
  const events = await listRecentAlertEvents(userId, 20).catch(() => []);
  const latest = events.find((event) => event.kind === "threshold");
  return Boolean(latest?.acknowledged_at);
}

/**
 * "I'm on it" means the person knows: stay quiet while the same freeze
 * continues instead of repeating every cooldown window. A repeat goes out
 * only once a sensor has recovered above its threshold since the
 * acknowledgement and dropped again (a new incident). Humidity alerts, readings
 * without a sensor id, and lookup errors never suppress: when in doubt, alert.
 */
async function acknowledgedFreezeStillOngoing(
  userId: string,
  settings: AlertSettings,
  readings: AlertReading[],
  messages: string[],
  dwellSamplesBySensorId: Record<string, Array<{ at: string; tempF: number }>>,
): Promise<boolean> {
  const freezeOnly = evaluateAlerts(
    { ...settings, humidityThreshold: Number.POSITIVE_INFINITY },
    readings,
    { dwellSamplesBySensorId },
  );
  if (freezeOnly.length === 0 || freezeOnly.length !== messages.length) return false;

  const events = await listRecentAlertEvents(userId, 20).catch(() => null);
  const ackedAt = events?.find((event) => event.kind === "threshold")?.acknowledged_at;
  if (!ackedAt) return false;

  const freezing = readings.filter(
    (reading) =>
      readingIncludedInThresholdAlerts(settings.thresholdSensorScope, reading) &&
      reading.tempf <= freezeThresholdForReading(settings, reading),
  );
  if (freezing.length === 0 || freezing.some((reading) => !reading.sensorId)) return false;
  try {
    const recovered = await Promise.all(
      freezing.map((reading) =>
        hasNumericReadingAboveSince(reading.sensorId!, ackedAt, freezeThresholdForReading(settings, reading)),
      ),
    );
    return !recovered.some(Boolean);
  } catch {
    return false;
  }
}

export async function sendThresholdAlertsIfNeeded(
  userId: string,
  email: string | null | undefined,
  settings: AlertSettings,
  readings: AlertReading[],
  householdId?: string | null,
  context?: {
    weatherCityId?: string | null;
    latestSensors?: import("./sensorReadings").LatestSensorRow[];
    /** The recipient's °C/°F preference (user_metadata.use_celsius). */
    useCelsius?: boolean;
  },
  locale: Locale = "en",
): Promise<void> {
  if (!settings.enabled || readings.length === 0) return;
  const display: AlertDisplay = { useCelsius: context?.useCelsius === true };
  const t = await alertText(locale);

  let dwellSamplesBySensorId: Record<string, Array<{ at: string; tempF: number }>> =
    {};
  if (settings.freezeDwellMinutes > 0) {
    const cutoffIso = new Date(
      Date.now() - settings.freezeDwellMinutes * 60 * 1000,
    ).toISOString();
    const sensorIds = [
      ...new Set(
        readings
          .map((reading) => reading.sensorId)
          .filter((id): id is string => Boolean(id)),
      ),
    ];
    const pairs = await Promise.all(
      sensorIds.map(async (sensorId) => {
        const samples = await getFreezeDwellSamples(sensorId, cutoffIso);
        return [sensorId, samples] as const;
      }),
    );
    dwellSamplesBySensorId = Object.fromEntries(pairs);
  }

  const details = evaluateAlertDetails(settings, readings, { dwellSamplesBySensorId });
  const messages = details.map((detail) => formatThresholdAlertDetail(detail, locale, display));
  const title = thresholdAlertTitle(details, locale, display);
  const inScope = readings.filter((reading) =>
    readingIncludedInThresholdAlerts(settings.thresholdSensorScope, reading),
  );
  // "Back to normal" needs current readings: a probe that stopped reporting
  // while cold hasn't recovered, it's offline (the outage alert covers it).
  const recovered =
    details.length === 0 &&
    !inScope.some((reading) => isStaleAlertReading(settings, reading)) &&
    inScope.every((reading) => reading.tempf >= freezeThresholdForReading(settings, reading) + RECOVERY_MARGIN_F);
  if (recovered) {
    await resolveAndAnnounceRecovery(
      userId,
      email,
      settings,
      "threshold",
      { title: t.recovery.freezeTitle, body: formatFreezeRecoveryBody(settings, inScope, locale, display) },
      locale,
    );
  }
  if (messages.length > 0 && settings.escalationEnabled && settings.channelSms) {
    const lastAlert = settings.lastAlertSentAt
      ? Date.parse(settings.lastAlertSentAt)
      : NaN;
    const lastEsc = settings.lastEscalationAt
      ? Date.parse(settings.lastEscalationAt)
      : 0;
    const sinceLastAlert = Date.now() - lastAlert;
    // Escalate only within the incident the last alert opened: once its
    // cooldown lapses, a fresh alert goes out below instead.
    const elapsedOk =
      Number.isFinite(lastAlert) &&
      sinceLastAlert >= settings.escalationMinutes * 60 * 1000 &&
      isAlertCooldownActive(settings.lastAlertSentAt);
    const notEscalatedYet = !Number.isFinite(lastEsc) || lastEsc < lastAlert;
    if (elapsedOk && notEscalatedYet && !(await latestThresholdAlertAcknowledged(userId))) {
      await notifyUser(
        userId,
        email,
        settings,
        {
          title: fmt(t.threshold.escalated, { title }),
          body: messages.join("\n"),
          kind: "threshold",
        },
        { smsOnly: true },
        locale,
      );
      await markEscalation(userId);
    }
  }

  if (messages.length === 0) return;
  if (await cooldownBlocks(userId, "threshold", settings.lastAlertSentAt)) return;
  // A failed delivery skips the cooldown so it retries, but not on every reading.
  if (await recentFailedAttempt(userId, "threshold")) return;
  if (await acknowledgedFreezeStillOngoing(userId, settings, readings, messages, dwellSamplesBySensorId)) {
    return;
  }

  const alertSpace = readings.find((r) => r.space)?.space ?? null;
  // Annotate, never suppress: the annotation only adds context to an alert
  // that's already been decided on above -- it can't stop, delay, or
  // change whether this alert fires. A real freeze reading in the
  // monitored space is real regardless of what an unrelated house
  // thermostat reports.
  // Belt-and-suspenders on top of that helper's own internal try/catch: even
  // a bug in the thermostat-lookup path must never be able to block this
  // alert from sending.
  const coldest = readings.reduce((min, r) => (r.tempf < min.tempf ? r : min), readings[0]!);
  const contextBlock = await buildFreezeAlertContext({
    householdId,
    settings,
    weatherCityId: context?.weatherCityId ?? null,
    coldestTempF: coldest.tempf,
    coldestSensorId: coldest.sensorId ?? null,
    latestSensors: context?.latestSensors,
  }, locale).catch(() => null);

  const baseMessages = messages.join("\n");
  const body = contextBlock ? `${baseMessages}\n\n${contextBlock}` : baseMessages;
  const doorOpen = Boolean(
    context?.latestSensors?.some(
      (row) =>
        row.sensor.kind === "door" &&
        (row.value_bool === true || row.value_text === "open"),
    ),
  );
  // Claim first so concurrent evaluations send this freeze alert once.
  const claim = await claimCooldown(userId, "last_alert_sent_at", settings.lastAlertSentAt);
  if (!claim.claimed) return;
  const delivery = await notifyUser(userId, email, settings, {
    title,
    body,
    kind: "threshold",
    meta: {
      thresholdF: settings.freezeThresholdF,
      probeLabel: coldest.label ?? coldest.space ?? undefined,
      probeTempF: coldest.tempf,
      doorOpen,
      reasonSummary: contextBlock ?? undefined,
    },
  }, { space: alertSpace }, locale);
  if (reachedNoOne(delivery)) {
    // Nothing reached the user: release the claim so this retries
    // (throttled to every 30 min by recentFailedAttempt).
    if (claim.claimedAt) await releaseCooldown(userId, "last_alert_sent_at", claim.claimedAt, settings.lastAlertSentAt);
    return;
  }
  if (!claim.claimedAt) await markCooldown(userId, "last_alert_sent_at");
}

export async function sendFloodAlertsIfNeeded(
  userId: string,
  email: string | null | undefined,
  settings: AlertSettings,
  wetSensors: FloodAlertReading[],
  locale: Locale = "en",
): Promise<void> {
  const t = await alertText(locale);
  if (settings.enabled && wetSensors.length === 0) {
    await resolveAndAnnounceRecovery(
      userId,
      email,
      settings,
      "flood",
      { title: t.recovery.floodTitle, body: t.recovery.floodBody },
      locale,
    );
  }
  if (!settings.enabled || wetSensors.length === 0) return;
  if (await cooldownBlocks(userId, "flood", settings.lastFloodAlertAt)) return;

  const messages = evaluateFloodAlerts(settings, wetSensors, locale);
  if (messages.length === 0) return;

  const alertSpace = wetSensors.find((sensor) => sensor.space)?.space ?? null;
  await sendThenArmCooldown(userId, "flood", "last_flood_alert_at", settings.lastFloodAlertAt, () =>
    notifyUser(
      userId,
      email,
      settings,
      {
        title: t.flood.title,
        body: messages.join("\n"),
        kind: "flood",
      },
      { space: alertSpace },
      locale,
    ),
  );
}

export async function sendPowerAlertsIfNeeded(
  userId: string,
  email: string | null | undefined,
  settings: AlertSettings,
  offSensors: FloodAlertReading[],
  locale: Locale = "en",
): Promise<void> {
  const t = await alertText(locale);
  if (settings.enabled && offSensors.length === 0) {
    await resolveAndAnnounceRecovery(
      userId,
      email,
      settings,
      "power",
      { title: t.recovery.powerTitle, body: t.recovery.powerBody },
      locale,
    );
  }
  if (!settings.enabled || !settings.powerAlertsEnabled || offSensors.length === 0) return;
  if (await cooldownBlocks(userId, "power", settings.lastPowerAlertAt)) return;

  const messages = evaluatePowerAlerts(settings, offSensors, locale);
  if (messages.length === 0) return;
  const alertSpace = offSensors.find((sensor) => sensor.space)?.space ?? null;
  await sendThenArmCooldown(userId, "power", "last_power_alert_at", settings.lastPowerAlertAt, () =>
    notifyUser(
      userId,
      email,
      settings,
      {
        title: t.power.title,
        body: `${messages.join("\n")}\n${t.power.footer}`,
        kind: "power",
      },
      { space: alertSpace },
      locale,
    ),
  );
}

async function getWeatherConfigForUser(userId: string): Promise<import("./personalWeatherStations").PersonalWeatherConfig> {
  try {
    const admin = createAdminClient();
    const { data } = await admin.auth.admin.getUserById(userId);
    const meta = data.user?.user_metadata as Record<string, unknown> | undefined;
    const cityId =
      typeof meta?.weather_city_id === "string" && /^\d+$/.test(meta.weather_city_id.trim())
        ? meta.weather_city_id.trim()
        : null;
    return personalWeatherConfigFromMetadata(meta, cityId);
  } catch {
    return personalWeatherConfigFromMetadata(undefined, null);
  }
}

export async function maybeSendForecastFreezeAlert(
  userId: string,
  email: string | null | undefined,
  settings: AlertSettings,
  weatherCityId?: string | null,
  locale: Locale = "en",
  display?: AlertDisplay,
): Promise<void> {
  if (!settings.enabled || !settings.forecastFreezeEnabled) return;
  const entitlements = await getUserEntitlements(userId);
  if (!entitlements.canUseForecastAlerts) return;
  if (isAlertCooldownActive(settings.lastForecastAlertAt)) return;

  const config = await getWeatherConfigForUser(userId);
  const window = await fetchForecastMinTempForConfig(config, settings.forecastHoursAhead);
  const message = evaluateForecastFreeze(
    settings,
    window?.minTempF ?? null,
    settings.forecastHoursAhead,
    locale,
    display,
  );
  if (!message) return;

  const t = await alertText(locale);
  await sendThenArmCooldown(userId, "forecast", "last_forecast_alert_at", settings.lastForecastAlertAt, () =>
    notifyUser(userId, email, settings, {
      title: t.forecast.title,
      body: message,
      kind: "forecast",
    }, undefined, locale),
  );
}

export async function maybeSendRunwayAlert(
  userId: string,
  email: string | null | undefined,
  settings: AlertSettings,
  householdId?: string | null,
  latestSensors?: import("./sensorReadings").LatestSensorRow[],
  locale: Locale = "en",
): Promise<void> {
  if (!settings.enabled || !settings.runwayAlertEnabled) return;
  if (isAlertCooldownActive(settings.lastRunwayAlertAt)) return;

  const temps = (latestSensors ?? []).filter(
    (row) =>
      row.sensor.kind === "temperature" &&
      row.sensor.visible !== false &&
      typeof row.value_num === "number" &&
      Number.isFinite(row.value_num),
  );
  if (temps.length === 0) return;

  const coldest = temps.reduce((min, row) =>
    (row.value_num as number) < (min.value_num as number) ? row : min,
  );
  const currentTempF = coldest.value_num as number;
  if (currentTempF <= settings.freezeThresholdF) return;

  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const indoorSamples = await getRecentNumericReadingSamples(coldest.sensor.id, since).catch(
    () => [],
  );

  let outdoorPast: ReturnType<typeof outdoorPointsFromHourly> = [];
  let outdoorForecast: ReturnType<typeof outdoorPointsFromHourly> = [];
  try {
    const config = await getWeatherConfigForUser(userId);
    const snapshot = await fetchWeatherSnapshotForConfig(config);
    if (
      snapshot?.lat != null &&
      snapshot.lon != null &&
      Number.isFinite(snapshot.lat) &&
      Number.isFinite(snapshot.lon)
    ) {
      const hourly = await fetchOpenMeteoHourlyWindow(snapshot.lat, snapshot.lon);
      const split = splitOpenMeteoPastAndForecast(hourly);
      outdoorPast = outdoorPointsFromHourly(split.past);
      outdoorForecast = outdoorPointsFromHourly(split.forecast);
    }
  } catch {
    // Trend fallback still works without outdoor data.
  }

  const doorOpenNearby =
    latestSensors?.some(
      (row) =>
        row.sensor.kind === "door" &&
        (row.value_bool === true || row.value_text === "open"),
    ) ?? false;

  const projection = buildTimeToFreezeProjection({
    currentTempF,
    freezeThresholdF: settings.freezeThresholdF,
    indoorSamples,
    outdoorPast,
    outdoorForecast,
    doorOpenNearby,
    timeZone: settings.quietHoursTimezone,
    lookAheadHours: settings.forecastHoursAhead,
  }, locale);

  const t = await alertText(locale);
  const message = evaluateRunwayAlert(settings, projection, locale);
  if (!message) return;

  await sendThenArmCooldown(userId, "runway", "last_runway_alert_at", settings.lastRunwayAlertAt, () =>
    notifyUser(userId, email, settings, {
      title: t.runway.title,
      body: message,
      kind: "runway",
    }, undefined, locale),
  );
}

export async function maybeSendNwsFreezeAlert(
  userId: string,
  email: string | null | undefined,
  settings: AlertSettings,
  weatherCityId?: string | null,
  locale: Locale = "en",
): Promise<void> {
  if (!settings.enabled || !settings.nwsFreezeAlertsEnabled) return;
  const entitlements = await getUserEntitlements(userId);
  if (!entitlements.canUseNwsAlerts) return;
  if (isAlertCooldownActive(settings.lastNwsAlertAt)) return;

  const config = await getWeatherConfigForUser(userId);
  const snapshot = await fetchWeatherSnapshotForConfig(config);
  if (
    snapshot?.lat == null ||
    snapshot?.lon == null ||
    !Number.isFinite(snapshot.lat) ||
    !Number.isFinite(snapshot.lon)
  ) {
    return;
  }

  const summary = await fetchNwsAlerts(snapshot.lat, snapshot.lon);
  if (!hasFreezeRelatedNwsAlert(summary)) return;

  const first = summary!.alerts[0]!;
  const t = await alertText(locale);
  // The NWS headline itself is published in English; only our fallback is translated.
  const body = first.headline?.trim() || first.event || t.nws.fallback;

  await sendThenArmCooldown(userId, "nws", "last_nws_alert_at", settings.lastNwsAlertAt, () =>
    notifyUser(userId, email, settings, {
      title: t.nws.title,
      body,
      kind: "nws",
    }, undefined, locale),
  );
}

export async function maybeSendThresholdAlerts(
  userId: string,
  email: string | null | undefined,
  userMetadata: Record<string, unknown> | undefined,
  feeds: TempFeedConfig[],
  probes: TempProbeConfig[],
  existingResults?: TempFeedResult[],
  householdId?: string | null,
  devices?: DeviceWithSensors[],
  /** Recipient language; defaults to the account language in `userMetadata`. */
  locale: Locale = localeFromMetadata(userMetadata),
): Promise<void> {
  await ensureLocale(locale, ["app"]);
  const settings = await getAlertSettingsForUser(userId, userMetadata);
  const visibleProbes = probes.filter((probe) => probe.visible);

  let deviceList = devices ?? [];
  if (deviceList.length === 0 && householdId) {
    const { listHouseholdDevices } = await import("./devices");
    const listed = await listHouseholdDevices(householdId);
    deviceList = listed.devices;
  }

  let feedReadings: AlertReading[] = [];
  if (visibleProbes.length > 0 && feeds.length > 0) {
    let results = existingResults;
    if (!results) {
      const { fetchTemps } = await import("./FetchTemps");
      results = await fetchTemps({
        feeds,
        probes: visibleProbes,
        saveToDatabase: false,
      });
    }
    feedReadings = buildReadingsFromResults(results, visibleProbes, deviceList);
  }

  let sensorReadings: AlertReading[] = [];
  let floodReadings: FloodAlertReading[] = [];
  let powerOffReadings: FloodAlertReading[] = [];
  if (householdId) {
    const latest = await fetchLatestSensorValues(householdId);
    sensorReadings = buildAlertReadingsFromLatestSensors(latest);
    floodReadings = buildFloodReadingsFromLatestSensors(latest);
    powerOffReadings = buildPowerOffReadingsFromLatestSensors(latest);
  }

  const readings = mergeAlertReadings(feedReadings, sensorReadings);
  const weatherCityId =
    typeof userMetadata?.weather_city_id === "string"
      ? userMetadata.weather_city_id.trim()
      : null;
  const latest = householdId ? await fetchLatestSensorValues(householdId) : [];
  await sendThresholdAlertsIfNeeded(userId, email, settings, readings, householdId, {
    weatherCityId,
    latestSensors: latest,
    useCelsius: userMetadata?.use_celsius === true,
  }, locale);
  await sendFloodAlertsIfNeeded(userId, email, settings, floodReadings, locale);
  await sendPowerAlertsIfNeeded(userId, email, settings, powerOffReadings, locale);
  await maybeSendForecastFreezeAlert(userId, email, settings, undefined, locale, {
    useCelsius: userMetadata?.use_celsius === true,
  });
  await maybeSendRunwayAlert(userId, email, settings, householdId, latest, locale);
  await maybeSendNwsFreezeAlert(userId, email, settings, undefined, locale);
  await safeAutoResolve(userId, { kinds: ["forecast", "nws", "runway", "rate"], olderThanMs: DAY_MS, reason: "expired" });
  await safeAutoResolve(userId, { olderThanMs: 7 * DAY_MS, reason: "expired" });
}

async function buildRuleContext(
  settings: AlertSettings,
  devices: DeviceWithSensors[],
  readings: AlertReading[],
  householdId?: string | null,
  /** False for read-only checks (rule debugger): don't write door sessions. */
  persist = true,
): Promise<RuleEvalContext> {
  const boolSensors: RuleEvalContext["boolSensors"] = [];
  const numericSensors: RuleEvalContext["numericSensors"] = [];
  const doorOpenSessions: RuleEvalContext["doorOpenSessions"] = [];
  const doorSince = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  if (householdId) {
    const latest = await fetchLatestSensorValues(householdId);
    for (const row of latest) {
      if (isBoolSensorKind(row.sensor.kind) && typeof row.value_bool === "boolean") {
        boolSensors.push({
          label: row.sensor.label,
          kind: row.sensor.kind,
          value: row.value_bool,
        });
      }
      if (
        isNumericSensorKind(row.sensor.kind) &&
        typeof row.value_num === "number" &&
        Number.isFinite(row.value_num)
      ) {
        numericSensors.push({
          label: row.sensor.label,
          kind: row.sensor.kind,
          value: row.value_num,
        });
      }
    }

    const sensorIdByLabel = new Map<string, string>();

    for (const device of devices) {
      for (const sensor of device.sensors) {
        if (sensor.kind !== "door") continue;
        sensorIdByLabel.set(sensor.label, sensor.id);
        // True start even for a door open since before the 24 h window,
        // so "open longer than N minutes" measures the whole opening.
        const sessions = await readDoorSessions({ id: sensor.id, label: sensor.label }, doorSince);
        doorOpenSessions.push(...sessions);
      }
    }

    if (persist) try {
      await persistDoorSessions(householdId, doorOpenSessions as import("./doorDuration").DoorOpenSession[], sensorIdByLabel);
    } catch (err) {
      console.error("persistDoorSessions failed:", err);
    }
  }

  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const rateDrops: RuleEvalContext["rateDrops"] = [];
  for (const device of devices) {
    for (const sensor of device.sensors) {
      if (sensor.kind !== "temperature" || !sensor.visible) continue;
      const values = await getRecentNumericReadings(sensor.id, since);
      if (values.length < 2) continue;
      const drop = values[0]! - values[values.length - 1]!;
      if (drop > 0) {
        rateDrops.push({ label: sensor.label, dropF: drop });
      }
    }
  }

  const now = Date.now();
  const outages: RuleEvalContext["outages"] = [];
  for (const device of devices.filter((d) => d.enabled)) {
    if (!device.last_seen_at) {
      outages.push({ deviceName: device.name, hoursSilent: 999 });
      continue;
    }
    const last = Date.parse(device.last_seen_at);
    if (Number.isNaN(last)) continue;
    outages.push({
      deviceName: device.name,
      hoursSilent: (now - last) / (60 * 60 * 1000),
    });
  }

  return {
    readings,
    boolSensors,
    numericSensors,
    doorOpenSessions,
    rateDrops,
    outages,
    freezeThresholdF: settings.freezeThresholdF,
    humidityThreshold: settings.humidityThreshold,
    rateChangeF: settings.rateChangeF,
    outageHours: settings.outageHours,
  };
}

async function attachOutdoorTemp(userId: string, settings: AlertSettings, ctx: RuleEvalContext): Promise<void> {
  // Weather costs an API call, so only look it up when a live rule needs it.
  const needsOutdoor = settings.alertRules.some(
    (rule) => rule.enabled && rule.all?.some((condition) => condition.type === "outdoor_below"),
  );
  if (!needsOutdoor) return;
  try {
    const snapshot = await fetchWeatherSnapshotForConfig(await getWeatherConfigForUser(userId));
    ctx.outdoorTempF = snapshot && Number.isFinite(snapshot.temp) ? snapshot.temp : null;
  } catch {
    ctx.outdoorTempF = null;
  }
}

export type RuleCheckReport = {
  checkedAt: string;
  alertsEnabled: boolean;
  /** When the rule cooldown ends, if one is running (rules send at most every 4h). */
  cooldownUntil: string | null;
  rules: RuleExplanation[];
};

/**
 * Read-only: evaluate the saved rules against the latest stored readings and
 * say why each one would or wouldn't fire right now. Sends nothing.
 */
export async function explainRulesForUser(
  userId: string,
  settings: AlertSettings,
  householdId: string,
  devices: DeviceWithSensors[],
  locale: Locale = "en",
): Promise<RuleCheckReport> {
  const latest = await fetchLatestSensorValues(householdId);
  const readings = buildAlertReadingsFromLatestSensors(latest);
  const ctx = await buildRuleContext(settings, devices, readings, householdId, false);
  await attachOutdoorTemp(userId, settings, ctx);
  const lastSent = settings.lastRuleAlertAt ? Date.parse(settings.lastRuleAlertAt) : NaN;
  const cooldownUntil =
    isAlertCooldownActive(settings.lastRuleAlertAt) && Number.isFinite(lastSent)
      ? new Date(lastSent + ALERT_COOLDOWN_MS).toISOString()
      : null;
  return {
    checkedAt: new Date().toISOString(),
    alertsEnabled: settings.enabled,
    cooldownUntil,
    rules: explainAlertRules(settings.alertRules, ctx, locale),
  };
}

export async function maybeSendRuleAlerts(
  userId: string,
  email: string | null | undefined,
  devices: DeviceWithSensors[],
  settings: AlertSettings,
  readings: AlertReading[],
  householdId?: string | null,
  locale: Locale = "en",
): Promise<void> {
  if (!settings.enabled || settings.alertRules.length === 0) return;
  // Rules have their own cooldown so a rule match never silences freeze alerts.
  const inCooldown = isAlertCooldownActive(settings.lastRuleAlertAt);
  // During the cooldown, only evaluate when the last rule alert is still open
  // (to notice it ended) or has recovered (a new match may alert). Otherwise
  // skip the evaluation entirely, as before.
  if (inCooldown && !(await latestRuleAlertOpen(userId)) && (await cooldownBlocks(userId, "rule", settings.lastRuleAlertAt))) {
    return;
  }

  const ctx = await buildRuleContext(settings, devices, readings, householdId);
  await attachOutdoorTemp(userId, settings, ctx);
  const t = await alertText(locale);
  const matches = evaluateAlertRuleMatches(settings.alertRules, ctx, locale);
  if (matches.length === 0) {
    // Nothing matches any more: close the open rule alert, so the next match
    // alerts (after 10 min) instead of waiting out the 4h cooldown. A door
    // alert also gets a short "cleared" notice on the channels it reached;
    // other rules re-arm silently.
    const lastMs = settings.lastRuleAlertAt ? Date.parse(settings.lastRuleAlertAt) : Number.NaN;
    if (Number.isFinite(lastMs) && Date.now() - lastMs < RULE_RECOVERY_WINDOW_MS) {
      const latest = await latestRuleAlert(userId);
      await resolveAndAnnounceRecovery(
        userId,
        email,
        settings,
        "rule",
        { title: t.recovery.doorTitle, body: t.recovery.doorBody },
        locale,
        Boolean(latest?.meta?.doorRule),
      );
    }
    return;
  }
  if (await cooldownBlocks(userId, "rule", settings.lastRuleAlertAt)) return;

  const doorRule = matches.some((match) => match.involvesDoor);
  await sendThenArmCooldown(userId, "rule", "last_rule_alert_at", settings.lastRuleAlertAt, () =>
    notifyUser(userId, email, settings, {
      title: t.rule.title,
      body: matches.map((match) => match.message).join("\n"),
      kind: "rule",
      ...(doorRule ? { meta: { doorRule: true } } : {}),
    }, undefined, locale),
  );
}

export async function maybeSendRateAndOutageAlerts(
  userId: string,
  email: string | null | undefined,
  devices: DeviceWithSensors[],
  settings: AlertSettings,
  householdId?: string | null,
  readings: AlertReading[] = [],
  locale: Locale = "en",
  display?: AlertDisplay,
): Promise<void> {
  if (!settings.enabled) return;
  const t = await alertText(locale);

  const outageMessages: string[] = [];
  let stillOutCount = 0;
  for (const device of devices.filter((d) => d.enabled)) {
    const msg = evaluateOutage(settings, device.name, device.last_seen_at, undefined, locale);
    if (!msg) continue;
    // Report each outage once; devices already reported stay quiet until they recover.
    if (isNewOutage(settings, device.last_seen_at)) outageMessages.push(msg);
    else stillOutCount += 1;
  }

  if (outageMessages.length === 0 && stillOutCount === 0) {
    await resolveAndAnnounceRecovery(
      userId,
      email,
      settings,
      "outage",
      { title: t.recovery.outageTitle, body: t.recovery.outageBody },
      locale,
    );
  }

  if (outageMessages.length > 0 && !isAlertCooldownActive(settings.lastOutageAlertAt)) {
    const body =
      stillOutCount > 0
        ? [
            ...outageMessages,
            plural(t.outage.stillOffline, stillOutCount, locale),
          ]
        : outageMessages;
    await sendThenArmCooldown(userId, "outage", "last_outage_alert_at", settings.lastOutageAlertAt, () =>
      notifyUser(userId, email, settings, {
        title: t.outage.title,
        body: body.join("\n"),
        kind: "outage",
      }, undefined, locale),
    );
  }

  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const rateMessages: string[] = [];

  for (const device of devices) {
    for (const sensor of device.sensors) {
      if (sensor.kind !== "temperature" || !sensor.visible) continue;
      const values = await getRecentNumericReadings(sensor.id, since);
      const msg = evaluateRateChange(settings, sensor.label, values, locale, display);
      if (msg) rateMessages.push(msg);
    }
  }

  if (rateMessages.length > 0 && !isAlertCooldownActive(settings.lastRateAlertAt)) {
    await sendThenArmCooldown(userId, "rate", "last_rate_alert_at", settings.lastRateAlertAt, () =>
      notifyUser(userId, email, settings, {
        title: t.rate.title,
        body: rateMessages.join("\n"),
        kind: "rate",
      }, undefined, locale),
    );
  }

  await maybeSendRuleAlerts(
    userId,
    email,
    devices,
    settings,
    readings,
    householdId,
    locale,
  );
}

/** One stuck-probe alert a day at most; it stays open until the readings move again. */
const STUCK_ALERT_COOLDOWN_MS = DAY_MS;

export async function maybeSendStuckSensorAlerts(
  userId: string,
  email: string | null | undefined,
  settings: AlertSettings,
  stuck: StuckSensor[],
  locale: Locale = "en",
): Promise<void> {
  if (!settings.enabled) return;
  const t = await alertText(locale);
  if (stuck.length === 0) {
    await resolveAndAnnounceRecovery(
      userId,
      email,
      settings,
      "stuck",
      { title: t.recovery.stuckTitle, body: t.recovery.stuckBody },
      locale,
    );
    return;
  }
  const events = await listRecentAlertEvents(userId, 50).catch(() => []);
  const recentlySent = events.some(
    (event) => event.kind === "stuck" && Date.now() - Date.parse(event.created_at) < STUCK_ALERT_COOLDOWN_MS,
  );
  if (recentlySent) return;

  const title =
    stuck.length === 1
      ? fmt(t.stuck.titleOne, { label: stuck[0]!.label })
      : fmt(t.stuck.titleMany, { count: alertNumber(stuck.length, locale) });
  await notifyUser(userId, email, settings, {
    title,
    body: stuck.map((sensor) => sensor.message).join("\n"),
    kind: "stuck",
    meta: { probeLabel: stuck[0]!.label },
  }, undefined, locale);
}

export async function maybeSendDeviceHealthAlerts(
  userId: string,
  email: string | null | undefined,
  devices: DeviceWithSensors[],
  settings: AlertSettings,
  siteBaseUrl?: string,
  stuck?: StuckSensor[],
  locale: Locale = "en",
): Promise<void> {
  if (!settings.enabled) return;
  const t = await alertText(locale);
  if (stuck) await maybeSendStuckSensorAlerts(userId, email, settings, stuck, locale);

  const health = deviceHealthFromDevices(devices);
  const base = siteBaseUrl ?? buildSiteUrl();
  const snoozeUrl = await buildSnoozeUrl(base, userId);
  const notifyOpts = { snoozeUrl };

  const batteryMessages = evaluateBatteryHealth(settings, health, locale);
  if (
    batteryMessages.length > 0 &&
    !isAlertCooldownActive(settings.lastBatteryAlertAt)
  ) {
    await sendThenArmCooldown(userId, "battery", "last_battery_alert_at", settings.lastBatteryAlertAt, () =>
      notifyUser(
        userId,
        email,
        settings,
        {
          title: t.battery.title,
          body: batteryMessages.join("\n"),
          kind: "battery",
        },
        notifyOpts,
        locale,
      ),
    );
  }

  const rssiMessages = evaluateRssiHealth(settings, health, locale);
  if (rssiMessages.length > 0 && !isAlertCooldownActive(settings.lastRssiAlertAt)) {
    await sendThenArmCooldown(userId, "rssi", "last_rssi_alert_at", settings.lastRssiAlertAt, () =>
      notifyUser(
        userId,
        email,
        settings,
        {
          title: t.rssi.title,
          body: rssiMessages.join("\n"),
          kind: "rssi",
        },
        notifyOpts,
        locale,
      ),
    );
  }

  if (settings.batteryTrendAlertsEnabled) {
    for (const device of devices) {
      const history = device.meta?.battery_history as BatterySample[] | undefined;
      const trend = detectBatteryTrendDrop(Array.isArray(history) ? history : [], undefined, undefined, locale);
      if (trend && !isAlertCooldownActive(settings.lastBatteryTrendAlertAt)) {
        await sendThenArmCooldown(userId, "battery", "last_battery_trend_alert_at", settings.lastBatteryTrendAlertAt, () =>
          notifyUser(
            userId,
            email,
            settings,
            {
              title: t.battery.trendTitle,
              body: fmt(t.battery.trendBody, { device: device.name, trend }),
              kind: "battery",
            },
            notifyOpts,
            locale,
          ),
        );
        break;
      }
    }
  }
}

export async function updateUserAlertSettings(
  _accessToken: string,
  _refreshToken: string,
  userId: string,
  settings: AlertSettings,
): Promise<{ error: Error | null }> {
  const result = await saveAlertSettingsForUser(userId, settings);
  return { error: result.error ? new Error(result.error) : null };
}

/** Look back this far for the end of quiet hours (the cron runs every 15 min). */
const QUIET_END_WINDOW_MS = 20 * 60 * 1000;
/** At most this many held alert titles in the recap. */
const QUIET_SUMMARY_MAX_ITEMS = 5;

/**
 * Quiet hours hold routine alerts instead of sending them. When they end, send
 * one recap of what was held, so nothing is silently lost. Runs from the
 * 15-minute cron; a digest event marked quietHoursSummary keeps it to once.
 */
export async function maybeSendQuietHoursSummary(
  userId: string,
  email: string | null | undefined,
  settings: AlertSettings,
  locale: Locale = "en",
  now = Date.now(),
): Promise<void> {
  if (!settings.enabled || !settings.quietHoursEnabled) return;
  if (isInQuietHours(settings, new Date(now))) return;
  if (!isInQuietHours(settings, new Date(now - QUIET_END_WINDOW_MS))) return;

  const { events } = await listRecentAlertEventsFiltered(userId, { limit: 50 }).catch(() => ({ events: [] }));
  const lastSummary = events.find((event) => event.kind === "digest" && event.meta?.quietHoursSummary);
  const lastSummaryMs = lastSummary ? Date.parse(lastSummary.created_at) : -Infinity;
  if (now - lastSummaryMs < 30 * 60 * 1000) return;

  const dayAgo = now - 24 * 60 * 60 * 1000;
  const held = events.filter((event) => {
    const at = Date.parse(event.created_at);
    return event.channels_skipped.includes("quiet_hours") && at > lastSummaryMs && at > dayAgo;
  });
  if (held.length === 0) return;

  const t = alertMessages(locale).quietSummary;
  const lines = held.slice(0, QUIET_SUMMARY_MAX_ITEMS).map((event) => `• ${event.title}`);
  if (held.length > QUIET_SUMMARY_MAX_ITEMS) {
    lines.push(fmt(t.more, { count: alertNumber(held.length - QUIET_SUMMARY_MAX_ITEMS, locale) }));
  }
  await notifyUser(
    userId,
    email,
    settings,
    { title: t.title, body: `${t.intro}\n${lines.join("\n")}`, kind: "digest", meta: { quietHoursSummary: true } },
    undefined,
    locale,
  );
}
