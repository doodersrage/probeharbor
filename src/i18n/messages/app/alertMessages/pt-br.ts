import type { AlertMessages } from "./en";

const ptBr: AlertMessages = {
  threshold: {
    freezeDetail: "{label} está a {temp} {unit} (no limite de congelamento de {threshold} {unit} ou abaixo).",
    freezeDetailDwell:
      "{label} está a {temp} {unit} (no limite de congelamento de {threshold} {unit} ou abaixo há {minutes}+ min).",
    /** Appended to a freeze line when the reading is a few minutes old or more. */
    readingAge: " Última leitura {age}.",
    humidityDetail: "A umidade de {label} está em {humidity}% (acima do limite de {threshold}%).",
    titleFreeze: "Congelamento: {label} {temp} {unit}",
    titleMore: " (+{count} outros)",
    titleHumidityNote: ", umidade alta",
    titleHumidity: "Umidade alta: {label} {humidity}%",
    titleFallback: "Alerta de temperatura",
    escalated: "Escalado: {title}",
  },
  flood: {
    title: "Alerta de alagamento / vazamento",
    detail: "O sensor de alagamento / vazamento {label} está molhado.",
  },
  power: {
    title: "Sem energia",
    detail: "{label} indica que a energia caiu.",
    footer: "Aquecedores, cabos de aquecimento e bombas de drenagem nesse circuito também podem estar desligados.",
  },
  forecast: {
    title: "Risco de congelamento previsto",
    detail: "A previsão externa chega a {temp} {unit} em até {hours} h (limite de congelamento {threshold} {unit}).",
  },
  rate: {
    title: "Mudança rápida de temperatura",
    detail: "{label} variou {delta} {unit} na última hora (limite ±{threshold} {unit}).",
  },
  battery: {
    title: "Bateria do dispositivo fraca",
    detail: "A bateria de {device} está em {pct}% (limite {threshold}%).",
    trendTitle: "Alerta de tendência da bateria",
    trendBody: "{device}: {trend}",
  },
  rssi: {
    title: "Sinal do dispositivo fraco",
    detail: "O sinal de {device} está em {rssi} dBm (limite {threshold} dBm).",
  },
  outage: {
    title: "Alerta de dispositivo fora do ar",
    never: "{device} nunca enviou uma leitura.",
    silent: "{device} está sem enviar dados há {hours} horas (limite de queda {threshold} h).",
    stillOffline: {
      one: "Mais {count} dispositivo continua offline desde alertas anteriores.",
      other: "Mais {count} dispositivos continuam offline desde alertas anteriores.",
    },
  },
  runway: {
    title: "Tempo até congelar",
  },
  nws: {
    title: "Alerta de geada / frio do NWS (EUA)",
    fallback:
      "Há um aviso de geada / frio do National Weather Service (EUA) ativo perto da sua cidade de clima.",
  },
  rule: {
    title: "Regra de alerta acionada",
  },
  stuck: {
    titleOne: "Verifique {label}: as leituras parecem travadas",
    titleMany: "Verifique {count} sondas: as leituras parecem travadas",
  },
  /** One recap after quiet hours end, listing the alerts they held. */
  quietSummary: {
    title: "Durante o horário silencioso",
    intro: "Estes alertas foram retidos durante o horário silencioso:",
    more: "…e mais {count}.",
  },
  recovery: {
    freezeTitle: "Normalizado: as temperaturas voltaram ao normal",
    freezeBodyEmpty: "Tudo normal de novo. O alerta foi encerrado; nada a fazer.",
    freezeBody:
      "Tudo normal de novo: {temps} (limite de congelamento {threshold} {unit}). O alerta foi encerrado; nada a fazer.",
    freezeTemp: "{label} {temp} {unit}",
    floodTitle: "Normalizado: os sensores de vazamento estão secos",
    floodBody:
      "Nenhum sensor de vazamento indica molhado. O alerta foi encerrado; confira o local uma vez para ter certeza.",
    powerTitle: "Normalizado: a energia voltou",
    powerBody:
      "Todos os sensores de energia indicam ligado de novo. O alerta foi encerrado; confira se aquecedores e bombas voltaram a funcionar.",
    outageTitle: "Normalizado: os dispositivos voltaram a enviar dados",
    outageBody: "Todos os dispositivos voltaram a se comunicar. O alerta de queda foi encerrado.",
    stuckTitle: "Normalizado: as leituras da sonda voltaram a mudar",
    stuckBody: "A sonda que parecia travada voltou a enviar temperaturas que variam. O alerta foi encerrado.",
  },
  context: {
    doorOpen: "Um sensor de porta está aberto. Espere uma perda de calor mais rápida até que ela seja fechada.",
  },
  delivery: {
    smsLine: "{title}: {body}",
    snooze: "Adiar 24 h: {url}",
    ack: "Marcar como resolvido: {url}",
    openDashboard: "Abrir o painel",
    alertSettings: "Configurações de alertas",
    footerNote: "Você está recebendo esta mensagem porque os alertas estão ativados na sua conta.",
    eyebrow: {
      flood: "Alerta de vazamento",
      power: "Sem energia",
      outage: "Queda",
      forecast: "Previsão",
      battery: "Bateria",
      runway: "Tempo até congelar",
      rate: "Taxa de variação",
      rssi: "Sinal",
      stuck: "Verificação do sensor",
      rule: "Regra",
      threshold: "Congelamento / limite",
      recovery: "Tudo certo",
      default: "Alerta",
    },
  },
  kindLabels: {
    threshold: "Congelamento ou umidade",
    freeze: "Congelamento",
    flood: "Vazamento",
    power: "Sem energia",
    runway: "Tempo até congelar",
    forecast: "Congelamento previsto",
    nws: "Aviso do serviço meteorológico",
    rate: "Queda rápida de temperatura",
    outage: "Sensor em silêncio",
    stuck: "Sonda travada",
    rule: "Sua regra",
    battery: "Bateria fraca",
    rssi: "Wi-Fi fraco",
    recovery: "Normalizado",
    test: "Teste",
    generic: "Mensagem",
    weekly_digest: "Resumo semanal",
    monthly_report: "Relatório mensal",
    freeze_drill: "Simulado de congelamento",
  },
  kindFallback: "Alerta",
  channelLabels: {
    email: "e-mail",
    discord: "Discord",
    telegram: "Telegram",
    slack: "Slack",
    teams: "Teams",
    sms: "SMS",
    whatsapp: "WhatsApp",
    push: "notificação do navegador",
    pushover: "Pushover",
    ntfy: "ntfy",
    webhook: "webhook",
    quiet_hours: "horário silencioso",
    snoozed: "adiado",
    vacation: "modo férias",
    disabled: "alertas desligados",
    incomplete: "destino ausente",
    not_entitled: "requer upgrade do plano",
    push_not_configured: "push (chaves VAPID ausentes no servidor)",
    push_no_subscription: "push (inscreva este navegador primeiro)",
    push_delivery_failed: "push (falha na entrega: inscreva-se de novo)",
    push_load_failed: "push (não foi possível carregar as inscrições)",
    push_send_failed: "push (erro de envio)",
    sms_not_configured: "SMS (Twilio não configurado no servidor)",
    channel_filter: "filtrado pelas regras de roteamento",
    severity_filter: "filtrado pelo roteamento por gravidade",
  },
  channelErrors: {
    smsNoPhone: "Nenhum telefone para SMS nas configurações de alertas nem no campo de substituição.",
    smsSendFailed: "Falha no envio do SMS pelo Twilio. Verifique as credenciais do Twilio e o número de destino.",
    unknownKind: "Tipo de teste de canal desconhecido.",
  },
};

export default ptBr;
