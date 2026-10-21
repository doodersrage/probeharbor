import { defineMessages } from "../../translate";

/** /about/esp32-web-flash body copy. `Html` keys are trusted inline HTML; hrefs stay English. */
const en = {
  introHtml:
    'The quickest path is the <a class="text-link" href="/flash">browser flasher</a> (beta): it installs prebuilt firmware over USB and sends the board your Wi‑Fi and device key, with no IDE. It works with DS18B20 probes (up to four) or a DHT22/DHT11 for temperature and humidity, all wired to GPIO 4. If you want to read or change the code, create a push device → <strong>download a pre-filled sketch</strong> → flash with a tool you already trust.',
  devicesTitle: "1. Download from Devices (recommended)",
  devicesStep1Html:
    'Open <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> and create a push device.',
  devicesStep2Html:
    "On the ingest callout, download <strong>Arduino .ino</strong>, <strong>MicroPython .py</strong>, <strong>CircuitPython code.py</strong> (Pico W), or <strong>ESPHome</strong>: the ingest URL is already filled; set Wi‑Fi only.",
  devicesStep3Html:
    "Follow the ESP32 checklist on that card (board package, libraries, Serial 115200 → <code>POST 200</code>).",
  arduinoTitle: "2. Arduino IDE",
  arduinoItem1Html:
    "Install <strong>ESP32</strong> board support (Espressif), not the Uno Ethernet garage-LCD path.",
  arduinoItem2Html: "Libraries: <code>OneWire</code>, <code>DallasTemperature</code> (Library Manager).",
  arduinoItem3Html: "Open the downloaded <code>.ino</code>, set <code>WIFI_*</code>, select the port, flash.",
  pioTitle: "3. PlatformIO",
  pioBodyHtml:
    'Repo sample <a class="text-link" href="https://github.com/doodersrage/probeharbor/tree/main/sketches/arduino/ds18b20_ingest" target="_blank" rel="noreferrer"><code>sketches/arduino/ds18b20_ingest/</code></a> includes a <code>platformio.ini</code> with pinned libs and <code>monitor_speed = 115200</code>. Pass ingest URL via build flags or paste the Devices-generated sketch into <code>src/main.cpp</code>.',
  microTitle: "4. MicroPython (Thonny / mpremote)",
  microBodyHtml:
    "Flash a MicroPython image once, then copy the downloaded <code>main.py</code> (ingest URL pre-filled). No Arduino board package required.",
  esptoolTitle: "5. Browser esptool (when you already have a .bin)",
  esptoolBodyHtml:
    "If you build a binary locally (PlatformIO <code>pio run</code>), you can flash it from Chrome/Edge with Espressif’s Web Serial tool: useful on locked-down PCs without a full IDE:",
  esptoolNote:
    "That tool flashes bits you provide; it does not know your ProbeHarbor key. Keep using the Devices download to bake the URL into source before you build.",
  portalTitle: "6. Wi‑Fi via captive portal",
  portalBodyHtml:
    'Avoid baking SSID/password into source with the <a class="text-link" href="https://github.com/doodersrage/probeharbor/tree/main/sketches/arduino/ds18b20_wifimanager" target="_blank" rel="noreferrer">WiFiManager sample</a> join the config AP once, then the probe stores credentials. Still set <code>INGEST_URL</code> from Devices (or download and merge).',
  relatedTitle: "Related",
  related: {
    kit: "ESP32 freeze kit parts list",
    pico: "Raspberry Pi Pico W ingest",
    stm32: "STM32 Zephyr ingest",
    ch32v: "CH32V RISC-V ingest",
    avr: "AVR assembly ingest",
    adding: "Adding devices",
    ota: "OTA and battery / RSSI",
    qr: "Kit QR",
    sketches: "All sketches ↗",
  },
};

type Esp32WebFlashMessages = typeof en;

const es: Esp32WebFlashMessages = {
  introHtml:
    'El camino más rápido es el <a class="text-link" href="/flash">flasheador desde el navegador</a> (beta): instala un firmware precompilado por USB y envía a la placa tu Wi‑Fi y la clave del dispositivo, sin IDE. Funciona con sondas DS18B20 (hasta cuatro) o con un DHT22/DHT11 para temperatura y humedad, todo conectado a GPIO 4. Si quieres leer o modificar el código, crea un dispositivo push → <strong>descarga un sketch ya configurado</strong> → flashéalo con la herramienta en la que ya confías.',
  devicesTitle: "1. Descargar desde Devices (recomendado)",
  devicesStep1Html:
    'Abre <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> y crea un dispositivo push.',
  devicesStep2Html:
    "En el recuadro de ingesta, descarga <strong>Arduino .ino</strong>, <strong>MicroPython .py</strong>, <strong>CircuitPython code.py</strong> (Pico W) o <strong>ESPHome</strong>: la URL de ingesta ya viene rellenada; solo tienes que configurar el Wi‑Fi.",
  devicesStep3Html:
    "Sigue la lista de comprobación del ESP32 de esa tarjeta (paquete de placa, bibliotecas, Serial 115200 → <code>POST 200</code>).",
  arduinoTitle: "2. Arduino IDE",
  arduinoItem1Html:
    "Instala el soporte de placas <strong>ESP32</strong> (Espressif), no el de la ruta Uno Ethernet con LCD de garaje.",
  arduinoItem2Html: "Bibliotecas: <code>OneWire</code>, <code>DallasTemperature</code> (Gestor de bibliotecas).",
  arduinoItem3Html:
    "Abre el <code>.ino</code> descargado, configura <code>WIFI_*</code>, elige el puerto y flashea.",
  pioTitle: "3. PlatformIO",
  pioBodyHtml:
    'El ejemplo del repositorio <a class="text-link" href="https://github.com/doodersrage/probeharbor/tree/main/sketches/arduino/ds18b20_ingest" target="_blank" rel="noreferrer"><code>sketches/arduino/ds18b20_ingest/</code></a> incluye un <code>platformio.ini</code> con bibliotecas de versión fija y <code>monitor_speed = 115200</code>. Pasa la URL de ingesta mediante build flags o pega el sketch generado en Devices en <code>src/main.cpp</code>.',
  microTitle: "4. MicroPython (Thonny / mpremote)",
  microBodyHtml:
    "Flashea una imagen de MicroPython una sola vez y luego copia el <code>main.py</code> descargado (con la URL de ingesta ya incluida). No necesitas el paquete de placas de Arduino.",
  esptoolTitle: "5. esptool en el navegador (si ya tienes un .bin)",
  esptoolBodyHtml:
    "Si compilas un binario en local (PlatformIO <code>pio run</code>), puedes flashearlo desde Chrome/Edge con la herramienta Web Serial de Espressif: muy útil en PC bloqueados sin un IDE completo:",
  esptoolNote:
    "Esa herramienta flashea los datos que le das; no conoce tu clave de ProbeHarbor. Sigue usando la descarga de Devices para incluir la URL en el código antes de compilar.",
  portalTitle: "6. Wi‑Fi mediante portal cautivo",
  portalBodyHtml:
    'Evita escribir el SSID y la contraseña en el código con el <a class="text-link" href="https://github.com/doodersrage/probeharbor/tree/main/sketches/arduino/ds18b20_wifimanager" target="_blank" rel="noreferrer">ejemplo de WiFiManager</a>: conéctate una vez al punto de acceso de configuración y la sonda guardará las credenciales. Aun así, configura <code>INGEST_URL</code> desde Devices (o descarga y combina).',
  relatedTitle: "Relacionado",
  related: {
    kit: "Lista de piezas del kit antiheladas ESP32",
    pico: "Ingesta con Raspberry Pi Pico W",
    stm32: "Ingesta con STM32 Zephyr",
    ch32v: "Ingesta con CH32V RISC-V",
    avr: "Ingesta en ensamblador AVR",
    adding: "Añadir dispositivos",
    ota: "OTA y batería / RSSI",
    qr: "QR del kit",
    sketches: "Todos los sketches ↗",
  },
};

const fr: Esp32WebFlashMessages = {
  introHtml:
    'Le plus rapide, c’est le <a class="text-link" href="/flash">flasheur dans le navigateur</a> (bêta) : il installe un firmware précompilé par USB et transmet à la carte votre Wi‑Fi et la clé de l’appareil, sans IDE. Il fonctionne avec des sondes DS18B20 (jusqu’à quatre) ou un DHT22/DHT11 pour la température et l’humidité, le tout câblé sur GPIO 4. Si vous voulez lire ou modifier le code, créez un appareil push → <strong>téléchargez un sketch prérempli</strong> → flashez-le avec l’outil que vous connaissez déjà.',
  devicesTitle: "1. Télécharger depuis Devices (recommandé)",
  devicesStep1Html:
    'Ouvrez <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> et créez un appareil push.',
  devicesStep2Html:
    "Dans l’encart d’ingestion, téléchargez <strong>Arduino .ino</strong>, <strong>MicroPython .py</strong>, <strong>CircuitPython code.py</strong> (Pico W) ou <strong>ESPHome</strong> : l’URL d’ingestion est déjà renseignée, il ne reste que le Wi‑Fi à configurer.",
  devicesStep3Html:
    "Suivez la check-list ESP32 de cette carte (paquet de cartes, bibliothèques, Serial 115200 → <code>POST 200</code>).",
  arduinoTitle: "2. Arduino IDE",
  arduinoItem1Html:
    "Installez la prise en charge des cartes <strong>ESP32</strong> (Espressif), et non le parcours Uno Ethernet avec écran LCD de garage.",
  arduinoItem2Html:
    "Bibliothèques : <code>OneWire</code>, <code>DallasTemperature</code> (gestionnaire de bibliothèques).",
  arduinoItem3Html:
    "Ouvrez le <code>.ino</code> téléchargé, renseignez <code>WIFI_*</code>, choisissez le port, puis flashez.",
  pioTitle: "3. PlatformIO",
  pioBodyHtml:
    'L’exemple du dépôt <a class="text-link" href="https://github.com/doodersrage/probeharbor/tree/main/sketches/arduino/ds18b20_ingest" target="_blank" rel="noreferrer"><code>sketches/arduino/ds18b20_ingest/</code></a> fournit un <code>platformio.ini</code> avec des bibliothèques aux versions figées et <code>monitor_speed = 115200</code>. Passez l’URL d’ingestion via les build flags ou collez le sketch généré par Devices dans <code>src/main.cpp</code>.',
  microTitle: "4. MicroPython (Thonny / mpremote)",
  microBodyHtml:
    "Flashez une image MicroPython une seule fois, puis copiez le <code>main.py</code> téléchargé (URL d’ingestion préremplie). Aucun paquet de cartes Arduino nécessaire.",
  esptoolTitle: "5. esptool dans le navigateur (si vous avez déjà un .bin)",
  esptoolBodyHtml:
    "Si vous compilez un binaire en local (PlatformIO <code>pio run</code>), vous pouvez le flasher depuis Chrome/Edge avec l’outil Web Serial d’Espressif, pratique sur les PC verrouillés sans IDE complet :",
  esptoolNote:
    "Cet outil flashe les données que vous lui fournissez ; il ne connaît pas votre clé ProbeHarbor. Continuez à utiliser le téléchargement Devices pour intégrer l’URL au code avant de compiler.",
  portalTitle: "6. Wi‑Fi via un portail captif",
  portalBodyHtml:
    'Évitez d’inscrire le SSID et le mot de passe dans le code grâce à l’<a class="text-link" href="https://github.com/doodersrage/probeharbor/tree/main/sketches/arduino/ds18b20_wifimanager" target="_blank" rel="noreferrer">exemple WiFiManager</a> : connectez-vous une fois au point d’accès de configuration, puis la sonde mémorise les identifiants. Renseignez tout de même <code>INGEST_URL</code> depuis Devices (ou téléchargez et fusionnez).',
  relatedTitle: "Voir aussi",
  related: {
    kit: "Liste des pièces du kit antigel ESP32",
    pico: "Ingestion avec Raspberry Pi Pico W",
    stm32: "Ingestion avec STM32 Zephyr",
    ch32v: "Ingestion avec CH32V RISC-V",
    avr: "Ingestion en assembleur AVR",
    adding: "Ajouter des appareils",
    ota: "OTA et batterie / RSSI",
    qr: "QR du kit",
    sketches: "Tous les sketches ↗",
  },
};

const de: Esp32WebFlashMessages = {
  introHtml:
    'Am schnellsten geht es mit dem <a class="text-link" href="/flash">Browser-Flasher</a> (Beta): Er installiert eine fertige Firmware per USB und überträgt dein WLAN und den Geräteschlüssel auf das Board, ganz ohne IDE. Er funktioniert mit DS18B20-Fühlern (bis zu vier) oder einem DHT22/DHT11 für Temperatur und Luftfeuchtigkeit, alle an GPIO 4 angeschlossen. Wenn du den Code lesen oder ändern willst, leg ein Push-Gerät an → <strong>lade einen vorausgefüllten Sketch herunter</strong> → flashe ihn mit einem Werkzeug, dem du bereits vertraust.',
  devicesTitle: "1. Download über Devices (empfohlen)",
  devicesStep1Html:
    'Öffne <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> und leg ein Push-Gerät an.',
  devicesStep2Html:
    "Lade im Ingest-Hinweis <strong>Arduino .ino</strong>, <strong>MicroPython .py</strong>, <strong>CircuitPython code.py</strong> (Pico W) oder <strong>ESPHome</strong> herunter: Die Ingest-URL ist bereits eingetragen, du musst nur noch das WLAN festlegen.",
  devicesStep3Html:
    "Arbeite die ESP32-Checkliste auf dieser Karte ab (Board-Paket, Bibliotheken, Serial 115200 → <code>POST 200</code>).",
  arduinoTitle: "2. Arduino IDE",
  arduinoItem1Html:
    "Installiere die Board-Unterstützung für <strong>ESP32</strong> (Espressif), nicht den Weg über Uno Ethernet mit Garagen-LCD.",
  arduinoItem2Html: "Bibliotheken: <code>OneWire</code>, <code>DallasTemperature</code> (Bibliotheksverwalter).",
  arduinoItem3Html:
    "Öffne die heruntergeladene <code>.ino</code>, setze <code>WIFI_*</code>, wähle den Port und flashe.",
  pioTitle: "3. PlatformIO",
  pioBodyHtml:
    'Das Beispiel im Repository <a class="text-link" href="https://github.com/doodersrage/probeharbor/tree/main/sketches/arduino/ds18b20_ingest" target="_blank" rel="noreferrer"><code>sketches/arduino/ds18b20_ingest/</code></a> enthält eine <code>platformio.ini</code> mit festen Bibliotheksversionen und <code>monitor_speed = 115200</code>. Übergib die Ingest-URL per Build-Flags oder füge den in Devices erzeugten Sketch in <code>src/main.cpp</code> ein.',
  microTitle: "4. MicroPython (Thonny / mpremote)",
  microBodyHtml:
    "Flashe einmalig ein MicroPython-Image und kopiere dann die heruntergeladene <code>main.py</code> (Ingest-URL bereits eingetragen). Kein Arduino-Board-Paket nötig.",
  esptoolTitle: "5. esptool im Browser (wenn du schon eine .bin hast)",
  esptoolBodyHtml:
    "Wenn du lokal ein Binary baust (PlatformIO <code>pio run</code>), kannst du es mit dem Web-Serial-Tool von Espressif aus Chrome/Edge flashen: praktisch auf abgeschotteten PCs ohne vollständige IDE:",
  esptoolNote:
    "Das Tool flasht nur, was du ihm gibst; deinen ProbeHarbor-Schlüssel kennt es nicht. Nutze weiterhin den Download aus Devices, damit die URL vor dem Bauen im Quellcode steht.",
  portalTitle: "6. WLAN über ein Captive Portal",
  portalBodyHtml:
    'Mit dem <a class="text-link" href="https://github.com/doodersrage/probeharbor/tree/main/sketches/arduino/ds18b20_wifimanager" target="_blank" rel="noreferrer">WiFiManager-Beispiel</a> musst du SSID und Passwort nicht in den Quellcode schreiben: Verbinde dich einmal mit dem Konfigurations-AP, danach speichert der Fühler die Zugangsdaten. <code>INGEST_URL</code> setzt du trotzdem aus Devices (oder herunterladen und zusammenführen).',
  relatedTitle: "Verwandte Themen",
  related: {
    kit: "Teileliste für das ESP32-Frostkit",
    pico: "Ingest mit Raspberry Pi Pico W",
    stm32: "Ingest mit STM32 Zephyr",
    ch32v: "Ingest mit CH32V RISC-V",
    avr: "Ingest in AVR-Assembler",
    adding: "Geräte hinzufügen",
    ota: "OTA sowie Akku / RSSI",
    qr: "Kit-QR-Code",
    sketches: "Alle Sketches ↗",
  },
};

const ptBr: Esp32WebFlashMessages = {
  introHtml:
    'O caminho mais rápido é o <a class="text-link" href="/flash">gravador pelo navegador</a> (beta): ele instala um firmware pré-compilado via USB e envia para a placa o seu Wi‑Fi e a chave do dispositivo, sem IDE. Funciona com sondas DS18B20 (até quatro) ou com um DHT22/DHT11 para temperatura e umidade, tudo ligado ao GPIO 4. Se você quiser ler ou alterar o código, crie um dispositivo push → <strong>baixe um sketch já preenchido</strong> → grave com a ferramenta em que você já confia.',
  devicesTitle: "1. Baixar pelo Devices (recomendado)",
  devicesStep1Html:
    'Abra <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> e crie um dispositivo push.',
  devicesStep2Html:
    "No quadro de ingestão, baixe <strong>Arduino .ino</strong>, <strong>MicroPython .py</strong>, <strong>CircuitPython code.py</strong> (Pico W) ou <strong>ESPHome</strong>: a URL de ingestão já vem preenchida; basta configurar o Wi‑Fi.",
  devicesStep3Html:
    "Siga o checklist do ESP32 desse cartão (pacote da placa, bibliotecas, Serial 115200 → <code>POST 200</code>).",
  arduinoTitle: "2. Arduino IDE",
  arduinoItem1Html:
    "Instale o suporte a placas <strong>ESP32</strong> (Espressif), e não o caminho Uno Ethernet com LCD de garagem.",
  arduinoItem2Html: "Bibliotecas: <code>OneWire</code>, <code>DallasTemperature</code> (Gerenciador de Bibliotecas).",
  arduinoItem3Html:
    "Abra o <code>.ino</code> baixado, configure <code>WIFI_*</code>, selecione a porta e grave.",
  pioTitle: "3. PlatformIO",
  pioBodyHtml:
    'O exemplo do repositório <a class="text-link" href="https://github.com/doodersrage/probeharbor/tree/main/sketches/arduino/ds18b20_ingest" target="_blank" rel="noreferrer"><code>sketches/arduino/ds18b20_ingest/</code></a> inclui um <code>platformio.ini</code> com bibliotecas em versões fixas e <code>monitor_speed = 115200</code>. Passe a URL de ingestão por build flags ou cole o sketch gerado no Devices em <code>src/main.cpp</code>.',
  microTitle: "4. MicroPython (Thonny / mpremote)",
  microBodyHtml:
    "Grave uma imagem do MicroPython uma única vez e depois copie o <code>main.py</code> baixado (com a URL de ingestão já preenchida). Não precisa do pacote de placas do Arduino.",
  esptoolTitle: "5. esptool no navegador (quando você já tem um .bin)",
  esptoolBodyHtml:
    "Se você compila um binário localmente (PlatformIO <code>pio run</code>), pode gravá-lo pelo Chrome/Edge com a ferramenta Web Serial da Espressif: útil em computadores bloqueados, sem uma IDE completa:",
  esptoolNote:
    "Essa ferramenta grava os dados que você fornece; ela não conhece a sua chave do ProbeHarbor. Continue usando o download do Devices para embutir a URL no código antes de compilar.",
  portalTitle: "6. Wi‑Fi por portal cativo",
  portalBodyHtml:
    'Evite gravar SSID e senha no código com o <a class="text-link" href="https://github.com/doodersrage/probeharbor/tree/main/sketches/arduino/ds18b20_wifimanager" target="_blank" rel="noreferrer">exemplo WiFiManager</a>: conecte-se uma vez ao ponto de acesso de configuração e a sonda guarda as credenciais. Mesmo assim, defina <code>INGEST_URL</code> pelo Devices (ou baixe e mescle).',
  relatedTitle: "Relacionados",
  related: {
    kit: "Lista de peças do kit antecongelamento ESP32",
    pico: "Ingestão com Raspberry Pi Pico W",
    stm32: "Ingestão com STM32 Zephyr",
    ch32v: "Ingestão com CH32V RISC-V",
    avr: "Ingestão em assembly AVR",
    adding: "Adicionar dispositivos",
    ota: "OTA e bateria / RSSI",
    qr: "QR do kit",
    sketches: "Todos os sketches ↗",
  },
};

export const esp32WebFlashMessages = defineMessages({ en, es, fr, de, "pt-br": ptBr });
