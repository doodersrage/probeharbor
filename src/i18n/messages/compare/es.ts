import type { AboutPhotoId } from "../../../lib/aboutPhotos";

/**
 * /compare hub copy. Keys ending in `Html` hold trusted inline HTML (links,
 * <strong>); keep hrefs English, middleware localizes them.
 */
type Row = { capabilityHtml: string; probeharborHtml: string; diyHtml: string; consumerHtml: string };
import type { CompareMessages } from "./en";

const es: CompareMessages = {
  title: "Compara opciones de monitoreo",
  description:
    "ProbeHarbor vs Temp Stick, YoLink, SensorPush, Shelly, Govee, MQTT casero, Tempest, Nest y Ecobee: alertas de helada y fugas en espacios sin calefacción.",
  breadcrumbHome: "Inicio",
  breadcrumbCompare: "Comparar",
  kicker: "Comparar",
  headerTitle: "Hecho para dueños de casa, no para servidores caseros",
  headerLede:
    "ProbeHarbor te da sondas en vivo, alertas de helada e inundación/fugas y SMS opcional, sin que tengas que mantener tu propia infraestructura. Los límites de cada plan y la matriz Free/Member/Pro/Portfolio están en Precios; esta página compara ProbeHarbor con otras alternativas.",
  seePlansPricing: "Ver planes y precios",
  startFree: "Empieza gratis",
  photoLabels: {
    "network-switch": "vs MQTT casero",
    "home-workshop": "vs Govee / SmartThings",
    "frozen-thermometer": "vs Tempest",
    "utility-pipes": "vs TempStick",
    crawlspace: "vs Nest / Ecobee",
  },
  guides: {
    title: "Comparativas detalladas",
    subtitle: "Guías lado a lado de las alternativas más comunes: carga de mantenimiento, alertas y cuándo conviene cada opción.",
    smartThingsHtml:
      '<strong class="text-[var(--color-text)]">SmartThings</strong> puede añadir sensores de ProbeHarbor mediante la <a class="text-link" href="/integrations/smartthings">ruta del puente Matter</a> (sin app Cloud-to-Cloud). Los sensores de consumo siguen agrupados con Govee más abajo: <a class="text-link" href="/compare/govee">guía de Govee</a>.',
    haTitle: "Home Assistant (HACS)",
    haCopyHtml:
      'Complementario, no rival: mantén HA en tu red local y usa ProbeHarbor para los SMS de helada y fugas del hogar, el historial y las alertas fuera de casa. La integración oficial de HACS y notas para usarla junto con MQTT están en la <a class="text-link" href="/integrations/home-assistant">página de Home Assistant</a>; y consulta <a class="text-link" href="/compare/diy-mqtt">vs MQTT casero</a> si estás evaluando montar todo tú mismo.',
  },
  table: {
    title: "ProbeHarbor frente a las alternativas",
    caption: "ProbeHarbor comparado con scripts caseros y con Govee o SmartThings",
    capability: "Función",
    probeharbor: "ProbeHarbor",
    diy: "Script casero + cron",
    consumer: "Govee / SmartThings",
    rows: [
      { capabilityHtml: "Tiempo hasta la helada (en este espacio)", probeharborHtml: "Reloj basado en el pronóstico + alerta de horas restantes", diyHtml: "Tú escribes el modelo", consumerHtml: "Solo umbral" },
      { capabilityHtml: "Alertas de helada (correo/SMS/push)", probeharborHtml: "Integradas, por hogar", diyHtml: "Tú conectas Twilio + cron", consumerHtml: "Push de la app; SMS aparte o inexistente" },
      { capabilityHtml: "Envío de datos desde ESP/Arduino", probeharborHtml: "Clave de dispositivo única", diyHtml: "Endpoint propio", consumerHtml: "Sensores Govee / dispositivos SmartThings" },
      { capabilityHtml: "Historial y exportación CSV", probeharborHtml: "En planes de pago", diyHtml: "Base de datos autoalojada", consumerHtml: "Niveles de suscripción" },
      { capabilityHtml: "Enlaces compartidos y Grafana", probeharborHtml: "1 enlace en vivo para la familia; Pro añade historial y métricas", diyHtml: "Configuración manual", consumerHtml: "Poco común en apps de consumo" },
      { capabilityHtml: "Home Assistant (HACS)", probeharborHtml: '<a class="text-link" href="/integrations/home-assistant">Integración oficial</a> (enlace compartido)', diyHtml: "Sensores REST + webhooks", consumerHtml: "Depende del fabricante" },
      { capabilityHtml: "Varios usuarios por hogar", probeharborHtml: "Gratis", diyHtml: "No aplica", consumerHtml: "Compartir en familia es incómodo" },
      { capabilityHtml: "Alojamiento y disponibilidad", probeharborHtml: 'Red de Cloudflare; <a class="text-link" href="/system-status">estado público</a>', diyHtml: "Tú mantienes el VPS / cron", consumerHtml: "Nube del fabricante (opaca)" },
    ],
  },
  screenshotCaption: "Lo que obtienes sin mantener tu propia infraestructura: curvas de las sondas frente a tu umbral de helada.",
  audience: {
    title: "Para quién es",
    itemsHtml: [
      "<strong>Free</strong>: una propiedad, gráficas en vivo, alertas por correo y chat, y un enlace en vivo para la familia mientras lo pruebas.",
      "<strong>Member</strong>: historial en CSV y más dispositivos durante toda una temporada de frío.",
      '<strong>Pro</strong>: SMS, contexto de la casa desde Nest/Ecobee, alcances de enlace compartido ilimitados, <a class="text-link" href="/integrations/home-assistant">Home Assistant (HACS)</a>, <a class="text-link" href="/claims-pack">paquete para reclamaciones</a> y webhooks para cuando alguien tiene que despertarse a las 2 de la mañana. Free ya incluye un enlace en vivo para la familia. Consulta la <a class="text-link" href="/docs/api">API HTTP</a> para el envío de datos y las métricas.',
      '<strong>Portfolio</strong>: para operaciones con muchas propiedades que superan el límite de Pro, con accesos para administradores de propiedades. Detalles en <a class="text-link" href="/pricing#portfolio">Precios</a> y <a class="text-link" href="/property-management">administración de propiedades</a>.',
    ],
    startFree: "Empieza gratis, sin tarjeta",
    seePrices: "Ver precios de los planes",
    readScenario: "Lee un caso de helada",
  },
  limits: {
    title: "Los límites de cada plan están en Precios",
    subtitle:
      "La cantidad de dispositivos, la retención, Nest/Ecobee, los accesos para administradores y la comparación Free vs Member vs Pro vs Portfolio están en la página de precios, para que esta página se centre en las alternativas y no repita la matriz de planes.",
    openComparison: "Abrir la comparación de planes",
    createAccount: "Crear cuenta gratis",
  },
};

export default es;
