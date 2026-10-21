import type { DigestEmailMessages } from "./en";

const de: DigestEmailMessages = {
  subject: "Wochenbericht – am kältesten {day} {temp}°F",
  subjectNoData: "Wöchentlicher Temperaturbericht deiner Fühler",
  eyebrow: "Wochenbericht",
  title: "Deine Fühler diese Woche",
  intro:
    "Ein kurzer Blick auf die letzten 7 Tage – kälteste Nacht, Frostunterschreitungen und alles, was du im Auge behalten solltest.",
  ctaHistory: "Diese Woche im Verlauf öffnen",
  ctaSettings: "Berichtseinstellungen verwalten",
  footerNote:
    "Wochenberichte kannst du unter Dashboard → Alarme → Einstellungen → Zusammenfassungs-E-Mails abschalten.",
  tip: "Tipp: Ausfall- und Leckalarme kommen separat, wenn Sensoren verstummen oder nass werden.",

  readings: { one: "{count} Messwert", other: "{count} Messwerte" },
  probeLine: "{probe}: {min}–{max} °F, Ø Luftfeuchte {humidity} % ({readings})",
  dayLine: "{day}: {min}–{max} °F (Ø {avg}°)",
  dayLineColdest: "{day}: {min}–{max} °F (Ø {avg}° · am kältesten {probe})",

  freezeTitle: "Frostbelastung",
  freezeLine: "Frostbelastung: {body}",
  freezeNone: "keine bei oder unter {threshold}°F",
  freezeSome: "~{hours} h bei oder unter {threshold}°F ({readings} · Tiefstwert {coldest}°F)",

  highlights: "Highlights",
  statColdest: "Tiefstwert",
  statWarmest: "Höchstwert",
  statAverage: "7-Tage-Mittel",
  statHumidity: "Höchste Luftfeuchte",

  byProbe: "Nach Fühler",
  colProbe: "Fühler",
  colRange: "Bereich",
  colHumidity: "Luftfeuchte",
  humidityCell: "{humidity} % · {readings}",
  dayByDay: "Tag für Tag",
  colDay: "Tag",
  colAvg: "Ø",
  colColdest: "Am kältesten",

  deliveryTitle: "Alarmzustellung",
  noAlerts: "Diese Woche wurden keine Alarme verschickt.",
  sendTestAnyTime:
    "Sende jederzeit unter Alarme einen Test, um zu prüfen, ob deine Kanäle dich noch erreichen.",
  heldBack: {
    one: "{count} wegen Pause, Urlaub oder Ruhezeiten zurückgehalten.",
    other: "{count} wegen Pause, Urlaub oder Ruhezeiten zurückgehalten.",
  },
  reached: {
    one: "{reached} von {count} Alarm hat dich erreicht.",
    other: "{reached} von {count} Alarmen haben dich erreicht.",
  },
  reachedVia: {
    one: "{reached} von {count} Alarm hat dich über {channels} erreicht.",
    other: "{reached} von {count} Alarmen haben dich über {channels} erreicht.",
  },
  notDelivered:
    "Nicht zugestellt über: {failures}. Prüfe diese Kanäle unter Alarme und sende einen Test.",
  failedChannel: "{channel} ({count}×)",
};

export default de;
