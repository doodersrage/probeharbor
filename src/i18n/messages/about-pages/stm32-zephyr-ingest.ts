import { defineMessages } from "../../translate";

/**
 * /about/stm32-zephyr-ingest body copy. `*Html` keys are trusted inline HTML;
 * hrefs stay English (middleware localizes them). Commands, pin names and
 * part numbers stay as is; the code blocks live in the page.
 */

const GH = "https://github.com/doodersrage/probeharbor";
const repoApp = `<a class="text-link" href="${GH}/tree/main/sketches/zephyr/ds18b20_ingest" target="_blank" rel="noreferrer"><code>sketches/zephyr/ds18b20_ingest/</code></a>`;
const allSketches = (label: string) =>
  `<a class="text-link" href="${GH}/tree/main/sketches" target="_blank" rel="noreferrer">${label} ↗</a>`;

const en = {
  intro1Html:
    "ESP32 and Pico W cover Wi‑Fi. If you want a different silicon vendor and a toolchain that is neither Arduino nor Python, an <strong>ST Nucleo-F767ZI</strong> running <strong>Zephyr</strong> POSTs the same ingest JSON over onboard Ethernet. C, <code>west</code>, ST-LINK. The Arduino-compatible header is only a pinout: the firmware is not an Arduino sketch.",
  intro2Html:
    'Native HTTPS on Zephyr means baking a CDN CA into the image, which breaks when the edge certificate chain rotates. This sample uses the same LAN HTTP→HTTPS relay as the <a class="text-link" href="/about/arduino-sketches">Uno + W5100</a> path, so Cloudflare can change CAs without a reflash.',
  parts: {
    title: "Parts",
    caption: "Parts for an STM32 Zephyr freeze probe",
    colPart: "Part",
    colWhy: "Why",
    colBuy: "Buy",
    boardWhy: "Cortex-M7, onboard Ethernet MAC + PHY, ST-LINK debugger. No Wi‑Fi module.",
    probePart: "Waterproof DS18B20",
    probeWhyHtml: "Pipe / crawlspace probe. Data on Arduino <strong>D4</strong> (PF14).",
    amazon: "Amazon",
    resistorPart: "4.7kΩ resistor",
    resistorWhy: "Pull-up from DS18B20 data to 3.3V. Do not power the probe from the 5V Arduino pin.",
    amazonResistor: "Amazon 4.7k",
    ethernetPart: "Ethernet drop",
    ethernetWhy: "DHCP on your LAN. A Pi, NAS, or laptop runs the TLS relay.",
    ethernetBuy: "Any Cat5e patch cable to your switch.",
  },
  wiringTitle: "Wiring",
  wiringHtml: [
    "DS18B20 VDD → Nucleo <strong>3.3V</strong>",
    "DS18B20 GND → GND",
    "DS18B20 data → Arduino <strong>D4</strong> (STM32 <strong>PF14</strong>), 4.7k to 3.3V",
    "RJ45 → LAN. ST-LINK USB for flash and 115200 serial.",
  ],
  build: {
    title: "Build and flash",
    step1Html:
      'Open <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> and download <strong>Zephyr main.c</strong> (ingest path filled in), or copy the defines from the ingest callout.',
    relayLabel: "On a LAN host:",
    step3Html:
      "Set <code>INGEST_HOST</code> to that machine. Drop the downloaded file over <code>src/main.c</code> if you want the path baked in.",
    westLabel: "From a Zephyr workspace:",
    step5Html:
      "Serial 115200: <code>dhcp ok</code>, then <code>POST 200</code>. Sensor key <code>temp1</code> imports on first POST.",
    repoHtml: `Repo app: ${repoApp} (<code>prj.conf</code>, D4 overlay, CMake).`,
  },
  otherBoardsTitle: "Other STM32 boards",
  otherBoardsHtml:
    "Any Zephyr Ethernet target can run the same C if you add a 1-Wire overlay for your GPIO. Nucleo-F429ZI and Nucleo-H743ZI are the usual cousins. A Blue Pill plus W5500 is C as well, but that is Cube HAL + ioLibrary, not this Zephyr app: use the LAN relay the same way.",
  whyNot: {
    title: "Why not Nordic / TI first?",
    itemsHtml: [
      "<strong>nRF52</strong>: Bluetooth or Thread, not native Wi‑Fi HTTPS.",
      "<strong>nRF9160</strong>: LTE-M works, but a SIM and carrier plan is a worse first freeze kit than a garage Ethernet drop.",
      "<strong>TI SimpleLink / NXP RW612</strong>: capable Wi‑Fi C SDKs, smaller hobbyist footprint than Nucleo + Zephyr.",
      '<strong>CH32V307</strong> is first-class now: <a class="text-link" href="/about/ch32v-riscv-ingest">WCHNET C + onboard Ethernet</a> (QingKe RISC-V, same LAN TLS relay).',
    ],
  },
  related: {
    title: "Related",
    itemsHtml: [
      '<a class="text-link" href="/about/adding-devices">Adding devices</a>',
      '<a class="text-link" href="/about/pico-w-ingest">Raspberry Pi Pico W ingest</a>',
      '<a class="text-link" href="/about/ch32v-riscv-ingest">CH32V RISC-V ingest</a>',
      '<a class="text-link" href="/about/esp32-freeze-kit">ESP32 freeze kit parts list</a>',
      '<a class="text-link" href="/about/python-feeds">Python HTTPS relay</a>',
      allSketches("All sketches"),
    ],
  },
};
type Stm32ZephyrIngestMessages = typeof en;

const es: Stm32ZephyrIngestMessages = {
  intro1Html:
    "El ESP32 y la Pico W cubren el Wi‑Fi. Si quieres otro fabricante de chips y una cadena de herramientas que no sea ni Arduino ni Python, una <strong>ST Nucleo-F767ZI</strong> con <strong>Zephyr</strong> envía por POST el mismo JSON de ingesta a través de su Ethernet integrado. C, <code>west</code>, ST-LINK. El conector compatible con Arduino es solo un patillaje: el firmware no es un sketch de Arduino.",
  intro2Html:
    'Usar HTTPS nativo en Zephyr implica incrustar en la imagen una CA de la CDN, y eso falla cuando rota la cadena de certificados del edge. Este ejemplo usa el mismo relé HTTP→HTTPS en la LAN que la opción <a class="text-link" href="/about/arduino-sketches">Uno + W5100</a>, así Cloudflare puede cambiar de CA sin que tengas que volver a flashear.',
  parts: {
    title: "Piezas",
    caption: "Piezas para una sonda de congelación STM32 con Zephyr",
    colPart: "Pieza",
    colWhy: "Por qué",
    colBuy: "Comprar",
    boardWhy: "Cortex-M7, MAC + PHY Ethernet integrados, depurador ST-LINK. Sin módulo Wi‑Fi.",
    probePart: "DS18B20 impermeable",
    probeWhyHtml: "Sonda para tuberías o sótano ventilado. Datos en el pin Arduino <strong>D4</strong> (PF14).",
    amazon: "Amazon",
    resistorPart: "Resistencia de 4,7 kΩ",
    resistorWhy: "Pull-up desde los datos del DS18B20 a 3,3 V. No alimentes la sonda desde el pin de 5 V de Arduino.",
    amazonResistor: "4,7k en Amazon",
    ethernetPart: "Toma Ethernet",
    ethernetWhy: "DHCP en tu LAN. Una Pi, un NAS o un portátil ejecuta el relé TLS.",
    ethernetBuy: "Cualquier latiguillo Cat5e hasta tu switch.",
  },
  wiringTitle: "Cableado",
  wiringHtml: [
    "DS18B20 VDD → Nucleo <strong>3.3V</strong>",
    "DS18B20 GND → GND",
    "Datos del DS18B20 → Arduino <strong>D4</strong> (STM32 <strong>PF14</strong>), 4,7k a 3,3 V",
    "RJ45 → LAN. USB del ST-LINK para flashear y para el puerto serie a 115200.",
  ],
  build: {
    title: "Compilar y flashear",
    step1Html:
      'Abre <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> y descarga <strong>Zephyr main.c</strong> (con la ruta de ingesta ya rellenada), o copia los defines del aviso de ingesta.',
    relayLabel: "En un equipo de la LAN:",
    step3Html:
      "Define <code>INGEST_HOST</code> con esa máquina. Sustituye <code>src/main.c</code> por el archivo descargado si quieres llevar la ruta incrustada.",
    westLabel: "Desde un espacio de trabajo de Zephyr:",
    step5Html:
      "Puerto serie a 115200: <code>dhcp ok</code> y luego <code>POST 200</code>. La clave de sensor <code>temp1</code> se importa con el primer POST.",
    repoHtml: `Aplicación en el repositorio: ${repoApp} (<code>prj.conf</code>, overlay para D4, CMake).`,
  },
  otherBoardsTitle: "Otras placas STM32",
  otherBoardsHtml:
    "Cualquier placa Zephyr con Ethernet puede ejecutar el mismo C si añades un overlay 1-Wire para tu GPIO. Las Nucleo-F429ZI y Nucleo-H743ZI son las primas habituales. Una Blue Pill con W5500 también es C, pero eso es Cube HAL + ioLibrary, no esta aplicación de Zephyr: usa el relé de la LAN de la misma manera.",
  whyNot: {
    title: "¿Por qué no empezar por Nordic o TI?",
    itemsHtml: [
      "<strong>nRF52</strong>: Bluetooth o Thread, no HTTPS nativo por Wi‑Fi.",
      "<strong>nRF9160</strong>: LTE-M funciona, pero una SIM y un plan con operador son peor primer kit de congelación que una toma Ethernet en el garaje.",
      "<strong>TI SimpleLink / NXP RW612</strong>: SDK en C con Wi‑Fi muy capaces, pero con menos comunidad aficionada que Nucleo + Zephyr.",
      '<strong>CH32V307</strong> ya tiene soporte oficial: <a class="text-link" href="/about/ch32v-riscv-ingest">WCHNET C + Ethernet integrado</a> (RISC-V QingKe, el mismo relé TLS en la LAN).',
    ],
  },
  related: {
    title: "Relacionado",
    itemsHtml: [
      '<a class="text-link" href="/about/adding-devices">Añadir dispositivos</a>',
      '<a class="text-link" href="/about/pico-w-ingest">Ingesta con Raspberry Pi Pico W</a>',
      '<a class="text-link" href="/about/ch32v-riscv-ingest">Ingesta con CH32V RISC-V</a>',
      '<a class="text-link" href="/about/esp32-freeze-kit">Lista de piezas del kit ESP32 de congelación</a>',
      '<a class="text-link" href="/about/python-feeds">Relé HTTPS en Python</a>',
      allSketches("Todos los sketches"),
    ],
  },
};

const fr: Stm32ZephyrIngestMessages = {
  intro1Html:
    "L’ESP32 et le Pico W couvrent le Wi‑Fi. Si vous voulez un autre fondeur et une chaîne d’outils qui ne soit ni Arduino ni Python, une <strong>ST Nucleo-F767ZI</strong> sous <strong>Zephyr</strong> envoie en POST le même JSON d’ingestion via son Ethernet intégré. C, <code>west</code>, ST-LINK. Le connecteur compatible Arduino n’est qu’un brochage : le firmware n’est pas un sketch Arduino.",
  intro2Html:
    'Faire du HTTPS natif sous Zephyr implique d’embarquer une CA du CDN dans l’image, ce qui casse dès que la chaîne de certificats de l’edge change. Cet exemple utilise le même relais HTTP→HTTPS sur le LAN que la solution <a class="text-link" href="/about/arduino-sketches">Uno + W5100</a> : Cloudflare peut ainsi changer de CA sans reflashage.',
  parts: {
    title: "Pièces",
    caption: "Pièces pour une sonde antigel STM32 sous Zephyr",
    colPart: "Pièce",
    colWhy: "Pourquoi",
    colBuy: "Acheter",
    boardWhy: "Cortex-M7, MAC + PHY Ethernet intégrés, débogueur ST-LINK. Pas de module Wi‑Fi.",
    probePart: "DS18B20 étanche",
    probeWhyHtml: "Sonde pour tuyau ou vide sanitaire. Donnée sur la broche Arduino <strong>D4</strong> (PF14).",
    amazon: "Amazon",
    resistorPart: "Résistance de 4,7 kΩ",
    resistorWhy: "Pull-up entre la donnée du DS18B20 et le 3,3 V. N’alimentez pas la sonde depuis la broche 5 V Arduino.",
    amazonResistor: "4,7k sur Amazon",
    ethernetPart: "Prise Ethernet",
    ethernetWhy: "DHCP sur votre LAN. Un Pi, un NAS ou un portable fait tourner le relais TLS.",
    ethernetBuy: "N’importe quel câble de brassage Cat5e jusqu’à votre switch.",
  },
  wiringTitle: "Câblage",
  wiringHtml: [
    "DS18B20 VDD → Nucleo <strong>3.3V</strong>",
    "DS18B20 GND → GND",
    "Donnée du DS18B20 → Arduino <strong>D4</strong> (STM32 <strong>PF14</strong>), 4,7k vers le 3,3 V",
    "RJ45 → LAN. USB ST-LINK pour le flashage et le port série à 115200.",
  ],
  build: {
    title: "Compiler et flasher",
    step1Html:
      'Ouvrez <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> et téléchargez <strong>Zephyr main.c</strong> (chemin d’ingestion prérempli), ou copiez les defines depuis l’encadré d’ingestion.',
    relayLabel: "Sur une machine du LAN :",
    step3Html:
      "Renseignez <code>INGEST_HOST</code> avec cette machine. Remplacez <code>src/main.c</code> par le fichier téléchargé si vous voulez que le chemin soit intégré.",
    westLabel: "Depuis un espace de travail Zephyr :",
    step5Html:
      "Port série à 115200 : <code>dhcp ok</code>, puis <code>POST 200</code>. La clé de capteur <code>temp1</code> s’importe au premier POST.",
    repoHtml: `Application du dépôt : ${repoApp} (<code>prj.conf</code>, overlay D4, CMake).`,
  },
  otherBoardsTitle: "Autres cartes STM32",
  otherBoardsHtml:
    "Toute cible Zephyr avec Ethernet peut exécuter le même C si vous ajoutez un overlay 1-Wire pour votre GPIO. Les Nucleo-F429ZI et Nucleo-H743ZI sont les cousines habituelles. Une Blue Pill avec W5500 se programme aussi en C, mais avec Cube HAL + ioLibrary, pas avec cette application Zephyr : utilisez le relais LAN de la même façon.",
  whyNot: {
    title: "Pourquoi pas Nordic ou TI d’abord ?",
    itemsHtml: [
      "<strong>nRF52</strong> : Bluetooth ou Thread, pas de HTTPS natif en Wi‑Fi.",
      "<strong>nRF9160</strong> : le LTE-M fonctionne, mais une carte SIM et un forfait opérateur font un moins bon premier kit antigel qu’une prise Ethernet dans le garage.",
      "<strong>TI SimpleLink / NXP RW612</strong> : des SDK C Wi‑Fi performants, mais une communauté amateur plus réduite que Nucleo + Zephyr.",
      '<strong>CH32V307</strong> est désormais pris en charge officiellement : <a class="text-link" href="/about/ch32v-riscv-ingest">WCHNET C + Ethernet intégré</a> (RISC-V QingKe, même relais TLS sur le LAN).',
    ],
  },
  related: {
    title: "À lire aussi",
    itemsHtml: [
      '<a class="text-link" href="/about/adding-devices">Ajouter des appareils</a>',
      '<a class="text-link" href="/about/pico-w-ingest">Ingestion avec le Raspberry Pi Pico W</a>',
      '<a class="text-link" href="/about/ch32v-riscv-ingest">Ingestion avec CH32V RISC-V</a>',
      '<a class="text-link" href="/about/esp32-freeze-kit">Liste des pièces du kit antigel ESP32</a>',
      '<a class="text-link" href="/about/python-feeds">Relais HTTPS en Python</a>',
      allSketches("Tous les sketches"),
    ],
  },
};

const de: Stm32ZephyrIngestMessages = {
  intro1Html:
    "ESP32 und Pico W decken WLAN ab. Wenn du einen anderen Chiphersteller und eine Toolchain willst, die weder Arduino noch Python ist, sendet ein <strong>ST Nucleo-F767ZI</strong> mit <strong>Zephyr</strong> dasselbe Ingest-JSON per POST über das Onboard-Ethernet. C, <code>west</code>, ST-LINK. Die Arduino-kompatible Stiftleiste ist nur eine Pinbelegung: Die Firmware ist kein Arduino-Sketch.",
  intro2Html:
    'Natives HTTPS unter Zephyr heißt, eine CDN-CA fest ins Image einzubauen – und das bricht, sobald die Zertifikatskette am Edge wechselt. Dieses Beispiel nutzt dasselbe HTTP→HTTPS-Relay im LAN wie der Weg mit <a class="text-link" href="/about/arduino-sketches">Uno + W5100</a>, sodass Cloudflare die CAs wechseln kann, ohne dass du neu flashen musst.',
  parts: {
    title: "Teile",
    caption: "Teile für einen STM32-Zephyr-Frostfühler",
    colPart: "Teil",
    colWhy: "Wozu",
    colBuy: "Kaufen",
    boardWhy: "Cortex-M7, Ethernet-MAC + PHY an Bord, ST-LINK-Debugger. Kein WLAN-Modul.",
    probePart: "Wasserdichter DS18B20",
    probeWhyHtml: "Fühler für Rohr oder Kriechkeller. Daten an Arduino-Pin <strong>D4</strong> (PF14).",
    amazon: "Amazon",
    resistorPart: "4,7-kΩ-Widerstand",
    resistorWhy: "Pull-up von der DS18B20-Datenleitung auf 3,3 V. Versorge den Fühler nicht über den 5-V-Arduino-Pin.",
    amazonResistor: "4,7k bei Amazon",
    ethernetPart: "Ethernet-Anschluss",
    ethernetWhy: "DHCP in deinem LAN. Ein Pi, NAS oder Laptop betreibt das TLS-Relay.",
    ethernetBuy: "Beliebiges Cat5e-Patchkabel zu deinem Switch.",
  },
  wiringTitle: "Verdrahtung",
  wiringHtml: [
    "DS18B20 VDD → Nucleo <strong>3.3V</strong>",
    "DS18B20 GND → GND",
    "DS18B20-Daten → Arduino <strong>D4</strong> (STM32 <strong>PF14</strong>), 4,7k nach 3,3 V",
    "RJ45 → LAN. ST-LINK-USB zum Flashen und für die serielle Schnittstelle mit 115200.",
  ],
  build: {
    title: "Bauen und flashen",
    step1Html:
      'Öffne <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> und lade <strong>Zephyr main.c</strong> herunter (Ingest-Pfad bereits eingetragen), oder kopiere die Defines aus dem Ingest-Hinweis.',
    relayLabel: "Auf einem Rechner im LAN:",
    step3Html:
      "Setze <code>INGEST_HOST</code> auf diesen Rechner. Ersetze <code>src/main.c</code> durch die heruntergeladene Datei, wenn der Pfad fest eingebaut sein soll.",
    westLabel: "Aus einem Zephyr-Workspace:",
    step5Html:
      "Seriell mit 115200: <code>dhcp ok</code>, dann <code>POST 200</code>. Der Sensorschlüssel <code>temp1</code> wird beim ersten POST importiert.",
    repoHtml: `App im Repo: ${repoApp} (<code>prj.conf</code>, D4-Overlay, CMake).`,
  },
  otherBoardsTitle: "Andere STM32-Boards",
  otherBoardsHtml:
    "Jedes Zephyr-Ziel mit Ethernet kann denselben C-Code ausführen, wenn du ein 1-Wire-Overlay für deinen GPIO ergänzt. Nucleo-F429ZI und Nucleo-H743ZI sind die üblichen Verwandten. Ein Blue Pill mit W5500 ist ebenfalls C, aber mit Cube HAL + ioLibrary, nicht mit dieser Zephyr-App: Nutze das LAN-Relay auf dieselbe Weise.",
  whyNot: {
    title: "Warum nicht zuerst Nordic oder TI?",
    itemsHtml: [
      "<strong>nRF52</strong>: Bluetooth oder Thread, kein natives HTTPS über WLAN.",
      "<strong>nRF9160</strong>: LTE-M funktioniert, aber SIM-Karte und Mobilfunkvertrag sind ein schlechteres erstes Frost-Kit als ein Ethernet-Anschluss in der Garage.",
      "<strong>TI SimpleLink / NXP RW612</strong>: leistungsfähige WLAN-SDKs in C, aber eine kleinere Bastler-Community als Nucleo + Zephyr.",
      '<strong>CH32V307</strong> wird jetzt offiziell unterstützt: <a class="text-link" href="/about/ch32v-riscv-ingest">WCHNET C + Onboard-Ethernet</a> (QingKe RISC-V, dasselbe TLS-Relay im LAN).',
    ],
  },
  related: {
    title: "Verwandte Themen",
    itemsHtml: [
      '<a class="text-link" href="/about/adding-devices">Geräte hinzufügen</a>',
      '<a class="text-link" href="/about/pico-w-ingest">Datenübertragung mit dem Raspberry Pi Pico W</a>',
      '<a class="text-link" href="/about/ch32v-riscv-ingest">Datenübertragung mit CH32V RISC-V</a>',
      '<a class="text-link" href="/about/esp32-freeze-kit">Teileliste für das ESP32-Frost-Kit</a>',
      '<a class="text-link" href="/about/python-feeds">HTTPS-Relay in Python</a>',
      allSketches("Alle Sketches"),
    ],
  },
};

const ptBr: Stm32ZephyrIngestMessages = {
  intro1Html:
    "O ESP32 e a Pico W cobrem o Wi‑Fi. Se você quer outro fabricante de chips e uma toolchain que não seja nem Arduino nem Python, uma <strong>ST Nucleo-F767ZI</strong> rodando <strong>Zephyr</strong> envia via POST o mesmo JSON de ingestão pela Ethernet da placa. C, <code>west</code>, ST-LINK. O conector compatível com Arduino é só uma pinagem: o firmware não é um sketch de Arduino.",
  intro2Html:
    'HTTPS nativo no Zephyr significa embutir uma CA da CDN na imagem, o que quebra quando a cadeia de certificados do edge muda. Este exemplo usa o mesmo relay HTTP→HTTPS na rede local do caminho <a class="text-link" href="/about/arduino-sketches">Uno + W5100</a>, assim a Cloudflare pode trocar de CA sem você precisar regravar a placa.',
  parts: {
    title: "Peças",
    caption: "Peças para uma sonda de congelamento STM32 com Zephyr",
    colPart: "Peça",
    colWhy: "Por quê",
    colBuy: "Comprar",
    boardWhy: "Cortex-M7, MAC + PHY Ethernet na placa, depurador ST-LINK. Sem módulo Wi‑Fi.",
    probePart: "DS18B20 à prova d’água",
    probeWhyHtml: "Sonda para cano ou porão. Dados no pino Arduino <strong>D4</strong> (PF14).",
    amazon: "Amazon",
    resistorPart: "Resistor de 4,7 kΩ",
    resistorWhy: "Pull-up dos dados do DS18B20 para 3,3 V. Não alimente a sonda pelo pino de 5 V do Arduino.",
    amazonResistor: "4,7k na Amazon",
    ethernetPart: "Ponto de rede",
    ethernetWhy: "DHCP na sua rede local. Uma Pi, um NAS ou um notebook roda o relay TLS.",
    ethernetBuy: "Qualquer cabo de rede Cat5e até o seu switch.",
  },
  wiringTitle: "Ligação",
  wiringHtml: [
    "DS18B20 VDD → Nucleo <strong>3.3V</strong>",
    "DS18B20 GND → GND",
    "Dados do DS18B20 → Arduino <strong>D4</strong> (STM32 <strong>PF14</strong>), 4,7k para 3,3 V",
    "RJ45 → rede local. USB do ST-LINK para gravar e para a serial a 115200.",
  ],
  build: {
    title: "Compilar e gravar",
    step1Html:
      'Abra <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> e baixe <strong>Zephyr main.c</strong> (com o caminho de ingestão já preenchido), ou copie os defines do aviso de ingestão.',
    relayLabel: "Num computador da rede local:",
    step3Html:
      "Defina <code>INGEST_HOST</code> como essa máquina. Substitua <code>src/main.c</code> pelo arquivo baixado se quiser o caminho embutido.",
    westLabel: "A partir de um workspace do Zephyr:",
    step5Html:
      "Serial a 115200: <code>dhcp ok</code> e depois <code>POST 200</code>. A chave de sensor <code>temp1</code> é importada no primeiro POST.",
    repoHtml: `App no repositório: ${repoApp} (<code>prj.conf</code>, overlay do D4, CMake).`,
  },
  otherBoardsTitle: "Outras placas STM32",
  otherBoardsHtml:
    "Qualquer placa Zephyr com Ethernet roda o mesmo C se você adicionar um overlay 1-Wire para o seu GPIO. A Nucleo-F429ZI e a Nucleo-H743ZI são as primas mais comuns. Uma Blue Pill com W5500 também é C, mas com Cube HAL + ioLibrary, não com este app Zephyr: use o relay da rede local do mesmo jeito.",
  whyNot: {
    title: "Por que não começar por Nordic ou TI?",
    itemsHtml: [
      "<strong>nRF52</strong>: Bluetooth ou Thread, sem HTTPS nativo por Wi‑Fi.",
      "<strong>nRF9160</strong>: o LTE-M funciona, mas um chip e um plano de operadora são um primeiro kit de congelamento pior do que um ponto de rede na garagem.",
      "<strong>TI SimpleLink / NXP RW612</strong>: SDKs em C com Wi‑Fi bem capazes, mas com uma comunidade hobbista menor que a de Nucleo + Zephyr.",
      '<strong>CH32V307</strong> agora tem suporte oficial: <a class="text-link" href="/about/ch32v-riscv-ingest">WCHNET C + Ethernet na placa</a> (RISC-V QingKe, o mesmo relay TLS na rede local).',
    ],
  },
  related: {
    title: "Relacionados",
    itemsHtml: [
      '<a class="text-link" href="/about/adding-devices">Adicionar dispositivos</a>',
      '<a class="text-link" href="/about/pico-w-ingest">Ingestão com Raspberry Pi Pico W</a>',
      '<a class="text-link" href="/about/ch32v-riscv-ingest">Ingestão com CH32V RISC-V</a>',
      '<a class="text-link" href="/about/esp32-freeze-kit">Lista de peças do kit de congelamento ESP32</a>',
      '<a class="text-link" href="/about/python-feeds">Relay HTTPS em Python</a>',
      allSketches("Todos os sketches"),
    ],
  },
};

export const stm32ZephyrIngestMessages = defineMessages({ en, es, fr, de, "pt-br": ptBr });
