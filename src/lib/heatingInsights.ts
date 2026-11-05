import type { ChartPoint } from "./garageTempsHistory";
import type { ThermostatSnapshot } from "./thermostatCorrelation";
import { isThermostatCooling, isThermostatHeating } from "./thermostatCorrelation";
import { fmt, formatNumber } from "../i18n/format";
import type { Locale } from "../i18n/locales";
import { overviewCardsMessages } from "../i18n/messages/app/overviewCards";
import { displayTempInputValue, tempUnitLabel, toDisplayDelta, toDisplayTemp } from "./temperatureFormat";

export type HeatingInsight = {
  label: string;
  detail: string;
  severity: "info" | "warning";
};

/** Estimate heating loss rate (°F/h) from recent indoor samples vs outdoor temp. */
export function estimateHeatingLossRate(
  indoorPoints: ChartPoint[],
  outdoorTempF: number | null,
): number | null {
  const temps = indoorPoints
    .filter((p) => Number.isFinite(p.tempf))
    .slice(-12);
  if (temps.length < 2) return null;

  const first = temps[0]!;
  const last = temps[temps.length - 1]!;
  const hours =
    (Date.parse(last.timestamp) - Date.parse(first.timestamp)) / (60 * 60 * 1000);
  if (hours <= 0) return null;

  const rate = (last.tempf - first.tempf) / hours;
  if (!Number.isFinite(rate)) return null;

  // Normalize: colder outdoor should correlate with faster drop
  if (outdoorTempF != null && outdoorTempF < 32 && rate < 0) {
    return rate;
  }
  return rate;
}

/** Dew point °F from air temperature and relative humidity (Magnus-Tetens). */
export function dewPointF(tempF: number, rhPct: number): number | null {
  if (!Number.isFinite(tempF) || !Number.isFinite(rhPct) || rhPct <= 0 || rhPct > 100) {
    return null;
  }
  const tC = (tempF - 32) * (5 / 9);
  const a = 17.62;
  const b = 243.12;
  const gamma = Math.log(rhPct / 100) + (a * tC) / (b + tC);
  const tdC = (b * gamma) / (a - gamma);
  if (!Number.isFinite(tdC)) return null;
  return tdC * (9 / 5) + 32;
}

function fixed(value: number, digits: number, locale: Locale): string {
  return formatNumber(value, locale, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
    useGrouping: false,
  });
}

export function buildHeatingInsights(
  options: {
    indoorPoints: ChartPoint[];
    outdoorTempF: number | null;
    freezeThresholdF: number;
    doorOpenMinutes?: number | null;
    /** Live house temp from thermostat OAuth or an indoor reference probe. */
    houseTempF?: number | null;
    thermostatSnapshot?: ThermostatSnapshot | null;
  },
  locale: Locale = "en",
  /**
   * The °C display preference: only the wording changes. Every rule below
   * still compares stored °F values. Temperatures convert with the offset;
   * the rate, margins and the house gap are differences (×5/9, no offset).
   */
  useCelsius = false,
): HeatingInsight[] {
  const t = overviewCardsMessages(locale).heating;
  const unit = tempUnitLabel(useCelsius);
  const shownThreshold = displayTempInputValue(options.freezeThresholdF, useCelsius);
  const threshold = locale === "en" ? String(shownThreshold) : formatNumber(shownThreshold, locale);
  const temp = (valueF: number, digits: number) => fixed(toDisplayTemp(valueF, useCelsius), digits, locale);
  const delta = (valueF: number, digits: number) => fixed(toDisplayDelta(valueF, useCelsius), digits, locale);
  const insights: HeatingInsight[] = [];
  const latest = options.indoorPoints.filter((p) => Number.isFinite(p.tempf)).at(-1);
  if (!latest) return insights;

  const rate = estimateHeatingLossRate(options.indoorPoints, options.outdoorTempF);
  if (rate != null && rate <= -2) {
    insights.push({
      label: t.rapidDrop.label,
      detail: fmt(t.rapidDrop.detail, { rate: delta(Math.abs(rate), 1), unit }),
      severity: "warning",
    });
  }

  if (
    options.doorOpenMinutes != null &&
    options.doorOpenMinutes >= 10 &&
    rate != null &&
    rate < 0
  ) {
    insights.push({
      label: t.doorOpen.label,
      detail: fmt(t.doorOpen.detail, { minutes: fixed(Math.round(options.doorOpenMinutes), 0, locale) }),
      severity: "warning",
    });
  }

  if (latest.tempf <= options.freezeThresholdF + 5) {
    insights.push({
      label: t.nearFreeze.label,
      detail: fmt(t.nearFreeze.detail, { temp: temp(latest.tempf, 1), threshold, unit }),
      severity: latest.tempf <= options.freezeThresholdF ? "warning" : "info",
    });
  }

  if (options.outdoorTempF != null && options.outdoorTempF <= 20 && latest.tempf > options.freezeThresholdF) {
    const margin = latest.tempf - options.freezeThresholdF;
    insights.push({
      label: t.coldSnap.label,
      detail: fmt(t.coldSnap.detail, {
        outdoor: temp(options.outdoorTempF, 0),
        margin: delta(margin, 0),
        unit,
      }),
      severity: margin <= 8 ? "warning" : "info",
    });
  }

  const dewPoint = latest.humidity == null ? null : dewPointF(latest.tempf, latest.humidity);
  if (dewPoint != null) {
    const margin = latest.tempf - dewPoint;
    if (margin <= 5) {
      insights.push({
        label: t.condensation.label,
        detail: fmt(t.condensation.detail, {
          dewPoint: temp(dewPoint, 0),
          margin: delta(Math.max(0, margin), 0),
          unit,
        }),
        severity: margin <= 2 ? "warning" : "info",
      });
    }
  }

  const houseTempF =
    options.houseTempF ??
    options.thermostatSnapshot?.ambientTempF ??
    null;
  const thermostat = options.thermostatSnapshot;

  if (houseTempF != null && Number.isFinite(latest.tempf)) {
    const house = temp(houseTempF, 0);
    const gapF = houseTempF - latest.tempf;
    if (gapF >= 12) {
      insights.push({
        label: t.houseGap.label,
        detail: fmt(thermostat ? t.houseGap.detailThermostat : t.houseGap.detailReference, {
          house,
          probe: temp(latest.tempf, 1),
          delta: delta(gapF, 0),
          unit,
        }),
        severity: latest.tempf <= options.freezeThresholdF + 5 ? "warning" : "info",
      });
    }

    if (latest.tempf <= options.freezeThresholdF && houseTempF > options.freezeThresholdF + 10) {
      insights.push({
        label: t.warmHouse.label,
        detail: fmt(t.warmHouse.detail, { threshold, house, unit }),
        severity: "info",
      });
    }

    if (thermostat && isThermostatHeating(thermostat.hvacMode) && latest.tempf < houseTempF - 15) {
      insights.push({
        label: t.hvacHeating.label,
        detail: fmt(t.hvacHeating.detail, { house, unit }),
        severity: "info",
      });
    }

    if (thermostat && isThermostatCooling(thermostat.hvacMode) && latest.tempf > houseTempF + 10) {
      insights.push({
        label: t.hvacCooling.label,
        detail: fmt(t.hvacCooling.detail, { house, unit }),
        severity: "info",
      });
    }
  }

  return insights;
}
