/**
 * Answer-first pages for the questions people ask search engines and AI
 * assistants about freeze alarms. Each opens with a direct answer that can be
 * quoted on its own, then the detail. Keep claims sourced and product mentions
 * honest (competitors included where they are the better fit).
 */
export type Answer = {
  slug: string;
  path: string;
  /** The question, used as the h1. */
  question: string;
  /** Under 160 characters. */
  description: string;
  /** Two or three sentences that fully answer the question. */
  shortAnswer: string;
  datePublished: string;
  sections: Array<{ heading: string; paragraphs: string[]; code?: string }>;
  faqs: Array<{ question: string; answer: string }>;
  related: Array<{ label: string; href: string }>;
  sources?: Array<{ label: string; url: string }>;
};

export const answers: Answer[] = [
  {
    slug: "garage-pipe-freeze-temperature",
    path: "/answers/garage-pipe-freeze-temperature",
    question: "At what temperature do pipes freeze in a garage?",
    description:
      "Water freezes at 32°F, but garage pipes usually freeze when it drops to about 20°F outside. Why, what speeds it up, and where to set an alert.",
    shortAnswer:
      "Water freezes at 32°F, but pipes rarely freeze the moment the air reaches 32°F. University of Illinois research found uninsulated pipes in unheated spaces start to freeze when it drops to about 20°F outside, and a garage usually stays a few degrees warmer than outdoors. What matters is the temperature at the pipe, so set an alert for 34–38°F there to leave time to act.",
    datePublished: "2026-09-28",
    sections: [
      {
        heading: "Why 32°F is not the whole story",
        paragraphs: [
          "A pipe has to lose heat for a while before the water in it freezes, and water can cool a few degrees below 32°F before ice starts to form. Short dips below freezing often pass without harm; a long, cold night does not.",
          "The burst usually is not where the ice forms. Ice blocks the pipe, and pressure builds between the blockage and a closed faucet until the pipe splits there.",
        ],
      },
      {
        heading: "What makes garage pipes freeze sooner",
        paragraphs: [
          "Pipes on exterior walls, near the overhead door, or in drafty corners get much colder than the middle of the garage. Wind through gaps can freeze an exposed pipe even when it is above 20°F outside.",
          "An open or poorly sealed garage door, a heater that trips its breaker, and missing pipe insulation are the usual causes when a garage pipe freezes.",
        ],
      },
      {
        heading: "How to know before it happens",
        paragraphs: [
          "Measure at the pipe, not in the middle of the room: a waterproof probe (such as a DS18B20) against the coldest pipe run tells you what the pipe is experiencing.",
          "Alert a few degrees above 32°F so there is time to close a door, reset a heater, or open a faucet. A forecast warning the day before a hard freeze adds even more lead time.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can pipes freeze at 32°F?",
        answer:
          "Yes, if the pipe itself stays at or below 32°F long enough, especially with wind or no insulation. Most freezes happen on long nights well below freezing, which is why the outdoor 20°F figure is a useful warning sign.",
      },
      {
        question: "Does an attached garage protect pipes from freezing?",
        answer:
          "Not reliably. Attached garages are often unheated and their exterior walls and doors can get almost as cold as outdoors on a windy night.",
      },
      {
        question: "What temperature should a garage be kept at to protect pipes?",
        answer:
          "Keeping the air around the pipes above freezing is the goal; many people aim for 40°F or more in a garage with plumbing and alert if it drops toward 34–38°F.",
      },
    ],
    related: [
      { label: "What temperature should a freeze alarm be set to?", href: "/answers/freeze-alarm-temperature-setting" },
      { label: "ESP32 freeze kit parts list", href: "/about/esp32-freeze-kit" },
      { label: "Garage heater failure scenario", href: "/stories/garage-freeze-alert" },
    ],
    sources: [
      { label: "At what temperature do pipes freeze? (KXAN, citing University of Illinois research)", url: "https://www.kxan.com/weather/weather-blog/at-what-temperature-do-pipes-freeze/" },
      { label: "How pipes freeze and burst (Farm Bureau Insurance)", url: "https://www.scfbins.com/articles/how-pipes-freeze-and-burst" },
    ],
  },
  {
    slug: "freeze-alarm-temperature-setting",
    path: "/answers/freeze-alarm-temperature-setting",
    question: "What temperature should a freeze alarm be set to?",
    description:
      "Set a freeze alarm to 34–38°F measured at the pipe. When to go lower or higher, and how to avoid false alarms without losing warning time.",
    shortAnswer:
      "Set it to 34–38°F if the sensor is on or next to the pipe. Go toward 34°F if you can respond within an hour; go toward 38–40°F if the sensor measures room air away from the pipes or it takes you hours to get there, like an empty cabin.",
    datePublished: "2026-09-28",
    sections: [
      {
        heading: "The trade-off: warning time vs false alarms",
        paragraphs: [
          "A higher threshold gives you more time but fires on cold nights when nothing is wrong. A lower threshold is quieter but leaves less time between the alert and a frozen pipe.",
          "Start at 36°F. If it fires on normal nights, move the probe closer to the pipe before you lower the number; the reading at the pipe is what matters.",
        ],
      },
      {
        heading: "Adjust for how far away you are",
        paragraphs: [
          "At home, 34–36°F is usually enough: you can close a door or reset a heater in minutes.",
          "For a cabin, rental, or vacant house, use 38–40°F and add a second person who can respond, because someone has to drive there.",
        ],
      },
      {
        heading: "Add a forecast warning",
        paragraphs: [
          "A threshold alert tells you it is getting cold now. A forecast warning tells you the day before that tonight is going to be dangerous, which is when to check the heater and close things up.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is 32°F a good freeze alarm setting?",
        answer:
          "It is too late for most setups. By the time the air near the sensor reads 32°F, a colder pipe elsewhere may already be freezing, and you have no time left to respond.",
      },
      {
        question: "Why does my freeze alarm go off when nothing is wrong?",
        answer:
          "Usually the sensor is near a door, window, or vent that swings colder than the pipes. Move it next to the pipe you care about, or add a short delay so brief dips do not alert.",
      },
    ],
    related: [
      { label: "At what temperature do pipes freeze in a garage?", href: "/answers/garage-pipe-freeze-temperature" },
      { label: "Where should a crawlspace freeze sensor go?", href: "/answers/crawlspace-freeze-sensor-placement" },
      { label: "Freeze season checklist", href: "/freeze-season" },
    ],
  },
  {
    slug: "crawlspace-freeze-sensor-placement",
    path: "/answers/crawlspace-freeze-sensor-placement",
    question: "Where should a freeze sensor go in a crawlspace?",
    description:
      "Put a crawlspace freeze sensor on the coldest water supply line, usually near vents or where pipes enter, not at the access hatch. How to mount it.",
    shortAnswer:
      "On or right next to the coldest water supply line, not at the access hatch. That is usually near a foundation vent, along the rim joist on the windward side, or where the supply line comes through the foundation. A waterproof probe taped to the pipe measures what the pipe actually feels.",
    datePublished: "2026-09-28",
    sections: [
      {
        heading: "Find the coldest pipe",
        paragraphs: [
          "Cold air enters through vents, gaps at the rim joist, and around the pipe penetration. The supply line nearest those spots freezes first.",
          "If you are not sure, put two probes out for a week and compare them on a cold night; the one that dips first is where the sensor belongs.",
        ],
      },
      {
        heading: "How to mount it",
        paragraphs: [
          "Use a waterproof probe such as a DS18B20 on a cable. Tape it to the pipe and wrap the pipe insulation back over it so it reads the pipe, not the air.",
          "Keep the board and power supply off the ground in a dry spot; crawlspaces get damp. A second probe in the open air is useful context.",
        ],
      },
      {
        heading: "Add a leak contact while you are down there",
        paragraphs: [
          "A wet/dry contact on the floor under the main line catches a slow leak or a thaw after a freeze, which is often when the damage shows up.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is a crawlspace humidity sensor enough to catch freezing?",
        answer:
          "No. Humidity helps spot moisture problems, but freeze risk is the temperature at the pipe. Use a temperature probe on the pipe.",
      },
      {
        question: "Should crawlspace vents be closed in winter?",
        answer:
          "In freezing climates, many homeowners close or cover foundation vents for winter to keep cold air off the pipes. A stuck-open vent is a common cause of crawlspace freezes.",
      },
    ],
    related: [
      { label: "Crawlspace vent scenario", href: "/stories/crawlspace-pipe-watch" },
      { label: "What temperature should a freeze alarm be set to?", href: "/answers/freeze-alarm-temperature-setting" },
      { label: "ESP32 freeze kit parts list", href: "/about/esp32-freeze-kit" },
    ],
  },
  {
    slug: "home-assistant-freeze-alert",
    path: "/answers/home-assistant-freeze-alert",
    question: "How do I set up a freeze alert in Home Assistant?",
    description:
      "A Home Assistant freeze alert is one automation: trigger when a temperature sensor stays below 35°F for 10 minutes, then notify your phone. YAML inside.",
    shortAnswer:
      "Create an automation with a numeric state trigger on your temperature sensor, below 35°F for 10 minutes, and a notify action to your phone. The catch: if Home Assistant or your home internet is down, the alert never goes out, so pair it with something that notices when readings stop.",
    datePublished: "2026-09-28",
    sections: [
      {
        heading: "The automation",
        paragraphs: [
          "Replace the sensor and notify service with your own. The 10-minute delay stops a brief draft from alerting. This assumes Home Assistant is set to °F; use about 2°C if it is in Celsius.",
        ],
        code: `automation:
  - alias: Garage freeze warning
    triggers:
      - trigger: numeric_state
        entity_id: sensor.garage_temperature
        below: 35
        for: "00:10:00"
    actions:
      - action: notify.mobile_app_your_phone
        data:
          title: Freeze warning
          message: "Garage is {{ states('sensor.garage_temperature') }}°"`,
      },
      {
        heading: "The weak spot: when Home Assistant is the thing that fails",
        paragraphs: [
          "A power cut or internet outage is often what lets a space get cold, and it also takes Home Assistant or its connection offline. The automation cannot warn you about the outage that disables it.",
          "An off-site service covers that gap. ThermalTrace, for example, can receive the same readings from Home Assistant and alerts you both when it gets cold and when readings stop arriving. On Devices → Setup, choosing Home Assistant generates the YAML with your key.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can Home Assistant send a text message for a freeze alert?",
        answer:
          "Yes, through a notify integration for an SMS provider such as Twilio, or through the companion app for push notifications.",
      },
      {
        question: "Which sensor should Home Assistant use for freeze alerts?",
        answer:
          "Any temperature sensor near the pipes works: ESPHome with a DS18B20, a Zigbee sensor, or a Wi-Fi sensor with an integration. Placement near the coldest pipe matters more than the brand.",
      },
    ],
    related: [
      { label: "ThermalTrace Home Assistant integration", href: "/integrations/home-assistant" },
      { label: "What temperature should a freeze alarm be set to?", href: "/answers/freeze-alarm-temperature-setting" },
      { label: "MQTT bridge", href: "/about/mqtt-bridge" },
    ],
  },
  {
    slug: "freeze-alarm-without-subscription",
    path: "/answers/freeze-alarm-without-subscription",
    question: "Can I get a freeze alarm without a monthly subscription?",
    description:
      "Yes. Temp Stick, Govee, Home Assistant, and ThermalTrace's free plan all alert without a subscription. What each costs and what you give up.",
    shortAnswer:
      "Yes. Temp Stick sells finished sensors ($149 and up) with free text, email, and app alerts. Govee's Wi-Fi sensors (about $35–50 with the gateway) send app alerts. Home Assistant is free if you run it yourself, and ThermalTrace's free plan sends email and chat alerts from a DIY sensor. SMS on ThermalTrace needs the Pro plan.",
    datePublished: "2026-09-28",
    sections: [
      {
        heading: "The options",
        paragraphs: [
          "Temp Stick: a finished battery Wi-Fi sensor. The most expensive per sensor, but no setup and no fees, and it includes text alerts.",
          "Govee: cheap Wi-Fi gateway plus sensors with app notifications. Fine for a room; check that alerts reach you reliably away from home.",
          "Home Assistant: free and flexible if you already run it, but it depends on your home internet and power staying up (see the Home Assistant freeze alert answer).",
          "ThermalTrace: about $25 of DIY parts per probe, free email and chat alerts, leak contacts, and history. SMS, push, and longer history are on paid plans.",
        ],
      },
      {
        heading: "What to weigh",
        paragraphs: [
          "Setup: finished sensors win. Cost per zone: DIY probes win once you want several. Getting woken up at night: SMS or push matters more than email, so check which plan includes it.",
        ],
      },
    ],
    faqs: [
      {
        question: "Does Temp Stick charge a monthly fee?",
        answer:
          "No. Temp Stick says monitoring, data history, and text, email, and app alerts are free for the life of the sensor.",
      },
      {
        question: "Is ThermalTrace free?",
        answer:
          "There is a free plan with email and chat alerts, a week of history, and up to two devices. Member and Pro add history, CSV export, forecast warnings, and SMS.",
      },
    ],
    related: [
      { label: "ThermalTrace vs Temp Stick", href: "/compare/tempstick" },
      { label: "ThermalTrace vs Govee", href: "/compare/govee" },
      { label: "Plans and pricing", href: "/pricing" },
    ],
    sources: [
      { label: "Temp Stick common questions", url: "https://tempstick.com/common-questions/" },
      { label: "GoveeLife Smart Thermometer R1", url: "https://us.govee.com/products/goveelife-smart-thermometer-r1" },
    ],
  },
];

export function getAnswer(slug: string): Answer | undefined {
  return answers.find((a) => a.slug === slug);
}
