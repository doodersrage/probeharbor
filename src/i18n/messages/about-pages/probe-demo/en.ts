
/** /about/probe-demo page copy (the simulator island's strings live in messages/probeDemo.ts). */

const en = {
  title: "Interactive probe demo",
  description:
    "Simulate multi-zone garage temperatures. Adjust outdoor air, sun, door state, and freeze threshold using the same logic as production.",
  breadcrumbHome: "Home",
  breadcrumbAbout: "About",
  kicker: "About · Simulator",
  ctaTryReal: "Want this for my garage?",
  ctaColdSnap: "Jump to cold snap",
  ctaKit: "ESP32 freeze kit",
  heroNoteHtml:
    'Cause the change: hit <strong>Door draft</strong> and watch the door/entry zone drop vs the workbench, or <strong>Cold snap</strong> for Overview-style freeze risk. Readings refresh every two seconds with sensor-like noise. Copy <strong>Push ingest</strong> JSON for the same flat keys an ESP would POST. Placement theory: <a class="text-link" href="/about/temperature-probes">temperature probes</a> and <a class="text-link" href="/about/temperature-changes">what drives swings</a>.',
  figureCaption:
    "Real workbench context, in the simulator above, the warmest zone is the workbench/tool-bench pocket. A probe only there can look fine while the door zone is already near freeze.",
  faqTitle: "Probe demo FAQ",
  paginationAria: "About section pages",
  prev: "Temperature probes guide",
  next: "Adding devices",
};

export type ProbeDemoPageMessages = typeof en;
export default en;
