import { DEMO_TEMPS_TEXT_EN, type DemoTempsText } from "../../../components/DemoTempsPanel";
import { WEATHER_PANEL_TEXT_EN, type WeatherPanelText } from "../../../components/WeatherPanel";
import { DEMO_HISTORY_TEXT_EN, type DemoHistoryText } from "../../../components/DemoHistoryChart";
import { HISTORY_CHART_UI_EN, type HistoryChartUi } from "../../../components/HistoryChart";

/**
 * Strings for the live demo islands (DemoTempsPanel, WeatherPanel,
 * DemoHistoryChart). They're resolved on the server and passed as the `text`
 * prop (`ui` for the HistoryChart chrome inside DemoHistoryChart), so values
 * must be plain strings: `{name}` marks a placeholder.
 * English lives next to each component as its default.
 */
export type DemoIslandMessages = {
  temps: DemoTempsText;
  weather: WeatherPanelText;
  history: DemoHistoryText;
  chart: HistoryChartUi;
};

const en: DemoIslandMessages = {
  temps: DEMO_TEMPS_TEXT_EN,
  weather: WEATHER_PANEL_TEXT_EN,
  history: DEMO_HISTORY_TEXT_EN,
  chart: HISTORY_CHART_UI_EN,
};

export default en;
