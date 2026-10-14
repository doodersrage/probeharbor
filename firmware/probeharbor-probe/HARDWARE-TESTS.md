# Hardware tests still open (firmware 1.2.1)

Verified so far, on a plain ESP32: browser flash → USB settings → Wi-Fi → first
reading, with a DS18B20 (1.0.1) and with a DHT22 (1.1.1). Everything below has
only been compiled.

Keep the board on USB with the serial console open in `/flash` (or any serial
monitor at 115200 baud). Lines starting `TT` are the ones to watch. Write the
result and the firmware line (`TT … 1.2.1`) next to each test.

## 1. Setup portal (no USB settings)

1. Hold BOOT for 5 seconds to erase saved Wi-Fi and key. Expect a reset.
2. Expect `TT setup: send settings over USB, or join the ProbeHarbor-Setup Wi-Fi network`.
3. From a phone, join the `ProbeHarbor-Setup` network. The setup page should open by
   itself (captive portal); if not, browse to `192.168.4.1`.
4. Enter your Wi-Fi and the device key, save.
5. Expect `TT wifi ok`, then a `post 200` within about a minute, and the reading on
   the device's page in ProbeHarbor.
6. The portal closes itself after 3 minutes untouched; note whether the board then
   restarts and offers it again.

## 2. Router power cut

1. With the board posting normally, unplug the router for 3+ minutes.
2. Expect `TT waiting for wifi` / `TT wifi lost: restarting to retry` about once a
   minute. The board must **not** sit in the setup portal for good.
3. Plug the router back in. Readings should resume on their own within a few
   minutes, with no button press. Note how long it took.

## 3. BOOT reset

1. Hold BOOT for 5 seconds while the board is posting.
2. Expect saved settings erased and the setup portal back (test 1, step 2).
3. A short press (under 5 s) should do nothing.

## 4. ESP32-S3 and ESP32-C3 boards

Flash each from `/flash` and repeat the original path: install → USB settings →
Wi-Fi → first reading. Sensor data stays on GPIO 4 for both. Pins for the extras
differ by board:

| | ESP32 | ESP32-S3 | ESP32-C3 |
|---|---|---|---|
| Probe data (DS18B20 / DHT) | 4 | 4 | 4 |
| I2C SDA / SCL | 21 / 22 | 8 / 9 | 6 / 7 |
| Leak contact | 27 | 5 | 5 |
| Door reed switch | 26 | 6 | 10 |
| Battery (1:1 divider) | 35 | 7 | 3 |

## 5. I2C sensor (SHT31, BME280, or AHT20)

1. Wire SDA/SCL from the table, 3.3 V and GND. No probe on GPIO 4.
2. Expect `TT sensor: <name> on I2C (SDA …, SCL …)` and temperature plus humidity on
   the device page. Compare against a thermometer next to it.

## 6. Leak, door, and battery inputs

Turn them on in `/flash` ("extras") or the portal's extras box before saving.

- **Leak:** two bare wires on the leak pin and GND. Touch them with a wet finger or
  put them in water: `leak1` should read Wet and send a leak alert. Dry them: the
  alert closes with a "leak sensors are dry" notice.
- **Door:** reed switch between the door pin and GND. Magnet away = Open.
- **Battery:** a single Li-ion cell through a 1:1 divider (two equal resistors, e.g.
  100k + 100k) to the battery pin. `battery_pct` should track a multimeter reading.

## 7. Power-off alert (new in the app, no firmware change)

Any device posting a `power` sensor as `false` should now raise a "Power off" alert,
and "Recovered: power is back" once it posts `true`. A quick check without
hardware: in the payload checker, a key named `power1` with `true`/`false` should
come out as a Power sensor.
