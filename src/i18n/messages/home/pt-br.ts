/**
 * Homepage copy. Keys ending in `Html` hold trusted inline HTML (links,
 * <strong>, <code>) and are rendered with `set:html`; keep the hrefs English
 * (`/pricing`), middleware points them at the visitor's locale.
 */
import type { HomeMessages } from "./en";

const ptBr: HomeMessages = {
  title: "Monitoramento de congelamento e alagamento na garagem",
  ogImageAlt:
    "Gráfico de telemetria ao vivo do ProbeHarbor: curvas das sondas com umidade, ponto de orvalho, alertas de congelamento e contatos de alagamento",
  breadcrumbHome: "Início",
  brandDefinition:
    "O ProbeHarbor monitora sensores de temperatura e vazamento em garagens, oficinas, sótãos, porões e galpões, com gráficos ao vivo, histórico e alertas de congelamento, vazamento e calor. Open source, com plano gratuito.",
  hero: {
    promise: "Saiba antes que seus canos congelem ou sua garagem alague.",
    openDashboard: "Abrir o painel",
    liveReadings: "Leituras ao vivo",
    startFree: "Comece grátis",
    seeDemo: "Ver a demo ao vivo",
    signedInHtml:
      'Conectado: Visão geral para a operação, Ao vivo para uma olhada rápida nas sondas, ou <a class="text-link" href="/dashboard/devices">Dispositivos</a> para gerenciar a ingestão.',
    guestHtml:
      'Sem cartão de crédito. Ainda sem hardware? <a class="text-link" href="/pipe-freeze-forecast">Receba alertas de congelamento grátis para a sua região</a>.',
    freeForever: "Grátis para sempre · sem cartão de crédito",
    planPrice: "{plan} {price}/mês",
    visualAlt:
      "Insights do ProbeHarbor: curvas de sete dias das sondas com a linha de congelamento, contatos de alagamento, previsão de noites de risco e contagem regressiva até o congelamento",
    visualCaption:
      "Painel real do ProbeHarbor: curvas de 30 dias das sondas, limite de congelamento e comparação com o ano anterior. Não é um mockup.",
  },
  live: {
    title: "Duas formas de experimentar (sem conta)",
    lede: "Abra a porta da garagem e provoque uma onda de frio no simulador, ou acompanhe abaixo as sondas reais da demo.",
    coldSnap: "Simular uma onda de frio",
    demoFeed: "Feed da demo ao vivo",
    readingsLabel: "Leituras da demo ao vivo",
  },
  steps: {
    title: "Como funciona",
    lede: "Um caminho recomendado: ESP32 + sonda à prova d’água → ProbeHarbor → alerta no celular. Outras placas e fontes de dados continuam suportadas depois que você estiver no ar.",
    buildTitle: "Monte uma sonda",
    buildCopy:
      "ESP32 + DS18B20 à prova d’água é o kit padrão (cerca de US$ 20–30 em peças): três fios e um resistor. Um DHT22 adiciona umidade no mesmo pino.",
    installTitle: "Instale pelo navegador",
    installCopyHtml:
      'Conecte o ESP32 via USB, instale o firmware pelo <a class="text-link" href="/flash">gravador web</a> no Chrome ou Edge e envie o Wi‑Fi e a chave do dispositivo pelo mesmo cabo. Sem Arduino IDE, sem código.',
    alertsTitle: "Receba alertas de congelamento",
    alertsCopy:
      "Defina a temperatura de congelamento e um e-mail, envie um teste e acompanhe Ao vivo e Visão geral. Adicione um contato de alagamento quando quiser.",
    partsHtml:
      "<strong>Você precisa de:</strong> uma conta gratuita, uma placa ESP32 (cerca de US$ 8–15), um DS18B20 à prova d’água (cerca de US$ 2–5), seu Wi‑Fi e um cabo USB com Chrome ou Edge. Menos de US$ 25, sem assinatura, para testar os alertas de congelamento.",
    startFree: "Comece grátis",
    partsList: "Lista de peças do ESP32",
    otherBoards: "Outras placas e integrações",
  },
  maker: {
    title: "Ama DIY? Você não precisa fazer tudo sozinho.",
    lede: "Mantenha seu ESP32, Arduino, MQTT ou Home Assistant. O ProbeHarbor adiciona histórico hospedado e alertas de congelamento e alagamento para toda a casa, sem mais um servidor para cuidar.",
    tagline: "Seu sensor. Seus dados. Seus alertas.",
    mqttBridge: "Ponte MQTT",
    vsDiy: "vs MQTT caseiro",
  },
  story: {
    kicker: "Cenário",
    title: "1 °C (34 °F). É aí que o alerta importa.",
    copyHtml:
      'Imagine uma garagem anexa onde um canto fica abaixo de 1 °C (34 °F) toda noite de céu limpo. O alerta avisa que algo está errado; o gráfico do histórico mostra onde, apontando para uma vedação de porta com frestas antes que os canos congelem. É exatamente o tipo de linha do tempo que um <a class="text-link" href="/claims-pack">pacote de evidências para sinistros</a> documentaria se um dano por congelamento virasse conversa com a seguradora.',
    shotCaption: "A mesma linha de congelamento que cada casa define em Alertas, visível nas curvas do Histórico.",
    read: "Ler o cenário",
    more: "Mais cenários",
  },
  features: {
    label: "Destaques do produto",
    protectTitle: "Proteja os espaços vulneráveis",
    protectCopyHtml:
      'Alertas de congelamento e vazamento em todos os planos, além de uma contagem regressiva até o congelamento para cada espaço, para saber quando os canos vão congelar, e não só depois. O Member adiciona avisos da previsão externa; o Pro adiciona alertas oficiais do NWS (EUA) e SMS. <a class="text-link" href="/about/cold-snap-playbook">Guia para ondas de frio</a>',
    leaksTitle: "Detecte vazamentos antes que se espalhem",
    leaksCopyHtml:
      'Os contatos de alagamento alertam sozinhos quando molham, mesmo com alertas adiados ou nas férias. Adicione um sensor de <code>level</code> no poço de drenagem ou no tanque se quiser regras de aviso antecipado antes que a água chegue ao chão. <a class="text-link" href="/about/ingest-and-webhooks">Guia de ingestão de alagamento e nível</a>',
    stackTitle: "Seus sensores, seu stack",
    stackCopyHtml:
      'Temperatura, umidade, qualidade do ar, portas, vazamentos, energia e movimento em hardware que você controla. <a class="text-link" href="/about/ingest-and-webhooks">Guia de ingestão</a> · <a class="text-link" href="/docs/api">API HTTP</a>',
    portfolioTitle: "De casas a carteiras de imóveis",
    portfolioCopyHtml:
      'Convide a família e compartilhe um link ao vivo sem passar nenhuma senha. O Pro adiciona um <a class="text-link" href="/claims-pack">pacote de evidências para sinistros</a>; o Portfolio adiciona <a class="text-link" href="/property-management">acessos para administradoras</a> de imóveis alugados e condomínios.',
  },
  pricing: {
    title: "Grátis para começar",
    lede: "Escolha o nível pela necessidade: noites de geada, alertas de vazamento ou monitoramento de uma carteira de imóveis. Todos os limites estão na página de preços.",
    free: "Veja se o ProbeHarbor serve para você",
    member: "Acompanhe uma temporada de frio inteira",
    pro: "Alertas sérios e automação",
    perMonth: " · {price}/mês",
    startFree: "Comece grátis",
    compare: "Comparar planos",
  },
  guides: {
    label: "Guias",
    heading: "Guias:",
    hardware: "Montagem do hardware",
    freeze: "Alertas de congelamento",
    flood: "Alertas de alagamento e vazamento",
    sharing: "Compartilhamento e API",
    hub: "Abrir a central de guias",
  },
  ossHtml:
    'Painel open source e sketches de exemplo para sensores. <a class="text-link" href="https://github.com/doodersrage/probeharbor" target="_blank" rel="noreferrer">Ver o código no GitHub</a>.',
  faqLede:
    "Respostas diretas para quem liga sondas e contatos de umidade e configura alertas de congelamento ou alagamento.",
};

export default ptBr;
