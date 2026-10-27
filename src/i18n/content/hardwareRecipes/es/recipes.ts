import type { HardwareRecipeOverlay } from "..";

const flash = { label: "Instalador web" };
const checker = { label: "Comprobador de payloads" };

export default {
  "esp32-ds18b20": {
    title: "Sonda anticongelación para el garaje",
    hardware: "Placa de desarrollo ESP32 + sonda impermeable DS18B20 + resistencia de 4,7 kΩ",
    path: "Instalador web (sin código)",
    notes:
      "Datos a GPIO 4 y la resistencia entre datos y 3,3 V. Sujeta la sonda a la tubería, no al aire. Varias sondas pueden compartir el mismo cable.",
    links: [flash, { label: "Kit anticongelación ESP32" }],
  },
  "esp32-dht22": {
    title: "Temperatura + humedad",
    hardware: "Placa de desarrollo ESP32 + módulo DHT22 (AM2302)",
    path: "Instalador web (sin código)",
    notes:
      "Mismo GPIO 4 que el DS18B20. Móntalo lejos de la placa: el ESP32 calienta un sensor que tenga al lado. También detecta un DHT11, pero no está probado en hardware y mide con menos precisión.",
    links: [flash, { label: "Cableado del DHT22" }],
  },
  "esp32-bme280": {
    title: "Temperatura, humedad + presión",
    hardware: "Placa de desarrollo ESP32 + BME280 por I²C",
    path: "Instalador web (sin código)",
    notes:
      "Se detecta automáticamente al arrancar: SDA al GPIO 21, SCL al GPIO 22, más 3,3 V y GND. También informa la presión del aire. Un BMP280 se ve igual pero no mide humedad, así que revisa el anuncio.",
    links: [flash],
  },
  "esp32-i2c": {
    title: "Otros sensores de aire I²C",
    hardware: "ESP32 + SHT31 o AHT20 por I²C",
    path: "Instalador web (sin código)",
    notes:
      "Se conectan igual que el BME280 (SDA 21, SCL 22 en un ESP32 clásico) y se detectan automáticamente.",
    links: [flash],
  },
  "esp32-door": {
    title: "Contacto de puerta",
    hardware: "Placa de desarrollo ESP32 + interruptor magnético (reed)",
    path: "Instalador web, opción de extras",
    notes:
      "Activa Puerta en los extras del instalador. En un ESP32 clásico, el interruptor reed va de GPIO 26 a GND; sin el imán marca Abierta. Monta el imán en la puerta y el interruptor en el marco.",
    links: [flash],
  },
  "esp32-leak": {
    title: "Contacto de fuga",
    hardware: "ESP32 + un módulo de sensor de agua LM393 o dos cables pelados",
    path: "Instalador web, opción de extras",
    notes:
      "Activa Fuga en los extras del instalador. En un ESP32 clásico, el contacto va de GPIO 27 a GND. Un contacto mojado dispara una alerta de fuga sin más configuración.",
    links: [flash],
  },
  "esp32-battery": {
    title: "Sonda a batería",
    hardware: "ESP32 con una LiPo a través de un divisor de tensión 1:1 (GPIO 35 en un ESP32 clásico)",
    path: "Instalador web, opción de extras",
    notes:
      "Informa del porcentaje de batería para que Devices avise antes de que se agote. Con Wi-Fi, cuenta con semanas, no meses.",
    links: [flash],
  },
  "esp32-s3-c3": {
    title: "Placas ESP32 más recientes",
    hardware: "Placa de desarrollo ESP32-S3 o ESP32-C3",
    path: "Instalador web (sin código)",
    notes: "El instalador tiene imágenes para ambas; por ahora solo el ESP32 original se ha probado en hardware.",
    links: [flash],
  },
  "home-assistant": {
    title: "Sensores que ya están en Home Assistant",
    hardware: "Cualquier sensor Zigbee, Z-Wave o Wi-Fi que vea Home Assistant",
    path: "Integración HACS",
    notes:
      "Una automatización envía los estados de las entidades a ProbeHarbor, así las alertas te siguen llegando aunque Home Assistant o la luz se caigan. Requiere un poco de YAML.",
    links: [{ label: "Home Assistant" }, { label: "Recetas de notificaciones" }],
  },
  "esphome-shelly": {
    title: "Dispositivos ESPHome o Shelly",
    hardware: "Firmware ESPHome, o un Shelly H&T / Flood",
    path: "http_request / webhook",
    notes:
      "Apunta la acción HTTP del dispositivo a tu URL de ingesta. Copia el fragmento de ESPHome desde la página de tu dispositivo.",
    links: [{ label: "Recetas para ESPHome y Shelly" }, checker],
  },
  mqtt: {
    title: "Un feed MQTT",
    hardware: "Cualquier cosa que ya publique en un broker MQTT",
    path: "Puente MQTT o Node-RED",
    notes:
      "Reenvía los topics al endpoint de ingesta. Comprueba un mensaje con el comprobador de payloads antes de montar el flujo.",
    links: [{ label: "Puente MQTT" }, { label: "Node-RED" }, checker],
  },
  arduino: {
    title: "Sketches de Arduino",
    hardware: "Arduino con Ethernet/Wi-Fi, ESP8266 o ESP32 en el Arduino IDE",
    path: "Sketch de Arduino que envía JSON",
    notes: "Parte de un sketch de ejemplo y cambia la clave y los pines.",
    links: [{ label: "Sketches de Arduino" }, checker],
  },
  "pico-w": {
    title: "Raspberry Pi Pico W",
    hardware: "Pico W + DS18B20 o DHT22, MicroPython",
    path: "Script de MicroPython",
    notes: "Un script corto lee el sensor y envía JSON por Wi-Fi.",
    links: [{ label: "Guía de Pico W" }, checker],
  },
  "https-feed": {
    title: "Tu propio feed JSON por HTTPS",
    hardware: "Un servidor, script o dispositivo que ya sirve lecturas en JSON",
    path: "Feed de consulta (lo consultamos nosotros)",
    notes: "Añade la URL en Devices → Pull feeds; la consultamos periódicamente.",
    links: [{ label: "Feeds con Python" }, { label: "Añadir dispositivos" }],
  },
  cellular: {
    title: "Sin Wi-Fi en el lugar",
    hardware: "Placa con módem celular (p. ej., SIM7000 / LTE-M)",
    path: "POST por red celular",
    notes:
      "Para cabañas y construcciones anexas sin Wi-Fi. Lo difícil son el plan de datos y la alimentación.",
    links: [{ label: "Ingesta celular" }, checker],
  },
} satisfies HardwareRecipeOverlay;
