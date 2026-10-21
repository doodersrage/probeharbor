/**
 * Homepage copy. Keys ending in `Html` hold trusted inline HTML (links,
 * <strong>, <code>) and are rendered with `set:html`; keep the hrefs English
 * (`/pricing`), middleware points them at the visitor's locale.
 */
import type { HomeMessages } from "./en";

const es: HomeMessages = {
  title: "Monitoreo de heladas e inundaciones en el garaje",
  ogImageAlt:
    "Gráfico de telemetría en vivo de ProbeHarbor: curvas de sondas con humedad, punto de rocío, alertas de congelación y contactos de inundación",
  breadcrumbHome: "Inicio",
  brandDefinition:
    "ProbeHarbor vigila sensores de temperatura y fugas en garajes, talleres, áticos, sótanos ventilados y naves, con gráficos en vivo, historial y alertas de congelación, fugas y calor. Código abierto y con plan gratuito.",
  hero: {
    promise: "Entérate antes de que se congelen tus tuberías o se inunde tu garaje.",
    openDashboard: "Abrir el panel",
    liveReadings: "Lecturas en vivo",
    startFree: "Empieza gratis",
    seeDemo: "Ver la demo en vivo",
    signedInHtml:
      'Sesión iniciada: Resumen para la operación, En vivo para ver las sondas de un vistazo, o <a class="text-link" href="/dashboard/devices">Dispositivos</a> para gestionar la ingesta.',
    guestHtml:
      '¿Sin tarjeta y aún sin hardware? <a class="text-link" href="/pipe-freeze-forecast">Recibe alertas de congelación gratis para tu zona</a>.',
    freeForever: "Gratis para siempre · sin tarjeta",
    planPrice: "{plan} {price}/mes",
    visualAlt:
      "Insights de ProbeHarbor: curvas de sondas de siete días con la línea de congelación, contactos de inundación, pronóstico de noches de riesgo y reloj de tiempo hasta la congelación",
    visualCaption:
      "Panel real de ProbeHarbor: curvas de sondas de 30 días, umbral de congelación y comparación interanual. No es una maqueta.",
  },
  live: {
    title: "Dos formas de probarlo (sin cuenta)",
    lede: "Abre la puerta del garaje y provoca una ola de frío en el simulador, o mira abajo las sondas reales de la demo.",
    coldSnap: "Simular una ola de frío",
    demoFeed: "Datos de la demo en vivo",
    readingsLabel: "Lecturas de la demo en vivo",
  },
  steps: {
    title: "Cómo funciona",
    lede: "Un camino recomendado: ESP32 + sonda impermeable → ProbeHarbor → alerta en el teléfono. Otras placas y fuentes de datos siguen disponibles cuando ya estés en marcha.",
    buildTitle: "Arma una sonda",
    buildCopy:
      "ESP32 + DS18B20 impermeable es el kit recomendado (unos 20–30 US$ en piezas): tres cables y una resistencia. Un DHT22 añade humedad en el mismo pin.",
    installTitle: "Instala desde el navegador",
    installCopyHtml:
      'Conecta el ESP32 por USB, instala el firmware con el <a class="text-link" href="/flash">instalador web</a> en Chrome o Edge y envíale tu Wi‑Fi y la clave del dispositivo por el mismo cable. Sin Arduino IDE y sin programar.',
    alertsTitle: "Recibe alertas de congelación",
    alertsCopy:
      "Define la temperatura de congelación y un correo, envía una prueba y luego sigue En vivo y Resumen. Añade un contacto de inundación cuando quieras.",
    partsHtml:
      "<strong>Necesitas:</strong> una cuenta gratuita, una placa ESP32 (unos 8–15 US$), una DS18B20 impermeable (unos 2–5 US$), tu Wi‑Fi y un cable USB con Chrome o Edge. Menos de 25 US$ y sin suscripción para probar las alertas de congelación.",
    startFree: "Empieza gratis",
    partsList: "Lista de piezas ESP32",
    otherBoards: "Otras placas e integraciones",
  },
  maker: {
    title: "¿Te encanta el DIY? No tienes que hacerlo todo tú.",
    lede: "Conserva tu ESP32, Arduino, MQTT o Home Assistant. ProbeHarbor añade historial alojado y alertas de congelación e inundación para todo el hogar sin otro servidor que cuidar.",
    tagline: "Tu sensor. Tus datos. Tus alertas.",
    mqttBridge: "Puente MQTT",
    vsDiy: "vs. MQTT casero",
  },
  story: {
    kicker: "Escenario",
    title: "1 °C (34 °F). Ahí es cuando la alerta importa.",
    copyHtml:
      'Imagina un garaje adosado donde una esquina baja de 1 °C (34 °F) cada noche despejada. La alerta te dice que algo va mal; el gráfico del historial te muestra dónde, apuntando a un burlete con corrientes antes de que se congelen las tuberías. Es justo el tipo de cronología que documentaría un <a class="text-link" href="/claims-pack">paquete de pruebas para reclamaciones</a> si los daños por congelación acabaran en una conversación con el seguro.',
    shotCaption: "La misma línea de congelación que cada hogar define en Alertas, visible en las curvas del Historial.",
    read: "Leer el escenario",
    more: "Más escenarios",
  },
  features: {
    label: "Funciones destacadas",
    protectTitle: "Protege los espacios vulnerables",
    protectCopyHtml:
      'Alertas de congelación y fugas en todos los planes, además de un reloj de tiempo hasta la congelación para cada espacio, para saber cuándo llegarán las tuberías al punto de congelación y no solo después. Member añade avisos del pronóstico exterior; Pro añade alertas oficiales del NWS (EE. UU.) y SMS. <a class="text-link" href="/about/cold-snap-playbook">Guía para olas de frío</a>',
    leaksTitle: "Detecta las fugas antes de que se extiendan",
    leaksCopyHtml:
      'Los contactos de inundación alertan solos cuando se mojan, incluso con alertas pospuestas o en vacaciones. Añade un sensor de <code>level</code> en el pozo de bombeo o el depósito si quieres reglas de aviso temprano antes de que el agua llegue al suelo. <a class="text-link" href="/about/ingest-and-webhooks">Guía de ingesta de inundación y nivel</a>',
    stackTitle: "Tus sensores, tu stack",
    stackCopyHtml:
      'Temperatura, humedad, calidad del aire, puertas, fugas, electricidad y movimiento en hardware que tú controlas. <a class="text-link" href="/about/ingest-and-webhooks">Guía de ingesta</a> · <a class="text-link" href="/docs/api">API HTTP</a>',
    portfolioTitle: "De hogares a carteras de inmuebles",
    portfolioCopyHtml:
      'Invita a tu familia y comparte un enlace en vivo sin dar ninguna contraseña. Pro añade un <a class="text-link" href="/claims-pack">paquete de pruebas para reclamaciones</a>; Portfolio añade <a class="text-link" href="/property-management">accesos para administradores de propiedades</a> en alquileres y edificios.',
  },
  pricing: {
    title: "Gratis para empezar",
    lede: "Elige un nivel según la tarea: noches de helada, alertas de fugas o monitoreo de una cartera de inmuebles. Todos los límites están en la página de precios.",
    free: "Comprueba si ProbeHarbor te sirve",
    member: "Sigue toda una temporada de frío",
    pro: "Alertas serias y automatización",
    perMonth: " · {price}/mes",
    startFree: "Empieza gratis",
    compare: "Comparar planes",
  },
  guides: {
    label: "Guías",
    heading: "Guías:",
    hardware: "Montaje del hardware",
    freeze: "Alertas de congelación",
    flood: "Alertas de inundación y fugas",
    sharing: "Compartir y API",
    hub: "Abrir el centro de guías",
  },
  ossHtml:
    'Panel de código abierto y sketches de ejemplo para sensores. <a class="text-link" href="https://github.com/doodersrage/probeharbor" target="_blank" rel="noreferrer">Ver el código en GitHub</a>.',
  faqLede:
    "Respuestas claras para quienes cablean sondas y contactos de humedad y configuran alertas de congelación o inundación.",
};

export default es;
