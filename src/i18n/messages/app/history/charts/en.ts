import { HISTORY_CHART_UI_EN } from "../../../../../components/HistoryChart";
import { FREEZE_HOURS_CHART_TEXT_EN } from "../../../../../components/FreezeHoursChart";
import { PROBE_SPREAD_CHART_TEXT_EN } from "../../../../../components/ProbeSpreadChart";
import { INDOOR_OUTDOOR_CHART_TEXT_EN } from "../../../../../components/IndoorOutdoorChart";

/**
 * Dashboard → History chart islands. Resolved on the server and passed as
 * each island's `text` prop (`ui` for HistoryChart). English lives next to
 * each component as its default.
 */
const en = {
  history: HISTORY_CHART_UI_EN,
  freezeHours: FREEZE_HOURS_CHART_TEXT_EN,
  probeSpread: PROBE_SPREAD_CHART_TEXT_EN,
  indoorOutdoor: INDOOR_OUTDOOR_CHART_TEXT_EN,
};

export type AppHistoryChartsMessages = typeof en;
export default en;
