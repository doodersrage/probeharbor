
/**
 * /about/esp32-freeze-kit body copy. `*Html` keys are trusted inline HTML;
 * hrefs stay English (middleware localizes them). Dashboard UI paths such as
 * "Dashboard → Devices" stay English because the dashboard is English-only.
 */
import type { Esp32FreezeKitMessages } from "./en";

const es: Esp32FreezeKitMessages = {
  howTo: {
    name: "Arma una sonda de congelación ESP32 para ProbeHarbor",
    steps: [
      {
        name: "Compra la lista de materiales",
        text: "Consigue un ESP32 con Wi-Fi, un DS18B20 impermeable y una resistencia pull-up de 4,7 kΩ si el paquete de la sonda no la incluye. Prioriza las páginas de producto de Adafruit; los enlaces /dp/ de Amazon son alternativas opcionales.",
      },
      {
        name: "Conecta el DS18B20",
        text: "Conecta VCC a 3,3 V, GND a GND y datos a GPIO 4, con una pull-up de 4,7 kΩ entre datos y 3,3 V. Sujeta la punta de acero inoxidable a la tubería más fría o a la pared norte.",
      },
      {
        name: "Crea un dispositivo push",
        text: "Crea una cuenta gratuita de ProbeHarbor y un dispositivo push en Dashboard → Devices, y copia su clave de dispositivo.",
      },
      {
        name: "Instala desde el navegador y verifica",
        text: "Conecta el ESP32 por USB, abre el flasheador web en Chrome o Edge, instala el firmware y envía tu Wi-Fi y tu clave de dispositivo. La página confirma cuando llega la primera lectura. No necesitas el Arduino IDE.",
      },
      {
        name: "Activa las alertas de congelación",
        text: "Define el umbral de congelación y el correo en Alerts → When to alert, envía una alerta de prueba y, si quieres, activa el aviso de tiempo hasta la congelación.",
      },
    ],
  },
  introHtml:
    'ProbeHarbor no vende hardware. Compra las piezas de abajo y luego instala el firmware desde tu navegador con el <a class="text-link" href="/flash">flasheador web</a>: sin Arduino IDE, sin código, y envía a la placa tu Wi‑Fi y tu clave de dispositivo por el mismo cable USB. Si prefieres leer o editar el código, los sketches de <a class="text-link" href="https://github.com/doodersrage/probeharbor/tree/main/sketches/arduino/ds18b20_ingest" target="_blank" rel="noreferrer">ds18b20_ingest</a> esperan un <strong>ESP32 con Wi‑Fi</strong> y un <strong>DS18B20 impermeable</strong>. Compra las piezas de abajo (Adafruit para SKU conocidos, enlaces de producto de Amazon si quieres un DevKit más barato) y, en su lugar, crea un dispositivo push y flashea un sketch ya rellenado desde <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a>.',
  bom: {
    title: "Lista de materiales recomendada",
    caption: "Piezas para una sonda de congelación ESP32",
    colPart: "Pieza",
    colWhy: "Por qué",
    colBuy: "Comprar",
    boardPart: "Placa ESP32",
    boardWhy: "Ingesta push por HTTPS sobre Wi‑Fi (TLS integrado en el chip)",
    amazonDevKit: "DevKit en Amazon",
    probePart: "DS18B20 impermeable",
    probeWhy: "Sonda para tuberías o sótano ventilado; funciona bajo cero",
    includesPullupHtml: "(incluye 4,7&nbsp;kΩ)",
    amazonProbe: "Sonda en Amazon",
    pullupPartHtml: "Pull-up de 4,7&nbsp;kΩ",
    pullupWhy: "Obligatoria en la línea de datos 1-Wire si el paquete de la sonda no la incluye",
    amazonResistor: "4,7k en Amazon",
    powerPart: "Alimentación USB",
    powerWhy: "Cargador de pared o cable USB-C; cuando puedas, deja la placa en un lugar más cálido que el de la sonda",
    powerBuyHtml: "Cualquier fuente USB de 5&nbsp;V de ≥500&nbsp;mA",
  },
  bomNoteHtml:
    "Los anuncios de productos cambian: toma Adafruit como lista de referencia. Los enlaces <code>/dp/</code> de Amazon en <code>bomLinks</code> son alternativas compatibles con Associates mientras el anuncio siga activo. Los paquetes genéricos “kit ESP32 + DS18B20” suelen traer un DHT11 en lugar de una sonda impermeable: evítalos.",
  wire: {
    title: "Conéctalo",
    diagramAlt: "Diagrama de cableado: ESP32 DevKit a un DS18B20 impermeable con pull-up de 4,7 kiloohmios en GPIO 4",
    captionHtml:
      "Rojo → 3,3&nbsp;V, negro → GND, datos amarillo/blanco → GPIO 4, con una pull-up de 4,7&nbsp;kΩ entre datos y 3,3&nbsp;V. El sketch de ingesta de ejemplo usa GPIO 4 por defecto.",
    itemsHtml: [
      "<strong>Rojo</strong> (VCC) → ESP32 3,3&nbsp;V",
      "<strong>Negro</strong> (GND) → GND",
      "<strong>Amarillo / blanco</strong> (datos) → GPIO 4 (valor por defecto del sketch de ejemplo; sirve cualquier GPIO digital libre si cambias el pin)",
      "4,7&nbsp;kΩ entre datos y 3,3&nbsp;V",
    ],
    featherHtml:
      'En una Adafruit Feather (HUZZAH32 o ESP32 Feather V2), GPIO 4 es el pin marcado como <strong>A5</strong>. Consulta las <a class="text-link" href="/flash#feather-pins">notas sobre Feather en la página del flasheador</a> para los detalles adicionales.',
    strap:
      "Sujeta la sonda de acero inoxidable a la tubería más fría o a la pared norte con una brida y envuelve la sonda y un tramo corto de tubería con aislante de espuma, para medir la temperatura de la tubería y no la del aire de la habitación.",
  },
  flash: {
    title: "Flashea y conecta",
    stepsHtml: [
      '<a class="text-link" href="/register?next=/dashboard/devices">Crea una cuenta gratuita</a> y un dispositivo push en Devices.',
      'Abre el <a class="text-link" href="/flash">flasheador web</a> en Chrome o Edge, conecta el ESP32, haz clic en Install y envía tu Wi‑Fi y tu clave de dispositivo. Muestra "First reading delivered" cuando la sonda ya está activa.',
      '¿Prefieres código? Descarga el <code>.ino</code> de Arduino o el <code>.py</code> de MicroPython ya rellenados desde Devices y flashéalos según las <a class="text-link" href="/about/esp32-web-flash">opciones de flasheo del ESP32</a> (el monitor serie a 115200 debería mostrar <code>POST 200</code>).',
      'Opcional: imprime el <a class="text-link" href="/about/kit-qr-onboarding">QR del kit</a> de ingesta en la caja.',
      'Define el umbral de congelación y el correo en <a class="text-link" href="/dashboard/alerts?tab=settings#alert-section-essentials">Alerts → When to alert</a> y activa el aviso de tiempo hasta la congelación si quieres saberlo antes de que la sonda llegue al punto de congelación.',
    ],
  },
  avoid: {
    title: "Qué no comprar para la congelación de tuberías",
    itemsHtml: [
      "<strong>Kits de inicio solo con DHT11</strong>: rinden mal bajo cero, cables cortos y no son impermeables.",
      "<strong>Sensores de ambiente Bluetooth / Zigbee</strong>: no hablan la ingesta push de ProbeHarbor.",
      "<strong>Uno + Ethernet a secas</strong>: necesita un relé HTTPS en la LAN; bien para montajes avanzados, no para el primer kit.",
    ],
    dhtNoteHtml: `El DHT22 sigue sirviendo para el aire y la humedad del taller (tu caso de garaje con Ethernet). Para tuberías, mejor DS18B20. Cable de PTFE para alta temperatura: {highTempLink} si la sonda está cerca de un calentador de agua o de un cable calefactor.`,
  },
  extras: {
    title: "Extras opcionales",
    itemsHtml: [
      "Un segundo DS18B20 en el mismo bus 1-Wire para comparar la zona de la puerta con la pared de la tubería (multizona).",
      "Caja de ABS ventilada + prensaestopas para el ESP32 en un garaje con polvo.",
      "Los kits de inicio ELEGOO o ESP32 genéricos sirven <em>si</em> añades igualmente un DS18B20 impermeable: el DHT11 que traen no es la sonda de congelación.",
    ],
  },
  related: {
    title: "Relacionado",
    labels: [
      "Añadir dispositivos push y pull",
      "Opciones de flasheo del ESP32",
      "Ingesta con Raspberry Pi Pico W",
      "Alta con el QR del kit",
      "Kit de montaje de sondas",
      "Accesorios de hardware",
      "Montaje de sondas y cajas",
      "Lista de control para la temporada de heladas",
    ],
  },
};

export default es;
