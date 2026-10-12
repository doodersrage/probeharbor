import { summarizeStaleSensors, type StaleSensorSummary } from "./sensorFreshness";
import type { DeviceWithSensors } from "./devices";
import { resolveAlertEmail, type AlertSettings } from "./alerts";
import type { LatestSensorRow } from "./sensorReadings";
import { listLowBatteryDevices } from "./deviceBatteryUi";

export type ReadinessCheck = {
  id: string;
  label: string;
  ok: boolean;
  hint?: string;
  /** Where to fix it: the exact setting, so the checklist is actionable. */
  href?: string;
  /** Link text for href, e.g. "Turn on". */
  action?: string;
};

export type FreezeReadinessResult = {
  score: number;
  checks: ReadinessCheck[];
  ready: boolean;
};

export function hasConfiguredAlertChannel(
  alertSettings: AlertSettings,
  fallbackEmail?: string | null,
): boolean {
  return (
    (alertSettings.channelEmail &&
      Boolean(resolveAlertEmail(alertSettings, fallbackEmail))) ||
    (alertSettings.channelSms && Boolean(alertSettings.smsPhone?.trim())) ||
    (alertSettings.channelDiscord && Boolean(alertSettings.discordWebhookUrl?.trim())) ||
    alertSettings.channelPush ||
    (alertSettings.channelWebhook && Boolean(alertSettings.outboundWebhookUrl?.trim())) ||
    (alertSettings.channelTelegram &&
      Boolean(alertSettings.telegramBotToken?.trim() && alertSettings.telegramChatId?.trim())) ||
    (alertSettings.channelSlack && Boolean(alertSettings.slackWebhookUrl?.trim())) ||
    (alertSettings.channelTeams && Boolean(alertSettings.teamsWebhookUrl?.trim())) ||
    (alertSettings.channelNtfy && Boolean(alertSettings.ntfyTopic?.trim())) ||
    (alertSettings.channelPushover &&
      Boolean(alertSettings.pushoverUserKey?.trim() && alertSettings.pushoverAppToken?.trim())) ||
    (alertSettings.channelWhatsapp && Boolean(alertSettings.whatsappPhone?.trim()))
  );
}

export function computeFreezeReadiness(input: {
  alertSettings: AlertSettings;
  devices: DeviceWithSensors[];
  latest: LatestSensorRow[];
  weatherLocationConfigured: boolean;
  canUseForecast: boolean;
  canUseNws: boolean;
  hasSentAnyAlert: boolean;
  nowMs?: number;
}): FreezeReadinessResult {
  const {
    alertSettings,
    devices,
    latest,
    weatherLocationConfigured,
    canUseForecast,
    canUseNws,
    hasSentAnyAlert,
  } = input;

  const stale: StaleSensorSummary = summarizeStaleSensors(latest, devices);
  const lowBattery = listLowBatteryDevices(devices, alertSettings.batteryThresholdPct);

  const channelOk = alertSettings.enabled && hasConfiguredAlertChannel(alertSettings);
  const hasFloodSensor = devices.some((d) => d.sensors.some((s) => s.kind === "flood"));
  const hasLevelSensor = devices.some((d) => d.sensors.some((s) => s.kind === "level"));

  const checks: ReadinessCheck[] = [
    {
      id: "alerts_on",
      label: "Alerts enabled (freeze + auto flood)",
      ok: alertSettings.enabled,
      hint: alertSettings.enabled
        ? undefined
        : "Turn alerts on under Dashboard → Alerts: flood/leak contacts notify automatically when wet.",
      href: "/dashboard/alerts?tab=settings#alert-section-essentials",
      action: "Turn on",
    },
    {
      id: "channel",
      label: "At least one alert channel configured",
      ok: channelOk,
      hint: channelOk ? undefined : "Enable email, SMS, or another channel with a destination.",
      href: "/dashboard/alerts?tab=settings#alert-section-channels",
      action: "Set up channels",
    },
    {
      id: "test_alert",
      label: "Test alert sent at least once",
      ok: hasSentAnyAlert,
      hint: hasSentAnyAlert ? undefined : "Send a test from Dashboard → Alerts before cold season.",
      href: "/dashboard/alerts?tab=settings#send-test-alert",
      action: "Send a test",
    },
    {
      id: "devices",
      label: "Push or pull device registered",
      ok: devices.length > 0,
      hint: devices.length > 0 ? undefined : "Add a push device or pull feed under Dashboard → Devices.",
      href: "/dashboard/devices?view=setup",
      action: "Add a device",
    },
    {
      id: "flood_sensor",
      label: "Flood / leak contact registered",
      ok: hasFloodSensor,
      hint: hasFloodSensor
        ? undefined
        : "This is a sensor, not a setting: add a wet/dry leak contact under a water heater, laundry, or sump. It alerts automatically when wet. On an ESP32, wire it and tick \"Leak\" in the web flasher.",
      href: "/flash",
      action: "Web flasher",
    },
    {
      id: "fresh",
      label: "All probes reporting (not stale)",
      ok: stale.total === 0,
      hint:
        stale.total === 0
          ? undefined
          : stale.bannerMessage ?? `${stale.total} probe(s) haven't reported recently.`,
      href: "/dashboard/devices?view=ops",
      action: "Check devices",
    },
    {
      id: "battery",
      label: "No critically low probe batteries",
      ok: lowBattery.length === 0,
      hint:
        lowBattery.length === 0
          ? undefined
          : `${lowBattery.length} device(s) below ${alertSettings.batteryThresholdPct}% battery.`,
      href: "/dashboard/devices?view=ops",
      action: "Check batteries",
    },
    {
      id: "weather",
      label: "Weather / NWS location configured",
      ok: weatherLocationConfigured,
      hint: weatherLocationConfigured
        ? undefined
        : "Set outdoor weather in Dashboard → Settings (OpenWeather city, Ambient station, or WeatherFlow).",
      href: "/dashboard/settings",
      action: "Set location",
    },
    {
      id: "runway",
      label: "Time-to-freeze remaining-hours alerts",
      ok: alertSettings.runwayAlertEnabled,
      hint: alertSettings.runwayAlertEnabled
        ? undefined
        : "Enable remaining-hours alerts so you hear before the probe crosses freeze.",
      href: "/dashboard/alerts?tab=settings#setting-runway",
      action: "Turn on",
    },
  ];

  if (hasLevelSensor) {
    checks.push({
      id: "level_rule",
      label: "Optional: sump/tank level_above rule",
      ok: (alertSettings.alertRules ?? []).some(
        (rule) =>
          rule.enabled !== false &&
          (rule.all ?? []).some((c) => c.type === "level_above"),
      ),
      hint: "Level sensors display on Overview; add a Rules → level_above condition if you want pump-failure early warning.",
      href: "/dashboard/alerts?tab=settings#alert-section-automation",
      action: "Add a rule",
    });
  }

  if (canUseForecast) {
    checks.push({
      id: "forecast",
      label: "Forecast cold-risk alerts (Cold-snap mode)",
      ok: alertSettings.forecastFreezeEnabled,
      hint: alertSettings.forecastFreezeEnabled
        ? undefined
        : "Turn on \"Cold-snap mode\" under Alerts → Settings → Essentials to hear when the outdoor forecast may hit freeze.",
      href: "/dashboard/alerts?tab=settings#setting-forecast-freeze",
      action: "Turn on",
    });
  }

  if (canUseNws) {
    checks.push({
      id: "nws",
      label: "Official NWS freeze alerts enabled",
      ok: alertSettings.nwsFreezeAlertsEnabled,
      hint: alertSettings.nwsFreezeAlertsEnabled
        ? undefined
        : "Turn on NWS freeze/cold alerts under Alerts → Settings → More triggers.",
      href: "/dashboard/alerts?tab=settings#setting-nws",
      action: "Turn on",
    });
  }

  const passed = checks.filter((c) => c.ok).length;
  const score = checks.length > 0 ? Math.round((passed / checks.length) * 100) : 0;

  return {
    score,
    checks,
    ready:
      score >= 85 &&
      checks.find((c) => c.id === "alerts_on")?.ok === true &&
      channelOk,
  };
}
