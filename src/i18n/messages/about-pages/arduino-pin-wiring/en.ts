
/** /about/arduino-pin-wiring body copy. `Html` keys are trusted inline HTML; hrefs stay English. */
const ETH_LINK =
  '<a class="text-link" href="https://github.com/doodersrage/probeharbor/tree/main/sketches/arduino/ethernet_dht22_ingest" target="_blank" rel="noreferrer"><code>ethernet_dht22_ingest</code></a>';

const en = {
  introHtml:
    "The pin-level diagram below matches the firmware's <code>LiquidCrystal</code> constructor and the DHT22 data lines used in this project. Use it when verifying jumper wires against the sketch: especially if analog pins are serving as digital I/O.",
  diagramAlt: "Pin-level wiring diagram for Arduino Uno connecting LCD and two DHT22 sensors",
  diagramCaption: "RS, RW, EN, data lines, backlight, and both DHT22 data pins mapped to specific Uno pins.",
  lcdTitle: "16×2 LCD pin map",
  lcdIntroHtml:
    "The sketch uses the seven-argument <code>LiquidCrystal(rs, rw, enable, d4, d5, d6, d7)</code> form. In this build:",
  lcdItemsHtml: [
    "<strong>RS</strong> → digital pin 8",
    "<strong>RW</strong> → digital pin 9",
    "<strong>Enable</strong> → analog pin A2 (used as digital output)",
    "<strong>D4–D7</strong> → digital pins 5, 6, 3, and analog pin A3 respectively",
  ],
  lcdRw:
    "Most tutorials tie RW straight to ground and use a six-argument constructor. Wiring RW to pin 9 is less common but valid: it allows the library to read the LCD busy flag instead of blind-writing every character.",
  backlightTitle: "Backlight on pin 7",
  backlightBody:
    "Pin 7 is not an LCD data line. It drives the backlight through a small transistor on the breadboard (visible near the header in the physical build). Switching the backlight separately saves power and lets you blink the display for alerts without rewriting LCD text.",
  dhtTitle: "DHT22 data pins",
  dhtItemsHtml: [
    "<strong>Sensor 1 data</strong> → analog pin A4",
    "<strong>Sensor 2 data</strong> → analog pin A5",
    "Both sensors also connect to 5 V and GND",
  ],
  dhtBodyHtml:
    "Analog pins A4 and A5 work perfectly as digital inputs on the Uno. They appear as <code>A4</code> and <code>A5</code> in code rather than <code>D14</code>/<code>D15</code> aliases: worth remembering when tracing wires by eye.",
  spiTitle: "Reserved SPI pins (Ethernet)",
  spiBody:
    "The Ethernet shield reserves pins 10–13 for SPI. None of the LCD or DHT22 wiring may use those lines; they are effectively off-limits on the header. Planning around that reservation is what makes Ethernet plus local sensors feasible on one Uno.",
  outroHtml: `Return to the <a class="text-link" href="/about/arduino-circuit-wiring">circuit wiring overview</a> for breadboard layout context, or read <a class="text-link" href="/about/arduino-dht22-lcd">DHT22 sensors and LCD display</a> for runtime behavior. Push ingest sample (no LCD): ${ETH_LINK}.`,
};

export type ArduinoPinWiringMessages = typeof en;
export default en;
