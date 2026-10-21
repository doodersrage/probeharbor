import type { DigestEmailMessages } from "./en";

const fr: DigestEmailMessages = {
  subject: "Résumé hebdo — le plus froid {day} {temp}°F",
  subjectNoData: "Résumé hebdomadaire des températures de vos sondes",
  eyebrow: "Résumé hebdomadaire",
  title: "Votre semaine côté sondes",
  intro:
    "Voici un aperçu des 7 derniers jours — nuit la plus froide, passages sous le seuil de gel et tout ce qui mérite votre attention.",
  ctaHistory: "Voir cette semaine dans Historique",
  ctaSettings: "Gérer les paramètres du résumé",
  footerNote:
    "Vous pouvez désactiver les résumés hebdomadaires dans Tableau de bord → Alertes → Paramètres → E-mails récapitulatifs.",
  tip: "Astuce : les alertes de panne et de fuite sont envoyées séparément quand un capteur se tait ou détecte de l’eau.",

  readings: { one: "{count} mesure", other: "{count} mesures" },
  probeLine: "{probe} : {min}–{max} °F, humidité moy. {humidity} % ({readings})",
  dayLine: "{day} : {min}–{max} °F (moy. {avg}°)",
  dayLineColdest: "{day} : {min}–{max} °F (moy. {avg}° · le plus froid : {probe})",

  freezeTitle: "Exposition au gel",
  freezeLine: "Exposition au gel : {body}",
  freezeNone: "aucune mesure à {threshold}°F ou en dessous",
  freezeSome: "~{hours} h à {threshold}°F ou en dessous ({readings} · minimum {coldest}°F)",

  highlights: "Points clés",
  statColdest: "Le plus froid",
  statWarmest: "Le plus chaud",
  statAverage: "Moyenne sur 7 jours",
  statHumidity: "Humidité maximale",

  byProbe: "Par sonde",
  colProbe: "Sonde",
  colRange: "Plage",
  colHumidity: "Humidité",
  humidityCell: "{humidity} % · {readings}",
  dayByDay: "Jour par jour",
  colDay: "Jour",
  colAvg: "Moy.",
  colColdest: "Le plus froid",

  deliveryTitle: "Envoi des alertes",
  noAlerts: "Aucune alerte envoyée cette semaine.",
  sendTestAnyTime:
    "Envoyez un test depuis Alertes à tout moment pour vérifier que vos canaux vous joignent toujours.",
  heldBack: {
    one: "{count} retenue par la mise en pause, le mode vacances ou les heures calmes.",
    other: "{count} retenues par la mise en pause, le mode vacances ou les heures calmes.",
  },
  reached: {
    one: "{reached} alerte sur {count} vous est parvenue.",
    other: "{reached} alertes sur {count} vous sont parvenues.",
  },
  reachedVia: {
    one: "{reached} alerte sur {count} vous est parvenue via {channels}.",
    other: "{reached} alertes sur {count} vous sont parvenues via {channels}.",
  },
  notDelivered:
    "Non distribuées sur : {failures}. Vérifiez ces canaux dans Alertes et envoyez un test.",
  failedChannel: "{channel} ({count}×)",
};

export default fr;
