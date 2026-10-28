import type { AlertsMessages } from "./en";

const es: AlertsMessages = {
  page: {
    title: "Alertas",
    subtitle: "Qué se disparó y a quién se avisó. En Ajustes decides cuándo y cómo alertar.",
    tabsLabel: "Secciones de alertas",
    tabActivity: "Actividad",
    tabActivityCount: "Actividad ({count})",
    tabSettings: "Ajustes",
  },
  notices: {
    restored:
      "Se restauraron los ajustes de alertas anteriores. Tu versión previa está en Cambios recientes por si quieres recuperarla.",
    savedIncomplete:
      "Ajustes de alertas guardados. A algunos canales activados les falta el destino y se omitirán hasta que lo completes.",
    saved: "Ajustes de alertas guardados.",
    invalidWebhookUrl:
      "Una de tus URL de webhook no es una dirección https:// válida o apunta a una red privada. Corrígela y vuelve a guardar.",
    weakTelegramSecret:
      "El secreto del webhook de Telegram debe tener al menos 16 caracteres: es lo único que protege ese endpoint. Usa un valor aleatorio más largo y vuelve a guardar.",
    restoreFailed: "No se pudieron restaurar esos ajustes. No se cambió nada.",
    saveFailed: "No se pudieron guardar los ajustes de alertas.",
    testSentSkipped: "Prueba enviada por {sent}. Omitidos por estar incompletos: {skipped}.",
    testSentVia: "Alerta de prueba enviada por {channels}.",
    yourEnabledChannels: "tus canales activados",
    testIncomplete:
      "Ningún canal pudo enviar: activa un canal y completa su destino, y vuelve a intentarlo.",
    testNoChannels: "No hay canales de alerta activados. Activa al menos uno, guarda y vuelve a intentarlo.",
    testFailed: "No se pudo enviar la alerta de prueba. Revisa los ajustes de los canales y vuelve a intentarlo.",
    ackOk: "Alerta marcada como atendida.",
    ackError: "No se pudo confirmar la alerta.",
  },
  status: {
    label: "Estado:",
    on: "Activadas",
    off: "Desactivadas",
    lastAlert: "Última alerta {age}",
    noAlertsYet: "Aún no se ha enviado ninguna alerta",
  },
  activity: {
    heading: "Actividad reciente de alertas",
    subtitle: "Registro de los canales entregados y omitidos.",
    kindLabel: "Tipo",
    kinds: {
      all: "Todas",
      freeze: "Congelación",
      flood: "Inundación",
      forecast: "Pronóstico",
      threshold: "Umbral",
      test: "Prueba",
    },
    unhandledOnly: "Solo sin atender",
    filter: "Filtrar",
    clear: "Limpiar",
    confirmAckAll: "¿Marcar las {count} alertas sin atender como atendidas?",
    markAllHandled: "Marcar las {count} como atendidas",
    newer: "Más recientes",
    older: "Más antiguas",
  },
  claims: {
    heading: "¿Necesitas pruebas para un reclamo al seguro?",
    body: "Tras una congelación o fuga real, exporta un resumen con fechas y las lecturas correspondientes desde Historial.",
    open: "Abrir paquete para reclamos",
    seePro: "Ver paquete para reclamos (Pro)",
  },
  testSent: {
    heading: "Las alertas funcionan",
    body: "Ruta de entrega confirmada. Algunos pasos útiles ya que estás aquí:",
    shareFamily: "Comparte un enlace en vivo con tu familia",
    shareLinks: "Enlaces para compartir",
    downloadClaims: "Descargar paquete para reclamos",
    claimsEvidence: "Paquete de pruebas para reclamos",
    comparePlans: "Comparar planes",
  },
  testCard: {
    heading: "Enviar una alerta de prueba",
    bodyRepeat:
      "Envía un mensaje de ejemplo a todos los canales que tienes activados. Si acabas de cambiar los ajustes, guárdalos primero.",
    bodyFirst:
      "Confirma la entrega una vez antes de confiar en los avisos de congelación. Activa al menos un canal arriba, guarda y envía.",
    sendNow: "Enviar prueba ahora",
  },
  history: {
    heading: "Cambios recientes",
    body: "Cada guardado, del más reciente al más antiguo. Restaurar deja los ajustes como estaban justo antes de ese guardado; tu versión actual también se conserva aquí.",
    confirmUndo: "¿Deshacer tu último cambio en los ajustes de alertas?",
    confirmRestore:
      "¿Dejar los ajustes de alertas como estaban antes de este cambio? Los cambios posteriores también se deshacen.",
    undo: "Deshacer",
    restoreBefore: "Restaurar a antes de esto",
  },
  list: {
    empty:
      "Aún no hay eventos de alerta que coincidan con este filtro. Tras una congelación, una inundación o una prueba, aparecerán aquí con el motivo y acciones para falsas alarmas.",
    sent: "Enviada por {channels}",
    skipped: "Omitida en {channels}",
    why: "Motivo",
    suggested: "Sugerencia: {tip}.",
    suggestedFix: "Solución sugerida: {tip}.",
    open: "Abrir",
    raiseThreshold: "Subir umbral de congelación +1,1 °C (+2 °F)",
    checkPlacement: "Revisar la ubicación de la sonda",
    handled: "Atendida",
    recovered: "Recuperada",
    expired: "Caducada",
    showMore: {
      one: "Mostrar {count} más como esta (hasta {oldest})",
      other: "Mostrar {count} más como esta (hasta {oldest})",
    },
    hideSimilar: { one: "Ocultar {count} similar", other: "Ocultar {count} similares" },
    caption: "Eventos recientes de entrega y confirmación de alertas",
    columns: {
      when: "Cuándo",
      kind: "Tipo",
      title: "Título",
      why: "Motivo",
      sent: "Enviada",
      skipped: "Omitida",
      ack: "Confirmación",
    },
  },
  ack: {
    imOnIt: "Me encargo",
    imOnItTitle: "Detiene las alertas repetidas hasta que el espacio vuelva a superar tu umbral",
    more: "Más",
    snooze1h: "Atender y posponer 1 h",
    snooze4h: "Atender y posponer 4 h",
    snooze24h: "Atender y posponer 24 h",
    falseAlarm: "Falsa alarma (posponer 24 h)",
    raiseThreshold: "Falsa alarma + subir umbral +1,1 °C (+2 °F)",
    notifyTenant: "Atender y avisar al inquilino por email",
    webhookPing: "Atender y llamar al webhook",
  },
  tipsCard: {
    summary: "¿Recibes demasiadas alertas? Consejos para reducir las falsas alarmas",
    intro:
      "El ruido de congelación suele deberse a la ubicación o al umbral. El de inundación, a salpicaduras, condensación o ciclos del sumidero: los contactos mojados siguen avisando aunque las alertas estén pospuestas.",
    freeze: "Congelación",
    flood: "Inundación / fuga",
  },
  tips: {
    placement: {
      title: "Revisa la ubicación de la sonda",
      detail:
        "Las sondas en rieles de puertas, cerca de extractores o en paredes que da el sol oscilan mucho y disparan alertas de congelación que las tuberías nunca sufren. Muévelas hacia el tramo de tubería más frío o una esquina de la losa.",
      hrefLabel: "Simulador de sonda",
    },
    unplugged: {
      title: "Sin datos suele significar desconectada",
      detail:
        "Si una sonda deja de enviar durante horas, piensa primero en la alimentación o el Wi‑Fi, no en una congelación. Activa las alertas de sensor sin datos y confirma en Dispositivos que el ESP sigue enviando (POST).",
      hrefLabel: "Guía de lecturas sin actualizar",
    },
    threshold: {
      title: "Sube el umbral uno o dos grados",
      detail:
        "Un umbral de 0 °C (32 °F) salta con cada corriente de aire breve. Muchos hogares usan 1–2 °C (34–36 °F) para actuar antes de que se forme hielo sin despertarse cada vez que se abre una puerta.",
      hrefLabel: "Ajustes esenciales de alertas",
    },
    snooze: {
      title: "Detén el ruido mientras lo arreglas",
      detail:
        "¿Trabajando en un espacio frío? Pulsa «Me encargo» en la alerta: no se repetirá mientras siga esa helada. Posponer silencia las alertas rutinarias, pero las de congelación, fuga y corte de luz siempre llegan. Para falsas alarmas, sube el umbral o recoloca la sonda.",
    },
    splash: {
      title: "Rebotes por salpicaduras y condensación",
      detail:
        "Un contacto bajo un calentador de agua o un lavadero puede marcar mojado de forma intermitente por condensación o un goteo que ya paró. Móntalo en el fondo de la bandeja, lejos de las líneas de goteo, y sécalo tras una falsa alarma.",
    },
    sump_cycle: {
      title: "Ciclo de la bomba del sumidero ≠ fuga",
      detail:
        "Que suba el nivel del sumidero durante una tormenta es normal. Usa un contacto de inundación/fuga para el agua estancada y una regla personalizada level_above solo si quieres un aviso temprano de fallo de la bomba, no cada ciclo.",
      hrefLabel: "Reglas de alerta",
    },
    test_wet: {
      title: "Prueba con un paño húmedo y luego seca",
      detail:
        "Las alertas de inundación se disparan automáticamente al detectar agua (incluso en vacaciones). Tras una prueba de ubicación, seca el contacto para no dejarlo marcando mojado toda la noche.",
    },
  },
  staleProbes: {
    one: "{count} sonda parece sin actualizar: probablemente desconectada, sin Wi‑Fi o con la batería agotada. Revisa la alimentación y Dispositivos antes de tratarlo como una congelación.",
    other:
      "{count} sondas parecen sin actualizar: probablemente desconectadas, sin Wi‑Fi o con la batería agotada. Revisa la alimentación y Dispositivos antes de tratarlo como una congelación.",
  },
  wetFlood: {
    one: "{count} sensor de inundación/fuga está mojado ahora mismo: las alertas de inundación llegan aunque estén pospuestas o en modo vacaciones. Revisa la bandeja, el sumidero o la tubería de suministro.",
    other:
      "{count} sensores de inundación/fuga están mojados ahora mismo: las alertas de inundación llegan aunque estén pospuestas o en modo vacaciones. Revisa la bandeja, el sumidero o la tubería de suministro.",
  },
  why: {
    probeAt: "{probe} a {temp} °F",
    probeAtUnnamed: "Sonda a {temp} °F",
    threshold: "umbral {temp} °F",
    outdoor: "exterior {temp} °F",
    deltaT: "ΔT {delta} °F",
    runway: "~{hours} h de margen",
    doorOpen: "puerta abierta cerca",
  },
  referral: {
    heading: "Regala un invierno de monitoreo",
    introHtml: "Comparte tu enlace: quienes se registren obtienen <strong>7 días extra</strong> de prueba de Pro.",
    bonusDays: {
      one: "Tienes {count} día de prueba extra por recomendaciones exitosas.",
      other: "Tienes {count} días de prueba extra por recomendaciones exitosas.",
    },
    earn: "Ganas +7 días de prueba cuando un amigo que recomendaste se suscribe a Pro.",
    howGifting: "Cómo funcionan los regalos",
    loading: "Cargando enlace de recomendación…",
    copyInvite: "Copiar enlace de invitación",
    copied: "¡Copiado!",
    copyFailed: "No se pudo copiar",
    unavailable: "Enlace de recomendación no disponible.",
    friendsJoined: {
      one: "{count} amigo se unió con tu enlace.",
      other: "{count} amigos se unieron con tu enlace.",
    },
    noSignups: "Aún no hay registros. Comparte el enlace de arriba.",
  },
};

export default es;
