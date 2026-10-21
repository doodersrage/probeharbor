import type { DigestEmailMessages } from "./en";

const ptBr: DigestEmailMessages = {
  subject: "Resumo semanal — mais frio em {day}: {temp}°F",
  subjectNoData: "Resumo semanal de temperatura das sondas",
  eyebrow: "Resumo semanal",
  title: "Sua semana nas sondas",
  intro:
    "Um panorama rápido dos últimos 7 dias — a noite mais fria, as passagens pelo limite de congelamento e o que mais merece atenção.",
  ctaHistory: "Abrir esta semana no Histórico",
  ctaSettings: "Gerenciar configurações do resumo",
  footerNote: "Você pode desativar os resumos semanais em Painel → Alertas → Configurações → E-mails de resumo.",
  tip: "Dica: alertas de queda de conexão e de vazamento são enviados separadamente quando os sensores ficam em silêncio ou molhados.",

  readings: { one: "{count} leitura", other: "{count} leituras" },
  probeLine: "{probe}: {min}–{max} °F, umidade média {humidity}% ({readings})",
  dayLine: "{day}: {min}–{max} °F (média {avg}°)",
  dayLineColdest: "{day}: {min}–{max} °F (média {avg}° · mais fria: {probe})",

  freezeTitle: "Exposição ao congelamento",
  freezeLine: "Exposição ao congelamento: {body}",
  freezeNone: "nenhuma a {threshold}°F ou menos",
  freezeSome: "~{hours} h a {threshold}°F ou menos ({readings} · mínima {coldest}°F)",

  highlights: "Destaques",
  statColdest: "Mais frio",
  statWarmest: "Mais quente",
  statAverage: "Média de 7 dias",
  statHumidity: "Maior umidade",

  byProbe: "Por sonda",
  colProbe: "Sonda",
  colRange: "Faixa",
  colHumidity: "Umidade",
  humidityCell: "{humidity}% · {readings}",
  dayByDay: "Dia a dia",
  colDay: "Dia",
  colAvg: "Média",
  colColdest: "Mais fria",

  deliveryTitle: "Entrega de alertas",
  noAlerts: "Nenhum alerta foi enviado esta semana.",
  sendTestAnyTime: "Envie um teste em Alertas quando quiser para confirmar que seus canais ainda chegam até você.",
  heldBack: {
    one: "{count} retido por adiamento, modo férias ou horário silencioso.",
    other: "{count} retidos por adiamento, modo férias ou horário silencioso.",
  },
  reached: {
    one: "{reached} de {count} alerta chegou até você.",
    other: "{reached} de {count} alertas chegaram até você.",
  },
  reachedVia: {
    one: "{reached} de {count} alerta chegou até você via {channels}.",
    other: "{reached} de {count} alertas chegaram até você via {channels}.",
  },
  notDelivered: "Não entregue em: {failures}. Verifique esses canais em Alertas e envie um teste.",
  failedChannel: "{channel} ({count}×)",
};

export default ptBr;
