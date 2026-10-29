import type { ApiUserMessages } from "./en";

const ptBr: ApiUserMessages = {
  testAlert: {
    title: "Alerta de teste do ProbeHarbor",
    body: "Esta é uma notificação de teste do seu painel do ProbeHarbor. Se você recebeu, seus canais de alerta estão funcionando.",
    unknownChannel: "Canal desconhecido",
    noChannels: "Nenhum canal entregou o alerta",
    failed: "O alerta de teste falhou",
  },
  snooze: {
    snoozed: { one: "Alertas adiados por {count} hora.", other: "Alertas adiados por {count} horas." },
    vacationUntil: "Férias até {date}.",
    vacationDays: { one: "Modo férias por {count} dia.", other: "Modo férias por {count} dias." },
    snoozeCleared: "Adiamento cancelado.",
    vacationCleared: "Modo férias desativado.",
  },
  ack: {
    nothing: "Nada para confirmar",
    handled: { one: "{count} alerta resolvido.", other: "{count} alertas resolvidos." },
  },
  chartShare: {
    upgradeRequired: "Para compartilhar gráficos é preciso um plano superior",
    invalidPng: "PNG inválido",
  },
  pinned: {
    invalidMetric: "Métrica inválida",
    max: "Você pode fixar até {max} métricas de status.",
    noMetrics: "Nenhuma métrica",
  },
  noEditableProperties: "Nenhum imóvel editável",
  noProperty: "Nenhum imóvel",
  noValidFeeds: "Nenhum feed válido informado.",
  feedIdRequired: "O id do feed é obrigatório",
  csvRequiresPlan: "A exportação em CSV exige uma assinatura ativa ou acesso de administrador",
  doorCsvFailed: "Não foi possível exportar o histórico das portas. Tente de novo em instantes.",
  doorCsvTooMany: "Há aberturas de portas demais para um único CSV (mais de 5.000). Escolha menos dias e tente de novo.",
  push: {
    invalidSubscription: "Inscrição inválida",
    missingEndpoint: "Endpoint ausente",
    invalidFcmToken: "Token do FCM inválido",
    invalidPlatform: "Plataforma inválida",
    missingToken: "Token ausente",
  },
  weather: {
    historyUnavailable: "Histórico do clima indisponível",
    notConfigured: "A API de clima não está configurada",
    locationUnavailable: "Não foi possível carregar o clima deste local.",
    geocodeFailed: "Local não encontrado",
    geocodeRequestFailed: "A busca do local falhou",
  },
};

export default ptBr;
