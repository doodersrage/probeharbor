import { summarizeStaleSensors, type StaleSensorSummary } from "./sensorFreshness";
import type { DeviceWithSensors } from "./devices";
import { resolveAlertEmail, type AlertSettings } from "./alerts";
import type { LatestSensorRow } from "./sensorReadings";
import { listLowBatteryDevices } from "./deviceBatteryUi";
import { plural } from "../i18n/format";
import type { Locale } from "../i18n/locales";
import { overviewCardsMessages } from "../i18n/messages/app/overviewCards";

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
}, locale: Locale = "en"): FreezeReadinessResult {
  const c = overviewCardsMessages(locale).readiness.checks;
  const readinessText = overviewCardsMessages(locale).readiness;
  const {
    alertSettings,
    devices,
    latest,
    weatherLocationConfigured,
    canUseForecast,
    canUseNws,
    hasSentAnyAlert,
  } = input;

  const stale: StaleSensorSummary = summarizeStaleSensors(latest, devices, undefined, locale);
  const lowBattery = listLowBatteryDevices(devices, alertSettings.batteryThresholdPct);

  const channelOk = alertSettings.enabled && hasConfiguredAlertChannel(alertSettings);
  const hasFloodSensor = devices.some((d) => d.sensors.some((s) => s.kind === "flood"));
  const hasLevelSensor = devices.some((d) => d.sensors.some((s) => s.kind === "level"));

  const checks: ReadinessCheck[] = [
    {
      id: "alerts_on",
      label: c.alerts_on.label,
      ok: alertSettings.enabled,
      hint: alertSettings.enabled
        ? undefined
        : c.alerts_on.hint,
      href: "/dashboard/alerts?tab=settings#alert-section-essentials",
      action: c.alerts_on.action,
    },
    {
      id: "channel",
      label: c.channel.label,
      ok: channelOk,
      hint: channelOk ? undefined : c.channel.hint,
      href: "/dashboard/alerts?tab=settings#alert-section-channels",
      action: c.channel.action,
    },
    {
      id: "test_alert",
      label: c.test_alert.label,
      ok: hasSentAnyAlert,
      hint: hasSentAnyAlert ? undefined : c.test_alert.hint,
      href: "/dashboard/alerts?tab=settings#send-test-alert",
      action: c.test_alert.action,
    },
    {
      id: "devices",
      label: c.devices.label,
      ok: devices.length > 0,
      hint: devices.length > 0 ? undefined : c.devices.hint,
      href: "/dashboard/devices?view=setup",
      action: c.devices.action,
    },
    {
      id: "flood_sensor",
      label: c.flood_sensor.label,
      ok: hasFloodSensor,
      hint: hasFloodSensor
        ? undefined
        : c.flood_sensor.hint,
      href: "/flash",
      action: c.flood_sensor.action,
    },
    {
      id: "fresh",
      label: c.fresh.label,
      ok: stale.total === 0,
      hint:
        stale.total === 0
          ? undefined
          : (locale === "en" ? stale.bannerMessage : null) ??
            plural(readinessText.staleHint, stale.total, locale),
      href: "/dashboard/devices?view=ops",
      action: c.fresh.action,
    },
    {
      id: "battery",
      label: c.battery.label,
      ok: lowBattery.length === 0,
      hint:
        lowBattery.length === 0
          ? undefined
          : plural(readinessText.batteryHint, lowBattery.length, locale, {
              pct: alertSettings.batteryThresholdPct,
            }),
      href: "/dashboard/devices?view=ops",
      action: c.battery.action,
    },
    {
      id: "weather",
      label: c.weather.label,
      ok: weatherLocationConfigured,
      hint: weatherLocationConfigured
        ? undefined
        : c.weather.hint,
      href: "/dashboard/settings",
      action: c.weather.action,
    },
    {
      id: "runway",
      label: c.runway.label,
      ok: alertSettings.runwayAlertEnabled,
      hint: alertSettings.runwayAlertEnabled
        ? undefined
        : c.runway.hint,
      href: "/dashboard/alerts?tab=settings#setting-runway",
      action: c.runway.action,
    },
  ];

  if (hasLevelSensor) {
    checks.push({
      id: "level_rule",
      label: c.level_rule.label,
      ok: (alertSettings.alertRules ?? []).some(
        (rule) =>
          rule.enabled !== false &&
          (rule.all ?? []).some((c) => c.type === "level_above"),
      ),
      hint: c.level_rule.hint,
      href: "/dashboard/alerts?tab=settings#alert-section-automation",
      action: c.level_rule.action,
    });
  }

  if (canUseForecast) {
    checks.push({
      id: "forecast",
      label: c.forecast.label,
      ok: alertSettings.forecastFreezeEnabled,
      hint: alertSettings.forecastFreezeEnabled
        ? undefined
        : c.forecast.hint,
      href: "/dashboard/alerts?tab=settings#setting-forecast-freeze",
      action: c.forecast.action,
    });
  }

  if (canUseNws) {
    checks.push({
      id: "nws",
      label: c.nws.label,
      ok: alertSettings.nwsFreezeAlertsEnabled,
      hint: alertSettings.nwsFreezeAlertsEnabled
        ? undefined
        : c.nws.hint,
      href: "/dashboard/alerts?tab=settings#setting-nws",
      action: c.nws.action,
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
