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

#ifndef FIRMWARE_VERSION
#define FIRMWARE_VERSION "1.2.7"
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

/** "leak,door,battery" (any order, any subset); anything else is ignored. */
void applyExtras(const String& raw) {
  String lower = raw;
  lower.toLowerCase();
  optLeak = lower.indexOf("leak") >= 0;
  optDoor = lower.indexOf("door") >= 0;
  optBattery = lower.indexOf("batt") >= 0;
  extras = "";
  if (optLeak) extras += "leak,";
  if (optDoor) extras += "door,";
  if (optBattery) extras += "battery,";
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
  }
  if (WiFi.status() == WL_CONNECTED) {
    Console.println("TT wifi ok");
    postNow = true;
  } else {
    Console.println("TT wifi failed: check the network name and password (2.4 GHz only)");
  }
}

void readSerial() {
  while (Console.available() > 0) {
    char ch = (char)Console.read();
    if (ch == '\r') continue;
    if (ch == '\n') {
      // TTEXTRAS<TAB>leak,door,battery comes just before TTCFG from the flasher page.
      if (serialLine.startsWith("TTEXTRAS\t")) saveExtras(serialLine.substring(9));
      else if (serialLine.startsWith("TTCFG\t")) handleConfigLine(serialLine);
      else if (serialLine == "TTSTATUS") postNow = true;
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

void postReadings() {
  // Search the bus every time (a few ms) so a probe wired in, or added, after
  // boot is picked up without a reset -- unless a DHT is already answering.
  uint8_t found = 0;
  if (!dhtFound) {
    probes.begin();
    probes.requestTemperatures();
    found = probes.getDeviceCount();
    if (found > MAX_PROBES) found = MAX_PROBES;
  }

  String body = "{";
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
    int pct = constrain((cellMv - 3300) * 100 / (4200 - 3300), 0, 100);
    body += "\"battery_pct\":" + String(pct) + ",";
  }

  if (sent == 0) {
    if (airFailed) {
      Console.printf("TT nothing sent: %s found but not reading\n", failedAir);
    } else {
      Console.println("TT no probe: check the wiring (DS18B20 or DHT22 data on GPIO " + String(ONE_WIRE_PIN) + ", 4.7k pull-up to 3.3V)");
    }
    return;
  }
  // The dashboard compares this with /flash's current version to offer updates.
  body += "\"fw\":\"" FIRMWARE_VERSION "\",\"rssi\":" + String(WiFi.RSSI()) + "}";

  // Same trust model as the sample sketches: TLS without certificate pinning.
  WiFiClientSecure client;
  client.setInsecure();
  HTTPClient http;
  http.setTimeout(15000);
  // The key goes in a header, not the path, so it stays out of request URLs
  // (proxy and server logs). `_` is the server's header-only placeholder;
  // it has accepted X-Ingest-Key since 2026-09.
  if (!http.begin(client, String("https://") + INGEST_HOST + "/api/ingest/_")) {
    Console.println("TT post failed: could not open connection");
    return;
  }
  http.addHeader("Content-Type", "application/json");
  http.addHeader("X-Ingest-Key", deviceKey);
  int code = http.POST(body);
  http.end();

  Console.printf("TT post %d probes=%u\n", code, (unsigned)sent);
  if (code == 401 || code == 403 || code == 404) {
    Console.println("TT key rejected: copy the device key again from Dashboard → Devices");
  }
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

  Console.println();
  Console.println("TT firmware " FIRMWARE_VERSION);

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
}

void loop() {
  wifiManager.process();
  readSerial();
  checkResetButton();

  unsigned long now = millis();
  checkDoorChange(now);

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

  if (WiFi.status() != WL_CONNECTED) {
    Console.println("TT waiting for wifi");
    return;
  }
  if (deviceKey.isEmpty()) {
    Console.println("TT waiting for device key");
    return;
  }
  postReadings();
  firstPostDone = true;
}
