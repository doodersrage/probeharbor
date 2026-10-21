/**
 * Dashboard → Devices → Thermostat tab: src/components/ThermostatConnectCard.astro and
 * src/components/IndoorReferenceCard.astro.
 */
const en = {
  indoor: {
    title: "Indoor reference",
    introHtml:
      "Pick a temperature probe to represent <strong>house</strong> indoor air when you do not have Nest connected, for example a hallway ESP32 or a reading pushed from Home Assistant (Ecobee, Honeywell, etc.). Overview and history charts use this for house–probe context.",
    saved: "Indoor reference saved.",
    sensorLabel: "Reference sensor",
    noneOption: "None, use thermostat only",
    optionLabel: "{label} ({device})",
    save: "Save",
    configured: "An indoor reference probe is configured for this household.",
    notSelected: "No indoor reference selected.",
    noOptionsHtml:
      'Add a temperature sensor first, for example push from Home Assistant with <code class="text-xs">thermaltrace.push</code> or an ESP in the hallway. See <a class="text-link" href="/integrations/home-assistant#indoor-temperature">HA indoor temperature guide</a>.',
  },
  thermostat: {
    title: "Thermostat",
    intro:
      "Connect your house thermostat to see its reading and setpoint next to this probe, and add that context to freeze alerts.",
    connected: "{provider} connected.",
    disconnected: "{provider} disconnected.",
    errors: {
      state_mismatch: "That connection attempt expired -- try again.",
      denied: "Connection was cancelled.",
      not_configured: "This provider isn't set up on this deployment yet.",
      exchange_failed: "Couldn't complete the connection -- try again.",
      save_failed: "Connected, but saving the connection failed -- try again.",
      generic: "Something went wrong connecting your thermostat.",
    },
    sdmDisabledHtml:
      "Nest connected, but the <strong>Smart Device Management API</strong> is not enabled in your Google Cloud project. Enable it in APIs &amp; Services, wait a minute, then refresh this page.",
    enableSdm: "Enable SDM API",
    readingUnavailable: "Reading unavailable",
    setTo: ", set to {temp}",
    modes: {
      heat: "Heat",
      cool: "Cool",
      heatcool: "Heatcool",
      off: "Off",
      auto: "Auto",
      auxheatonly: "Auxheatonly",
    } as Record<string, string>,
    noLiveReading: "Connected -- couldn't fetch a live reading right now.",
    notConnected: "Not connected",
    ecobeeClosedHtml:
      'Ecobee developer signups are closed: use <a class="text-link" href="/integrations/home-assistant#indoor-temperature">Home Assistant</a> to push indoor temp, then pick it under <a class="text-link" href="#indoor-reference">Indoor reference</a> above.',
    disconnect: "Disconnect",
    connect: "Connect",
    unavailable: "Unavailable",
    ownerOnly: "Owner/member only",
  },
};

export type DeviceSetupThermostatMessages = typeof en;
export default en;
