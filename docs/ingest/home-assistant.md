---
description: "Send Home Assistant sensors to ProbeHarbor with the official HACS integration, HTTPS push ingest, the MQTT bridge, or share-link polling."
---

# Home Assistant integration

Install the official **[HACS custom integration](https://github.com/doodersrage/probeharbor-home-assistant)** for automatic entities, or wire manually below.

**Product page:** [probeharbor.dev/integrations/home-assistant](https://probeharbor.dev/integrations/home-assistant)

ProbeHarbor works with Home Assistant via **HTTPS push ingest** (recommended), the **MQTT-over-HTTP bridge**, **share-link polling**, or **inbound webhooks** for automations.

## Official HACS integration

1. Add custom repo in HACS: `https://github.com/doodersrage/probeharbor-home-assistant`
2. Install **ProbeHarbor**
3. Create a **live share link** under Dashboard → Share (Free includes one family live link; Pro adds history/metrics scopes)
4. Add integration in HA and paste the share token

Creates sensors and binary sensors automatically; optional inbound webhook + push ingest keys enable services (Pro).

## REST sensor (manual)

If you publish a [share link](https://probeharbor.dev/dashboard/share/links), expose readings as a REST sensor:

```yaml
sensor:
  - platform: rest
    resource: https://probeharbor.dev/api/share/YOUR_TOKEN/latest
    name: Garage temperature
    value_template: "{{ value_json.readings[0].value_num | float(0) }}"
    unit_of_measurement: "°F"
    scan_interval: 300
```

Adjust the template for your probe keys. Share links are read-only and safe to poll from HA.

## Push from ESPHome or HA → ProbeHarbor

Point ESPHome `http_request` or an HA `rest_command` at your device ingest URL, and call it on a schedule. Flat keys like `temp1` are read as °F, so convert °C sensors in the template:

```yaml
rest_command:
  probeharbor_push:
    url: "https://probeharbor.dev/api/ingest/YOUR_DEVICE_KEY"
    method: POST
    content_type: "application/json"
    payload: >-
      {% set t = states('sensor.garage_temperature') | float(none) %}
      {% if t is not none and state_attr('sensor.garage_temperature', 'unit_of_measurement') == '°C' %}
      {% set t = t * 9 / 5 + 32 %}
      {% endif %}
      {"temp1": {{ t | tojson }}, "humidity1": {{ states('sensor.garage_humidity') | float(none) | tojson }}}

automation:
  - alias: Send garage readings to ProbeHarbor
    triggers:
      - trigger: time_pattern
        minutes: "/5"
    actions:
      - action: rest_command.probeharbor_push
```

On **Dashboard → Devices → Setup**, choose **Home Assistant**: it creates the device and shows this snippet with your key filled in.

## MQTT bridge (keep Mosquitto local)

If probes already publish to Mosquitto, mirror selected topics over HTTPS:

```bash
curl -X POST https://probeharbor.dev/api/ingest/mqtt \
  -H "X-Ingest-Key: YOUR_DEVICE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"topic":"garage/temp","payload":"42.5"}'
```

See [MQTT bridge recipe](https://probeharbor.dev/about/adding-devices#mqtt-bridge) and the downloadable [Node-RED flow](https://probeharbor.dev/nodered/mqtt-to-probeharbor.json).

## Inbound webhooks (snooze, vacation, status)

Pro plans can call signed inbound webhooks from HA automations:

```yaml
automation:
  - alias: Snooze ProbeHarbor freeze alerts during door work
    trigger:
      - platform: state
        entity_id: cover.garage_door
        to: "open"
    action:
      - service: rest_command.probeharbor_snooze
```

Register the webhook URL and secret under **Dashboard → Alerts**. Full action list: `POST /api/webhooks/inbound` in [openapi.yaml](https://probeharbor.dev/openapi.yaml).

## Polling schedule

Pull feeds on ProbeHarbor are polled every **15 minutes** (`:00`, `:15`, `:30`, `:45` UTC). Push ingest updates live readings immediately. For near-real-time HA dashboards, push from HA or ESPHome rather than relying on pull.

## More

- [HACS integration](https://github.com/doodersrage/probeharbor-home-assistant)
- [Adding devices](https://probeharbor.dev/about/adding-devices)
- [HTTP API overview](https://probeharbor.dev/docs/api)
- [vs DIY MQTT stack](https://probeharbor.dev/compare/diy-mqtt)
