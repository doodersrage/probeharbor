import type { LibTextMessages } from "./en";

const ptBr: LibTextMessages = {
  seasonal: {
    coldestTitle: "Leitura mais fria",
    warmestTitle: "Leitura mais quente",
    humidityTitle: "Maior umidade",
    averageTitle: "Média de {days} dias",
    tempOn: "{temp} °F em {time} ({probe})",
    humidityOn: "{humidity}% em {time} ({probe})",
    averageDetail: { one: "{temp} °F em {count} leitura", other: "{temp} °F em {count} leituras" },
    warmerThan: "{warmer} fica em média {delta} °F mais quente que {cooler} neste período.",
    yoyTitle: "Ano a ano",
    yoyDetail: "Este período tem média de {current} °F contra {prior} °F no ano passado ({delta} °F).",
    outdoorEstimate: "{detail} (estimativa externa).",
    outdoorEstimateAt: "{detail} (estimativa externa em {location}).",
  },
  coldSnap: {
    reached: "{probe} chegou a {temp} °F, no limite de {threshold} °F ou abaixo dele.",
    lowest: "Mínima: {temp} °F.",
    backAbove: "De volta acima de {threshold} °F.",
    alertSent: "Alerta enviado: {title} ({channels}).",
    allClearSent: "Aviso de normalização enviado: {title} ({channels}).",
    notDelivered: "Alerta não entregue: {title}.",
    notDeliveredChannels: "Alerta não entregue: {title} ({channels}).",
    autoRecovered: "Alerta fechado automaticamente quando a temperatura subiu.",
    expired: "O alerta expirou.",
    handled: "Alguém marcou o alerta como resolvido.",
  },
  anomaly: {
    drop: {
      one: "{probe} caiu {drop} °F em {count} minuto ({from} °F → {to} °F).",
      other: "{probe} caiu {drop} °F em {count} minutos ({from} °F → {to} °F).",
    },
    dropDoor: {
      one: "{probe} caiu {drop} °F em {count} minuto ({from} °F → {to} °F). Um sensor de porta estava aberto nesse horário.",
      other:
        "{probe} caiu {drop} °F em {count} minutos ({from} °F → {to} °F). Um sensor de porta estava aberto nesse horário.",
    },
  },
  health: {
    disabled: "Dispositivo desativado",
    waiting: "Aguardando a primeira leitura",
    floodWet: "Contato de alagamento / vazamento molhado",
    noData: {
      one: "Sem dados há {count} dia, verifique a energia e o Wi‑Fi",
      other: "Sem dados há {count} dias, verifique a energia e o Wi‑Fi",
    },
    stale: "Dados da sonda desatualizados, verifique a energia e o Wi‑Fi",
    batteryLow: "Bateria em {pct}% — troque em breve",
    batteryDays: { one: "Bateria: ~{count} dia restante", other: "Bateria: ~{count} dias restantes" },
    weakRssi: "RSSI fraco ({rssi} dBm)",
    healthy: "Enviando normalmente, contatos de alagamento secos",
    etaReplaceSoon: "Troque em breve",
    etaDays: { one: "~{count} dia", other: "~{count} dias" },
    etaWeeks: "~{weeks} sem.",
  },
  sensorKinds: {
    temperature: "Temperatura",
    humidity: "Umidade",
    co2: "CO₂",
    pressure: "Pressão barométrica",
    pm25: "PM2,5",
    voc: "COV",
    level: "Nível de água / do poço",
    energy: "Energia",
    door: "Porta",
    power: "Energia elétrica",
    flood: "Alagamento / vazamento",
    motion: "Movimento",
    generic: "Genérico",
  },
  sensorValues: {
    open: "Aberta",
    closed: "Fechada",
    on: "Ligado",
    off: "Desligado",
    wet: "Molhado",
    dry: "Seco",
    detected: "Detectado",
    clear: "Nenhum",
  },
  battery: {
    dropped: "A bateria caiu {drop}% desde {date} ({from}% → {to}%).",
    mayLast: "{base} Nesse ritmo de consumo, a bateria pode durar {duration}.",
    aboutOneDay: "~1 dia",
    aboutDays: { one: "~{count} dia", other: "~{count} dias" },
  },
  house: {
    fromReference: "De {label}",
    indoorReference: "Sonda de referência interna",
    house: "Casa",
  },
  freshness: {
    offline: "Offline · visto por último {age}",
    mayBeOffline: "Pode estar offline · visto por último {age}",
    updated: "Atualizado {age}",
    polled: "Consultado {age}",
    offlinePolled: "Offline · última consulta {age}",
    awaitingPoll: "Aguardando consulta · última consulta {age}",
  },
  staleBanner: {
    pullOnly: {
      one: "{count} sonda consultada não é consultada há mais de 30 minutos",
      other: "{count} sondas consultadas não são consultadas há mais de 30 minutos",
    },
    pushOnly: {
      one: "{count} sonda não envia dados há mais de 30 minutos",
      other: "{count} sondas não enviam dados há mais de 30 minutos",
    },
    mixed: {
      one: "{count} sonda parece desatualizada ({parts})",
      other: "{count} sondas parecem desatualizadas ({parts})",
    },
    partPush: "{count} por envio",
    partPull: "{count} por consulta",
    partUnknown: "{count} desconhecidas",
  },
  lowBattery: {
    single: "A bateria de {name} está em {pct}%: carregue ou troque antes que pare de enviar dados.",
    item: "{name} ({pct}%)",
    list: "Bateria fraca em {count} dispositivos: {names}.",
    listMore: "Bateria fraca em {count} dispositivos: {names} e mais {more}.",
  },
  runway: {
    prefix: "Margem térmica: {message}",
    doorOpen: "Um sensor de porta está aberto: o calor vai se perder mais rápido até ele ser fechado.",
    forecastLow:
      "Mínima prevista de ~{temp} °F nas próximas {hours} h: o frio externo pode acelerar o resfriamento interno.",
  },
  benchmark: {
    yourRegion: "sua região",
    typical: "Dentro do normal para outras casas ProbeHarbor em {city} esta noite.",
    colder: "{delta} °F mais frio que as casas ProbeHarbor típicas em {city} agora.",
    warmer: "{delta} °F mais quente que as casas ProbeHarbor típicas em {city} agora.",
  },
};

export default ptBr;
