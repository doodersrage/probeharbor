# ProbeHarbor probe firmware

`probeharbor-probe/` is the generic firmware behind the browser flasher at
[probeharbor.dev/flash](https://probeharbor.dev/flash). Unlike the samples in
[`sketches/`](../sketches/), nothing is compiled in: Wi‑Fi and the device key
are set after flashing.

| | |
|---|---|
| Boards | ESP32, ESP32-S3, ESP32-C3 (one image per chip family) |
| Sensor | Data on GPIO 4 with a 4.7kΩ pull-up. DS18B20s are tried first (up to four → `temp1`…`temp4`); with none, a DHT22 or DHT11 is auto-detected → `temp1` + `humidity1` |
| I²C (auto-detected) | SHT31, BME280, or AHT20 on SDA/SCL → `temp_air`, `humidity_air` (+ `pressure_air` from a BME280) |
| Leak / door / battery | Only when enabled (`TTEXTRAS<TAB>leak,door,battery` over USB, or the portal's extras box): `leak1` (wet = pin to GND), `door1` (true = open; reed switch to GND when shut), `battery_pct` (1:1 divider, 3.3–4.2 V) |
| Pins | ESP32: I²C 21/22, leak 27, door 26, battery 35 · S3: I²C 8/9, leak 5, door 6, battery 7 · C3: I²C 6/7, leak 5, door 10, battery 3 |
| Interval | One POST a minute to `/api/ingest/<device key>`; from 1.2.3 also right away when the door changes (held 200 ms, at most one extra POST per 5 s). Verified on a plain ESP32 (see HARDWARE-TESTS.md) |

## Setup after flashing

- **USB:** the flasher page sends `TTCFG<TAB>ssid<TAB>password<TAB>key` at 115200 baud.
- **Phone:** join the `ProbeHarbor-Setup` Wi‑Fi network and fill in the portal.
- **Reset:** hold BOOT for five seconds to erase Wi‑Fi and the key.

Lines the device prints for the flasher page start with `TT ` (`TT wifi ok`,
`TT post 200 probes=1`, `TT key rejected…`).

## Building

```bash
pip install platformio
pnpm firmware:build        # compile, merge, and write public/firmware/
pnpm firmware:build --check  # compile only (what CI runs)
```

The merged images and `manifest.json` in `public/firmware/` are committed so
deploys do not need the ESP32 toolchain. Bump `FIRMWARE_VERSION` in
`src/main.cpp` when behaviour changes, rebuild, and commit the new images.

Test on real hardware before publishing new images: CI only proves they compile.
