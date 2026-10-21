import type { AboutFaqItem } from "../../../lib/aboutFaqs";
import {
  FREEZE_TIME_CALCULATOR_TEXT,
  type FreezeTimeCalculatorText,
} from "../../../components/FreezeTimeCalculator";

/**
 * /freeze-time-calculator page copy plus the calculator island's strings
 * (`calculator`, passed as its `text` prop). Island templates use `{name}`
 * placeholders, filled in the browser.
 */

const en = {
  title: "Pipe freeze time calculator",
  description:
    "Enter two temperature readings and a freeze threshold to estimate how many hours a garage, crawlspace, or cabin has before it gets cold enough to freeze pipes.",
  breadcrumbHome: "Home",
  kicker: "Tool",
  heading: "How long until this space reaches freezing?",
  lede: "Read a thermometer in the space now, compare it with a reading from earlier, and see roughly how many hours are left before it reaches your freeze threshold at the current cooling rate.",
  startFree: "Start free",
  howLongLink: "How long pipes take to freeze",
  readingTitle: "Reading the result",
  readingIntro:
    "The estimate assumes the space keeps cooling at the rate you measured. Use it to decide how urgent tonight is: an hour or two means act now, a day or more means check again later.",
  readingLinksHtml:
    'Pipes on exterior walls and near doors run colder than the room, so measure as close to the pipe as you can. See <a class="text-link" href="/answers/garage-pipe-freeze-temperature">when garage pipes freeze</a>, <a class="text-link" href="/answers/freeze-alarm-temperature-setting">where to set a freeze alarm</a>, and <a class="text-link" href="/about/time-to-freeze">how the time-to-freeze clock works</a> in the dashboard.',
  sensorTitle: "Let a sensor do the arithmetic",
  sensorBody:
    "A probe on the pipe reports every few minutes, so the estimate updates on its own and an alert reaches you before the threshold. The free plan includes email alerts; bring an ESP32 probe or connect Home Assistant.",
  seeDemo: "See the live demo",
  faqs: [
    {
      question: "How does the calculator work?",
      answer:
        "It takes the cooling rate between your two readings and extends it in a straight line to your threshold. If the space fell 2°F in the last hour and is 10°F above the threshold, the estimate is five hours.",
    },
    {
      question: "How accurate is the estimate?",
      answer:
        "It is a runway, not a stopwatch. A space cools more slowly as it nears the outdoor temperature and faster if the wind picks up or a door opens, so redo it with fresh readings every hour or so.",
    },
    {
      question: "What threshold should I use?",
      answer:
        "34–38°F measured at the pipe. Reaching the threshold does not mean the pipe has frozen; it means there is still time to restore heat, close a door, or open a faucet.",
    },
    {
      question: "Can this run automatically?",
      answer:
        "Yes. ProbeHarbor does the same calculation continuously from your sensor's readings on every plan and shows it as a time-to-freeze clock, with an alert when the space reaches your threshold.",
    },
  ] as AboutFaqItem[],
  calculator: FREEZE_TIME_CALCULATOR_TEXT as FreezeTimeCalculatorText,
};

export type FreezeTimeCalculatorMessages = typeof en;
export default en;
