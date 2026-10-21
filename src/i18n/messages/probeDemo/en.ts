import { PROBE_DEMO_TEXT_EN, type ProbeDemoText } from "../../../components/ProbeDemo";

/**
 * Strings for the ProbeDemo island (passed as its `text` prop). Plain data only:
 * `{name}` placeholders are filled in the island. English keeps the preset,
 * space and status copy from `lib/probeDemo` / `lib/garageRiskStatus`.
 * Translations show °C first with °F in parentheses; the simulator itself runs in °F.
 */

const en: ProbeDemoText = PROBE_DEMO_TEXT_EN;

export type ProbeDemoMessages = typeof en;
export default en;
