/**
 * Chrome for the /answers hub and /answers/[slug] pages. The answers
 * themselves are content overlays in `src/i18n/content/answers/`.
 */
import type { AnswersMessages } from "./en";

const de: AnswersMessages = {
  breadcrumbHome: "Start",
  breadcrumbAnswers: "Antworten",
  articleSection: "Antworten",
  hub: {
    title: "Antworten zu Frostalarmen",
    description:
      "Klare Antworten zu eingefrorenen Rohren und Frostalarmen: wann Rohre in der Garage einfrieren, wo der Sensor hingehört, ab welcher Temperatur alarmieren.",
    kicker: "Antworten",
    heading: "Eingefrorene Rohre und Frostalarme: die Antworten",
    lede: "Zuerst die kurze, direkte Antwort, dann die Details. Quellen sind verlinkt, wenn eine Zahl aus Forschung oder von einem Hersteller stammt.",
  },
  answer: {
    backLink: "Antworten",
    related: "Weiterlesen",
    sources: "Quellen",
    ctaTitle: "Frostalarm für deinen Raum",
    ctaCopy:
      "ProbeHarbor überwacht Fühler in Garagen, Kriechkellern und Hütten und warnt dich, bevor Rohre einfrieren. Der kostenlose Plan enthält E-Mail-Alarme; nutze einen ESP32-Fühler oder verbinde Home Assistant.",
    startFree: "Kostenlos starten",
    seeDemo: "Live-Demo ansehen",
  },
};

export default de;
