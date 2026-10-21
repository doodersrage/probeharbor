import type { StatusEmailMessages } from "./en";

const ptBr: StatusEmailMessages = {
  confirm: {
    subject: "Confirme sua inscrição no status do ProbeHarbor",
    eyebrow: "Atualizações de status",
    title: "Confirme sua inscrição",
    intro: "Clique abaixo para receber um e-mail sempre que o status do sistema ProbeHarbor mudar.",
    body: "Se você não pediu isso, pode ignorar esta mensagem — você só será inscrito se confirmar.",
    cta: "Confirmar inscrição",
    footerNote:
      "Você está recebendo isto porque alguém informou este endereço na página de status do ProbeHarbor. Ao confirmar, você recebe apenas e-mails sobre mudanças de status.",
  },
  change: {
    eyebrow: "Atualização de status",
    subjectHealthy: "ProbeHarbor: tudo normal novamente",
    subjectDegraded: "ProbeHarbor: serviço instável",
    titleHealthy: "O ProbeHarbor voltou ao normal",
    titleDegraded: "O ProbeHarbor está instável",
    introHealthy: "As tarefas agendadas e o monitoramento de ingestão estão funcionando normalmente de novo.",
    introDegraded: "Estamos vendo falhas em tarefas ou execuções agendadas perdidas. Estamos investigando.",
    cta: "Ver status do sistema",
    unsubscribe: "Cancelar inscrição nas atualizações de status",
    footerNote: "Você está recebendo isto porque se inscreveu nas atualizações de status do ProbeHarbor.",
  },
};

export default ptBr;
