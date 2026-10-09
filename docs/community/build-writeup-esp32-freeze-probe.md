# Build write-up: ESP32 pipe freeze alarm (draft)

One draft to adapt for [Hackster](https://www.hackster.io/), [Instructables](https://www.instructables.com/), and [Arduino Project Hub](https://projecthub.arduino.cc/). Post it as a build guide, not an announcement: each site wants photos of your own build and the steps, with the service as one part of it.

Before posting:

- Add your own photos: parts laid out, the wiring on a breadboard, the probe taped to a pipe, the Serial monitor showing `POST 200`, and the dashboard chart after a night of readings.
- Disclose that you wrote ProbeHarbor (the intro below does).
- Only describe results you actually measured. Do not add a story about pipes that were saved unless it happened.
- Vary the title and intro per site so the three posts are not copies of each other.

---

**Title options**

- $25 Wi‑Fi pipe freeze alarm with an ESP32 and a DS18B20
- Get an email before your garage pipes freeze (ESP32 + DS18B20)
- ESP32 freeze sensor for a crawlspace, garage, or cabin

**Difficulty:** beginner · **Time:** about 45 minutes · **Cost:** about $25 in parts

**Tags:** `esp32` `ds18b20` `home-automation` `temperature` `iot` `freeze-alarm`

---

## Intro

Pipes in an unheated garage or crawlspace freeze on long cold nights, usually when it is around 20°F or colder outside, and the first sign is often water on the floor after the thaw. This build puts a waterproof temperature probe directly on the pipe and sends an email when it gets close to freezing, so there is time to close a door, restart a heater, or open a faucet.

The probe posts readings to ProbeHarbor, an open-source (MIT) dashboard I wrote for this. The free plan covers two devices with email alerts. The firmware is a plain HTTPS POST, so you can point it at your own server instead if you prefer.

## Parts

| Part | Notes |
|------|-------|
| ESP32 board with Wi‑Fi | Any ESP32 DevKit, Adafruit HUZZAH32, or ESP32-S3 Feather |
| Waterproof DS18B20 probe | Rated −55°C to 125°C; the sealed tip can sit under pipe insulation |
| 4.7 kΩ resistor | Pull-up on the data line (some probe packs include one) |
| USB power supply | 5 V, 500 mA or more |

Skip "ESP32 + sensor" bundles that include a DHT11: it is not waterproof and it is the wrong sensor for a pipe.

Parts list with links: https://probeharbor.dev/about/esp32-freeze-kit

## Step 1: Wire the probe

- Red → 3.3V
- Black → GND
- Yellow or white (data) → GPIO 4
- 4.7 kΩ resistor between data and 3.3V

*(photo: breadboard wiring)*

## Step 2: Create a device and get the sketch

1. Create a free account at https://probeharbor.dev
2. Dashboard → Devices → add a push device
3. Download the Arduino sketch. It comes with your device's ingest URL filled in.

The same sketch is in the repo if you want to read it first: https://github.com/doodersrage/thermaltrace/tree/main/sketches/arduino/ds18b20_ingest

## Step 3: Flash it

1. Arduino IDE: install the ESP32 board package and the `OneWire` and `DallasTemperature` libraries
2. Set your Wi‑Fi name and password in the sketch
3. Upload, then open Serial Monitor at 115200 baud
4. You should see `POST 200` each time a reading is sent

*(photo: Serial Monitor)*

MicroPython, CircuitPython, and PlatformIO versions are in the same repo folder.

## Step 4: Mount the probe

Tape the stainless tip against the coldest section of pipe: near the garage door, a foundation vent, or where the line comes through the wall. Wrap the pipe insulation back over it so it reads the pipe and not the air. Keep the board itself somewhere dry.

*(photo: probe on pipe)*

## Step 5: Set the alert

Dashboard → Alerts → set the freeze threshold to 34–38°F and confirm your email, then send a test alert. Use the higher end if it takes you a while to get there.

*(photo or screenshot: chart after the first night)*

## How it works

Once a minute the ESP32 reads the DS18B20 over 1‑Wire and sends a small JSON body over HTTPS:

```json
{ "temp1": 41.25, "rssi": -62 }
```

The server stores the reading, compares it with your threshold, and estimates how many hours are left at the current cooling rate. It also notices when the device stops reporting, which in winter usually means the power or Wi‑Fi is out.

## Going further

- Add a second DS18B20 on the same pin (1‑Wire probes share a data line) to compare the pipe with the room air
- Add a leak contact on the floor to catch the thaw: https://github.com/doodersrage/thermaltrace/tree/main/sketches/arduino/leak_contact_ingest
- Already on ESPHome or Home Assistant? Post readings from there instead of flashing a sketch: https://probeharbor.dev/integrations/home-assistant
- Work out how long you have on a cold night: https://probeharbor.dev/freeze-time-calculator

## Source

- Sketches for ESP32, Pico W, Teensy, STM32, and more: https://github.com/doodersrage/thermaltrace/tree/main/sketches
- Server and dashboard (MIT): https://github.com/doodersrage/thermaltrace
