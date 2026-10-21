import type { ReportEmailMessages } from "./en";

const ptBr: ReportEmailMessages = {
  subjectMonthly: "Relatório mensal das sondas — {label}",
  subjectMonthlyColdest: "Relatório mensal das sondas — {label} · mínima {temp}°F",
  subjectQuarterly: "Relatório trimestral das sondas — {label}",
  subjectQuarterlyColdest: "Relatório trimestral das sondas — {label} · mínima {temp}°F",
  quarterLabel: "{quarter}º tri {year} ({start}–{end})",

  titleMonthly: "Relatório mensal",
  titleQuarterly: "Relatório trimestral",
  emailTitle: "Relatório das sondas — {label}",
  snapshotIntro: "Panorama de {days} dias com base nas suas leituras salvas e na previsão do tempo.",
  readings: { one: "{count} leitura", other: "{count} leituras" },

  statReadings: "Leituras",
  statColdest: "Mais frio",
  statWarmest: "Mais quente",
  statAverage: "Média",
  statFreezeHours: "Horas de congelamento",
  statNightsAtRisk: "Noites em risco",
  next7Days: "Previsão dos próximos 7 dias",
  hoursValue: "{hours} h",

  freezeTitle: "Exposição ao congelamento",
  freezeNone: "Nenhuma a {threshold}°F ou menos",
  freezeSome: "{hours} h a {threshold}°F ou menos ({readings})",
  freezeSomeColdest: "{hours} h a {threshold}°F ou menos ({readings} · mínima {coldest}°F)",

  byProbe: "Por sonda",
  colProbe: "Sonda",
  colRange: "Faixa",
  colHumidity: "Umidade",
  colAvgHumidity: "Umidade média",
  colReadings: "Leituras",
  humidityCell: "{humidity}% · {readings}",
  noProbeReadings: "Nenhuma leitura das sondas nos últimos {days} dias.",

  forecastNights: "Noites previstas",
  colNight: "Noite",
  colLow: "Mínima",
  colStatus: "Status",
  atRisk: "Em risco",
  ok: "OK",
  noForecast: "Nenhum dado de previsão disponível.",

  viewHistory: "Ver histórico",
  manageAlerts: "Gerenciar alertas",
  attachedEmail: "O relatório completo em HTML está em anexo — abra no navegador ou imprima em PDF.",
  printHint: "Imprima esta página (Ctrl/Cmd+P) para salvar em PDF.",
  documentTitle: "Relatório ProbeHarbor — {label}",

  plain: {
    headerMonthly: "Relatório mensal ProbeHarbor — {label}",
    headerQuarterly: "Relatório trimestral ProbeHarbor — {label}",
    readings: "Leituras ({days} dias): {count}",
    coldest: "Mais frio: {temp}",
    warmest: "Mais quente: {temp}",
    average: "Média: {temp}",
    freezeHours: "Horas a {threshold}°F ou menos: {hours}",
    nightsAtRisk: "Noites em risco na previsão (próximos 7 dias): {count}",
    byProbe: "Por sonda:",
    probeLine: "{probe}: {min}–{max} °F, umidade média {humidity}% ({readings})",
    upcomingNights: "Próximas noites:",
    nightAtRisk: "{night}: {low}°F (em risco)",
    nightOk: "{night}: {low}°F (OK)",
    manageAlerts: "Gerenciar alertas: {url}",
    unsubscribe: "Cancelar inscrição: {url}",
    viewHistory: "Ver histórico: {url}",
    attached: "O relatório completo em HTML está em anexo — abra no seu navegador ou imprima em PDF.",
  },
};

export default ptBr;
