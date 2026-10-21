import { defineMessages } from "../../translate";

/** /about/esp32-ota-firmware body copy. `Html` keys are trusted inline HTML; hrefs stay English. */
const en = {
  introHtml:
    'ProbeHarbor cares about <strong>readings over HTTPS</strong>, not how you update the MCU. Keep OTA on your LAN; keep ingest pointed at <code>/api/ingest/&lt;key&gt;</code>. Download a pre-filled sketch from <a class="text-link" href="/dashboard/devices">Devices</a> after you create a push device.',
  firstFlashTitle: "First flash vs OTA",
  usbFlashHtml:
    '<strong>USB first flash</strong>, use the Devices callout checklist (ESP32 board package, libraries, Serial 115200). See <a class="text-link" href="/about/esp32-web-flash">flashing options</a> for Arduino IDE, PlatformIO, MicroPython, and Espressif’s web esptool.',
  lanOtaHtml:
    "<strong>LAN OTA later</strong>: once Wi‑Fi works, <code>ArduinoOTA</code> (or ESP-IDF HTTPS OTA) lets you push new firmware without climbing back to the probe with a cable.",
  arduinoOtaTitle: "ArduinoOTA (LAN)",
  arduinoOtaBodyHtml:
    "After <code>WiFi.begin</code> succeeds, start OTA and call <code>handle()</code> in <code>loop</code>. Use a password in production shops. PlatformIO / Arduino IDE “network port” then shows the board.",
  independentNote:
    "OTA and ingest are independent: a failed cloud POST does not block OTA, and an OTA update does not change your ProbeHarbor device key.",
  payloadTitle: "Ingest payload with battery and RSSI",
  payloadIntro: "Optional top-level fields keep Devices health and low-battery / weak-signal alerts accurate:",
  payloadAfterHtml:
    'The DS18B20 samples already send <code>rssi</code>. Add <code>battery</code> or <code>battery_pct</code> when you have a voltage divider or fuel gauge. Enable health alerts under <a class="text-link" href="/dashboard/alerts">Dashboard → Alerts</a>.',
  wifiTitle: "Wi‑Fi without recompiling",
  wifiBodyHtml:
    'Hardcoded <code>WIFI_SSID</code> / <code>WIFI_PASS</code> is fine for a fixed garage AP. If the network changes often, use the <a class="text-link" href="https://github.com/doodersrage/probeharbor/tree/main/sketches/arduino/ds18b20_wifimanager" target="_blank" rel="noreferrer">WiFiManager sketch</a> captive portal on first boot; ingest URL still comes from the Devices download or a <code>#define</code>.',
  relatedTitle: "Related",
  related: {
    adding: "Adding devices",
    flash: "ESP32 flashing options",
    qr: "Kit QR onboarding",
    api: "HTTP API: ingest",
  },
};

type Esp32OtaFirmwareMessages = typeof en;

const es: Esp32OtaFirmwareMessages = {
  introHtml:
    'A ProbeHarbor le importan las <strong>lecturas por HTTPS</strong>, no cómo actualizas el microcontrolador. Mantén el OTA en tu red local y la ingesta apuntando a <code>/api/ingest/&lt;key&gt;</code>. Descarga un sketch ya configurado desde <a class="text-link" href="/dashboard/devices">Devices</a> después de crear un dispositivo push.',
  firstFlashTitle: "Primer flasheo frente a OTA",
  usbFlashHtml:
    '<strong>Primer flasheo por USB</strong>: usa la lista de comprobación del recuadro de Devices (paquete de placa ESP32, bibliotecas, Serial 115200). Consulta las <a class="text-link" href="/about/esp32-web-flash">opciones de flasheo</a> para Arduino IDE, PlatformIO, MicroPython y el esptool web de Espressif.',
  lanOtaHtml:
    "<strong>OTA por la red local después</strong>: cuando el Wi‑Fi ya funciona, <code>ArduinoOTA</code> (o el OTA HTTPS de ESP-IDF) te permite enviar firmware nuevo sin tener que volver a la sonda con un cable.",
  arduinoOtaTitle: "ArduinoOTA (red local)",
  arduinoOtaBodyHtml:
    "Cuando <code>WiFi.begin</code> se conecte, inicia el OTA y llama a <code>handle()</code> dentro de <code>loop</code>. Usa una contraseña en talleres en producción. Después, el «puerto de red» de PlatformIO / Arduino IDE mostrará la placa.",
  independentNote:
    "El OTA y la ingesta son independientes: un POST fallido a la nube no bloquea el OTA, y una actualización OTA no cambia la clave de tu dispositivo ProbeHarbor.",
  payloadTitle: "Carga de ingesta con batería y RSSI",
  payloadIntro:
    "Los campos opcionales de nivel superior mantienen precisos el estado de salud en Devices y las alertas de batería baja o señal débil:",
  payloadAfterHtml:
    'Los ejemplos de DS18B20 ya envían <code>rssi</code>. Añade <code>battery</code> o <code>battery_pct</code> si tienes un divisor de tensión o un medidor de carga. Activa las alertas de salud en <a class="text-link" href="/dashboard/alerts">Dashboard → Alerts</a>.',
  wifiTitle: "Wi‑Fi sin recompilar",
  wifiBodyHtml:
    'Dejar <code>WIFI_SSID</code> / <code>WIFI_PASS</code> fijos en el código está bien para un punto de acceso de garaje que no cambia. Si la red cambia a menudo, usa el portal cautivo del <a class="text-link" href="https://github.com/doodersrage/probeharbor/tree/main/sketches/arduino/ds18b20_wifimanager" target="_blank" rel="noreferrer">sketch de WiFiManager</a> en el primer arranque; la URL de ingesta sigue viniendo de la descarga de Devices o de un <code>#define</code>.',
  relatedTitle: "Relacionado",
  related: {
    adding: "Añadir dispositivos",
    flash: "Opciones de flasheo del ESP32",
    qr: "Alta con el QR del kit",
    api: "API HTTP: ingesta",
  },
};

const fr: Esp32OtaFirmwareMessages = {
  introHtml:
    'Ce qui compte pour ProbeHarbor, ce sont les <strong>relevés en HTTPS</strong>, pas la façon dont vous mettez à jour le microcontrôleur. Gardez l’OTA sur votre réseau local et l’ingestion pointée vers <code>/api/ingest/&lt;key&gt;</code>. Téléchargez un sketch prérempli depuis <a class="text-link" href="/dashboard/devices">Devices</a> après avoir créé un appareil push.',
  firstFlashTitle: "Premier flash ou OTA",
  usbFlashHtml:
    '<strong>Premier flash par USB</strong> : suivez la check-list de l’encart Devices (paquet de cartes ESP32, bibliothèques, Serial 115200). Consultez les <a class="text-link" href="/about/esp32-web-flash">options de flashage</a> pour Arduino IDE, PlatformIO, MicroPython et l’esptool web d’Espressif.',
  lanOtaHtml:
    "<strong>OTA sur le réseau local ensuite</strong> : une fois le Wi‑Fi opérationnel, <code>ArduinoOTA</code> (ou l’OTA HTTPS d’ESP-IDF) vous permet d’envoyer un nouveau firmware sans retourner jusqu’à la sonde avec un câble.",
  arduinoOtaTitle: "ArduinoOTA (réseau local)",
  arduinoOtaBodyHtml:
    "Une fois <code>WiFi.begin</code> connecté, démarrez l’OTA et appelez <code>handle()</code> dans <code>loop</code>. Utilisez un mot de passe dans les ateliers en production. Le « port réseau » de PlatformIO / Arduino IDE affiche alors la carte.",
  independentNote:
    "L’OTA et l’ingestion sont indépendantes : un POST vers le cloud qui échoue ne bloque pas l’OTA, et une mise à jour OTA ne change pas la clé de votre appareil ProbeHarbor.",
  payloadTitle: "Charge utile d’ingestion avec batterie et RSSI",
  payloadIntro:
    "Des champs facultatifs au premier niveau garantissent la justesse de l’état de santé dans Devices et des alertes de batterie faible ou de signal faible :",
  payloadAfterHtml:
    'Les exemples DS18B20 envoient déjà <code>rssi</code>. Ajoutez <code>battery</code> ou <code>battery_pct</code> si vous disposez d’un pont diviseur de tension ou d’une jauge de batterie. Activez les alertes de santé dans <a class="text-link" href="/dashboard/alerts">Dashboard → Alerts</a>.',
  wifiTitle: "Wi‑Fi sans recompiler",
  wifiBodyHtml:
    '<code>WIFI_SSID</code> / <code>WIFI_PASS</code> codés en dur conviennent pour le point d’accès fixe d’un garage. Si le réseau change souvent, utilisez le portail captif du <a class="text-link" href="https://github.com/doodersrage/probeharbor/tree/main/sketches/arduino/ds18b20_wifimanager" target="_blank" rel="noreferrer">sketch WiFiManager</a> au premier démarrage ; l’URL d’ingestion provient toujours du téléchargement Devices ou d’un <code>#define</code>.',
  relatedTitle: "Voir aussi",
  related: {
    adding: "Ajouter des appareils",
    flash: "Options de flashage de l’ESP32",
    qr: "Mise en service par QR du kit",
    api: "API HTTP : ingestion",
  },
};

const de: Esp32OtaFirmwareMessages = {
  introHtml:
    'Für ProbeHarbor zählen die <strong>Messwerte über HTTPS</strong>, nicht wie du den Mikrocontroller aktualisierst. Lass OTA in deinem lokalen Netz und den Ingest auf <code>/api/ingest/&lt;key&gt;</code> zeigen. Lade einen vorausgefüllten Sketch unter <a class="text-link" href="/dashboard/devices">Devices</a> herunter, nachdem du ein Push-Gerät angelegt hast.',
  firstFlashTitle: "Erstes Flashen oder OTA",
  usbFlashHtml:
    '<strong>Erstes Flashen per USB</strong>: Nutze die Checkliste im Devices-Hinweis (ESP32-Board-Paket, Bibliotheken, Serial 115200). Unter <a class="text-link" href="/about/esp32-web-flash">Flash-Optionen</a> findest du Arduino IDE, PlatformIO, MicroPython und das Web-esptool von Espressif.',
  lanOtaHtml:
    "<strong>Später OTA im lokalen Netz</strong>: Sobald das WLAN läuft, kannst du mit <code>ArduinoOTA</code> (oder HTTPS-OTA von ESP-IDF) neue Firmware aufspielen, ohne mit einem Kabel zum Fühler klettern zu müssen.",
  arduinoOtaTitle: "ArduinoOTA (lokales Netz)",
  arduinoOtaBodyHtml:
    "Wenn <code>WiFi.begin</code> erfolgreich war, starte OTA und rufe <code>handle()</code> in <code>loop</code> auf. In produktiv genutzten Werkstätten solltest du ein Passwort setzen. Danach zeigt der „Netzwerkport“ in PlatformIO / Arduino IDE das Board an.",
  independentNote:
    "OTA und Ingest sind unabhängig voneinander: Ein fehlgeschlagener Cloud-POST blockiert OTA nicht, und ein OTA-Update ändert deinen ProbeHarbor-Geräteschlüssel nicht.",
  payloadTitle: "Ingest-Payload mit Akku und RSSI",
  payloadIntro:
    "Optionale Felder auf oberster Ebene halten den Gerätezustand in Devices und die Warnungen bei schwachem Akku oder Signal korrekt:",
  payloadAfterHtml:
    'Die DS18B20-Beispiele senden <code>rssi</code> bereits mit. Ergänze <code>battery</code> oder <code>battery_pct</code>, wenn du einen Spannungsteiler oder eine Akku-Füllstandsanzeige hast. Zustandswarnungen aktivierst du unter <a class="text-link" href="/dashboard/alerts">Dashboard → Alerts</a>.',
  wifiTitle: "WLAN ohne Neukompilieren",
  wifiBodyHtml:
    'Fest eingetragene <code>WIFI_SSID</code> / <code>WIFI_PASS</code> reichen für einen festen Garagen-AP. Wechselt das Netz häufig, nutze beim ersten Start das Captive Portal des <a class="text-link" href="https://github.com/doodersrage/probeharbor/tree/main/sketches/arduino/ds18b20_wifimanager" target="_blank" rel="noreferrer">WiFiManager-Sketches</a>; die Ingest-URL kommt weiterhin aus dem Devices-Download oder einem <code>#define</code>.',
  relatedTitle: "Verwandte Themen",
  related: {
    adding: "Geräte hinzufügen",
    flash: "Flash-Optionen für den ESP32",
    qr: "Einrichtung per Kit-QR-Code",
    api: "HTTP-API: Ingest",
  },
};

const ptBr: Esp32OtaFirmwareMessages = {
  introHtml:
    'O que importa para o ProbeHarbor são as <strong>leituras via HTTPS</strong>, não como você atualiza o microcontrolador. Mantenha o OTA na sua rede local e a ingestão apontando para <code>/api/ingest/&lt;key&gt;</code>. Baixe um sketch já preenchido no <a class="text-link" href="/dashboard/devices">Devices</a> depois de criar um dispositivo push.',
  firstFlashTitle: "Primeira gravação x OTA",
  usbFlashHtml:
    '<strong>Primeira gravação via USB</strong>: use o checklist do quadro do Devices (pacote da placa ESP32, bibliotecas, Serial 115200). Veja as <a class="text-link" href="/about/esp32-web-flash">opções de gravação</a> para Arduino IDE, PlatformIO, MicroPython e o esptool web da Espressif.',
  lanOtaHtml:
    "<strong>OTA pela rede local depois</strong>: quando o Wi‑Fi estiver funcionando, o <code>ArduinoOTA</code> (ou o OTA HTTPS do ESP-IDF) permite enviar um firmware novo sem precisar voltar até a sonda com um cabo.",
  arduinoOtaTitle: "ArduinoOTA (rede local)",
  arduinoOtaBodyHtml:
    "Depois que o <code>WiFi.begin</code> conectar, inicie o OTA e chame <code>handle()</code> dentro do <code>loop</code>. Use uma senha em oficinas em produção. A “porta de rede” do PlatformIO / Arduino IDE passa então a mostrar a placa.",
  independentNote:
    "OTA e ingestão são independentes: um POST para a nuvem que falha não bloqueia o OTA, e uma atualização OTA não muda a chave do seu dispositivo ProbeHarbor.",
  payloadTitle: "Payload de ingestão com bateria e RSSI",
  payloadIntro:
    "Campos opcionais no nível principal mantêm corretos o status de saúde no Devices e os alertas de bateria fraca ou sinal fraco:",
  payloadAfterHtml:
    'Os exemplos de DS18B20 já enviam <code>rssi</code>. Adicione <code>battery</code> ou <code>battery_pct</code> quando tiver um divisor de tensão ou um medidor de carga. Ative os alertas de saúde em <a class="text-link" href="/dashboard/alerts">Dashboard → Alerts</a>.',
  wifiTitle: "Wi‑Fi sem recompilar",
  wifiBodyHtml:
    '<code>WIFI_SSID</code> / <code>WIFI_PASS</code> fixos no código funcionam bem para um ponto de acesso fixo na garagem. Se a rede muda com frequência, use o portal cativo do <a class="text-link" href="https://github.com/doodersrage/probeharbor/tree/main/sketches/arduino/ds18b20_wifimanager" target="_blank" rel="noreferrer">sketch WiFiManager</a> na primeira inicialização; a URL de ingestão continua vindo do download do Devices ou de um <code>#define</code>.',
  relatedTitle: "Relacionados",
  related: {
    adding: "Adicionar dispositivos",
    flash: "Opções de gravação do ESP32",
    qr: "Configuração pelo QR do kit",
    api: "API HTTP: ingestão",
  },
};

export const esp32OtaFirmwareMessages = defineMessages({ en, es, fr, de, "pt-br": ptBr });
