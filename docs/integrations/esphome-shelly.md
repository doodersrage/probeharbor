---
description: "Push ESPHome temperature and humidity and Shelly door-contact events to ProbeHarbor over HTTPS, with copy-paste ESPHome YAML."
---

# ESPHome & Shelly → ProbeHarbor

ProbeHarbor does not ship ESPHome or Shelly components. Use HTTPS **push ingest** from firmware you already run on the LAN.

## Prerequisites

1. **Dashboard → Devices** → create a push device and copy the ingest URL  
   (`POST https://probeharbor.dev/api/ingest/<device-key>`).
2. Map sensor keys under Devices after the first POST arrives.

Typed payload reference: [Ingest on probeharbor.dev](https://probeharbor.dev/about/ingest-and-webhooks).

## ESPHome (temperature + humidity)

Add to `secrets.yaml`:

```yaml
probeharbor_ingest_url: "https://probeharbor.dev/api/ingest/YOUR_DEVICE_KEY"
```

Minimal `garage.yaml` sketch:

```yaml
esphome:
  name: garage-probe

http_request:
  id: http_req
  verify_ssl: true
  timeout: 10s

sensor:
  - platform: dht
    pin: GPIO4
    model: DHT22
    temperature:
      id: garage_temp_c
    humidity:
      id: garage_rh
    update_interval: 60s

interval:
  - interval: 60s
    then:
      - http_request.post:
          url: !secret probeharbor_ingest_url
          request_headers:
            Content-Type: application/json
          body: !lambda |-
            char buf[280];
            snprintf(buf, sizeof(buf),
              "{\"sensors\":["
              "{\"key\":\"garage_temp\",\"kind\":\"temperature\",\"value\":%.1f,\"unit\":\"F\"},"
              "{\"key\":\"garage_rh\",\"kind\":\"humidity\",\"value\":%.0f,\"unit\":\"%%\"}"
              "]}",
              id(garage_temp_c).state * 9.0f / 5.0f + 32.0f,
              id(garage_rh).state);
            return std::string(buf);
```

Map `garage_temp` and `garage_rh` in the dashboard after the first successful POST.

## Shelly (door contact)

On Shelly Plus / Gen2, use an **HTTP request** action when the door input changes. POST:

```json
{
  "sensors": [
    { "key": "garage_door", "kind": "door", "bool": true }
  ]
}
```

Use `false` when the door closes. Map `garage_door` as a door sensor in Devices.

## Alert rule: door open while cold

Dashboard → **Alerts → Rules** → add a rule with **all** of:

- Door open (or door open longer than N minutes)
- Temperature below threshold

Product walkthrough: [Garage door + cold playbook](https://probeharbor.dev/about/garage-door-cold-playbook).

## Dual-run with Home Assistant

Keep ESPHome or Shelly on MQTT locally and mirror to ProbeHarbor for hosted freeze SMS and history. See [MQTT bridge](./mqtt-bridge.md) or the [HACS integration](https://probeharbor.dev/integrations/home-assistant).
