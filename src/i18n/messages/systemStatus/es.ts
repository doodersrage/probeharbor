import type { SystemStatusMessages } from "./en";

const es: SystemStatusMessages = {
  title: "Estado del sistema",
  description:
    "Estado en vivo de ProbeHarbor: tareas programadas de alertas, actividad de ingesta, alojamiento en Cloudflare y si los cron se ejecutan a tiempo.",
  breadcrumbHome: "Inicio",
  kicker: "Estado",
  lede: "Estado público de las tareas y la ingesta de ProbeHarbor: lo que medimos nosotros mismos. Se actualiza cada vez que cargas la página.",
  banner: {
    degraded: "Degradado: investigando",
    elevated: "Operativo: límites de ingesta elevados",
    operational: "Todos los sistemas operativos",
    pollOverdue: "La recopilación del historial va con retraso.",
    jobErrors: {
      one: "{count} error de tarea cron en las últimas 24 horas.",
      other: "{count} errores de tareas cron en las últimas 24 horas.",
    },
    latestFailed: "Falló la última ejecución del cron.",
    noCron: "No hay ejecuciones cron recientes registradas.",
    healthyDetail:
      "Correcto significa que la recopilación del historial va según lo previsto y que ninguna tarea cron ha fallado en las últimas 24 horas. Los eventos de límite de ingesta se muestran aparte y no cambian por sí solos este aviso a degradado.",
  },
  stats: {
    lastPoll: "Última recopilación del historial",
    overdue: " (con retraso)",
    pollSchedule: "Frecuencia de recopilación",
    pollScheduleValue: "Cada 15 minutos (:00, :15, :30, :45 UTC)",
    lastCronJob: "Última tarea cron",
    lastJobStatus: "Estado de la última tarea",
    jobErrors: "Errores de tareas (24 h)",
    rateLimitEvents: "Eventos de límite de ingesta (24 h)",
    checkedAt: "Comprobado el",
  },
  incidents: {
    title: "Incidentes",
    lede: "Notas escritas sobre caídas o degradaciones visibles para los clientes. Los errores de cron de arriba también controlan el aviso en vivo y los correos a los suscriptores de estado.",
    none: "Todavía no hay incidentes registrados. Cuando publiquemos un incidente resuelto (fecha, impacto, recuperación), aparecerá aquí. Hasta entonces, el aviso en vivo y la tabla de ejecuciones cron recientes son la referencia.",
    open: "Abierto: servicio degradado",
    started: "Empezó alrededor de esta carga de la página ({when}). Avisamos a los suscriptores de estado cuando el servicio se degrada y cuando se recupera.",
  },
  runs: {
    title: "Ejecuciones cron recientes",
    lede: "Últimas 14 ejecuciones de tareas (sin detalles sensibles).",
    empty: "Todavía no hay ejecuciones de tareas registradas.",
    started: "Inicio",
    job: "Tarea",
    status: "Estado",
  },
  jobStatus: { success: "correcto", error: "error", running: "en curso" },
  monitor: {
    title: "Qué supervisamos",
    items: [
      "Recopilación horaria del historial y evaluación de alertas",
      "Resumen semanal e informes mensuales y trimestrales por correo",
      "Retención de lecturas de sensores y agregados del mapa de heladas",
      "Recordatorios de prueba y correos de bienvenida",
    ],
  },
  hosting: {
    title: "Alojamiento",
    bodyHtml:
      "ProbeHarbor funciona en la <strong>red perimetral de Cloudflare</strong> (Workers), así el dashboard y las API de ingesta están cerca de los visitantes sin que tengas que mantener un servidor en casa. Publicamos el estado de las tareas y la ingesta de <em>esta</em> página, no un porcentaje de disponibilidad de marketing ni el SLA de la plataforma de Cloudflare como si fuera nuestro.",
    stackNotes: "Notas técnicas:",
    astro: "Astro en Cloudflare",
    workers: "Despliegue en Workers",
    cloudflareIncidents: "Incidentes de la plataforma Cloudflare:",
  },
  notify: {
    title: "Recibe avisos",
    lede: "Recibe un único correo si este estado cambia (degradado o de vuelta a la normalidad). Nada de correos rutinarios. El formulario está protegido con Cloudflare Turnstile.",
    subscribed: "Revisa tu bandeja de entrada: te enviamos un enlace de confirmación y no quedarás suscrito hasta que hagas clic en él.",
    confirmed: "Ya estás suscrito a las actualizaciones de estado.",
    unsubscribed: "Cancelaste tu suscripción a las actualizaciones de estado.",
    errors: {
      invalid_email: "Escribe un correo electrónico válido.",
      verification: "La verificación falló. Inténtalo de nuevo.",
      rate_limited: "Demasiados intentos. Vuelve a intentarlo en unos minutos.",
      invalid_token: "Ese enlace no es válido o ya se usó.",
    },
    company: "Empresa",
    email: "Correo electrónico",
    submit: "Avisarme de cambios de estado",
  },
  age: { never: "nunca", justNow: "ahora mismo" },
  chip: {
    unknown: "Estado del sistema",
    healthy: "Todos los sistemas operativos",
    degraded: "Servicio degradado, ver estado",
  },
};

export default es;
