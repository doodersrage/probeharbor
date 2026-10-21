import type { SystemStatusMessages } from "./en";

const ptBr: SystemStatusMessages = {
  title: "Status do sistema",
  description:
    "Saúde do ProbeHarbor ao vivo: tarefas agendadas de alertas, atividade de ingestão, hospedagem na Cloudflare e se os crons rodam no horário.",
  breadcrumbHome: "Início",
  kicker: "Status",
  lede: "Saúde pública das tarefas e da ingestão do ProbeHarbor: o que nós mesmos medimos. Atualizado a cada carregamento da página.",
  banner: {
    degraded: "Degradado: investigando",
    elevated: "Operacional: limites de ingestão elevados",
    operational: "Todos os sistemas operacionais",
    pollOverdue: "A coleta do histórico está atrasada.",
    jobErrors: {
      one: "{count} erro de tarefa cron nas últimas 24 horas.",
      other: "{count} erros de tarefas cron nas últimas 24 horas.",
    },
    latestFailed: "A última execução do cron falhou.",
    noCron: "Nenhuma execução recente de cron registrada.",
    healthyDetail:
      "Saudável significa que a coleta do histórico está em dia e nenhuma tarefa cron falhou nas últimas 24 horas. Eventos de limite de ingestão aparecem separadamente e, sozinhos, não mudam este aviso para degradado.",
  },
  stats: {
    lastPoll: "Última coleta do histórico",
    overdue: " (atrasada)",
    pollSchedule: "Frequência da coleta",
    pollScheduleValue: "A cada 15 minutos (:00, :15, :30, :45 UTC)",
    lastCronJob: "Última tarefa cron",
    lastJobStatus: "Status da última tarefa",
    jobErrors: "Erros de tarefas (24 h)",
    rateLimitEvents: "Eventos de limite de ingestão (24 h)",
    checkedAt: "Verificado em",
  },
  incidents: {
    title: "Incidentes",
    lede: "Relatos escritos sobre quedas ou degradações visíveis para os clientes. Os erros de cron acima também acionam o aviso ao vivo e os e-mails para os assinantes de status.",
    none: "Nenhum incidente registrado ainda. Quando publicarmos um incidente resolvido (data, impacto, recuperação), ele aparecerá aqui. Até lá, o aviso ao vivo e a tabela de execuções recentes do cron são a referência.",
    open: "Aberto: serviço degradado",
    started: "Começou por volta deste carregamento da página ({when}). Os assinantes de status são avisados na degradação e na recuperação.",
  },
  runs: {
    title: "Execuções recentes do cron",
    lede: "Últimas 14 execuções de tarefas (sem detalhes sensíveis).",
    empty: "Nenhuma execução de tarefa registrada ainda.",
    started: "Início",
    job: "Tarefa",
    status: "Status",
  },
  jobStatus: { success: "sucesso", error: "erro", running: "em andamento" },
  monitor: {
    title: "O que monitoramos",
    items: [
      "Coleta do histórico a cada hora e avaliação de alertas",
      "E-mails de resumo semanal e relatórios mensais/trimestrais",
      "Retenção das leituras dos sensores e agregados do mapa de geada",
      "Lembretes do período de teste e e-mails de boas-vindas",
    ],
  },
  hosting: {
    title: "Hospedagem",
    bodyHtml:
      "O ProbeHarbor roda na <strong>rede de borda da Cloudflare</strong> (Workers), então o dashboard e as APIs de ingestão ficam perto dos visitantes, sem você precisar manter um servidor em casa. Publicamos a saúde das tarefas e da ingestão <em>desta</em> página, não um percentual de disponibilidade de marketing nem o SLA da plataforma da Cloudflare como se fosse nosso.",
    stackNotes: "Notas técnicas:",
    astro: "Astro na Cloudflare",
    workers: "Deploy no Workers",
    cloudflareIncidents: "Incidentes da plataforma Cloudflare:",
  },
  notify: {
    title: "Receba avisos",
    lede: "Receba um único e-mail se este status mudar (degradado ou de volta ao normal). Nada de e-mails de rotina. O formulário é protegido pelo Cloudflare Turnstile.",
    subscribed: "Confira sua caixa de entrada: a inscrição só vale depois que você clicar no link de confirmação.",
    confirmed: "Você está inscrito nas atualizações de status.",
    unsubscribed: "Você cancelou a inscrição nas atualizações de status.",
    errors: {
      invalid_email: "Digite um endereço de e-mail válido.",
      verification: "A verificação falhou. Tente de novo.",
      rate_limited: "Tentativas demais. Tente de novo em alguns minutos.",
      invalid_token: "Esse link é inválido ou já foi usado.",
    },
    company: "Empresa",
    email: "E-mail",
    submit: "Avise-me sobre mudanças de status",
  },
  age: { never: "nunca", justNow: "agora mesmo" },
  chip: {
    unknown: "Status do sistema",
    healthy: "Todos os sistemas operacionais",
    degraded: "Degradado, veja o status",
  },
};

export default ptBr;
