/**
 * Chrome for the /answers hub and /answers/[slug] pages. The answers
 * themselves are content overlays in `src/i18n/content/answers/`.
 */
import type { AnswersMessages } from "./en";

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

export default ptBr;
