import { defineMessages } from "../translate";

/**
 * Chrome for the /answers hub and /answers/[slug] pages. The answers
 * themselves are content overlays in `src/i18n/content/answers/`.
 */
const en = {
  breadcrumbHome: "Home",
  breadcrumbAnswers: "Answers",
  articleSection: "Answers",
  hub: {
    title: "Freeze alarm answers",
    description:
      "Straight answers about freezing pipes and freeze alarms: when garage pipes freeze, where to put a sensor, what temperature to alert at, and your options.",
    kicker: "Answers",
    heading: "Freezing pipes and freeze alarms, answered",
    lede: "Short, direct answers first, then the detail. Sources are linked where a number comes from research or a vendor.",
  },
  answer: {
    backLink: "Answers",
    related: "Related",
    sources: "Sources",
    ctaTitle: "Get a freeze alert for your space",
    ctaCopy:
      "ProbeHarbor watches probes in garages, crawlspaces, and cabins and alerts you before pipes freeze. The free plan includes email alerts; bring an ESP32 probe or connect Home Assistant.",
    startFree: "Start free",
    seeDemo: "See the live demo",
  },
};

type AnswersMessages = typeof en;

const es: AnswersMessages = {
  breadcrumbHome: "Inicio",
  breadcrumbAnswers: "Respuestas",
  articleSection: "Respuestas",
  hub: {
    title: "Respuestas sobre alarmas de congelación",
    description:
      "Respuestas claras sobre tuberías congeladas y alarmas de congelación: cuándo se congelan en el garaje, dónde poner el sensor y a qué temperatura avisar.",
    kicker: "Respuestas",
    heading: "Tuberías congeladas y alarmas de congelación: respuestas",
    lede: "Primero respuestas cortas y directas, luego el detalle. Enlazamos las fuentes cuando un dato viene de una investigación o de un fabricante.",
  },
  answer: {
    backLink: "Respuestas",
    related: "Relacionado",
    sources: "Fuentes",
    ctaTitle: "Recibe alertas de congelación para tu espacio",
    ctaCopy:
      "ProbeHarbor vigila sondas en garajes, espacios bajo el piso y cabañas, y te avisa antes de que se congelen las tuberías. El plan gratuito incluye alertas por correo; usa una sonda ESP32 o conecta Home Assistant.",
    startFree: "Empieza gratis",
    seeDemo: "Ver la demo en vivo",
  },
};

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

const ptBr: AnswersMessages = {
  breadcrumbHome: "Início",
  breadcrumbAnswers: "Respostas",
  articleSection: "Respostas",
  hub: {
    title: "Respostas sobre alarmes de congelamento",
    description:
      "Respostas diretas sobre canos congelados e alarmes de congelamento: quando os canos da garagem congelam, onde pôr o sensor, a que temperatura alertar.",
    kicker: "Respostas",
    heading: "Canos congelados e alarmes de congelamento: respostas",
    lede: "Primeiro a resposta curta e direta, depois os detalhes. As fontes estão linkadas quando um número vem de pesquisa ou de um fabricante.",
  },
  answer: {
    backLink: "Respostas",
    related: "Veja também",
    sources: "Fontes",
    ctaTitle: "Receba um alerta de congelamento para o seu espaço",
    ctaCopy:
      "O ProbeHarbor monitora sondas em garagens, porões rasos e cabanas e avisa você antes que os canos congelem. O plano gratuito inclui alertas por e-mail; use uma sonda ESP32 ou conecte o Home Assistant.",
    startFree: "Comece grátis",
    seeDemo: "Ver a demo ao vivo",
  },
};

export const answersMessages = defineMessages({ en, es, fr, de, "pt-br": ptBr });
