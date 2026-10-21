import type { AboutFaqItem } from "../../../lib/aboutFaqs";
import {
  PIPE_FREEZE_FORECAST_TEXT,
  type PipeFreezeForecastText,
} from "../../../components/PipeFreezeForecast";

/**
 * /pipe-freeze-forecast page copy plus the forecast island's strings
 * (`tool`, passed as its `text` prop). Island templates use `{name}`
 * placeholders, filled in the browser with temperatures in the visitor's unit.
 */

const en = {
  title: "Will my pipes freeze tonight? Pipe freeze forecast",
  description:
    "Enter a US city or ZIP to see the next five nights' lows, hours below freezing, and pipe freeze risk for unheated garages, crawlspaces, and attics.",
  appName: "Pipe freeze forecast",
  breadcrumbHome: "Home",
  breadcrumb: "Pipe freeze forecast",
  kicker: "Free tool",
  heading: "Will my pipes freeze tonight?",
  lede: "Check the next five nights for your area: the low, how many hours it stays below freezing, wind, and whether pipes in an unheated garage, crawlspace, or attic are at risk.",
  getAlerts: "Get free freeze alerts by email",
  whenGaragePipes: "When garage pipes freeze",
  alertsConfirmed: "Freeze alerts are on. We'll email you the afternoon before a freezing night.",
  alertsInvalid: "That confirmation link isn't valid anymore. Look up your area below and sign up again.",
  levelsTitle: "How to read the risk levels",
  levelsHtml: [
    "<strong>High risk:</strong> the outdoor low is 20°F or colder, the commonly cited point where pipes in unheated spaces freeze.",
    "<strong>Watch:</strong> below freezing but above 20°F. Exposed pipes can still freeze on a long or windy night.",
    "<strong>Low risk:</strong> the night stays above freezing.",
  ],
  levelsActionHtml:
    'On a High or Watch night: open cabinet doors on exterior walls, keep the garage door shut, let a faucet on an exposed line drip, and know where your main shutoff is. See <a class="text-link" href="/answers/drip-faucets-to-prevent-frozen-pipes">whether dripping faucets helps</a>, <a class="text-link" href="/answers/how-long-for-pipes-to-freeze">how long pipes take to freeze</a>, and the <a class="text-link" href="/freeze-time-calculator">freeze time calculator</a> if you have a thermometer in the space.',
  insideTitle: "The forecast is outdoors. Your pipes are inside.",
  insideBody:
    "A probe next to the pipe tells you what the space is actually doing and alerts you before it reaches freezing, while there is still time to act. The free plan includes email alerts; use an ESP32 probe (about $25 in parts) or sensors you already have in Home Assistant.",
  startFree: "Start free",
  kitParts: "ESP32 freeze kit parts",
  sourcesTitle: "Sources",
  sourceKxan: "At what temperature do pipes freeze? (KXAN, citing University of Illinois research)",
  sourceFarmBureau: "How pipes freeze and burst (Farm Bureau Insurance)",
  sourceNws: "National Weather Service API",
  sourceNwsNote: ": hourly forecast data",
  faqs: [
    {
      question: "At what outdoor temperature do pipes freeze?",
      answer:
        "Water freezes at 32°F, but pipes inside a building usually need colder air outside before they freeze. Research from the University of Illinois, widely cited by insurers, puts the danger point for pipes in unheated spaces at an outdoor temperature of about 20°F. That is why this forecast marks nights at or below 20°F as high risk.",
    },
    {
      question: "Can pipes freeze when the low is above 20°F?",
      answer:
        "Yes. A long night below 32°F can freeze a pipe that is uninsulated, on an exterior wall, near a garage door, or in a vented crawlspace, especially with wind. Nights between 21°F and 32°F are marked Watch for that reason.",
    },
    {
      question: "Why does wind matter?",
      answer:
        "Moving air strips heat from a pipe much faster than still air, so pipes near vents, door gaps, and cracks in exterior walls freeze first. The forecast calls out wind of 15 mph or more during freezing hours.",
    },
    {
      question: "Does this tell me how cold my garage will get?",
      answer:
        "No. It forecasts outdoor air. An attached or insulated garage can stay well above the outdoor low, and a drafty one can get almost as cold. The only way to know is a thermometer near the pipes, ideally one that alerts you before they reach freezing.",
    },
    {
      question: "Where does the forecast come from?",
      answer:
        "The National Weather Service hourly forecast for your location, refreshed about every 30 minutes. It covers the United States and its territories.",
    },
  ] as AboutFaqItem[],
  tool: PIPE_FREEZE_FORECAST_TEXT as PipeFreezeForecastText,
};

export type PipeForecastMessages = typeof en;
export default en;
