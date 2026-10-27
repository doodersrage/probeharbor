/**
 * Hardware explorer data (/hardware). Keep `status` honest:
 * - "verified": we ran this exact combination on real hardware into production.
 * - "built-in": the web-flasher firmware supports it, but we haven't run it on hardware yet.
 * - "guide": documented path; you write or adapt the code (check it with /payload-checker).
 * Update a recipe to "verified" only after a real board has posted readings.
 */
export type RecipeStatus = "verified" | "built-in" | "guide";
export type RecipeGoal = "freeze" | "humidity" | "leak" | "door" | "air" | "battery";

export type HardwareRecipe = {
  id: string;
  title: string;
  hardware: string;
  path: string;
  goals: RecipeGoal[];
  status: RecipeStatus;
  /** True when no programming is needed. */
  noCode: boolean;
  notes: string;
  links: Array<{ label: string; href: string }>;
};

export const RECIPE_STATUS_LABELS: Record<RecipeStatus, string> = {
  verified: "Verified on hardware",
  "built-in": "Built in, not yet hardware-tested",
  guide: "Guide: you write the code",
};

export const RECIPE_GOAL_LABELS: Record<RecipeGoal, string> = {
  freeze: "Freeze / temperature",
  humidity: "Humidity",
  leak: "Leak",
  door: "Door",
  air: "Air quality / pressure",
  battery: "Battery",
};

const flash = { label: "Web flasher", href: "/flash" };
const checker = { label: "Payload checker", href: "/payload-checker" };

export const HARDWARE_RECIPES: HardwareRecipe[] = [
  {
    id: "esp32-ds18b20",
    title: "Garage freeze probe",
    hardware: "ESP32 dev board + DS18B20 waterproof probe + 4.7 kΩ resistor",
    path: "Web flasher (no code)",
    goals: ["freeze"],
    status: "verified",
    noCode: true,
    notes: "Data to GPIO 4, resistor from data to 3.3 V. Clip the probe to the pipe, not the air. Several probes can share the wire.",
    links: [flash, { label: "ESP32 freeze kit", href: "/about/esp32-freeze-kit" }],
  },
  {
    id: "esp32-dht22",
    title: "Temperature + humidity",
    hardware: "ESP32 dev board + DHT22 (AM2302) module",
    path: "Web flasher (no code)",
    goals: ["freeze", "humidity"],
    status: "verified",
    noCode: true,
    notes: "Same GPIO 4 as the DS18B20. Mount it away from the board; the ESP32 warms a sensor sitting next to it. A DHT11 is detected too, but isn't hardware-tested and reads coarser.",
    links: [flash, { label: "DHT22 wiring", href: "/about/dht22-data-line-wiring" }],
  },
  {
    id: "esp32-bme280",
    title: "Temperature, humidity + pressure",
    hardware: "ESP32 dev board + BME280 on I²C",
    path: "Web flasher (no code)",
    goals: ["freeze", "humidity", "air"],
    status: "verified",
    noCode: true,
    notes: "Found automatically at boot: SDA to GPIO 21, SCL to GPIO 22, plus 3.3 V and GND. Reports air pressure as well. A BMP280 looks the same but has no humidity, so check the listing.",
    links: [flash],
  },
  {
    id: "esp32-i2c",
    title: "Other I²C air sensors",
    hardware: "ESP32 + SHT31 or AHT20 on I²C",
    path: "Web flasher (no code)",
    goals: ["freeze", "humidity"],
    status: "built-in",
    noCode: true,
    notes: "Wired the same way as the BME280 (SDA 21, SCL 22 on a classic ESP32) and found automatically.",
    links: [flash],
  },
  {
    id: "esp32-door",
    title: "Door contact",
    hardware: "ESP32 dev board + magnetic reed switch",
    path: "Web flasher, extras option",
    goals: ["door"],
    status: "verified",
    noCode: true,
    notes: "Tick Door in the flasher's extras. On a classic ESP32 the reed switch goes from GPIO 26 to GND; magnet away reads Open. Mount the magnet on the door and the switch on the frame.",
    links: [flash],
  },
  {
    id: "esp32-leak",
    title: "Leak contact",
    hardware: "ESP32 + an LM393 water sensor module or two bare wires",
    path: "Web flasher, extras option",
    goals: ["leak"],
    status: "built-in",
    noCode: true,
    notes: "Tick Leak in the flasher's extras. On a classic ESP32 the contact goes from GPIO 27 to GND. A wet contact raises a leak alert with no other setup.",
    links: [flash],
  },
  {
    id: "esp32-battery",
    title: "Battery-powered probe",
    hardware: "ESP32 with a LiPo through a 1:1 voltage divider (GPIO 35 on a classic ESP32)",
    path: "Web flasher, extras option",
    goals: ["battery"],
    status: "built-in",
    noCode: true,
    notes: "Reports battery percentage so Devices can warn before it dies. Expect weeks, not months, on Wi-Fi.",
    links: [flash],
  },
  {
    id: "esp32-s3-c3",
    title: "Newer ESP32 boards",
    hardware: "ESP32-S3 or ESP32-C3 dev board",
    path: "Web flasher (no code)",
    goals: ["freeze", "humidity"],
    status: "built-in",
    noCode: true,
    notes: "The flasher has images for both; only the original ESP32 has been run on hardware so far.",
    links: [flash],
  },
  {
    id: "home-assistant",
    title: "Sensors already in Home Assistant",
    hardware: "Any Zigbee, Z-Wave, or Wi-Fi sensor Home Assistant can see",
    path: "HACS integration",
    goals: ["freeze", "humidity", "leak", "door"],
    status: "guide",
    noCode: false,
    notes: "An automation pushes entity states to ProbeHarbor, so alerts still reach you when Home Assistant or the power is down. Needs a little YAML.",
    links: [
      { label: "Home Assistant", href: "/integrations/home-assistant" },
      { label: "Notify recipes", href: "/about/home-assistant-notify-recipes" },
    ],
  },
  {
    id: "esphome-shelly",
    title: "ESPHome or Shelly devices",
    hardware: "ESPHome firmware, or a Shelly H&T / Flood",
    path: "http_request / webhook",
    goals: ["freeze", "humidity", "leak"],
    status: "guide",
    noCode: false,
    notes: "Point the device's HTTP action at your ingest URL. Copy the ESPHome snippet from your device's page.",
    links: [{ label: "ESPHome & Shelly recipes", href: "/about/esphome-shelly-recipes" }, checker],
  },
  {
    id: "mqtt",
    title: "An MQTT feed",
    hardware: "Anything already publishing to an MQTT broker",
    path: "MQTT bridge or Node-RED",
    goals: ["freeze", "humidity", "leak", "door", "air"],
    status: "guide",
    noCode: false,
    notes: "Forward topics to the ingest endpoint. Check one message with the payload checker before wiring the flow.",
    links: [
      { label: "MQTT bridge", href: "/about/mqtt-bridge" },
      { label: "Node-RED", href: "/integrations/node-red" },
      checker,
    ],
  },
  {
    id: "arduino",
    title: "Arduino sketches",
    hardware: "Arduino with Ethernet/Wi-Fi, ESP8266, or ESP32 in the Arduino IDE",
    path: "Arduino sketch posting JSON",
    goals: ["freeze", "humidity"],
    status: "guide",
    noCode: false,
    notes: "Start from an example sketch and change the key and pins.",
    links: [{ label: "Arduino sketches", href: "/about/arduino-sketches" }, checker],
  },
  {
    id: "pico-w",
    title: "Raspberry Pi Pico W",
    hardware: "Pico W + DS18B20 or DHT22, MicroPython",
    path: "MicroPython script",
    goals: ["freeze", "humidity"],
    status: "guide",
    noCode: false,
    notes: "A short script reads the sensor and posts JSON over Wi-Fi.",
    links: [{ label: "Pico W guide", href: "/about/pico-w-ingest" }, checker],
  },
  {
    id: "https-feed",
    title: "Your own HTTPS JSON feed",
    hardware: "A server, script, or device that already serves readings as JSON",
    path: "Pull feed (we poll it)",
    goals: ["freeze", "humidity"],
    status: "guide",
    noCode: false,
    notes: "Add the URL under Devices → Pull feeds; we fetch it on a schedule.",
    links: [{ label: "Python feeds", href: "/about/python-feeds" }, { label: "Adding devices", href: "/about/adding-devices" }],
  },
  {
    id: "cellular",
    title: "No Wi-Fi at the site",
    hardware: "Cellular modem board (e.g. SIM7000 / LTE-M)",
    path: "Cellular POST",
    goals: ["freeze"],
    status: "guide",
    noCode: false,
    notes: "For cabins and outbuildings without Wi-Fi. Data plans and power are the hard parts.",
    links: [{ label: "Cellular ingest", href: "/about/cellular-ingest" }, checker],
  },
];
