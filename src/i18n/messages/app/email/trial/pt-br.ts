import type { TrialEmailMessages } from "./en";

const ptBr: TrialEmailMessages = {
  subjectTomorrow: "Seu teste do ProbeHarbor {plan} termina amanhã",
  subjectDays: "Seu teste do ProbeHarbor {plan} termina em {days} dias",
  eyebrow: "Lembrete do teste",
  preheaderTomorrow:
    "Seu teste do {plan} termina amanhã. Mantenha SMS, webhooks e links de compartilhamento sem interrupção.",
  preheaderDays:
    "Seu teste do {plan} termina em {days} dias. Mantenha SMS, webhooks e links de compartilhamento sem interrupção.",
  titleTomorrow: "O teste termina amanhã",
  titleDays: "O teste termina em {days} dias",
  introTomorrow:
    "Seu teste do {plan} termina amanhã. Continue no Pro para manter SMS, links de compartilhamento e webhooks ativos.",
  introDays:
    "Seu teste do {plan} termina em {days} dias. Continue no Pro para manter SMS, links de compartilhamento e webhooks ativos.",
  billing:
    "A cobrança é gerenciada no portal do cliente Stripe, acessível pelo seu painel — sem bloqueio surpresa se você renovar antes do fim do teste.",
  bullets: [
    "Alertas de congelamento e vazamento por SMS",
    "Links de compartilhamento públicos e incorporações",
    "Webhooks de saída e limites maiores de dispositivos",
  ],
  ctaPlans: "Ver planos e cobrança",
  ctaCompare: "Comparar recursos",
};

export default ptBr;
