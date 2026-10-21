import type { AlertJobsMessages } from "./en";

const es: AlertJobsMessages = {
  freeze: {
    confirm: {
      eyebrow: "Alertas de congelación",
      title: "Confirma tus alertas de congelación",
      intro: "Haz clic abajo y te enviaremos un correo la tarde antes de cada noche de helada en {place}.",
      ignore: "Si no lo pediste, ignora este mensaje. No recibirás nada si no lo confirmas.",
      cta: "Confirmar alertas de congelación",
      footerNote:
        "Recibes este correo porque alguien introdujo esta dirección en el pronóstico de congelación de tuberías de ProbeHarbor.",
      subject: "Confirma las alertas de congelación para {place}",
    },
    errors: {
      invalidEmail: "Introduce una dirección de correo válida.",
      pickLocation: "Primero elige una ubicación.",
      generic: "Algo salió mal. Inténtalo de nuevo.",
    },
    alert: {
      subjectHigh: "Riesgo alto de congelación de tuberías esta noche en {place}: mínima {low}",
      subjectWatch: "Helada esta noche en {place}: mínima {low}",
      eyebrow: "Alerta de congelación",
      titleHigh: "Riesgo alto de congelación esta noche en {place}",
      titleWatch: "Bajo cero esta noche en {place}",
      bullets: [
        "Abre las puertas de los muebles bajo los fregaderos en paredes exteriores.",
        "Mantén cerrada la puerta del garaje.",
        "Deja gotear un grifo de una tubería expuesta.",
        "Ten localizada la llave de paso general del agua.",
      ],
      alsoLater: "También bajo cero más adelante esta semana: {nights}.",
      laterNight: "{date} (mínima {low})",
      outdoorNote:
        "Este es el pronóstico exterior. Un garaje adosado o aislado puede mantenerse mucho más cálido, y uno con corrientes puede enfriarse casi tanto como el exterior. Una sonda de 25 US$ junto a la tubería te dice qué está pasando realmente en ese espacio y te avisa antes de que llegue a la congelación.",
      ctaForecast: "Ver el pronóstico de 5 noches",
      ctaProbe: "Pon una sonda en tu garaje",
      footerNote:
        "Enviamos un correo la tarde antes de la primera noche de helada de una ola de frío y antes de cada noche a −7 °C (20 °F) o menos. Pronóstico del National Weather Service (EE. UU.).",
    },
    night: {
      high: "Mínima de {low}, igual o por debajo del umbral de {mark}, en el que las tuberías de garajes, sótanos ventilados y áticos sin calefacción suelen estar en riesgo.",
      watch: {
        one: "Bajo cero durante aproximadamente {count} hora, mínima {low}. Las tuberías expuestas en paredes exteriores, cerca de puertas de garaje o en sótanos ventilados pueden congelarse en una noche larga o con viento.",
        other:
          "Bajo cero durante aproximadamente {count} horas, mínima {low}. Las tuberías expuestas en paredes exteriores, cerca de puertas de garaje o en sótanos ventilados pueden congelarse en una noche larga o con viento.",
      },
      above: "Se mantiene sobre cero (mínima {low}).",
      wind: "Un viento de hasta {wind} con temperaturas bajo cero enfría más rápido las tuberías expuestas.",
      nextDay: "El día siguiente también se mantiene bajo cero, así que los espacios sin calefacción no volverán a calentarse.",
    },
  },
  stuck: {
    faultReset: "el valor que envía un DS18B20 tras un reinicio (a menudo por alimentación débil o un cable largo)",
    faultDisconnected: "el valor que envía la biblioteca del DS18B20 cuando la sonda está desconectada",
    faultMessage: "{label} marca {value} °F, {why}. Revisa el cableado de la sonda; no es una temperatura real.",
    faultDetail: "{label} marca {value} °F (fallo del sensor), revisa el cableado",
    stuckMessage:
      "{label} lleva {span} enviando exactamente {value} °F. La sonda puede estar atascada o la placa puede estar reenviando un valor antiguo; una helada aquí podría pasar desapercibida.",
    stuckDetail: "{label} atascado en {value} °F desde hace {span}",
    spanHours: { one: "{count} hora", other: "{count} horas" },
    spanOverDay: "más de un día",
  },
  portfolio: {
    title: "Propiedades en riesgo hoy ({count})",
    intro: {
      one: "Resumen para propietarios: {count} propiedad está en el umbral de congelación o por debajo:",
      other: "Resumen para propietarios: {count} propiedades están en el umbral de congelación o por debajo:",
    },
    line: "{name}: {temp} °F (umbral {threshold} °F)",
  },
  tenant: {
    greetingName: "Hola, {name}:",
    greeting: "Hola:",
    intro: "El administrador de {household} nos pidió que te reenviáramos una alerta de riesgo de congelación:",
    eyebrow: "Alerta reenviada al inquilino",
    footerNote:
      "Recibes este correo porque el propietario te indicó como contacto en el lugar. No es un acceso completo al panel.",
    errors: {
      invalidEmail: "Dirección de correo no válida.",
      notAuthorized: "No tienes permiso para avisar al inquilino.",
      noContact: "No hay ningún contacto de inquilino configurado.",
      deliveryFailed: "No se pudo enviar el correo.",
    },
  },
  feedUptime: {
    title: "Feed inaccesible",
  },
  playbook: {
    titleFallback: "Protocolo: {title}",
  },
  ackPlaybook: {
    notFound: "No se encontró la alerta.",
    noHousehold: "No hay ningún hogar para reenviar al inquilino.",
    defaultPropertyName: "Propiedad",
    relayFailed: "No se pudo avisar al inquilino.",
    noWebhook: "No hay ningún webhook de salida configurado.",
    ackFailed: "No se pudo confirmar la alerta.",
    raised:
      "Falsa alarma gestionada: umbral de congelación subido a {value} °F y alertas pospuestas 24 h.",
    falseAlarmTip: "Marcada como falsa alarma: alertas pospuestas 24 h. Solución sugerida: {tip}. Abre {href}",
    results: {
      ack: "Alerta marcada como gestionada.",
      snooze_1h: "Alerta gestionada: alertas de congelación pospuestas 1 hora.",
      snooze_4h: "Alerta gestionada: alertas de congelación pospuestas 4 horas.",
      snooze_24h: "Alerta gestionada: alertas de congelación pospuestas 24 horas.",
      false_alarm:
        "Marcada como falsa alarma: alertas pospuestas 24 h. Si se repite, revisa dónde está colocada la sonda.",
      raise_threshold: "Falsa alarma gestionada y umbral de congelación subido.",
      notify_tenant: "Alerta gestionada: se envió un correo al contacto del inquilino.",
      webhook_ping: "Alerta gestionada: se notificó al webhook de salida.",
    },
  },
  telegram: {
    help: "Comandos: /status [nombre], /snooze [horas], /vacation [días], /help",
    commandsDisabled: "Los comandos de Telegram están desactivados hasta que guardes un Chat ID en Alertas.",
    snoozed: {
      one: "Alertas pospuestas {count} hora. Las alertas de congelación y de fuga se siguen enviando.",
      other: "Alertas pospuestas {count} horas. Las alertas de congelación y de fuga se siguen enviando.",
    },
    vacation: {
      one: "Modo vacaciones activado durante {count} día. Las alertas de congelación y de fuga se siguen enviando.",
      other: "Modo vacaciones activado durante {count} días. Las alertas de congelación y de fuga se siguen enviando.",
    },
    noHousehold: "No hay ningún hogar activo.",
    open: "ABIERTO",
    closed: "cerrado",
    noMatch: "Ningún sensor coincide con «{query}».",
    noReadings: "Aún no hay lecturas.",
  },
  events: {
    notFound: "No se encontró la alerta.",
    noUnhandled: "No hay alertas pendientes.",
  },
  ackPage: {
    title: "Confirmar alerta",
    heading: "¿Confirmar la alerta?",
    body: "Confirma que te estás ocupando de esta alerta de congelación o inundación. Las vistas previas automáticas de enlaces no completarán esta acción.",
    button: "Sí, marcar como gestionada",
    cancel: "Cancelar",
    resultInvalid: "Enlace de confirmación no válido o caducado.",
    resultNone: "No hay alertas pendientes que confirmar.",
    resultHandled: "Alerta marcada como gestionada.",
  },
  snoozePage: {
    title: "Posponer alertas",
    heading: "¿Posponer las alertas?",
    body: "Confirma que quieres posponer los avisos de umbral. Las alertas críticas de congelación o inundación pueden seguir enviándose. Las vistas previas automáticas de enlaces no completarán esta acción.",
    button: "Sí, posponer",
    cancel: "Cancelar",
    missingToken: "Falta el token",
    resultInvalid: "Enlace para posponer no válido o ya usado.",
    resultExpired: "El enlace para posponer ha caducado.",
    resultSnoozed: { one: "Alertas pospuestas {count} hora.", other: "Alertas pospuestas {count} horas." },
  },
};

export default es;
