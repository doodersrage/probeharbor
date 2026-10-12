/**
 * Where thermostat connect/disconnect flows land: the Nest/Ecobee card itself
 * (Devices → Thermostat tab), not the bare Devices URL, which opens the
 * status view once any device reports.
 */
export const THERMOSTAT_CARD_PATH = "/dashboard/devices?view=setup&tab=thermostat";
const THERMOSTAT_CARD_ANCHOR = "#thermostat-connect";

export function thermostatReturnUrl(params: Record<string, string> = {}): string {
  const query = new URLSearchParams(params).toString();
  return `${THERMOSTAT_CARD_PATH}${query ? `&${query}` : ""}${THERMOSTAT_CARD_ANCHOR}`;
}
