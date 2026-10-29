/**
 * A probe's temperature and humidity can arrive under one key (pull feeds:
 * "0" for both kinds), under prefixed keys (push: "temp1" + "humidity1"),
 * or under suffixed keys (ESPHome / Home Assistant style: "garage_temp" +
 * "garage_rh"). This reduces each form to the shared part so the two can
 * be paired. A suffix needs a separator ("_" or "-"), so names that merely
 * end in those letters are left alone.
 * Only use it to look up humidity for a temperature sensor; temperature
 * sensors keep their full key so two of them never collapse into one.
 */
const KIND_WORD = "(temperature|temp|humidity|hum|rh)";
const PREFIX = new RegExp(`^${KIND_WORD}[_-]?`, "i");
const SUFFIX = new RegExp(`[_-]${KIND_WORD}$`, "i");

export function probePairingKey(sensorKey: string): string {
  return sensorKey.replace(PREFIX, "").replace(SUFFIX, "");
}
