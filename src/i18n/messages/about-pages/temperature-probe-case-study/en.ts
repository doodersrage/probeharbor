
/** Body copy for /about/temperature-probe-case-study. Hrefs stay English; middleware localizes them. */
const FIRMWARE_LINK =
  '<a class="text-link" target="_blank" rel="noreferrer" href="https://github.com/doodersrage/arduino-network-json-temperature-sever">arduino-network-json-temperature-sever</a>';

const en = {
  heroAlt:
    "Second revision garage temperature probe controller with Ethernet connectivity and multiple sensor inputs",
  heroCaption: "Revision two of the ProbeHarbor probe board. Ethernet, LCD, and dual DHT22 inputs.",
  intro:
    "This case study follows the temperature probe build that powers ProbeHarbor: why a single outdoor thermometer was not enough, how two DHT22 zones plus an averaged summary were chosen, and what changed between the first breadboard deployment and the network-connected revision now serving live JSON to this website.",
  challengeTitle: "The challenge",
  challenge: [
    "The goal was practical, not academic: know whether an attached garage was approaching freeze risk, whether humidity was creeping high enough to rust tools, and whether conditions differed near the door versus the back wall. Consumer weather apps only report outside air at the nearest station, which can differ by ten degrees or more from an insulated garage interior on a sunny winter afternoon.",
    "A single sensor would have hidden the gradients that matter. Opening the overhead door, parking a warm vehicle, or afternoon sun on a west-facing wall all move different parts of the space at different speeds. The case for multiple probes was clear before the first wire was soldered.",
  ],
  environmentTitle: "The environment",
  environment:
    "The monitored space is a typical attached garage: one large overhead door, concrete slab floor, limited insulation compared to living space, and seasonal swings driven as much by sun load and infiltration as by outdoor temperature. In summer, the door-facing zone runs hotter; in winter, the slab and north wall lag outdoor lows by hours.",
  zonesHtml: [
    "<strong>North wall zone:</strong> Slower to change; useful for overnight low trends.",
    "<strong>Door zone:</strong> Spikes when the door opens; flags rapid infiltration.",
    "<strong>Workbench area:</strong> Represents where work actually happens at shoulder height.",
  ],
  demoHtml:
    'The <a class="text-link" href="/about/probe-demo">interactive probe demo</a> models these three zones so you can see how sun load and door state pull readings apart without installing hardware.',
  approachTitle: "Approach and hardware",
  approachHtml: [
    "Each probe uses a DHT22 digital humidity–temperature sensor on a short cable from an Arduino Uno. The firmware reads both sensors on a timer, retries transient bus errors, computes an <code>avg</code> across healthy probes, and serves compact JSON over the local network via an Ethernet shield. A 16×2 LCD on the board shows live values for on-site checks without a laptop.",
    'Placement followed the rules in the <a class="text-link" href="/about/temperature-probes">temperature probes guide</a>: away from direct sun patches and exhaust fans, roughly shoulder height, with ventilated mounting so air could move past the sensor head. Labels in the dashboard map JSON keys <code>0</code> and <code>1</code> to human-readable zone names.',
  ],
  rev1Alt: "First revision probe board on a breadboard with DHT22 sensors and LCD",
  rev1Caption: "Revision one validated wiring, read intervals, and JSON shape on the bench before garage mounting.",
  timelineTitle: "Build timeline",
  timelineHtml: [
    "<strong>Bench bring-up:</strong> Serial logging confirmed DHT22 reads, LCD formatting, and stable <code>temp</code> JSON keys before the board left the desk.",
    "<strong>Revision one in the garage:</strong> Proved multi-probe gradients were real: the door zone routinely diverged from the north wall on commute schedules.",
    "<strong>Network JSON feed:</strong> Ethernet removed the need to carry a laptop for every check; the site could fetch the same document the LCD already displayed.",
    "<strong>Revision two:</strong> Cleaner stacking of the Ethernet shield, refined probe headers, and watchdog-friendly reboot logic for rare network hangs.",
    "<strong>Website integration:</strong> Astro pages map feeds to cards; signed-in history stores snapshots for trend review and CSV export.",
  ],
  dataTitle: "What the data showed",
  dataLede: "After a full winter and summer cycle, the probes paid off in ways a single reading would have missed:",
  data: [
    "Door-adjacent temperature could swing 8–12 °F within minutes of opening the overhead door while the back wall moved modestly.",
    "Overnight lows near the north wall tracked freeze risk more reliably than outdoor forecasts alone.",
    "Humidity rose after sustained cold spells when the slab was slow to warm: useful for deciding when to run a dehumidifier.",
    "The computed average smoothed noise for history charts while per-probe cards on the home page preserved zone detail.",
  ],
  flowHtml:
    'Readings flow from probe to dashboard along the path documented in <a class="text-link" href="/about/data-flow">end-to-end data flow</a>. When TLS at the edge was needed, a <a class="text-link" href="/about/python-feeds">Python relay</a> cached upstream JSON without pushing that complexity onto the microcontroller.',
  lessonsTitle: "Lessons learned",
  lessonsHtml: [
    "<strong>Placement beats sensor cost:</strong> A well-mounted DHT22 outperformed a poorly placed premium sensor every time.",
    "<strong>Label zones in software:</strong> Stable JSON keys with dashboard labels kept firmware and website loosely coupled.",
    "<strong>Expect gaps:</strong> Reboots and network blips create short gaps: distinguish them from misconfiguration using the stale-reading guides.",
    "<strong>Build for iteration:</strong> Revision one on a breadboard saved a ladder trip when pin assignments changed.",
  ],
  relatedTitle: "Related reading",
  relatedHtml: `Continue with the <a class="text-link" href="/about/temperature-probes">temperature probes overview</a>, <a class="text-link" href="/about/arduino-sketches">Arduino sketches</a> guide, <a class="text-link" href="/about/temperature-changes">what causes readings to move</a>, and <a class="text-link" href="/about/historical-data">historical data usage</a> on the dashboard. Firmware source: ${FIRMWARE_LINK}.`,
};

export type Messages = typeof en;
export default en;
