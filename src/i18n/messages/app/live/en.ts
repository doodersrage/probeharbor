import { LIVE_TEMPS_PANEL_TEXT_EN, type LiveTempsPanelText } from "../../../../components/LiveTempsPanel";
import { WEATHER_PANEL_TEXT_EN, type WeatherPanelText } from "../../../../components/WeatherPanel";

/** Dashboard → Live (`src/pages/dashboard/live.astro`) and its islands. */
const en: {
  title: string;
  subtitle: string;
  hiddenTitle: string;
  hiddenBody: string;
  showBoth: string;
  openSettings: string;
  waitingTitle: string;
  waitingWithDevices: string;
  waitingNoDevices: string;
  openDevices: string;
  tryDemo: string;
  alertEssentials: string;
  probeSimulator: string;
  /** LiveTempsPanel island. */
  panel: LiveTempsPanelText;
  /** WeatherPanel island (same keys as `WeatherPanelText`). */
  weather: WeatherPanelText;
} = {
  title: "Live",
  subtitle: "Every probe’s current reading, plus outdoor weather.",
  hiddenTitle: "Live panels are hidden",
  hiddenBody: "Display preferences currently hide probe cards and weather.",
  showBoth: "Show probes + weather",
  openSettings: "Open settings",
  waitingTitle: "Waiting for a reading",
  waitingWithDevices:
    "POST JSON once (or fetch a pull feed) so probe cards appear here, then set freeze + email under Alerts.",
  waitingNoDevices:
    "Create a push device, try the demo feed, or open Devices to wire ingest — then confirm cards here.",
  openDevices: "Open Devices",
  tryDemo: "Try demo feed",
  alertEssentials: "Alert essentials",
  probeSimulator: "Probe simulator",
  panel: LIVE_TEMPS_PANEL_TEXT_EN,
  weather: WEATHER_PANEL_TEXT_EN,
};

export type LiveMessages = typeof en;
export default en;
