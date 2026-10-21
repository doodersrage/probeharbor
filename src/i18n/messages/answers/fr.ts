/**
 * Chrome for the /answers hub and /answers/[slug] pages. The answers
 * themselves are content overlays in `src/i18n/content/answers/`.
 */
import type { AnswersMessages } from "./en";

const fr: AnswersMessages = {
  breadcrumbHome: "Accueil",
  breadcrumbAnswers: "Réponses",
  articleSection: "Réponses",
  hub: {
    title: "Alarmes antigel : réponses",
    description:
      "Des réponses claires sur le gel des tuyaux et les alarmes antigel : quand gèlent les tuyaux du garage, où placer la sonde, à quelle température alerter.",
    kicker: "Réponses",
    heading: "Tuyaux gelés et alarmes antigel : nos réponses",
    lede: "D’abord une réponse courte et directe, puis le détail. Les sources sont indiquées lorsqu’un chiffre provient d’une étude ou d’un fabricant.",
  },
  answer: {
    backLink: "Réponses",
    related: "À lire aussi",
    sources: "Sources",
    ctaTitle: "Recevez une alerte gel pour votre local",
    ctaCopy:
      "ProbeHarbor surveille des sondes dans les garages, vides sanitaires et chalets, et vous alerte avant que les tuyaux ne gèlent. L’offre gratuite inclut les alertes par e-mail ; utilisez une sonde ESP32 ou connectez Home Assistant.",
    startFree: "Commencer gratuitement",
    seeDemo: "Voir la démo en direct",
  },
};

export default fr;
