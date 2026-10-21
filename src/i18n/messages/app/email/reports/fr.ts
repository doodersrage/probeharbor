import type { ReportEmailMessages } from "./en";

const fr: ReportEmailMessages = {
  subjectMonthly: "Rapport mensuel des sondes — {label}",
  subjectMonthlyColdest: "Rapport mensuel des sondes — {label} · minimum {temp}°F",
  subjectQuarterly: "Rapport trimestriel des sondes — {label}",
  subjectQuarterlyColdest: "Rapport trimestriel des sondes — {label} · minimum {temp}°F",
  quarterLabel: "T{quarter} {year} ({start}–{end})",

  titleMonthly: "Rapport mensuel",
  titleQuarterly: "Rapport trimestriel",
  emailTitle: "Rapport des sondes — {label}",
  snapshotIntro: "Bilan sur {days} jours à partir de vos mesures enregistrées et des prévisions.",
  readings: { one: "{count} mesure", other: "{count} mesures" },

  statReadings: "Mesures",
  statColdest: "Le plus froid",
  statWarmest: "Le plus chaud",
  statAverage: "Moyenne",
  statFreezeHours: "Heures de gel",
  statNightsAtRisk: "Nuits à risque",
  next7Days: "Prévisions des 7 prochains jours",
  hoursValue: "{hours} h",

  freezeTitle: "Exposition au gel",
  freezeNone: "Aucune mesure à {threshold}°F ou en dessous",
  freezeSome: "{hours} h à {threshold}°F ou en dessous ({readings})",
  freezeSomeColdest: "{hours} h à {threshold}°F ou en dessous ({readings} · minimum {coldest}°F)",

  byProbe: "Par sonde",
  colProbe: "Sonde",
  colRange: "Plage",
  colHumidity: "Humidité",
  colAvgHumidity: "Humidité moy.",
  colReadings: "Mesures",
  humidityCell: "{humidity} % · {readings}",
  noProbeReadings: "Aucune mesure de sonde au cours des {days} derniers jours.",

  forecastNights: "Nuits prévues",
  colNight: "Nuit",
  colLow: "Minimum",
  colStatus: "État",
  atRisk: "À risque",
  ok: "OK",
  noForecast: "Aucune prévision disponible.",

  viewHistory: "Voir l’historique",
  manageAlerts: "Gérer les alertes",
  attachedEmail:
    "Le rapport HTML complet est joint — ouvrez-le dans un navigateur ou imprimez-le en PDF.",
  printHint: "Imprimez cette page (Ctrl/Cmd+P) pour l’enregistrer en PDF.",
  documentTitle: "Rapport ProbeHarbor — {label}",

  plain: {
    headerMonthly: "Rapport mensuel ProbeHarbor — {label}",
    headerQuarterly: "Rapport trimestriel ProbeHarbor — {label}",
    readings: "Mesures (sur {days} jours) : {count}",
    coldest: "Le plus froid : {temp}",
    warmest: "Le plus chaud : {temp}",
    average: "Moyenne : {temp}",
    freezeHours: "Heures à {threshold}°F ou en dessous : {hours}",
    nightsAtRisk: "Nuits à risque prévues (7 prochains jours) : {count}",
    byProbe: "Par sonde :",
    probeLine: "{probe} : {min}–{max} °F, humidité moy. {humidity} % ({readings})",
    upcomingNights: "Nuits à venir :",
    nightAtRisk: "{night} : {low}°F (à risque)",
    nightOk: "{night} : {low}°F (OK)",
    manageAlerts: "Gérer les alertes : {url}",
    unsubscribe: "Se désabonner : {url}",
    viewHistory: "Voir l’historique : {url}",
    attached:
      "Le rapport HTML complet est joint — ouvrez-le dans votre navigateur ou imprimez-le en PDF.",
  },
};

export default fr;
