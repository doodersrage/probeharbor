
/**
 * /about/adding-devices body copy. `*Html` keys are trusted inline HTML;
 * hrefs stay English (middleware localizes them). Dashboard UI labels
 * (Devices, Create push device, Reveal ingest key…) stay English because the
 * dashboard is English-only.
 */

const GH = "https://github.com/doodersrage/probeharbor";
const DEV = "https://probeharbor.dev/developers";
const relay = `<a class="text-link" href="${GH}/blob/main/sketches/relay/push_https_forward.py" target="_blank" rel="noreferrer">`;
const downloads =
  "<strong>Download Arduino .ino</strong> / <strong>MicroPython .py</strong> / <strong>CircuitPython code.py</strong> / <strong>Zephyr main.c</strong> / <strong>CH32V main.c</strong> / <strong>AVR main.S</strong> / <strong>Teensy 4.1 .ino</strong> / <strong>PIC18 main.c</strong> / <strong>Particle Boron .ino</strong> / <strong>ESPHome snippet</strong>";
const curlBlock = '<a class="text-link" href="/api/feeds/example?format=ingest">';
import type { AddingDevicesMessages } from "./en";

const es: AddingDevicesMessages = {
  introHtml: [
    'ProbeHarbor acepta lecturas de dos formas: tu hardware <strong>envía</strong> (push) JSON a una URL de ingesta, o nosotros <strong>extraemos</strong> (pull) JSON por HTTPS de un feed público de forma programada. Ambas se configuran en <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a>. Los nodos ESP o a batería nuevos deberían usar push. Pull es para servidores LAN siempre encendidos o relés que ya exponen JSON por HTTPS.',
    'Una cuenta gratuita (sin tarjeta) vincula tu clave de ingesta a tu hogar, para que el historial y las alertas sigan siendo privados. Si quieres ver lecturas sin registrarte, echa antes un vistazo a la <a class="text-link" href="/demo">demo en vivo</a>.',
  ],
  choose: {
    title: "Elige push o pull",
    colPush: "Ingesta push",
    colPull: "Feed pull",
    rowsHtml: [
      ["Quién inicia", "Tu dispositivo", "ProbeHarbor"],
      ["Red", "El dispositivo necesita HTTPS saliente (Uno Ethernet: HTTP hacia un relé TLS en la LAN)", "La URL del feed debe ser accesible públicamente"],
      ["Autenticación", "Clave por dispositivo en la URL; aviso de flasheo + Reveal ingest key", "URL HTTPS pública (TLS)"],
      [
        "Forma del JSON",
        "Claves planas, objeto <code>temp</code>, <code>sensors[]</code>, SenML o HA REST",
        "Raíz <code>temp</code> anidada (por defecto); SenML o HA REST detectados automáticamente",
      ],
      [
        "Ideal para",
        "ESP32, Pico W, STM32 Nucleo (Ethernet + relé HTTPS en la LAN), Arduino Uno + Ethernet",
        "Servidores Ethernet, relés FastAPI",
      ],
    ],
  },
  push: {
    title: "Dispositivo push (recomendado)",
    stepsHtml: [
      'Inicia sesión y abre <a class="text-link" href="/dashboard/devices">Devices</a>.',
      "En <strong>Push devices</strong>, haz clic en <strong>Create push device</strong> (se llama Workshop probe por defecto; puedes cambiarle el nombre cuando quieras).",
      `En el aviso de ingesta: escanea el QR o usa ${downloads} (con la URL o la ruta de ingesta ya rellenada). La clave permanece en la página 30 minutos y sobrevive a una recarga hasta que la cierres.`,
      "<strong>¿Perdiste la clave más tarde?</strong> En la tarjeta del dispositivo usa <strong>Reveal ingest key</strong> (si la recuperación de claves está activada en el servidor) o <strong>Rotate key</strong> para emitir una nueva. Los dispositivos creados antes de activar la recuperación de claves necesitan una rotación para guardar una copia cifrada recuperable.",
      'Flashea un ESP32 (consulta las <a class="text-link" href="/about/esp32-web-flash">opciones de flasheo</a>: Arduino IDE, PlatformIO, MicroPython o el esptool web de Espressif), una Pico W (<a class="text-link" href="/about/pico-w-ingest">CircuitPython / MicroPython / Arduino-Pico</a>), una STM32 Nucleo (<a class="text-link" href="/about/stm32-zephyr-ingest">Zephyr C + Ethernet</a>), una CH32V307 (<a class="text-link" href="/about/ch32v-riscv-ingest">WCHNET C + Ethernet</a>), un Uno en ensamblador GNU AVR (<a class="text-link" href="/about/avr-asm-ingest">ATmega328P + W5100</a>), una Teensy 4.1 (<a class="text-link" href="/about/teensy41-ingest">QNEthernet</a>), un PIC18F67J60 (<a class="text-link" href="/about/pic18-ethernet-ingest">MLA TCP/IP</a>) o una Particle Boron (<a class="text-link" href="/about/cellular-ingest">webhook LTE</a>). ¿Primero necesitas las piezas? <a class="text-link" href="/about/esp32-freeze-kit">Lista de materiales del kit ESP32 de congelación</a>, <a class="text-link" href="/about/pico-w-ingest">Pico W</a>, <a class="text-link" href="/about/stm32-zephyr-ingest">STM32 Zephyr</a>, <a class="text-link" href="/about/ch32v-riscv-ingest">CH32V RISC-V</a>, <a class="text-link" href="/about/avr-asm-ingest">ensamblador AVR</a>, <a class="text-link" href="/about/teensy41-ingest">Teensy 4.1</a>, <a class="text-link" href="/about/pic18-ethernet-ingest">PIC18 Ethernet</a> o <a class="text-link" href="/about/cellular-ingest">celular</a> (DS18B20 impermeable). El monitor serie a <strong>115200</strong> debería mostrar <code>POST 200</code> (o <code>publish ok</code> en Boron). Las claves de los sensores se importan automáticamente (claves planas, objeto <code>temp</code>, SenML o Home Assistant REST). Después puedes renombrar los sensores en la página Devices. La asignación manual en <strong>Advanced</strong> es opcional, para asignar claves de antemano.',
      `Más ejemplos (Uno Ethernet + DHT22, MAX31855, MAX6675, etc.): <a class="text-link" href="${GH}/tree/main/sketches" target="_blank" rel="noreferrer">sketches/</a>. El W5100 no puede hacer TLS: envía un POST HTTP a un relé en la LAN (<a class="text-link" href="/about/python-feeds">feeds en Python</a> / ${relay}<code>push_https_forward.py</code></a>).`,
      'Haz una prueba rápida con curl y abre <a class="text-link" href="/dashboard/live">Live</a> con la sesión iniciada. Si pasan unos 30 minutos sin envíos, Live avisa de que una sonda puede estar desconectada.',
    ],
  },
  curl: {
    title: "Ejemplo con curl (push)",
    introHtml: `Obtén un cuerpo de ejemplo en vivo del ${curlBlock}feed de ingesta de ejemplo</a> (basado en el clima) y envíalo con POST a tu clave de dispositivo.`,
    payloadsHtml: `Formatos de payload: claves planas, el objeto clásico <code>temp</code>, <code>sensors[]</code> con tipo, <strong>SenML (RFC 8428)</strong> o JSON <code>state</code> de <strong>Home Assistant REST</strong>. Están documentados en <a class="text-link" href="/about/ingest-and-webhooks">ingesta y webhooks</a> y en la referencia para desarrolladores de <a class="text-link" href="${DEV}/ingest/">ingesta push</a>. Prueba ejemplos en vivo: ${curlBlock}nativo</a>, <a class="text-link" href="/api/feeds/example?format=senml">SenML</a>, <a class="text-link" href="/api/feeds/example?format=homeassistant">HA REST</a>.`,
  },
  pull: {
    title: "Feed pull",
    step1Html: "Comprueba que tu feed devuelve JSON por HTTPS. Forma clásica (clave raíz por defecto <code>temp</code>):",
    stepsHtml: [
      'Abre <a class="text-link" href="/dashboard/devices?tab=pull">Devices → Pull feeds</a>.',
      "Añade un feed: nombre, URL HTTPS y <strong>JSON root key</strong> (por defecto <code>temp</code>). Usa <strong>Test feed URL</strong> antes de guardar.",
      "Haz clic en <strong>Save pull setup</strong>: las claves de las sondas se importan automáticamente del feed en vivo. Renombra las etiquetas en la misma página o haz clic en <strong>Accept suggested names</strong>.",
      'Haz clic en <strong>Fetch now</strong> para obtener lecturas al instante, o espera al siguiente sondeo programado y confirma las tarjetas en <a class="text-link" href="/dashboard/live">Live</a>.',
    ],
    noteHtml: `Por defecto, los feeds pull esperan objetos de sonda anidados bajo la raíz configurada (no claves planas al estilo push). Los <strong>arrays JSON SenML</strong> y las respuestas de <strong>Home Assistant REST</strong> se detectan automáticamente cuando falta esa raíz: pega la URL tal cual y asigna las claves de sonda que exponen SenML o HA (p. ej. <code>0</code>, <code>state</code>). Si el microcontrolador no puede hacer TLS (Uno + shield Ethernet W5100), usa un relé HTTPS local (consulta <a class="text-link" href="/about/python-feeds">feeds en Python</a> o el ${relay}reenviador HTTP→HTTPS</a> con la biblioteca estándar para la ingesta push).`,
  },
  mqtt: {
    title: "¿Ya usas MQTT?",
    bodyHtml:
      'Mantén Mosquitto o el MQTT de Home Assistant en tu LAN y replica las lecturas por HTTPS. ProbeHarbor no es un broker MQTT. Receta completa (curl, <code>rest_command</code> de HA, Node-RED): <a class="text-link" href="/about/mqtt-bridge">guía del puente MQTT</a>. Consulta también <a class="text-link" href="/compare/diy-mqtt">ProbeHarbor frente a MQTT casero</a>.',
  },
  verify: {
    title: "Comprueba que ya estás en línea",
    itemsHtml: [
      '<strong><a class="text-link" href="/dashboard/live">Live</a></strong>: las tarjetas se actualizan en vivo; las sondas rezagadas muestran un aviso amarillo de desconexión tras unos 30 minutos.',
      "<strong>Devices → Status</strong>: última conexión, batería y RSSI cuando el payload los incluye (tras la primera lectura en vivo).",
      "<strong>Lo esencial contra heladas</strong>: define el umbral de congelación y el correo en Devices tras el primer POST, o en Alerts → When to alert, y envía una prueba (desbloquea el Overview completo tras la configuración inicial).",
      "<strong>Overview</strong>: estado del espacio; tras lo esencial, las métricas de Status (horas bajo cero, margen más frío, ΔT interior−exterior, dispersión entre sondas) e <strong>Insights</strong> (noches de riesgo, puerta/corriente/movimiento, calidad del aire). Los gráficos semanales pueden superponer humedad y punto de rocío cuando hay HR.",
    ],
  },
  related: {
    title: "Relacionado",
    itemsHtml: [
      '<a class="text-link" href="/about/ingest-and-webhooks">API de ingesta y webhooks de alertas</a>',
      '<a class="text-link" href="/about/kit-qr-onboarding">Alta con el QR del kit</a>',
      '<a class="text-link" href="/about/configuring-temperature-feeds">Configurar feeds de temperatura</a> (a fondo sobre pull)',
      '<a class="text-link" href="/about/debugging-stale-readings">Depurar lecturas desactualizadas</a>',
      `<a class="text-link" href="/about/mqtt-bridge">Receta del puente MQTT</a> · <a class="text-link" href="/compare/diy-mqtt">frente a MQTT casero</a> · <a class="text-link" href="${DEV}/integrations/mqtt-bridge">documentación MQTT para desarrolladores</a>`,
      `<a class="text-link" href="${DEV}/ingest/">Desarrolladores: ingesta push</a> · <a class="text-link" href="${DEV}/ingest/pull-feeds">feeds pull</a>`,
    ],
  },
};

export default es;
