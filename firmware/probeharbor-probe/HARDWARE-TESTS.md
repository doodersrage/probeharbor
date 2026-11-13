# Hardware tests still open (firmware 1.2.7)

Verified so far, on a plain ESP32: browser flash → USB settings → Wi-Fi → first
reading, with a DS18B20 (1.0.1), a DHT22 (1.1.1), a BME280 on I2C (1.2.2:
temperature, humidity, and pressure), and an SHT31 on I2C (1.2.3 from `/flash`:
temperature and humidity). The door reed switch (1.2.2) works too, and so does posting
right away on a door change (1.2.3). On an ESP32-S3 (1.2.4, native USB port): browser
flash → USB settings → Wi-Fi → first reading with an AHT20 on I2C.
On an ESP32-C3 (1.2.5, native USB port): the same path with a DHT22 on GPIO 4.
An AHT20 on a plain ESP32 (1.2.5 from `/flash`, then the 1.2.6 reading code).
Everything else below has only been compiled.

Keep the board on USB with the serial console open in `/flash` (or any serial
monitor at 115200 baud). Lines starting `TT` are the ones to watch. Write the
result and the firmware line (`TT … 1.2.7`) next to each test.

## Parts to order

Buy links are on [/flash](https://probeharbor.dev/flash#what-to-buy) (source: `src/lib/bomLinks.ts`).

- Test 4: an ESP32-S3-DevKitC-1 and an ESP32-C3-DevKitM-1.
- Test 5: an AHT20 (BME280 and SHT31 done).
- Test 6: an LM393 "rain / water sensor" module plus two bare wires for the leak contact (door switch done), two 100kΩ resistors, and a
  single Li-ion cell.
- Test 8: an Adafruit HUZZAH32 or ESP32 Feather V2 (plus a STEMMA QT sensor for
  the I2C step).

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

**ESP32-S3 native USB port: partly verified (2026-11-05), firmware 1.2.4 flashed
over the board's native USB port.** Up to 1.2.3 the S3 build only read settings on
the UART bridge, so a board on its native USB port installed fine and then never
answered the flasher. 1.2.4 listens and answers on both ports. Seen on the native port: the `TT`
boot lines, `TT key saved`, `TT wifi joining`, and `TT wifi failed` for a made-up
network name. Then, from the live `/flash` page with real settings: `TT key saved`,
`TT wifi joining`, `TT wifi ok` (no sensor wired yet, so `TT no probe`). A second S3 (flashed with
`pio run -t upload`, settings from the live `/flash` page) with an AHT20 on SDA 8 /
SCL 9: `TT sensor: AHT20 on I2C (SDA 8, SCL 9)`, `TT wifi ok`, `TT post 200 probes=1`.
Still open on the S3: a DS18B20 or DHT22 on GPIO 4, the UART
port (not plugged in), the setup portal, and the BOOT reset.

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

**ESP32-C3 native USB port: verified (2026-11-06), firmware 1.2.5.** The board had
only its native USB port (303a:1001). 1.2.4 booted but printed no `TT` lines and
ignored settings: the C3 build left native USB off. 1.2.5 turns it on
(`-DARDUINO_USB_MODE=1`), so the dual-port console from 1.2.4 covers the C3 too.
Flashed with `pio run -t upload`, settings from the live `/flash` page: `TT key saved`,
`TT wifi ok`, then (once the data wire was moved to the pin marked 4)
`TT sensor: DHT22 on GPIO 4` and `TT post 200 probes=1`. Still open on the C3: a
DS18B20, an I2C sensor on SDA 6 / SCL 7, the UART port of a DevKitM-1, the setup
portal, and the BOOT reset.

## 5. I2C sensor (AHT20; BME280 and SHT31 verified)

**AHT20: detected and posting on an ESP32-S3 (2026-11-05), firmware 1.2.4.** The board
printed `TT sensor: AHT20 on I2C (SDA 8, SCL 9)` and `TT post 200 probes=1`. The
dashboard showed temperature and humidity: 77.3°F / 55%, next to an existing indoor
probe in the same room reading 74.8°F / 57%. The AHT20 sat next to a computer, which
explains it reading warmer. This is a rough check against another sensor, not a
calibrated reference.

**AHT20 on a plain ESP32: verified (2026-11-11).** ESP32-D0WD-V3, SDA 21 / SCL 22.
Firmware 1.2.5 installed from `/flash`: `TT sensor: AHT20 on I2C (SDA 21, SCL 22)`,
`TT wifi ok`, `TT post 200 probes=1`, reading 74.5°F / 54.4% in production. Then the
1.2.6 reading code (flashed as `1.2.6-diag` with `pio run -t upload`; Wi-Fi and key
kept): `TT post 200 probes=1` every minute, 74.4–75.2°F / 53.5–54.4% in production,
the same as the library read just before.

**A sensor that stops answering (2026-11-11, ESP32-S3, AHT20 on SDA 8 / SCL 9).**
The S3 posted every minute until 03:39 ET, then went silent with no errors. After a
power cycle, 1.2.5 printed `TT sensor: AHT20 …` then `TT no probe … GPIO 4`, which
pointed at the wrong sensor. The 1.2.6 reading code printed
`TT sensor problem: AHT20 found but not reading: no data after the measure command`
every minute and kept running: the sensor ACKed writes but every I2C read failed
(`i2cRead returned Error -1`, also hidden in the library's boot check). The same
AHT20 works on the plain ESP32 above, so the fault was on the S3 side: the user then
found a **loose ground pin**, likely the cause.
Up to 1.2.5, the library's unbounded busy-wait could freeze the probe on such a
sensor, which fits the silent stop at 03:39 (not proven).

**ESP32-S3 after rewiring, release 1.2.6 (2026-11-11).** The `/flash` S3 image
(byte-identical to the live one) written over native USB (303a:1001). Writing the
merged image at 0x0 also erases the settings partition, so settings were sent again
from `/flash`: `TT sensor: AHT20 on I2C (SDA 8, SCL 9)`, `TT firmware 1.2.6`,
`TT wifi ok`, `TT post -5 probes=1`. `probes=1` means the AHT20 read; `-5` is the
HTTP client's "connection lost" on the first post after joining Wi-Fi (the server
logged no error). A plain ESP32 was posting with the same device key at the time, so
the S3's later posts can't be told apart in production; a reading at 19:34:52
(75.4°F / 50.7%) is most likely the S3's retry.

On its own device key ("ESP32-S3 Test", 19:38 ET): the serial log showed
`TT post -5 probes=1` twice, each after `ssl_client … (-76)` (the TLS read of the
reply failed), then `TT waiting for wifi`. Production had both readings (74.83°F at
19:40:15, 74.70°F at 19:41:03; ingest stats 2 successes, 0 errors): **`-5` here means
the reply was lost, not the reading.** The board rejoined Wi-Fi by itself and posted
every 60 s from 19:43 (RSSI -63 dBm), with one 119 s gap for the Wi-Fi drop.
Opening the S3's native USB port resets it (`USB_UART_CHIP_RESET`), so each serial
read restarts the probe. Still open: a long run on the S3 (the dropped replies and
the Wi-Fi drop may point to power or the radio link); the `TT sensor problem` path
on a C3 (compiled only).

**SHT31: verified on a plain ESP32 (reported 2026-11-04), firmware 1.2.3
installed from `/flash`.** Temperature and humidity showed on the device page.
Not checked: the `TT sensor:` serial line, and readings against a reference
thermometer/hygrometer.

1. Wire SDA/SCL from the table, 3.3 V and GND. No probe on GPIO 4.
2. Expect `TT sensor: <name> on I2C (SDA …, SCL …)` and temperature plus humidity on
   the device page. Compare against a thermometer next to it.

## 6. Leak, door, and battery inputs (door verified)

Turn them on in `/flash` ("extras") or the portal's extras box before saving.

- **Leak:** two bare wires on the leak pin and GND. Touch them with a wet finger or
  put them in water: `leak1` should read Wet and send a leak alert. Dry them: the
  alert closes with a "leak sensors are dry" notice.
  - Also try the bare wires ~5 mm apart in a thin puddle of clean tap water. The
    pin's internal pull-up (~45k) needs the water path under roughly 15k, so this
    may not trip. If it doesn't, note it: the fix is an analog read of the leak pin.
  - Then the LM393 module (VCC 3.3V only, GND, DO → leak pin). Before wiring DO,
    measure it with a multimeter: about 3.3V dry, near 0V wet. Set its dial so a
    drop of water reads Wet and dry reads Dry.
- **Door (verified on a plain ESP32):** reed switch between the door pin and GND. Magnet away = Open.
  - **1.2.3 post on door change: verified on a plain ESP32 (2026-10-29).** The board was
    flashed from source over USB and the switch was on a real door, with no console. The device
    page flipped Open/Closed as the door moved, and History → Doors listed separate
    sub-minute openings (three within 5:35 PM), which 1.2.2 could not record.
    With seconds shown, openings of about 5 s read 5 s, 5 s and 8 s (others: 26 s, 2 s).
    Durations are the gap between the server's arrival times (the probe sends
    no timestamp), so they can be off by a few seconds: one read 2 s although
    the probe starts posts at least 5 s apart, likely because one post took
    longer to read sensors and connect.
    Still open: the ~1 s latency and the 5 s minimum gap between posts during rapid
    toggling (no 429s) weren't measured. Check with the serial console, or compare
    the device's readings export (second-level times) against noted door times.
- **Battery:** a single Li-ion cell through a 1:1 divider (two equal resistors, e.g.
  100k + 100k) to the battery pin. `battery_pct` should track a multimeter reading.

## 7. Power-off alert (new in the app, no firmware change)

Any device posting a `power` sensor as `false` should now raise a "Power off" alert,
and "Recovered: power is back" once it posts `true`. A quick check without
hardware: in the payload checker, a key named `power1` with `true`/`false` should
come out as a Power sensor.

## 8. Adafruit Feather (HUZZAH32 or ESP32 Feather V2)

Same firmware as a plain ESP32. Feather pin labels:

| | HUZZAH32 | Feather V2 |
|---|---|---|
| Probe data (GPIO 4) | A5 | A5 |
| Door (GPIO 26) | A0 | A0 |
| Leak (GPIO 27) | 27 | 27 |
| I2C (found at boot) | SDA / SCL pads (23 / 22) | SDA / SCL or STEMMA QT (22 / 20) |
| Battery | built in (GPIO 35) | built in (GPIO 35) |

1. Flash from `/flash`, DS18B20 on A5: expect the usual first reading.
2. I2C sensor on the Feather's SDA/SCL (V2: the STEMMA QT port), power-cycle.
   Expect `TT sensor: <name> on I2C (SDA 23, SCL 22)` on a HUZZAH32 or
   `(SDA 22, SCL 20)` on a V2. On the V2 the STEMMA port is powered from GPIO 2,
   which the firmware turns on; if the sensor's LED stays dark, note it.
3. LiPo in the battery connector, battery ticked in extras: `battery_pct` should
   track the cell (the board's divider is 1:2, same math as the DIY divider).
4. Regression on a plain ESP32 DevKit with no I2C sensor: boots as before; its
   GPIO 2 LED may blink once at startup.
5. The 5-second BOOT reset isn't expected to work on Feathers (no button on
   GPIO 0); resend settings from `/flash` instead.

## 9. Device key sent as a header (1.2.7, source only)

1.2.7 posts to `/api/ingest/_` with the key in an `X-Ingest-Key` header
instead of in the URL. The server has accepted that header since 2026-09.
Compiled for ESP32, S3 and C3. `/flash` still serves 1.2.6 until steps 2–4
are done.

**Step 1 verified (2026-11-13) on an ESP32-S3 with an AHT20.** Before: the
board's earlier image posted `TT post 200 probes=1`. Flashed 1.2.7 with
`pio run -e esp32s3 -t upload` (saved Wi-Fi and key kept); after a reset:
`TT sensor: AHT20 on I2C (SDA 8, SCL 9)`, `TT firmware 1.2.7`, `TT wifi ok`,
then `TT post 200 probes=1` five times over about 4 minutes. With the key no
longer in the path, a server that ignored the header would have answered
400, so the 200s show the header path working against production. The board
was left on 1.2.7.
Not done: step 2 (dashboard, needs a signed-in check), steps 3–4 (need the
Wi-Fi name and password to send `TTCFG`), and the plain ESP32 and C3.

1. Build and upload 1.2.7 (`pio run -t upload` in this folder) to a board
   that already has Wi-Fi and a key saved. Expect `TT firmware 1.2.7`, then
   `TT post 200 probes=…` within a minute.
2. Dashboard → Devices: the new reading arrives, and the device shows
   firmware 1.2.7.
3. Send a wrong key over USB (then put the right one back):
   expect `TT post 401` and the "key rejected" hint, as before.
4. Paste a full ingest URL (`https://…/api/ingest/<key>`) as the key over USB
   or in the portal: it is still trimmed to the bare key and posts 200.
5. If 1–4 pass: `pnpm firmware:build`, commit the images and manifest, and
   note the date here.
