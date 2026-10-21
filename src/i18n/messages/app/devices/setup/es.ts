import type { DevicesSetupMessages } from "./en";

const es: DevicesSetupMessages = {
  firstRun: {
    title: "Conecta tu primer sensor",
    subtitle: "Elige lo que tienes hoy. Cada camino termina con una lectura en vivo; las alertas de congelación y fuga vienen justo después.",
    viewOnly: "Solo lectura: pide a un propietario que añada un dispositivo.",
    limitReached: "Límite de dispositivos alcanzado.",
    limitUpgrade: "Mejora tu plan para tener más dispositivos",
    haveSensors: {
      title: "Ya tengo sensores",
      copy: "Home Assistant, ESPHome o un broker MQTT. Creamos un dispositivo y te damos un fragmento listo para copiar y pegar con su clave. Unos 5 minutos.",
    },
    haveBoard: {
      title: "Tengo una placa para flashear",
      copy: "Un ESP32 con un sensor DS18B20, DHT22 o I²C: instala el firmware desde este navegador por USB, sin Arduino IDE. Pico W y Arduino reciben en su lugar un sketch ya rellenado.",
      create: "Crear dispositivo y flashearlo",
      otherBoards: "Guías para otras placas",
      browserFlasher: "Flasheador en el navegador (beta)",
      espOptions: "Opciones para flashear ESP32",
      cellular: "Red celular",
    },
    noHardware: {
      title: "Aún no tengo hardware",
      copy: "Mira el panel funcionando ya con un feed de ejemplo en vivo y luego monta el kit antiheladas ESP32 (unos 25 US$) cuando estés listo.",
      demo: "Pruébalo con un feed de demostración",
      kitParts: "Lista de piezas del kit antiheladas ESP32",
    },
    also: "También:",
    jsonFeed: "Feed JSON por HTTPS",
    leakPucks: "Leak pucks",
    httpApi: "API HTTP",
  },
  funnel: {
    title: "Estás recibiendo datos",
    firstPost: "Primer POST recibido",
    alertDone: "Alerta de congelación configurada",
    alertTodo: "Configura el umbral de congelación en °F + email y envía una prueba",
    shareLink: "Comparte un enlace en vivo con tu familia",
    optional: ": opcional",
    renameHtml:
      'Los nombres de los sensores están bien así. <a class="text-link" href="/dashboard/devices?view=setup&rename_sensors=1">Cámbialos más tarde</a> en la tarjeta del dispositivo si quieres.',
    setAlert: "Configurar congelación + email",
    sendTest: "Enviar una alerta de prueba",
    overview: "Resumen",
    guides: "Guías de configuración de hardware",
    kitQr: "QR del kit",
    cellular: "Red celular",
  },
  firstAlert: {
    title: "Configura tu primera alerta de frío + agua",
    subtitle:
      "Un umbral y un email, sin salir de Dispositivos. Los contactos de inundación/fuga mojados alertan automáticamente en cuanto las alertas están activadas (y se saltan la pausa y el modo vacaciones). Añade Telegram, Discord y más después.",
    savedAndTested: "Alerta de frío + agua guardada y prueba enviada, revisa tu bandeja de entrada.",
    saved: "Alerta de frío + agua guardada.",
    testFailed:
      "Ajustes guardados, pero no se pudo entregar la prueba. Confirma la dirección de email o inténtalo de nuevo desde Alertas.",
    freezeLabel: "Umbral de congelación (°F)",
    emailLabel: "Email de alertas",
    emailPlaceholder: "tu@ejemplo.com",
    saveAndTest: "Guardar + enviar prueba",
    saveOnly: "Solo guardar",
    fullSettings: "Todos los ajustes de alertas",
  },
  integrations: {
    title: "Otras formas de conectar",
    subtitle:
      "La ingesta push desde ESP32, Pico W, STM32, CH32V o ensamblador AVR es la opción por defecto. Despliega un camino abajo para ver la configuración lista para copiar y pegar.",
    claimPuck: {
      summary: "Claim puck (RP2040-Zero)",
      stepsHtml: [
        "Flashea el firmware de claim-puck y conecta un botón de GP4 a GND.",
        "Pon en las etiquetas <code>space</code> del dispositivo el nombre de la plaza que vas a reclamar (p. ej. garage).",
        'En <a class="text-link" href="/bay-buddy">Bay Buddy</a>, conecta tu cuenta, enchufa el puck, reclama la plaza y, si quieres, controla el LED de ambiente.',
      ],
      productPage: "Página del producto",
      caseDiffuser: "Carcasa / difusor",
      claimApi: "API de reclamación",
    },
    contacts: {
      summary: "Contactos de puerta / fuga / corriente",
      stepsHtml: [
        "Flashea los sketches de ESP32 de <code>sketches/arduino/door_contact_ingest</code>, <code>leak_contact_ingest</code> o <code>power_sense_ingest</code>.",
        "Envía por POST los booleanos <code>door1</code> / <code>leak1</code> / <code>power1</code> a tu URL de ingesta.",
      ],
      doorPuck: "Door puck",
      leakPuck: "Leak puck",
      powerNudge: "Power nudge",
      allAccessories: "Todos los accesorios",
    },
    beacon: {
      summary: "Baliza de alerta y piezas del kit",
      bodyHtml:
        '<a class="text-link" href="/alert-beacon">Baliza de alerta</a> NeoPixel de ambiente, <a class="text-link" href="/kit-labels">etiquetas QR / NFC</a> y <a class="text-link" href="/probe-mount-kit">kit de montaje de sondas</a>: complementos y merchandising, no sondas antiheladas.',
    },
    homeAssistant: {
      summary: "REST de Home Assistant",
      stepsHtml: [
        "Crea un dispositivo push arriba y copia la URL de ingesta.",
        "En HA, usa un sensor <code>rest</code> o una automatización con <code>resource: https://probeharbor.dev/api/ingest/YOUR_KEY</code>.",
        'Envía el JSON de la entidad por POST. ProbeHarbor lee <code>friendly_name</code> para las etiquetas. <a class="text-link" href="/integrations/home-assistant">Guía completa de HA</a>',
      ],
    },
    mqtt: {
      summary: "Puente MQTT → HTTPS",
      stepsHtml: [
        "Mantén Mosquitto en tu red local. ProbeHarbor no es un broker MQTT.",
        'Importa el flujo de Node-RED desde <a class="text-link" href="/dashboard/share/integrations#node-red">Integraciones → Node-RED</a> o ejecuta el puente en Python de <code>scripts/mqtt-bridge.py</code>.',
        "Pon en <code>PROBEHARBOR_INGEST_KEY</code> la clave de tu dispositivo push.",
        '<a class="text-link" href="/about/mqtt-bridge">Documentación del puente MQTT</a>',
      ],
    },
    esphome: {
      summary: "ESPHome / Shelly en red local",
      bodyHtml:
        "Apunta <code>rest</code> de ESPHome o HTTP de Shelly a tu URL de ingesta, o expón JSON por HTTPS para un feed de consulta.",
      recipes: "Recetas de ESPHome y Shelly",
    },
    ingestFormats: "Formatos de ingesta",
    allIntegrations: "Todas las integraciones",
  },
};

export default es;
