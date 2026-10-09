---
description: "Use an Ambient Weather or WeatherFlow Tempest station as ProbeHarbor's outdoor source for freeze context at your actual address."
---

# Personal weather stations

Use your **Ambient Weather** or **WeatherFlow Tempest** station for outdoor context instead of a distant OpenWeather city.

## Product setup

1. Open [Dashboard → Settings](https://probeharbor.dev/dashboard/settings) on probeharbor.dev.
2. Under **Outdoor weather source**, choose Ambient or WeatherFlow.
3. Enter credentials and save.
4. Confirm the home weather card shows your station name.

Full guide: [Personal weather stations on probeharbor.dev](https://probeharbor.dev/about/personal-weather-stations)

## Ambient Weather

| Field | Where to find it |
|-------|------------------|
| MAC address | Ambient dashboard → your station |
| API key | ambientweather.net → Account → API keys |

**Operator:** set `AMBIENT_APPLICATION_KEY` in Cloudflare Worker secrets (developer application key from Ambient). Users store their personal API key in Settings.

## WeatherFlow Tempest

| Field | Where to find it |
|-------|------------------|
| Station ID | tempestwx.com → station settings |
| Personal access token | Settings → Data Authorizations |

## What uses outdoor weather

- Home weather card (signed-in)
- Indoor/outdoor delta on History
- Forecast freeze alerts (Member+)
- NWS freeze advisories (Pro)
- Cold-snap checklist on Overview

OpenWeather city remains the fallback if a personal station fetch fails. Forecast API calls still use OpenWeather at the station coordinates when lat/lon are available.

## Push ingest alternative

To store every sensor reading in ProbeHarbor history (not just the outdoor card), push via ingest instead:

- [ESPHome & Shelly](https://probeharbor.dev/about/esphome-shelly-recipes)
- [Node-RED MQTT flow](https://probeharbor.dev/nodered/mqtt-to-probeharbor.json)
- [Home Assistant HACS](https://probeharbor.dev/integrations/home-assistant)
