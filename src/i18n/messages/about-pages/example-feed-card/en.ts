
/** ExampleFeedCard copy (also rendered on the English-only dashboard). */

const en = {
  title: "Example weather-based feed",
  introHtml:
    "Public HTTPS JSON driven by live outdoor weather: three simulated shop probes plus <code>avg</code>. Use it to test pull feeds before your hardware is online, or copy the push payload for curl smoke tests.",
  pullUrl: "Pull feed URL",
  openPull: "Open pull JSON",
  pushSample: "Push sample JSON",
  senml: "SenML JSON",
  setupDoc: "Setup document",
  mappingHtml:
    "Map probe keys <code>0</code>, <code>1</code>, <code>2</code>, and <code>avg</code> under JSON root <code>temp</code>, or use <code>?format=senml</code> / <code>?format=homeassistant</code> for industry-style JSON. Optional query params: <code>cityId</code>, <code>door=1</code>, <code>sun=80</code>.",
};

export type ExampleFeedCardMessages = typeof en;
export default en;
