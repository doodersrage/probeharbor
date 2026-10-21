import type { OverviewNudgesMessages } from "./en";

const ptBr: OverviewNudgesMessages = {
  dismiss: "Dispensar",
  openAlerts: "Abrir alertas",
  android: {
    title: "App complementar para Android",
    body: "Sondas ao vivo, alertas e ferramentas da casa no seu celular: o celular não é um sensor.",
    googlePlay: "Disponível no Google Play",
    earlyAccess: "Acesso antecipado para Android",
    orPwa: "Ou instale o PWA",
  },
  bayBuddy: {
    body: "Uma olhada rápida na área de trabalho para um espaço: o clima de congelamento e alagamento sem abrir o painel completo.",
    get: "Baixar o {name}",
    android: "App complementar para Android",
  },
  demoPull: {
    title: "Teste sem hardware",
    body: "Um clique adiciona nosso feed HTTPS público de exemplo. A visão geral mostra temperaturas ao vivo sem precisar de ESP.",
    button: "Testar o feed de demonstração",
  },
  probeSimulator: {
    title: "Ainda explorando?",
    body: "Provoque uma onda de frio ou uma corrente de ar pela porta no simulador interativo, com a mesma lógica de status do espaço da visão geral e sem hardware. Quando estiver pronto, volte e conecte uma sonda de verdade.",
    open: "Abrir o simulador de sonda",
    doorDraft: "Testar corrente de ar",
  },
  nest: {
    title: "Nest ou Ecobee?",
    bodyEntitled:
      "Conecte o Nest/Ecobee em Dispositivos → Feeds pull para ver a temperatura interna da casa junto com suas sondas.",
    bodyNotEntitled:
      "O OAuth de termostato para Nest/Ecobee está no Pro. No Free/Member, você ainda pode enviar a temperatura do clima pelo Home Assistant como referência interna.",
    open: "Abrir feeds pull e termostatos",
    guide: "Guia de OAuth de termostato",
    viewPro: "Ver o Pro",
  },
  pwa: {
    title: "Instale no seu celular",
    body: "Adicione o ProbeHarbor à tela inicial para acessar mais rápido; as notificações push opcionais do navegador ficam em Alertas.",
    install: "Instalar / PWA",
    guide: "Guia de instalação",
  },
  youreLive: {
    title: "Os cartões das sondas ficam em Ao vivo",
    body: "As leituras rápidas foram para Painel → Ao vivo. A visão geral fica com o risco e os próximos passos.",
    openLive: "Abrir Ao vivo",
    finishAlertSetup: "Concluir configuração de alertas",
    sendTestAlert: "Enviar um alerta de teste",
    reviewHistory: "Revisar o histórico",
  },
  alertSetup: {
    title: "Conclua a configuração de alertas",
    thresholdText:
      "Os alertas estão desativados ou falta um limite de congelamento. Defina um antes do frio chegar para ser avisado a tempo.",
    emailText:
      "Os alertas estão ativados, mas o e-mail não está configurado. Ative o canal de e-mail e salve para que os avisos de congelamento cheguem à sua caixa de entrada.",
    setFreezeEmail: "Definir congelamento + e-mail",
    enableEmail: "Ativar alertas por e-mail",
  },
  story: {
    eyebrow: "Cenário de congelamento",
    title: "Como é uma falha no aquecimento às 2 da manhã",
    body: "Um passo a passo sobre posicionamento das sondas, limites e como os alertas acontecem quando os canos estão em risco.",
    read: "Ler o cenário",
    deepDive: "Análise técnica detalhada",
  },
  testAlert: {
    title: "Envie um alerta de teste antes da próxima noite fria",
    body: "Os alertas estão configurados, mas você ainda não confirmou a entrega. Um teste de 30 segundos agora evita descobrir um erro de digitação no seu e-mail ou número de SMS durante um congelamento de verdade.",
    send: "Enviar alerta de teste",
  },
  freezeMap: {
    title: "Compare suas sondas com a vizinhança",
    bodyCity:
      "Participe do mapa público de congelamento para ver como sua sonda mais fria se compara a outras casas com ProbeHarbor em {city}: apenas médias anonimizadas, sem endereço nem nomes de dispositivos.",
    bodyNoCity:
      "Participe do mapa público de congelamento para ver como sua sonda mais fria se compara a outras casas com ProbeHarbor na sua cidade: apenas médias anonimizadas, sem endereço nem nomes de dispositivos.",
    optIn: "Participar nas configurações da casa",
    viewMap: "Ver o mapa",
  },
  multiProperty: {
    title: "Mais de um imóvel?",
    body: "O Pro já permite várias casas em uma só conta: adicione um segundo imóvel, um aluguel ou uma oficina e alterne entre eles pelo painel. O Portfolio aumenta o limite de imóveis para proprietários maiores.",
    add: "Adicionar outro imóvel",
    portfolio: "Portfolio para proprietários",
  },
  alertMoment: {
    labels: {
      freeze: "alerta de congelamento",
      leak: "alerta de vazamento",
      forecast: "previsão de congelamento",
    },
    titles: {
      freeze: "Seu alerta de congelamento de {when} foi enviado só por e-mail",
      leak: "Seu alerta de vazamento de {when} foi enviado só por e-mail",
      forecast: "Sua previsão de congelamento de {when} foi enviada só por e-mail",
    },
    body: "É fácil perder um e-mail durante a noite. O Pro envia o próximo alerta de congelamento ou vazamento por SMS para o seu celular, inclusive no horário silencioso.",
    getSms: "Receber alertas por SMS com o Pro",
    comparePlans: "Comparar planos",
    notNow: "Agora não",
  },
  coldSnap: {
    title: "Checklist para onda de frio",
    body: "A previsão ou a temperatura externa indicam frio. Passos rápidos em casa enquanto os alertas de congelamento vigiam as sondas.",
    forecastOffHtml:
      'O aviso de congelamento por previsão está desativado. <a class="text-link" href="/dashboard/alerts?tab=settings#alert-section-essentials">Ative-o</a> para ser avisado antes que as mínimas externas atinjam seu limite.',
    memberHtml:
      'Os alertas de onda de frio por previsão são liberados no Member. <a class="text-link" href="/dashboard/plans">Comparar planos</a>',
    checklist: [
      "Deixe pingar as torneiras das paredes externas se a tubulação passar por espaços frios.",
      "Verifique as vedações das portas (garagem, oficina, acesso ao porão) e feche as portas que estiverem abertas.",
      "Isole as torneiras externas e desconecte as mangueiras de jardim.",
      "Confirme que os alertas de congelamento estão ativados e envie um teste se não fez isso recentemente.",
      "Verifique se há uma sonda no canto mais frio, perto dos canos ou dos itens guardados.",
    ],
    seasonGuide: "Guia completo da temporada de congelamento",
    playbook: "Plano para ondas de frio",
    essentials: "Configurações essenciais de alertas",
    sendTest: "Enviar um alerta de teste",
  },
};

export default ptBr;
