import type { OverviewCardsMessages } from "./en";

const ptBr: OverviewCardsMessages = {
  garageRisk: {
    noDevices: {
      title: "Adicione uma sonda para começar",
      detail: "Crie um dispositivo push e envie uma leitura por POST, ou experimente o feed de demonstração sem hardware.",
      action: "Conectar um dispositivo",
    },
    waiting: {
      title: "Aguardando uma leitura",
      detail:
        "Seu dispositivo está configurado, mas ainda não enviou dados. Conclua a ingestão e depois confirme os alertas de congelamento e alagamento.",
      action: "Concluir configuração",
    },
    wet: {
      titleOne: "Alagamento / vazamento: molhado agora",
      titleMany: "Sensores de alagamento / vazamento molhados",
      detail: {
        one: "{count} sensor de alagamento/vazamento está molhado agora: alertas de alagamento ignoram o adiamento e o modo férias. Verifique a bandeja, o poço de drenagem ou a linha de abastecimento.",
        other:
          "{count} sensores de alagamento/vazamento estão molhados agora: alertas de alagamento ignoram o adiamento e o modo férias. Verifique a bandeja, o poço de drenagem ou a linha de abastecimento.",
      },
    },
    stale: {
      title: "A sonda pode estar desconectada",
      detail: {
        one: "{count} sonda parece desatualizada: provavelmente desconectada, sem Wi‑Fi ou com a bateria descarregada. Verifique a energia e Dispositivos antes de tratar como congelamento.",
        other:
          "{count} sondas parecem desatualizadas: provavelmente desconectadas, sem Wi‑Fi ou com a bateria descarregada. Verifique a energia e Dispositivos antes de tratar como congelamento.",
      },
    },
    freezeNow: {
      title: "Risco de congelamento agora",
      detail: "A sonda mais fria está em {temp} °F (limite {threshold} °F).",
    },
    freezeSoon: {
      title: "Congelamento em poucas horas",
      detail:
        "A previsão é que este espaço chegue a {threshold} °F. Deixe as torneiras pingando ou ligue o aquecimento enquanto ainda há tempo.",
      detailAt:
        "A previsão é que este espaço chegue a {threshold} °F por volta das {time}. Deixe as torneiras pingando ou ligue o aquecimento enquanto ainda há tempo.",
    },
    freezeLater: {
      title: "Congelamento mais tarde hoje",
      titleAt: "Congelamento por volta das {time}",
      detail: "Cerca de {hours} horas até {threshold} °F, com base no atraso deste espaço em relação ao ar externo.",
    },
    nightsAtRisk: {
      one: "{count} noite com risco de congelamento",
      other: "{count} noites com risco de congelamento",
    },
    coldSnap: {
      title: "Frente fria chegando",
      detail: "Está frio lá fora: siga o checklist e confirme que os alertas de previsão estão ativados.",
    },
    nights: {
      detail: "Está frio lá fora: confira as sondas em Ao vivo e se os alertas de previsão estão ativados.",
    },
    finishAlerts: {
      title: "O espaço está bem: conclua os alertas",
      detail:
        "Ative os alertas e o e-mail para receber avisos de congelamento e alagamento: contatos molhados avisam sozinhos assim que os alertas estão ativados.",
      action: "Configurar congelamento + e-mail",
    },
    nearFreeze: {
      title: "Perto do limite de congelamento",
      detail: "Sonda mais fria em {temp} °F, a menos de 5 °F de {threshold} °F.",
    },
    ok: {
      title: "Tudo certo",
      detail: "As sondas estão enviando dados: nada no limite de congelamento, nenhum contato de alagamento molhado.",
    },
    actions: {
      openLive: "Abrir Ao vivo",
      checkDevices: "Verificar dispositivos",
      openAlerts: "Abrir alertas",
      openTimeToFreeze: "Ver tempo até congelar",
      coldSnapChecklist: "Checklist de frente fria",
    },
  },

  readiness: {
    checks: {
      alerts_on: {
        label: "Alertas ativados (congelamento + alagamento automático)",
        hint: "Ative os alertas em Painel → Alertas: contatos de alagamento/vazamento avisam automaticamente quando molhados.",
        action: "Ativar",
      },
      channel: {
        label: "Pelo menos um canal de alerta configurado",
        hint: "Ative e-mail, SMS ou outro canal com um destino.",
        action: "Configurar canais",
      },
      test_alert: {
        label: "Pelo menos um alerta de teste enviado",
        hint: "Envie um teste em Painel → Alertas antes da temporada de frio.",
        action: "Enviar um teste",
      },
      devices: {
        label: "Dispositivo push ou pull cadastrado",
        hint: "Adicione um dispositivo push ou um feed pull em Painel → Dispositivos.",
        action: "Adicionar um dispositivo",
      },
      flood_sensor: {
        label: "Contato de alagamento / vazamento cadastrado",
        hint: "Isto é um sensor, não uma configuração: coloque um contato de vazamento seco/molhado sob o aquecedor de água, na lavanderia ou no poço de drenagem. Ele avisa automaticamente quando molhado. Em um ESP32, conecte-o e marque \"Leak\" no gravador web.",
        action: "Gravador web",
      },
      fresh: {
        label: "Todas as sondas enviando dados (nenhuma desatualizada)",
        action: "Verificar dispositivos",
      },
      battery: {
        label: "Nenhuma sonda com bateria criticamente baixa",
        action: "Verificar baterias",
      },
      weather: {
        label: "Local do clima / NWS configurado",
        hint: "Defina o clima externo em Painel → Configurações (cidade do OpenWeather, estação Ambient ou WeatherFlow).",
        action: "Definir local",
      },
      runway: {
        label: "Aviso de tempo até congelar ativado",
        hint: "Ative o aviso de tempo até congelar para saber antes que uma sonda chegue ao congelamento, enquanto ainda dá tempo de agir.",
        action: "Ativar",
      },
      level_rule: {
        label: "Opcional: regra level_above para poço/reservatório",
        hint: "Sensores de nível aparecem em Visão geral; adicione uma condição Regras → level_above se quiser um aviso antecipado de falha da bomba.",
        action: "Adicionar uma regra",
      },
      forecast: {
        label: "Aviso de congelamento pela previsão ativado",
        hint: "Ative \"Avisar quando a previsão externa ficar abaixo de zero\" em Alertas → Configurações → Quando alertar.",
        action: "Ativar",
      },
      nws: {
        label: "Alertas oficiais de congelamento do NWS (EUA) ativados",
        hint: "Ative os avisos oficiais de congelamento em Alertas → Configurações → Quando alertar → Umidade, quedas rápidas e avisos oficiais de congelamento.",
        action: "Ativar",
      },
    },
    staleHint: {
      one: "{count} sonda não enviou dados recentemente.",
      other: "{count} sondas não enviaram dados recentemente.",
    },
    batteryHint: {
      one: "{count} dispositivo abaixo de {pct}% de bateria.",
      other: "{count} dispositivos abaixo de {pct}% de bateria.",
    },
  },

  heating: {
    rapidDrop: {
      label: "Queda rápida de temperatura",
      detail: "O espaço está esfriando cerca de {rate} °F/h. Verifique portas, aquecedores e isolamento.",
    },
    doorOpen: {
      label: "Uma porta pode estar causando perda de calor",
      detail: "Porta aberta há ~{minutes} min enquanto a temperatura cai.",
    },
    nearFreeze: {
      label: "Perto do limite de congelamento",
      detail: "Atual {temp} °F: o limite é {threshold} °F.",
    },
    coldSnap: {
      label: "Frente fria lá fora",
      detail: "Externo {outdoor} °F: {margin} °F de margem acima do seu alerta de congelamento.",
    },
    condensation: {
      label: "Risco de condensação",
      detail:
        "Ponto de orvalho ~{dewPoint} °F: o ar está a {margin} °F da saturação. Pisos e ferramentas frios podem suar mesmo que a sonda esteja mais quente.",
    },
    houseGap: {
      label: "Diferença casa–sonda",
      detailThermostat:
        "Termostato da casa {house} °F contra sonda {probe} °F ({delta} °F mais quente dentro). Os alertas de congelamento continuam valendo para a sonda sem climatização.",
      detailReference:
        "Referência interna {house} °F contra sonda {probe} °F ({delta} °F mais quente dentro). Os alertas de congelamento continuam valendo para a sonda sem climatização.",
    },
    warmHouse: {
      label: "Casa quente, sonda fria",
      detail:
        "A sonda está em {threshold} °F ou menos enquanto a casa marca {house} °F: esperado em uma oficina, garagem ou sótão sem aquecimento.",
    },
    hvacHeating: {
      label: "Aquecimento ligado",
      detail:
        "O aquecedor está ligado (casa a {house} °F), mas o espaço monitorado não é climatizado: ele vai continuar mais frio que os cômodos.",
    },
    hvacCooling: {
      label: "Ar-condicionado ligado",
      detail:
        "O ar-condicionado está ligado (casa a {house} °F). Uma sonda em sótão, oficina ou garagem quente ainda pode disparar em dias de sol.",
    },
  },

  thermal: {
    hitsTomorrow: "{time} de amanhã",
    hitsWeekday: "{time} de {weekday}",
    minutes: { one: "{count} minuto", other: "{count} minutos" },
    hours: { one: "{count} hora", other: "{count} horas" },
    days: { one: "{count} dia", other: "{count} dias" },
    aFewHours: "algumas horas",
    trend: {
      alreadyBelow: "Já está no seu limite de congelamento ou abaixo dele.",
      needMore: "São necessárias mais leituras recentes para estimar uma tendência.",
      tooClose: "As leituras estão próximas demais para calcular uma tendência.",
      rising: "A temperatura está subindo: sem risco de congelamento pela tendência atual.",
      stable: "A temperatura está estável: a tendência não indica congelamento iminente.",
      cooling: "Esfriando ~{rate} °F/h: cerca de {duration} até {threshold} °F nesse ritmo.",
    },
    forecastHit:
      "Chega a {threshold} por volta das {time} (em cerca de {duration}). Com base na previsão e no atraso deste espaço em relação ao ar externo.",
    doorNote: " Há uma porta aberta: o calor vai se perder mais rápido até ela ser fechada.",
    noFreeze:
      "Sem congelamento nas próximas {hours} h com o atraso típico deste espaço em relação à previsão externa.",
    noFreezeColderNight: " Uma noite {band} °F mais fria que o previsto chegaria lá por volta das {time}.",
    trendHit: "{message} Por volta das {time} se esse ritmo de resfriamento continuar.",
    reasons: {
      forecastLow: "Mínima externa prevista de {temp} °F por volta das {time}.",
      offsetZero: "Este espaço costuma ficar exatamente na temperatura externa.",
      offsetWarmer: "Este espaço costuma ficar cerca de {offset} °F mais quente que o lado de fora.",
      offsetColder: "Este espaço costuma ficar cerca de {offset} °F mais frio que o lado de fora.",
      couplingLearned: {
        one: "A rapidez com que ele acompanha o ar externo foi aprendida a partir de {count} par de leituras.",
        other: "A rapidez com que ele acompanha o ar externo foi aprendida a partir de {count} pares de leituras.",
      },
      couplingDefault: {
        one: "A rapidez com que ele acompanha o ar externo é um valor padrão até haver mais histórico ({count} par de leituras até agora).",
        other:
          "A rapidez com que ele acompanha o ar externo é um valor padrão até haver mais histórico ({count} pares de leituras até agora).",
      },
      coolingNow: "Esfriando cerca de {rate} °F/h agora.",
      doorOpen: "Há uma porta aberta por perto, então assume-se que ele perde calor mais rápido.",
      band: "O intervalo assume que o espaço pode ficar até {band} °F mais frio ou mais ameno que o normal.",
      trendCooling: "Esfriando cerca de {rate} °F/h.",
      trendCoolingOver: "Esfriando cerca de {rate} °F/h no período analisado ({duration}).",
      noForecast:
        "Ainda não há previsão externa para este espaço, então assume-se que o ritmo de resfriamento atual continua.",
    },
    runwayAlert:
      "A previsão é que este espaço chegue a {threshold} °F (em {duration}). Deixe as torneiras pingando ou ligue o aquecimento agora: você ainda tem tempo antes que a sonda chegue ao congelamento.",
    runwayAlertAt:
      "A previsão é que este espaço chegue a {threshold} °F por volta das {time} (em {duration}). Deixe as torneiras pingando ou ligue o aquecimento agora: você ainda tem tempo antes que a sonda chegue ao congelamento.",
  },

  estimateChange: {
    earlier: "{duration} antes da estimativa das {since} (era {was}).",
    later: "{duration} depois da estimativa das {since} (era {was}).",
    newSince: "Novo desde as {since}: na época não se esperava congelamento.",
    noLonger: "Não se espera mais que chegue ao congelamento. Às {since}, a previsão era por volta das {was}.",
    forecastLow: "A mínima externa prevista mudou de {from} para {to}.",
    rate: "O espaço passou de \"{from}\" para \"{to}\".",
    cooling: "esfriando {rate} °F/h",
    notCooling: "sem esfriar",
    offset: "O atraso aprendido em relação ao ar externo mudou de {from} °F para {to} °F.",
    nowForecast: "A estimativa agora usa a previsão externa, não só o ritmo de resfriamento.",
    nowTrend: "Não há previsão externa utilizável agora, então a estimativa usa só o ritmo de resfriamento.",
    noSingle: "Leituras e horas de previsão mais recentes; nenhum dado mudou muito sozinho.",
  },

  riskCard: {
    eyebrow: "Status do espaço",
    coldest: "Mais fria: {label}",
    staleTitle: "A última leitura é antiga; talvez não esteja atualizada.",
    noReading: "Sem leitura",
    howSummary: "Como este status é escolhido",
    how: "Mostra o primeiro item que se aplica, do mais urgente para o menos: ainda sem dispositivos ou leituras; um sensor de vazamento indica molhado (vermelho); um sensor parou de enviar (âmbar); a sonda mais fria está no seu limite de congelamento ou abaixo (vermelho); a previsão é chegar lá em 4 horas (vermelho) ou 12 horas (âmbar); há onda de frio ou noites de congelamento na previsão (âmbar); os alertas de congelamento ou de e-mail estão desligados (âmbar); a sonda mais fria está a menos de 5 °F do limite (âmbar). Caso contrário, está tudo bem.",
  },
  timeToFreezeCard: {
    title: "Tempo até congelar",
    subtitle: {
      forecast_model: "Estimativa com previsão para este espaço, comparada ao seu limite de {threshold}.",
      trend: "Estimativa pelo ritmo de resfriamento, comparada ao seu limite de {threshold}.",
      already_below: "No limite agora, comparado ao seu limite de {threshold}.",
      none: "Ainda não há dados suficientes, comparado ao seu limite de {threshold}.",
    },
    confidence: {
      high: "Confiança alta",
      medium: "Confiança média",
      low: "Confiança baixa",
    },
    atNow: "Em {threshold} agora",
    hitsAround: "Chega a {threshold} por volta das {time}",
    window: "Intervalo: das {from} às {to}",
    windowEarliest: "Intervalo: a partir das {from}; uma noite mais amena pode não chegar lá",
    basedOn: "Em que isso se baseia",
    estimateNote: "Uma estimativa a partir do histórico deste espaço e da previsão externa, não uma medição.",
    confidenceHelp: "Confiança alta: o modelo de previsão é ajustado com 24 ou mais leituras pareadas com o clima externo. Média: 8 ou mais leituras pareadas, ou uma tendência de resfriamento de 2 horas ou mais. Baixa: menos dados. A janela fica mais larga quanto menor a confiança.",
    learnMore: "Como o tempo até o congelamento é estimado",
    cooling: "Esfriando {rate} °F/h",
    offset: "Diferença típica de {offset} °F em relação ao lado de fora",
  },
  weekCompareCard: {
    title: "Esta semana x ano passado",
    subtitleOutdoor:
      "Ainda não há dados de sondas do ano passado, então a variação compara o clima externo (Open-Meteo) desta semana com a mesma semana do ano passado.",
    subtitle: "Temperatura média de 7 dias comparada ao mesmo período de um ano atrás.",
    notEnough: "Ainda não há leituras suficientes nesta semana.",
    yourProbesThisWeek: "Suas sondas nesta semana",
    thisWeek: "Esta semana",
    samples: { one: "{count} amostra", other: "{count} amostras" },
    outdoorLastYear: "Externo no ano passado",
    outdoorLastYearAt: "Externo no ano passado ({label})",
    sameWeekLastYear: "Mesma semana do ano passado",
    historyStarts: "O histórico local começa em {date}",
    outdoorChange: "Variação externa",
    change: "Variação",
    outdoorThisWeek: "Externo nesta semana: {temp}",
    outdoorUnavailable: "A média externa desta semana não está disponível",
    colder: "Mais frio que no ano passado",
    warmer: "Mais quente ou parecido",
    noPriorStarts: "Não há dados de sondas desta semana no ano passado. O histórico aqui começa em {date}.",
    noPrior: "Ainda não há dados de sondas desta semana no ano passado.",
  },
  heatingCard: {
    title: "Análise de aquecimento",
    subtitle:
      "Relaciona as leituras das sondas com o clima externo, a atividade das portas e o termostato conectado da sua casa.",
  },
  readinessCard: {
    title: "Preparo do imóvel",
    subtitle:
      "Pontuação com base em alertas de congelamento, contatos de alagamento, baterias e clima: confira antes da temporada de frio ou de chuvas. A porcentagem é a parte das verificações abaixo que passaram.",
    fix: "Corrigir",
    sendTest: "Enviar alerta de teste",
    seasonalChecklist: "Checklist da temporada",
  },
  benchmarkCard: {
    title: "Comparação regional",
    subtitle: "Sua sonda mais fria comparada a outras casas participantes em {city}.",
    cityAvg: "média da cidade {temp} °F",
    warmer: "Cerca de {delta} °F mais quente que o normal agora.",
    colder: "Cerca de {delta} °F mais frio que o normal agora.",
    publicMap: "Mapa público de congelamento",
    mapSettings: "Configurações do mapa",
    yourRegion: "sua região",
    typical: "Dentro do normal para outras casas ProbeHarbor em {city} esta noite.",
    colderMessage: "{delta} °F mais frio que as casas ProbeHarbor típicas em {city} agora.",
    warmerMessage: "{delta} °F mais quente que as casas ProbeHarbor típicas em {city} agora.",
  },
  nightsCard: {
    title: "Noites com risco nesta semana",
    subtitle: "Mínimas noturnas previstas comparadas ao seu limite de congelamento ({threshold} °F).",
    atRiskCount: {
      one: "{count} noite parece em risco.",
      other: "{count} noites parecem em risco.",
    },
    noneAtRisk: "Nenhuma noite prevista abaixo do limite no momento.",
    weather: "Clima",
    nwsTitle: "Alertas do NWS (EUA) relacionados a congelamento",
    atRisk: "Em risco",
    ok: "OK",
  },
  floodCard: {
    title: "Alagamento e nível",
    subtitleHtml:
      "Contatos molhados alertam automaticamente quando os sensores de alagamento detectam água (ignoram adiamento/férias).\n    Níveis de reservatório/poço precisam de uma condição <strong>Regras → level_above</strong>.",
    wetSince: "molhado desde {time}",
    noWet: "Nenhum alagamento no momento.",
    wetEvent: "evento de água · {time}",
  },
  weekChart: {
    chartTitle: "Tendência de temperatura ({days} dias)",
    cardTitle: "Temperatura (últimos {days} dias)",
    subtitleHtml:
      'Todas as sondas comparadas à sua linha de congelamento.\n        <a class="text-link" href="/dashboard/history">Abra o Histórico</a> para filtros, exportações e comparação anual.',
    empty: "O gráfico vai sendo preenchido conforme as leituras chegam: espere uma ou duas horas depois da primeira leitura.",
  },
  metricCard: {
    pin: "Fixar {label}",
    unpin: "Desafixar {label}",
    pinTitle: "Fixar no Status",
    unpinTitle: "Remover do Status",
  },
};

export default ptBr;
