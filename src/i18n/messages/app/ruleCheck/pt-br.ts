import type { RuleCheckMessages } from "./en";

const ptBr: RuleCheckMessages = {
  run: "Verificar agora as regras salvas",
  hint: "Usa as leituras mais recentes e suas regras salvas (salve primeiro). Não envia nada.",
  client: {
    disabled: "Desativada: esta regra está desativada.",
    noConditions: "Não tem condições, então nunca dispara.",
    noneTrue: "Não dispararia: nenhuma das condições é verdadeira.",
    notAllTrue: "Não dispararia: pelo menos uma condição não é verdadeira.",
    alertsOff: "Corresponde, mas os alertas estão desativados, então nada seria enviado.",
    cooldown: "Corresponde, mas um alerta de regra saiu há pouco; o próximo pode ser enviado depois das {time}.",
    fires: "Corresponde: a próxima verificação de alertas (a cada poucos minutos) o enviaria, a menos que os alertas estejam adiados ou seja horário silencioso.",
    checking: "Verificando…",
    noRules: "Ainda não há regras salvas. Adicione uma acima e salve.",
    checkedAt: "Verificado às {time}.",
    untitled: "Regra sem nome",
    or: "OU ",
    and: "E ",
    failed: "Não foi possível verificar as regras agora. Tente novamente em um minuto.",
    conditions: {},
  },
};

export default ptBr;
