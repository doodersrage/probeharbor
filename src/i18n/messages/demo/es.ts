/**
 * /demo page copy. Keys ending in `Html` hold trusted inline HTML (links,
 * <code>) rendered with `set:html`; keep hrefs English, middleware localizes them.
 * List arrays follow the page order; hrefs live in the page.
 */
import type { DemoMessages } from "./en";

const es: DemoMessages = {
  title: "Demo de sondas en vivo",
  description:
    "Prueba ProbeHarbor sin cuenta: simulador interactivo de sondas, sondas de demo reales en vivo y la misma ruta de alertas de helada e inundación que usará tu hardware.",
  ogImageAlt: "Curvas de temperatura en vivo de las sondas de ProbeHarbor, sin necesidad de cuenta",
  breadcrumbHome: "Inicio",
  breadcrumbDemo: "Demo en vivo",
  schemaName: "Demo de sondas en vivo de ProbeHarbor",
  schemaDescription:
    "Demos de ProbeHarbor sin cuenta: simulador interactivo de sondas con varias zonas y sondas de demo en vivo sobre la ruta de ingesta de producción.",
  header: {
    kicker: "Pruébalo (sin cuenta)",
    title: "Demos: simulador + feed en vivo",
    lede: "Provoca una helada en el simulador interactivo de sondas o mira sondas de demo reales junto al tiempo exterior: la misma ruta de ingesta que usará tu ESP o Arduino para las alertas de helada e inundación.",
    simulator: "Simulador interactivo",
    liveReadings: "Lecturas en vivo",
    connect: "Conectar mis sondas",
  },
  paths: {
    title: "Tres formas de probar ProbeHarbor",
    lede: "Empieza por el simulador si quieres ver cómo reacciona el riesgo de helada a lo que haces y luego confírmalo con el feed en vivo y la ruta de inundación con sensor mojado automático.",
    items: [
      {
        label: "Simulador interactivo de sondas",
        text: "Práctico (la mejor primera parada). Ajusta la puerta abierta o cerrada, el sol, el aire exterior y el umbral de helada. Provoca una ola de frío y mira cómo se actualizan las barras de cada zona y el JSON push/pull.",
      },
      {
        label: "Feed de demo en vivo",
        text: "Para observar. Sondas de demo reales que se actualizan aquí por la ruta de ingesta de producción. Ideal si quieres responder a “¿esto es falso?” con números en vivo.",
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
    title: "Feed de demo en vivo",
    ledeHtml:
      'Lecturas reales de sondas de demo y tiempo exterior, no una maqueta. ¿Prefieres mover tú las variables? <a class="text-link" href="/about/probe-demo">Abre el simulador interactivo</a>.',
    readingsLabel: "Lecturas de la demo en vivo",
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
    lede: "¿Ya provocaste una ola de frío simulada? Confírmalo con el feed en vivo y luego lee una historia de fuga, mira tu ciudad en el mapa o configura el QR del kit.",
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
