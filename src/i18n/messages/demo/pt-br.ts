/**
 * /demo page copy. Keys ending in `Html` hold trusted inline HTML (links,
 * <code>) rendered with `set:html`; keep hrefs English, middleware localizes them.
 * List arrays follow the page order; hrefs live in the page.
 */
import type { DemoMessages } from "./en";

const ptBr: DemoMessages = {
  title: "Demo de sondas ao vivo",
  description:
    "Experimente o ProbeHarbor sem conta: simulador interativo de sondas, sondas de demo reais ao vivo e o mesmo caminho de alertas de congelamento e alagamento do seu hardware.",
  ogImageAlt: "Curvas de temperatura ao vivo das sondas do ProbeHarbor, sem precisar de conta",
  breadcrumbHome: "Início",
  breadcrumbDemo: "Demo ao vivo",
  schemaName: "Demo de sondas ao vivo do ProbeHarbor",
  schemaDescription:
    "Demos do ProbeHarbor sem conta: simulador interativo de sondas com várias zonas e sondas de demo ao vivo no caminho de ingestão de produção.",
  header: {
    kicker: "Experimente (sem conta)",
    title: "Demos: simulador + feed ao vivo",
    lede: "Provoque um congelamento no simulador interativo de sondas ou acompanhe sondas de demo reais ao lado do clima externo: o mesmo caminho de ingestão que seu ESP ou Arduino vai usar para alertas de congelamento e alagamento.",
    simulator: "Simulador interativo",
    liveReadings: "Leituras ao vivo",
    connect: "Conectar minhas sondas",
  },
  paths: {
    title: "Três jeitos de experimentar o ProbeHarbor",
    lede: "Comece pelo simulador se quiser sentir o risco de congelamento reagir ao que você faz e depois confirme com o feed ao vivo e o caminho de alagamento acionado automaticamente quando molha.",
    items: [
      {
        label: "Simulador interativo de sondas",
        text: "Mão na massa (a melhor primeira parada). Ajuste porta aberta ou fechada, sol, ar externo e limite de congelamento. Provoque uma onda de frio e veja as barras de cada zona e o JSON push/pull se atualizarem.",
      },
      {
        label: "Feed de demo ao vivo",
        text: "Para observar. Sondas de demo reais se atualizam aqui pelo caminho de ingestão de produção. Ideal para responder “isso é de mentira?” com números ao vivo.",
      },
      {
        label: "Configuração do kit por QR",
        text: "O caminho do hardware. Depois de criar um dispositivo push, escaneie o QR de ingestão (ou imprima numa etiqueta do kit) para que o firmware envie por POST temperatura, alagamento e outros tipos de sensor sem digitar a chave.",
      },
    ],
  },
  sim: {
    title: "Provoque a mudança: simulador interativo",
    lede: "As predefinições de onda de frio, corrente de ar pela porta e carga solar usam o mesmo cálculo de status dos espaços do Overview que a produção. Abra o portão e veja a zona da porta se afastar da bancada: é por isso que vale espalhar várias sondas.",
    doorDraft: "Testar corrente de ar",
    coldSnap: "Testar onda de frio",
    openFull: "Abrir o simulador completo",
  },
  live: {
    title: "Feed de demo ao vivo",
    ledeHtml:
      'Leituras reais das sondas de demo e clima externo, não uma maquete. Prefere mexer nas variáveis você mesmo? <a class="text-link" href="/about/probe-demo">Abra o simulador interativo</a>.',
    readingsLabel: "Leituras da demo ao vivo",
    historyNote:
      "As curvas das sondas são o modelo da oficina de demo rodado sobre o clima real, hora a hora, da última semana; a linha tracejada é a temperatura externa.",
  },
  screenshotCaption:
    "A mesma interface do produto depois que você conecta o hardware. Insights com curvas de 30 dias, limite de congelamento e noites de risco.",
  freeze: {
    title: "Os mesmos dados que disparam alertas de congelamento e alagamento",
    lede: "Quando uma sonda cruza o seu limite, o ProbeHarbor pode avisar você por e-mail, push do navegador, Discord, Telegram, Slack e, no Pro, SMS. Contatos de alagamento ou vazamento alertam automaticamente quando molham, na mesma infraestrutura. Defina o limite uma vez e teste antes da próxima noite fria.",
    channelsLabel: "Canais de alerta",
    channels: [
      "E-mail · Discord · Telegram · Slack",
      "Push em todos os planos",
      "SMS · webhooks no Pro",
      "Sensores de vazamento ou alagamento alertam automaticamente quando molham",
    ],
    startFree: "Comece grátis: abra Devices",
    story: "História de um vazamento",
    cookbook: "Guia de canais",
    imageAlt:
      "Tendência de temperatura do ProbeHarbor com umidade, ponto de orvalho e limite de congelamento em 1 °C (34 °F)",
  },
  steps: {
    title: "Agora, o seu kit",
    ledeHtml:
      'Conta grátis, sem cartão de crédito: do dashboard vazio a uma curva ao vivo numa sentada só. Kits físicos podem usar a <a class="text-link" href="/about/kit-qr-onboarding">configuração do kit por QR</a>, e a URL de ingestão fica a um escaneamento de distância.',
    items: [
      {
        title: "Crie um dispositivo push",
        copyHtml:
          "Cadastre-se e escolha um caminho em Devices: Home Assistant, ESPHome ou MQTT recebem um trecho para copiar e colar; uma placa recebe um sketch já preenchido; sem hardware, um feed de demo com um clique.",
      },
      {
        title: "Envie JSON por POST",
        copyHtml:
          "Faça POST para <code>/api/ingest/&lt;key&gt;</code>. Os sensores são importados automaticamente no primeiro POST: depois é só renomear em Devices.",
      },
      {
        title: "Acompanhe a Home e configure alertas",
        copyHtml:
          "Confirme os valores ao vivo, defina um limite de congelamento e saiba que contatos de alagamento ou vazamento alertam automaticamente quando molham, na mesma conta.",
      },
    ],
    startFree: "Comece grátis: abra Devices",
    guide: "Guia para adicionar dispositivos",
    walkthrough: "Passo a passo do QR do kit",
  },
  compat: {
    label: "Funciona com",
    push: "Push HTTPS JSON",
    pull: "Pull HTTPS JSON",
    mqtt: "Ponte MQTT",
    homeAssistant: "Home Assistant (HACS)",
    noteHtml:
      'Mantenha o MQTT na sua rede local e espelhe para o ProbeHarbor por HTTPS para ter alertas de congelamento e alagamento em casa e histórico. <a class="text-link" href="/about/mqtt-bridge">Receita da ponte MQTT</a>',
  },
  explore: {
    title: "Continue explorando",
    lede: "Já provocou uma onda de frio simulada? Confirme com o feed ao vivo e depois leia uma história de vazamento, veja uma cidade no mapa ou configure o QR do kit.",
    items: [
      { label: "Simulador interativo de sondas", hint: "A principal demo mão na massa: porta, sol, ar externo, limite de congelamento" },
      { label: "Mapa comunitário de congelamento", hint: "Dados agregados por cidade, com participação opcional, sem conta" },
      { label: "Configuração do kit por QR", hint: "Criar dispositivo → escanear QR de ingestão → primeiro POST" },
      { label: "Cenário de congelamento", hint: "Como é uma falha do aquecedor às 2 da manhã, alerta por alerta" },
    ],
  },
  faqLede:
    "Respostas sobre a demo; para planos e o básico do produto, veja Preços ou as perguntas frequentes da página inicial.",
};

export default ptBr;
