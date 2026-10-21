/**
 * About hub (/about) copy. Keys ending in `Html` hold trusted inline HTML and
 * are rendered with `set:html`; keep hrefs English, middleware localizes them.
 */
import type { AboutMessages } from "./en";

const ptBr: AboutMessages = {
  layoutTitle: "Sobre",
  title: "Sobre o ProbeHarbor",
  description:
    "Guias sobre sondas de temperatura, alertas de congelamento e alagamento, firmware Arduino, ingestão via ESP, compartilhamento em casa e a stack do ProbeHarbor.",
  breadcrumbHome: "Início",
  breadcrumbAbout: "Sobre",
  kicker: "Sobre",
  lede: "Guias open source sobre sondas, alertas de congelamento e alagamento, firmware e a stack por trás do ProbeHarbor. Prefere uma lista mais curta? Comece pela central de guias.",
  startFree: "Comece grátis",
  guidesHub: "Central de guias",
  findTitle: "Encontre um guia",
  findSubtitle: `Pesquise entre {count} artigos ou navegue pelas trilhas de aprendizado abaixo.`,
  probe: {
    eyebrow: "Simulação ao vivo",
    title: "Três sondas, um espaço",
    lede: "Veja a temperatura e a umidade mudarem zona por zona conforme o sol, o ar externo e a ventilação variam, igualzinho ao feed JSON ao vivo.",
  },
  repos: {
    title: "Repositórios open source",
    subtitleHtml:
      'Projetos que você pode inspecionar, fazer fork ou adaptar para a sua montagem. Integrações programáticas começam pela <a class="text-link" href="/docs/api">API HTTP</a> e pelo <a class="text-link" href="/openapi.yaml">openapi.yaml</a>.',
    firmware: "Sketch Arduino e firmware dos sensores",
    website: "Este site (Astro na Cloudflare): inclui sketches de exemplo para sensores",
    relay: "Relay do feed JSON (FastAPI com cache no Redis)",
  },
  faqLede: "Respostas rápidas antes de mergulhar em um guia.",
  faqs: [
    {
      question: "O que os guias da seção Sobre cobrem?",
      answer:
        "Posicionamento das sondas, fiação do DHT22 e do Arduino, limites de congelamento, contatos de alagamento e vazamento, APIs de ingestão, compartilhamento em casa, instalação do PWA e como o ProbeHarbor armazena e exibe as leituras em gráficos.",
    },
    {
      question: "Por onde começo?",
      answer:
        "Escolha nesta página uma trilha conforme o que você precisa (proteção contra congelamento, alagamento e vazamento, fiação, ingestão, depuração ou configuração da casa) ou pesquise no índice completo de guias.",
    },
    {
      question: "O ProbeHarbor é open source?",
      answer:
        "Sim: os repositórios da aplicação e do firmware estão linkados nesta central para você inspecionar, fazer fork ou adaptar a stack.",
    },
    {
      question: "Onde o ProbeHarbor roda?",
      answer:
        "O site e as APIs de ingestão rodam no edge da Cloudflare (Workers). A saúde ao vivo dos jobs e da ingestão fica em /system-status: publicamos a saúde medida, não um percentual de disponibilidade de marketing. Detalhes da stack: /about/astro-applications.",
    },
  ],
};

export default ptBr;
