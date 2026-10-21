
/** /about/historical-data body copy. `*Html` keys are trusted inline HTML (English hrefs). */

const en = {
  introHtml:
    "Live readings answer “what is happening now?” Historical data answers “what usually happens here?” ProbeHarbor stores sensor readings from push ingest and pull feeds, collected on a <strong>15-minute</strong> schedule (and whenever you refresh Live).",
  whyTitle: "Why keep history at all",
  whyHtml:
    "Spot checks are easy to forget. A timestamped record reveals overnight minimums during a cold week, slow humidity creep after a roof leak, or the first day spring warmth stays above freezing inside. That context supports insurance documentation, HVAC tuning, and deciding whether insulation upgrades paid off.",
  storedTitle: "What gets stored",
  storedHtml:
    "Each saved row includes Fahrenheit and Celsius temperatures, humidity percentage, timestamp, feed name, probe label, and probe key. Multiple probes from one load create multiple rows, while the configured average still captures a quick summary. Data is associated with your account so guests do not write to the shared history table.",
  browseTitle: "Browsing paginated history",
  browseHtml:
    "The dashboard history view lists recent snapshots with feed and probe columns so you can filter mentally by zone. Pagination keeps large datasets responsive. When you need the full record outside the website, CSV export downloads every stored reading for your account: available to admins and active subscribers.",
  csvTitle: "CSV export workflows",
  csvItems: [
    "Import into spreadsheets for pivot tables and custom charts.",
    "Join with utility bills or weather archives for correlation studies.",
    "Share anonymized excerpts with contractors when diagnosing insulation issues.",
    "Archive yearly files for long-term property records.",
  ],
  analysisTitle: "Analysis ideas",
  analysisHtml:
    "Plot daily minimum temperature through December to find how often you approach pipe-freeze risk. Compare average humidity before and after installing a dehumidifier. Overlay probe <code>0</code> versus <code>1</code> to quantify wall-to-wall differences. Because keys are stable in JSON feeds, scripts you write today still work after you rename display labels in the dashboard.",
  yoyTitle: "Year-over-year comparisons",
  yoyHtml:
    "<strong>Overview</strong> shows <em>This week vs last year</em> when you have probe data from the same window one year ago. On <strong>History</strong> (Pro, 365+ days retention), enable <strong>Compare to last year</strong> for a gray overlay on the chart. When you do not yet have local probe data from last year, ProbeHarbor can show an <strong>outdoor estimate</strong> from Open-Meteo at your weather or freeze-map location: clearly labeled, not a substitute for your probe history.",
  limitsTitle: "Limits and good practices",
  limitsHtml:
    "History depth depends on your plan (Free vs Member vs Pro). For minute-by-minute forensic work, add a dedicated logger locally. Treat this store as a convenient, account-backed journal rather than a laboratory instrument.",
  outroHtml:
    'Subscription details for CSV export are covered in <a class="text-link" href="/about/accounts-and-dashboard">accounts and dashboard tools</a>.',
};

export type Messages = typeof en;
export default en;
