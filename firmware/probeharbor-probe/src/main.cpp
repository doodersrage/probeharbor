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
#define FIRMWARE_VERSION "1.2.1"
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
  Serial.printf("TT sensor: %s on I2C (SDA %d, SCL %d)\n", names[air], I2C_SDA_PIN, I2C_SCL_PIN);
}

/** Read the I2C sensor; NaN pressure when the sensor has none. False drops it so it is re-detected. */
static bool readAir(float& tempC, float& humidity, float& pressureHpa) {
  pressureHpa = NAN;
  if (air == AIR_SHT31) {
    tempC = sht31.readTemperature();
    humidity = sht31.readHumidity();
  } else if (air == AIR_BME280) {
    tempC = bme.readTemperature();
    humidity = bme.readHumidity();
    pressureHpa = bme.readPressure() / 100.0f;
  } else if (air == AIR_AHT20) {
    sensors_event_t h, t;
    if (!aht.getEvent(&h, &t)) return false;
    tempC = t.temperature;
    humidity = h.relative_humidity;
  } else {
    return false;
  }
  return !isnan(tempC) && !isnan(humidity) && humidity >= 0.0f && humidity <= 100.0f &&
         tempC > -40.0f && tempC < 85.0f;
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
  Serial.println("TT key saved");
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
  Serial.println("TT extras: " + (extras.isEmpty() ? String("none") : extras));
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
    Serial.println("TT config error: expected TTCFG<TAB>ssid<TAB>password<TAB>key");
    return;
  }
  String ssid = line.substring(a + 1, b);
  String pass = line.substring(b + 1, c);
  String key = line.substring(c + 1);
  if (ssid.isEmpty() || normalizeKey(key).isEmpty()) {
    Serial.println("TT config error: network name and device key are required");
    return;
  }
  saveKey(key);

  Serial.println("TT wifi joining");
  wifiManager.stopConfigPortal();
  WiFi.mode(WIFI_STA);
  WiFi.persistent(true);
  WiFi.begin(ssid.c_str(), pass.c_str());
  unsigned long start = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - start < WIFI_JOIN_TIMEOUT_MS) {
    delay(250);
  }
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("TT wifi ok");
    postNow = true;
  } else {
    Serial.println("TT wifi failed: check the network name and password (2.4 GHz only)");
  }
}

void readSerial() {
  while (Serial.available() > 0) {
    char ch = (char)Serial.read();
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
      Serial.println("TT reset: clearing Wi-Fi and device key");
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
  if (air != AIR_NONE && !airOk) air = AIR_NONE;  // re-detect next time
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
        Serial.printf("TT sensor: %s on GPIO %d\n", dht.getModel() == DHTesp::DHT11 ? "DHT11" : "DHT22", ONE_WIRE_PIN);
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
    body += String("\"door1\":") + (digitalRead(DOOR_PIN) == HIGH ? "true" : "false") + ",";
    sent++;
  }
  if (optBattery) {
    // 1:1 divider, so the pin sees half the cell. Single-cell Li-ion: 3.3 V empty, 4.2 V full.
    int cellMv = (int)analogReadMilliVolts(BATTERY_PIN) * 2;
    int pct = constrain((cellMv - 3300) * 100 / (4200 - 3300), 0, 100);
    body += "\"battery_pct\":" + String(pct) + ",";
  }

  if (sent == 0) {
    Serial.println("TT no probe: check the wiring (DS18B20 or DHT22 data on GPIO " + String(ONE_WIRE_PIN) + ", 4.7k pull-up to 3.3V)");
    return;
  }
  // The dashboard compares this with /flash's current version to offer updates.
  body += "\"fw\":\"" FIRMWARE_VERSION "\",\"rssi\":" + String(WiFi.RSSI()) + "}";

  // Same trust model as the sample sketches: TLS without certificate pinning.
  WiFiClientSecure client;
  client.setInsecure();
  HTTPClient http;
  http.setTimeout(15000);
  if (!http.begin(client, String("https://") + INGEST_HOST + "/api/ingest/" + deviceKey)) {
    Serial.println("TT post failed: could not open connection");
    return;
  }
  http.addHeader("Content-Type", "application/json");
  int code = http.POST(body);
  http.end();

  Serial.printf("TT post %d probes=%u\n", code, (unsigned)sent);
  if (code == 401 || code == 403 || code == 404) {
    Serial.println("TT key rejected: copy the device key again from Dashboard → Devices");
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(RESET_PIN, INPUT_PULLUP);
  probes.begin();
  prefs.begin("probeharbor", false);
  deviceKey = prefs.getString("key", "");
  applyExtras(prefs.getString("extras", ""));
  extrasParam.setValue(extras.c_str(), MAX_EXTRAS_LEN);
  Wire.begin(I2C_SDA_PIN, I2C_SCL_PIN);

  Serial.println();
  Serial.println("TT firmware " FIRMWARE_VERSION);

  wifiManager.addParameter(&keyParam);
  wifiManager.addParameter(&extrasParam);
  wifiManager.setSaveParamsCallback(onPortalParamsSaved);
  wifiManager.setConfigPortalBlocking(false);
  wifiManager.setConfigPortalTimeout(PORTAL_TIMEOUT_S);
  wifiManager.setConnectTimeout(30);
  wifiManager.setDebugOutput(false);
  if (wifiManager.autoConnect("ProbeHarbor-Setup")) {
    Serial.println("TT wifi ok");
  } else {
    Serial.println("TT setup: send settings over USB, or join the ProbeHarbor-Setup Wi-Fi network");
  }
}

void loop() {
  wifiManager.process();
  readSerial();
  checkResetButton();

  unsigned long now = millis();

  // A router that boots slower than this board (after a power cut) must not
  // leave the probe parked in the setup portal: once the portal has timed out
  // and Wi-Fi is still down, restart and try the saved network again.
  if (WiFi.status() == WL_CONNECTED || wifiManager.getConfigPortalActive()) {
    offlineSince = 0;
  } else if (offlineSince == 0) {
    offlineSince = now == 0 ? 1 : now;
  } else if (now - offlineSince >= OFFLINE_RESTART_MS) {
    Serial.println("TT wifi lost: restarting to retry");
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
    Serial.println("TT waiting for wifi");
    return;
  }
  if (deviceKey.isEmpty()) {
    Serial.println("TT waiting for device key");
    return;
  }
  postReadings();
  firstPostDone = true;
}
