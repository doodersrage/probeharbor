/**
 * /freeze-map page copy. City data is stored in °F; temperatures arrive
 * pre-formatted in `{temp}` / `{delta}` (see `freezeMapTemp` in index.ts):
 * English shows °F as before, other locales °C first with °F in parentheses.
 * `client` strings go to the inline map/search scripts via define:vars.
 */
const en = {
  title: "Freeze-risk map",
  description:
    "See city-level freeze risk from ProbeHarbor probe households, then track your own unheated space for free. Opt-in, anonymized community map.",
  breadcrumbHome: "Home",
  breadcrumb: "Freeze map",
  kicker: "Community",
  lede: "See whether your metro’s indoor probes are running cold this week, then start tracking your own garage, crawlspace, or shop for free. City averages only; no addresses or device names.",
  optInHousehold: "Opt in from Household",
  optInStart: "Start free & opt in your city",
  signIn: "Sign in",
  embed: "Embed",
  freezeSeason: "Freeze season",
  shareKit: "Share kit",
  seedIntroHtml: "<strong>Showing sample data</strong>, live city readings appear once enough households opt in ({floor}+ probes per city).",
  optInNone: "No households have opted in yet: be the first in your metro.",
  optInCount: {
    one: "{count} household has opted in so far.",
    other: "{count} households have opted in so far.",
  },
  linkOptIn: "Opt in",
  linkCreate: "Create an account to contribute",
  liveNotice: {
    one: "Live opt-in aggregates · {count} household contributing · cities need {floor}+ samples to list by default",
    other: "Live opt-in aggregates · {count} households contributing · cities need {floor}+ samples to list by default",
  },
  lastSnapshot: " · Last snapshot {label}",
  liveOptOut: ". Opt out anytime under Household.",
  momentumTitle: "Momentum",
  momentumApproaching: "Cities closest to going live ({floor} households each). Your opt-in moves the count.",
  momentumWaiting: "Once a city reaches {floor} opted-in households with a live probe, sample preview for that metro is replaced by real readings.",
  householdsProgress: "{count}/{floor} households",
  moreToGo: {
    one: " · {count} more to go live",
    other: " · {count} more to go live",
  },
  noSparse:
    "No sparse live cities yet: the next opted-in metros will show up here as they approach the floor.",
  coldestTitle: "Coldest cities",
  coldestMin: "min {temp}",
  coldestAvg: " · avg {temp}",
  households: {
    one: "{count} household",
    other: "{count} households",
  },
  hideSparse: "Hide sparse cities (<{floor} households)",
  showSparse: "Show sparse cities",
  hiddenCount: {
    one: " ({count} hidden)",
    other: " ({count} hidden)",
  },
  mapTitle: "Map",
  mapSubtitle:
    "Pin color reflects freeze-risk share (green = low, red = high). Toggle OpenWeather temperature or precipitation under the layers control.",
  loadingMap: "Loading map…",
  noSamples: "No city samples yet",
  noSamplesFloor: " that meet the sample floor",
  noSamplesUser: " Be the first to opt in from your household settings.",
  noSamplesGuest: " Create an account and opt in from Household settings to contribute.",
  thCity: "City",
  thTrend: "Trend",
  thTrendUnit: "(avg °F)",
  thHouseholds: "Households",
  thAvg: "Avg °F",
  thMin: "Min °F",
  thRisk: "Freeze-risk share",
  thRiskNote: "% of households ≤34°F",
  sparse: "Sparse",
  needsSnapshots: "Needs more snapshots",
  riskOf: "({risk} of {total})",
  trendNoHistory: "No history yet",
  trendSteady: "Steady",
  /** `{delta}`: a temperature change (no 32° offset), see `freezeMapDelta`. */
  trendCooling: "Cooling {delta}",
  trendWarming: "Warming {delta}",
  tableNote:
    "Households = opted-in homes in that city for this snapshot. Freeze-risk share = households whose coldest probe was ≤34°F at capture. Trend is recent city average temperature across hourly snapshots.",
  findTitle: "Find your city",
  findSubtitle: "Search OpenWeather geocoding to see if your metro is on the map.",
  findUser: " Household owners opt in under Dashboard → Household.",
  findGuest: " Sign in to opt your household in.",
  searchLabel: "City search",
  searchPlaceholder: "Asheville, NC",
  embedTitle: "Embed & badge",
  embedLedeHtml:
    'Drop the map on a blog, Home Assistant dashboard, or README. Compact embed: <a class="text-link" href="/embed/freeze-map?compact=1">/embed/freeze-map?compact=1</a>.',
  embedCode: "Embed code",
  copyEmbed: "Copy embed",
  badgeLabel: "Markdown badge",
  copyBadge: "Copy badge",
  faqLede: "How the public map works and what stays private.",
  client: {
    layerMap: "Map",
    layerTemperature: "Temperature",
    layerPrecipitation: "Precipitation",
    popupAvg: "Avg",
    popupRisk: "Risk",
    popupHouseholds: "households",
    searchFailed: "Search failed.",
    copied: "Copied!",
    copyFailed: "Copy failed",
  },
};

export type FreezeMapMessages = typeof en;
export default en;
