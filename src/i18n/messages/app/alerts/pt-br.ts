import type { AlertsMessages } from "./en";

const ptBr: AlertsMessages = {
  page: {
    title: "Alertas",
    subtitle: "O que disparou e quem foi avisado. Em Configurações você decide quando e como alertar.",
    tabsLabel: "Seções de alertas",
    tabActivity: "Atividade",
    tabActivityCount: "Atividade ({count})",
    tabSettings: "Configurações",
  },
  notices: {
    restored:
      "Configurações de alerta anteriores restauradas. Sua versão anterior está em Alterações recentes, caso queira voltar a ela.",
    savedIncomplete:
      "Configurações de alerta salvas. Alguns canais ativados estão sem destino e serão ignorados até que você o preencha.",
    saved: "Configurações de alerta salvas.",
    invalidWebhookUrl:
      "Uma das suas URLs de webhook não é um endereço https:// válido ou aponta para uma rede privada. Corrija e salve de novo.",
    weakTelegramSecret:
      "O segredo do webhook do Telegram precisa ter pelo menos 16 caracteres: é a única proteção desse endpoint. Use um valor aleatório mais longo e salve de novo.",
    restoreFailed: "Não foi possível restaurar essas configurações. Nada foi alterado.",
    saveFailed: "Não foi possível salvar as configurações de alerta.",
    testSentSkipped: "Teste enviado por {sent}. Ignorados por estarem incompletos: {skipped}.",
    testSentVia: "Alerta de teste enviado por {channels}.",
    yourEnabledChannels: "seus canais ativados",
    testIncomplete:
      "Nenhum canal conseguiu enviar: ative um canal e preencha o destino, depois tente de novo.",
    testNoChannels: "Nenhum canal de alerta está ativado. Ative pelo menos um, salve e tente de novo.",
    testFailed: "Não foi possível enviar o alerta de teste. Verifique as configurações dos canais e tente de novo.",
    ackOk: "Alerta marcado como resolvido.",
    ackError: "Não foi possível confirmar o alerta.",
  },
  status: {
    label: "Status:",
    on: "Ativados",
    off: "Desativados",
    lastAlert: "Último alerta {age}",
    noAlertsYet: "Nenhum alerta enviado ainda",
  },
  activity: {
    heading: "Atividade recente de alertas",
    subtitle: "Registro dos canais entregues e ignorados.",
    kindLabel: "Tipo",
    kinds: {
      all: "Todos",
      freeze: "Congelamento",
      flood: "Alagamento",
      forecast: "Previsão",
      threshold: "Limite",
      test: "Teste",
    },
    unhandledOnly: "Só não resolvidos",
    filter: "Filtrar",
    clear: "Limpar",
    confirmAckAll: "Marcar todos os {count} alertas não resolvidos como resolvidos?",
    markAllHandled: "Marcar os {count} como resolvidos",
    newer: "Mais recentes",
    older: "Mais antigos",
  },
  claims: {
    heading: "Precisa de provas para acionar o seguro?",
    body: "Depois de um congelamento ou vazamento real, exporte em Histórico um resumo datado com as leituras correspondentes.",
    open: "Abrir pacote para sinistro",
    seePro: "Ver pacote para sinistro (Pro)",
  },
  testSent: {
    heading: "Os alertas estão funcionando",
    body: "Caminho de entrega confirmado. Alguns próximos passos úteis enquanto você está aqui:",
    shareFamily: "Compartilhe um link ao vivo com a família",
    shareLinks: "Links de compartilhamento",
    downloadClaims: "Baixar pacote para sinistro",
    claimsEvidence: "Pacote de provas para sinistro",
    comparePlans: "Comparar planos",
  },
  testCard: {
    heading: "Enviar um alerta de teste",
    bodyRepeat:
      "Envia uma mensagem de exemplo para cada canal que você tem ativado. Se acabou de mudar as configurações, salve primeiro.",
    bodyFirst:
      "Confirme a entrega uma vez antes de confiar nos avisos de congelamento. Ative pelo menos um canal acima, salve e envie.",
    sendNow: "Enviar teste agora",
  },
  history: {
    heading: "Alterações recentes",
    body: "Cada salvamento, do mais recente ao mais antigo. Restaurar volta as configurações ao que eram logo antes daquele salvamento; sua versão atual também fica guardada aqui.",
    confirmUndo: "Desfazer sua última alteração nas configurações de alerta?",
    confirmRestore:
      "Voltar as configurações de alerta ao que eram antes desta alteração? As alterações posteriores também são desfeitas.",
    undo: "Desfazer",
    restoreBefore: "Restaurar para antes disto",
  },
  list: {
    empty:
      "Nenhum evento de alerta corresponde a este filtro ainda. Depois de um congelamento, alagamento ou teste, as linhas aparecem aqui com o motivo e ações para alarmes falsos.",
    sent: "Aceito por {channels}",
    skipped: "Ignorado em {channels}",
    why: "Motivo",
    suggested: "Sugestão: {tip}.",
    suggestedFix: "Correção sugerida: {tip}.",
    open: "Abrir",
    raiseThreshold: "Subir limite de congelamento em 1,1 °C (2 °F)",
    checkPlacement: "Verificar a posição da sonda",
    handled: "Resolvido",
    recovered: "Normalizado",
    expired: "Expirado",
    showMore: {
      one: "Mostrar mais {count} parecido (até {oldest})",
      other: "Mostrar mais {count} parecidos (até {oldest})",
    },
    hideSimilar: { one: "Ocultar {count} parecido", other: "Ocultar {count} parecidos" },
    caption: "Eventos recentes de entrega e confirmação de alertas",
    columns: {
      when: "Quando",
      kind: "Tipo",
      title: "Título",
      why: "Motivo",
      sent: "Enviado",
      skipped: "Ignorado",
      ack: "Confirmação",
    },
  },
  ack: {
    imOnIt: "Estou cuidando",
    imOnItTitle: "Interrompe os alertas repetidos até o espaço voltar a ficar acima do seu limite",
    more: "Mais",
    snooze1h: "Resolver e adiar 1 h",
    snooze4h: "Resolver e adiar 4 h",
    snooze24h: "Resolver e adiar 24 h",
    falseAlarm: "Alarme falso (adiar 24 h)",
    raiseThreshold: "Alarme falso + subir limite em 1,1 °C (2 °F)",
    notifyTenant: "Resolver e avisar o inquilino por e-mail",
    webhookPing: "Resolver e chamar o webhook",
  },
  tipsCard: {
    summary: "Recebendo alertas demais? Dicas para reduzir alarmes falsos",
    intro:
      "Alarmes falsos de congelamento costumam vir da posição ou do limite. Os de alagamento vêm de respingos, condensação ou ciclos da bomba do poço de drenagem: contatos molhados disparam mesmo com os alertas adiados.",
    freeze: "Congelamento",
    flood: "Alagamento / vazamento",
  },
  tips: {
    placement: {
      title: "Verifique a posição da sonda",
      detail:
        "Sondas em trilhos de portão, perto de exaustores ou em paredes que pegam sol oscilam muito e disparam alertas de congelamento que os canos nunca sentem. Mude para perto do trecho de cano mais frio ou de um canto da laje.",
      hrefLabel: "Simulador de sonda",
    },
    unplugged: {
      title: "Sem dados geralmente é desconectada",
      detail:
        "Se uma sonda fica em silêncio por horas, pense primeiro em energia ou Wi‑Fi, não em congelamento. Ative os alertas de sensor sem dados e confirme em Dispositivos que o ESP ainda envia POSTs.",
      hrefLabel: "Guia de leituras desatualizadas",
    },
    threshold: {
      title: "Suba o limite um ou dois graus",
      detail:
        "Um limite de 0 °C (32 °F) dispara a cada corrente de ar breve. Muitas casas usam 1–2 °C (34–36 °F) para agir antes de o gelo se formar sem acordar a cada porta aberta.",
      hrefLabel: "Alertas essenciais",
    },
    snooze: {
      title: "Pare o barulho enquanto conserta",
      detail:
        "Trabalhando num espaço frio? Toque em “Estou cuidando” no alerta: ele não se repetirá enquanto esse congelamento continuar. Adiar silencia alertas de rotina, mas alertas de congelamento, vazamento e queda de energia sempre chegam. Para alarmes falsos, aumente o limite ou reposicione a sonda.",
    },
    splash: {
      title: "Respingos e condensação",
      detail:
        "Um contato embaixo de um aquecedor de água ou tanque pode acusar molhado de forma intermitente por condensação ou uma gota que já parou. Fixe no fundo da bandeja, longe dos pontos de gotejamento, e seque depois de um alarme falso.",
    },
    sump_cycle: {
      title: "Ciclo da bomba de drenagem ≠ vazamento",
      detail:
        "O nível do poço de drenagem subir durante uma tempestade é normal. Use um contato de alagamento/vazamento para água parada e uma regra personalizada level_above só se quiser aviso antecipado de falha da bomba, não a cada ciclo.",
      hrefLabel: "Regras de alerta",
    },
    test_wet: {
      title: "Teste com um pano úmido e depois seque",
      detail:
        "Alertas de alagamento disparam automaticamente quando há água (mesmo nas férias). Depois de um teste de posição, seque o contato para ele não ficar marcando molhado a noite toda.",
    },
  },
  staleProbes: {
    one: "{count} sonda parece desatualizada: provavelmente desconectada, sem Wi‑Fi ou com a bateria descarregada. Verifique a energia e Dispositivos antes de tratar como congelamento.",
    other:
      "{count} sondas parecem desatualizadas: provavelmente desconectadas, sem Wi‑Fi ou com a bateria descarregada. Verifique a energia e Dispositivos antes de tratar como congelamento.",
  },
  wetFlood: {
    one: "{count} sensor de alagamento/vazamento está molhado agora: alertas de alagamento chegam mesmo adiados ou no modo férias. Verifique a bandeja, o poço de drenagem ou a tubulação de entrada.",
    other:
      "{count} sensores de alagamento/vazamento estão molhados agora: alertas de alagamento chegam mesmo adiados ou no modo férias. Verifique a bandeja, o poço de drenagem ou a tubulação de entrada.",
  },
  why: {
    probeAt: "{probe} a {temp} °F",
    probeAtUnnamed: "Sonda a {temp} °F",
    threshold: "limite {temp} °F",
    outdoor: "externa {temp} °F",
    deltaT: "ΔT {delta} °F",
    runway: "~{hours} h de margem",
    doorOpen: "porta aberta por perto",
  },
  referral: {
    heading: "Dê de presente um inverno de monitoramento",
    introHtml: "Compartilhe seu link: novos cadastros ganham <strong>7 dias extras</strong> no teste do Pro.",
    bonusDays: {
      one: "Você tem {count} dia de teste bônus por indicações bem-sucedidas.",
      other: "Você tem {count} dias de teste bônus por indicações bem-sucedidas.",
    },
    earn: "Você ganha +7 dias de teste quando um amigo indicado assina o Pro.",
    howGifting: "Como funciona o presente",
    loading: "Carregando link de indicação…",
    copyInvite: "Copiar link de convite",
    copied: "Copiado!",
    copyFailed: "Falha ao copiar",
    unavailable: "Link de indicação indisponível.",
    friendsJoined: {
      one: "{count} amigo entrou pelo seu link.",
      other: "{count} amigos entraram pelo seu link.",
    },
    noSignups: "Nenhum cadastro ainda, compartilhe o link acima.",
  },
};

export default ptBr;
