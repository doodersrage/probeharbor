# Home Assistant community post (draft)

Copy/paste into a new topic on [community.home-assistant.io](https://community.home-assistant.io/) in **Share your Projects** or **Third party integrations**.

---

**Title:** ProbeHarbor — freeze and leak monitoring for garages, workshops & crawlspaces (official HACS integration)

**Tags:** `custom-component` `integration` `sensor` `freeze` `leak` `garage`

---

Hi all. I built [ProbeHarbor](https://probeharbor.dev), a hosted dashboard for ESP/Arduino probes in garages, workshops, attics, and crawlspaces: freeze and leak alerts, history, and household sharing. The integration is now in the **default HACS store**, so I wanted to share it here.

The reason it exists: a Home Assistant automation can't warn you about the power cut or internet outage that takes Home Assistant offline, and that's often the same event that lets a garage or crawlspace get cold. ProbeHarbor sends the alert from off-site, including when your readings stop arriving.

### What it does

- Polls a **share link** (`GET /api/share/{token}/readings`) — Free includes one family live link; Pro adds history/metrics scopes — and creates temperature, humidity, door, leak, and other entities automatically
- Optional **inbound webhook** services: `thermaltrace.snooze`, `thermaltrace.vacation`, `thermaltrace.clear_snooze`, `thermaltrace.clear_vacation`, `thermaltrace.status`
- Optional **push** service to POST readings from HA automations
- Designed to **dual-run with MQTT** — keep Mosquitto on your LAN; use ProbeHarbor for off-site SMS/history

### Install

1. Open HACS, search for **ProbeHarbor**, and select **Download**
2. Restart Home Assistant
3. Create a **family live** share link at [probeharbor.dev](https://probeharbor.dev) (Free includes one; Pro adds broader scopes)
4. Settings → Devices & services → Add integration → ProbeHarbor → paste token

Full guide: https://probeharbor.dev/integrations/home-assistant

### Beyond HACS (optional)

- **Indoor reference via HA** — push `climate.*` current temperature on a schedule, then select it under Dashboard → Devices → Indoor reference (works when Ecobee developer signups are closed)
- **MQTT → HTTP bridge** — mirror Mosquitto to ProbeHarbor without exposing your broker: [MQTT bridge docs](https://doodersrage.github.io/probeharbor/integrations/mqtt-bridge) · import [Node-RED flow](https://probeharbor.dev/nodered/mqtt-to-probeharbor.json) (temp + garage door tabs)
- **ESPHome / Shelly** — push ingest recipes if you do not want HA in the middle: https://probeharbor.dev/about/esphome-shelly-recipes
- **Garage door + cold alerts** — combined rule when a bay door is open while temps drop: https://probeharbor.dev/about/garage-door-cold-playbook

### Example automation

Snooze freeze and leak alerts while the garage door is open for maintenance:

```yaml
automation:
  - alias: Snooze ProbeHarbor while garage door open
    trigger:
      - platform: state
        entity_id: binary_sensor.garage_door
        to: "on"
    action:
      - service: thermaltrace.snooze
        data:
          hours: 4
```

### Links

- HACS repo: https://github.com/doodersrage/probeharbor-home-assistant
- Product + docs: https://probeharbor.dev/integrations/home-assistant
- Integrations hub: https://probeharbor.dev/integrations
- OpenAPI: https://probeharbor.dev/openapi.yaml

The free plan covers two devices with email, push, and chat alerts; SMS is on Pro. The server code is public on GitHub (source-available, FSL-1.1) and the firmware and sketches are MIT.

Happy to answer setup questions in this thread. If you try it, I'd love feedback on entity naming and poll interval defaults.

---

*Note for maintainers:* the integration was merged into the default HACS store on 2026-11-09 ([hacs/default#11756](https://github.com/hacs/default/pull/11756)). The integration's domain is still `thermaltrace`, so services are `thermaltrace.*`.
