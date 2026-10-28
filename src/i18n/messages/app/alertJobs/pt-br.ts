import type { AlertJobsMessages } from "./en";

const ptBr: AlertJobsMessages = {
  freeze: {
    confirm: {
      eyebrow: "Alertas de congelamento",
      title: "Confirme seus alertas de congelamento",
      intro: "Clique abaixo e enviaremos um e-mail na tarde anterior a cada noite de geada em {place}.",
      ignore: "Se você não pediu isso, ignore esta mensagem. Você não receberá nada sem confirmar.",
      cta: "Confirmar alertas de congelamento",
      footerNote:
        "Você está recebendo isto porque alguém informou este endereço na previsão de congelamento de canos da ProbeHarbor.",
      subject: "Confirme os alertas de congelamento para {place}",
    },
    errors: {
      invalidEmail: "Informe um endereço de e-mail válido.",
      pickLocation: "Escolha um local primeiro.",
      generic: "Algo deu errado. Tente novamente.",
    },
    alert: {
      subjectHigh: "Risco alto de congelamento de canos hoje à noite em {place}: mínima {low}",
      subjectWatch: "Abaixo de zero hoje à noite em {place}: mínima {low}",
      eyebrow: "Alerta de congelamento",
      titleHigh: "Risco alto de congelamento hoje à noite em {place}",
      titleWatch: "Abaixo de zero hoje à noite em {place}",
      bullets: [
        "Abra as portas dos armários sob as pias em paredes externas.",
        "Mantenha a porta da garagem fechada.",
        "Deixe uma torneira de um cano exposto pingando.",
        "Saiba onde fica o registro geral de água.",
      ],
      alsoLater: "Também abaixo de zero mais adiante nesta semana: {nights}.",
      laterNight: "{date} (mínima {low})",
      outdoorNote:
        "Esta é a previsão externa. Uma garagem anexa ou isolada pode ficar bem mais quente, e uma com correntes de ar pode ficar quase tão fria quanto lá fora. Uma sonda de US$ 25 ao lado do cano mostra o que o espaço está realmente fazendo e avisa você antes de chegar ao congelamento.",
      ctaForecast: "Ver a previsão de 5 noites",
      ctaProbe: "Coloque uma sonda na sua garagem",
      footerNote:
        "Enviamos um e-mail na tarde anterior à primeira noite de geada de uma onda de frio e antes de cada noite a −7 °C (20 °F) ou menos. Previsão do National Weather Service (EUA).",
    },
    night: {
      high: "Mínima de {low}, igual ou abaixo da marca de {mark}, a partir da qual canos em garagens, porões ventilados e sótãos sem aquecimento costumam correr risco.",
      watch: {
        one: "Abaixo de zero por cerca de {count} hora, mínima {low}. Canos expostos em paredes externas, perto de portas de garagem ou em porões ventilados ainda podem congelar numa noite longa ou com vento.",
        other:
          "Abaixo de zero por cerca de {count} horas, mínima {low}. Canos expostos em paredes externas, perto de portas de garagem ou em porões ventilados ainda podem congelar numa noite longa ou com vento.",
      },
      above: "Fica acima de zero (mínima {low}).",
      wind: "Vento de até {wind} com temperatura abaixo de zero tira o calor dos canos expostos mais rápido.",
      nextDay: "O dia seguinte também fica abaixo de zero, então os espaços sem aquecimento não vão voltar a esquentar.",
    },
  },
  stuck: {
    faultReset: "o valor que um DS18B20 envia após um reset (muitas vezes alimentação fraca ou cabo longo)",
    faultDisconnected: "o valor que a biblioteca do DS18B20 envia quando a sonda está desconectada",
    faultMessage: "{label} marca {value} °F, {why}. Verifique a fiação da sonda; esta não é uma temperatura real.",
    faultDetail: "{label} marca {value} °F (falha do sensor), verifique a fiação",
    stuckMessage:
      "{label} está enviando exatamente {value} °F há {span}. A sonda pode estar travada ou a placa pode estar reenviando um valor antigo; um congelamento aqui pode passar despercebido.",
    stuckDetail: "{label} travado em {value} °F há {span}",
    spanHours: { one: "{count} hora", other: "{count} horas" },
    spanOverDay: "mais de um dia",
  },
  portfolio: {
    title: "Imóveis em risco hoje ({count})",
    intro: {
      one: "Resumo do proprietário: {count} imóvel está no limite de congelamento ou abaixo:",
      other: "Resumo do proprietário: {count} imóveis estão no limite de congelamento ou abaixo:",
    },
    line: "{name}: {temp} °F (limite {threshold} °F)",
  },
  tenant: {
    greetingName: "Olá, {name},",
    greeting: "Olá,",
    intro: "O administrador de {household} pediu que repassássemos um alerta de risco de congelamento:",
    eyebrow: "Alerta repassado ao inquilino",
    footerNote:
      "Você recebeu isto porque o proprietário indicou você como contato no local. Este não é um acesso completo ao painel.",
    errors: {
      invalidEmail: "Endereço de e-mail inválido.",
      notAuthorized: "Você não tem permissão para avisar o inquilino.",
      noContact: "Nenhum contato de inquilino configurado.",
      deliveryFailed: "Falha no envio do e-mail.",
    },
  },
  feedUptime: {
    title: "Feed inacessível",
  },
  playbook: {
    titleFallback: "Roteiro: {title}",
  },
  ackPlaybook: {
    notFound: "Alerta não encontrado.",
    noHousehold: "Nenhuma casa para repassar ao inquilino.",
    defaultPropertyName: "Imóvel",
    relayFailed: "Não foi possível avisar o inquilino.",
    noWebhook: "Nenhum webhook de saída configurado.",
    ackFailed: "Não foi possível confirmar o alerta.",
    raised:
      "Alarme falso resolvido: limite de congelamento elevado para {value} °F e alertas adiados por 24 h.",
    falseAlarmTip: "Marcado como alarme falso: alertas adiados por 24 h. Correção sugerida: {tip}. Abra {href}",
    results: {
      ack: "Alerta marcado como resolvido.",
      snooze_1h: "Alerta resolvido: outros alertas adiados por 1 hora. Alertas de congelamento continuam ativos; este não se repetirá enquanto continuar.",
      snooze_4h: "Alerta resolvido: outros alertas adiados por 4 horas. Alertas de congelamento continuam ativos; este não se repetirá enquanto continuar.",
      snooze_24h: "Alerta resolvido: outros alertas adiados por 24 horas. Alertas de congelamento continuam ativos; este não se repetirá enquanto continuar.",
      false_alarm:
        "Marcado como alarme falso: alertas adiados por 24 h. Se continuar acontecendo, verifique a posição da sonda.",
      raise_threshold: "Alarme falso resolvido e limite de congelamento elevado.",
      notify_tenant: "Alerta resolvido: e-mail enviado ao contato do inquilino.",
      webhook_ping: "Alerta resolvido: webhook de saída notificado.",
    },
  },
  telegram: {
    help: "Comandos: /status [nome], /snooze [horas], /vacation [dias], /help",
    commandsDisabled: "Os comandos do Telegram ficam desativados até você salvar um Chat ID em Alertas.",
    snoozed: {
      one: "Alertas adiados por {count} hora. Alertas de congelamento e vazamento continuam sendo enviados.",
      other: "Alertas adiados por {count} horas. Alertas de congelamento e vazamento continuam sendo enviados.",
    },
    vacation: {
      one: "Modo férias ativado por {count} dia. Alertas de congelamento e vazamento continuam sendo enviados.",
      other: "Modo férias ativado por {count} dias. Alertas de congelamento e vazamento continuam sendo enviados.",
    },
    noHousehold: "Nenhuma casa ativa.",
    open: "ABERTO",
    closed: "fechado",
    noMatch: "Nenhum sensor corresponde a \"{query}\".",
    noReadings: "Ainda não há leituras.",
  },
  events: {
    notFound: "Alerta não encontrado.",
    noUnhandled: "Nenhum alerta pendente.",
  },
  ackPage: {
    title: "Confirmar alerta",
    heading: "Confirmar o alerta?",
    body: "Confirme que você está cuidando deste alerta de congelamento ou alagamento. Pré-visualizações automáticas de links não concluem esta ação.",
    button: "Sim, marcar como resolvido",
    cancel: "Cancelar",
    resultInvalid: "Link de confirmação inválido ou expirado.",
    resultNone: "Nenhum alerta pendente para confirmar.",
    resultHandled: "Alerta marcado como resolvido.",
  },
  snoozePage: {
    title: "Adiar alertas",
    heading: "Adiar os alertas?",
    body: "Confirme que deseja adiar os avisos de limite. Alertas críticos de congelamento ou alagamento ainda podem ser enviados. Pré-visualizações automáticas de links não concluem esta ação.",
    button: "Sim, adiar",
    cancel: "Cancelar",
    missingToken: "Token ausente",
    resultInvalid: "Link para adiar inválido ou já usado.",
    resultExpired: "O link para adiar expirou.",
    resultSnoozed: { one: "Alertas adiados por {count} hora.", other: "Alertas adiados por {count} horas." },
  },
};

export default ptBr;
