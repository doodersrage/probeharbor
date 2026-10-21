import type { DeviceSetupFirmwareMessages } from "./en";

const fr: DeviceSetupFirmwareMessages = {
  srTitle: "Flasher le firmware",
  esp32Heading: "Configurer un ESP32 depuis ce navigateur",
  esp32Lede:
    "Sans Arduino IDE : installez le firmware par USB, puis envoyez-lui votre Wi‑Fi et la clé de cet appareil (déjà renseignée). Chrome ou Edge sur un ordinateur. Fonctionne avec un DS18B20, un DHT22 ou un capteur I²C sur les broches indiquées.",
  preferCode: "Vous préférez le code ? Arduino IDE, MicroPython ou ESPHome",
  esp32StepsHtml: [
    "Installez la prise en charge des cartes <strong>ESP32</strong> (ou ESP8266) dans Arduino IDE / PlatformIO, pas les exemples Uno Ethernet. Le Pico W utilise un autre téléchargement, plus bas.",
    "Bibliothèques : <code>OneWire</code>, <code>DallasTemperature</code> (gestionnaire de bibliothèques). MicroPython a besoin de <code>onewire</code> / <code>ds18x20</code> (généralement inclus).",
    "Modifiez <code>WIFI_SSID</code> / <code>WIFI_PASS</code> dans le fichier téléchargé, puis flashez par USB.",
    "Moniteur série à <strong>115200</strong> bauds : vous devez voir <code>WiFi ok</code> puis <code>POST 200</code>.",
  ],
  downloadIno: "Télécharger le .ino Arduino",
  downloadMicropython: "Télécharger le .py MicroPython",
  downloadEsphome: "Télécharger l’extrait ESPHome",
  allSketches: "Tous les sketches ↗",
  presetsSummary: "Modèles de firmware (copier-coller)",
  payloadCheckerHtml:
    'Vous écrivez votre propre payload ? Collez-le dans le <a class="text-link" href="/payload-checker">vérificateur de payload</a> pour voir ce que devient chaque champ avant de l’envoyer.',
  copy: "Copier",
  presets: {
    arduinoHttps: "Client HTTPS Arduino (chemin + hôte de votre URL)",
    unoEthernet: "Uno + shield Ethernet (relais HTTP)",
    zephyr: "STM32 Zephyr Ethernet (relais HTTP)",
    ch32v: "CH32V307 WCHNET Ethernet (relais HTTP)",
    avr: "ATmega328P en assembleur AVR, Ethernet (relais HTTP)",
    teensy: "Teensy 4.1 QNEthernet (relais HTTP)",
    pic18: "PIC18F67J60 MLA Ethernet (relais HTTP)",
    particle: "Particle Boron cellulaire (webhook Console)",
  },
  otherBoards:
    "Autres cartes : Pico W, STM32, CH32V, AVR, Teensy, PIC18, cellulaire",
  pico: {
    heading: "Flasher un Pico W",
    ledeHtml:
      "Raspberry Pi <strong>Pico W</strong> ou <strong>Pico 2 W</strong> (RP2040 / RP2350) avec le même DS18B20 sur <strong>GP4</strong> → <code>temp1</code>. CircuitPython s’installe par glisser-déposer sur le lecteur <code>CIRCUITPY</code>. MicroPython et le .ino Arduino ci-dessus compilent aussi pour le Pico W (cœur Earle Philhower).",
    stepsHtml: [
      "Maintenez BOOTSEL, branchez l’USB, déposez l’UF2 CircuitPython pour Pico W ou Pico 2 W.",
      "Installez les bibliothèques : <code>circup install adafruit_requests adafruit_connection_manager adafruit_ds18x20 adafruit_onewire</code>",
      "Modifiez <code>WIFI_SSID</code> / <code>WIFI_PASS</code>, enregistrez sous <code>code.py</code>, attendez <code>POST 200</code> sur le moniteur série.",
    ],
    download: "Télécharger le code.py CircuitPython",
    guide: "Guide Pico W",
  },
  stm32: {
    heading: "Flasher un STM32 (Zephyr)",
    ledeHtml:
      "ST <strong>Nucleo-F767ZI</strong> en C sous Zephyr : Ethernet intégré, ST-LINK, sans Arduino IDE ni Python. Même DS18B20 sur la broche Arduino <strong>D4</strong> (PF14) → <code>temp1</code>. HTTP vers le relais TLS du réseau local, comme le shield Ethernet de l’Uno.",
    stepsHtml: [
      "Installez le SDK Zephyr et <code>west</code>. Branchez la Nucleo en USB ST-LINK.",
      "Lancez <code>sketches/relay/push_https_forward.py</code> sur une machine du réseau local. Réglez <code>INGEST_HOST</code> sur cette machine.",
      "<code>west build -b nucleo_f767zi sketches/zephyr/ds18b20_ingest</code> puis <code>west flash</code>. Série à <strong>115200</strong> : <code>dhcp ok</code>, puis <code>POST 200</code>.",
    ],
    download: "Télécharger le main.c Zephyr",
    guide: "Guide STM32 Zephyr",
  },
  ch32v: {
    heading: "Flasher un CH32V (RISC-V)",
    ledeHtml:
      "WCH <strong>CH32V307V-EVT-R1</strong> en C sous WCHNET : RISC-V QingKe, Ethernet 10M intégré, MounRiver Studio. Ni Arduino, ni Python, ni Zephyr. DS18B20 sur <strong>PB12</strong> → <code>temp1</code>. HTTP vers le relais TLS du réseau local, comme Uno / STM32 Ethernet.",
    stepsHtml: [
      "Installez MounRiver Studio. Ouvrez le projet officiel EVT <code>ETH/DHCP</code>. Branchez le WCH-Link.",
      "Lancez <code>sketches/relay/push_https_forward.py</code> sur une machine du réseau local. Réglez <code>INGEST_HOST</code> sur cette machine.",
      "Remplacez <code>User/main.c</code> par le téléchargement ci-dessous, compilez, flashez. Série à <strong>115200</strong> : <code>dhcp ok</code>, puis <code>POST 200</code>.",
    ],
    download: "Télécharger le main.c CH32V",
    guide: "Guide CH32V RISC-V",
  },
  avr: {
    heading: "Flasher de l’assembleur AVR (Uno + W5100)",
    ledeHtml:
      "Arduino <strong>Uno / ATmega328P</strong> en assembleur GNU AVR : sans C Arduino ni Python. Même shield W5100 et même relais TLS local que le sketch Uno Ethernet. DS18B20 sur <strong>D7</strong> (D4 est le chip-select SD du shield).",
    stepsHtml: [
      "Installez <code>avr-gcc</code>, <code>avr-libc</code> et <code>avrdude</code>. Branchez l’Uno en USB.",
      "Lancez <code>sketches/relay/push_https_forward.py</code> sur une machine du réseau local. Réglez <code>ingest_ip</code> sur cette machine.",
      "<code>make flash</code> dans <code>sketches/avr/atmega328_w5100_ds18b20/</code>, ou assemblez le téléchargement ci-dessous. Série à <strong>115200</strong> : <code>link ok</code>, puis <code>POST 200</code>.",
    ],
    download: "Télécharger le main.S AVR",
    guide: "Guide assembleur AVR",
  },
  teensy: {
    heading: "Flasher une Teensy 4.1",
    ledeHtml:
      "PJRC <strong>Teensy 4.1</strong> + kit Ethernet dans Teensyduino avec <strong>QNEthernet</strong>. DS18B20 sur la <strong>broche 4</strong> → <code>temp1</code>. HTTP vers le relais TLS du réseau local.",
    stepsHtml: [
      "Installez Teensyduino. Bibliothèques : <code>QNEthernet</code>, <code>OneWire</code>, <code>DallasTemperature</code>.",
      "Lancez <code>sketches/relay/push_https_forward.py</code> sur une machine du réseau local. Réglez <code>INGEST_HOST</code> sur cette machine.",
      "Flashez le téléchargement ci-dessous. Série à <strong>115200</strong> : <code>link ok</code>, puis <code>POST 200</code>.",
    ],
    download: "Télécharger le .ino Teensy 4.1",
    guide: "Guide Teensy 4.1",
  },
  pic18: {
    heading: "Flasher un PIC18F67J60",
    ledeHtml:
      "Microchip <strong>PIC18F67J60</strong> sous MPLAB X / XC8 avec la TCP/IP Stack classique : MAC/PHY Ethernet intégré. DS18B20 sur <strong>RD0</strong> → <code>temp1</code>. HTTP vers le relais TLS du réseau local.",
    stepsHtml: [
      "Installez MPLAB X + XC8. Ouvrez une démo Ethernet MLA pour PIC18F67J60.",
      "Lancez <code>sketches/relay/push_https_forward.py</code> sur une machine du réseau local. Réglez <code>INGEST_HOST</code> sur cette machine.",
      "Ajoutez le téléchargement ci-dessous, appelez <code>ProbeHarborAppInit</code> / <code>ProbeHarborAppTask</code> depuis la boucle de la démo, compilez, flashez avec un PICkit.",
    ],
    download: "Télécharger le main.c PIC18",
    guide: "Guide PIC18 Ethernet",
  },
  cellular: {
    heading: "Flasher en cellulaire (Particle Boron)",
    ledeHtml:
      "<strong>Particle Boron</strong> / B-Series en LTE : pas besoin de Wi‑Fi au garage. Le firmware publie du JSON ; un webhook Console envoie un POST à votre URL d’ingestion HTTPS. La détection des sondes muettes couvre les coupures.",
    stepsHtml: [
      "Particle Workbench ou Web IDE, Device OS 5+. Bibliothèques : <code>OneWire</code>, <code>spark-dallas-temperature</code>.",
      "Flashez le .ino ci-dessous. Créez un webhook Console à partir du téléchargement JSON (URL déjà renseignée).",
      "Série à <strong>115200</strong> : <code>publish ok</code>. Vérifiez le HTTP 200 dans l’historique du webhook.",
    ],
    download: "Télécharger le .ino Particle Boron",
    downloadWebhook: "Télécharger le JSON du webhook",
    guide: "Guide cellulaire",
  },
  moreHelp: "Plus d’aide :",
  helpLinks: {
    esp32: "Flasher un ESP32",
    pico: "Ingestion Pico W",
    stm32: "STM32 Zephyr",
    ch32v: "CH32V RISC-V",
    avr: "Assembleur AVR",
    teensy: "Teensy 4.1",
    pic18: "PIC18 Ethernet",
    cellular: "Cellulaire",
    addingDevices: "Ajouter des appareils",
    kitQr: "QR du kit",
    apiIngest: "Ingestion par API",
    ota: "Notes OTA",
    unoSketch: "Sketch Uno Ethernet",
  },
};

export default fr;
