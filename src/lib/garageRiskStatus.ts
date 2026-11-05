import {
  alertsSettingsPath,
  devicesOpsPath,
  devicesSetupPath,
} from "./dashboardDeepLinks";
import { fmt, formatNumber, plural } from "../i18n/format";
import type { Locale } from "../i18n/locales";
import {
  displayTempInputValue,
  tempUnitLabel,
  toDisplayDelta,
  toDisplayTemp,
} from "./temperatureFormat";
// English table only: this module also runs in the ProbeDemo island, so it
// can't import a message getter. Server callers pass the translated table.
import overviewCardsEn, { type GarageRiskText } from "../i18n/messages/app/overviewCards/en";

/**
 * Single Overview status: is the monitored space OK, worth watching, or at freeze/flood risk?
 */

export type GarageRiskLevel = "ok" | "watch" | "risk" | "offline";

export type GarageRiskStatus = {
  level: GarageRiskLevel;
  /** Set when the status itself is about stale probes, so pages can skip a duplicate stale notice. */
  reason?: "stale";
  title: string;
  detail: string;
  actionLabel: string;
  actionHref: string;
};

/** As before in English (`String(n)`); locale digits elsewhere. */
function rawNumber(value: number, locale: Locale): string {
  return locale === "en" ? String(value) : formatNumber(value, locale);
}

function fixed(value: number, digits: number, locale: Locale): string {
  return formatNumber(value, locale, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
    useGrouping: false,
  });
}

/** "Within 5°F of the freeze line" in the display unit: a difference, so 5 °F is 2.8 °C. */
export const NEAR_FREEZE_BAND_F = 5;

/**
 * The near-freeze band as text ("5°F" in English as before, "5 °F" / "2,8 °C"
 * elsewhere), for the `{near}` placeholder in the status detail and the
 * "How this status is chosen" note.
 */
export function nearFreezeBandLabel(locale: Locale, useCelsius: boolean): string {
  const value = useCelsius
    ? fixed(toDisplayDelta(NEAR_FREEZE_BAND_F, true), 1, locale)
    : rawNumber(NEAR_FREEZE_BAND_F, locale);
  return `${value}${locale === "en" ? "" : " "}${tempUnitLabel(useCelsius)}`;
}

/**
 * `locale` formats numbers; `text` is the wording
 * (`overviewCardsMessages(locale).garageRisk` on the server, English by default).
 */
export function computeGarageRiskStatus(
  input: {
    hasDevices: boolean;
    hasLiveReading: boolean;
    coldestProbeTempF: number | null;
    freezeThresholdF: number;
    staleSensorCount: number;
    nightsRiskCount: number;
    alertsEnabled: boolean;
    hasEmailAlerts: boolean;
    outdoorTempF: number | null;
    showColdSnapChecklist: boolean;
    hoursUntilFreeze?: number | null;
    hitsAtLabel?: string | null;
    /** Currently wet flood/leak contacts (from latest readings). */
    wetFloodCount?: number;
    /** Word temperatures in °C (the dashboard display preference). Inputs stay °F. */
    useCelsius?: boolean;
  },
  locale: Locale = "en",
  text: GarageRiskText = overviewCardsEn.garageRisk,
): GarageRiskStatus {
  const t = text;
  const useCelsius = input.useCelsius === true;
  const unit = tempUnitLabel(useCelsius);
  // °F as before; °C to at most a tenth (34 °F → 1.1 °C).
  const threshold = rawNumber(displayTempInputValue(input.freezeThresholdF, useCelsius), locale);
  const tempText = (tempF: number) => fixed(toDisplayTemp(tempF, useCelsius), 1, locale);

  if (!input.hasDevices) {
    return {
      level: "watch",
      title: t.noDevices.title,
      detail: t.noDevices.detail,
      actionLabel: t.noDevices.action,
      actionHref: devicesSetupPath(),
    };
  }

  if (!input.hasLiveReading) {
    return {
      level: "offline",
      title: t.waiting.title,
      detail: t.waiting.detail,
      actionLabel: t.waiting.action,
      actionHref: devicesSetupPath(),
    };
  }

  const wetCount = input.wetFloodCount ?? 0;
  if (wetCount > 0) {
    return {
      level: "risk",
      title: wetCount === 1 ? t.wet.titleOne : t.wet.titleMany,
      detail: plural(t.wet.detail, Math.max(1, wetCount), locale),
      actionLabel: t.actions.openLive,
      actionHref: "/dashboard/live",
    };
  }

  const belowFreeze =
    input.coldestProbeTempF != null &&
    Number.isFinite(input.coldestProbeTempF) &&
    input.coldestProbeTempF <= input.freezeThresholdF;

  if (belowFreeze) {
    return {
      level: "risk",
      title: t.freezeNow.title,
      detail: fmt(t.freezeNow.detail, { temp: tempText(input.coldestProbeTempF!), threshold, unit }),
      actionLabel: t.actions.openAlerts,
      actionHref: "/dashboard/alerts",
    };
  }

  const hoursUntil = input.hoursUntilFreeze;
  if (hoursUntil != null && Number.isFinite(hoursUntil) && hoursUntil > 0) {
    if (hoursUntil <= 4) {
      return {
        level: "risk",
        title: t.freezeSoon.title,
        detail: input.hitsAtLabel
          ? fmt(t.freezeSoon.detailAt, { threshold, unit, time: input.hitsAtLabel })
          : fmt(t.freezeSoon.detail, { threshold, unit }),
        actionLabel: t.actions.openTimeToFreeze,
        actionHref: "#time-to-freeze",
      };
    }
  }

  // Stale probes are a watch-level problem. They must not hide a freeze that a
  // fresh probe is reporting right now (or within 4 h), so they come after the
  // risk-level branches above. The stale row still renders inside the card on
  // the Overview whenever the headline is about something else.
  if (input.staleSensorCount > 0) {
    return {
      level: "watch",
      reason: "stale",
      title: t.stale.title,
      detail: plural(t.stale.detail, Math.max(1, input.staleSensorCount), locale),
      actionLabel: t.actions.checkDevices,
      actionHref: devicesOpsPath(),
    };
  }

  if (hoursUntil != null && Number.isFinite(hoursUntil) && hoursUntil > 0) {
    if (hoursUntil <= 12) {
      return {
        level: "watch",
        title: input.hitsAtLabel
          ? fmt(t.freezeLater.titleAt, { time: input.hitsAtLabel })
          : t.freezeLater.title,
        detail: fmt(t.freezeLater.detail, {
          hours: hoursUntil < 10 ? fixed(hoursUntil, 1, locale) : fixed(hoursUntil, 0, locale),
          threshold,
          unit,
        }),
        actionLabel: t.actions.openTimeToFreeze,
        actionHref: "#time-to-freeze",
      };
    }
  }

  if (input.showColdSnapChecklist) {
    return {
      level: "watch",
      title:
        input.nightsRiskCount > 0
          ? plural(t.nightsAtRisk, input.nightsRiskCount, locale)
          : t.coldSnap.title,
      detail: t.coldSnap.detail,
      actionLabel: t.actions.coldSnapChecklist,
      actionHref: "#cold-snap",
    };
  }

  if (input.nightsRiskCount > 0) {
    return {
      level: "watch",
      title: plural(t.nightsAtRisk, input.nightsRiskCount, locale),
      detail: t.nights.detail,
      actionLabel: t.actions.openLive,
      actionHref: "/dashboard/live",
    };
  }

  if (!input.alertsEnabled || !input.hasEmailAlerts) {
    return {
      level: "watch",
      title: t.finishAlerts.title,
      detail: t.finishAlerts.detail,
      actionLabel: t.finishAlerts.action,
      actionHref: alertsSettingsPath("alert-section-essentials"),
    };
  }

  const nearFreeze =
    input.coldestProbeTempF != null &&
    Number.isFinite(input.coldestProbeTempF) &&
    input.coldestProbeTempF <= input.freezeThresholdF + NEAR_FREEZE_BAND_F;

  if (nearFreeze) {
    return {
      level: "watch",
      title: t.nearFreeze.title,
      detail: fmt(t.nearFreeze.detail, {
        temp: tempText(input.coldestProbeTempF!),
        threshold,
        unit,
        near: nearFreezeBandLabel(locale, useCelsius),
      }),
      actionLabel: t.actions.openLive,
      actionHref: "/dashboard/live",
    };
  }

  return {
    level: "ok",
    title: t.ok.title,
    detail: t.ok.detail,
    actionLabel: t.actions.openLive,
    actionHref: "/dashboard/live",
  };
}
