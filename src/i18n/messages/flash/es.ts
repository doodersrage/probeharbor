/**
 * /flash page copy, plus the BrowserFlasher component (also used in the
 * English-only dashboard). Keys ending in `Html` are trusted inline HTML.
 */
import type { FlashMessages } from "./en";

const es: FlashMessages = {
  title: "Flashea un sensor de congelación ESP32 desde el navegador",
  description:
    "Convierte un ESP32 y una sonda DS18B20 en sensor de congelación sin un IDE: flashea desde el navegador, pon el Wi-Fi y una clave de dispositivo, y listo.",
  breadcrumbHome: "Inicio",
  breadcrumbFlash: "Instalador web",
  faqs: [
    {
      question: "¿Qué necesito?",
      answer:
        "Una placa ESP32 (el ESP32 original está probado; ESP32-S3 y ESP32-C3 están compilados, pero aún no probados en hardware); una sonda impermeable DS18B20 o un sensor de temperatura y humedad DHT22 (el DHT11 es compatible, pero aún no se ha probado en hardware) con una resistencia pull-up de 4,7 kΩ en GPIO 4; un cable USB de datos, y Chrome o Edge en un ordenador de sobremesa o portátil.",
    },
    {
      question: "¿Necesito el Arduino IDE?",
      answer:
        "No. El firmware viene precompilado y lo instala el navegador. El Wi-Fi y la clave del dispositivo se envían a la placa después de flashearla, así que no hay que compilar nada.",
    },
    {
      question: "¿Puedo añadir más de una sonda?",
      answer:
        "Sí, hasta cuatro sondas DS18B20 en el mismo pin. Aparecen como temp1 a temp4 y puedes renombrarlas en el panel. Un DHT22 es un único sensor por placa.",
    },
    {
      question: "¿Qué más puedo conectar?",
      answer:
        "Un sensor I²C de temperatura y humedad (BME280, SHT31 o AHT20, que se detectan automáticamente; el BME280 también mide la presión del aire), un contacto de fuga o de agua para alertas de inundación, un interruptor magnético de puerta y una batería a través de un divisor resistivo 1:1 para estimar su duración. Marca las opciones de fuga, puerta y batería al enviar los ajustes para que la placa sepa que están conectadas. Probados en hardware hasta ahora: el BME280 y el interruptor de puerta. SHT31, AHT20, fuga y batería están incluidos, pero aún no se han probado en hardware.",
    },
    {
      question: "¿Funciona con un DHT22?",
      answer:
        "Sí. Se cablea igual (datos a GPIO 4, 4,7 kΩ a 3,3 V). El firmware busca primero sondas DS18B20 y, si no hay ninguna, lee un DHT22 o DHT11 en ese pin, con temperatura y humedad. Una DS18B20 es mejor opción pegada a una tubería; un DHT22 va bien para el aire ambiente y la humedad de un sótano o un espacio bajo el suelo.",
    },
    {
      question: "¿Cómo cambio la placa a otra red?",
      answer:
        "Mantén pulsado el botón BOOT cinco segundos para borrar el Wi-Fi y la clave guardados, y luego envía los nuevos ajustes desde esta página o a través de la red ProbeHarbor-Setup.",
    },
    {
      question: "¿El firmware es de código abierto?",
      answer:
        "Sí. El código está en el repositorio de ProbeHarbor, en firmware/probeharbor-probe, junto con sketches que puedes editar y flashear tú mismo.",
    },
  ],
  buy: {
    board: "Placa (elige una)",
    s3c3: "O una placa S3 / C3 (aún no probada en hardware; la disponibilidad varía)",
    sensor: "Sensor en GPIO 4",
    i2c: "O un sensor de aire I²C (sin resistencia)",
    extras: "Extras opcionales",
    ds18b20: "Sonda impermeable DS18B20",
    resistor4k7: "Resistencias de 4,7 kΩ",
    bme280: "BME280 (añade presión del aire)",
    reed: "Interruptor magnético de puerta",
    resistor100k: "Resistencias de 100 kΩ (divisor de batería)",
  },
  kicker: "Instalación · Beta",
  heading: "Flashea un sensor de congelación desde el navegador",
  lede: "Sin Arduino IDE y sin tocar código. Conecta una sonda DS18B20 o un DHT22 a un ESP32, instala el firmware desde esta página y envíale tu Wi‑Fi y la clave del dispositivo por el mismo cable USB.",
  getKey: "Obtén una clave de dispositivo",
  startFreeGetKey: "Empieza gratis → obtén una clave de dispositivo",
  partsAndWiring: "Lista de piezas y cableado",
  beforeTitle: "Antes de empezar",
  wireHtml:
    'Cablea el sensor: alimentación a 3,3 V, tierra a GND y datos a GPIO 4, con una resistencia de 4,7 kΩ entre datos y 3,3 V (<a class="text-link" href="/about/esp32-freeze-kit">esquema</a>). Es igual para una sonda DS18B20 (cables rojo, negro y amarillo) que para un DHT22; el firmware detecta cuál está conectado.',
  extrasIntro: "Extras opcionales, en estos pines (cada interruptor o contacto va entre el pin y GND):",
  pinTable: {
    connect: "Conexión",
    data: "Datos del DS18B20 o DHT22",
    i2c: "Sensor I²C SDA / SCL (BME280, SHT31, AHT20)",
    leak: "Contacto de fuga / agua",
    door: "Interruptor reed de puerta",
    battery: "Batería + por un divisor 1:1 (2 × 100 kΩ)",
  },
  i2cNote:
    "Los sensores I²C se detectan automáticamente; marca fuga, puerta o batería abajo para que la placa sepa que están conectados.",
  featherHtml:
    "<strong>Adafruit Feather (HUZZAH32 o ESP32 Feather V2):</strong> usa la columna ESP32. Los datos de la sonda (GPIO 4) van al pin marcado A5, el interruptor de puerta (GPIO 26) al A0 y el contacto de fuga al pin 27. El divisor de batería ya viene en la placa: conecta una LiPo al conector de batería y marca batería, sin resistencias. Un sensor I²C va en los pines SDA/SCL de la propia Feather o en su puerto STEMMA QT; el firmware lo encuentra al arrancar (desconecta y vuelve a conectar la alimentación después de enchufarlo). Las Feather no tienen botón BOOT en GPIO 0, así que el reinicio de 5 segundos no funciona; para cambiar el Wi-Fi, envía nuevos ajustes desde esta página.",
  deviceKeyHtml:
    'Añade un dispositivo push en <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> y copia su clave de dispositivo. El plan gratuito incluye dos dispositivos.',
  buyTitle: "Qué comprar",
  buyIntro:
    "Piezas que encajan con los pines de arriba. Un ESP32 normal es la opción probada. Los enlaces S3 y C3 son las placas de desarrollo de la propia Espressif, para las que está compilado el firmware; si están agotadas, debería servir otra placa ESP32-S3-DevKitC-1 o ESP32-C3-DevKitM-1 (o un clon con el mismo pinout), aunque las placas S3 y C3 aún no se han probado en hardware.",
  leakHtml:
    '<strong>Sensor de fugas:</strong> la opción barata más sencilla es un módulo LM393 de «sensor de lluvia / agua» (lo venden muchas tiendas): VCC al pin de 3,3 V de la placa (nunca a 5 V, para que su salida sea segura para el ESP32), GND a GND y DO al pin de fuga. Gira su potenciómetro hasta que una gota de agua marque mojado y comprueba que vuelve a marcar seco. Sus pistas expuestas se corroen si quedan mojadas, así que tómalo como una pieza para empezar. Para una instalación más duradera, usa dos tornillos o puntas de acero inoxidable separados unos 5&nbsp;mm, uno al pin de fuga y otro a GND. En cualquier caso, prueba con tu propia agua: el agua muy limpia o una película fina pueden no activarlo. Los sensores cuya salida pasa a nivel alto al mojarse, como el sensor de agua de Adafruit, necesitan otra entrada y no funcionan con este firmware.',
  afterTitle: "Cuando ya esté funcionando",
  afterHtml:
    'Las lecturas llegan una vez por minuto. Monta la sonda contra la tubería más fría, define un umbral de congelación de 1–3 °C (34–38 °F) en <a class="text-link" href="/dashboard/alerts">Dashboard → Alerts</a> y envía una alerta de prueba. Consulta <a class="text-link" href="/answers/crawlspace-freeze-sensor-placement">dónde colocar el sensor</a> y <a class="text-link" href="/answers/freeze-alarm-temperature-setting">a qué temperatura alertar</a>. ¿Prefieres editar el código tú mismo? Las <a class="text-link" href="/about/esp32-web-flash">otras opciones de flasheo</a> cubren Arduino, PlatformIO, MicroPython y ESPHome.',
};

export default es;
