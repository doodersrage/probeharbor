import type { NightRisk } from "./FetchWeather";

function escapeIcal(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

function formatIcalDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}` +
    `T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`
  );
}

function formatIcalDay(date: Date): string {
  return date.toISOString().slice(0, 10).replace(/-/g, "");
}

export function buildFreezeOutlookIcal(
  nights: NightRisk[],
  calendarName = "ThermalTrace freeze outlook",
): string {
  const now = formatIcalDate(new Date());
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ThermalTrace//Freeze Outlook//EN",
    `X-WR-CALNAME:${escapeIcal(calendarName)}`,
    "CALSCALE:GREGORIAN",
  ];

  for (const night of nights.filter((n) => n.atRisk)) {
    const start = new Date(`${night.date}T00:00:00Z`);
    if (Number.isNaN(start.getTime())) continue;
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 1);
    const uid = `thermaltrace-freeze-${night.date}@thermaltrace.dev`;
    lines.push(
      "BEGIN:VEVENT",
      `UID:${uid}`,
      `DTSTAMP:${now}`,
      `DTSTART;VALUE=DATE:${formatIcalDay(start)}`,
      `DTEND;VALUE=DATE:${formatIcalDay(end)}`,
      `SUMMARY:${escapeIcal(`Freeze risk: ${night.minTempF.toFixed(0)}°F low`)}`,
      `DESCRIPTION:${escapeIcal(`Forecast overnight low ${night.minTempF.toFixed(1)}°F on ${night.dateLabel}.`)}`,
      "END:VEVENT",
    );
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}
