
/** /about/arduino-circuit-wiring body copy. `*Html` keys are trusted inline HTML (English hrefs). */

const en = {
  introHtml:
    "This build centers on an Arduino Uno with a W5100 Ethernet shield stacked on top, a solderless breadboard for power distribution and LCD support components, a 16×2 character LCD for local readouts, and two DHT22 temperature and humidity sensors. USB supplies bench power during development; a permanent install typically moves to a regulated 5 V supply.",
  diagramAlt: "Wiring diagram of Arduino Uno with Ethernet shield, breadboard, LCD, and two DHT22 sensors",
  diagramCaption:
    "High-level wiring: power enters the Uno, signals route through the breadboard to the LCD and both DHT22 sensors.",
  breadboardTitle: "Breadboard and power rails",
  breadboardHtml:
    "The breadboard mainly carries 5 V and GND power rails plus the LCD signal wiring. Keeping power and signals organized on the breadboard makes it easier to swap the contrast potentiometer or LCD without disturbing sensor leads. Tie the Arduino ground to the breadboard ground rail so every component shares a common reference.",
  contrastTitle: "LCD contrast circuit",
  contrastHtml:
    "A trim potentiometer on the breadboard sets the contrast voltage on the LCD's V0 pin. Without that divider, the display may look blank or fully dark even when the sketch is running correctly. Adjust the pot after power-up until both lines of text are readable at a glance from across the space.",
  dhtTitle: "Dual DHT22 sensors",
  dhtHtml:
    "Each DHT22 uses three connections: data, VCC, and GND. Routing data to separate Arduino pins lets the firmware poll the sensors independently, which is why the LCD can show two different temperature and humidity pairs side by side, for example 21.75 °C / 71.15% on one line and a second probe reading on the next.",
  ethernetTitle: "Ethernet shield placement",
  ethernetHtml:
    "The Ethernet shield sits piggybacked on the Uno and communicates over SPI (pins 10–13 on a classic Uno layout). It does not share data pins with the LCD or DHT22 wiring, leaving room on the header for sensor and display connections. That separation is what makes this combination workable on a single board without pin conflicts.",
  nextHtml:
    'For exact GPIO numbers matching the sketch, continue to <a class="text-link" href="/about/arduino-pin-wiring">Arduino pin-level wiring</a>. For how the LCD and probes behave in firmware, see <a class="text-link" href="/about/arduino-dht22-lcd">DHT22 sensors and LCD display</a>.',
};

export type Messages = typeof en;
export default en;
