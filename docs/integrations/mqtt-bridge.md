---
description: "Mirror MQTT readings from Mosquitto or Home Assistant to ProbeHarbor over HTTPS for cloud freeze alerts and history, no broker required."
---

# MQTT → ProbeHarbor bridge

ProbeHarbor does **not** run an MQTT broker. Keep Mosquitto / Home Assistant MQTT on your LAN, then mirror readings to cloud alerts and history over HTTPS.

## Endpoint

```http
POST https://probeharbor.dev/api/ingest/mqtt
X-Ingest-Key: <device-key>
Content-Type: application/json
```

Accepted bodies:

```json
{ "topic": "home/garage/temp", "payload": "{\"temp1\":42.5,\"humidity\":38}" }
```

```json
{ "topic": "home/garage/temp", "message": { "temp1": 42.5, "humidity": 38 } }
```

The Worker unwraps `payload` / `message` and forwards into the same path as `POST /api/ingest/<key>`. Map those JSON keys under **Dashboard → Devices**.

## Home Assistant (MQTT trigger → HTTP)

For automatic entities without YAML, use the [official HACS integration](https://github.com/doodersrage/probeharbor-home-assistant) ([product guide](https://probeharbor.dev/integrations/home-assistant)).

Manual MQTT → HTTP bridge:

1. Create a push device and copy the ingest key.
2. Map sensor keys to match your MQTT JSON.  
3. Automation sketch:

```yaml
alias: ProbeHarbor MQTT bridge
trigger:
  - platform: mqtt
    topic: home/garage/temp
action:
  - service: rest_command.probeharbor_ingest
```

```yaml
# configuration.yaml
rest_command:
  probeharbor_ingest:
    url: "https://probeharbor.dev/api/ingest/mqtt"
    method: POST
    headers:
      Content-Type: application/json
      X-Ingest-Key: !secret probeharbor_ingest_key
    payload: >
      {"topic":"{{ trigger.topic }}","payload":{{ trigger.payload }}}
```

Put `probeharbor_ingest_key` in `secrets.yaml`. If your MQTT payload is already a JSON object string, the bridge parses it; if it is a bare number, wrap it in Node-RED or a template first.

## Node-RED

Import [`/nodered/mqtt-to-probeharbor.json`](https://probeharbor.dev/nodered/mqtt-to-probeharbor.json) — includes **temperature** and optional **garage door** tabs:

1. Set your Mosquitto broker on the **mqtt in** node.  
2. Set env `PROBEHARBOR_INGEST_KEY` (or edit the function node).  
3. Confirm the topic matches your ESP publish path.  
4. Deploy and watch the debug node for HTTP `200`.

## Dual-run tip

Keep local automations on MQTT. Use ProbeHarbor for household freeze and leak SMS/email, history, and share links—without exposing the broker to the internet.

Product walkthrough: [Adding devices](https://probeharbor.dev/about/adding-devices#mqtt-bridge) · Compare: [vs DIY MQTT](https://probeharbor.dev/compare/diy-mqtt)
