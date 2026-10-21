import { defineMessages } from "../../translate";

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

const en = {
  introHtml: [
    'ProbeHarbor accepts readings two ways: your hardware <strong>pushes</strong> JSON to an ingest URL, or we <strong>pull</strong> HTTPS JSON from a public feed on a schedule. Both are configured under <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a>. New ESP / battery nodes should use push. Pull is for always-on LAN servers or relays that already expose HTTPS JSON.',
    'A free account (no credit card) ties your ingest key to your household so history and alerts stay private. Browse the <a class="text-link" href="/demo">live demo</a> first if you want to see readings without signing up.',
  ],
  choose: {
    title: "Choose push or pull",
    colPush: "Push ingest",
    colPull: "Pull feed",
    rowsHtml: [
      ["Who initiates", "Your device", "ProbeHarbor"],
      ["Network", "Device needs outbound HTTPS (Uno Ethernet: HTTP to a LAN TLS relay)", "Feed URL must be publicly reachable"],
      ["Auth", "Per-device key in URL; flash callout + Reveal ingest key", "Public HTTPS URL (TLS)"],
      [
        "JSON shape",
        "Flat keys, <code>temp</code> object, <code>sensors[]</code>, SenML, or HA REST",
        "Nested <code>temp</code> root (default); SenML or HA REST auto-detected",
      ],
      [
        "Best for",
        "ESP32, Pico W, STM32 Nucleo (Ethernet + LAN HTTPS relay), Arduino Uno + Ethernet",
        "Ethernet servers, FastAPI relays",
      ],
    ] as [string, string, string][],
  },
  push: {
    title: "Push device (recommended)",
    stepsHtml: [
      'Sign in and open <a class="text-link" href="/dashboard/devices">Devices</a>.',
      "Under <strong>Push devices</strong>, click <strong>Create push device</strong> (named Workshop probe by default: rename anytime).",
      `On the ingest callout: scan the QR, or use ${downloads} (ingest URL or path pre-filled). The key stays on the page for 30 minutes and survives refresh until you dismiss it.`,
      "<strong>Lost the key later?</strong> On the device card use <strong>Reveal ingest key</strong> (when key recovery is enabled on the server) or <strong>Rotate key</strong> to issue a new one. Devices created before key recovery was enabled need one rotate to store a recoverable encrypted copy.",
      'Flash an ESP32 (see <a class="text-link" href="/about/esp32-web-flash">flashing options</a>: Arduino IDE, PlatformIO, MicroPython, or Espressif web esptool) or a Pico W ( <a class="text-link" href="/about/pico-w-ingest">CircuitPython / MicroPython / Arduino-Pico</a>) or an STM32 Nucleo ( <a class="text-link" href="/about/stm32-zephyr-ingest">Zephyr C + Ethernet</a>) or a CH32V307 ( <a class="text-link" href="/about/ch32v-riscv-ingest">WCHNET C + Ethernet</a>) or an Uno in GNU AVR assembly ( <a class="text-link" href="/about/avr-asm-ingest">ATmega328P + W5100</a>) or a Teensy 4.1 ( <a class="text-link" href="/about/teensy41-ingest">QNEthernet</a>) or a PIC18F67J60 ( <a class="text-link" href="/about/pic18-ethernet-ingest">MLA TCP/IP</a>) or a Particle Boron ( <a class="text-link" href="/about/cellular-ingest">LTE webhook</a>). Need parts first? <a class="text-link" href="/about/esp32-freeze-kit">ESP32 freeze kit BOM</a>, <a class="text-link" href="/about/pico-w-ingest">Pico W</a>, <a class="text-link" href="/about/stm32-zephyr-ingest">STM32 Zephyr</a>, <a class="text-link" href="/about/ch32v-riscv-ingest">CH32V RISC-V</a>, <a class="text-link" href="/about/avr-asm-ingest">AVR assembly</a>, <a class="text-link" href="/about/teensy41-ingest">Teensy 4.1</a>, <a class="text-link" href="/about/pic18-ethernet-ingest">PIC18 Ethernet</a>, or <a class="text-link" href="/about/cellular-ingest">cellular</a> (waterproof DS18B20). Serial at <strong>115200</strong> should show <code>POST 200</code> (or <code>publish ok</code> on Boron). Sensor keys import automatically (flat keys, <code>temp</code> object, SenML, or Home Assistant REST). Rename sensors on the Devices page afterward. Manual mapping under <strong>Advanced</strong> is optional for pre-mapping keys.',
      `More samples (Uno Ethernet + DHT22, MAX31855, MAX6675, etc.): <a class="text-link" href="${GH}/tree/main/sketches" target="_blank" rel="noreferrer">sketches/</a>. W5100 cannot TLS. POST HTTP to a LAN relay (<a class="text-link" href="/about/python-feeds">Python feeds</a> / ${relay}<code>push_https_forward.py</code></a>).`,
      'Smoke-test with curl, then open <a class="text-link" href="/dashboard/live">Live</a> while signed in. Within about 30 minutes without a post, Live warns that a probe may be offline.',
    ],
  },
  curl: {
    title: "Example curl (push)",
    introHtml: `Fetch a live sample body from the ${curlBlock}example ingest feed</a> (weather-driven), then POST it to your device key.`,
    payloadsHtml: `Payload styles: flat keys, classic <code>temp</code> object, typed <code>sensors[]</code>, <strong>SenML (RFC 8428)</strong>, or <strong>Home Assistant REST</strong> <code>state</code> JSON: are documented in <a class="text-link" href="/about/ingest-and-webhooks">ingest &amp; webhooks</a> and the developer <a class="text-link" href="${DEV}/ingest/">push ingest</a> reference. Try live samples: ${curlBlock}native</a>, <a class="text-link" href="/api/feeds/example?format=senml">SenML</a>, <a class="text-link" href="/api/feeds/example?format=homeassistant">HA REST</a>.`,
  },
  pull: {
    title: "Pull feed",
    step1Html: "Confirm your feed returns HTTPS JSON. Classic shape (default root key <code>temp</code>):",
    stepsHtml: [
      'Open <a class="text-link" href="/dashboard/devices?tab=pull">Devices → Pull feeds</a>.',
      "Add a feed: name, HTTPS URL, and <strong>JSON root key</strong> (default <code>temp</code>). Use <strong>Test feed URL</strong> before saving.",
      "Click <strong>Save pull setup</strong>: probe keys auto-import from the live feed. Rename labels on the same page, or click <strong>Accept suggested names</strong>.",
      'Click <strong>Fetch now</strong> to pull readings immediately, or wait for the next scheduled poll and confirm cards on <a class="text-link" href="/dashboard/live">Live</a>.',
    ],
    noteHtml: `Pull feeds expect nested probe objects under the configured root by default (not flat push-style keys). <strong>SenML JSON arrays</strong> and <strong>Home Assistant REST</strong> responses are auto-detected when that root is missing: paste the URL as-is and map the probe keys SenML or HA expose (e.g. <code>0</code>, <code>state</code>). If the MCU cannot do TLS (Uno + W5100 Ethernet shield), use a local HTTPS relay (see <a class="text-link" href="/about/python-feeds">Python feeds</a> or the stdlib ${relay}HTTP→HTTPS forwarder</a> for push ingest).`,
  },
  mqtt: {
    title: "Already on MQTT?",
    bodyHtml:
      'Keep Mosquitto or Home Assistant MQTT on your LAN and mirror readings over HTTPS.    ProbeHarbor is not an MQTT broker. Full recipe (curl, HA <code>rest_command</code>, Node-RED): <a class="text-link" href="/about/mqtt-bridge">MQTT bridge guide</a>. See also <a class="text-link" href="/compare/diy-mqtt">ProbeHarbor vs DIY MQTT</a>.',
  },
  verify: {
    title: "Verify you’re live",
    itemsHtml: [
      '<strong><a class="text-link" href="/dashboard/live">Live</a></strong>: live cards update; lagging probes show a yellow offline warning after ~30 minutes.',
      "<strong>Devices → Status</strong>: last seen, battery, and RSSI when the payload includes them (after first live reading).",
      "<strong>Freeze essentials</strong>: set freeze °F + email on Devices after first POST, or under Alerts → When to alert, then send a test (unlocks full Overview after first-run).",
      "<strong>Overview</strong>: space status; after essentials, Status metrics (freeze hours, coldest margin, indoor−outdoor ΔT, probe spread) and <strong>Insights</strong> (nights-at-risk, door/power/motion, air quality). Week charts can overlay humidity and dew point when RH is present.",
    ],
  },
  related: {
    title: "Related",
    itemsHtml: [
      '<a class="text-link" href="/about/ingest-and-webhooks">Ingest API and alert webhooks</a>',
      '<a class="text-link" href="/about/kit-qr-onboarding">Kit QR onboarding</a>',
      '<a class="text-link" href="/about/configuring-temperature-feeds">Configuring temperature feeds</a> (pull deep-dive)',
      '<a class="text-link" href="/about/debugging-stale-readings">Debugging stale readings</a>',
      `<a class="text-link" href="/about/mqtt-bridge">MQTT bridge recipe</a> · <a class="text-link" href="/compare/diy-mqtt">vs DIY MQTT</a> · <a class="text-link" href="${DEV}/integrations/mqtt-bridge">developer MQTT docs</a>`,
      `<a class="text-link" href="${DEV}/ingest/">Developer: push ingest</a> · <a class="text-link" href="${DEV}/ingest/pull-feeds">pull feeds</a>`,
    ],
  },
};
type AddingDevicesMessages = typeof en;

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

const fr: AddingDevicesMessages = {
  introHtml: [
    'ProbeHarbor reçoit les mesures de deux façons : votre matériel <strong>envoie</strong> (push) du JSON vers une URL d’ingestion, ou nous <strong>récupérons</strong> (pull) du JSON en HTTPS depuis un flux public à intervalles réguliers. Les deux se configurent dans <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a>. Les nouveaux nœuds ESP ou sur batterie devraient utiliser le push. Le pull s’adresse aux serveurs LAN toujours allumés ou aux relais qui exposent déjà du JSON en HTTPS.',
    'Un compte gratuit (sans carte bancaire) associe votre clé d’ingestion à votre foyer, pour que l’historique et les alertes restent privés. Parcourez d’abord la <a class="text-link" href="/demo">démo en direct</a> si vous voulez voir des mesures sans vous inscrire.',
  ],
  choose: {
    title: "Choisir entre push et pull",
    colPush: "Ingestion push",
    colPull: "Flux pull",
    rowsHtml: [
      ["Qui initie", "Votre appareil", "ProbeHarbor"],
      ["Réseau", "L’appareil a besoin de HTTPS sortant (Uno Ethernet : HTTP vers un relais TLS sur le LAN)", "L’URL du flux doit être accessible publiquement"],
      ["Authentification", "Clé par appareil dans l’URL ; encadré de flashage + Reveal ingest key", "URL HTTPS publique (TLS)"],
      [
        "Forme du JSON",
        "Clés plates, objet <code>temp</code>, <code>sensors[]</code>, SenML ou HA REST",
        "Racine <code>temp</code> imbriquée (par défaut) ; SenML ou HA REST détectés automatiquement",
      ],
      [
        "Idéal pour",
        "ESP32, Pico W, STM32 Nucleo (Ethernet + relais HTTPS sur le LAN), Arduino Uno + Ethernet",
        "Serveurs Ethernet, relais FastAPI",
      ],
    ],
  },
  push: {
    title: "Appareil push (recommandé)",
    stepsHtml: [
      'Connectez-vous et ouvrez <a class="text-link" href="/dashboard/devices">Devices</a>.',
      "Sous <strong>Push devices</strong>, cliquez sur <strong>Create push device</strong> (nommé Workshop probe par défaut : renommable à tout moment).",
      `Dans l’encadré d’ingestion : scannez le QR, ou utilisez ${downloads} (URL ou chemin d’ingestion prérempli). La clé reste affichée 30 minutes et survit à un rechargement jusqu’à ce que vous la fermiez.`,
      "<strong>Clé perdue plus tard ?</strong> Sur la carte de l’appareil, utilisez <strong>Reveal ingest key</strong> (si la récupération des clés est activée sur le serveur) ou <strong>Rotate key</strong> pour en émettre une nouvelle. Les appareils créés avant l’activation de la récupération des clés doivent faire une rotation pour enregistrer une copie chiffrée récupérable.",
      'Flashez un ESP32 (voir les <a class="text-link" href="/about/esp32-web-flash">options de flashage</a> : Arduino IDE, PlatformIO, MicroPython ou l’esptool web d’Espressif), un Pico W (<a class="text-link" href="/about/pico-w-ingest">CircuitPython / MicroPython / Arduino-Pico</a>), une STM32 Nucleo (<a class="text-link" href="/about/stm32-zephyr-ingest">Zephyr C + Ethernet</a>), un CH32V307 (<a class="text-link" href="/about/ch32v-riscv-ingest">WCHNET C + Ethernet</a>), un Uno en assembleur GNU AVR (<a class="text-link" href="/about/avr-asm-ingest">ATmega328P + W5100</a>), une Teensy 4.1 (<a class="text-link" href="/about/teensy41-ingest">QNEthernet</a>), un PIC18F67J60 (<a class="text-link" href="/about/pic18-ethernet-ingest">MLA TCP/IP</a>) ou une Particle Boron (<a class="text-link" href="/about/cellular-ingest">webhook LTE</a>). Il vous faut d’abord les pièces ? <a class="text-link" href="/about/esp32-freeze-kit">Nomenclature du kit antigel ESP32</a>, <a class="text-link" href="/about/pico-w-ingest">Pico W</a>, <a class="text-link" href="/about/stm32-zephyr-ingest">STM32 Zephyr</a>, <a class="text-link" href="/about/ch32v-riscv-ingest">CH32V RISC-V</a>, <a class="text-link" href="/about/avr-asm-ingest">assembleur AVR</a>, <a class="text-link" href="/about/teensy41-ingest">Teensy 4.1</a>, <a class="text-link" href="/about/pic18-ethernet-ingest">PIC18 Ethernet</a> ou <a class="text-link" href="/about/cellular-ingest">cellulaire</a> (DS18B20 étanche). Le moniteur série à <strong>115200</strong> doit afficher <code>POST 200</code> (ou <code>publish ok</code> sur la Boron). Les clés des capteurs s’importent automatiquement (clés plates, objet <code>temp</code>, SenML ou Home Assistant REST). Renommez ensuite les capteurs sur la page Devices. Le mappage manuel sous <strong>Advanced</strong> est facultatif, pour mapper les clés à l’avance.',
      `D’autres exemples (Uno Ethernet + DHT22, MAX31855, MAX6675, etc.) : <a class="text-link" href="${GH}/tree/main/sketches" target="_blank" rel="noreferrer">sketches/</a>. Le W5100 ne gère pas le TLS : envoyez un POST HTTP vers un relais sur le LAN (<a class="text-link" href="/about/python-feeds">flux Python</a> / ${relay}<code>push_https_forward.py</code></a>).`,
      'Faites un test rapide avec curl, puis ouvrez <a class="text-link" href="/dashboard/live">Live</a> en étant connecté. Après environ 30 minutes sans envoi, Live signale qu’une sonde est peut-être hors ligne.',
    ],
  },
  curl: {
    title: "Exemple curl (push)",
    introHtml: `Récupérez un corps d’exemple en direct depuis le ${curlBlock}flux d’ingestion d’exemple</a> (basé sur la météo), puis envoyez-le en POST à votre clé d’appareil.`,
    payloadsHtml: `Formats de charge utile : clés plates, objet <code>temp</code> classique, <code>sensors[]</code> typé, <strong>SenML (RFC 8428)</strong> ou JSON <code>state</code> <strong>Home Assistant REST</strong>. Ils sont documentés dans <a class="text-link" href="/about/ingest-and-webhooks">ingestion et webhooks</a> et dans la référence développeur <a class="text-link" href="${DEV}/ingest/">ingestion push</a>. Essayez des exemples en direct : ${curlBlock}natif</a>, <a class="text-link" href="/api/feeds/example?format=senml">SenML</a>, <a class="text-link" href="/api/feeds/example?format=homeassistant">HA REST</a>.`,
  },
  pull: {
    title: "Flux pull",
    step1Html: "Vérifiez que votre flux renvoie du JSON en HTTPS. Forme classique (clé racine par défaut <code>temp</code>) :",
    stepsHtml: [
      'Ouvrez <a class="text-link" href="/dashboard/devices?tab=pull">Devices → Pull feeds</a>.',
      "Ajoutez un flux : nom, URL HTTPS et <strong>JSON root key</strong> (par défaut <code>temp</code>). Utilisez <strong>Test feed URL</strong> avant d’enregistrer.",
      "Cliquez sur <strong>Save pull setup</strong> : les clés des sondes s’importent automatiquement depuis le flux en direct. Renommez les libellés sur la même page, ou cliquez sur <strong>Accept suggested names</strong>.",
      'Cliquez sur <strong>Fetch now</strong> pour récupérer les mesures tout de suite, ou attendez la prochaine interrogation planifiée et vérifiez les cartes sur <a class="text-link" href="/dashboard/live">Live</a>.',
    ],
    noteHtml: `Par défaut, les flux pull attendent des objets de sonde imbriqués sous la racine configurée (pas des clés plates façon push). Les <strong>tableaux JSON SenML</strong> et les réponses <strong>Home Assistant REST</strong> sont détectés automatiquement quand cette racine est absente : collez l’URL telle quelle et mappez les clés de sonde exposées par SenML ou HA (par ex. <code>0</code>, <code>state</code>). Si le microcontrôleur ne gère pas le TLS (Uno + shield Ethernet W5100), utilisez un relais HTTPS local (voir <a class="text-link" href="/about/python-feeds">flux Python</a> ou le ${relay}redirecteur HTTP→HTTPS</a> en bibliothèque standard pour l’ingestion push).`,
  },
  mqtt: {
    title: "Déjà sur MQTT ?",
    bodyHtml:
      'Gardez Mosquitto ou le MQTT de Home Assistant sur votre LAN et répliquez les mesures en HTTPS. ProbeHarbor n’est pas un broker MQTT. Recette complète (curl, <code>rest_command</code> de HA, Node-RED) : <a class="text-link" href="/about/mqtt-bridge">guide du pont MQTT</a>. Voir aussi <a class="text-link" href="/compare/diy-mqtt">ProbeHarbor face au MQTT fait maison</a>.',
  },
  verify: {
    title: "Vérifier que tout fonctionne",
    itemsHtml: [
      '<strong><a class="text-link" href="/dashboard/live">Live</a></strong> : les cartes se mettent à jour en direct ; les sondes en retard affichent un avertissement jaune « hors ligne » au bout d’environ 30 minutes.',
      "<strong>Devices → Status</strong> : dernière connexion, batterie et RSSI quand la charge utile les contient (après la première mesure en direct).",
      "<strong>L’essentiel antigel</strong> : réglez le seuil de gel et l’e-mail dans Devices après le premier POST, ou dans Alerts → When to alert, puis envoyez un test (débloque l’Overview complet après la première configuration).",
      "<strong>Overview</strong> : état de l’espace ; après l’essentiel, les indicateurs Status (heures de gel, marge la plus froide, ΔT intérieur−extérieur, écart entre sondes) et <strong>Insights</strong> (nuits à risque, porte/alimentation/mouvement, qualité de l’air). Les graphiques hebdomadaires peuvent superposer l’humidité et le point de rosée quand l’HR est disponible.",
    ],
  },
  related: {
    title: "À lire aussi",
    itemsHtml: [
      '<a class="text-link" href="/about/ingest-and-webhooks">API d’ingestion et webhooks d’alerte</a>',
      '<a class="text-link" href="/about/kit-qr-onboarding">Mise en service par QR du kit</a>',
      '<a class="text-link" href="/about/configuring-temperature-feeds">Configurer les flux de température</a> (le pull en détail)',
      '<a class="text-link" href="/about/debugging-stale-readings">Diagnostiquer des mesures figées</a>',
      `<a class="text-link" href="/about/mqtt-bridge">Recette du pont MQTT</a> · <a class="text-link" href="/compare/diy-mqtt">face au MQTT fait maison</a> · <a class="text-link" href="${DEV}/integrations/mqtt-bridge">docs MQTT développeur</a>`,
      `<a class="text-link" href="${DEV}/ingest/">Développeurs : ingestion push</a> · <a class="text-link" href="${DEV}/ingest/pull-feeds">flux pull</a>`,
    ],
  },
};

const de: AddingDevicesMessages = {
  introHtml: [
    'ProbeHarbor nimmt Messwerte auf zwei Wegen an: Deine Hardware <strong>sendet</strong> (Push) JSON an eine Ingest-URL, oder wir <strong>holen</strong> (Pull) HTTPS-JSON nach Zeitplan von einem öffentlichen Feed ab. Beides richtest du unter <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> ein. Neue ESP- oder Akku-Knoten sollten Push nutzen. Pull ist für dauerhaft laufende LAN-Server oder Relays gedacht, die bereits HTTPS-JSON bereitstellen.',
    'Ein kostenloses Konto (ohne Kreditkarte) verknüpft deinen Ingest-Schlüssel mit deinem Haushalt, damit Verlauf und Alarme privat bleiben. Wenn du Messwerte ohne Anmeldung sehen willst, schau dir zuerst die <a class="text-link" href="/demo">Live-Demo</a> an.',
  ],
  choose: {
    title: "Push oder Pull wählen",
    colPush: "Push-Ingest",
    colPull: "Pull-Feed",
    rowsHtml: [
      ["Wer startet", "Dein Gerät", "ProbeHarbor"],
      ["Netzwerk", "Gerät braucht ausgehendes HTTPS (Uno Ethernet: HTTP an ein TLS-Relay im LAN)", "Feed-URL muss öffentlich erreichbar sein"],
      ["Authentifizierung", "Geräteschlüssel in der URL; Flash-Hinweis + Reveal ingest key", "Öffentliche HTTPS-URL (TLS)"],
      [
        "JSON-Format",
        "Flache Schlüssel, <code>temp</code>-Objekt, <code>sensors[]</code>, SenML oder HA REST",
        "Verschachtelter <code>temp</code>-Stamm (Standard); SenML oder HA REST werden automatisch erkannt",
      ],
      [
        "Ideal für",
        "ESP32, Pico W, STM32 Nucleo (Ethernet + HTTPS-Relay im LAN), Arduino Uno + Ethernet",
        "Ethernet-Server, FastAPI-Relays",
      ],
    ],
  },
  push: {
    title: "Push-Gerät (empfohlen)",
    stepsHtml: [
      'Melde dich an und öffne <a class="text-link" href="/dashboard/devices">Devices</a>.',
      "Klicke unter <strong>Push devices</strong> auf <strong>Create push device</strong> (standardmäßig „Workshop probe“ genannt, jederzeit umbenennbar).",
      `Im Ingest-Hinweis: Scanne den QR-Code oder nutze ${downloads} (Ingest-URL bzw. -Pfad vorausgefüllt). Der Schlüssel bleibt 30 Minuten auf der Seite und übersteht ein Neuladen, bis du ihn schließt.`,
      "<strong>Schlüssel später verloren?</strong> Nutze auf der Gerätekarte <strong>Reveal ingest key</strong> (wenn die Schlüsselwiederherstellung auf dem Server aktiviert ist) oder <strong>Rotate key</strong>, um einen neuen auszustellen. Geräte, die vor Aktivierung der Schlüsselwiederherstellung angelegt wurden, brauchen einmal eine Rotation, damit eine wiederherstellbare verschlüsselte Kopie gespeichert wird.",
      'Flashe einen ESP32 (siehe <a class="text-link" href="/about/esp32-web-flash">Flash-Optionen</a>: Arduino IDE, PlatformIO, MicroPython oder das Web-esptool von Espressif), einen Pico W (<a class="text-link" href="/about/pico-w-ingest">CircuitPython / MicroPython / Arduino-Pico</a>), ein STM32 Nucleo (<a class="text-link" href="/about/stm32-zephyr-ingest">Zephyr C + Ethernet</a>), einen CH32V307 (<a class="text-link" href="/about/ch32v-riscv-ingest">WCHNET C + Ethernet</a>), einen Uno in GNU-AVR-Assembler (<a class="text-link" href="/about/avr-asm-ingest">ATmega328P + W5100</a>), einen Teensy 4.1 (<a class="text-link" href="/about/teensy41-ingest">QNEthernet</a>), einen PIC18F67J60 (<a class="text-link" href="/about/pic18-ethernet-ingest">MLA TCP/IP</a>) oder ein Particle Boron (<a class="text-link" href="/about/cellular-ingest">LTE-Webhook</a>). Brauchst du erst die Teile? <a class="text-link" href="/about/esp32-freeze-kit">Stückliste für das ESP32-Frost-Kit</a>, <a class="text-link" href="/about/pico-w-ingest">Pico W</a>, <a class="text-link" href="/about/stm32-zephyr-ingest">STM32 Zephyr</a>, <a class="text-link" href="/about/ch32v-riscv-ingest">CH32V RISC-V</a>, <a class="text-link" href="/about/avr-asm-ingest">AVR-Assembler</a>, <a class="text-link" href="/about/teensy41-ingest">Teensy 4.1</a>, <a class="text-link" href="/about/pic18-ethernet-ingest">PIC18 Ethernet</a> oder <a class="text-link" href="/about/cellular-ingest">Mobilfunk</a> (wasserdichter DS18B20). Der serielle Monitor mit <strong>115200</strong> sollte <code>POST 200</code> zeigen (bzw. <code>publish ok</code> beim Boron). Sensorschlüssel werden automatisch importiert (flache Schlüssel, <code>temp</code>-Objekt, SenML oder Home Assistant REST). Benenne die Sensoren danach auf der Devices-Seite um. Die manuelle Zuordnung unter <strong>Advanced</strong> ist optional, um Schlüssel vorab zuzuordnen.',
      `Weitere Beispiele (Uno Ethernet + DHT22, MAX31855, MAX6675 usw.): <a class="text-link" href="${GH}/tree/main/sketches" target="_blank" rel="noreferrer">sketches/</a>. Der W5100 kann kein TLS. Sende per HTTP-POST an ein Relay im LAN (<a class="text-link" href="/about/python-feeds">Python-Feeds</a> / ${relay}<code>push_https_forward.py</code></a>).`,
      'Mach einen kurzen Test mit curl und öffne dann angemeldet <a class="text-link" href="/dashboard/live">Live</a>. Kommt etwa 30 Minuten lang kein Post, warnt Live, dass ein Fühler offline sein könnte.',
    ],
  },
  curl: {
    title: "curl-Beispiel (Push)",
    introHtml: `Hol dir einen aktuellen Beispiel-Body aus dem ${curlBlock}Beispiel-Ingest-Feed</a> (wetterbasiert) und sende ihn per POST an deinen Geräteschlüssel.`,
    payloadsHtml: `Payload-Formate: flache Schlüssel, klassisches <code>temp</code>-Objekt, typisiertes <code>sensors[]</code>, <strong>SenML (RFC 8428)</strong> oder <code>state</code>-JSON von <strong>Home Assistant REST</strong>. Dokumentiert sind sie unter <a class="text-link" href="/about/ingest-and-webhooks">Ingest &amp; Webhooks</a> und in der Entwicklerreferenz zu <a class="text-link" href="${DEV}/ingest/">Push-Ingest</a>. Probier Live-Beispiele aus: ${curlBlock}nativ</a>, <a class="text-link" href="/api/feeds/example?format=senml">SenML</a>, <a class="text-link" href="/api/feeds/example?format=homeassistant">HA REST</a>.`,
  },
  pull: {
    title: "Pull-Feed",
    step1Html: "Prüfe, dass dein Feed HTTPS-JSON liefert. Klassisches Format (Standard-Stammschlüssel <code>temp</code>):",
    stepsHtml: [
      'Öffne <a class="text-link" href="/dashboard/devices?tab=pull">Devices → Pull feeds</a>.',
      "Füge einen Feed hinzu: Name, HTTPS-URL und <strong>JSON root key</strong> (Standard <code>temp</code>). Nutze vor dem Speichern <strong>Test feed URL</strong>.",
      "Klicke auf <strong>Save pull setup</strong>: Die Fühlerschlüssel werden automatisch aus dem Live-Feed importiert. Benenne die Bezeichnungen auf derselben Seite um oder klicke auf <strong>Accept suggested names</strong>.",
      'Klicke auf <strong>Fetch now</strong>, um sofort Messwerte abzurufen, oder warte auf die nächste geplante Abfrage und prüfe die Karten unter <a class="text-link" href="/dashboard/live">Live</a>.',
    ],
    noteHtml: `Pull-Feeds erwarten standardmäßig verschachtelte Fühlerobjekte unter dem konfigurierten Stamm (keine flachen Schlüssel wie bei Push). <strong>SenML-JSON-Arrays</strong> und Antworten von <strong>Home Assistant REST</strong> werden automatisch erkannt, wenn dieser Stamm fehlt: Füge die URL unverändert ein und ordne die Fühlerschlüssel zu, die SenML oder HA liefern (z. B. <code>0</code>, <code>state</code>). Kann der Mikrocontroller kein TLS (Uno + W5100-Ethernet-Shield), nutze ein lokales HTTPS-Relay (siehe <a class="text-link" href="/about/python-feeds">Python-Feeds</a> oder den ${relay}HTTP→HTTPS-Forwarder</a> aus der Standardbibliothek für Push-Ingest).`,
  },
  mqtt: {
    title: "Schon auf MQTT?",
    bodyHtml:
      'Behalte Mosquitto oder Home-Assistant-MQTT in deinem LAN und spiegle die Messwerte per HTTPS. ProbeHarbor ist kein MQTT-Broker. Komplettes Rezept (curl, HA-<code>rest_command</code>, Node-RED): <a class="text-link" href="/about/mqtt-bridge">Anleitung zur MQTT-Bridge</a>. Siehe auch <a class="text-link" href="/compare/diy-mqtt">ProbeHarbor vs. Eigenbau-MQTT</a>.',
  },
  verify: {
    title: "Prüfen, ob alles läuft",
    itemsHtml: [
      '<strong><a class="text-link" href="/dashboard/live">Live</a></strong>: Die Karten aktualisieren sich live; säumige Fühler zeigen nach etwa 30 Minuten eine gelbe Offline-Warnung.',
      "<strong>Devices → Status</strong>: zuletzt gesehen, Akku und RSSI, sofern der Payload sie enthält (nach dem ersten Live-Messwert).",
      "<strong>Frost-Grundeinstellungen</strong>: Lege nach dem ersten POST auf Devices oder unter Alerts → When to alert Frostschwelle und E-Mail fest und sende einen Test (schaltet nach der Ersteinrichtung die vollständige Overview frei).",
      "<strong>Overview</strong>: Status des Raums; nach den Grundeinstellungen Status-Kennzahlen (Froststunden, kältester Abstand, ΔT innen−außen, Streuung zwischen Fühlern) und <strong>Insights</strong> (Risikonächte, Tür/Strom/Bewegung, Luftqualität). Wochendiagramme können Luftfeuchte und Taupunkt einblenden, wenn rel. Luftfeuchte vorliegt.",
    ],
  },
  related: {
    title: "Verwandte Themen",
    itemsHtml: [
      '<a class="text-link" href="/about/ingest-and-webhooks">Ingest-API und Alarm-Webhooks</a>',
      '<a class="text-link" href="/about/kit-qr-onboarding">Einrichtung per Kit-QR-Code</a>',
      '<a class="text-link" href="/about/configuring-temperature-feeds">Temperatur-Feeds konfigurieren</a> (Pull im Detail)',
      '<a class="text-link" href="/about/debugging-stale-readings">Veraltete Messwerte debuggen</a>',
      `<a class="text-link" href="/about/mqtt-bridge">MQTT-Bridge-Rezept</a> · <a class="text-link" href="/compare/diy-mqtt">vs. Eigenbau-MQTT</a> · <a class="text-link" href="${DEV}/integrations/mqtt-bridge">MQTT-Doku für Entwickler</a>`,
      `<a class="text-link" href="${DEV}/ingest/">Entwickler: Push-Ingest</a> · <a class="text-link" href="${DEV}/ingest/pull-feeds">Pull-Feeds</a>`,
    ],
  },
};

const ptBr: AddingDevicesMessages = {
  introHtml: [
    'O ProbeHarbor aceita leituras de duas formas: seu hardware <strong>envia</strong> (push) JSON para uma URL de ingestão, ou nós <strong>buscamos</strong> (pull) JSON via HTTPS de um feed público em intervalos programados. As duas são configuradas em <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a>. Nós ESP ou a bateria novos devem usar push. Pull é para servidores na rede local sempre ligados ou relays que já expõem JSON via HTTPS.',
    'Uma conta gratuita (sem cartão de crédito) vincula sua chave de ingestão à sua casa, para que o histórico e os alertas continuem privados. Se quiser ver leituras sem se cadastrar, dê uma olhada antes na <a class="text-link" href="/demo">demo ao vivo</a>.',
  ],
  choose: {
    title: "Escolha push ou pull",
    colPush: "Ingestão push",
    colPull: "Feed pull",
    rowsHtml: [
      ["Quem inicia", "Seu dispositivo", "ProbeHarbor"],
      ["Rede", "O dispositivo precisa de HTTPS de saída (Uno Ethernet: HTTP para um relay TLS na rede local)", "A URL do feed precisa ser acessível publicamente"],
      ["Autenticação", "Chave por dispositivo na URL; aviso de gravação + Reveal ingest key", "URL HTTPS pública (TLS)"],
      [
        "Formato do JSON",
        "Chaves planas, objeto <code>temp</code>, <code>sensors[]</code>, SenML ou HA REST",
        "Raiz <code>temp</code> aninhada (padrão); SenML ou HA REST detectados automaticamente",
      ],
      [
        "Ideal para",
        "ESP32, Pico W, STM32 Nucleo (Ethernet + relay HTTPS na rede local), Arduino Uno + Ethernet",
        "Servidores Ethernet, relays FastAPI",
      ],
    ],
  },
  push: {
    title: "Dispositivo push (recomendado)",
    stepsHtml: [
      'Entre na sua conta e abra <a class="text-link" href="/dashboard/devices">Devices</a>.',
      "Em <strong>Push devices</strong>, clique em <strong>Create push device</strong> (o nome padrão é Workshop probe; dá para renomear quando quiser).",
      `No aviso de ingestão: escaneie o QR ou use ${downloads} (URL ou caminho de ingestão já preenchido). A chave fica na página por 30 minutos e sobrevive a uma atualização até você fechá-la.`,
      "<strong>Perdeu a chave depois?</strong> No cartão do dispositivo, use <strong>Reveal ingest key</strong> (quando a recuperação de chaves estiver ativada no servidor) ou <strong>Rotate key</strong> para gerar uma nova. Dispositivos criados antes de a recuperação de chaves ser ativada precisam de uma rotação para guardar uma cópia criptografada recuperável.",
      'Grave um ESP32 (veja as <a class="text-link" href="/about/esp32-web-flash">opções de gravação</a>: Arduino IDE, PlatformIO, MicroPython ou o esptool web da Espressif), uma Pico W (<a class="text-link" href="/about/pico-w-ingest">CircuitPython / MicroPython / Arduino-Pico</a>), uma STM32 Nucleo (<a class="text-link" href="/about/stm32-zephyr-ingest">Zephyr C + Ethernet</a>), um CH32V307 (<a class="text-link" href="/about/ch32v-riscv-ingest">WCHNET C + Ethernet</a>), um Uno em assembly GNU AVR (<a class="text-link" href="/about/avr-asm-ingest">ATmega328P + W5100</a>), uma Teensy 4.1 (<a class="text-link" href="/about/teensy41-ingest">QNEthernet</a>), um PIC18F67J60 (<a class="text-link" href="/about/pic18-ethernet-ingest">MLA TCP/IP</a>) ou uma Particle Boron (<a class="text-link" href="/about/cellular-ingest">webhook LTE</a>). Precisa das peças antes? <a class="text-link" href="/about/esp32-freeze-kit">Lista de materiais do kit de congelamento ESP32</a>, <a class="text-link" href="/about/pico-w-ingest">Pico W</a>, <a class="text-link" href="/about/stm32-zephyr-ingest">STM32 Zephyr</a>, <a class="text-link" href="/about/ch32v-riscv-ingest">CH32V RISC-V</a>, <a class="text-link" href="/about/avr-asm-ingest">assembly AVR</a>, <a class="text-link" href="/about/teensy41-ingest">Teensy 4.1</a>, <a class="text-link" href="/about/pic18-ethernet-ingest">PIC18 Ethernet</a> ou <a class="text-link" href="/about/cellular-ingest">celular</a> (DS18B20 à prova d’água). O monitor serial a <strong>115200</strong> deve mostrar <code>POST 200</code> (ou <code>publish ok</code> na Boron). As chaves dos sensores são importadas automaticamente (chaves planas, objeto <code>temp</code>, SenML ou Home Assistant REST). Depois, renomeie os sensores na página Devices. O mapeamento manual em <strong>Advanced</strong> é opcional, para mapear as chaves antecipadamente.',
      `Mais exemplos (Uno Ethernet + DHT22, MAX31855, MAX6675 etc.): <a class="text-link" href="${GH}/tree/main/sketches" target="_blank" rel="noreferrer">sketches/</a>. O W5100 não faz TLS: envie um POST HTTP para um relay na rede local (<a class="text-link" href="/about/python-feeds">feeds em Python</a> / ${relay}<code>push_https_forward.py</code></a>).`,
      'Faça um teste rápido com curl e abra <a class="text-link" href="/dashboard/live">Live</a> com a conta conectada. Depois de uns 30 minutos sem envios, o Live avisa que uma sonda pode estar off-line.',
    ],
  },
  curl: {
    title: "Exemplo com curl (push)",
    introHtml: `Pegue um corpo de exemplo ao vivo no ${curlBlock}feed de ingestão de exemplo</a> (baseado no clima) e envie com POST para a chave do seu dispositivo.`,
    payloadsHtml: `Formatos de payload: chaves planas, o objeto clássico <code>temp</code>, <code>sensors[]</code> tipado, <strong>SenML (RFC 8428)</strong> ou JSON <code>state</code> do <strong>Home Assistant REST</strong>. Eles estão documentados em <a class="text-link" href="/about/ingest-and-webhooks">ingestão e webhooks</a> e na referência para desenvolvedores de <a class="text-link" href="${DEV}/ingest/">ingestão push</a>. Teste exemplos ao vivo: ${curlBlock}nativo</a>, <a class="text-link" href="/api/feeds/example?format=senml">SenML</a>, <a class="text-link" href="/api/feeds/example?format=homeassistant">HA REST</a>.`,
  },
  pull: {
    title: "Feed pull",
    step1Html: "Confirme que seu feed retorna JSON via HTTPS. Formato clássico (chave raiz padrão <code>temp</code>):",
    stepsHtml: [
      'Abra <a class="text-link" href="/dashboard/devices?tab=pull">Devices → Pull feeds</a>.',
      "Adicione um feed: nome, URL HTTPS e <strong>JSON root key</strong> (padrão <code>temp</code>). Use <strong>Test feed URL</strong> antes de salvar.",
      "Clique em <strong>Save pull setup</strong>: as chaves das sondas são importadas automaticamente do feed ao vivo. Renomeie os rótulos na mesma página ou clique em <strong>Accept suggested names</strong>.",
      'Clique em <strong>Fetch now</strong> para buscar leituras na hora, ou espere a próxima consulta programada e confira os cartões em <a class="text-link" href="/dashboard/live">Live</a>.',
    ],
    noteHtml: `Por padrão, os feeds pull esperam objetos de sonda aninhados sob a raiz configurada (não chaves planas no estilo push). <strong>Arrays JSON SenML</strong> e respostas do <strong>Home Assistant REST</strong> são detectados automaticamente quando essa raiz não existe: cole a URL como está e mapeie as chaves de sonda que o SenML ou o HA expõem (ex.: <code>0</code>, <code>state</code>). Se o microcontrolador não faz TLS (Uno + shield Ethernet W5100), use um relay HTTPS local (veja <a class="text-link" href="/about/python-feeds">feeds em Python</a> ou o ${relay}encaminhador HTTP→HTTPS</a> com a biblioteca padrão para ingestão push).`,
  },
  mqtt: {
    title: "Já usa MQTT?",
    bodyHtml:
      'Mantenha o Mosquitto ou o MQTT do Home Assistant na sua rede local e espelhe as leituras via HTTPS. O ProbeHarbor não é um broker MQTT. Receita completa (curl, <code>rest_command</code> do HA, Node-RED): <a class="text-link" href="/about/mqtt-bridge">guia da ponte MQTT</a>. Veja também <a class="text-link" href="/compare/diy-mqtt">ProbeHarbor vs. MQTT caseiro</a>.',
  },
  verify: {
    title: "Confira se está tudo funcionando",
    itemsHtml: [
      '<strong><a class="text-link" href="/dashboard/live">Live</a></strong>: os cartões se atualizam ao vivo; sondas atrasadas mostram um aviso amarelo de off-line depois de uns 30 minutos.',
      "<strong>Devices → Status</strong>: última conexão, bateria e RSSI quando o payload os inclui (depois da primeira leitura ao vivo).",
      "<strong>O essencial contra congelamento</strong>: defina o limite de congelamento e o e-mail em Devices após o primeiro POST, ou em Alerts → When to alert, e envie um teste (libera o Overview completo após a configuração inicial).",
      "<strong>Overview</strong>: status do espaço; depois do essencial, as métricas de Status (horas abaixo de zero, margem mais fria, ΔT interno−externo, dispersão entre sondas) e <strong>Insights</strong> (noites de risco, porta/energia/movimento, qualidade do ar). Os gráficos semanais podem sobrepor umidade e ponto de orvalho quando há UR.",
    ],
  },
  related: {
    title: "Relacionados",
    itemsHtml: [
      '<a class="text-link" href="/about/ingest-and-webhooks">API de ingestão e webhooks de alerta</a>',
      '<a class="text-link" href="/about/kit-qr-onboarding">Ativação pelo QR do kit</a>',
      '<a class="text-link" href="/about/configuring-temperature-feeds">Configurar feeds de temperatura</a> (pull em detalhes)',
      '<a class="text-link" href="/about/debugging-stale-readings">Depurar leituras desatualizadas</a>',
      `<a class="text-link" href="/about/mqtt-bridge">Receita da ponte MQTT</a> · <a class="text-link" href="/compare/diy-mqtt">vs. MQTT caseiro</a> · <a class="text-link" href="${DEV}/integrations/mqtt-bridge">documentação MQTT para desenvolvedores</a>`,
      `<a class="text-link" href="${DEV}/ingest/">Desenvolvedores: ingestão push</a> · <a class="text-link" href="${DEV}/ingest/pull-feeds">feeds pull</a>`,
    ],
  },
};

export const addingDevicesMessages = defineMessages({ en, es, fr, de, "pt-br": ptBr });
