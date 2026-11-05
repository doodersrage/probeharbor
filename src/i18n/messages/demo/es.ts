/**
 * /demo page copy. Keys ending in `Html` hold trusted inline HTML (links,
 * <code>) rendered with `set:html`; keep hrefs English, middleware localizes them.
 * List arrays follow the page order; hrefs live in the page.
 */
import type { DemoMessages } from "./en";

const es: DemoMessages = {
  title: "Demo de sondas en vivo",
  description:
    "Prueba ProbeHarbor sin cuenta: un simulador interactivo de sondas, un taller de demostración simulado con el tiempo real de tu zona y la misma configuración de alertas de helada e inundación que usará tu hardware.",
  ogImageAlt: "Curvas de temperatura en vivo de las sondas de ProbeHarbor, sin necesidad de cuenta",
  breadcrumbHome: "Inicio",
  breadcrumbDemo: "Demo en vivo",
  schemaName: "Demo de sondas en vivo de ProbeHarbor",
  schemaDescription:
    "Demos de ProbeHarbor sin cuenta: un simulador interactivo de sondas multizona y un taller de demostración simulado con el tiempo real de la zona.",
  header: {
    kicker: "Pruébalo (sin cuenta)",
    title: "Demos: simulador + taller según el tiempo real",
    lede: "Provoca una helada en el simulador interactivo de sondas, o mira cómo un taller de demostración simulado reacciona al tiempo real de hoy, en el mismo formato de lecturas que enviará tu ESP o Arduino para las alertas de helada e inundación.",
    simulator: "Simulador interactivo",
    liveReadings: "Lecturas del taller de demo",
    connect: "Conectar mis sondas",
  },
  paths: {
    title: "Tres formas de probar ProbeHarbor",
    lede: "Empieza por el simulador si quieres sentir cómo responde el riesgo de helada, y luego mira el taller de demostración según el tiempo real y la ruta de alerta automática por agua.",
    items: [
      {
        label: "Simulador interactivo de sondas",
        text: "Práctico (la mejor primera parada). Ajusta la puerta abierta o cerrada, el sol, el aire exterior y el umbral de helada. Provoca una ola de frío y mira cómo se actualizan las barras de cada zona y el JSON push/pull.",
      },
      {
        label: "Taller de demo según el tiempo real",
        text: "Para observar. Tres sondas de taller simuladas, recalculadas con el tiempo real de la zona en cada actualización. Ideal si quieres ver cómo se mueven las lecturas con las condiciones exteriores reales antes de conectar nada.",
      },
      {
        label: "Alta del kit con QR",
        text: "La ruta del hardware. Después de crear un dispositivo push, escanea el QR de ingesta (o imprímelo en una etiqueta del kit) para que el firmware envíe por POST temperatura, inundación y otros tipos de sensores sin escribir la clave.",
      },
    ],
  },
  sim: {
    title: "Provoca el cambio: simulador interactivo",
    lede: "Los ajustes predefinidos de ola de frío, corriente por la puerta y carga solar usan el mismo cálculo de estado de espacios de Overview que producción. Abre el portón y mira cómo la zona de la puerta se separa del banco de trabajo: por eso importa repartir varias sondas.",
    doorDraft: "Probar corriente por la puerta",
    coldSnap: "Probar ola de frío",
    openFull: "Abrir el simulador completo",
  },
  live: {
    title: "Taller de demo según el tiempo real",
    ledeHtml:
      'Taller de demostración simulado, impulsado por el tiempo real de la zona: las lecturas de las sondas salen de un modelo del taller; las condiciones exteriores son en vivo. ¿Prefieres manipular tú las variables? <a class="text-link" href="/about/probe-demo">Abre el simulador interactivo</a>.',
    readingsLabel: "Lecturas de demo simuladas",
    historyNote:
      "Las curvas de las sondas son el modelo del taller de demo calculado con el tiempo horario real de la última semana; la línea discontinua es la temperatura exterior.",
  },
  screenshotCaption:
    "La misma interfaz del producto cuando conectas tu hardware. Insights con curvas de 30 días, umbral de helada y noches de riesgo.",
  freeze: {
    title: "Los mismos datos que disparan las alertas de helada e inundación",
    lede: "Cuando una sonda cruza tu umbral, ProbeHarbor puede avisarte por correo, push del navegador, Discord, Telegram, Slack y, en Pro, SMS. Los contactos de inundación o fuga avisan automáticamente al mojarse, con la misma infraestructura. Define el límite una vez y pruébalo antes de la próxima noche fría.",
    channelsLabel: "Canales de alerta",
    channels: [
      "Correo · Discord · Telegram · Slack",
      "Push en todos los planes",
      "SMS · webhooks en Pro",
      "Los sensores de fuga o inundación avisan automáticamente al mojarse",
    ],
    startFree: "Empieza gratis: abre Devices",
    story: "Historia de una fuga",
    cookbook: "Recetario de canales",
    imageAlt:
      "Tendencia de temperatura de ProbeHarbor con humedad, punto de rocío y umbral de helada en 1 °C (34 °F)",
  },
  steps: {
    title: "Ahora, tu kit",
    ledeHtml:
      'Cuenta gratis, sin tarjeta, del dashboard vacío a una curva en vivo en una sola sesión. Los kits físicos pueden usar el <a class="text-link" href="/about/kit-qr-onboarding">alta del kit con QR</a>, así la URL de ingesta está a un escaneo.',
    items: [
      {
        title: "Crea un dispositivo push",
        copyHtml:
          "Regístrate y elige una ruta en Devices: Home Assistant, ESPHome o MQTT reciben un fragmento para copiar y pegar; una placa recibe un sketch ya completado; sin hardware tienes un feed de demo con un clic.",
      },
      {
        title: "Envía JSON por POST",
        copyHtml:
          "Haz POST a <code>/api/ingest/&lt;key&gt;</code>. Los sensores se importan solos en el primer POST: luego les cambias el nombre en Devices.",
      },
      {
        title: "Mira Home y configura alertas",
        copyHtml:
          "Confirma los valores en vivo, define un umbral de helada y ten en cuenta que los contactos de inundación o fuga avisan solos al mojarse, en la misma cuenta.",
      },
    ],
    startFree: "Empieza gratis: abre Devices",
    guide: "Guía para añadir dispositivos",
    walkthrough: "Paso a paso del QR del kit",
  },
  compat: {
    label: "Funciona con",
    push: "Push HTTPS JSON",
    pull: "Pull HTTPS JSON",
    mqtt: "Puente MQTT",
    homeAssistant: "Home Assistant (HACS)",
    noteHtml:
      'Mantén MQTT en tu red local y replica a ProbeHarbor por HTTPS para tener alertas de helada e inundación en casa e historial. <a class="text-link" href="/about/mqtt-bridge">Receta del puente MQTT</a>',
  },
  explore: {
    title: "Sigue explorando",
    lede: "¿Ya provocaste una ola de frío simulada? Mira el taller de demostración según el tiempo real y luego prueba una historia de inundación o fuga, consulta el mapa de una ciudad o configura el QR del kit.",
    items: [
      { label: "Simulador interactivo de sondas", hint: "La demo práctica principal: puerta, sol, exterior, umbral de helada" },
      { label: "Mapa comunitario de heladas", hint: "Datos agregados por ciudad (voluntarios), sin cuenta" },
      { label: "Alta del kit con QR", hint: "Crear dispositivo → escanear QR de ingesta → primer POST" },
      { label: "Escenario de helada", hint: "Cómo se ve, alerta a alerta, un calefactor que falla a las 2 de la madrugada" },
    ],
  },
  faqLede:
    "Respuestas sobre la demo; para planes y lo básico del producto, consulta Precios o las preguntas frecuentes de la página de inicio.",
};

export default es;
