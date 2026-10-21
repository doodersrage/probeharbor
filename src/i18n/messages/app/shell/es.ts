import type { ShellMessages } from "./en";

const es: ShellMessages = {
  defaultTitle: "Panel",
  nav: {
    overview: "Resumen",
    live: "En vivo",
    portfolio: "Portfolio",
    devices: "Dispositivos",
    alerts: "Alertas",
    history: "Historial",
    household: "Hogar",
    share: "Compartir",
    plans: "Planes",
    settings: "Ajustes",
    ops: "Operaciones",
    dashboard: "Panel",
  },
  sidebar: {
    ariaLabel: "Panel",
    mobileAriaLabel: "Accesos rápidos de monitoreo",
    menu: "Menú",
    groups: { monitor: "Monitoreo", account: "Cuenta", admin: "Admin" },
    unhandledBadge: "{count} sin atender",
    laggingProbes: "Sondas con retraso",
    search: "Buscar",
    refresh: "Actualizar",
    backToSite: "Volver al sitio",
    signOut: "Cerrar sesión",
  },
  topbar: {
    noReading: "Sin lecturas",
    refresh: "Actualizar",
    switched: "Propiedad activa cambiada.",
    switchError: "No se pudo cambiar de propiedad. Inténtalo de nuevo.",
  },
  kiosk: {
    enter: "Modo quiosco",
    exit: "Salir del quiosco",
    enterTitle: "Modo quiosco / taller: pantalla completa y pantalla siempre encendida",
    exitTitle: "Salir del modo quiosco / taller",
  },
  switcher: {
    activeProperty: "Propiedad activa",
    selectHousehold: "Elige un hogar",
    switchHousehold: "Cambiar de hogar",
    property: "Propiedad",
  },
  roles: {
    owner: "Propietario",
    member: "Editor",
    viewer: "Lector",
    alert_only: "Solo alertas",
    property_manager: "Administrador de la propiedad",
  },
  readingAge: {
    never: "Nunca",
  },
  unacked: {
    label: { one: "alerta sin atender.", other: "alertas sin atender." },
    review: "Revisar",
    claimsPack: "Descargar el paquete de pruebas para reclamaciones",
  },
  lowBattery: {
    deviceHealth: "Estado de los dispositivos",
    alertSettings: "Ajustes de alertas",
  },
  adminTabs: {
    ariaLabel: "Secciones de administración",
    ops: "Resumen",
    feeds: "Estado de los feeds",
    jobs: "Tareas",
    email: "Correos bloqueados",
    users: "Usuarios",
    contacts: "Contactos",
  },
  shareTabs: {
    ariaLabel: "Secciones de Compartir",
    links: "Enlaces",
    api: "API y webhooks",
    integrations: "Integraciones",
  },
  nudge: {
    comparePlans: "Comparar planes",
    upgradeTo: "Pasar a {plan}",
    notNow: "Ahora no",
    retentionDays: { one: "{count} día", other: "{count} días" },
    retentionYears: { one: "{count} año", other: "{count} años" },
    items: {
      csv_export: {
        title: "Exporta el historial en CSV",
        body: "Member permite descargar en CSV las lecturas guardadas, útil para documentos del seguro y para ajustar la climatización.",
      },
      history_charts: {
        title: "Ten más historial a mano",
        body: "Member incluye exportación CSV y todas las herramientas de gráficos. Las cuentas Free siguen viendo los datos en vivo y los gráficos recientes.",
      },
      sms_alerts: {
        title: "Recibe alertas de congelación y fugas por SMS",
        body: "Pro añade SMS con Twilio, clave cuando el correo no llega a tiempo durante una ola de frío o con un contacto mojado.",
      },
      push_alerts: {
        title: "Notificaciones push en este dispositivo",
        body: "Las notificaciones push del navegador están en todos los planes, así que las alertas te llegan aunque el panel no esté abierto.",
      },
      webhooks: {
        title: "Conecta las alertas a Home Assistant o Zapier",
        body: "Pro añade webhooks de alertas salientes, webhooks de lecturas al ingerir, endpoints entrantes de posponer/estado y la integración oficial de Home Assistant en HACS.",
      },
      share_links: {
        title: "Más tipos de enlace para invitados y Grafana",
        body: "Free ya incluye un enlace en vivo para la familia. Pro añade historial, métricas, widgets incrustados y enlaces que no caducan.",
      },
      api_keys: {
        title: "Claves de API para Grafana y scripts",
        body: "Pro incluye claves de API del panel y un JSON de dashboard de Grafana para descargar.",
      },
      embed_widget: {
        title: "Muestra las temperaturas en vivo en tu web",
        body: "Los enlaces compartidos de Pro pueden alimentar un widget incrustable para un portal familiar o la página de tu taller.",
      },
      status_pages: {
        title: "Página de estado pública",
        body: "Los hogares Pro pueden publicar una página de estado con token y un feed iCal con la previsión de heladas.",
      },
      device_limit: {
        title: "¿Necesitas más dispositivos push?",
        body: "Free permite {free} dispositivos push por propiedad, Member {member} y Pro {pro}: mejora tu plan cuando superes el límite.",
      },
      data_retention: {
        title: "Guarda más tiempo de historial",
        body: "Free guarda {free} de lecturas. Member lo amplía a {member}; Pro guarda {pro} o más para comparar estaciones y años.",
      },
      cold_risk: {
        title: "Adelántate a las noches de helada",
        body: "Todos los planes tienen un reloj de tiempo hasta la congelación para este espacio sin calefacción. Member añade avisos de helada según la previsión exterior. Pro añade las alertas oficiales de helada y frío del NWS (EE. UU.).",
      },
      prometheus: {
        title: "Lleva las métricas a Grafana",
        body: "Pro desbloquea métricas en formato Prometheus y claves de API para tu sistema de observabilidad.",
      },
      multi_property: {
        title: "¿Vas a vigilar una segunda propiedad?",
        body: "Pro admite hasta {max} propiedades propias: casa de vacaciones, vivienda de alquiler o taller.",
      },
      portfolio_scale: {
        title: "¿Gestionas una cartera de propiedades más grande?",
        body: "Portfolio sube el límite de propiedades propias a {max} y añade accesos de administrador de la propiedad para el personal in situ.",
      },
      claims_pack: {
        title: "Exporta un paquete de pruebas para reclamaciones",
        body: "Pro genera un resumen imprimible de congelación/fugas con los CSV de lecturas y eventos de alerta correspondientes para el periodo que elijas.",
      },
      thermostat_integration: {
        title: "Conecta tu Nest o Ecobee",
        body: "Pro muestra la lectura y la consigna del termostato de la casa junto a esta sonda, y añade ese contexto a las alertas de congelación.",
      },
    },
  },
  pwa: {
    eyebrow: "Ya funciona en tu celular",
    title: "Instala la app web (PWA)",
    body: "ProbeHarbor ya funciona: añádela a tu pantalla de inicio desde Chrome o Safari. La misma cuenta, lecturas en vivo y alertas. La app nativa de Android está en acceso anticipado en GitHub mientras termina la revisión de Google Play; no hace falta esperar a Play.",
    step1: "Abre probeharbor.dev en Chrome (Android) o Safari (iPhone).",
    step2Html: "Usa <strong>Instalar app</strong> o Compartir → <strong>Añadir a pantalla de inicio</strong>.",
    step3: "Abre el icono; activa las notificaciones push más tarde en Panel → Alertas.",
    installApp: "Instalar app",
    guide: "Pasos para instalar la PWA",
    android: "App nativa de Android (próximamente)",
    client: {
      installStarted: "Instalación iniciada.",
      installDismissed: "Instalación descartada: la guía paso a paso sigue sirviendo.",
      installed: "App instalada.",
    },
  },
};

export default es;
