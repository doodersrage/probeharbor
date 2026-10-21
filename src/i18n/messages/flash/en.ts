/**
 * /flash page copy, plus the BrowserFlasher component (also used in the
 * English-only dashboard). Keys ending in `Html` are trusted inline HTML.
 */

const en = {
  title: "Flash an ESP32 freeze sensor from your browser",
  description:
    "Turn an ESP32 and a DS18B20 probe into a freeze sensor without installing an IDE: flash from the browser, enter Wi-Fi and a device key, done.",
  breadcrumbHome: "Home",
  breadcrumbFlash: "Browser flasher",
  faqs: [
    {
      question: "What do I need?",
      answer:
        "An ESP32, ESP32-S3, or ESP32-C3 board, a waterproof DS18B20 probe or a DHT22 (or DHT11) temperature and humidity sensor with a 4.7kΩ pull-up resistor on GPIO 4, a USB data cable, and Chrome or Edge on a desktop or laptop.",
    },
    {
      question: "Do I need the Arduino IDE?",
      answer:
        "No. The firmware is prebuilt and installed by the browser. Wi-Fi and your device key are sent to the board after flashing, so nothing has to be compiled.",
    },
    {
      question: "Can I add more than one probe?",
      answer:
        "Yes, up to four DS18B20 probes on the same pin. They report as temp1 to temp4 and can be renamed in the dashboard. A DHT22 is one sensor per board.",
    },
    {
      question: "What else can I connect?",
      answer:
        "An I²C temperature and humidity sensor (BME280, SHT31, or AHT20, found automatically; a BME280 also reports air pressure), a leak or water contact for flood alerts, a magnetic door switch, and a battery through a 1:1 resistor divider for battery-life estimates. Tick the leak, door, and battery options when you send settings so the board knows they're wired.",
    },
    {
      question: "Does it work with a DHT22?",
      answer:
        "Yes. Wire it the same way (data to GPIO 4, 4.7kΩ to 3.3V). The firmware looks for DS18B20 probes first and, if there are none, reads a DHT22 or DHT11 on that pin, reporting temperature and humidity. A DS18B20 is the better choice against a pipe; a DHT22 suits room air and humidity in a crawlspace or basement.",
    },
    {
      question: "How do I move the board to another network?",
      answer:
        "Hold the BOOT button for five seconds to erase the saved Wi-Fi and device key, then send new settings from this page or through the ProbeHarbor-Setup network.",
    },
    {
      question: "Is the firmware open source?",
      answer:
        "Yes. The source is in the ProbeHarbor repository under firmware/probeharbor-probe, alongside sketches you can edit and flash yourself.",
    },
  ],
  buy: {
    board: "Board (pick one)",
    s3c3: "Or an S3 / C3 board (stock varies)",
    sensor: "Sensor on GPIO 4",
    i2c: "Or an I²C air sensor (no resistor needed)",
    extras: "Optional extras",
    ds18b20: "Waterproof DS18B20 probe",
    resistor4k7: "4.7kΩ resistors",
    bme280: "BME280 (adds air pressure)",
    reed: "Magnetic door switch",
    resistor100k: "100kΩ resistors (battery divider)",
  },
  kicker: "Setup · Beta",
  heading: "Flash a freeze sensor from your browser",
  lede: "No Arduino IDE, no editing code. Wire a DS18B20 probe or a DHT22 to an ESP32, install the firmware from this page, then send it your Wi‑Fi and device key over the same USB cable.",
  getKey: "Get a device key",
  startFreeGetKey: "Start free → get a device key",
  partsAndWiring: "Parts list and wiring",
  beforeTitle: "Before you start",
  wireHtml:
    'Wire the sensor: power to 3.3V, ground to GND, data to GPIO 4, with a 4.7kΩ resistor between data and 3.3V (<a class="text-link" href="/about/esp32-freeze-kit">diagram</a>). That\'s the same for a DS18B20 probe (red, black, yellow wires) and a DHT22; the firmware detects which one is connected.',
  extrasIntro: "Optional extras, on these pins (each switch or contact goes between the pin and GND):",
  pinTable: {
    connect: "Connect",
    data: "DS18B20 or DHT22 data",
    i2c: "I²C sensor SDA / SCL (BME280, SHT31, AHT20)",
    leak: "Leak / water contact",
    door: "Door reed switch",
    battery: "Battery + through a 1:1 divider (2 × 100kΩ)",
  },
  i2cNote: "I²C sensors are found automatically; tick leak, door, or battery below so the board knows they're wired.",
  featherHtml:
    "<strong>Adafruit Feather (HUZZAH32 or ESP32 Feather V2):</strong> use the ESP32 column. Probe data (GPIO 4) is the pin labelled A5, the door switch (GPIO 26) is A0, and the leak contact goes on pin 27. The battery divider is already on the board: plug a LiPo into the battery connector and tick battery, no resistors needed. An I²C sensor goes on the Feather's own SDA/SCL pins or its STEMMA QT port; the firmware finds it there at startup (power-cycle after plugging one in). Feathers have no BOOT button on GPIO 0, so the 5-second reset won't work; to change Wi-Fi, send new settings from this page instead.",
  deviceKeyHtml:
    'Add a push device under <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> and copy its device key. The free plan includes two devices.',
  buyTitle: "What to buy",
  buyIntro:
    "Parts that match the pins above. A plain ESP32 is the tested choice and does everything here. The S3 and C3 links are Espressif's own dev boards, which the firmware is built for; when they're sold out, another ESP32-S3-DevKitC-1 or ESP32-C3-DevKitM-1 board (or a clone with the same pinout) works too.",
  leakHtml:
    '<strong>Leak sensor:</strong> the easiest low-cost option is an LM393 "rain / water sensor" module (sold by many shops): VCC to the board\'s 3.3V pin (never 5V, so its output stays safe for the ESP32), GND to GND, DO to the leak pin. Turn its dial until a drop of water reads Wet, then check it reads Dry again. Its exposed pads corrode if left wet, so treat it as a starter part. For a longer-lasting install, use two stainless screws or probes about 5&nbsp;mm apart, one to the leak pin and one to GND. Either way, test with your own water: very clean water or a thin film may not trip it. Sensors whose output goes high when wet, such as Adafruit\'s water sensor, need a different input and don\'t work with this firmware.',
  afterTitle: "After it is live",
  afterHtml:
    'Readings arrive once a minute. Mount the probe against the coldest pipe, set a freeze threshold of 34–38°F under <a class="text-link" href="/dashboard/alerts">Dashboard → Alerts</a>, and send a test alert. See <a class="text-link" href="/answers/crawlspace-freeze-sensor-placement">where to put the sensor</a> and <a class="text-link" href="/answers/freeze-alarm-temperature-setting">what temperature to alert at</a>. Prefer to edit the code yourself? The <a class="text-link" href="/about/esp32-web-flash">other flashing options</a> cover Arduino, PlatformIO, MicroPython, and ESPHome.',
};

export type FlashMessages = typeof en;
export default en;
