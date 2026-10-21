import { defineMessages } from "../../translate";

/**
 * /about/pico-w-ingest body copy. `*Html` keys are trusted inline HTML;
 * hrefs stay English (middleware localizes them). Pin names, part numbers,
 * commands and dashboard UI labels stay as is.
 */

const GH = "https://github.com/doodersrage/probeharbor";
const repoSample = `<a class="text-link" href="${GH}/blob/main/sketches/circuitpython/ds18b20_ingest.py" target="_blank" rel="noreferrer"><code>sketches/circuitpython/ds18b20_ingest.py</code></a>`;
const circup =
  "<code>circup install adafruit_requests adafruit_connection_manager adafruit_ds18x20 adafruit_onewire</code>";
const allSketches = (label: string) =>
  `<a class="text-link" href="${GH}/tree/main/sketches" target="_blank" rel="noreferrer">${label} ↗</a>`;

const en = {
  intro1Html:
    "ESP32 is still the default freeze-kit board, but it is not the only Wi‑Fi microcontroller that can POST to ProbeHarbor. A <strong>Raspberry Pi Pico W</strong> or <strong>Pico 2 W</strong> speaks HTTPS on-chip, uses the same DS18B20 wiring idea as the ESP sketches, and flashes without Arduino IDE if you prefer CircuitPython’s <code>CIRCUITPY</code> drive.",
  intro2Html:
    'This is a temperature probe. The <a class="text-link" href="/claim-puck">claim puck</a> is a different RP2040 (Waveshare RP2040-Zero) that proves presence over USB. Do not mix those firmwares.',
  parts: {
    title: "Parts",
    caption: "Parts for a Pico W freeze probe",
    colPart: "Part",
    colWhy: "Why",
    colBuy: "Buy",
    boardPart: "Pico W or Pico 2 W",
    boardWhy: "On-board CYW43439 Wi‑Fi and TLS. Pico 2 W (RP2350) is the drop-in upgrade.",
    probePart: "Waterproof DS18B20",
    probeWhyHtml: "Pipe / crawlspace probe; works below freezing. Data on <strong>GP4</strong>.",
    amazon: "Amazon",
    resistorPart: "4.7kΩ resistor",
    resistorWhy: "Pull-up from DS18B20 data to 3.3V. Do not power the probe from 5V on a Pico.",
    amazonResistor: "Amazon 4.7k",
  },
  wiringTitle: "Wiring",
  wiringHtml: [
    "DS18B20 VDD → Pico <strong>3.3V</strong> (not VBUS / 5V)",
    "DS18B20 GND → GND",
    "DS18B20 data → <strong>GP4</strong>, with 4.7k between data and 3.3V",
  ],
  wiringNoteHtml:
    "GP4 is GPIO 4, the same numeric pin the ESP32 sketches use. After the first POST, ProbeHarbor imports <code>temp1</code> automatically.",
  circuitpythonTitle: "1. CircuitPython (recommended)",
  circuitpythonStepsHtml: [
    'Open <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a>, create a push device, and download <strong>CircuitPython code.py</strong> (ingest URL filled in).',
    "Hold <strong>BOOTSEL</strong>, plug in USB, copy the CircuitPython UF2 for Pico W or Pico 2 W onto the RPI-RP2 drive. The board remounts as <code>CIRCUITPY</code>.",
    `Install libraries: ${circup}`,
    "Set <code>WIFI_SSID</code> / <code>WIFI_PASS</code>, save as <code>code.py</code>.",
    "Serial should show <code>wifi ok</code> then <code>POST 200</code>.",
  ],
  repoSampleHtml: `Repo sample: ${repoSample}.`,
  micropythonTitle: "2. MicroPython",
  micropythonHtml:
    "Flash a Pico W MicroPython UF2, then copy the Devices <strong>MicroPython .py</strong> as <code>main.py</code> (Thonny / mpremote). The same file also runs on ESP32. Pin 4 is GP4.",
  arduinoTitle: "3. Arduino IDE (Earle Philhower core)",
  arduinoHtml:
    "Install the <strong>Raspberry Pi Pico/RP2040</strong> package by Earle Philhower, not Arduino’s mbed RP2040 core. Select <strong>Pico W</strong> or <strong>Pico 2 W</strong>, open the downloaded <code>.ino</code>, set Wi‑Fi, flash. Libraries: <code>OneWire</code>, <code>DallasTemperature</code>.",
  notAddingTitle: "What we are not adding (yet)",
  notAddingHtml:
    "Anything that can POST HTTPS JSON already works without a first-class sketch: a Linux Raspberry Pi with <code>requests</code>, ESPHome, or a LAN MQTT→HTTP bridge. These families need extra hardware or a gateway, so they stay out of the Devices flash panel:",
  notAddingItemsHtml: [
    "<strong>Pico without W</strong> / RP2040-Zero: no Wi‑Fi. Use Ethernet/ESP-01 plus a TLS relay, or keep the Zero as a claim puck.",
    "<strong>nRF52 / nRF52840</strong> (XIAO BLE, Feather nRF52840): Bluetooth or Thread, not native Wi‑Fi HTTPS.",
    '<strong>STM32 Nucleo-F767ZI</strong> is first-class now: <a class="text-link" href="/about/stm32-zephyr-ingest">Zephyr C + onboard Ethernet</a> (LAN TLS relay, not Arduino, not Python).',
    '<strong>CH32V307V-EVT</strong> is first-class now: <a class="text-link" href="/about/ch32v-riscv-ingest">WCHNET C + onboard Ethernet</a> (QingKe RISC-V, LAN TLS relay).',
    "<strong>Arduino Nano 33 IoT / UNO R4 WiFi</strong>: still Arduino; the ESP/Pico samples already cover TLS Wi‑Fi if you adapt the WiFi library.",
  ],
  related: {
    title: "Related",
    itemsHtml: [
      '<a class="text-link" href="/about/adding-devices">Adding devices</a>',
      '<a class="text-link" href="/about/stm32-zephyr-ingest">STM32 Zephyr ingest</a>',
      '<a class="text-link" href="/about/ch32v-riscv-ingest">CH32V RISC-V ingest</a>',
      '<a class="text-link" href="/about/esp32-freeze-kit">ESP32 freeze kit parts list</a>',
      '<a class="text-link" href="/about/esp32-web-flash">ESP32 flashing options</a>',
      '<a class="text-link" href="/claim-puck">Claim puck (RP2040-Zero, not a probe)</a>',
      allSketches("All sketches"),
    ],
  },
};
type PicoWIngestMessages = typeof en;

const es: PicoWIngestMessages = {
  intro1Html:
    "El ESP32 sigue siendo la placa por defecto del kit de congelación, pero no es el único microcontrolador con Wi‑Fi que puede hacer POST a ProbeHarbor. Una <strong>Raspberry Pi Pico W</strong> o <strong>Pico 2 W</strong> habla HTTPS desde el propio chip, usa el mismo esquema de cableado del DS18B20 que los sketches para ESP y se flashea sin Arduino IDE si prefieres la unidad <code>CIRCUITPY</code> de CircuitPython.",
  intro2Html:
    'Esto es una sonda de temperatura. El <a class="text-link" href="/claim-puck">claim puck</a> es otro RP2040 (Waveshare RP2040-Zero) que demuestra presencia por USB. No mezcles esos firmwares.',
  parts: {
    title: "Piezas",
    caption: "Piezas para una sonda de congelación con Pico W",
    colPart: "Pieza",
    colWhy: "Por qué",
    colBuy: "Comprar",
    boardPart: "Pico W o Pico 2 W",
    boardWhy: "Wi‑Fi CYW43439 y TLS integrados. La Pico 2 W (RP2350) es la mejora directa y compatible.",
    probePart: "DS18B20 impermeable",
    probeWhyHtml: "Sonda para tuberías o sótano ventilado; funciona bajo cero. Datos en <strong>GP4</strong>.",
    amazon: "Amazon",
    resistorPart: "Resistencia de 4,7 kΩ",
    resistorWhy: "Pull-up desde los datos del DS18B20 a 3,3 V. En una Pico, no alimentes la sonda con 5 V.",
    amazonResistor: "4,7k en Amazon",
  },
  wiringTitle: "Cableado",
  wiringHtml: [
    "DS18B20 VDD → Pico <strong>3.3V</strong> (no VBUS / 5 V)",
    "DS18B20 GND → GND",
    "Datos del DS18B20 → <strong>GP4</strong>, con 4,7k entre datos y 3,3 V",
  ],
  wiringNoteHtml:
    "GP4 es GPIO 4, el mismo número de pin que usan los sketches para ESP32. Tras el primer POST, ProbeHarbor importa <code>temp1</code> automáticamente.",
  circuitpythonTitle: "1. CircuitPython (recomendado)",
  circuitpythonStepsHtml: [
    'Abre <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a>, crea un dispositivo push y descarga <strong>CircuitPython code.py</strong> (con la URL de ingesta ya rellenada).',
    "Mantén pulsado <strong>BOOTSEL</strong>, conecta el USB y copia el UF2 de CircuitPython para Pico W o Pico 2 W en la unidad RPI-RP2. La placa se vuelve a montar como <code>CIRCUITPY</code>.",
    `Instala las bibliotecas: ${circup}`,
    "Define <code>WIFI_SSID</code> / <code>WIFI_PASS</code> y guarda como <code>code.py</code>.",
    "El monitor serie debería mostrar <code>wifi ok</code> y luego <code>POST 200</code>.",
  ],
  repoSampleHtml: `Ejemplo del repositorio: ${repoSample}.`,
  micropythonTitle: "2. MicroPython",
  micropythonHtml:
    "Flashea un UF2 de MicroPython para Pico W y copia el <strong>MicroPython .py</strong> de Devices como <code>main.py</code> (Thonny / mpremote). El mismo archivo también funciona en el ESP32. El pin 4 es GP4.",
  arduinoTitle: "3. Arduino IDE (núcleo de Earle Philhower)",
  arduinoHtml:
    "Instala el paquete <strong>Raspberry Pi Pico/RP2040</strong> de Earle Philhower, no el núcleo mbed RP2040 de Arduino. Selecciona <strong>Pico W</strong> o <strong>Pico 2 W</strong>, abre el <code>.ino</code> descargado, configura el Wi‑Fi y flashea. Bibliotecas: <code>OneWire</code>, <code>DallasTemperature</code>.",
  notAddingTitle: "Lo que no vamos a añadir (por ahora)",
  notAddingHtml:
    "Cualquier cosa que pueda hacer POST de JSON por HTTPS ya funciona sin un sketch oficial: una Raspberry Pi con Linux y <code>requests</code>, ESPHome o un puente MQTT→HTTP en la LAN. Estas familias necesitan hardware adicional o una pasarela, así que se quedan fuera del panel de flasheo de Devices:",
  notAddingItemsHtml: [
    "<strong>Pico sin W</strong> / RP2040-Zero: sin Wi‑Fi. Usa Ethernet/ESP-01 más un relé TLS, o deja la Zero como claim puck.",
    "<strong>nRF52 / nRF52840</strong> (XIAO BLE, Feather nRF52840): Bluetooth o Thread, no HTTPS nativo por Wi‑Fi.",
    '<strong>STM32 Nucleo-F767ZI</strong> ya tiene soporte oficial: <a class="text-link" href="/about/stm32-zephyr-ingest">Zephyr C + Ethernet integrado</a> (relé TLS en la LAN, ni Arduino ni Python).',
    '<strong>CH32V307V-EVT</strong> ya tiene soporte oficial: <a class="text-link" href="/about/ch32v-riscv-ingest">WCHNET C + Ethernet integrado</a> (RISC-V QingKe, relé TLS en la LAN).',
    "<strong>Arduino Nano 33 IoT / UNO R4 WiFi</strong>: siguen siendo Arduino; los ejemplos para ESP/Pico ya cubren Wi‑Fi con TLS si adaptas la biblioteca WiFi.",
  ],
  related: {
    title: "Relacionado",
    itemsHtml: [
      '<a class="text-link" href="/about/adding-devices">Añadir dispositivos</a>',
      '<a class="text-link" href="/about/stm32-zephyr-ingest">Ingesta con STM32 Zephyr</a>',
      '<a class="text-link" href="/about/ch32v-riscv-ingest">Ingesta con CH32V RISC-V</a>',
      '<a class="text-link" href="/about/esp32-freeze-kit">Lista de piezas del kit ESP32 de congelación</a>',
      '<a class="text-link" href="/about/esp32-web-flash">Opciones de flasheo del ESP32</a>',
      '<a class="text-link" href="/claim-puck">Claim puck (RP2040-Zero, no es una sonda)</a>',
      allSketches("Todos los sketches"),
    ],
  },
};

const fr: PicoWIngestMessages = {
  intro1Html:
    "L’ESP32 reste la carte par défaut du kit antigel, mais ce n’est pas le seul microcontrôleur Wi‑Fi capable d’envoyer des POST à ProbeHarbor. Un <strong>Raspberry Pi Pico W</strong> ou <strong>Pico 2 W</strong> parle HTTPS directement sur la puce, reprend le même principe de câblage du DS18B20 que les sketches ESP, et se flashe sans Arduino IDE si vous préférez le lecteur <code>CIRCUITPY</code> de CircuitPython.",
  intro2Html:
    'Il s’agit d’une sonde de température. Le <a class="text-link" href="/claim-puck">claim puck</a> est un autre RP2040 (Waveshare RP2040-Zero) qui prouve une présence via USB. Ne mélangez pas ces firmwares.',
  parts: {
    title: "Pièces",
    caption: "Pièces pour une sonde antigel Pico W",
    colPart: "Pièce",
    colWhy: "Pourquoi",
    colBuy: "Acheter",
    boardPart: "Pico W ou Pico 2 W",
    boardWhy: "Wi‑Fi CYW43439 et TLS intégrés. Le Pico 2 W (RP2350) est la mise à niveau directe.",
    probePart: "DS18B20 étanche",
    probeWhyHtml: "Sonde pour tuyau ou vide sanitaire ; fonctionne sous zéro. Donnée sur <strong>GP4</strong>.",
    amazon: "Amazon",
    resistorPart: "Résistance de 4,7 kΩ",
    resistorWhy: "Pull-up entre la donnée du DS18B20 et le 3,3 V. N’alimentez pas la sonde en 5 V sur un Pico.",
    amazonResistor: "4,7k sur Amazon",
  },
  wiringTitle: "Câblage",
  wiringHtml: [
    "DS18B20 VDD → Pico <strong>3.3V</strong> (pas VBUS / 5 V)",
    "DS18B20 GND → GND",
    "Donnée du DS18B20 → <strong>GP4</strong>, avec 4,7k entre la donnée et le 3,3 V",
  ],
  wiringNoteHtml:
    "GP4 correspond au GPIO 4, le même numéro de broche que dans les sketches ESP32. Après le premier POST, ProbeHarbor importe <code>temp1</code> automatiquement.",
  circuitpythonTitle: "1. CircuitPython (recommandé)",
  circuitpythonStepsHtml: [
    'Ouvrez <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a>, créez un appareil push et téléchargez <strong>CircuitPython code.py</strong> (URL d’ingestion préremplie).',
    "Maintenez <strong>BOOTSEL</strong>, branchez l’USB et copiez l’UF2 CircuitPython pour Pico W ou Pico 2 W sur le lecteur RPI-RP2. La carte se remonte sous le nom <code>CIRCUITPY</code>.",
    `Installez les bibliothèques : ${circup}`,
    "Renseignez <code>WIFI_SSID</code> / <code>WIFI_PASS</code> et enregistrez sous <code>code.py</code>.",
    "Le moniteur série doit afficher <code>wifi ok</code> puis <code>POST 200</code>.",
  ],
  repoSampleHtml: `Exemple du dépôt : ${repoSample}.`,
  micropythonTitle: "2. MicroPython",
  micropythonHtml:
    "Flashez un UF2 MicroPython pour Pico W, puis copiez le <strong>MicroPython .py</strong> de Devices sous le nom <code>main.py</code> (Thonny / mpremote). Le même fichier fonctionne aussi sur ESP32. La broche 4 est GP4.",
  arduinoTitle: "3. Arduino IDE (cœur d’Earle Philhower)",
  arduinoHtml:
    "Installez le paquet <strong>Raspberry Pi Pico/RP2040</strong> d’Earle Philhower, et non le cœur mbed RP2040 d’Arduino. Sélectionnez <strong>Pico W</strong> ou <strong>Pico 2 W</strong>, ouvrez le <code>.ino</code> téléchargé, renseignez le Wi‑Fi et flashez. Bibliothèques : <code>OneWire</code>, <code>DallasTemperature</code>.",
  notAddingTitle: "Ce que nous n’ajoutons pas (pour l’instant)",
  notAddingHtml:
    "Tout ce qui sait envoyer du JSON en POST HTTPS fonctionne déjà sans sketch officiel : un Raspberry Pi sous Linux avec <code>requests</code>, ESPHome, ou un pont MQTT→HTTP sur le LAN. Ces familles demandent du matériel supplémentaire ou une passerelle, elles restent donc absentes du panneau de flashage de Devices :",
  notAddingItemsHtml: [
    "<strong>Pico sans W</strong> / RP2040-Zero : pas de Wi‑Fi. Utilisez Ethernet/ESP-01 plus un relais TLS, ou gardez le Zero comme claim puck.",
    "<strong>nRF52 / nRF52840</strong> (XIAO BLE, Feather nRF52840) : Bluetooth ou Thread, pas de HTTPS natif en Wi‑Fi.",
    '<strong>STM32 Nucleo-F767ZI</strong> est désormais pris en charge officiellement : <a class="text-link" href="/about/stm32-zephyr-ingest">Zephyr C + Ethernet intégré</a> (relais TLS sur le LAN, ni Arduino ni Python).',
    '<strong>CH32V307V-EVT</strong> est désormais pris en charge officiellement : <a class="text-link" href="/about/ch32v-riscv-ingest">WCHNET C + Ethernet intégré</a> (RISC-V QingKe, relais TLS sur le LAN).',
    "<strong>Arduino Nano 33 IoT / UNO R4 WiFi</strong> : toujours de l’Arduino ; les exemples ESP/Pico couvrent déjà le Wi‑Fi en TLS si vous adaptez la bibliothèque WiFi.",
  ],
  related: {
    title: "À lire aussi",
    itemsHtml: [
      '<a class="text-link" href="/about/adding-devices">Ajouter des appareils</a>',
      '<a class="text-link" href="/about/stm32-zephyr-ingest">Ingestion avec STM32 Zephyr</a>',
      '<a class="text-link" href="/about/ch32v-riscv-ingest">Ingestion avec CH32V RISC-V</a>',
      '<a class="text-link" href="/about/esp32-freeze-kit">Liste des pièces du kit antigel ESP32</a>',
      '<a class="text-link" href="/about/esp32-web-flash">Options de flashage de l’ESP32</a>',
      '<a class="text-link" href="/claim-puck">Claim puck (RP2040-Zero, pas une sonde)</a>',
      allSketches("Tous les sketches"),
    ],
  },
};

const de: PicoWIngestMessages = {
  intro1Html:
    "Der ESP32 bleibt die Standardplatine des Frost-Kits, ist aber nicht der einzige WLAN-Mikrocontroller, der per POST an ProbeHarbor senden kann. Ein <strong>Raspberry Pi Pico W</strong> oder <strong>Pico 2 W</strong> spricht HTTPS direkt auf dem Chip, nutzt dieselbe DS18B20-Verdrahtung wie die ESP-Sketches und lässt sich ohne Arduino IDE flashen, wenn du das <code>CIRCUITPY</code>-Laufwerk von CircuitPython bevorzugst.",
  intro2Html:
    'Das hier ist ein Temperaturfühler. Der <a class="text-link" href="/claim-puck">Claim Puck</a> ist ein anderer RP2040 (Waveshare RP2040-Zero), der per USB Anwesenheit nachweist. Misch diese Firmwares nicht.',
  parts: {
    title: "Teile",
    caption: "Teile für einen Pico-W-Frostfühler",
    colPart: "Teil",
    colWhy: "Wozu",
    colBuy: "Kaufen",
    boardPart: "Pico W oder Pico 2 W",
    boardWhy: "CYW43439-WLAN und TLS an Bord. Der Pico 2 W (RP2350) ist das direkte Upgrade.",
    probePart: "Wasserdichter DS18B20",
    probeWhyHtml: "Fühler für Rohr oder Kriechkeller; funktioniert unter dem Gefrierpunkt. Daten an <strong>GP4</strong>.",
    amazon: "Amazon",
    resistorPart: "4,7-kΩ-Widerstand",
    resistorWhy: "Pull-up von der DS18B20-Datenleitung auf 3,3 V. Versorge den Fühler an einem Pico nicht mit 5 V.",
    amazonResistor: "4,7k bei Amazon",
  },
  wiringTitle: "Verdrahtung",
  wiringHtml: [
    "DS18B20 VDD → Pico <strong>3.3V</strong> (nicht VBUS / 5 V)",
    "DS18B20 GND → GND",
    "DS18B20-Daten → <strong>GP4</strong>, mit 4,7k zwischen Daten und 3,3 V",
  ],
  wiringNoteHtml:
    "GP4 ist GPIO 4, also dieselbe Pin-Nummer wie in den ESP32-Sketches. Nach dem ersten POST importiert ProbeHarbor <code>temp1</code> automatisch.",
  circuitpythonTitle: "1. CircuitPython (empfohlen)",
  circuitpythonStepsHtml: [
    'Öffne <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a>, lege ein Push-Gerät an und lade <strong>CircuitPython code.py</strong> herunter (Ingest-URL bereits eingetragen).',
    "Halte <strong>BOOTSEL</strong> gedrückt, steck USB ein und kopiere das CircuitPython-UF2 für Pico W oder Pico 2 W auf das Laufwerk RPI-RP2. Die Platine meldet sich danach als <code>CIRCUITPY</code> neu an.",
    `Bibliotheken installieren: ${circup}`,
    "Setze <code>WIFI_SSID</code> / <code>WIFI_PASS</code> und speichere als <code>code.py</code>.",
    "Der serielle Monitor sollte <code>wifi ok</code> und dann <code>POST 200</code> zeigen.",
  ],
  repoSampleHtml: `Beispiel im Repo: ${repoSample}.`,
  micropythonTitle: "2. MicroPython",
  micropythonHtml:
    "Flashe ein MicroPython-UF2 für den Pico W und kopiere dann die <strong>MicroPython .py</strong> aus Devices als <code>main.py</code> (Thonny / mpremote). Dieselbe Datei läuft auch auf dem ESP32. Pin 4 ist GP4.",
  arduinoTitle: "3. Arduino IDE (Core von Earle Philhower)",
  arduinoHtml:
    "Installiere das Paket <strong>Raspberry Pi Pico/RP2040</strong> von Earle Philhower, nicht den mbed-RP2040-Core von Arduino. Wähle <strong>Pico W</strong> oder <strong>Pico 2 W</strong>, öffne die heruntergeladene <code>.ino</code>, trag dein WLAN ein und flashe. Bibliotheken: <code>OneWire</code>, <code>DallasTemperature</code>.",
  notAddingTitle: "Was wir (noch) nicht hinzufügen",
  notAddingHtml:
    "Alles, was HTTPS-JSON per POST senden kann, funktioniert schon ohne offiziellen Sketch: ein Raspberry Pi mit Linux und <code>requests</code>, ESPHome oder eine MQTT→HTTP-Bridge im LAN. Diese Familien brauchen zusätzliche Hardware oder ein Gateway und bleiben deshalb außerhalb des Flash-Bereichs unter Devices:",
  notAddingItemsHtml: [
    "<strong>Pico ohne W</strong> / RP2040-Zero: kein WLAN. Nutze Ethernet/ESP-01 plus ein TLS-Relay oder behalte den Zero als Claim Puck.",
    "<strong>nRF52 / nRF52840</strong> (XIAO BLE, Feather nRF52840): Bluetooth oder Thread, kein natives HTTPS über WLAN.",
    '<strong>STM32 Nucleo-F767ZI</strong> wird jetzt offiziell unterstützt: <a class="text-link" href="/about/stm32-zephyr-ingest">Zephyr C + Onboard-Ethernet</a> (TLS-Relay im LAN, kein Arduino, kein Python).',
    '<strong>CH32V307V-EVT</strong> wird jetzt offiziell unterstützt: <a class="text-link" href="/about/ch32v-riscv-ingest">WCHNET C + Onboard-Ethernet</a> (QingKe RISC-V, TLS-Relay im LAN).',
    "<strong>Arduino Nano 33 IoT / UNO R4 WiFi</strong>: weiterhin Arduino; die ESP-/Pico-Beispiele decken TLS über WLAN bereits ab, wenn du die WiFi-Bibliothek anpasst.",
  ],
  related: {
    title: "Verwandte Themen",
    itemsHtml: [
      '<a class="text-link" href="/about/adding-devices">Geräte hinzufügen</a>',
      '<a class="text-link" href="/about/stm32-zephyr-ingest">Datenübertragung mit STM32 Zephyr</a>',
      '<a class="text-link" href="/about/ch32v-riscv-ingest">Datenübertragung mit CH32V RISC-V</a>',
      '<a class="text-link" href="/about/esp32-freeze-kit">Teileliste für das ESP32-Frost-Kit</a>',
      '<a class="text-link" href="/about/esp32-web-flash">ESP32-Flash-Optionen</a>',
      '<a class="text-link" href="/claim-puck">Claim Puck (RP2040-Zero, kein Fühler)</a>',
      allSketches("Alle Sketches"),
    ],
  },
};

const ptBr: PicoWIngestMessages = {
  intro1Html:
    "O ESP32 continua sendo a placa padrão do kit de congelamento, mas não é o único microcontrolador com Wi‑Fi que consegue fazer POST para o ProbeHarbor. Uma <strong>Raspberry Pi Pico W</strong> ou <strong>Pico 2 W</strong> fala HTTPS no próprio chip, usa o mesmo esquema de ligação do DS18B20 dos sketches para ESP e pode ser gravada sem o Arduino IDE se você preferir a unidade <code>CIRCUITPY</code> do CircuitPython.",
  intro2Html:
    'Esta é uma sonda de temperatura. O <a class="text-link" href="/claim-puck">claim puck</a> é outro RP2040 (Waveshare RP2040-Zero) que comprova presença via USB. Não misture esses firmwares.',
  parts: {
    title: "Peças",
    caption: "Peças para uma sonda de congelamento com Pico W",
    colPart: "Peça",
    colWhy: "Por quê",
    colBuy: "Comprar",
    boardPart: "Pico W ou Pico 2 W",
    boardWhy: "Wi‑Fi CYW43439 e TLS na placa. A Pico 2 W (RP2350) é o upgrade direto e compatível.",
    probePart: "DS18B20 à prova d’água",
    probeWhyHtml: "Sonda para cano ou porão; funciona abaixo de zero. Dados no <strong>GP4</strong>.",
    amazon: "Amazon",
    resistorPart: "Resistor de 4,7 kΩ",
    resistorWhy: "Pull-up dos dados do DS18B20 para 3,3 V. Numa Pico, não alimente a sonda com 5 V.",
    amazonResistor: "4,7k na Amazon",
  },
  wiringTitle: "Ligação",
  wiringHtml: [
    "DS18B20 VDD → Pico <strong>3.3V</strong> (não VBUS / 5 V)",
    "DS18B20 GND → GND",
    "Dados do DS18B20 → <strong>GP4</strong>, com 4,7k entre dados e 3,3 V",
  ],
  wiringNoteHtml:
    "GP4 é o GPIO 4, o mesmo número de pino usado nos sketches para ESP32. Depois do primeiro POST, o ProbeHarbor importa <code>temp1</code> automaticamente.",
  circuitpythonTitle: "1. CircuitPython (recomendado)",
  circuitpythonStepsHtml: [
    'Abra <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a>, crie um dispositivo push e baixe <strong>CircuitPython code.py</strong> (com a URL de ingestão já preenchida).',
    "Segure <strong>BOOTSEL</strong>, conecte o USB e copie o UF2 do CircuitPython para Pico W ou Pico 2 W na unidade RPI-RP2. A placa volta a aparecer como <code>CIRCUITPY</code>.",
    `Instale as bibliotecas: ${circup}`,
    "Defina <code>WIFI_SSID</code> / <code>WIFI_PASS</code> e salve como <code>code.py</code>.",
    "O monitor serial deve mostrar <code>wifi ok</code> e depois <code>POST 200</code>.",
  ],
  repoSampleHtml: `Exemplo do repositório: ${repoSample}.`,
  micropythonTitle: "2. MicroPython",
  micropythonHtml:
    "Grave um UF2 do MicroPython para Pico W e copie o <strong>MicroPython .py</strong> de Devices como <code>main.py</code> (Thonny / mpremote). O mesmo arquivo também roda no ESP32. O pino 4 é o GP4.",
  arduinoTitle: "3. Arduino IDE (core de Earle Philhower)",
  arduinoHtml:
    "Instale o pacote <strong>Raspberry Pi Pico/RP2040</strong> de Earle Philhower, não o core mbed RP2040 do Arduino. Selecione <strong>Pico W</strong> ou <strong>Pico 2 W</strong>, abra o <code>.ino</code> baixado, configure o Wi‑Fi e grave. Bibliotecas: <code>OneWire</code>, <code>DallasTemperature</code>.",
  notAddingTitle: "O que não vamos adicionar (por enquanto)",
  notAddingHtml:
    "Qualquer coisa que consiga fazer POST de JSON via HTTPS já funciona sem um sketch oficial: uma Raspberry Pi com Linux e <code>requests</code>, ESPHome ou uma ponte MQTT→HTTP na rede local. Essas famílias precisam de hardware extra ou de um gateway, então ficam fora do painel de gravação de Devices:",
  notAddingItemsHtml: [
    "<strong>Pico sem W</strong> / RP2040-Zero: sem Wi‑Fi. Use Ethernet/ESP-01 mais um relay TLS, ou mantenha a Zero como claim puck.",
    "<strong>nRF52 / nRF52840</strong> (XIAO BLE, Feather nRF52840): Bluetooth ou Thread, sem HTTPS nativo por Wi‑Fi.",
    '<strong>STM32 Nucleo-F767ZI</strong> agora tem suporte oficial: <a class="text-link" href="/about/stm32-zephyr-ingest">Zephyr C + Ethernet na placa</a> (relay TLS na rede local, sem Arduino, sem Python).',
    '<strong>CH32V307V-EVT</strong> agora tem suporte oficial: <a class="text-link" href="/about/ch32v-riscv-ingest">WCHNET C + Ethernet na placa</a> (RISC-V QingKe, relay TLS na rede local).',
    "<strong>Arduino Nano 33 IoT / UNO R4 WiFi</strong>: continuam sendo Arduino; os exemplos para ESP/Pico já cobrem Wi‑Fi com TLS se você adaptar a biblioteca WiFi.",
  ],
  related: {
    title: "Relacionados",
    itemsHtml: [
      '<a class="text-link" href="/about/adding-devices">Adicionar dispositivos</a>',
      '<a class="text-link" href="/about/stm32-zephyr-ingest">Ingestão com STM32 Zephyr</a>',
      '<a class="text-link" href="/about/ch32v-riscv-ingest">Ingestão com CH32V RISC-V</a>',
      '<a class="text-link" href="/about/esp32-freeze-kit">Lista de peças do kit de congelamento ESP32</a>',
      '<a class="text-link" href="/about/esp32-web-flash">Opções de gravação do ESP32</a>',
      '<a class="text-link" href="/claim-puck">Claim puck (RP2040-Zero, não é uma sonda)</a>',
      allSketches("Todos os sketches"),
    ],
  },
};

export const picoWIngestMessages = defineMessages({ en, es, fr, de, "pt-br": ptBr });
