export type CompareGuide = {
  slug: string;
  path: string;
  title: string;
  headline: string;
  description: string;
  competitor: string;
  summary: string;
  lede: string;
  /** Optional Creative Commons atmosphere photo. */
  photoId?: import("./aboutPhotos").AboutPhotoId;
  whenThermalTrace: string[];
  whenOther: string[];
  rows: Array<{ capability: string; thermaltrace: string; other: string }>;
  faqs: Array<{ question: string; answer: string }>;
  /** Where competitor facts came from, and when they were last checked. */
  sources?: { checkedOn: string; links: Array<{ label: string; url: string }> };
};

export const compareGuides: CompareGuide[] = [
  {
    slug: "diy-mqtt",
    path: "/compare/diy-mqtt",
    title: "ThermalTrace vs DIY MQTT",
    headline: "ThermalTrace vs DIY MQTT + Node-RED",
    description:
      "Compare ThermalTrace freeze and leak alerts to a self-hosted MQTT, Node-RED, and cron stack: ops burden, SMS, history, and household sharing.",
    competitor: "DIY MQTT / Node-RED",
    summary:
      "DIY MQTT is powerful if you enjoy running brokers, dashboards, and alert scripts. ThermalTrace is the same outcome, live probes, freeze and leak alerts, history, without babysitting the stack at 2 a.m.",
    lede:
      "A Mosquitto broker, Node-RED flows, and a cron job can freeze-alert a garage. The cost is patching, TLS, Twilio, and a Pi that has to stay up. ThermalTrace is the hosted alerts and history layer: keep MQTT on the LAN if you want, bridge readings over HTTPS, and let household freeze and leak channels live in the cloud.",
    photoId: "ethernet-cable",
    whenThermalTrace: [
      "You want freeze and leak SMS/email/push without wiring Twilio yourself",
      "Household members need access without VPN to your Pi",
      "You still use ESP/Arduino. HTTPS ingest or MQTT→HTTP bridge",
    ],
    whenOther: [
      "You already run a hardened MQTT + Grafana stack and like maintaining it",
      "Every automation must stay fully on-LAN with no cloud dependency",
      "You need custom industrial protocols ThermalTrace does not speak",
    ],
    rows: [
      { capability: "Broker / server upkeep", thermaltrace: "Hosted (no Mosquitto to patch)", other: "You patch Mosquitto/HA" },
      { capability: "Freeze and leak alerts", thermaltrace: "Built-in channels + remaining-hours freeze clock", other: "Node-RED + Twilio/email" },
      { capability: "ESP ingest", thermaltrace: "HTTPS device key or MQTT bridge", other: "MQTT topic design" },
      { capability: "History & CSV", thermaltrace: "On paid plans", other: "Influx/Postgres you manage" },
      { capability: "Share with family", thermaltrace: "Household invites", other: "VPN or reverse proxy" },
    ],
    faqs: [
      {
        question: "Can I keep MQTT and still use ThermalTrace?",
        answer:
          "Yes. Keep Mosquitto or Home Assistant on your LAN for local automations and bridge selected topics over HTTPS ingest. ThermalTrace is the off-site freeze/leak alerts and history layer.",
      },
      {
        question: "Do I need to run Twilio myself?",
        answer:
          "No on ThermalTrace Pro: SMS, push, and chat channels are hosted. DIY MQTT usually means wiring Twilio or email yourself and keeping that stack online.",
      },
      {
        question: "Where is the MQTT bridge recipe?",
        answer:
          "thermaltrace.dev/about/mqtt-bridge and the HACS integration at thermaltrace.dev/integrations/home-assistant.",
      },
    ],
  },
  {
    slug: "govee",
    path: "/compare/govee",
    title: "ThermalTrace vs Govee",
    headline: "ThermalTrace vs Govee sensors",
    description:
      "Govee vs ThermalTrace for freeze and leak monitoring in unheated spaces: alerts, ESP ingest, multi-probe zones, and exportable history.",
    competitor: "Govee",
    summary:
      "Govee, and consumer hubs like SmartThings: are great for cheap room sensors and a polished phone app. ThermalTrace is built for freeze and leak workflows in garages, workshops, attics, and shops: your own ESP probes, household alerts, and history you can export.",
    lede:
      "Govee hygrometers (and SmartThings-style hubs that absorb the same class of Bluetooth/Wi-Fi pods) win on price and a friendly phone app for bedrooms and closets. They are weaker in a detached garage or shop: Bluetooth range, vendor lock-in, and alerts that mostly stay in-app. ThermalTrace assumes you bring an ESP32, then gives household freeze and leak routing and a season of exportable history.",
    photoId: "garage-workbench",
    whenThermalTrace: [
      "You want ESP, Pico W, STM32, CH32V, or Arduino probes you control (not only vendor pods)",
      "Freeze and leak alerts need SMS, webhooks, or household routing",
      "You care about CSV/history across a whole cold season",
    ],
    whenOther: [
      "You only need a few battery Bluetooth sensors indoors",
      "You prefer an all-in-one consumer app with no DIY hardware",
      "Garage Wi-Fi is impossible and Bluetooth range is enough",
    ],
    rows: [
      { capability: "Hardware", thermaltrace: "BYO ESP / Pico / Arduino", other: "Govee pods" },
      { capability: "Garage / detached spaces", thermaltrace: "Designed for it", other: "Hit-or-miss range" },
      { capability: "Alert channels", thermaltrace: "Email, SMS, push, chat, webhooks + time-to-freeze clock", other: "Mostly app push" },
      { capability: "Price", thermaltrace: "About $25 in parts per probe; Free plan, Member $4/mo, Pro $10/mo", other: "Roughly $35–50 for a Wi-Fi gateway + sensor; no subscription" },
      { capability: "Data export", thermaltrace: "CSV (Member+) and API (Pro)", other: "Export from the app; 2 years of stored data on some models" },
      { capability: "Multi-user household", thermaltrace: "Included", other: "Account sharing awkward" },
    ],
    faqs: [
      {
        question: "Is ThermalTrace a Govee replacement for bedrooms?",
        answer:
          "Not primarily. Govee wins for cheap indoor Bluetooth pods and a polished consumer app. ThermalTrace is for freeze and leak workflows in garages, workshops, and other unheated spaces on hardware you control.",
      },
      {
        question: "Can I use ESP32 instead of Govee pods?",
        answer:
          "Yes. ThermalTrace expects BYO ESP/Pico/Arduino (or JSON ingest). That is the point for detached garages where Bluetooth range fails.",
      },
      {
        question: "Which has better freeze alert channels?",
        answer:
          "ThermalTrace: email and chat apps on every plan, SMS, push, and webhooks on Pro, plus a time-to-freeze clock. Govee alerts are app notifications, and you need the Wi-Fi gateway version to get them away from home.",
      },
    ],
    sources: {
      checkedOn: "September 2026",
      links: [
        { label: "GoveeLife Smart Thermometer R1 (gateway + sensor)", url: "https://us.govee.com/products/goveelife-smart-thermometer-r1" },
        { label: "Govee Wi-Fi Thermo-Hygrometer", url: "https://us.govee.com/products/wi-fi-temperature-humidity-sensor" },
      ],
    },
  },
  {
    slug: "tempest",
    path: "/compare/tempest",
    title: "ThermalTrace vs Tempest",
    headline: "ThermalTrace vs WeatherFlow Tempest",
    description:
      "Outdoor weather stations like Tempest vs ThermalTrace indoor probes, when you need pipe freeze alerts where the water actually is.",
    competitor: "WeatherFlow Tempest",
    summary:
      "Tempest shines at yard weather: wind, rain, outdoor temp. Pipe freeze risk lives indoors. ThermalTrace watches the garage, crawlspace, or shop where the plumbing is.",
    lede:
      "A Tempest on the roof tells you outdoor air, wind, and rain with excellent fidelity. Pipes freeze where the water is, usually a garage, crawlspace, or shop the station never sees. Use Tempest for yard weather and ThermalTrace for the indoor probe that sits by the plumbing.",
    photoId: "cold-weather-road",
    whenThermalTrace: [
      "You need indoor / unheated-space probe temps for pipe risk",
      "Alerts should fire on space temperature, not only outdoor air",
      "You already have or want DIY sensors on Wi-Fi",
    ],
    whenOther: [
      "You want a best-in-class outdoor personal weather station",
      "Your goal is hyper-local forecast and storm data",
      "You do not have indoor plumbing freeze risk",
    ],
    rows: [
      { capability: "Primary job", thermaltrace: "Indoor freeze / space monitoring", other: "Outdoor weather" },
      { capability: "Probe location", thermaltrace: "Garage, crawlspace, closet", other: "Roof / yard" },
      { capability: "Freeze alerts on pipes", thermaltrace: "Direct + hours-until-freeze clock", other: "Infer from outdoor only" },
      { capability: "DIY ESP ingest", thermaltrace: "Yes", other: "N/A" },
      { capability: "Complements the other?", thermaltrace: "Yes, use both", other: "Yes: outdoor context" },
    ],
    faqs: [
      {
        question: "Does Tempest replace an indoor freeze probe?",
        answer:
          "No. Tempest measures outdoor yard weather. Pipe freeze risk lives indoors (garage, crawlspace, shop). Use Tempest for outdoor context and ThermalTrace for the probe by the plumbing.",
      },
      {
        question: "Can I use both Tempest and ThermalTrace?",
        answer:
          "Yes. Many households keep Tempest for weather and ThermalTrace for space temperature alerts where water actually sits.",
      },
      {
        question: "Will outdoor air alone catch a garage freeze?",
        answer:
          "Not reliably. Garages lag outdoor air and can freeze while the yard looks milder, or stay warmer while outdoor air plummets. Probe the space.",
      },
    ],
  },
  {
    slug: "nest",
    path: "/compare/nest",
    title: "ThermalTrace vs Nest Thermostat",
    headline: "ThermalTrace vs a Nest Thermostat for freeze protection in unheated spaces",
    description:
      "A Nest thermostat has no signal from an unheated garage. ThermalTrace probes that space and can show your Nest reading with freeze alerts.",
    competitor: "Nest Thermostat",
    summary:
      "Nest is excellent at running your HVAC and reporting the temperature where it (or a Nest Temperature Sensor) is installed -- almost never the garage, crawlspace, or shop where pipes actually freeze. ThermalTrace watches that space directly, and if you connect your Nest account, pulls its reading and heating status into every freeze alert for context.",
    lede:
      "Nest does one job very well: run the furnace and track the temperature of the room it's in. An unheated garage, crawlspace, or workshop is unconditioned by design, so Nest has no reading from it at all -- there's nothing to alert on. ThermalTrace puts a dedicated probe in that space, and if you connect your Nest account (Pro), every freeze alert shows your house's indoor temperature and whether it's actively heating, so you can tell at a glance whether the cold is expected (garage is unconditioned, house is fine) or something's actually wrong.",
    photoId: "crawlspace",
    whenThermalTrace: [
      "You have a garage, crawlspace, basement, or shop that isn't on Nest's heating loop",
      "You want an alert from the specific unconditioned space, not an inference from the thermostat",
      "You already use Nest and want its reading shown alongside freeze alerts, not replaced",
    ],
    whenOther: [
      "You only need the temperature of Nest-conditioned living space",
      "You want to control heating/cooling schedules, not just monitor a cold space",
      "You don't have a separate unconditioned space that needs its own probe",
    ],
    rows: [
      { capability: "Primary job", thermaltrace: "Freeze/leak monitoring for any space", other: "HVAC control for conditioned space" },
      { capability: "Sees an unheated garage/crawlspace", thermaltrace: "Yes: dedicated probe", other: "No: unconditioned spaces aren't on the loop" },
      { capability: "Freeze/leak alerts (SMS, push, email)", thermaltrace: "Yes, plus remaining-hours time-to-freeze", other: "No" },
      { capability: "Shows thermostat reading on freeze alerts", thermaltrace: "Yes, if connected (Pro)", other: "N/A" },
      { capability: "Controls heating schedules", thermaltrace: "No", other: "Yes" },
      { capability: "Complements the other?", thermaltrace: "Yes: connect both", other: "Yes: connect both" },
    ],
    faqs: [
      {
        question: "Does Nest see my unheated garage?",
        answer:
          "Usually no. Nest reports the conditioned space where it (or a Nest Temperature Sensor) is installed. Unheated garages and crawlspaces are off that loop.",
      },
      {
        question: "Can ThermalTrace show Nest readings?",
        answer:
          "Yes on Pro when Nest OAuth is connected: freeze alerts and Overview can show house indoor temp and heating status beside your garage probe.",
      },
      {
        question: "Should I replace Nest with ThermalTrace?",
        answer:
          "No. Nest runs HVAC; ThermalTrace watches unconditioned spaces. Connect both when you want thermostat context on freeze alerts.",
      },
    ],
  },
  {
    slug: "ecobee",
    path: "/compare/ecobee",
    title: "ThermalTrace vs Ecobee Thermostat",
    headline: "ThermalTrace vs an Ecobee Thermostat for freeze protection in unheated spaces",
    description:
      "An Ecobee thermostat has no signal from an unheated garage. ThermalTrace probes that space and can show your Ecobee reading with freeze alerts.",
    competitor: "Ecobee Thermostat",
    summary:
      "Ecobee is excellent at running your HVAC and reporting the temperature where it (or an Ecobee SmartSensor) is installed -- almost never the garage, crawlspace, or shop where pipes actually freeze. ThermalTrace watches that space directly, and if you connect your Ecobee account, pulls its reading and heating status into every freeze alert for context.",
    lede:
      "Ecobee does one job very well: run the furnace and track the temperature of the room it's in. An unheated garage, crawlspace, or workshop is unconditioned by design, so Ecobee has no reading from it at all -- there's nothing to alert on. ThermalTrace puts a dedicated probe in that space, and if you connect your Ecobee account (Pro), every freeze alert shows your house's indoor temperature and whether it's actively heating, so you can tell at a glance whether the cold is expected (garage is unconditioned, house is fine) or something's actually wrong.",
    photoId: "basement-pex-pipes",
    whenThermalTrace: [
      "You have a garage, crawlspace, basement, or shop that isn't on Ecobee's heating loop",
      "You want an alert from the specific unconditioned space, not an inference from the thermostat",
      "You already use Ecobee and want its reading shown alongside freeze alerts, not replaced",
    ],
    whenOther: [
      "You only need the temperature of Ecobee-conditioned living space",
      "You want to control heating/cooling schedules, not just monitor a cold space",
      "You don't have a separate unconditioned space that needs its own probe",
    ],
    rows: [
      { capability: "Primary job", thermaltrace: "Freeze/leak monitoring for any space", other: "HVAC control for conditioned space" },
      { capability: "Sees an unheated garage/crawlspace", thermaltrace: "Yes: dedicated probe", other: "No: unconditioned spaces aren't on the loop" },
      { capability: "Freeze/leak alerts (SMS, push, email)", thermaltrace: "Yes, plus remaining-hours time-to-freeze", other: "No" },
      { capability: "Shows thermostat reading on freeze alerts", thermaltrace: "Yes, if connected (Pro)", other: "N/A" },
      { capability: "Controls heating schedules", thermaltrace: "No", other: "Yes" },
      { capability: "Complements the other?", thermaltrace: "Yes: connect both", other: "Yes: connect both" },
    ],
    faqs: [
      {
        question: "Does Ecobee see my unheated garage?",
        answer:
          "Usually no. Ecobee reports conditioned living space (or SmartSensors on that loop), not a detached garage or crawlspace by default.",
      },
      {
        question: "Can ThermalTrace show Ecobee readings?",
        answer:
          "Yes on Pro when Ecobee OAuth is available and connected. If Ecobee developer signup is closed, use Home Assistant → ingest → Indoor reference instead.",
      },
      {
        question: "Should I replace Ecobee with ThermalTrace?",
        answer:
          "No. Ecobee runs HVAC; ThermalTrace monitors unconditioned spaces. They complement each other.",
      },
    ],
  },
  {
    slug: "tempstick",
    path: "/compare/tempstick",
    title: "ThermalTrace vs TempStick",
    headline: "ThermalTrace vs Temp Stick Wi‑Fi sensors",
    description:
      "Temp Stick vs ThermalTrace for freeze alerts: one-time $149–209 sensors with free SMS, or $25 DIY probes with multi-zone, leak contacts, and Home Assistant.",
    competitor: "Temp Stick",
    summary:
      "Temp Stick is the easier choice for one or two spaces: a finished battery sensor, no subscription, and free text, email, and app alerts. ThermalTrace is cheaper per sensor and more flexible (several probes, leak contacts, Home Assistant), but you build the sensor and SMS needs Pro.",
    lede:
      "Temp Stick sells finished Wi‑Fi sensors: $149 for the standard model or about $199 for the PRO with a pipe clamp probe, with free text, email, and app alerts and no subscription. That is hard to beat if you want one sensor with zero setup. ThermalTrace suits people who want several probes, a leak contact under the water heater, or readings inside Home Assistant: an ESP32 and probe cost about $25, email and chat alerts are free, and SMS is on Pro.",
    photoId: "frozen-thermometer",
    whenThermalTrace: [
      "You want probes in several spots (pipes, door side, crawlspace) without buying a $149+ sensor for each",
      "You want wet/dry leak contacts and freeze alerts on one account",
      "You already run Home Assistant, ESPHome, or MQTT and want readings to flow both ways",
      "You want forecast freeze warnings, a time-to-freeze estimate, or open-source software you can inspect",
    ],
    whenOther: [
      "You want a finished sensor with no soldering, flashing, or setup beyond Wi‑Fi",
      "You need battery power where there is no outlet",
      "You want free SMS alerts with no subscription",
      "One or two sensors cover everything you need",
    ],
    rows: [
      { capability: "Hardware", thermaltrace: "DIY: ESP32 / Pico / Arduino + DS18B20 or DHT22", other: "Finished battery or AC sensor" },
      { capability: "Up-front cost", thermaltrace: "About $25 in parts per probe", other: "$149 standard; about $199 PRO with pipe clamp" },
      { capability: "Ongoing cost", thermaltrace: "Free plan; Member $4/mo; Pro $10/mo for SMS", other: "None" },
      { capability: "Pipe-mounted probe", thermaltrace: "Yes (waterproof DS18B20 on the pipe)", other: "Yes on PRO (pipe clamp)" },
      { capability: "Leak / flood contacts", thermaltrace: "Yes, alert automatically when wet", other: "Not listed on the pipe-clamp model" },
      { capability: "Alert channels", thermaltrace: "Email + chat apps free; SMS, push, webhooks on Pro", other: "SMS, email, app, all free" },
      { capability: "Sharing and data", thermaltrace: "Household invites, CSV (Member+), API (Pro)", other: "Up to 10 alert contacts, CSV export, public API" },
      { capability: "Home Assistant", thermaltrace: "Official HACS integration + push from HA", other: "Via their API" },
      { capability: "Forecast warnings", thermaltrace: "Forecast freeze (Member+), NWS alerts (Pro)", other: "Not listed; threshold alerts" },
    ],
    faqs: [
      {
        question: "Is Temp Stick easier to set up than ThermalTrace?",
        answer:
          "Yes. A Temp Stick joins Wi‑Fi and works through its app. ThermalTrace needs an ESP32 or similar board flashed with a pre-filled sketch, or an existing Home Assistant, ESPHome, or MQTT setup.",
      },
      {
        question: "Which is cheaper?",
        answer:
          "For one sensor with SMS, Temp Stick: $149–209 once versus about $25 in parts plus $100/year for ThermalTrace Pro. For several zones or email-only alerts, ThermalTrace: three probes cost about $75 in parts and the Free plan includes email alerts, versus $447+ for three Temp Sticks.",
      },
      {
        question: "Does Temp Stick charge a subscription?",
        answer:
          "No. Temp Stick says monitoring, data logging, and text, email, and app alerts are free for the life of the sensor.",
      },
      {
        question: "Can ThermalTrace watch an empty cabin like a Temp Stick?",
        answer:
          "Yes, if the cabin has Wi‑Fi and power for an ESP32. Put a waterproof probe on the coldest pipe, add a leak contact if you like, and choose email alerts (free) or SMS (Pro).",
      },
    ],
    sources: {
      checkedOn: "September 2026",
      links: [
        { label: "Temp Stick Wi‑Fi sensor ($149)", url: "https://tempstick.com/product/tempstick-wifi-temperature-humidity-sensor/" },
        { label: "Temp Stick PRO with pipe clamp", url: "https://tempstick.com/product/temp-stick-pro-for-frozen-pipe-prevention/" },
        { label: "Temp Stick common questions (fees, contacts, export, API)", url: "https://tempstick.com/common-questions/" },
      ],
    },
  },
];

export function getCompareGuide(slug: string): CompareGuide | undefined {
  return compareGuides.find((g) => g.slug === slug);
}
