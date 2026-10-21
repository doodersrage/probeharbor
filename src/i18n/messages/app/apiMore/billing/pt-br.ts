import type { ApiMoreBillingMessages } from "./en";

const ptBr: ApiMoreBillingMessages = {
  stripe: {
    unknownPlan: "Plano desconhecido",
    noItems: "A assinatura não tem itens para alterar",
    sessionFailed: "Não foi possível criar a sessão de pagamento",
    checkoutFailed: "Não foi possível iniciar o pagamento",
    portalFailed: "Não foi possível abrir o portal de cobrança",
  },
  claims: {
    requiresPro: "O pacote para sinistro exige o plano Pro",
    pdfUnavailable: "A geração de PDF está temporariamente indisponível. Tente ?format=html ou tente de novo daqui a pouco.",
  },
  certificate: {
    failed: "Não foi possível gerar o certificado",
    pdfUnavailable: "Geração de PDF indisponível",
  },
  claimsEmail: {
    eyebrow: "Pacote para sinistro",
    range: "{from} a {to}",
    preheader: "Um relatório de exposição ao congelamento do ProbeHarbor para {household} está pronto para visualização.",
    title: "Pacote para sinistro: {household}",
    intro: "Um membro de uma casa no ProbeHarbor compartilhou um relatório de exposição ao congelamento e histórico de alertas referente ao período de {range}.",
    body: "O relatório inclui estatísticas de exposição ao congelamento, tabelas de dispositivos e sondas e uma linha do tempo dos alertas críticos do período selecionado, com um código de verificação para que esta exportação específica possa ser reconfirmada depois.",
    verificationCode: "Código de verificação: {code}",
    cta: "Ver pacote para sinistro",
    historyCta: "Abrir este período no Histórico",
    footerNote:
      "Este relatório foi enviado por um membro de uma casa no ProbeHarbor. É um resumo de monitoramento, não uma inspeção certificada -- consulte o próprio relatório para ver o contexto completo.",
    subject: "Pacote para sinistro: {household}",
  },
};

export default ptBr;
