/**
 * Chrome for the /answers hub and /answers/[slug] pages. The answers
 * themselves are content overlays in `src/i18n/content/answers/`.
 */
import type { AnswersMessages } from "./en";

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

export default es;
