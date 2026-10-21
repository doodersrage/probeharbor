import type { ShellMessages } from "./en";

const ptBr: ShellMessages = {
  defaultTitle: "Painel",
  nav: {
    overview: "Visão geral",
    live: "Ao vivo",
    portfolio: "Portfolio",
    devices: "Dispositivos",
    alerts: "Alertas",
    history: "Histórico",
    household: "Casa",
    share: "Compartilhar",
    plans: "Planos",
    settings: "Configurações",
    ops: "Operações",
    dashboard: "Painel",
  },
  sidebar: {
    ariaLabel: "Painel",
    mobileAriaLabel: "Atalhos de monitoramento",
    menu: "Menu",
    groups: { monitor: "Monitoramento", account: "Conta", admin: "Admin" },
    unhandledBadge: "{count} sem tratamento",
    laggingProbes: "Sondas atrasadas",
    search: "Buscar",
    refresh: "Atualizar",
    backToSite: "Voltar ao site",
    signOut: "Sair",
  },
  topbar: {
    noReading: "Sem leitura",
    refresh: "Atualizar",
    switched: "Imóvel ativo alterado.",
    switchError: "Não foi possível trocar de imóvel. Tente novamente.",
  },
  kiosk: {
    enter: "Modo quiosque",
    exit: "Sair do quiosque",
    enterTitle: "Modo quiosque / oficina: tela cheia e tela sempre ligada",
    exitTitle: "Sair do modo quiosque / oficina",
  },
  switcher: {
    activeProperty: "Imóvel ativo",
    selectHousehold: "Escolha uma casa",
    switchHousehold: "Trocar de casa",
    property: "Imóvel",
  },
  roles: {
    owner: "Proprietário",
    member: "Editor",
    viewer: "Visualizador",
    alert_only: "Só alertas",
    property_manager: "Administrador do imóvel",
  },
  readingAge: {
    never: "Nunca",
  },
  unacked: {
    label: { one: "alerta sem tratamento.", other: "alertas sem tratamento." },
    review: "Revisar",
    claimsPack: "Baixar o pacote de provas para sinistro",
  },
  lowBattery: {
    deviceHealth: "Saúde dos dispositivos",
    alertSettings: "Configurações de alertas",
  },
  adminTabs: {
    ariaLabel: "Seções de administração",
    ops: "Visão geral",
    feeds: "Saúde dos feeds",
    jobs: "Tarefas",
    email: "E-mails bloqueados",
    users: "Usuários",
    contacts: "Contatos",
  },
  shareTabs: {
    ariaLabel: "Seções de compartilhamento",
    links: "Links",
    api: "API e webhooks",
    integrations: "Integrações",
  },
  nudge: {
    comparePlans: "Comparar planos",
    upgradeTo: "Mudar para o {plan}",
    notNow: "Agora não",
    retentionDays: { one: "{count} dia", other: "{count} dias" },
    retentionYears: { one: "{count} ano", other: "{count} anos" },
    items: {
      csv_export: {
        title: "Exporte o histórico em CSV",
        body: "O Member libera o download em CSV das leituras guardadas, útil para documentos do seguro e para ajustar a climatização.",
      },
      history_charts: {
        title: "Mais histórico à mão",
        body: "O Member inclui exportação CSV e todas as ferramentas de gráficos. Contas Free continuam vendo os dados ao vivo e os gráficos recentes.",
      },
      sms_alerts: {
        title: "Receba alertas de congelamento e vazamento por SMS",
        body: "O Pro adiciona SMS via Twilio, essencial quando o e-mail não é rápido o bastante numa onda de frio ou com um contato molhado.",
      },
      push_alerts: {
        title: "Notificações push neste dispositivo",
        body: "As notificações push do navegador estão em todos os planos, então os alertas chegam mesmo com o painel fechado.",
      },
      webhooks: {
        title: "Ligue os alertas ao Home Assistant ou ao Zapier",
        body: "O Pro adiciona webhooks de alerta de saída, webhooks de leitura na ingestão, endpoints de entrada para adiar/status e a integração oficial do Home Assistant via HACS.",
      },
      share_links: {
        title: "Mais tipos de compartilhamento para convidados e Grafana",
        body: "O Free já inclui um link ao vivo para a família. O Pro adiciona histórico, métricas, incorporações e links que não expiram.",
      },
      api_keys: {
        title: "Chaves de API para Grafana e scripts",
        body: "O Pro inclui chaves de API do painel e um JSON de dashboard do Grafana para baixar.",
      },
      embed_widget: {
        title: "Mostre as temperaturas ao vivo no seu site",
        body: "Os links compartilhados do Pro podem alimentar um widget incorporável para um portal da família ou a página da sua oficina.",
      },
      status_pages: {
        title: "Página de status pública",
        body: "Casas Pro podem publicar uma página de status protegida por token e um feed iCal com a previsão de geada.",
      },
      device_limit: {
        title: "Precisa de mais dispositivos push?",
        body: "O Free permite {free} dispositivos push por imóvel, o Member {member} e o Pro {pro}: faça upgrade quando passar do limite.",
      },
      data_retention: {
        title: "Guarde um histórico mais longo",
        body: "O Free guarda {free} de leituras. O Member amplia para {member}; o Pro guarda {pro} ou mais para comparar estações e anos.",
      },
      cold_risk: {
        title: "Antecipe as noites de geada",
        body: "Todos os planos têm um relógio de tempo até o congelamento para este espaço sem aquecimento. O Member adiciona avisos de geada pela previsão externa. O Pro adiciona os alertas oficiais de geada e frio do NWS (EUA).",
      },
      prometheus: {
        title: "Colete métricas no Grafana",
        body: "O Pro libera métricas no formato Prometheus e chaves de API para sua stack de observabilidade.",
      },
      multi_property: {
        title: "Vai monitorar um segundo imóvel?",
        body: "O Pro aceita até {max} imóveis próprios: casa de veraneio, imóvel alugado ou oficina.",
      },
      portfolio_scale: {
        title: "Administra uma carteira de imóveis maior?",
        body: "O Portfolio eleva o limite de imóveis próprios para {max} e adiciona acessos de administrador do imóvel para a equipe no local.",
      },
      claims_pack: {
        title: "Exporte um pacote de provas para sinistro",
        body: "O Pro gera um resumo imprimível de congelamento/vazamento com os CSVs de leituras e eventos de alerta correspondentes para o período que você escolher.",
      },
      thermostat_integration: {
        title: "Conecte seu Nest ou Ecobee",
        body: "O Pro mostra a leitura e o setpoint do termostato da casa ao lado desta sonda e adiciona esse contexto aos alertas de congelamento.",
      },
    },
  },
  pwa: {
    eyebrow: "Já funciona no seu celular",
    title: "Instale o app web (PWA)",
    body: "O ProbeHarbor já funciona: adicione à tela inicial pelo Chrome ou Safari. Mesma conta, leituras ao vivo e alertas. O app nativo para Android está em acesso antecipado no GitHub enquanto a revisão do Google Play termina; não precisa esperar pelo Play.",
    step1: "Abra probeharbor.dev no Chrome (Android) ou Safari (iPhone).",
    step2Html: "Use <strong>Instalar app</strong> ou Compartilhar → <strong>Adicionar à Tela de Início</strong>.",
    step3: "Abra o ícone; ative as notificações push depois em Painel → Alertas.",
    installApp: "Instalar app",
    guide: "Passos para instalar o PWA",
    android: "App nativo para Android (em breve)",
    client: {
      installStarted: "Instalação iniciada.",
      installDismissed: "Instalação cancelada: o guia passo a passo continua valendo.",
      installed: "App instalado.",
    },
  },
};

export default ptBr;
