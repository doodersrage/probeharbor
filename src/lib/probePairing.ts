/**
 * A probe's temperature and humidity can arrive under one key (pull feeds:
 * "0" for both kinds) or under prefixed keys (push: "temp1" + "humidity1").
 * This reduces either form to the shared part so the two can be paired.
 * Only use it to look up humidity for a temperature sensor; temperature
 * sensors keep their full key so two of them never collapse into one.
 */
export function probePairingKey(sensorKey: string): string {
  return sensorKey.replace(/^(temperature|temp|humidity|hum|rh)[_-]?/i, "");
}
