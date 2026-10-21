import type { DigestEmailMessages } from "./en";

const es: DigestEmailMessages = {
  subject: "Resumen semanal: mínima el {day}, {temp}°F",
  subjectNoData: "Resumen semanal de temperaturas de tus sondas",
  eyebrow: "Resumen semanal",
  title: "Tu semana en las sondas",
  intro:
    "Un vistazo rápido a los últimos 7 días: la noche más fría, los cruces del umbral de congelación y cualquier otra cosa a vigilar.",
  ctaHistory: "Ver esta semana en Historial",
  ctaSettings: "Gestionar ajustes del resumen",
  footerNote:
    "Puedes desactivar los resúmenes semanales en Panel → Alertas → Ajustes → Correos de resumen.",
  tip: "Consejo: las alertas de desconexión y de fuga se envían por separado cuando un sensor deja de reportar o detecta agua.",

  readings: { one: "{count} lectura", other: "{count} lecturas" },
  probeLine: "{probe}: {min}–{max} °F, humedad media {humidity}% ({readings})",
  dayLine: "{day}: {min}–{max} °F (media {avg}°)",
  dayLineColdest: "{day}: {min}–{max} °F (media {avg}° · más fría: {probe})",

  freezeTitle: "Exposición a congelación",
  freezeLine: "Exposición a congelación: {body}",
  freezeNone: "ninguna a {threshold}°F o menos",
  freezeSome: "~{hours} h a {threshold}°F o menos ({readings} · mínima {coldest}°F)",

  highlights: "Lo más destacado",
  statColdest: "Mínima",
  statWarmest: "Máxima",
  statAverage: "Media de 7 días",
  statHumidity: "Humedad máxima",

  byProbe: "Por sonda",
  colProbe: "Sonda",
  colRange: "Rango",
  colHumidity: "Humedad",
  humidityCell: "{humidity}% · {readings}",
  dayByDay: "Día a día",
  colDay: "Día",
  colAvg: "Media",
  colColdest: "Más fría",

  deliveryTitle: "Entrega de alertas",
  noAlerts: "Esta semana no se envió ninguna alerta.",
  sendTestAnyTime:
    "Envía una prueba desde Alertas cuando quieras para confirmar que tus canales siguen llegándote.",
  heldBack: {
    one: "{count} retenida por posponer, vacaciones u horas de silencio.",
    other: "{count} retenidas por posponer, vacaciones u horas de silencio.",
  },
  reached: {
    one: "Te llegó {reached} de {count} alerta.",
    other: "Te llegaron {reached} de {count} alertas.",
  },
  reachedVia: {
    one: "Te llegó {reached} de {count} alerta por {channels}.",
    other: "Te llegaron {reached} de {count} alertas por {channels}.",
  },
  notDelivered: "No se entregaron por: {failures}. Revisa esos canales en Alertas y envía una prueba.",
  failedChannel: "{channel} ({count}×)",
};

export default es;
