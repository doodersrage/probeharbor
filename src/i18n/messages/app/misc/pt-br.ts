import type { MiscMessages } from "./en";

const ptBr: MiscMessages = {
  feeds: {
    requestFailed: "A solicitação ao feed de temperatura falhou ({status})",
    invalidPayload: "Dados do feed de temperatura inválidos",
    missingRoot: 'Falta um objeto "{root}" no feed de temperatura',
    timedOut: "O feed não respondeu a tempo.",
    invalidJson: "O feed não retornou um JSON válido.",
    unreachableDetail: "Não foi possível acessar o feed ({detail})",
    unknown: "Erro desconhecido no feed",
    unreachable: "Feed inacessível",
    responding: { one: "{count} sonda respondendo", other: "{count} sondas respondendo" },
  },
  forms: {
    turnstileMissing: "Falta a verificação do Turnstile.",
    turnstileFailed: "A verificação do Turnstile falhou.",
    tooManyAttempts: "Muitas tentativas. Tente de novo em alguns minutos.",
    tooManyMessages: "Muitas mensagens. Tente de novo em alguns minutos.",
  },
  share: {
    metricsNotAllowed: "Este link compartilhado não permite formatos de métricas",
  },
};

export default ptBr;
