
/** /about/esp32-ota-firmware body copy. `Html` keys are trusted inline HTML; hrefs stay English. */
import type { Esp32OtaFirmwareMessages } from "./en";

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

export default es;
