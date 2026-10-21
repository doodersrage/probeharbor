/**
 * /share-kit copy. The copy-paste blurbs, the HN title and the embed snippet
 * are meant for English-speaking communities and stay in the page as is;
 * only the explanations around them are translated.
 */
import type { ShareKitMessages } from "./en";

const ptBr: ShareKitMessages = {
  title: "Kit de divulgação",
  description:
    "Kit público de boca a boca do ProbeHarbor: textos para Reddit, Home Assistant, HN e Bluesky sobre monitoramento de congelamento e alagamento.",
  breadcrumbHome: "Início",
  kicker: "Boca a boca",
  heading: "Kit de divulgação",
  lede: "O ProbeHarbor cresce com pessoas postando em comunidades que já se preocupam com congelamento, porões úmidos e espaços sem climatização. Esta página é pública de propósito: pegue os textos, ajuste para que soem como você e publique.",
  mapEmbeds: "Incorporar o mapa de congelamento",
  scenarios: "Cenários",
  whyTitle: "Por que isto está no site principal",
  whyCopy:
    "Projetos open source costumam esconder os textos de lançamento em notas privadas. Nós publicamos os nossos para que qualquer pessoa, inclusive você, possa ajudar a divulgar sem inventar a mensagem do zero. Se você encontrar um post igual a um modelo daqui, é de se esperar: o fundador (e, tomara, a comunidade) usa o mesmo kit.",
  whyNote:
    "Por favor, não faça spam. Prefira comunidades em que sondas DIY, Home Assistant ou manutenção da casa no frio sejam assunto, e adapte os textos à conversa.",
  redditTitle: "Reddit / fóruns",
  goodFits: "Bons lugares:",
  goodFitsTail:
    "tópicos sazonais em subs locais ou da sua cidade durante alertas de geada. Evite divulgação de passagem em subs de equipamentos maker sem relação.",
  haTitle: "Comunidade do Home Assistant",
  target: "Onde:",
  haTail:
    "(Share your Projects / integrações de terceiros). Uma versão mais longa também está no repositório, em Contribua, mais abaixo.",
  blueskyTitle: "Bluesky / redes curtas",
  blueskyCopy:
    "Seja breve e abra com o gancho do risco de congelamento. Opcional: uma resposta em seguida com o simulador ou o mapa.",
  hnTitle: "Hacker News / Show HN",
  hnTitleHint: "Título sugerido (cole no campo de título do Show HN):",
  hnBodyHint: "Corpo do comentário: primeiro a história, depois os links. No HN, detalhes concretos funcionam melhor que um slogan genérico.",
  discordTitle: "Discord / chat",
  discordCopy:
    "Serve para canais de projetos em Discords de ESPHome, DIY e makers e canais de “no que você está trabalhando”, não para DMs a frio. Prefira um tópico em que já se fale de congelamento, climatização ou hardware de sondas.",
  embedTitle: "Mapa compacto para incorporar",
  previewLabel: "Prévia:",
  previewLink: "abrir o mapa compacto",
  copy: "Copiar",
  copyTitle: "Copiar título",
  copyBody: "Copiar texto",
  copyIframe: "Copiar iframe",
  copied: "Copiado!",
  copiedStatus: "Copiado para a área de transferência",
  copyFailed: "Falha ao copiar",
  deepLinksTitle: "Links diretos que vale incluir",
  deepLinks: {
    probeDemo: ": simulador interativo (o melhor gancho sem conta)",
    demo: ": leituras ao vivo + divulgação do simulador",
    register: ": grátis, sem cartão → Devices",
    freezeMap: ": dados agregados por cidade, com participação opcional",
    freezeSeason: ": checklist da temporada",
    homeAssistant: ": HACS",
    mqttLabel: "Ponte MQTT",
    mqtt: ": Mosquitto/HA local, espelhado via HTTPS",
    pipeNearMiss: ": cenário do canto frio da garagem",
    crawlspace: ": cenário do vão sob o piso",
    detachedGarage: ": cenário da oficina separada",
    waterHeater: ": cenário de vazamento do aquecedor de água",
    gift: ": dê de presente um inverno de monitoramento",
    stories: ": mais cenários",
    android: ": gancho da lista de espera do app na Play",
    bayBuddy: ": companheiro de humor para a mesa",
    claimPuck: ": chave de presença RP2040-Zero + LED de humor",
  },
  contributeTitle: "Contribua e operadores",
  contributeCopy:
    "Separado do kit de copiar e colar: documentação do repositório para quem entrega código, HACS ou opera uma instância própria, não marketing para visitantes.",
  contributing: "como abrir PRs e rodar o projeto localmente",
  operatorLabel: "Checklist do operador ↗",
  operator:
    "tarefas do fundador/operador (Play Store, Nest/Ecobee, listagem padrão no HACS). Útil se você hospeda por conta própria ou contribui com a infraestrutura do lançamento; não é um texto para divulgar.",
  haDraftLabel: "Rascunho longo para o fórum do HA ↗",
  haDraft: "mais longo que a caixa de texto acima, para quando você precisar de um post completo no fórum",
  discordDraftLabel: "Rascunho de anúncio para Discord / redes ↗",
  discordDraft: "texto alternativo mais longo para chats",
};

export default ptBr;
