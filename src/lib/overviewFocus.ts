/**
 * Which Overview a user sees: first-run focus (device → freeze email → test
 * alert) until the essentials are done, then Simple or Insights. Pure; the
 * page (src/pages/dashboard.astro) destructures the result under the same
 * names it used inline.
 */
import type { AlertSettings } from "./alerts";
import type { DashboardOverviewMode } from "./dashboardOverviewMode";
import type { DeviceWithSensors } from "./devices";
import { hasConfiguredAlertChannel } from "./freezeReadiness";

export type OverviewFocusInput = {
  devices: Pick<DeviceWithSensors, "source">[];
  /** Latest value per sensor (any count; only emptiness matters here). */
  latestCount: number;
  alertSettings: AlertSettings;
  userEmail: string | null | undefined;
  /** The alert log has a delivered alert (test sends don't set cooldown stamps). */
  hasDelivery: boolean;
  canEdit: boolean;
  onboardingDismissed: boolean;
  overviewMode: DashboardOverviewMode;
};

/** The newest "an alert went out" stamp among the kinds the Overview reports. */
export function latestAlertSentAt(settings: AlertSettings): string | null {
  return (
    [
      settings.lastAlertSentAt,
      settings.lastOutageAlertAt,
      settings.lastRateAlertAt,
      settings.lastForecastAlertAt,
      settings.lastRunwayAlertAt,
      settings.lastFloodAlertAt,
      settings.lastNwsAlertAt,
    ]
      .filter((at): at is string => Boolean(at))
      .sort((a, b) => Date.parse(b) - Date.parse(a))[0] ?? null
  );
}

export function overviewFocus(input: OverviewFocusInput) {
  // Any device or feed, demo included: with freeze email + one alert it ends
  // first-run focus, so the demo feed can still be explored on Overview.
  const hasDevices =
    input.devices.some((d) => d.source === "push" || d.source === "pull_url") || input.latestCount > 0;
  const lastAlertAt = latestAlertSentAt(input.alertSettings);
  const hasSentAnyAlert = Boolean(lastAlertAt) || input.hasDelivery;
  /** Live probes or a configured device, alerts on, and a delivered test/real alert. */
  const essentialDone =
    hasDevices &&
    input.alertSettings.enabled &&
    hasSentAnyAlert &&
    hasConfiguredAlertChannel(input.alertSettings, input.userEmail);
  const firstRunFocus = input.canEdit && !input.onboardingDismissed && !essentialDone;
  const showInsights = !firstRunFocus && input.overviewMode === "insights";
  return { hasDevices, lastAlertAt, hasSentAnyAlert, essentialDone, firstRunFocus, showInsights };
}
