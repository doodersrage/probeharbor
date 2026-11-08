import type { ApiMorePublicFormsMessages } from "./en";

const ptBr: ApiMorePublicFormsMessages = {
  contact: {
    success: "Obrigado, recebemos sua mensagem. Costumamos responder em 1–2 dias úteis.",
    verificationFailed: "A verificação falhou.",
    missingFields: "Faltam campos obrigatórios.",
    tooLong: "A mensagem é longa demais.",
    recipientMissing: "O destinatário do e-mail não está configurado.",
    sendFailed: "Não foi possível enviar a mensagem. Tente novamente.",
  },
  freezeAlerts: {
    success: "Confira seu e-mail para confirmar. Os alertas começam na primeira noite de congelamento depois da confirmação.",
    tooMany: "Tentativas demais. Tente novamente em alguns minutos.",
    verificationFailed: "A verificação falhou. Tente novamente.",
    genericError: "Algo deu errado. Tente novamente.",
    move: {
      confirmTitle: "Mudar os alertas de congelamento?",
      confirmBody: "Os e-mails de alerta de congelamento deste endereço passarão a ser para {place} em vez do local atual.",
      button: "Mudar alertas",
      invalidTitle: "Link inválido",
      invalidBodyHtml: "<p>Este link expirou, foi alterado ou os alertas foram cancelados. Seus alertas de congelamento atuais não mudam.</p>",
    },
    unsubscribe: {
      forecastLink: "Previsão de congelamento de canos",
      invalidTitle: "Link inválido",
      invalidBodyHtml: "<p>Este link de cancelamento está sem o token.</p>",
      confirmTitle: "Parar os alertas de congelamento?",
      confirmBodyHtml: "<p>Você vai parar de receber e-mails de alerta de congelamento neste endereço.</p>",
      button: "Cancelar inscrição",
      doneTitle: "Inscrição cancelada",
      doneBodyHtml: "<p>Nenhum outro e-mail de alerta de congelamento será enviado para este endereço.</p>",
      usedTitle: "Inscrição já cancelada",
      usedBodyHtml: "<p>Este link já foi usado ou não é válido.</p>",
    },
  },
  shareReadings: {
    missingToken: "Token ausente",
    tooManyRequests: "Solicitações demais",
    invalidLink: "Link inválido ou expirado",
  },
};

export default ptBr;
