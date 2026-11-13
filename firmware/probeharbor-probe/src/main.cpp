/**
 * ProbeHarbor probe: DS18B20 or DHT22/DHT11 → push ingest, configured after flashing.
 *
 * Unlike the sketches under sketches/, nothing is compiled in. The Wi-Fi
 * network and the device key are set either:
 *   - over USB serial, by the flasher page:  TTCFG<TAB>ssid<TAB>password<TAB>key
 *   - or through the "ProbeHarbor-Setup" Wi-Fi portal (captive page).
 * Hold the BOOT button for 5 seconds to erase both and start over.
 *
 * Every line the device prints for the flasher page starts with "TT ".
 * Wiring: sensor data on SENSOR_PIN (GPIO 4) with a 4.7k pull-up to 3.3V.
 * The pin is checked for DS18B20s first (up to four, reported as temp1..temp4);
 * if there are none it tries a DHT22 or DHT11 (reported as temp1 + humidity1).
 * Nothing to configure: the same wiring and image work for either sensor.
 *
 * Also, on each board's pins (see platformio.ini):
 *   - I2C air sensor, auto-detected: SHT31 (0x44/0x45), BME280 (0x76/0x77),
 *     or AHT20 (0x38) → temp_air, humidity_air (+ pressure_air for BME280).
 *     On the ESP32 build, if nothing answers on the default pins at boot, the
 *     Adafruit Feather pins are tried too (HUZZAH32, ESP32 Feather V2).
 *     A sensor that is found but won't give a reading prints
 *     "TT sensor problem: <name> found but not reading: <why>…" and, if nothing
 *     else was read, "TT nothing sent: <name> found but not reading" (not the
 *     DS18B20/DHT hint).
 *   - Leak contact (wet pulls LEAK_PIN to GND) → leak1, door reed switch
 *     (closed pulls DOOR_PIN to GND) → door1 (true = open), battery through
 *     a 1:1 divider on BATTERY_PIN → battery_pct. These three can't be
 *     detected (an unwired pin reads "dry"/"open"), so they're reported only
 *     when enabled: a TTEXTRAS<TAB>leak,door,battery line over USB (sent
 *     by the flasher page before TTCFG) or the portal's "extras" box.
 *
 * Readings keep their time (1.3.0+). Once the clock is set over NTP, each
 * reading is stamped and kept in a buffer until the server confirms it, then
 * sent as {"readings": [{..., "recorded_at": <unix s>}]}. A Wi-Fi or server
 * outage loses nothing until the buffer is full (BUFFER_SLOTS readings, then
 * the oldest go first). The buffer survives the probe's own restarts but not
 * a power cut. A server that answers 400 to a batch (one older than
 * 2026-11) gets plain readings, as before 1.3.0, until the next restart.
 *
 * Over-the-air updates (1.5.0+; 1.4.x were test-only builds): an hour after boot and then daily, the probe
 * reads OTA_MANIFEST_PATH (public/firmware/ota.json, made by
 * `pnpm firmware:sign`). It installs a newer version only if the manifest
 * entry for its chip is signed by the key in ota_pubkey.h, the download
 * matches the signed size and SHA-256, and its rollout bucket is in.
 * A new image is on probation until its first 2xx post: a restart before
 * that (crash, watchdog) makes the bootloader go back to the old one, and
 * 30 minutes without a 2xx makes the probe go back itself. "noupdate" in
 * the extras turns updates off for this probe.
 *
 * Watchdog (1.3.1+): if loop() stops coming round for WATCHDOG_S seconds
 * (anything stuck: a sensor library, the network stack), the chip restarts.
 * Buffered readings survive that restart; the next boot prints
 * "TT restarted by watchdog".
 */
#include <Adafruit_AHTX0.h>
#include <Adafruit_BME280.h>
#include <Adafruit_SHT31.h>
#include <Arduino.h>
#include <DHTesp.h>
#include <DallasTemperature.h>
#include <HTTPClient.h>
#include <OneWire.h>
#include <Preferences.h>
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <WiFiManager.h>
#include <Wire.h>
#include <esp_attr.h>
#include <esp_system.h>
#include <esp_task_wdt.h>
#include <esp_ota_ops.h>
#include <mbedtls/base64.h>
#include <mbedtls/pk.h>
#include <mbedtls/sha256.h>
#include <time.h>
#include <Update.h>

#include "ota_pubkey.h"

#ifndef FIRMWARE_VERSION
#define FIRMWARE_VERSION "1.5.0"
#endif
/*
 * The flasher talks to whichever USB port the board is plugged into. On the
 * ESP32-S3 and ESP32-C3 that can be a UART bridge (Serial) or the chip's own USB
 * port (USBSerial), so these builds listen and answer on both. When no computer
 * is listening on the native port, the core skips or times out those writes
 * (about 100 ms), so nothing blocks.
 */
#if defined(ARDUINO_USB_MODE) && ARDUINO_USB_MODE && !ARDUINO_USB_CDC_ON_BOOT
class DualConsole : public Stream {
 public:
  void begin(unsigned long baud) {
    Serial.begin(baud);
    USBSerial.begin();
  }
  int available() override { return Serial.available() + USBSerial.available(); }
  int read() override { return Serial.available() > 0 ? Serial.read() : USBSerial.read(); }
  int peek() override { return Serial.available() > 0 ? Serial.peek() : USBSerial.peek(); }
  void flush() override {
    Serial.flush();
    USBSerial.flush();
  }
  size_t write(uint8_t c) override { return write(&c, 1); }
  size_t write(const uint8_t *buffer, size_t size) override {
    Serial.write(buffer, size);
    USBSerial.write(buffer, size);
    return size;
  }
  using Print::write;
};
static DualConsole Console;
#else
#define Console Serial
#endif

#ifndef INGEST_HOST
#define INGEST_HOST "probeharbor.dev"
#endif
#ifndef ONE_WIRE_PIN
#define ONE_WIRE_PIN 4
#endif
#ifndef RESET_PIN
#define RESET_PIN 0
#endif
#ifndef I2C_SDA_PIN
#define I2C_SDA_PIN 21
#endif
#ifndef I2C_SCL_PIN
#define I2C_SCL_PIN 22
#endif
#ifndef LEAK_PIN
#define LEAK_PIN 27
#endif
#ifndef DOOR_PIN
#define DOOR_PIN 26
#endif
#ifndef BATTERY_PIN
#define BATTERY_PIN 35
#endif

static const unsigned long POST_INTERVAL_MS = 60UL * 1000UL;
static const unsigned long RESET_HOLD_MS = 5000UL;
static const unsigned long WIFI_JOIN_TIMEOUT_MS = 20000UL;
static const unsigned long FIRST_POST_RETRY_MS = 5000UL;
static const unsigned long PORTAL_TIMEOUT_S = 180UL;
static const unsigned long OFFLINE_RESTART_MS = 60UL * 1000UL;
static const uint8_t MAX_PROBES = 4;
static const size_t MAX_KEY_LEN = 128;
static const size_t MAX_EXTRAS_LEN = 40;
// With another sensor already reporting, only look for a DHT every Nth post:
// each DHT search blocks for several seconds.
static const uint8_t DHT_RETRY_EVERY = 10;

// Reading buffer: 240 readings is 4 hours at one a minute (~55 KB of RAM).
static const uint16_t BUFFER_SLOTS = 240;
static const size_t SLOT_BODY = 224;
// Readings per request; the server takes up to 100 and 64 KB.
static const uint16_t BATCH_MAX = 30;
// Requests per send, so a long backlog can't hold up the loop for minutes.
static const uint8_t BATCHES_PER_SEND = 4;
// Longest legitimate stall is one HTTPS request (10 s connect + 20 s TLS
// handshake + 15 s read, ~45 s) or a Wi-Fi join (20 s); long waits also feed
// it as they go.
static const uint32_t WATCHDOG_S = 60;

#ifndef OTA_MANIFEST_PATH
#define OTA_MANIFEST_PATH "/firmware/ota.json"
#endif
#ifndef OTA_FIRST_CHECK_MS
#define OTA_FIRST_CHECK_MS (60UL * 60UL * 1000UL)
#endif
#ifndef OTA_PROBATION_MS
#define OTA_PROBATION_MS (30UL * 60UL * 1000UL)
#endif
static const unsigned long OTA_CHECK_EVERY_MS = 24UL * 60UL * 60UL * 1000UL;
static const size_t OTA_MANIFEST_MAX = 4096;
// 2025-01-01: an earlier clock hasn't been set by NTP yet.
static const time_t CLOCK_VALID_AFTER = 1735689600;

OneWire oneWire(ONE_WIRE_PIN);
DallasTemperature probes(&oneWire);
DHTesp dht;
// Once a DHT answers, stop scanning for DS18B20s: the 1-Wire reset pulse on the
// shared pin can look like a DHT start signal and spoil the next read.
bool dhtFound = false;

/** A reading only counts if the sensor answered and the numbers are physically possible. */
static bool dhtReadingOk(const TempAndHumidity& th) {
  return dht.getStatus() == DHTesp::ERROR_NONE && !isnan(th.temperature) && !isnan(th.humidity) &&
         th.humidity >= 0.0f && th.humidity <= 100.0f && th.temperature > -40.0f && th.temperature < 80.0f;
}

/**
 * Find a DHT on the pin and take a first reading. The library's AUTO_DETECT
 * falls back to DHT11 for good after a single timeout, and a DHT22 decoded as a
 * DHT11 gives plausible-looking but wrong values (seen in the field: 50% RH
 * read as 25). So try DHT22 decoding first, a few times, and accept only
 * possible values; a real DHT11 read as a DHT22 reports humidity far above
 * 100% and falls through to DHT11.
 */
static bool detectDht(TempAndHumidity& out) {
  const DHTesp::DHT_MODEL_t models[] = {DHTesp::DHT22, DHTesp::DHT11};
  const int attempts[] = {3, 2};
  for (int m = 0; m < 2; m++) {
    dht.setup(ONE_WIRE_PIN, models[m]);
    for (int i = 0; i < attempts[m]; i++) {
      delay(dht.getMinimumSamplingPeriod());  // also lets the line settle after the 1-Wire scan
      out = dht.getTempAndHumidity();
      if (dhtReadingOk(out)) return true;
    }
  }
  return false;
}
uint8_t dhtRetryIn = 0;

// I2C air sensor (auto-detected).
enum AirKind { AIR_NONE, AIR_SHT31, AIR_BME280, AIR_AHT20 };
AirKind air = AIR_NONE;
Adafruit_SHT31 sht31;
Adafruit_BME280 bme;
Adafruit_AHTX0 aht;

static bool i2cPresent(uint8_t address) {
  Wire.beginTransmission(address);
  return Wire.endTransmission() == 0;
}

// I2C pins in use. Starts at the board defaults; boot detection may move it to a
// Feather's pins (see detectAirAtBoot).
int i2cSda = I2C_SDA_PIN;
int i2cScl = I2C_SCL_PIN;

static void detectAir() {
  if ((i2cPresent(0x44) && sht31.begin(0x44)) || (i2cPresent(0x45) && sht31.begin(0x45))) {
    air = AIR_SHT31;
  } else if ((i2cPresent(0x76) && bme.begin(0x76, &Wire)) || (i2cPresent(0x77) && bme.begin(0x77, &Wire))) {
    air = AIR_BME280;  // begin() rejects a BMP280 (no humidity) by chip id
  } else if (i2cPresent(0x38) && aht.begin(&Wire)) {
    air = AIR_AHT20;
  } else {
    air = AIR_NONE;
    return;
  }
  const char* names[] = {"", "SHT31", "BME280", "AHT20"};
  Console.printf("TT sensor: %s on I2C (SDA %d, SCL %d)\n", names[air], i2cSda, i2cScl);
}

#ifdef FEATHER_I2C_FALLBACK
// Adafruit Feathers put SDA/SCL (and the STEMMA QT port) on other pins:
//   HUZZAH32:         SDA 23, SCL 22
//   ESP32 Feather V2: SDA 22, SCL 20, port powered by GPIO 2
// Tried only at boot and only if nothing answered on the default pins, so a
// DevKit with no I2C sensor just sees a short blink on its GPIO 2 LED.
struct I2cPins {
  int sda, scl, powerPin;
};
static const I2cPins FEATHER_I2C[] = {{23, 22, -1}, {22, 20, 2}};

static void useI2c(int sda, int scl) {
  Wire.end();
  Wire.begin(sda, scl);
  i2cSda = sda;
  i2cScl = scl;
}
#endif

static void detectAirAtBoot() {
  detectAir();
#ifdef FEATHER_I2C_FALLBACK
  for (const I2cPins& pins : FEATHER_I2C) {
    if (air != AIR_NONE) return;
    if (pins.powerPin >= 0) {
      pinMode(pins.powerPin, OUTPUT);
      digitalWrite(pins.powerPin, HIGH);
      delay(10);  // let the sensor power up
    }
    useI2c(pins.sda, pins.scl);
    detectAir();
    if (air == AIR_NONE && pins.powerPin >= 0) {
      digitalWrite(pins.powerPin, LOW);
      pinMode(pins.powerPin, INPUT);
    }
  }
  // Nothing anywhere: back to the defaults so later retries use the documented pins.
  if (air == AIR_NONE) useI2c(I2C_SDA_PIN, I2C_SCL_PIN);
#endif
}

// Why the last I2C reading failed, for the serial log (set by readAir).
char airProblem[80] = "";

/**
 * One AHT20 measurement, read directly instead of through Adafruit_AHTX0's
 * getEvent(): that waits for the busy bit with no time limit, and a failed
 * status read looks busy (0xFF), so a sensor that stops answering froze the
 * whole probe. Here the wait is bounded, and each failure says what went wrong.
 */
static bool readAht20(float& tempC, float& humidity) {
  const uint8_t addr = 0x38;
  Wire.beginTransmission(addr);
  Wire.write(0xAC);  // trigger measurement
  Wire.write(0x33);
  Wire.write(0x00);
  if (Wire.endTransmission() != 0) {
    snprintf(airProblem, sizeof(airProblem), "no answer to the measure command");
    return false;
  }
  uint8_t d[6] = {0};
  unsigned long start = millis();
  delay(80);  // a measurement takes about 75 ms
  for (;;) {
    if (Wire.requestFrom(addr, (uint8_t)6) != 6) {
      snprintf(airProblem, sizeof(airProblem), "no data after the measure command");
      return false;
    }
    for (uint8_t i = 0; i < 6; i++) d[i] = Wire.read();
    if (!(d[0] & 0x80)) break;  // not busy: data is ready
    if (millis() - start > 500) {
      snprintf(airProblem, sizeof(airProblem), "stuck busy (status 0x%02X)", d[0]);
      return false;
    }
    delay(20);
  }
  uint32_t rawH = ((uint32_t)d[1] << 12) | ((uint32_t)d[2] << 4) | (d[3] >> 4);
  uint32_t rawT = ((uint32_t)(d[3] & 0x0F) << 16) | ((uint32_t)d[4] << 8) | d[5];
  humidity = rawH * 100.0f / 1048576.0f;
  tempC = rawT * 200.0f / 1048576.0f - 50.0f;
  if (!(d[0] & 0x08)) {
    snprintf(airProblem, sizeof(airProblem), "not calibrated (status 0x%02X, %.1f C, %.1f%%)", d[0], tempC, humidity);
  }
  return true;
}

/** Read the I2C sensor; NaN pressure when the sensor has none. False drops it so it is re-detected. */
static bool readAir(float& tempC, float& humidity, float& pressureHpa) {
  pressureHpa = NAN;
  airProblem[0] = '\0';
  if (air == AIR_SHT31) {
    tempC = sht31.readTemperature();
    humidity = sht31.readHumidity();
  } else if (air == AIR_BME280) {
    tempC = bme.readTemperature();
    humidity = bme.readHumidity();
    pressureHpa = bme.readPressure() / 100.0f;
  } else if (air == AIR_AHT20) {
    if (!readAht20(tempC, humidity)) return false;
  } else {
    return false;
  }
  bool ok = !isnan(tempC) && !isnan(humidity) && humidity >= 0.0f && humidity <= 100.0f &&
            tempC > -40.0f && tempC < 85.0f;
  if (!ok && airProblem[0] == '\0') {
    snprintf(airProblem, sizeof(airProblem), "impossible values (%.1f C, %.1f%%)", tempC, humidity);
  }
  return ok;
}

// Contacts and battery the user said are wired (see the header comment).
bool optLeak = false;
bool optDoor = false;
bool optBattery = false;
bool optNoUpdate = false;
String extras;

Preferences prefs;
WiFiManager wifiManager;
WiFiManagerParameter keyParam("key", "Device key (Dashboard → Devices)", "", MAX_KEY_LEN);
WiFiManagerParameter extrasParam("extras", "Also wired (any of: leak, door, battery)", "", MAX_EXTRAS_LEN);

String deviceKey;
String serialLine;
unsigned long lastPost = 0;
unsigned long resetHeldSince = 0;
unsigned long offlineSince = 0;
bool firstPostDone = false;
bool postNow = false;

// Door changes post right away (not just every POST_INTERVAL_MS), so the
// server sees each open/close at the time it happened and an opening shorter
// than a minute isn't missed. A new state must hold DOOR_DEBOUNCE_MS (reed
// switch bounce), and change-triggered posts are at least DOOR_MIN_GAP_MS
// apart so a flapping switch can't flood the server.
static const unsigned long DOOR_DEBOUNCE_MS = 200UL;
static const unsigned long DOOR_MIN_GAP_MS = 5000UL;
int doorPosted = -1;  // pin level in the last post; -1 until the first one
int doorCandidate = -1;
unsigned long doorCandidateSince = 0;

static void checkDoorChange(unsigned long now) {
  if (!optDoor) return;
  int level = digitalRead(DOOR_PIN);
  if (level != doorCandidate) {
    doorCandidate = level;
    doorCandidateSince = now;
    return;
  }
  if (doorPosted < 0 || level == doorPosted) return;
  if (now - doorCandidateSince < DOOR_DEBOUNCE_MS) return;
  if (lastPost != 0 && now - lastPost < DOOR_MIN_GAP_MS) return;  // retried on a later loop
  postNow = true;
}

/** Accept a bare key or a pasted ingest URL; keep only the key. */
String normalizeKey(String raw) {
  raw.trim();
  int marker = raw.indexOf("/api/ingest/");
  if (marker >= 0) raw = raw.substring(marker + 12);
  int cut = raw.indexOf('?');
  if (cut >= 0) raw = raw.substring(0, cut);
  while (raw.endsWith("/")) raw.remove(raw.length() - 1);
  raw.trim();
  if (raw.length() > MAX_KEY_LEN) return "";
  return raw;
}

void saveKey(const String &raw) {
  String key = normalizeKey(raw);
  if (key.isEmpty()) return;
  deviceKey = key;
  prefs.putString("key", deviceKey);
  Console.println("TT key saved");
}

/** "leak,door,battery,noupdate" (any order, any subset); anything else is ignored. */
void applyExtras(const String& raw) {
  String lower = raw;
  lower.toLowerCase();
  optLeak = lower.indexOf("leak") >= 0;
  optDoor = lower.indexOf("door") >= 0;
  optBattery = lower.indexOf("batt") >= 0;
  optNoUpdate = lower.indexOf("noupdate") >= 0;
  extras = "";
  if (optLeak) extras += "leak,";
  if (optDoor) extras += "door,";
  if (optBattery) extras += "battery,";
  if (optNoUpdate) extras += "noupdate,";
  if (extras.endsWith(",")) extras.remove(extras.length() - 1);
  if (optLeak) pinMode(LEAK_PIN, INPUT_PULLUP);
  if (optDoor) pinMode(DOOR_PIN, INPUT_PULLUP);
}

void saveExtras(const String& raw) {
  applyExtras(raw);
  prefs.putString("extras", extras);
  Console.println("TT extras: " + (extras.isEmpty() ? String("none") : extras));
}

void onPortalParamsSaved() {
  saveKey(keyParam.getValue());
  saveExtras(extrasParam.getValue());
}

/** TTCFG<TAB>ssid<TAB>password<TAB>key, sent by the flasher page over USB. */
void handleConfigLine(const String &line) {
  int a = line.indexOf('\t');
  int b = a < 0 ? -1 : line.indexOf('\t', a + 1);
  int c = b < 0 ? -1 : line.indexOf('\t', b + 1);
  if (a < 0 || b < 0 || c < 0) {
    Console.println("TT config error: expected TTCFG<TAB>ssid<TAB>password<TAB>key");
    return;
  }
  String ssid = line.substring(a + 1, b);
  String pass = line.substring(b + 1, c);
  String key = line.substring(c + 1);
  if (ssid.isEmpty() || normalizeKey(key).isEmpty()) {
    Console.println("TT config error: network name and device key are required");
    return;
  }
  saveKey(key);

  Console.println("TT wifi joining");
  wifiManager.stopConfigPortal();
  WiFi.mode(WIFI_STA);
  WiFi.persistent(true);
  WiFi.begin(ssid.c_str(), pass.c_str());
  unsigned long start = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - start < WIFI_JOIN_TIMEOUT_MS) {
    delay(250);
    esp_task_wdt_reset();
  }
  if (WiFi.status() == WL_CONNECTED) {
    Console.println("TT wifi ok");
    postNow = true;
  } else {
    Console.println("TT wifi failed: check the network name and password (2.4 GHz only)");
  }
}

bool otaCheckNow = false;  // set by the TTTEST ota hook
String otaManifestPath = OTA_MANIFEST_PATH;  // test builds can change it (TTTEST ota)

#ifdef PROBE_TEST_HOOKS
/*
 * Test builds only (-DPROBE_TEST_HOOKS; never in /flash images): fake the
 * failures HARDWARE-TESTS.md test 10 needs on a network nobody can turn off.
 *   TTTEST<TAB>fail<TAB><seconds>  posts fail (-1) without sending
 *   TTTEST<TAB>drop                 next post is sent, its reply thrown away
 *   TTTEST<TAB>wifioff              drop Wi-Fi (the offline restart follows)
 *   TTTEST<TAB>hang                 stop the loop (the watchdog restarts the chip)
 *   TTTEST<TAB>ota<TAB><path>        read the OTA manifest at <path> now
 */
unsigned long testFailUntil = 0;
bool testDropReply = false;

static void handleTestLine(const String& line) {
  if (line.startsWith("TTTEST\tfail\t")) {
    unsigned long secs = line.substring(12).toInt();
    testFailUntil = millis() + secs * 1000UL;
    Console.printf("TT test: posts fail for %lu s\n", secs);
  } else if (line == "TTTEST\tdrop") {
    testDropReply = true;
    Console.println("TT test: next reply will be dropped");
  } else if (line == "TTTEST\twifioff") {
    Console.println("TT test: Wi-Fi off");
    WiFi.disconnect();
  } else if (line.startsWith("TTTEST\tota\t")) {
    otaManifestPath = line.substring(11);
    Console.println("TT test: OTA check of " + otaManifestPath);
    otaCheckNow = true;
  } else if (line == "TTTEST\thang") {
    Console.println("TT test: hanging the loop");
    for (;;) delay(1000);  // yields, so only the loop task's watchdog can end this
  }
}
#endif

void readSerial() {
  while (Console.available() > 0) {
    char ch = (char)Console.read();
    if (ch == '\r') continue;
    if (ch == '\n') {
      // TTEXTRAS<TAB>leak,door,battery comes just before TTCFG from the flasher page.
      if (serialLine.startsWith("TTEXTRAS\t")) saveExtras(serialLine.substring(9));
      else if (serialLine.startsWith("TTCFG\t")) handleConfigLine(serialLine);
      else if (serialLine == "TTSTATUS") postNow = true;
#ifdef PROBE_TEST_HOOKS
      else if (serialLine.startsWith("TTTEST\t")) handleTestLine(serialLine);
#endif
      serialLine = "";
    } else if (serialLine.length() < 400) {
      serialLine += ch;
    }
  }
}

void checkResetButton() {
  if (digitalRead(RESET_PIN) == LOW) {
    if (resetHeldSince == 0) resetHeldSince = millis();
    if (millis() - resetHeldSince >= RESET_HOLD_MS) {
      Console.println("TT reset: clearing Wi-Fi and device key");
      prefs.clear();
      wifiManager.resetSettings();
      delay(500);
      ESP.restart();
    }
  } else {
    resetHeldSince = 0;
  }
}

/**
 * Readings not yet confirmed by the server. In .noinit RAM: not cleared at
 * boot, so it survives ESP.restart() (the offline restart below) but not a
 * power cut. Checked at boot; anything that doesn't look like ours is cleared.
 */
struct BufferedReading {
  uint32_t t;               // Unix seconds
  char body[SLOT_BODY];     // "\"temp1\":41.00,..." fields, each ending in ','
};
struct ReadingBuffer {
  uint32_t magic;
  uint16_t head;
  uint16_t count;
  BufferedReading slots[BUFFER_SLOTS];
};
static const uint32_t BUFFER_MAGIC = 0x50480130u ^ (uint32_t)sizeof(ReadingBuffer);
__NOINIT_ATTR static ReadingBuffer rb;
// A server that refused a batch with 400 gets plain readings until restart.
bool plainOnly = false;
bool clockAnnounced = false;

static void bufferClear() {
  rb.magic = BUFFER_MAGIC;
  rb.head = 0;
  rb.count = 0;
}

static void bufferCheckAtBoot() {
  bool ok = rb.magic == BUFFER_MAGIC && rb.head < BUFFER_SLOTS && rb.count <= BUFFER_SLOTS;
  for (uint16_t i = 0; ok && i < rb.count; i++) {
    const BufferedReading& r = rb.slots[(rb.head + i) % BUFFER_SLOTS];
    ok = r.t > (uint32_t)CLOCK_VALID_AFTER && memchr(r.body, 0, SLOT_BODY) != nullptr && r.body[0] == '"';
  }
  if (!ok) {
    bufferClear();
  } else if (rb.count > 0) {
    Console.printf("TT buffer: %u reading(s) kept from before the restart\n", (unsigned)rb.count);
  }
}

static bool clockValid() { return time(nullptr) > CLOCK_VALID_AFTER; }

static void bufferPush(uint32_t t, const String& fields) {
  if (fields.length() >= SLOT_BODY) return;  // can't happen with today's sensors
  if (rb.count == BUFFER_SLOTS) {
    rb.head = (rb.head + 1) % BUFFER_SLOTS;  // full: the oldest reading goes
    rb.count--;
  }
  BufferedReading& slot = rb.slots[(rb.head + rb.count) % BUFFER_SLOTS];
  slot.t = t;
  memcpy(slot.body, fields.c_str(), fields.length() + 1);
  rb.count++;
}

static void bufferDrop(uint16_t n) {
  if (n > rb.count) n = rb.count;
  rb.head = (rb.head + n) % BUFFER_SLOTS;
  rb.count -= n;
}

// OTA probation: set at boot when this image was just installed over the
// air and hasn't been confirmed by a 2xx post yet.
bool otaPending = false;
unsigned long lastOtaCheck = 0;
bool otaCheckedOnce = false;

/** The first 2xx after an OTA update: keep this image. */
static void otaConfirm() {
  if (!otaPending) return;
  otaPending = false;
  esp_ota_mark_app_valid_cancel_rollback();
  Console.println("TT ota: " FIRMWARE_VERSION " confirmed");
}

/**
 * Tell the Arduino core not to confirm a new image at boot: we do, on the
 * first 2xx. The core declares this weak in a C file (esp32-hal-misc.c), so
 * the override needs C linkage; without extern "C" it silently never runs.
 */
extern "C" bool verifyRollbackLater() { return true; }

static String deviceFields(int batteryPct) {
  // The dashboard compares fw with /flash's current version to offer updates.
  String out = "\"fw\":\"" FIRMWARE_VERSION "\",\"rssi\":" + String(WiFi.RSSI());
  if (batteryPct >= 0) out += ",\"battery_pct\":" + String(batteryPct);
  return out;
}

/** POST to ingest; returns the HTTP status, or a negative HTTPClient error. */
static int postBody(const String& body, String* response = nullptr) {
#ifdef PROBE_TEST_HOOKS
  if ((long)(testFailUntil - millis()) > 0) return -1;
#endif
  // Same trust model as the sample sketches: TLS without certificate pinning.
  WiFiClientSecure client;
  client.setInsecure();
  client.setHandshakeTimeout(20);  // seconds; the default 120 outlasts the watchdog
  HTTPClient http;
  http.setConnectTimeout(10000);
  http.setTimeout(15000);
  // The key goes in a header, not the path, so it stays out of request URLs
  // (proxy and server logs). `_` is the server's header-only placeholder;
  // it has accepted X-Ingest-Key since 2026-09.
  if (!http.begin(client, String("https://") + INGEST_HOST + "/api/ingest/_")) {
    Console.println("TT post failed: could not open connection");
    return -1000;
  }
  http.addHeader("Content-Type", "application/json");
  http.addHeader("X-Ingest-Key", deviceKey);
  int code = http.POST(body);
  if (response != nullptr && code > 0) *response = http.getString();
  http.end();
#ifdef PROBE_TEST_HOOKS
  if (response != nullptr && code > 0) Console.println("TT test: server said " + *response);
  if (testDropReply) {
    testDropReply = false;
    Console.printf("TT test: reply %d dropped\n", code);
    return -11;  // HTTPC_ERROR_READ_TIMEOUT: as if the reply never came
  }
#endif
  return code;
}

static void reportKeyProblem(int code) {
  if (code == 401 || code == 403 || code == 404) {
    Console.println("TT key rejected: copy the device key again from Dashboard → Devices");
  }
}

/** The pre-1.3.0 request: one reading, stamped by the server. */
static void postPlain(const String& fields, int batteryPct, uint8_t sent) {
  int code = postBody("{" + fields + deviceFields(batteryPct) + "}");
  if (code == -1000) return;
  Console.printf("TT post %d probes=%u\n", code, (unsigned)sent);
  if (code >= 200 && code < 300) otaConfirm();
  reportKeyProblem(code);
}

/**
 * Send buffered readings, oldest first, until the buffer is empty, a request
 * fails, or BATCHES_PER_SEND requests have gone. A reading leaves the buffer
 * only when the server has answered 2xx for it (or rejected it outright), so
 * a lost reply means a resend, which the server skips as a duplicate.
 * Returns false when the server refused batches (fall back to plain posts).
 */
static bool sendBuffer(int batteryPct, uint8_t sent) {
  for (uint8_t round = 0; round < BATCHES_PER_SEND && rb.count > 0; round++) {
    esp_task_wdt_reset();  // each request may take up to ~30 s
    uint16_t n = rb.count < BATCH_MAX ? rb.count : BATCH_MAX;
    String body = "{" + deviceFields(batteryPct) + ",\"readings\":[";
    body.reserve(n * (SLOT_BODY + 32) + 96);
    for (uint16_t i = 0; i < n; i++) {
      const BufferedReading& r = rb.slots[(rb.head + i) % BUFFER_SLOTS];
      if (i > 0) body += ",";
      body += "{";
      body += r.body;
      body += "\"recorded_at\":" + String(r.t) + "}";
    }
    body += "]}";

    String response;
    int code = postBody(body, &response);
    if (code == -1000) return true;
    if (code >= 200 && code < 300) {
      otaConfirm();
      bufferDrop(n);
      Console.printf("TT post %d probes=%u buffered=%u\n", code, (unsigned)sent, (unsigned)rb.count);
      continue;
    }
    if (code == 400 && response.indexOf("\"rejected\":") >= 0) {
      // Values the server says can't be real: resending won't help.
      bufferDrop(n);
      Console.printf("TT post %d probes=%u buffered=%u\n", code, (unsigned)sent, (unsigned)rb.count);
      continue;
    }
    if (code == 400) {
      // A server from before 2026-11 doesn't read batches, and a clock the
      // server disagrees with is rejected too. Either way: plain readings.
      // (Not printed as "TT post 400": the flasher would call that a failure.)
      Console.println("TT server didn't take timed readings: sending plain readings until restart");
      bufferClear();
      return false;
    }
    if (code == 413) {
      bufferDrop(n);  // can't succeed however often it's sent
    }
    // Key problems, rate limits, server errors, no connection: keep the
    // readings and try again on the next send.
    Console.printf("TT post %d probes=%u buffered=%u\n", code, (unsigned)sent, (unsigned)rb.count);
    reportKeyProblem(code);
    return true;
  }
  return true;
}

/** A field of a flat JSON object: a string's contents or a number's text; "" if absent. */
static String jsonField(const String& json, const char* key) {
  String needle = String("\"") + key + "\"";
  int at = json.indexOf(needle);
  if (at < 0) return "";
  at = json.indexOf(':', at + needle.length());
  if (at < 0) return "";
  at++;
  while (at < (int)json.length() && isspace((unsigned char)json[at])) at++;
  if (at < (int)json.length() && json[at] == '"') {
    int end = json.indexOf('"', at + 1);
    return end < 0 ? "" : json.substring(at + 1, end);
  }
  int end = at;
  while (end < (int)json.length() && json[end] != ',' && json[end] != '}' && !isspace((unsigned char)json[end])) end++;
  return json.substring(at, end);
}

/** {"esp32s3": { ... }}: the object for one key (no nested objects inside). */
static String jsonObject(const String& json, const char* key) {
  String needle = String("\"") + key + "\"";
  int at = json.indexOf(needle);
  if (at < 0) return "";
  int open = json.indexOf('{', at + needle.length());
  int close = open < 0 ? -1 : json.indexOf('}', open);
  return close < 0 ? "" : json.substring(open, close + 1);
}

/** "1.4.0" vs "1.3.10": numeric per part, "-suffix" ignored (same as otaManifest.mjs). */
static int compareVersions(const char* a, const char* b) {
  for (int i = 0; i < 3; i++) {
    long x = strtol(a, (char**)&a, 10), y = strtol(b, (char**)&b, 10);
    if (x != y) return x < y ? -1 : 1;
    if (*a == '.') a++;
    if (*b == '.') b++;
  }
  return 0;
}

/** 0–99 from the device key, so a rollout takes the same probes each day. */
static uint8_t rolloutBucket() {
  uint32_t h = 2166136261u;  // FNV-1a
  for (size_t i = 0; i < deviceKey.length(); i++) h = (h ^ (uint8_t)deviceKey[i]) * 16777619u;
  return h % 100;
}

static void sha256Hex(const uint8_t digest[32], char out[65]) {
  for (int i = 0; i < 32; i++) snprintf(out + i * 2, 3, "%02x", digest[i]);
}

/** Does OTA_PUBLIC_KEY_PEM sign this message? */
static bool otaSignatureOk(const String& message, const String& sigB64) {
  uint8_t sig[80];
  size_t sigLen = 0;
  if (mbedtls_base64_decode(sig, sizeof(sig), &sigLen, (const uint8_t*)sigB64.c_str(), sigB64.length()) != 0) return false;
  uint8_t hash[32];
  mbedtls_sha256_ret((const uint8_t*)message.c_str(), message.length(), hash, 0);
  mbedtls_pk_context pk;
  mbedtls_pk_init(&pk);
  bool ok = mbedtls_pk_parse_public_key(&pk, (const uint8_t*)OTA_PUBLIC_KEY_PEM, sizeof(OTA_PUBLIC_KEY_PEM)) == 0 &&
            mbedtls_pk_verify(&pk, MBEDTLS_MD_SHA256, hash, sizeof(hash), sig, sigLen) == 0;
  mbedtls_pk_free(&pk);
  return ok;
}

/**
 * Download `size` bytes from `url`, skipping `offset`, into the inactive app
 * slot; keep it only if its SHA-256 is `sha256`. Returns true when it is
 * installed as the next boot image.
 */
static bool otaInstall(const String& url, size_t offset, size_t size, const String& sha256) {
  const esp_partition_t* next = esp_ota_get_next_update_partition(nullptr);
  if (next == nullptr || size > next->size) {
    Console.println("TT ota: image too big for this board, ignored");
    return false;
  }
  WiFiClientSecure client;
  client.setInsecure();  // integrity comes from the signed hash, not the connection
  client.setHandshakeTimeout(20);
  HTTPClient http;
  http.setConnectTimeout(10000);
  http.setTimeout(15000);
  if (!http.begin(client, String("https://") + INGEST_HOST + url)) return false;
  int code = http.GET();
  if (code != 200) {
    Console.printf("TT ota: download failed (%d)\n", code);
    http.end();
    return false;
  }
  WiFiClient* stream = http.getStreamPtr();
  if (!Update.begin(size)) {
    Console.printf("TT ota: can't start (%s)\n", Update.errorString());
    http.end();
    return false;
  }
  mbedtls_sha256_context ctx;
  mbedtls_sha256_init(&ctx);
  mbedtls_sha256_starts_ret(&ctx, 0);
  static uint8_t buf[1024];
  size_t skipped = 0, written = 0;
  unsigned long lastData = millis();
  bool ok = true;
  while (written < size) {
    esp_task_wdt_reset();
    int avail = stream->available();
    if (avail <= 0) {
      if (!http.connected() || millis() - lastData > 20000UL) {
        ok = false;
        break;
      }
      delay(5);
      continue;
    }
    size_t want = sizeof(buf);
    if (skipped < offset) {
      if (want > offset - skipped) want = offset - skipped;
    } else if (want > size - written) {
      want = size - written;
    }
    int got = stream->readBytes(buf, want);
    if (got <= 0) continue;
    lastData = millis();
    if (skipped < offset) {
      skipped += got;
      continue;
    }
    mbedtls_sha256_update_ret(&ctx, buf, got);
    if (Update.write(buf, got) != (size_t)got) {
      ok = false;
      break;
    }
    written += got;
  }
  http.end();
  uint8_t digest[32];
  mbedtls_sha256_finish_ret(&ctx, digest);
  mbedtls_sha256_free(&ctx);
  char hex[65];
  sha256Hex(digest, hex);
  if (!ok || written != size || !sha256.equalsIgnoreCase(hex)) {
    Update.abort();
    Console.println(ok && written == size ? "TT ota: download didn't match the signed hash, ignored"
                                          : "TT ota: download interrupted, will retry tomorrow");
    return false;
  }
  if (!Update.end()) {
    Console.printf("TT ota: image rejected (%s)\n", Update.errorString());
    return false;
  }
  return true;
}

/** Fetch the manifest; install and restart if there's a signed, newer image for this probe. */
static void otaCheck() {
  WiFiClientSecure client;
  client.setInsecure();  // the manifest is signed; see otaSignatureOk
  client.setHandshakeTimeout(20);
  HTTPClient http;
  http.setConnectTimeout(10000);
  http.setTimeout(15000);
  if (!http.begin(client, String("https://") + INGEST_HOST + otaManifestPath)) return;
  int code = http.GET();
  int length = http.getSize();
  String manifest = (code == 200 && length > 0 && length <= (int)OTA_MANIFEST_MAX) ? http.getString() : "";
  http.end();
  if (code == 404) return;  // nothing published yet
  if (manifest.isEmpty()) {
    Console.printf("TT ota: no manifest (%d)\n", code);
    return;
  }

  String version = jsonField(manifest, "version");
  if (version.isEmpty() || compareVersions(version.c_str(), FIRMWARE_VERSION) <= 0) return;  // up to date
  long rollout = jsonField(manifest, "rollout_pct").toInt();
  if (rolloutBucket() >= rollout) {
    Console.printf("TT ota: %s available, not yet for this probe (rollout %ld%%)\n", version.c_str(), rollout);
    return;
  }
  String build = jsonObject(manifest, CONFIG_IDF_TARGET);
  String url = jsonField(build, "url");
  size_t offset = jsonField(build, "offset").toInt();
  size_t size = jsonField(build, "size").toInt();
  String sha256 = jsonField(build, "sha256");
  String sig = jsonField(build, "sig");
  if (url.isEmpty() || !url.startsWith("/") || size == 0 || sha256.length() != 64) {
    Console.printf("TT ota: %s has no build for " CONFIG_IDF_TARGET "\n", version.c_str());
    return;
  }
  String message = "probeharbor-ota-v1\n" CONFIG_IDF_TARGET "\n" + version + "\n" + String((unsigned long)size) + "\n" + sha256 + "\n";
  if (!otaSignatureOk(message, sig)) {
    Console.printf("TT ota: %s is not signed by the ProbeHarbor key, ignored\n", version.c_str());
    return;
  }
  Console.printf("TT ota: downloading %s\n", version.c_str());
  if (!otaInstall(url, offset, size, sha256)) return;
  Console.printf("TT ota: installed %s, restarting\n", version.c_str());
  delay(500);
  ESP.restart();
}

/** In loop(): run otaCheck when due, and end a failed probation. */
static void otaTick(unsigned long now) {
  if (otaPending && now > OTA_PROBATION_MS) {
    Console.printf("TT ota: no successful post in %lu minutes, going back to the previous version\n",
                   (unsigned long)(OTA_PROBATION_MS / 60000UL));
    delay(200);
    esp_ota_mark_app_invalid_rollback_and_reboot();  // restarts
  }
  if (optNoUpdate || otaPending || WiFi.status() != WL_CONNECTED || deviceKey.isEmpty()) return;
  unsigned long due = otaCheckedOnce ? OTA_CHECK_EVERY_MS : OTA_FIRST_CHECK_MS;
  if (!otaCheckNow && now - lastOtaCheck < due) return;
  otaCheckNow = false;
  lastOtaCheck = now;
  otaCheckedOnce = true;
  otaCheck();
}

/**
 * Read every sensor into JSON fields ("\"temp1\":41.00," ...). Returns how
 * many sensors were read; the battery level (or -1) goes in batteryPct.
 */
uint8_t readSensors(String& body, int& batteryPct) {
  // Search the bus every time (a few ms) so a probe wired in, or added, after
  // boot is picked up without a reset -- unless a DHT is already answering.
  uint8_t found = 0;
  if (!dhtFound) {
    probes.begin();
    probes.requestTemperatures();
    found = probes.getDeviceCount();
    if (found > MAX_PROBES) found = MAX_PROBES;
  }

  body = "";
  batteryPct = -1;
  uint8_t sent = 0;
  for (uint8_t i = 0; i < found; i++) {
    float c = probes.getTempCByIndex(i);
    if (c == DEVICE_DISCONNECTED_C) continue;
    char field[32];
    snprintf(field, sizeof(field), "\"temp%u\":%.2f,", (unsigned)(i + 1), c * 9.0f / 5.0f + 32.0f);
    body += field;
    sent++;
  }
  // I2C air sensor first: it decides whether a DHT search is worth its delay.
  if (air == AIR_NONE) detectAir();
  float airC = NAN, airRh = NAN, airHpa = NAN;
  bool airOk = air != AIR_NONE && readAir(airC, airRh, airHpa);
  if (air != AIR_NONE && !airOk) {
    delay(100);  // one retry: a single bad read shouldn't drop a working sensor
    airOk = readAir(airC, airRh, airHpa);
  }
  const char* airNames[] = {"", "SHT31", "BME280", "AHT20"};
  const char* failedAir = (air != AIR_NONE && !airOk) ? airNames[air] : nullptr;
  bool airFailed = failedAir != nullptr;
  if (airFailed) {
    Console.printf("TT sensor problem: %s found but not reading: %s. Check its 3.3V, GND, SDA %d and SCL %d wires\n",
                   failedAir, airProblem[0] ? airProblem : "no reading", i2cSda, i2cScl);
    air = AIR_NONE;  // re-detect next time
  } else if (airOk && airProblem[0]) {
    Console.printf("TT sensor problem: reading sent, but %s\n", airProblem);
  }
  bool otherSensors = airOk || optLeak || optDoor;

  if (sent == 0) {
    // No DS18B20 on the pin: try a DHT22/DHT11 on the same data line.
    TempAndHumidity th;
    bool ok = false;
    if (dhtFound) {
      th = dht.getTempAndHumidity();
      ok = dhtReadingOk(th);
    } else if (!otherSensors || dhtRetryIn == 0) {
      ok = detectDht(th);
      dhtRetryIn = DHT_RETRY_EVERY;
    } else {
      dhtRetryIn--;
    }
    if (ok) {
      char field[64];
      snprintf(field, sizeof(field), "\"temp1\":%.2f,\"humidity1\":%.1f,",
               th.temperature * 9.0f / 5.0f + 32.0f, th.humidity);
      body += field;
      sent = 1;
      if (!dhtFound) {
        Console.printf("TT sensor: %s on GPIO %d\n", dht.getModel() == DHTesp::DHT11 ? "DHT11" : "DHT22", ONE_WIRE_PIN);
      }
      dhtFound = true;
    } else {
      // Scan for DS18B20s again next time, in case the sensor was swapped.
      dhtFound = false;
    }
  }
  if (airOk) {
    char field[96];
    snprintf(field, sizeof(field), "\"temp_air\":%.2f,\"humidity_air\":%.1f,", airC * 9.0f / 5.0f + 32.0f, airRh);
    body += field;
    if (!isnan(airHpa)) {
      snprintf(field, sizeof(field), "\"pressure_air\":%.1f,", airHpa);
      body += field;
    }
    sent++;
  }
  if (optLeak) {
    body += String("\"leak1\":") + (digitalRead(LEAK_PIN) == LOW ? "true" : "false") + ",";
    sent++;
  }
  if (optDoor) {
    // Reed switch closes (pulls low) when the magnet is next to it: door shut.
    int doorLevel = digitalRead(DOOR_PIN);
    doorPosted = doorLevel;
    body += String("\"door1\":") + (doorLevel == HIGH ? "true" : "false") + ",";
    sent++;
  }
  if (optBattery) {
    // 1:1 divider, so the pin sees half the cell. Single-cell Li-ion: 3.3 V empty, 4.2 V full.
    int cellMv = (int)analogReadMilliVolts(BATTERY_PIN) * 2;
    batteryPct = constrain((cellMv - 3300) * 100 / (4200 - 3300), 0, 100);
  }

  if (sent == 0) {
    if (airFailed) {
      Console.printf("TT nothing sent: %s found but not reading\n", failedAir);
    } else {
      Console.println("TT no probe: check the wiring (DS18B20 or DHT22 data on GPIO " + String(ONE_WIRE_PIN) + ", 4.7k pull-up to 3.3V)");
    }
  }
  return sent;
}

/** Take a reading; send it, and anything buffered, when Wi-Fi is up. */
void sampleAndSend() {
  String fields;
  int batteryPct = -1;
  uint8_t sent = readSensors(fields, batteryPct);
  bool timed = !plainOnly && clockValid();
  if (sent > 0 && timed) bufferPush((uint32_t)time(nullptr), fields);

  if (WiFi.status() != WL_CONNECTED) {
    if (sent > 0) {
      if (timed) {
        Console.printf("TT offline: reading kept (%u buffered)\n", (unsigned)rb.count);
      } else {
        Console.println("TT waiting for wifi");
      }
    }
    return;
  }
  if (!plainOnly && rb.count > 0 && !sendBuffer(batteryPct, sent)) {
    plainOnly = true;
    timed = false;  // this reading went with the cleared buffer: send it plain
  }
  if (sent > 0 && !timed) postPlain(fields, batteryPct, sent);
}

void setup() {
  Console.begin(115200);
  pinMode(RESET_PIN, INPUT_PULLUP);
  probes.begin();
  prefs.begin("probeharbor", false);
  deviceKey = prefs.getString("key", "");
  applyExtras(prefs.getString("extras", ""));
  extrasParam.setValue(extras.c_str(), MAX_EXTRAS_LEN);
  Wire.begin(I2C_SDA_PIN, I2C_SCL_PIN);
  detectAirAtBoot();
  bufferCheckAtBoot();

  Console.println();
  Console.println("TT firmware " FIRMWARE_VERSION);
  esp_reset_reason_t why = esp_reset_reason();
  if (why == ESP_RST_TASK_WDT || why == ESP_RST_INT_WDT || why == ESP_RST_WDT) {
    Console.println("TT restarted by watchdog: something stopped responding");
  } else if (why == ESP_RST_PANIC) {
    Console.println("TT restarted after a crash");
  }
  esp_ota_img_states_t otaState;
  if (esp_ota_get_state_partition(esp_ota_get_running_partition(), &otaState) == ESP_OK &&
      otaState == ESP_OTA_IMG_PENDING_VERIFY) {
    otaPending = true;
    Console.println("TT ota: running " FIRMWARE_VERSION " on probation until it posts");
  }

  wifiManager.addParameter(&keyParam);
  wifiManager.addParameter(&extrasParam);
  wifiManager.setSaveParamsCallback(onPortalParamsSaved);
  wifiManager.setConfigPortalBlocking(false);
  wifiManager.setConfigPortalTimeout(PORTAL_TIMEOUT_S);
  wifiManager.setConnectTimeout(30);
  wifiManager.setDebugOutput(false);
  if (wifiManager.autoConnect("ProbeHarbor-Setup")) {
    Console.println("TT wifi ok");
  } else {
    Console.println("TT setup: send settings over USB, or join the ProbeHarbor-Setup Wi-Fi network");
  }
  // After autoConnect, so the network stack is up. SNTP keeps retrying and
  // re-syncs on its own; readings are only stamped once the clock is set.
  configTime(0, 0, "pool.ntp.org", "time.cloudflare.com");

  // From here on, a loop() that stops coming round restarts the chip. Set up
  // after autoConnect, which may legitimately block for its own timeout.
  esp_task_wdt_init(WATCHDOG_S, true);
  enableLoopWDT();
}

void loop() {
  wifiManager.process();
  readSerial();
  checkResetButton();

  unsigned long now = millis();
  checkDoorChange(now);
  // Checked every loop, not only when a reading is due, so the line comes
  // when NTP sets the clock.
  if (!clockAnnounced && clockValid()) {
    clockAnnounced = true;
    Console.println("TT clock set");
  }
  otaTick(now);

  // A router that boots slower than this board (after a power cut) must not
  // leave the probe parked in the setup portal: once the portal has timed out
  // and Wi-Fi is still down, restart and try the saved network again.
  if (WiFi.status() == WL_CONNECTED || wifiManager.getConfigPortalActive()) {
    offlineSince = 0;
  } else if (offlineSince == 0) {
    offlineSince = now == 0 ? 1 : now;
  } else if (now - offlineSince >= OFFLINE_RESTART_MS) {
    Console.println("TT wifi lost: restarting to retry");
    delay(200);
    ESP.restart();
  }

  if (!postNow) {
    unsigned long interval = firstPostDone ? POST_INTERVAL_MS : FIRST_POST_RETRY_MS;
    if (lastPost != 0 && now - lastPost < interval) return;
  }
  postNow = false;
  lastPost = now == 0 ? 1 : now;

  if (deviceKey.isEmpty()) {
    Console.println("TT waiting for device key");
    return;
  }
  if (WiFi.status() != WL_CONNECTED && !firstPostDone && !clockValid()) {
    // Nothing to keep a reading with yet: don't spend the fast first-post
    // retries measuring.
    Console.println("TT waiting for wifi");
    return;
  }
  sampleAndSend();
  firstPostDone = true;
}
