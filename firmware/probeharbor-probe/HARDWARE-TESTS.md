# Hardware tests still open (firmware 1.5.0, released 2026-11-13)

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
result and the firmware line (`TT … 1.5.0`) next to each test.

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
Step 2 verified the same day: the owner saw the readings in the dashboard.
Not done: steps 3–4 (need the
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

## 10. Buffered readings with their own time (1.3.0, source only)

1.3.0 sets its clock over NTP, stamps each reading, and keeps it in a RAM
buffer (240 readings, 4 hours) until the server answers 2xx. Readings go as
`{"readings": [{..., "recorded_at": <unix s>}]}`, up to 30 per request.
The buffer survives the probe's own restarts (the offline restart, a reset,
a reflash) but not a power cut. A server that answers a batch with 400 (one
from before 2026-11) gets plain readings, as before, until the next restart.
Compiled for ESP32, S3 and C3.

**Verified on an ESP32-S3 + AHT20 (2026-11-13):**

- Boot, NTP: `TT firmware 1.3.0`, `TT wifi ok`, `TT clock set`.
- Server unreachable (a test build pointed at a host the probe couldn't
  reach): `TT post -1 probes=1 buffered=1`, then `=2`, `=3`, one a minute.
- Reset during that outage: `TT buffer: 3 reading(s) kept from before the
  restart`, the clock still set, then `buffered=4`, `=5`.
- Reflash with the production build: `TT buffer: 6 reading(s) kept…`.
- Against production as deployed then (a server without batch support):
  `TT server didn't take timed readings: sending plain readings until
  restart`, then `TT post 200 probes=1` each minute. No `TT post 400` is
  printed, so `/flash` doesn't report a failure.

**After the batch-capable server deployed (2026-11-13, S3 + AHT20):**

- Step 1: after a reset, `TT clock set`, then `TT post 200 probes=1
  buffered=0` every minute from 13:17 to 13:28 against production
  (each reading sent as a one-item batch with its own time).
- Step 3: unplugged from USB for about a minute (power cut). On boot, no
  `TT buffer: … kept` line (the buffer was empty anyway), then
  `TT post 200 probes=1 buffered=0` 10 s after boot with the clock already
  set over NTP. Found here: `TT clock set` printed a minute late (only
  checked when a reading was due); now checked every loop and printed right
  after Wi-Fi (`13:32:20 TT wifi ok`, `13:32:20 TT clock set`).

- Step 2, simulated (the probe's network is shared and can't be turned
  off). A test build (`-DPROBE_TEST_HOOKS`, version `1.3.0-test`; the
  hooks are not in `/flash` images) adds `TTTEST<TAB>fail<TAB><s>`,
  `TTTEST<TAB>drop` and `TTTEST<TAB>wifioff` over USB, and prints the
  server's reply. Against production, 13:38–13:49:
  - Posts failing for 300 s: `TT post -1 probes=1 buffered=1` … `=5`, one
    a minute; then one `TT post 200 … buffered=0` and the server said
    `"readings":12` (6 readings × temperature + humidity).
  - Reply dropped: the server said `"readings":2`, the probe saw `-11` and
    kept it (`buffered=1`); the resend with the next reading: server said
    `"readings":2,"duplicates":2`, so nothing was stored twice.
  - Wi-Fi off: `TT offline: reading kept (1 buffered)`, `TT wifi lost:
    restarting to retry`, `TT buffer: 1 reading(s) kept from before the
    restart`, `TT wifi ok`, `TT clock set`, then the server said
    `"readings":4` (the kept reading and the new one).
  Production 1.3.0 reflashed afterwards (`TT post 200 … buffered=0`).
  A real router or network outage hasn't been tested; the code path for
  Wi-Fi down is the one `wifioff` takes.

To build the test image: `PLATFORMIO_BUILD_FLAGS="-DPROBE_TEST_HOOKS
-DFIRMWARE_VERSION='\"1.3.0-test\"'" pio run -e esp32s3 -t upload`.

**Still to do:**

1. Dashboard: history around 13:40–13:49 on 2026-11-13 should show a
   reading each minute, no gap (owner check).
3. ~~Power cut~~ (done above). Not yet seen: a power cut *with* readings
   buffered (expected: they are lost).
4. The plain ESP32 and the C3.
5. If 1–4 pass: `pnpm firmware:build` and commit the images (1.2.7's change
   comes along).

## 11. Watchdog (1.3.1, source only)

1.3.1 restarts the chip if `loop()` stops coming round for 60 s, and says
so on the next boot (`TT restarted by watchdog: something stopped
responding`; `TT restarted after a crash` for a panic). TLS handshakes are
capped at 20 s and connects at 10 s so one slow request (~45 s at most)
can't trip it. Compiled for ESP32, S3 and C3.

**Verified on an ESP32-S3 + AHT20 (2026-11-13), test build
(`TTTEST<TAB>hang`, see test 10):** posts failing, 3 readings buffered;
`TT test: hanging the loop` at 14:20:30; at 14:21:30 the chip restarted:
`TT buffer: 3 reading(s) kept from before the restart`, `TT firmware
1.3.1-test`, `TT restarted by watchdog…`, then the server said
`"readings":8` (the 3 kept + the new one). Production 1.3.1 flashed after;
posting every minute with no watchdog restart: a 30-minute serial log
(14:28–14:58) had 30 × `TT post 200` and no restart or crash line.

Still to do: a long run (a day) with no `TT restarted by watchdog`, the
plain ESP32 and the C3, and a slow or stalled server (expect `TT post -1`,
not a watchdog restart).

## 12. Over-the-air updates (1.5.0, source only)

1.5.0 updates itself from `/firmware/ota.json` (signed with the owner's
key; see `firmware/README.md`) an hour after boot and then daily, keeps a
new image on probation until its first 2xx post, and goes back to the old
one if it restarts first (bootloader) or posts nothing for 30 minutes.
Versions 1.4.x were test builds only and are below every released OTA
version, so a signed test image can't be offered to a released probe.

**Verified on an ESP32-S3 + AHT20 (2026-11-13), against production.** Test
builds (`PROBE_TEST_HOOKS`, `OTA_PROBATION_MS=300000`) of `1.4.0-test` and
`1.4.1-test`; a signed test manifest for 1.4.1 published at
`/firmware/ota-test/` (removed afterwards), plus copies with a corrupted
signature and with `rollout_pct: 0`. `TTTEST<TAB>ota<TAB><path>` reads a
manifest at once.

- Corrupted signature: `TT ota: 1.4.1 is not signed by the ProbeHarbor key,
  ignored`.
- Rollout 0: `TT ota: 1.4.1 available, not yet for this probe (rollout 0%)`.
- Install: `downloading 1.4.1` → `installed 1.4.1, restarting` in ~15 s →
  `TT firmware 1.4.1-test`, `TT ota: running 1.4.1-test on probation until
  it posts`.
- Probation failed (posts made to fail): 5 × `TT post -1 … buffered=N`,
  then `no successful post in … minutes, going back to the previous
  version` → `TT firmware 1.4.0-test`, `TT buffer: 5 reading(s) kept`, and
  the kept readings sent (`"readings":12`).
- Probation passed: installed again → first `TT post 200` →
  `TT ota: 1.4.1-test confirmed`; normal posts after.
- Hang on probation (`TTTEST hang`): watchdog restart 60 s later, and the
  bootloader went back on its own: `TT firmware 1.4.0-test`, `TT restarted
  by watchdog…`, then 200s.
- Found and fixed during the first run: the probation hook had C++
  linkage, so the core trusted every new image at boot (266b406).
- Production 1.5.0 (no test hooks) flashed afterwards: posting 200.

Still to do: the plain ESP32 and the C3; an update over a slow or dropped
connection (expect `download interrupted, will retry tomorrow`); a real
publish (`pnpm firmware:build`, `pnpm firmware:sign --rollout 10`) once
1.5.0 is released.

## Plain ESP32 (DevKit, CP2102, AHT20): tests 10–12 and 13 (2026-11-13)

Same procedures as on the S3, with test builds (`PROBE_TEST_HOOKS`) and an
event-driven serial driver, against production:

- **Test 10 (buffer):** 3 minutes of failed posts kept 3 readings, sent as
  one batch (`"readings":8`); a dropped reply's resend came back
  `"duplicates":2`; Wi-Fi off kept a reading across the offline restart
  and sent it after reconnecting (`"readings":4`). Also seen unplanned: a
  real `-1` right after a restart, kept and sent 40 s later.
- **Test 11 (watchdog):** a hang with 2 readings buffered restarted 60 s
  later (`TT restarted by watchdog`), the 2 kept and sent.
- **Test 12 (OTA, signed test manifest for esp32):** bad signature refused;
  rollout 0 skipped; install in ~20 s; failed probation went back after 5
  minutes with 5 readings kept; a hang on probation was reverted by the
  bootloader; a final install was confirmed by its first post.

## 13. Verified TLS (1.5.0, source only)

Posts check probeharbor.dev's certificate against the nine roots in
`ca_roots.h`; after 3 certificate failures in a row the probe posts
unverified (`"tls":"unverified"`) and retries verified a day later.

**Verified on the plain ESP32 (2026-11-13), test build:** first post
`TT tls: server certificate verified`. `TTTEST tlsbad` (only ISRG Root X2,
which doesn't sign the site): two `TT tls: certificate check failed (X509 -
Certificate verification failed…)`, then on the third `certificate not
verified … posting without verification, retrying in a day`; the next post
sent the 3 failed readings and the new one (`"readings":8`). `TTTEST
tlsgood`: verified again. Production 1.5.0 afterwards: verified, posting.

**Same test on the ESP32-S3 (2026-11-13, 17:01–17:07):** verified; with the
wrong root two failures, fallback on the third, the 3 kept readings and
the new one sent (`"readings":8`); real roots: verified again. The server
(46e79f3 deployed) stored and then cleared this probe's `tls` flag during
the test. Final production 1.5.0 flashed afterwards: `TT tls: server
certificate verified`, posting 200.

Still to do: the C3 on 1.5.0; the 24-hour retry (not waited for).

## 14. Crash reports (1.5.1, source only)

After a crash the chip saves a core dump; at the next boot 1.5.1 prints
`TT crash: <task> stopped at 0x…; reporting it with the next post`, sends
the summary as `crash` on each post until one gets a 2xx, prints
`TT crash: report sent` and erases the dump. The device page then shows
"Last crash" with the function name, from this build's table in
`public/firmware/symbols/`.

**ESP32-C3 SuperMini (2026-11-14), against production: passed.** The
first crash reported was a real one (below): 1.5.1-test, flashed over the
1.5.0 that crashed, printed `TT crash: loopTask stopped at 0x4200aabe`, sent
it with its first accepted post (`TT crash: report sent`), and after a
reset printed no `TT crash:` line (erased). Then `TTTEST crash`: Store
access fault, reboot, `TT restarted after a crash`, `TT crash: loopTask
stopped at 0x42001ac2` (readSerial()+0x276 in that build's table: the
hook, inlined), report sent on the next post.

**ESP32-S3 (2026-11-14): passed.** 1.5.1-test first reported an old crash
left in flash by an earlier test build (task IDLE0, most likely the test 11
watchdog hang; that build has no table, so the page showed bare addresses),
then erased it. `TTTEST crash`: `Guru Meditation … (StoreProhibited)`,
reboot, `TT crash: loopTask stopped at 0x42004da6`, sent with the next post,
erased. The device page (owner, after the build's table deployed): "Stopped
in readSerial()", cause StoreProhibited, task loopTask, build 1.5.1-test, and
the backtrace `readSerial() +0x226` → `loop() +0xb` → `loopTask(void*)
+0x15`. On the C3 the page showed the report too; its names appeared once
that build's table was deployed (CI had been blocked by the deleted e2e
branch). The S3 joins at full power (the C3 fallback stays C3-only).

**Plain ESP32 (DevKit, CP2102, AHT20), 2026-11-15, 1.5.2-test: passed.**
`TTTEST crash`: StoreProhibited, reboot, `TT crash: loopTask stopped at
0x400d4c06` (`readSerial() +0x296`), `report sent` with the next post.
Settings-resend fix: the guarded stop (`TTTEST stopportal`, no portal
running) did nothing; the 1.5.0 unguarded stop (`stopportal-old`) crashed
with LoadProhibited in `WiFiManager::shutdownConfigPortal() +0x4c`, which the
probe reported itself. So the bug was on all three chip families and the fix
holds on all three. Back on the published 1.5.2 afterwards (app written at
0x10000 with boot_app0; settings kept), posting 200 with verified TLS.

Procedure (S3, then C3). A test build has its own ELF hash,
so deploy its function table first or the page shows bare addresses:
`node scripts/firmware-symbols.mjs .pio/build/<env>/firmware.elf <chip>
1.5.1-test public/firmware/symbols`, commit, let it deploy (a public JSON
file named by the hash; harmless to keep).

1. Flash `-DPROBE_TEST_HOOKS -DFIRMWARE_VERSION='"1.5.1-test"'`, let it post.
2. Send `TTTEST<TAB>crash`. Expect a Guru Meditation (StoreProhibited on
   the S3, Store access fault on the C3), a core dump write, a reboot.
3. After the reboot: the `TT crash:` line, then on the next post
   `TT crash: report sent`. Reboot again: no `TT crash:` line (erased).
4. Device page: "Last crash: Stopped in handleTestLine(…)" (S3), cause
   and task `loopTask`; on the C3 the stack-scan note.
5. With `TTTEST<TAB>fail 120` before step 2: the report survives failed
   posts and goes with the first accepted one.

## 15. Pairing codes (1.6.0, source only)

The key box (phone setup page, /flash) also takes a pairing code from the
device page's "Pair a probe" (XXXX-XXXX, 30 minutes, single use). 1.6.0
prints `TT pairing code saved`, keeps any current key, and once Wi-Fi is up
posts the code to `/api/pair/claim`: `TT paired: key saved` on success, then
uploads with the new key. An unknown, used or expired code prints
`TT pairing code rejected: …`; offline, 429 and 5xx retry every 30 s.
Anything 6–12 letters and digits long that isn't a valid code is refused
the same way and never replaces the key.

**ESP32-C3 SuperMini (2026-11-16), against production, phone setup page:
passed on the second try.** First try (first 1.6.0 build): the code typed
on the phone printed `TT key saved` (taken as a key) and the code was never
claimed. Likely cause: the phone sent a character other than an ASCII
space or hyphen, which that build didn't ignore; what was typed wasn't
captured. The same first try also showed the BOOT reset clearing the
C3's low-power Wi-Fi flag, so the portal's join failed (reason 39) until the
portal timed out. Fixed in the build that passed: letters and digits only
(probe and server), code-sized junk refused, `lowtx` kept across the
reset (after the reflash: `retrying at low transmit power`, `joined at low
transmit power`). Second try: BOOT held 5 s (`TT reset: …`), the setup page
on the phone with Wi-Fi and the code: `TT pairing code saved` (07:31:11),
`TT paired: key saved` (07:31:20), `TT post 200 probes=1 buffered=0` (the 3
readings held while it had the bad key went too). Server:
`device_pairings` row used at 12:31:19 UTC by chip `ESP32-C3`; the device
reports firmware 1.6.0. Not yet tested on hardware: /flash with a code,
the plain ESP32 and the S3 (same code path; compile only).

## 16. Setup page on a C3 that has never joined (1.6.1, source only)

1.6.1 changes the phone setup page (all boards unless noted):
- **C3:** the setup network runs at 8.5 dBm (`TT setup network: low
  transmit power`); after Save the join gets full power back, and if it
  fails a C3 without "lowtx" retries at low power at once (`TT wifi:
  retrying at low transmit power`) with the setup network kept up. `lowtx`
  survives the BOOT reset.
- If the join still fails: `TT wifi failed: check the network name and
  password on the setup page`, and the station stops retrying (it pulled
  the setup network off its channel every 3 s, so the phone couldn't load
  the page).
- Save locks while the board joins ("Joining your Wi-Fi… up to a minute");
  WiFiManager's join timeout is 15 s (was 30); a note on the page says it
  can take a minute. The key box has autocorrect, capitals and spellcheck
  off.
- Pairing claims only over a verified certificate.

**ESP32-C3 SuperMini (2026-11-16), against production, phone setup page:
passed** after five rounds of fixes found by the owner's tests that
morning:
1. Reading the entered network with `WiFi.SSID()` (empty after a failed
   join) skipped the retry.
2. Stopping the setup network for the retry dropped the phone back to its
   Wi-Fi settings.
3. At full power the setup network was missing from the phone's list.
4. After a failed join, reconnect attempts every 3 s left the page
   unloadable.
5. A second Save during the 30 s join restarted the wait.

From settings erased (NVS region wiped): pairing on the first Save
(full-power join worked that time). With the final build, a wrong password:
Save 10:06:22, full power failed by 10:06:28, `retrying at low transmit
power` 10:06:39, `wifi failed …` 10:06:59 (37 s), no further join attempts,
setup network still listed. Then the correct password: Save 10:08:24, full
power failed (reasons 2/39), low power joined 10:08:42 (`this board will
keep using it`), `TT paired: key saved` 10:08:46, `TT post 200` 10:08:50.

Also seen: another program on the same USB port reset the C3
(`USB_UART_CHIP_RESET`) and held BOOT during one round, wiping it; runs
during that window were discarded.

The Save button locks while the board joins (owner, phone, 2026-11-16,
released 1.6.1). After pairing: 25 uploads in 30 minutes, all 200.

**ESP32-S3 (98:C3:77:B5:D0:0C, AHT20), 2026-11-16, /flash in the owner's
browser: passed.** The board was on 1.5.1 with a key the C3's pairing had
replaced (`post 401`). First try: settings sent without installing, so
1.5.1 stored the code as a key and got 401 again (the code wasn't spent;
/flash now says so on the spot when a code meets `TT key saved`). After
installing 1.6.1 from /flash and sending Wi-Fi and the same code: paired;
server `device_pairings` row used 15:49:55 UTC by chip `ESP32-S3`, device
reporting 1.6.1, `TT post 200` every minute.

**ESP32-C3 SuperMini, /flash (settings only, already on 1.6.1),
2026-11-16: passed.** Code used 16:06:44 UTC by chip `ESP32-C3`; `TT
paired: key saved`, `TT post 200`. The board was mid-upload with a refused
key when /flash connected (`post -1`), so /flash's 5 s resends queued and
the board handled three identical TTCFG lines in a row (code saved three
times, claimed once): harmless, by design of the resend.

**Plain ESP32 (CP2102, AHT20; the owner's "House Living Room" probe),
2026-11-16, /flash: passed after a /flash fix.** On 1.5.2 with a working
key, settings sent with a code but no install: the board restarted when
the port opened and uploaded with its old key (`post 200`), /flash took
that as live and stopped listening, and the board then stored the code as
its key unseen (`post 401`, probe offline). /flash now ignores results from
before "settings received", and with a code counts live only after
"paired" (683eb55). Then install 1.6.1 from /flash and the code: `pairing
code saved`, `wifi ok`, `paired: key saved`, `post 200`; server: used
16:23:08 UTC by chip `ESP32-D0WD-V3`, House Living Room on 1.6.1 and
reporting. 1.6.1 printed `setup network: low transmit power` on this board
although only the C3 lowers it (message fixed in source, unreleased).

Not checked on hardware: /flash's "firmware too old for a code" message
(needs a pre-1.6.0 board; on the plain ESP32 it was hidden by the bug
above); the fixed flasher with an already-configured board.

## ESP32-C3 SuperMini (Teyleten Robot, native USB only): 2026-11-14

A new board, blank flash (ROM: `invalid header: 0xffffffff`, reset every
few seconds, normal). Flashed the released 1.5.0 with esptool.

- **1.5.0 boots** and opens its setup portal. Settings from /flash: `key
  saved`, `wifi ok` once.
- **Crash found in 1.5.0:** `TT restarted after a crash` right after.
  The panic text goes to UART0, which this board doesn't expose, so the
  core dump was read from flash (0x3F0000) and decoded by hand with
  1.5.0's function table: pc and ra in
  `WiFiManager::shutdownConfigPortal()`. The flasher resends settings until
  it sees `TT key saved` (late over the C3's USB console while it joins),
  and the second TTCFG stopped a portal that was no longer running; WiFiManager
  2.0.17 then uses its freed web server. Fixed in 1.5.1 (080f731): stop it
  only while it's active. Confirmed on the S3 the same day with two test
  hooks running the exact line, no portal running: 1.5.1's guarded stop
  (`TTTEST stopportal`) did nothing and the probe kept running; 1.5.0's
  unguarded stop (`TTTEST stopportal-old`) crashed with LoadProhibited in
  `WiFiManager::shutdownConfigPortal() +0x4c`, which the probe then reported
  itself. (/flash can't easily send settings twice to a running probe:
  opening the port reboots it and the page stops at the first `post 200`.)
- **Wi-Fi at full transmit power fails on this board** (3 times: at boot
  with the saved network, twice from /flash; driver reasons 201 "no AP
  found" and 39 "timeout"). At 8.5 dBm it joined every time. 1.5.1 retries
  a failed join at 8.5 dBm and remembers it (30caa1f): seen on this board,
  first boot `retrying at low transmit power`, `joined at low transmit
  power`; after a reset, straight to `wifi ok`.
- **Verified TLS** on the C3: `TT tls: server certificate verified`,
  posts 200 (no sensor wired; the leak input was enabled so it had a value
  to post: `leak1` dry).
- **Test 10 (buffer), 1.5.1-test, 17:06–17:14:** posts failing 200 s:
  `post -1 … buffered=1`, `=2`, `=3`, then the server said `"readings":4`.
  Reply dropped: server stored it, probe saw `-11` and kept it; the resend
  came back `"duplicates":1`. Wi-Fi off: `offline: reading kept`, `wifi
  lost: restarting to retry`, `buffer: 1 reading(s) kept from before the
  restart`, rejoined at low power, server `"readings":2`.
- **Test 11 (watchdog), 17:26–17:29:** 2 readings buffered, `TTTEST hang` at
  17:27:55, restart at 17:28:55, `buffer: 2 reading(s) kept`, `restarted by
  watchdog`, server `"readings":3`. The watchdog panic also leaves a core
  dump, reported as a crash in task IDLE (the S3's earlier "IDLE0" report
  was the same thing from its test 11); the device page names an idle-task
  function, not the code that hung.
- Back on the published 1.5.1 app afterwards (written at 0x10000 from the
  release image so the settings stay), posting 200.
- **Test 12 (OTA), 17:48–17:56:** test builds 1.4.0-test (base, USB) and
  1.4.1-test (update), probation 5 minutes; test manifest signed by the
  owner for esp32c3 only at `/firmware/ota-test/` (removed afterwards).
  Corrupted signature: `1.4.1 is not signed by the ProbeHarbor key,
  ignored`. Rollout 0: `not yet for this probe (rollout 0%)`. Install:
  downloaded and installed in ~12 s, `running 1.4.1-test on probation`.
  Posts failing on probation: 5 buffered, at 5 minutes `going back to the
  previous version` → `TT firmware 1.4.0-test`, `5 reading(s) kept`, server
  `"readings":6`. Hang on probation: watchdog restart 61 s later and the
  bootloader went back to 1.4.0-test. Install with posts working: first post
  → `1.4.1-test confirmed`. Back on the published 1.5.1 afterwards (boot_app0
  and the release app written over USB; settings kept).
- **Wi-Fi is marginal even at 8.5 dBm:** at the start of test 12 the board
  failed to join (reasons 201, 39) and opened the setup portal; it kept 4
  readings, did its offline restart after 4 minutes, joined, and the server
  stored all 5. No data lost, but a SuperMini placed far from the access
  point may drop out often.
- **DHT22 on GPIO 4 (published 1.5.1, 2026-11-14):** `TT sensor: DHT22 on
  GPIO 4`, posting 200 each minute; the leak input used as a stand-in during
  the tests switched off (`TT extras: none`).
- **Setup portal from a phone (test 1), 19:36–19:58:** BOOT held 5 s:
  `TT reset: clearing Wi-Fi and device key`, restart, `ProbeHarbor-Setup`
  network, WiFiManager page on the phone, Wi-Fi and key saved → `TT key
  saved`, DHT22 found, `post 200` with verified TLS (the portal's own
  full-power join worked that time). A hold that ends right at 5 s can be
  missed while a post is running; 8 s always worked.
- **Found in 1.5.1, fixed in 1.5.2:** after the reset the C3 spent ~40 s
  trying a saved network that didn't exist (20 s full power, 20 s low)
  before opening the portal: the code asked WiFiManager whether a network
  was saved before starting the Wi-Fi driver, which reads an uninitialised
  config. 1.5.2 starts the driver first: portal 1 s after the restart
  (19:48:23 → 19:48:24, and again 19:55:40 → 19:55:41). This also delayed
  every new C3's first settings from /flash by ~40 s.
- A mistyped key in the portal: `post 401`, `TT key rejected…`, readings
  kept (`buffered=4`); after setting it again they went with the next post
  (`"readings":12`).

