import type { ReportEmailMessages } from "./en";

const de: ReportEmailMessages = {
  subjectMonthly: "Monatsbericht deiner Fühler – {label}",
  subjectMonthlyColdest: "Monatsbericht deiner Fühler – {label} · Tiefstwert {temp}°F",
  subjectQuarterly: "Quartalsbericht deiner Fühler – {label}",
  subjectQuarterlyColdest: "Quartalsbericht deiner Fühler – {label} · Tiefstwert {temp}°F",
  quarterLabel: "Q{quarter} {year} ({start}–{end})",

  titleMonthly: "Monatsbericht",
  titleQuarterly: "Quartalsbericht",
  emailTitle: "Fühlerbericht – {label}",
  snapshotIntro: "{days}-Tage-Überblick aus deinen gespeicherten Messwerten und der Wettervorhersage.",
  readings: { one: "{count} Messwert", other: "{count} Messwerte" },

  statReadings: "Messwerte",
  statColdest: "Tiefstwert",
  statWarmest: "Höchstwert",
  statAverage: "Mittelwert",
  statFreezeHours: "Froststunden",
  statNightsAtRisk: "Frostgefährdete Nächte",
  next7Days: "Vorhersage für die nächsten 7 Tage",
  hoursValue: "{hours} h",

  freezeTitle: "Frostbelastung",
  freezeNone: "Keine bei oder unter {threshold}°F",
  freezeSome: "{hours} h bei oder unter {threshold}°F ({readings})",
  freezeSomeColdest: "{hours} h bei oder unter {threshold}°F ({readings} · Tiefstwert {coldest}°F)",

  byProbe: "Nach Fühler",
  colProbe: "Fühler",
  colRange: "Bereich",
  colHumidity: "Luftfeuchte",
  colAvgHumidity: "Ø Luftfeuchte",
  colReadings: "Messwerte",
  humidityCell: "{humidity} % · {readings}",
  noProbeReadings: "Keine Messwerte von Fühlern in den letzten {days} Tagen.",

  forecastNights: "Nächte laut Vorhersage",
  colNight: "Nacht",
  colLow: "Tiefstwert",
  colStatus: "Status",
  atRisk: "Frostgefahr",
  ok: "OK",
  noForecast: "Keine Vorhersagedaten verfügbar.",

  viewHistory: "Verlauf ansehen",
  manageAlerts: "Alarme verwalten",
  attachedEmail:
    "Ein vollständiger HTML-Bericht ist angehängt – öffne ihn im Browser oder drucke ihn als PDF.",
  printHint: "Drucke diese Seite (Ctrl/Cmd+P), um sie als PDF zu speichern.",
  documentTitle: "ProbeHarbor-Bericht – {label}",

  plain: {
    headerMonthly: "ProbeHarbor-Monatsbericht – {label}",
    headerQuarterly: "ProbeHarbor-Quartalsbericht – {label}",
    readings: "Messwerte ({days} Tage): {count}",
    coldest: "Tiefstwert: {temp}",
    warmest: "Höchstwert: {temp}",
    average: "Mittelwert: {temp}",
    freezeHours: "Stunden bei oder unter {threshold}°F: {hours}",
    nightsAtRisk: "Frostgefährdete Nächte laut Vorhersage (nächste 7 Tage): {count}",
    byProbe: "Nach Fühler:",
    probeLine: "{probe}: {min}–{max} °F, Ø Luftfeuchte {humidity} % ({readings})",
    upcomingNights: "Kommende Nächte:",
    nightAtRisk: "{night}: {low}°F (Frostgefahr)",
    nightOk: "{night}: {low}°F (OK)",
    manageAlerts: "Alarme verwalten: {url}",
    unsubscribe: "Abmelden: {url}",
    viewHistory: "Verlauf ansehen: {url}",
    attached:
      "Ein vollständiger HTML-Bericht ist angehängt – öffne ihn in deinem Browser oder drucke ihn als PDF.",
  },
};

export default de;
