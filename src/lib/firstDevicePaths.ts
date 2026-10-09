/**
 * First-device paths on Devices → Setup. People who already run Home
 * Assistant, ESPHome, or an MQTT broker have sensors today; they need a
 * snippet with their real ingest URL, not a parts list.
 */
export type SetupVia = "esp" | "ha" | "esphome" | "mqtt";

export const SETUP_VIA_DEVICE_NAMES: Record<SetupVia, string> = {
  esp: "Workshop probe",
  ha: "Home Assistant",
  esphome: "ESPHome node",
  mqtt: "MQTT bridge",
};

export function parseSetupVia(raw: string | null | undefined): SetupVia | null {
  return raw === "esp" || raw === "ha" || raw === "esphome" || raw === "mqtt" ? raw : null;
}

/**
 * rest_command + automation that pushes an HA temperature (and optional
 * humidity) sensor every 5 minutes. Flat ingest keys are read as °F, so a
 * °C sensor is converted in the template.
 */
export function buildHomeAssistantPushYaml(ingestUrl: string): string {
  return `# configuration.yaml: replace sensor.garage_* with your entity ids
rest_command:
  probeharbor_push:
    url: "${ingestUrl}"
    method: POST
    content_type: "application/json"
    payload: >-
      {% set t = states('sensor.garage_temperature') | float(none) %}
      {% if t is not none and state_attr('sensor.garage_temperature', 'unit_of_measurement') == '°C' %}
      {% set t = t * 9 / 5 + 32 %}
      {% endif %}
      {"temp1": {{ t | tojson }}, "humidity1": {{ states('sensor.garage_humidity') | float(none) | tojson }}}

# automations.yaml
- alias: Send garage readings to ProbeHarbor
  triggers:
    - trigger: time_pattern
      minutes: "/5"
  actions:
    - action: rest_command.probeharbor_push`;
}

/** Node-RED / relay payload for the MQTT-over-HTTP bridge. */
export function buildMqttBridgeCurl(origin: string, ingestKey: string): string {
  return `curl -X POST "${origin}/api/ingest/mqtt" \\
  -H "X-Ingest-Key: ${ingestKey}" \\
  -H "Content-Type: application/json" \\
  -d '{"topic":"garage/sensor","payload":"{\\"temp1\\":42.5,\\"humidity1\\":55}"}'`;
}
