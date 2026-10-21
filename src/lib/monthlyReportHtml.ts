import type { ChartPoint } from "./garageTempsHistory";
import type { NightRisk } from "./FetchWeather";
import type { FreezeHoursSummary } from "./freezeHours";
import {
  buildBrandedEmailHtml,
  formatEmailCount,
  formatEmailDate,
  formatEmailNumber,
  formatEmailValue,
  type EmailSection,
} from "./emailLayout";
import { fmt } from "../i18n/format";
import { LOCALE_META, type Locale } from "../i18n/locales";
import { reportEmailMessages } from "../i18n/messages/app/email/reports";

export type MonthlyProbeSummary = {
  label: string;
  minF: number;
  maxF: number;
  avgHumidity: number;
  readingCount: number;
};

export type MonthlyReportData = {
  monthLabel: string;
  /** Lookback window used for readings (30 monthly / 90 quarterly). */
  periodDays: number;
  reportKind: "monthly" | "quarterly";
  readingCount: number;
  minTempF: number | null;
  maxTempF: number | null;
  avgTempF: number | null;
  freezeThresholdF: number;
  nightsAtRisk: number;
  nights: NightRisk[];
  freezeHours: FreezeHoursSummary;
  probes: MonthlyProbeSummary[];
  alertsUrl: string;
  historyUrl: string;
  /** Signed one-click unsubscribe link for this report kind. */
  unsubscribeUrl?: string | null;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatTemp(value: number | null, locale: Locale = "en"): string {
  return value != null ? `${formatEmailNumber(value, 1, locale)}°F` : "—";
}

function reportTitle(data: MonthlyReportData, locale: Locale = "en"): string {
  const t = reportEmailMessages(locale);
  return data.reportKind === "quarterly" ? t.titleQuarterly : t.titleMonthly;
}

/** Forecast night label: English keeps the weather feed's label, others re-format the date. */
function nightLabel(night: NightRisk, locale: Locale): string {
  if (locale === "en" || !/^\d{4}-\d{2}-\d{2}$/.test(night.date ?? "")) return night.dateLabel;
  return formatEmailDate(
    `${night.date}T12:00:00Z`,
    { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" },
    locale,
  );
}

export function summarizeProbesForReport(points: ChartPoint[]): MonthlyProbeSummary[] {
  const byProbe = new Map<string, ChartPoint[]>();
  for (const point of points) {
    const group = byProbe.get(point.probeLabel) ?? [];
    group.push(point);
    byProbe.set(point.probeLabel, group);
  }

  return [...byProbe.entries()].map(([label, probePoints]) => {
    const temps = probePoints.map((p) => p.tempf);
    const humidities = probePoints.map((p) => p.humidity);
    return {
      label,
      minF: Math.min(...temps),
      maxF: Math.max(...temps),
      avgHumidity:
        humidities.reduce((sum, value) => sum + value, 0) / humidities.length,
      readingCount: probePoints.length,
    };
  });
}

export function buildMonthlyReportPlainText(data: MonthlyReportData, locale: Locale = "en"): string {
  const t = reportEmailMessages(locale);
  const p = t.plain;
  const num = (value: number, digits: number) => formatEmailNumber(value, digits, locale);
  const lines = [
    fmt(data.reportKind === "quarterly" ? p.headerQuarterly : p.headerMonthly, { label: data.monthLabel }),
    "",
    fmt(p.readings, { days: data.periodDays, count: formatEmailValue(data.readingCount, locale) }),
    fmt(p.coldest, { temp: formatTemp(data.minTempF, locale) }),
    fmt(p.warmest, { temp: formatTemp(data.maxTempF, locale) }),
    fmt(p.average, { temp: formatTemp(data.avgTempF, locale) }),
    fmt(p.freezeHours, {
      threshold: formatEmailValue(data.freezeThresholdF, locale),
      hours: num(data.freezeHours.hoursBelow34, 1),
    }),
    fmt(p.nightsAtRisk, { count: formatEmailValue(data.nightsAtRisk, locale) }),
    "",
  ];

  if (data.probes.length > 0) {
    lines.push(p.byProbe);
    for (const probe of data.probes) {
      lines.push(
        `  ${fmt(p.probeLine, {
          probe: probe.label,
          min: num(probe.minF, 1),
          max: num(probe.maxF, 1),
          humidity: num(probe.avgHumidity, 0),
          readings: formatEmailCount(t.readings, probe.readingCount, locale),
        })}`,
      );
    }
    lines.push("");
  }

  if (data.nights.length > 0) {
    lines.push(p.upcomingNights);
    for (const night of data.nights) {
      lines.push(
        `  ${fmt(night.atRisk ? p.nightAtRisk : p.nightOk, {
          night: nightLabel(night, locale),
          low: num(night.minTempF, 0),
        })}`,
      );
    }
    lines.push("");
  }

  lines.push(fmt(p.manageAlerts, { url: data.alertsUrl }));
  if (data.unsubscribeUrl) lines.push(fmt(p.unsubscribe, { url: data.unsubscribeUrl }));
  lines.push(fmt(p.viewHistory, { url: data.historyUrl }));
  lines.push("");
  lines.push(p.attached);

  return lines.join("\n");
}

function statBlock(label: string, value: string, detail?: string): string {
  return `<div style="background:#0f1f2c;border:1px solid #1e3a4d;border-radius:12px;padding:16px">
    <div style="color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:0.04em">${escapeHtml(label)}</div>
    <div style="color:#f8fafc;font-size:24px;font-weight:600;margin-top:6px">${escapeHtml(value)}</div>
    ${detail ? `<div style="color:#64748b;font-size:12px;margin-top:4px">${escapeHtml(detail)}</div>` : ""}
  </div>`;
}

export function buildMonthlyReportHtmlDocument(data: MonthlyReportData, locale: Locale = "en"): string {
  const t = reportEmailMessages(locale);
  const num = (value: number, digits: number) => formatEmailNumber(value, digits, locale);
  const probeRows =
    data.probes.length === 0
      ? `<tr><td colspan="4" style="padding:12px;color:#94a3b8">${escapeHtml(fmt(t.noProbeReadings, { days: data.periodDays }))}</td></tr>`
      : data.probes
          .map(
            (probe) =>
              `<tr>
                <td style="padding:10px 12px;border-top:1px solid #1e3a4d">${escapeHtml(probe.label)}</td>
                <td style="padding:10px 12px;border-top:1px solid #1e3a4d">${num(probe.minF, 1)}–${num(probe.maxF, 1)}°F</td>
                <td style="padding:10px 12px;border-top:1px solid #1e3a4d">${num(probe.avgHumidity, 0)}%</td>
                <td style="padding:10px 12px;border-top:1px solid #1e3a4d">${formatEmailValue(probe.readingCount, locale)}</td>
              </tr>`,
          )
          .join("");

  const nightRows =
    data.nights.length === 0
      ? `<tr><td colspan="3" style="padding:12px;color:#94a3b8">${escapeHtml(t.noForecast)}</td></tr>`
      : data.nights
          .map(
            (night) =>
              `<tr>
                <td style="padding:10px 12px;border-top:1px solid #1e3a4d">${escapeHtml(nightLabel(night, locale))}</td>
                <td style="padding:10px 12px;border-top:1px solid #1e3a4d">${num(night.minTempF, 0)}°F</td>
                <td style="padding:10px 12px;border-top:1px solid #1e3a4d;color:${night.atRisk ? "#f87171" : "#4ade80"}">${escapeHtml(night.atRisk ? t.atRisk : t.ok)}</td>
              </tr>`,
          )
          .join("");

  return `<!DOCTYPE html>
<html lang="${LOCALE_META[locale].htmlLang}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(fmt(t.documentTitle, { label: data.monthLabel }))}</title>
</head>
<body style="margin:0;padding:24px;background:#07111a;color:#e2e8f0;font-family:system-ui,-apple-system,sans-serif;line-height:1.5">
  <div style="max-width:720px;margin:0 auto">
    <header style="margin-bottom:24px">
      <p style="margin:0 0 8px;font-size:13px;font-weight:800;letter-spacing:-0.02em"><span style="color:#c5cbd3">Probe</span><span style="color:#22b8d4">Harbor</span></p>
      <h1 style="margin:0 0 8px;font-size:28px;color:#f8fafc">${escapeHtml(reportTitle(data, locale))} — ${escapeHtml(data.monthLabel)}</h1>
      <p style="margin:0;color:#94a3b8">${escapeHtml(fmt(t.snapshotIntro, { days: data.periodDays }))}</p>
    </header>

    <section style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin-bottom:24px">
      ${statBlock(t.statReadings, formatEmailValue(data.readingCount, locale))}
      ${statBlock(t.statColdest, formatTemp(data.minTempF, locale))}
      ${statBlock(t.statWarmest, formatTemp(data.maxTempF, locale))}
      ${statBlock(t.statAverage, formatTemp(data.avgTempF, locale))}
      ${statBlock(t.statFreezeHours, fmt(t.hoursValue, { hours: num(data.freezeHours.hoursBelow34, 1) }), `≤ ${formatEmailValue(data.freezeThresholdF, locale)}°F`)}
      ${statBlock(t.statNightsAtRisk, formatEmailValue(data.nightsAtRisk, locale), t.next7Days)}
    </section>

    <section style="margin-bottom:24px">
      <h2 style="margin:0 0 12px;font-size:18px;color:#f8fafc">${escapeHtml(t.byProbe)}</h2>
      <table style="width:100%;border-collapse:collapse;background:#0b1a25;border:1px solid #1e3a4d;border-radius:12px;overflow:hidden">
        <thead>
          <tr style="background:#0f1f2c;color:#94a3b8;text-align:left;font-size:12px">
            <th style="padding:10px 12px">${escapeHtml(t.colProbe)}</th>
            <th style="padding:10px 12px">${escapeHtml(t.colRange)}</th>
            <th style="padding:10px 12px">${escapeHtml(t.colAvgHumidity)}</th>
            <th style="padding:10px 12px">${escapeHtml(t.colReadings)}</th>
          </tr>
        </thead>
        <tbody>${probeRows}</tbody>
      </table>
    </section>

    <section style="margin-bottom:24px">
      <h2 style="margin:0 0 12px;font-size:18px;color:#f8fafc">${escapeHtml(t.forecastNights)}</h2>
      <table style="width:100%;border-collapse:collapse;background:#0b1a25;border:1px solid #1e3a4d;border-radius:12px;overflow:hidden">
        <thead>
          <tr style="background:#0f1f2c;color:#94a3b8;text-align:left;font-size:12px">
            <th style="padding:10px 12px">${escapeHtml(t.colNight)}</th>
            <th style="padding:10px 12px">${escapeHtml(t.colLow)}</th>
            <th style="padding:10px 12px">${escapeHtml(t.colStatus)}</th>
          </tr>
        </thead>
        <tbody>${nightRows}</tbody>
      </table>
    </section>

    <footer style="border-top:1px solid #1e3a4d;padding-top:16px;color:#94a3b8;font-size:13px">
      <p style="margin:0 0 8px">
        <a href="${escapeHtml(data.historyUrl)}" style="color:#67d3e6">${escapeHtml(t.viewHistory)}</a>
        ·
        <a href="${escapeHtml(data.alertsUrl)}" style="color:#67d3e6">${escapeHtml(t.manageAlerts)}</a>
      </p>
      <p style="margin:0">${escapeHtml(t.printHint)}</p>
    </footer>
  </div>
</body>
</html>`;
}

function freezeCalloutBody(data: MonthlyReportData, locale: Locale = "en"): string {
  const t = reportEmailMessages(locale);
  const threshold = formatEmailValue(data.freezeThresholdF, locale);
  if (data.freezeHours.readingsBelow34 === 0) {
    return fmt(t.freezeNone, { threshold });
  }
  const vars = {
    hours: formatEmailNumber(data.freezeHours.hoursBelow34, 1, locale),
    threshold,
    readings: formatEmailCount(t.readings, data.freezeHours.readingsBelow34, locale),
  };
  return data.freezeHours.coldestF != null
    ? fmt(t.freezeSomeColdest, { ...vars, coldest: formatEmailNumber(data.freezeHours.coldestF, 1, locale) })
    : fmt(t.freezeSome, vars);
}

/** Shorter HTML for the email body (stats, freeze callout, compact tables). */
export function buildMonthlyReportHtmlEmail(data: MonthlyReportData, locale: Locale = "en"): string {
  const t = reportEmailMessages(locale);
  const num = (value: number, digits: number) => formatEmailNumber(value, digits, locale);
  const kindLabel = reportTitle(data, locale);
  const sections: EmailSection[] = [
    {
      type: "callout",
      tone: data.freezeHours.readingsBelow34 === 0 ? "success" : "alert",
      title: t.freezeTitle,
      body: freezeCalloutBody(data, locale),
    },
    {
      type: "stats",
      items: [
        { label: t.statReadings, value: formatEmailValue(data.readingCount, locale) },
        { label: t.statColdest, value: formatTemp(data.minTempF, locale) },
        { label: t.statWarmest, value: formatTemp(data.maxTempF, locale) },
        { label: t.statAverage, value: formatTemp(data.avgTempF, locale) },
      ],
    },
  ];

  if (data.probes.length > 0) {
    sections.push(
      { type: "heading", text: t.byProbe },
      {
        type: "table",
        headers: [t.colProbe, t.colRange, t.colHumidity],
        rows: data.probes.map((probe) => [
          probe.label,
          `${num(probe.minF, 1)}–${num(probe.maxF, 1)}°F`,
          fmt(t.humidityCell, {
            humidity: num(probe.avgHumidity, 0),
            readings: formatEmailCount(t.readings, probe.readingCount, locale),
          }),
        ]),
      },
    );
  }

  if (data.nights.length > 0) {
    sections.push(
      { type: "heading", text: t.forecastNights },
      {
        type: "table",
        headers: [t.colNight, t.colLow, t.colStatus],
        rows: data.nights.map((night) => [
          nightLabel(night, locale),
          `${num(night.minTempF, 0)}°F`,
          night.atRisk ? t.atRisk : t.ok,
        ]),
      },
    );
  }

  sections.push({
    type: "note",
    text: t.attachedEmail,
  });

  return buildBrandedEmailHtml(
    {
      eyebrow: kindLabel,
      title: fmt(t.emailTitle, { label: data.monthLabel }),
      intro: fmt(t.snapshotIntro, { days: data.periodDays }),
      sections,
      cta: { label: t.viewHistory, url: data.historyUrl },
      secondaryCta: { label: t.manageAlerts, url: data.alertsUrl },
      unsubscribeUrl: data.unsubscribeUrl,
      tone: "brand",
    },
    locale,
  );
}

/** Subject line with coldest reading for inbox scanability. */
export function formatPeriodReportSubject(data: MonthlyReportData, locale: Locale = "en"): string {
  const t = reportEmailMessages(locale);
  const quarterly = data.reportKind === "quarterly";
  if (data.minTempF == null) {
    return fmt(quarterly ? t.subjectQuarterly : t.subjectMonthly, { label: data.monthLabel });
  }
  return fmt(quarterly ? t.subjectQuarterlyColdest : t.subjectMonthlyColdest, {
    label: data.monthLabel,
    temp: formatEmailNumber(data.minTempF, 1, locale),
  });
}

export function encodeBase64Utf8(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}
