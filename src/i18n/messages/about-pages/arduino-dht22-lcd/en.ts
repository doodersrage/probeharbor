
/** /about/arduino-dht22-lcd body copy. `Html` keys are trusted inline HTML; hrefs stay English. */
const ETH_LINK =
  '<a class="text-link" href="https://github.com/doodersrage/probeharbor/tree/main/sketches/arduino/ethernet_dht22_ingest" target="_blank" rel="noreferrer"><code>ethernet_dht22_ingest</code></a>';

const en = {
  heroAlt: "Arduino probe board with network connectivity and sensor wiring headers",
  heroCaption: "ProbeHarbor probe board with Ethernet, LCD, and DHT22 wiring headers.",
  intro:
    "The firmware treats the LCD and the JSON feed as two views of the same data. The LCD gives instant local feedback while you install or troubleshoot probes; the Ethernet interface publishes the same readings to the website and any other HTTP clients.",
  twoSensorsTitle: "Reading two DHT22 sensors independently",
  twoSensorsBody:
    "Each DHT22 exposes temperature and relative humidity over a single-wire data protocol. Because each sensor has its own data pin (A4 and A5 in this build), the sketch can poll them sequentially without bus collisions. That is why the LCD shows two distinct pairs: such as 21.75 °C with 71.15% humidity on one line and a different temperature on the next, rather than a single averaged local value.",
  keysHtml:
    "On the website, those same probes map to JSON keys (for example <code>0</code>, <code>1</code>, and <code>avg</code>). Labels you assign in the dashboard can rename them “North wall” and “Door zone” without changing firmware keys.",
  wiresTitle: "Three-wire sensor connections",
  wiresItemsHtml: [
    "<strong>Data</strong>, one digital pin per sensor, with a pull-up resistor as recommended by the DHT22 datasheet.",
    "<strong>VCC</strong>: 5 V from the breadboard rail (stable supply matters for consistent readings).",
    "<strong>GND</strong>: common ground with the Arduino, LCD, and Ethernet shield.",
  ],
  wiresBody:
    "Long cable runs to remote probe locations may need twisted pairs or shielding; the workshop build keeps sensors near the controller for simplicity, but the same firmware pattern scales to wired remote probes.",
  lcdTitle: "LCD layout and contrast",
  lcdBody1:
    "The 16×2 display shows live values during boot, calibration, and network outages. The contrast potentiometer on the breadboard adjusts V0 so text remains readable across temperature swings in the space. If the screen looks blank after upload, adjust contrast before debugging code.",
  lcdBody2:
    "Four-bit mode (D4–D7 only) reduces pin usage compared with eight-bit wiring: important when Ethernet already consumes SPI pins and two DHT22 data lines are allocated.",
  backlightTitle: "Backlight control",
  backlightBody:
    "Driving the backlight from pin 7 through a transistor keeps current draw off the Arduino pin itself. Firmware can dim or flash the backlight for warnings: useful when a probe reads below freezing: without blocking network serving.",
  ethernetTitle: "Ethernet alongside sensors",
  ethernetBodyHtml: `The W5100 Ethernet shield stacks on the Uno and uses SPI, leaving digital and analog pins free for the LCD and DHT22 wiring described in the <a class="text-link" href="/about/arduino-pin-wiring">pin-level guide</a>. The shield mostly “rides along” on the stack: once configured, the sketch can serve JSON over HTTP and POST the same payload for <a class="text-link" href="/about/ingest-and-webhooks">push ingest</a> (see ${ETH_LINK}).`,
  jsonTitle: "From LCD numbers to website JSON",
  jsonBodyHtml:
    'After each successful sensor read, the sketch updates the LCD and builds the JSON document served to clients. The website fetches that JSON, stores optional history when you are signed in, and renders the same probe keys on the home page. Try the <a class="text-link" href="/about/probe-demo">interactive probe demo</a> to see how multiple keys and averages appear to downstream consumers.',
};

export type ArduinoDht22LcdMessages = typeof en;
export default en;
