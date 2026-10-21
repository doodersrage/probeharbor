
/** /about/esp32-web-flash body copy. `Html` keys are trusted inline HTML; hrefs stay English. */
import type { Esp32WebFlashMessages } from "./en";

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

export default es;
