/**
 * Dashboard → Devices → Pull feeds tab (src/components/dashboard/PullFeedsPanel.astro,
 * TempFeedsSettings.astro) and its islands (PullProbeMapper, PullFeedSaveBar,
 * PullFetchButton, FeedTestButton, DemoPullQuickStart).
 */
const en = {
  title: "Pull JSON feeds",
  subtitle:
    "HTTPS JSON we fetch on a schedule. Probe keys auto-import when you save: rename below if needed.",
  exampleSummary: "No feed of your own yet? Try the example feed",
  viewOnly: "View-only access: feed and probe settings are hidden.",
  feeds: {
    heading: "Feed URLs",
    introHtml:
      'HTTPS JSON endpoints we pull on a schedule. Probe objects live under a root key (default <code>temp</code>). <a class="text-link" href="/about/json-probe-output-schema">schema docs</a>.',
    selectAll: "Select all",
    enable: "Enable",
    disable: "Disable",
    deleteSelected: "Delete selected",
    selectFeed: "Select {name}",
    name: "Name",
    namePlaceholder: "Workshop",
    url: "HTTPS URL",
    jsonRoot: "JSON root key",
    jsonRootTitle:
      "Letter or underscore, then letters, numbers, or underscores",
    jsonRootHintHtml:
      "Object that holds probe keys (usually <code>temp</code>).",
    enabled: "Enabled",
    delete: "Delete",
    deleteConfirm: "Delete this feed?",
    addFeed: "Add a pull feed",
  },
  /** Browser strings for the bulk-delete script in TempFeedsSettings. */
  client: {
    bulkDeleteConfirm: {
      one: "Delete {count} feed? This cannot be undone.",
      other: "Delete {count} feeds? This cannot be undone.",
    },
  },
  feedTest: {
    enterUrl: "Enter a feed URL first.",
    ok: "Feed OK",
    failed: "Feed test failed",
    unable: "Unable to test feed.",
    testing: "Testing…",
    test: "Test feed URL",
  },
  probeMapper: {
    importedAuto:
      "Imported probe keys from your feed — rename below, then save.",
    enterUrl: "Enter a feed URL first.",
    noProbes: "No probes found in feed.",
    imported: {
      one: "Imported {count} probe. Rename below, then save.",
      other: "Imported {count} probes. Rename below, then save.",
    },
    unableRead: "Unable to read feed.",
    appliedSuggested: "Applied suggested names — edit below, then save.",
    hiddenAvg: 'Hidden "avg" probes from Home — save pull setup to persist.',
    saveFailed: "Failed to save pull setup.",
    unableSave: "Unable to save pull setup.",
    saveFeedFirst: "Save a feed URL first, then discover probe keys here.",
    heading: "Probe labels",
    intro:
      "Discover probes from your feed JSON, then rename them for Home. Keys stay tied to the feed; you only edit display names.",
    readingFeed: "Reading feed…",
    discover: "Discover from feed",
    feed: "Feed",
    jsonKey: "JSON key",
    nameOnHome: "Name on Home",
    showOnHome: "Show on Home",
    remove: "Remove",
    importing: "Reading feed and importing probe keys…",
    emptyHint:
      "Save a feed URL to auto-import keys, or click Discover from feed.",
    savePullSetup: "Save pull setup",
    acceptSuggested: "Accept suggested names",
    hideAvg: "Hide avg on Home",
  },
  saveBar: {
    saveFailed: "Save failed.",
    enterUrl: "Enter a feed URL first.",
    saving: "Saving…",
    save: "Save pull setup",
    hintWithFeeds:
      "Feed URL or probe label changes are not saved until you click Save pull setup.",
    hintNoFeeds: "Add a feed URL, then save to auto-import probe keys.",
  },
  fetch: {
    fetching: "Fetching…",
    fetchFailed: "Fetch failed.",
    errorPrefix: "Error: {message}",
    notFetched: "Not fetched",
    complete: "Fetch complete — refresh Home to see new readings.",
    couldNotFetch: "Could not fetch feeds.",
    rowFailed: "Fetch failed",
    fetchNow: "Fetch now",
    hint: "Pull readings immediately instead of waiting for the next scheduled poll.",
  },
  demo: {
    button: "Try demo feed",
    /** Label used by the Devices first-run card. */
    buttonFirstRun: "Try it with a demo feed",
    settingUp: "Setting up…",
    hint: "Live weather JSON — no hardware required.",
    couldNotSave: "Could not save example feed.",
  },
};

export type DeviceSetupPullMessages = typeof en;
export type FeedTestText = typeof en.feedTest;
export type PullProbeMapperText = typeof en.probeMapper;
export type PullFeedSaveBarText = typeof en.saveBar;
export type PullFetchText = typeof en.fetch;
export type DemoPullText = typeof en.demo;
export default en;
