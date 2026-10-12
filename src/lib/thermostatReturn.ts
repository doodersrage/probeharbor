/**
 * Where thermostat connect/disconnect flows land: the Nest/Ecobee card itself
 * (Devices → Setup → Pull feeds), not the bare Devices URL, which opens the
 * status view once any device reports.
 */
// view=all: the card is shown even before any device reports (view=setup hides it then).
export const THERMOSTAT_CARD_PATH = "/dashboard/devices?view=all&tab=pull";
const THERMOSTAT_CARD_ANCHOR = "#thermostat-connect";

export function thermostatReturnUrl(params: Record<string, string> = {}): string {
  const query = new URLSearchParams(params).toString();
  return `${THERMOSTAT_CARD_PATH}${query ? `&${query}` : ""}${THERMOSTAT_CARD_ANCHOR}`;
}
