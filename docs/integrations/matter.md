---
description: "Expose ProbeHarbor sensors to Apple Home, Google Home, and Alexa through the Matterbridge plugin on a Raspberry Pi or other LAN host."
---

# Matter / Apple Home

ProbeHarbor ships a **[Matterbridge plugin](https://github.com/doodersrage/probeharbor-matter)** that polls a family live share link and exposes sensors to Apple Home, Google Home, Alexa, and other Matter controllers.

Product landing page: [probeharbor.dev/integrations/matter](https://probeharbor.dev/integrations/matter).

## Important constraints

- **Not CSA-certified.** DIY companion for households that already use ProbeHarbor.
- **Runs on a LAN host** (Raspberry Pi, NAS, always-on PC). Matter pairing needs mDNS; this does **not** run on Cloudflare Workers.
- **Not a probe.** ESP/Arduino (or HTTPS feeds) push readings; the plugin only mirrors the share JSON.

## Tested with

| Controller | Status |
| --- | --- |
| Google Home | **Works** (2026-11-06): plugin 0.1.0 on Matterbridge 3.11.1 (Docker). 13 sensors paired and online: temperature, humidity, and a door contact, from push devices (ESP32-S3, ESP32-C3) and pull feeds |
| Apple Home | Not yet tested |
| Alexa | Not yet tested |

Leak, power, and motion sensors haven't been checked through a controller yet.

## Install

1. Install [Matterbridge](https://matterbridge.io/)
2. Clone `https://github.com/doodersrage/probeharbor-matter`, `npm install && npm run build`, then `matterbridge --add .`
3. Create a **family live** share link under Dashboard → Share (Free includes one)
4. Paste the token into plugin config (`host` defaults to `https://probeharbor.dev`)
5. Pair the Matterbridge QR code in Apple Home / Google Home / Alexa

## API contract

| Direction | Endpoint | Notes |
| --- | --- | --- |
| Poll | `GET /api/share/{token}/readings` | Same JSON as HACS |
| Optional snooze | `POST /api/inbound/{token}` with `{"action":"snooze","hours":N}` | Pro; HMAC via `X-ProbeHarbor-Signature` |

Poll every 60–3600 seconds (default 120). Share readings allow ~60 req/min.

## Sensor map

| ProbeHarbor `kind` | Matter device |
| --- | --- |
| `temperature` | Temperature Sensor (°F → °C hundredths) |
| `humidity` | Humidity Sensor |
| `flood` | Water Leak Detector |
| `door` | Contact Sensor (open inverted to Matter closed semantics) |
| `power` | Contact Sensor |
| `motion` | Occupancy Sensor |

Skipped in v1: energy, level, air quality, time-to-freeze.

## Related

- [Home Assistant (HACS)](/integrations/home-assistant) — same share link, HA entities
- [Webhooks](/integrations/webhooks) — inbound signing details
- Plugin README: [probeharbor-matter](https://github.com/doodersrage/probeharbor-matter)
