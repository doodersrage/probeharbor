---
description: "Import the ready-made Node-RED flow that bridges MQTT sensor topics to ProbeHarbor push ingest, then set your key and deploy."
---

# Node-RED

Import the ready-made MQTT → HTTPS bridge flow:

- Product guide: [probeharbor.dev/integrations/node-red](https://probeharbor.dev/integrations/node-red)
- Flow JSON: [probeharbor.dev/nodered/mqtt-to-probeharbor.json](https://probeharbor.dev/nodered/mqtt-to-probeharbor.json)

## Steps

1. Create a push device and copy the ingest key  
2. Node-RED → Import → paste/upload the JSON  
3. Set `PROBEHARBOR_INGEST_KEY`  
4. Point MQTT nodes at Mosquitto; deploy  

Rate limit: ~1 POST/min. Optional garage-door tab included.

ProbeHarbor is **not** an MQTT broker. Full MQTT recipe: [MQTT bridge](/integrations/mqtt-bridge).
