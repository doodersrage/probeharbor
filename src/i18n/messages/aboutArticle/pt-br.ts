type ProductCta = { title: string; body: string; label: string };

/**
 * Shared chrome around every /about/* article: breadcrumbs, pagination,
 * topic sidebar, related guides, learning-path strip, product CTA, convert bar,
 * hub sections (journeys, quick start, topic nav) and the client islands.
 */
import type { AboutArticleMessages } from "./en";

const ptBr: AboutArticleMessages = {
  breadcrumbHome: "Início",
  breadcrumbAbout: "Sobre",
  breadcrumbLabel: "Trilha de navegação",
  ogSectionFallback: "Guias",
  faqHeading: "Perguntas frequentes",
  paginationLabel: "Páginas da seção Sobre",
  aboutOverview: "Visão geral da seção Sobre",
  backToOverview: "Voltar à visão geral",
  convertBar: {
    label: "Experimente o ProbeHarbor",
    copyHtml: "<strong>Demo ao vivo</strong>, sem conta. Pronto para conectar suas sondas? Grátis para sempre, sem cartão.",
    demo: "Testar a demo ao vivo",
    startFree: "Comece grátis",
  },
  sidebar: {
    label: "Guias deste tema",
    inThisTopic: "Neste tema",
    relatedLabel: "Guias relacionados",
    backToOverview: "← Voltar à visão geral",
    guidesHub: "Central de guias",
    allArticles: "Todos os artigos",
  },
  related: {
    title: "Guias relacionados",
    moreUnder: "Mais em",
  },
  journeyStrip: {
    label: "Trilha de aprendizado",
    path: "Trilha:",
    step: `Etapa {n} de {total}`,
    next: `Próximo: {label} →`,
  },
  journeys: {
    title: "Escolha uma trilha",
    subtitle:
      "Trilhas pelos guias organizadas por objetivo: comece pelo resultado que importa para você e depois aprofunde nos temas.",
    startFree: "Comece grátis",
  },
  quickStart: {
    title: "Comece aqui",
    lead: "Pontos de partida populares: planos de ação, demo, ingestão, canais e compartilhamento em casa.",
  },
  hubNav: {
    label: "Temas da seção Sobre",
    title: "Navegue por tema",
    lead: `{core} visões gerais de temas e {guides} guias aprofundados em cinco trilhas de aprendizado. Pesquise acima ou pule para uma seção abaixo.`,
    topics: { one: "tema", other: "temas" },
    guides: "guias",
    readOverview: "Ler a visão geral",
    deepDive: "Guias aprofundados",
  },
  productCta: {
    liveDemo: "Demo ao vivo",
    seePlans: "Ver planos",
    fallback: {
      title: "Configure isso no ProbeHarbor",
      body: "Grátis para sempre, sem cartão de crédito: acompanhe sondas, alertas de congelamento e vazamento e histórico sem manter seu próprio servidor.",
      label: "Criar conta grátis",
    },
    bySlug: {
      "cold-snap-playbook": {
        title: "Coloque o plano em prática",
        body: "Defina o limite de congelamento em °F e o e-mail em Alerts → When to alert, ou conclua o cartão em Devices depois da primeira ingestão.",
        label: "Abrir configurações de alerta",
      },
      "alert-channel-cookbook": {
        title: "Conecte seus canais",
        body: "Comece pelo e-mail em Alerts → How you're told e depois adicione apps de chat ou SMS do Pro quando precisar de avisos mais fortes durante a noite.",
        label: "Abrir configurações de alerta",
      },
      "household-sharing-walkthrough": {
        title: "Convide sua casa",
        body: "Compartilhe as sondas ao vivo por convite ou envie um link familiar ao vivo gratuito para qualquer pessoa, sem conta.",
        label: "Abrir links de compartilhamento",
      },
      "freeze-protection-thresholds": {
        title: "Defina seu limite de congelamento",
        body: "Comece a monitorar com um limite que combine com a sua zona mais fria.",
        label: "Definir limite",
      },
      "ingest-and-webhooks": {
        title: "Adicione uma chave de dispositivo",
        body: "Crie credenciais de ingestão push na página Devices e envie uma leitura de teste.",
        label: "Abrir dispositivos",
      },
      "adding-devices": {
        title: "Crie sua chave de dispositivo grátis",
        body: "Grátis para sempre, sem cartão de crédito: abra Devices, crie uma chave push e faça POST de uma leitura de teste.",
        label: "Comece grátis",
      },
      "dht22-sensor-overview": {
        title: "Veja tudo em um painel ao vivo",
        body: "Crie uma conta grátis (sem cartão), mapeie as chaves das suas sondas e acompanhe o risco de congelamento e vazamento durante a noite.",
        label: "Comece grátis",
      },
    },
  },
  search: {
    label: "Pesquisar guias",
    placeholder: "Fiação das sondas, exportar CSV, API de ingestão, alertas…",
    featured: "Pontos de partida populares",
    noMatchBefore: "Nenhum guia corresponde a “",
    noMatchAfter: "”.",
  },
  probeActivity: {
    northWall: "Parede norte",
    doorZone: "Área do portão",
    workbench: "Bancada",
    sunLoad: "Sol {n}%",
    bayInterior: "Interior da garagem",
    outside: "{t} lá fora",
    humidity: "{n}% UR",
    feed: "Feed JSON → painel do site",
    staticPreview: "Prévia estática",
    simulated: "Atividade simulada das sondas",
    ariaLabel:
      "Corte animado de uma garagem com três sondas de temperatura enviando leituras ao vivo, um portão abrindo e fechando, o sol variando e pulsos de dados indo até o painel do site.",
    caption:
      "As sondas da parede norte, da área do portão e da bancada são atualizadas a cada poucos segundos, no mesmo ritmo do feed do painel ao vivo.",
    celsius: true,
  },
};

export default ptBr;
