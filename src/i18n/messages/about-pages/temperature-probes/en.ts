
/** /about/temperature-probes body copy. `*Html` keys are trusted inline HTML (English hrefs). */

const en = {
  introHtml:
    'Temperature probes are the sensing layer of any environmental monitor. In a garage, workshop, attic, crawlspace, or shop, they translate physical heat and moisture into numbers the rest of the system can store, graph, and alert on. This project uses digital humidity–temperature sensors wired to an Arduino, with multiple probe channels so you can compare zones instead of trusting a single reading. For the full build story, read the <a class="text-link" href="/about/temperature-probe-case-study">temperature probe case study</a>.',
  measureTitle: "What probes measure in practice",
  measureHtml:
    "Each probe reports two values that matter for day-to-day decisions: air temperature and relative humidity. Temperature tells you whether pipes, paint, or stored goods are approaching risky limits. Humidity helps explain condensation on cold surfaces, rust on tools, and whether dehumidification is worth running overnight.",
  jsonHtml:
    "Probes in this build expose their readings through a JSON object keyed by probe index. <code>0</code>, <code>1</code>, and an computed <code>avg</code> across active sensors. That structure maps cleanly to dashboard labels such as “North wall” or “Workbench area.”",
  usesTitle: "Common probe uses in unheated spaces",
  uses: [
    "<strong>Freeze protection:</strong> Track overnight lows near exterior walls before plumbing is at risk.",
    "<strong>Seasonal comparison:</strong> Compare attic-adjacent zones with the floor level during summer heat.",
    "<strong>Equipment health:</strong> Watch humidity around metal tools, batteries, or paper storage.",
    "<strong>Work comfort:</strong> Validate whether insulation or ventilation changes actually help.",
    "<strong>Remote checks:</strong> Glance at live readings while away instead of guessing from outdoor weather alone.",
  ],
  placementTitle: "Placement matters more than sensor cost",
  placementHtml:
    "A probe near an uninsulated bay door will swing wildly every time the door opens. One on a north-facing wall may lag outdoor temperature by hours. For stable trends, mount probes away from direct sun patches, moving air from fans, and heat sources such as freezers or water heaters. Shoulder height (4–5 feet) usually represents the air volume people and stored items experience.",
  multipleTitle: "Why multiple probes beat one",
  multipleHtml:
    "Garages, workshops, and attics are not uniform boxes. A single sensor might read 45 °F near the floor while the ceiling bay is 58 °F on a sunny winter afternoon. Multiple probes reveal gradients, bad insulation spots, and which area represents the risk you care about. The firmware averages active probes so the history page still has one summary snapshot per load while preserving per-probe detail on the home page.",
  boardAlt: "ProbeHarbor probe controller board with Ethernet connectivity and DHT22 sensors",
  boardCaption: "Revision two of the ProbeHarbor probe board. Ethernet, LCD, and dual DHT22 inputs.",
  webTitle: "From probe wire to web page",
  webHtml:
    'Probes do not talk to the website directly. The Arduino sketch reads each sensor on a schedule, validates ranges, and publishes JSON over HTTPS. The site fetches that feed, maps keys to human labels you configure in the dashboard, and optionally saves readings when you are signed in. Try the <a class="text-link" href="/about/probe-demo">interactive probe demo</a> to see how multiple zones and averages behave, or read the <a class="text-link" href="/about/data-flow">end-to-end data flow</a> guide.',
};

export type Messages = typeof en;
export default en;
