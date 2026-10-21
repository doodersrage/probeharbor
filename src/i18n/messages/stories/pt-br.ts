/**
 * Chrome for the /stories hub and the scenario pages (StoryArticle). Story
 * content itself lives in `src/lib/stories.ts` with overlays under
 * `src/i18n/content/stories/`. Every page is an illustrative scenario, not a
 * customer account: keep that labeling explicit in every language.
 */
import type { StoriesMessages } from "./en";

const ptBr: StoriesMessages = {
  breadcrumbHome: "Início",
  breadcrumbScenarios: "Cenários",
  articleSection: "Cenários",
  hub: {
    title: "Cenários de congelamento, vazamento e calor",
    description:
      "Simulações dos alertas de congelamento, vazamento e calor do ProbeHarbor em garagens, porões, cabanas e armários: instalação, linha do tempo e por que importa.",
    itemListName: "Cenários do ProbeHarbor",
    kicker: "Cenários",
    heading: "Como é um alerta quando algo dá errado",
    lede: "Simulações ilustrativas, não relatos de clientes: um aquecedor desarma, uma abertura de ventilação trava aberta, uma bandeja fica molhada. Cada uma mostra a instalação dos sensores, como os alertas acontecem e por que isso importa.",
    startFree: "Comece grátis",
    seePlans: "Ver planos",
    readScenario: "Ler o cenário",
  },
  article: {
    scenarioLabel: "Cenário · {setting}",
    noteLabel: "Cenário ilustrativo.",
    noteBody:
      "Esta é uma simulação de como o ProbeHarbor se comporta diante de uma falha comum, não o relato de um cliente real. Os recursos, os limites de alerta e os limites dos planos são reais.",
    illustrationAlt: "Ilustração: {headline}",
    setupTitle: "A instalação",
    timelineTitle: "Como acontece",
    timeLabel: "{time}:",
    whyTitle: "Por que importa",
    outcomeCaveat:
      "Os resultados reais dependem da posição dos sensores, dos limites configurados e da rapidez com que alguém consegue agir.",
    faqTitle: "Perguntas frequentes",
    relatedTitle: "Respostas relacionadas",
    tryTitle: "Teste no seu espaço",
    tryCopy:
      "Comece grátis com gráficos ao vivo, alertas por e-mail e um link ao vivo para compartilhar com a família. Faça upgrade quando quiser histórico em CSV (Member) ou SMS e mais opções de compartilhamento (Pro: 14 dias de teste).",
    seePlansPricing: "Ver planos e preços",
    createAccount: "Criar conta grátis",
    compareDiy: "Comparar com o faça você mesmo",
    allScenarios: "Todos os cenários",
  },
  heroCaptions: {
    garageFreezeAlert:
      "Momento de risco de congelamento: alerta no celular ao lado do encanamento. A notificação é ilustrativa, não uma captura de tela do produto.",
  },
};

export default ptBr;
