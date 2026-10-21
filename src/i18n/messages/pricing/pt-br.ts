/**
 * /pricing page and PlanComparisonTable copy. Prices come from Stripe display
 * helpers and are passed in as already-formatted strings; only the words
 * around them are translated here. Keys ending in `Html` are trusted inline
 * HTML rendered with `set:html`; keep hrefs English.
 */
import type { PricingMessages } from "./en";

const ptBr: PricingMessages = {
  meta: {
    title: "Planos e preços",
    description:
      "Compare o ProbeHarbor Free, Member, Pro e Portfolio: dispositivos, histórico, alertas de congelamento e alagamento, avisos do NWS e plano anual.",
    breadcrumbHome: "Início",
    breadcrumbPricing: "Preços",
  },
  header: {
    kicker: "Preços",
    title: "Planos que crescem com suas sondas",
    lede: "Comece grátis para ver se o ProbeHarbor serve para você. Mude para o Member para ter o histórico de uma temporada de frio inteira, ou para o Pro quando quiser alertas sérios de congelamento e alagamento, contexto do termostato e automação. Precisa de mais do que alguns imóveis ou de logins para administradores no local? O Portfolio está mais abaixo.",
    signedInAs: "Conectado como",
    currentPlan: "Plano atual:",
    dashboard: "Painel",
    createAccount: "Criar conta grátis",
    signIn: "Entrar",
  },
  ladder: {
    label: "Escada de planos",
    free: "Veja se o ProbeHarbor funciona para você: curvas ao vivo, alertas de congelamento e vazamento, um link familiar ao vivo.",
    member:
      "Acompanhe uma temporada de frio inteira, ou uma temporada de porão úmido: 90 dias de histórico, CSV, mais dispositivos e avisos de congelamento pela previsão.",
    pro: "Alertas sérios e automação. NWS, SMS, contexto da casa via Nest/Ecobee, pacote para sinistros, teste de 14 dias. Até {properties} imóveis.",
    portfolio: "Operações maiores com vários imóveis: até {properties} imóveis próprios, visão do risco de congelamento e alagamento de todos eles, logins para administradores sem acesso à cobrança.",
  },
  billing: {
    label: "Período de cobrança",
    monthly: "Mensal",
    annual: "Anual",
    perMonth: "/mês",
    perYear: "/ano",
    contactUs: "Fale conosco",
    billedMonthly: "Cobrança mensal",
    billedAnnually: "Cobrança anual",
    perMonthBilledAnnually: "{monthly}/mês com cobrança anual",
    annualNotConfigured: "Preço anual não configurado",
    customPricing: "Preço sob consulta",
    percent: "{pct}%",
    approxTwenty: "~20%",
    aboutTwenty: "cerca de 20%",
    saveUpTo: "Economize até {pct}",
    saveApprox: "Economize ~20%",
    saveVsMonthly: "Economize {pct} em relação ao mensal",
    switchToAnnual: "Mude para o anual e economize {pct}",
    monthlyHint: "Você está vendo os preços mensais. O plano anual garante {pct} de desconto ({memberAnnual} / {proAnnual} por ano).",
    annualHint: "Você está vendo os totais anuais. Mude para Mensal para ver {memberMonthly} / {proMonthly} por mês.",
    withTrial: "{sub} · teste grátis de 14 dias",
  },
  cards: {
    devices: "{n} dispositivos push por imóvel",
    history: "{retention} de histórico",
    historyPlus: "{retention} ou mais de histórico",
    currentPlan: "Plano atual",
    includedInPlan: "Incluído no seu plano",
    signInToSubscribe: "Entre para assinar",
    free: {
      tagline: "Monitoramento ao vivo de um imóvel, sem cartão de crédito",
      freezeLeak: "Alertas de congelamento e vazamento por limite",
      channels: "Alertas por e-mail, push e apps de chat",
      getStarted: "Começar",
    },
    member: {
      badge: "Mais popular",
      tagline: "Exportação do histórico, mais folga e congelamento pela previsão",
      forecast: "Avisos de congelamento pela previsão",
      csv: "Exportação do histórico em CSV",
      upgrade: "Mudar para o Member",
    },
    pro: {
      taglineHtml:
        'Alertas oficiais do NWS (EUA), contexto da casa via Nest/Ecobee, <a class="text-link" href="/claims-pack">pacote para sinistros</a>',
      forecastNws: "Avisos de congelamento pela previsão + alertas oficiais do NWS",
      thermostatHtml:
        'Conexão com termostato <a class="text-link" href="/about/thermostat-oauth">Nest / Ecobee</a> (casa x sonda)',
      claimsHtml:
        '<a class="text-link" href="/claims-pack">Pacote de evidências para sinistro / seguro</a>',
      automationHtml:
        'SMS, webhooks, escopos de compartilhamento Pro e <a class="text-link" href="/docs/api">chaves de API</a>',
      properties: "Até {n} imóveis próprios (casa de veraneio, aluguel, oficina)",
      startTrial: "Começar o teste do Pro",
      onPro: "Você está no Pro",
      signInForTrial: "Entre para testar o Pro",
    },
    portfolio: {
      badge: "Para carteiras de imóveis",
      tagline: "Para operações acima do limite de {proMax} imóveis do Pro: administradores sem acesso à cobrança",
      everythingInPro: "Tudo do Pro, mais: ",
      properties: "Até {max} imóveis próprios (o Pro já cobre até {proMax})",
      crossProperty: "Painel de risco de congelamento entre imóveis",
      managers:
        "Logins para administradores de imóveis (só dispositivos e alertas, sem cobrança nem outros imóveis)",
      noteHtml:
        'Alguns imóveis de aluguel ou uma casa de veraneio costumam ficar no Pro. O Portfolio tem preço pensado para grandes proprietários e equipes de administração de imóveis: veja <a class="text-link" href="/property-management">administração de imóveis</a>.',
      onPortfolio: "Você está no Portfolio",
      upgrade: "Mudar para o Portfolio",
      contact: "Fale conosco sobre o Portfolio",
    },
    manageBilling: "Gerenciar cobrança",
  },
  screenshotCaption:
    "Member e Pro guardam curvas mais longas. O Free continua mostrando leituras ao vivo e alertas de congelamento e vazamento por limite.",
  integrations: {
    title: "Integrações no Pro",
    bodyHtml:
      'O Free já inclui um link familiar ao vivo. O Pro libera os escopos de histórico e métricas, links que não expiram, webhooks de entrada para silenciar alertas, hooks de alerta de saída e a <a class="text-link" href="/integrations/home-assistant">integração oficial do Home Assistant via HACS</a> com todos os recursos. Conecte <a class="text-link" href="/about/thermostat-oauth">Nest ou Ecobee</a> para ver a temperatura ambiente e o setpoint da casa ao lado das sondas da garagem, ou envie qualquer sensor de clima interno como <a class="text-link" href="/dashboard/devices?view=setup&tab=thermostat#indoor-reference">referência interna</a>. Mantenha o MQTT na sua rede local; use o ProbeHarbor para SMS de congelamento e vazamento da casa, histórico e alertas fora de casa.',
    all: "Todas as integrações",
    hacsGuide: "Guia de instalação do HACS",
    nestEcobee: "Nest / Ecobee",
    httpApi: "API HTTP",
  },
  matrix: {
    title: "Comparação completa de recursos",
    subtitleHtml:
      'A matriz oficial de planos Free / Member / Pro / Portfolio: número de dispositivos, retenção, alertas de congelamento e vazamento, termostato e logins de administradores. Comparando o ProbeHarbor com MQTT, Govee ou uma estação meteorológica? <a class="text-link" href="/compare">Veja as alternativas</a> (guias de concorrentes, não uma segunda cópia desta tabela).',
    noteHtml: 'O Portfolio inclui tudo do Pro, depois aumenta o limite de imóveis próprios (o Pro já permite até {proMax}; o Portfolio até {portfolioMax}) e adiciona logins para administradores de imóveis: veja o cartão do Portfolio acima e <a class="text-link" href="/property-management">administração de imóveis</a>.',
  },
  hosted: {
    title: "Hospedado na edge da Cloudflare",
    bodyHtml:
      'Os painéis e as APIs de ingestão rodam no Cloudflare Workers, sem servidor em casa para você manter ligado. Para ver ao vivo a saúde das tarefas e da ingestão (não um selo de uptime emprestado), confira o <a class="text-link" href="/system-status">status do sistema</a>.',
  },
  faqLede:
    "Limites dos planos, upgrades e cobrança: respostas para quem está escolhendo antes da temporada de frio.",
  deciding: {
    title: "Ainda decidindo?",
    bodyHtml:
      'Leia o <a class="text-link" href="/stories/garage-freeze-alert">cenário de falha do aquecedor da garagem</a>, monte o <a class="text-link" href="/about/esp32-freeze-kit">kit de congelamento com ESP32</a> ou os <a class="text-link" href="/accessories">acessórios de hardware</a> (incluindo o <a class="text-link" href="/claim-puck">Claim Puck</a>), compare com <a class="text-link" href="/compare">MQTT caseiro, Govee ou Tempest</a>, veja o <a class="text-link" href="/about/accounts-and-dashboard">guia de contas</a> ou <a class="text-link" href="/contact">fale conosco</a> se não souber qual plano escolher.',
  },
  table: {
    scrollHint: "Deslize para o lado para comparar Free, Member, Pro e Portfolio.",
    feature: "Recurso",
    save: "Economize {pct}%",
    saveApprox: "Economize ~20%",
  },
};

export default ptBr;
