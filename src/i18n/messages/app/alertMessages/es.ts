import type { AlertMessages } from "./en";

const es: AlertMessages = {
  threshold: {
    freezeDetail: "{label} está a {temp} {unit} (en el umbral de congelación de {threshold} {unit} o por debajo).",
    freezeDetailDwell:
      "{label} está a {temp} {unit} (en el umbral de congelación de {threshold} {unit} o por debajo durante {minutes}+ min).",
    /** Appended to a freeze line when the reading is a few minutes old or more. */
    readingAge: " Última lectura {age}.",
    humidityDetail: "La humedad de {label} es del {humidity} % (por encima del umbral del {threshold} %).",
    titleFreeze: "Congelación: {label} {temp} {unit}",
    titleMore: " (+{count} más)",
    titleHumidityNote: ", humedad alta",
    titleHumidity: "Humedad alta: {label} {humidity} %",
    titleFallback: "Alerta de temperatura",
    escalated: "Escalada: {title}",
  },
  flood: {
    title: "Alerta de inundación / fuga",
    detail: "El sensor de inundación / fuga {label} está mojado.",
  },
  power: {
    title: "Sin corriente",
    detail: "{label} indica que no hay corriente.",
    footer: "Puede que los calefactores, los cables calefactores y las bombas de sumidero de ese circuito también estén apagados.",
  },
  forecast: {
    title: "Riesgo de congelación previsto",
    detail: "La previsión exterior llega a {temp} {unit} en {hours} h (umbral de congelación {threshold} {unit}).",
  },
  rate: {
    title: "Cambio rápido de temperatura",
    detail: "{label} cambió {delta} {unit} en la última hora (umbral ±{threshold} {unit}).",
  },
  battery: {
    title: "Batería del dispositivo baja",
    detail: "La batería de {device} está al {pct} % (umbral {threshold} %).",
    trendTitle: "Alerta de tendencia de batería",
    trendBody: "{device}: {trend}",
  },
  rssi: {
    title: "Señal del dispositivo débil",
    detail: "La señal de {device} es de {rssi} dBm (umbral {threshold} dBm).",
  },
  outage: {
    title: "Alerta de dispositivo caído",
    never: "{device} nunca ha enviado una lectura.",
    silent: "{device} lleva {hours} horas sin enviar datos (umbral de caída {threshold} h).",
    stillOffline: {
      one: "{count} dispositivo más sigue sin conexión desde alertas anteriores.",
      other: "{count} dispositivos más siguen sin conexión desde alertas anteriores.",
    },
  },
  runway: {
    title: "Tiempo hasta la congelación",
  },
  nws: {
    title: "Alerta de helada / frío del NWS (EE. UU.)",
    fallback:
      "Hay un aviso de helada / frío del National Weather Service (EE. UU.) activo cerca de tu ciudad del clima.",
  },
  rule: {
    title: "Regla de alerta cumplida",
  },
  stuck: {
    titleOne: "Revisa {label}: las lecturas parecen atascadas",
    titleMany: "Revisa {count} sondas: las lecturas parecen atascadas",
  },
  /** One recap after quiet hours end, listing the alerts they held. */
  quietSummary: {
    title: "Durante las horas de silencio",
    intro: "Estas alertas se retuvieron durante las horas de silencio:",
    more: "…y {count} más.",
  },
  recovery: {
    freezeTitle: "Recuperado: las temperaturas volvieron a la normalidad",
    freezeBodyEmpty: "Todo normal de nuevo. La alerta está cerrada; no hay nada que hacer.",
    freezeBody:
      "Todo normal de nuevo: {temps} (límite de congelación {threshold} {unit}). La alerta está cerrada; no hay nada que hacer.",
    freezeTemp: "{label} {temp} {unit}",
    floodTitle: "Recuperado: los sensores de fuga están secos",
    floodBody:
      "Ningún sensor de fuga marca mojado. La alerta está cerrada; revisa el lugar una vez para asegurarte.",
    powerTitle: "Recuperado: volvió la corriente",
    powerBody:
      "Todos los sensores de corriente marcan encendido de nuevo. La alerta está cerrada; comprueba que los calefactores y las bombas se reiniciaron.",
    outageTitle: "Recuperado: los dispositivos vuelven a enviar datos",
    outageBody: "Todos los dispositivos se han vuelto a conectar. La alerta de caída está cerrada.",
    stuckTitle: "Recuperado: las lecturas de la sonda vuelven a cambiar",
    stuckBody: "La sonda que parecía atascada vuelve a enviar temperaturas que cambian. La alerta está cerrada.",
  },
  context: {
    doorOpen: "Un sensor de puerta está abierto. Espera una pérdida de calor más rápida hasta que se cierre.",
  },
  delivery: {
    smsLine: "{title}: {body}",
    snooze: "Posponer 24 h: {url}",
    ack: "Marcar como atendida: {url}",
    openDashboard: "Abrir el panel",
    alertSettings: "Ajustes de alertas",
    footerNote: "Recibes este mensaje porque las alertas están activadas en tu cuenta.",
    eyebrow: {
      flood: "Alerta de fuga",
      power: "Sin corriente",
      outage: "Caída",
      forecast: "Previsión",
      battery: "Batería",
      runway: "Tiempo hasta la congelación",
      rate: "Ritmo de cambio",
      rssi: "Señal",
      stuck: "Revisión del sensor",
      rule: "Regla",
      threshold: "Congelación / umbral",
      recovery: "Todo en orden",
      default: "Alerta",
    },
  },
  kindLabels: {
    threshold: "Congelación o humedad",
    freeze: "Congelación",
    flood: "Fuga",
    power: "Sin corriente",
    runway: "Tiempo hasta la congelación",
    forecast: "Congelación prevista",
    nws: "Aviso del servicio meteorológico",
    rate: "Caída rápida de temperatura",
    outage: "Sensor sin datos",
    stuck: "Sonda atascada",
    rule: "Tu regla",
    battery: "Batería baja",
    rssi: "Wi-Fi débil",
    recovery: "Recuperado",
    test: "Prueba",
    generic: "Mensaje",
    weekly_digest: "Resumen semanal",
    monthly_report: "Informe mensual",
    freeze_drill: "Simulacro de congelación",
  },
  kindFallback: "Alerta",
  channelLabels: {
    email: "correo",
    discord: "Discord",
    telegram: "Telegram",
    slack: "Slack",
    teams: "Teams",
    sms: "SMS",
    whatsapp: "WhatsApp",
    push: "notificación del navegador",
    pushover: "Pushover",
    ntfy: "ntfy",
    webhook: "webhook",
    quiet_hours: "horas de silencio",
    snoozed: "pospuesta",
    vacation: "modo vacaciones",
    disabled: "alertas desactivadas",
    incomplete: "falta el destino",
    not_entitled: "requiere mejorar el plan",
    push_not_configured: "push (faltan las claves VAPID en el servidor)",
    push_no_subscription: "push (suscribe primero este navegador)",
    push_delivery_failed: "push (falló la entrega: vuelve a suscribirte)",
    push_load_failed: "push (no se pudieron cargar las suscripciones)",
    push_send_failed: "push (error de envío)",
    sms_not_configured: "SMS (Twilio no está configurado en el servidor)",
    channel_filter: "filtrada por reglas de enrutamiento",
    severity_filter: "filtrada por enrutamiento según gravedad",
  },
  channelErrors: {
    smsNoPhone: "No hay teléfono para SMS en los ajustes de alertas ni en el campo de reemplazo.",
    smsSendFailed: "Falló el envío del SMS con Twilio. Revisa las credenciales de Twilio y el número de destino.",
    unknownKind: "Tipo de prueba de canal desconocido.",
  },
};

export default es;
