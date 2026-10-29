import type { ApiUserMessages } from "./en";

const es: ApiUserMessages = {
  testAlert: {
    title: "Alerta de prueba de ProbeHarbor",
    body: "Esta es una notificación de prueba desde tu panel de ProbeHarbor. Si la recibiste, tus canales de alerta funcionan.",
    unknownChannel: "Canal desconocido",
    noChannels: "No se entregó por ningún canal",
    failed: "La alerta de prueba falló",
  },
  snooze: {
    snoozed: { one: "Alertas pospuestas durante {count} hora.", other: "Alertas pospuestas durante {count} horas." },
    vacationUntil: "Vacaciones hasta el {date}.",
    vacationDays: { one: "Modo vacaciones durante {count} día.", other: "Modo vacaciones durante {count} días." },
    snoozeCleared: "Se quitó la pausa.",
    vacationCleared: "Se desactivó el modo vacaciones.",
  },
  ack: {
    nothing: "No hay nada que confirmar",
    handled: { one: "Se gestionó {count} alerta.", other: "Se gestionaron {count} alertas." },
  },
  chartShare: {
    upgradeRequired: "Para compartir gráficos necesitas un plan superior",
    invalidPng: "PNG no válido",
  },
  pinned: {
    invalidMetric: "Métrica no válida",
    max: "Puedes fijar hasta {max} métricas de estado.",
    noMetrics: "No hay métricas",
  },
  noEditableProperties: "No hay propiedades que puedas editar",
  noProperty: "No hay ninguna propiedad",
  noValidFeeds: "No se indicó ningún feed válido.",
  feedIdRequired: "Falta el id del feed",
  csvRequiresPlan: "Para exportar CSV necesitas una suscripción activa o acceso de administrador",
  doorCsvFailed: "No se pudo exportar el historial de puertas. Inténtalo de nuevo en un momento.",
  doorCsvTooMany: "Hay demasiadas aperturas de puertas para un solo CSV (más de 5000). Elige menos días e inténtalo de nuevo.",
  push: {
    invalidSubscription: "Suscripción no válida",
    missingEndpoint: "Falta el endpoint",
    invalidFcmToken: "Token de FCM no válido",
    invalidPlatform: "Plataforma no válida",
    missingToken: "Falta el token",
  },
  weather: {
    historyUnavailable: "El historial del tiempo no está disponible",
    notConfigured: "La API del tiempo no está configurada",
    locationUnavailable: "No se pudo cargar el tiempo de esta ubicación.",
    geocodeFailed: "No se pudo localizar el lugar",
    geocodeRequestFailed: "Falló la búsqueda del lugar",
  },
};

export default es;
