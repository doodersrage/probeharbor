import type { ReportEmailMessages } from "./en";

const es: ReportEmailMessages = {
  subjectMonthly: "Informe mensual de sondas: {label}",
  subjectMonthlyColdest: "Informe mensual de sondas: {label} · mínima {temp}°F",
  subjectQuarterly: "Informe trimestral de sondas: {label}",
  subjectQuarterlyColdest: "Informe trimestral de sondas: {label} · mínima {temp}°F",
  quarterLabel: "T{quarter} {year} ({start}–{end})",

  titleMonthly: "Informe mensual",
  titleQuarterly: "Informe trimestral",
  emailTitle: "Informe de sondas: {label}",
  snapshotIntro: "Resumen de {days} días a partir de tus lecturas guardadas y del pronóstico.",
  readings: { one: "{count} lectura", other: "{count} lecturas" },

  statReadings: "Lecturas",
  statColdest: "Mínima",
  statWarmest: "Máxima",
  statAverage: "Media",
  statFreezeHours: "Horas de congelación",
  statNightsAtRisk: "Noches en riesgo",
  next7Days: "Pronóstico de los próximos 7 días",
  hoursValue: "{hours} h",

  freezeTitle: "Exposición a congelación",
  freezeNone: "Ninguna a {threshold}°F o menos",
  freezeSome: "{hours} h a {threshold}°F o menos ({readings})",
  freezeSomeColdest: "{hours} h a {threshold}°F o menos ({readings} · mínima {coldest}°F)",

  byProbe: "Por sonda",
  colProbe: "Sonda",
  colRange: "Rango",
  colHumidity: "Humedad",
  colAvgHumidity: "Humedad media",
  colReadings: "Lecturas",
  humidityCell: "{humidity}% · {readings}",
  noProbeReadings: "No hay lecturas de sondas en los últimos {days} días.",

  forecastNights: "Noches pronosticadas",
  colNight: "Noche",
  colLow: "Mínima",
  colStatus: "Estado",
  atRisk: "En riesgo",
  ok: "OK",
  noForecast: "No hay datos de pronóstico disponibles.",

  viewHistory: "Ver historial",
  manageAlerts: "Gestionar alertas",
  attachedEmail: "Se adjunta el informe completo en HTML: ábrelo en un navegador o imprímelo en PDF.",
  printHint: "Imprime esta página (Ctrl/Cmd+P) para guardarla como PDF.",
  documentTitle: "Informe de ProbeHarbor: {label}",

  plain: {
    headerMonthly: "Informe mensual de ProbeHarbor: {label}",
    headerQuarterly: "Informe trimestral de ProbeHarbor: {label}",
    readings: "Lecturas ({days} días): {count}",
    coldest: "Mínima: {temp}",
    warmest: "Máxima: {temp}",
    average: "Media: {temp}",
    freezeHours: "Horas a {threshold}°F o menos: {hours}",
    nightsAtRisk: "Noches en riesgo según el pronóstico (próximos 7 días): {count}",
    byProbe: "Por sonda:",
    probeLine: "{probe}: {min}–{max} °F, humedad media {humidity}% ({readings})",
    upcomingNights: "Próximas noches:",
    nightAtRisk: "{night}: {low}°F (en riesgo)",
    nightOk: "{night}: {low}°F (OK)",
    manageAlerts: "Gestionar alertas: {url}",
    unsubscribe: "Darse de baja: {url}",
    viewHistory: "Ver historial: {url}",
    attached: "Se adjunta el informe completo en HTML: ábrelo en tu navegador o imprímelo en PDF.",
  },
};

export default es;
