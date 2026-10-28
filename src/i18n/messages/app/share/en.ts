/**
 * Dashboard → Share (links, API, integrations) and the integration setup
 * cards shown there. Code samples, YAML, URLs and API field names stay English.
 */
const en = {
  title: "Share",
  /** Display names for share-link scope values (the values themselves stay English). */
  scopes: {
    live: "live",
    history: "history",
    metrics: "metrics",
  },
  /** Flash notices after create/revoke redirects (mirrors src/lib/shareDashboardContext.ts). */
  notices: {
    created: "Share link created, copy it below to send to family.",
    revoked: "Share link revoked.",
    regenerated: "New link created, copy it below. The old link, and any embed or scrape using it, no longer works.",
    apiKeyCreated: "API key created, copy it now; it will not be shown again.",
    apiKeyRevoked: "API key revoked.",
    statusCreated: "Status page created, copy the link below.",
    statusRevoked: "Status page revoked.",
    statusRegenerated: "New status link created, copy it below. The old link and badge no longer work.",
    familyLimit: "You already have a family live link. Revoke it first, or upgrade to Pro for more.",
    proRequired: "That option needs Pro. You can still create one family live link on Free.",
    error: "Could not update share links.",
  },
  links: {
    subtitle: "One-click live view. Anyone with the link can see live sensors.",
    viewOnly: "View-only: you cannot create or revoke share links.",
    newTitle: "New share link",
    newSubtitle: "Copy and send this link. Anyone with it can view live sensors.",
    copyLink: "Copy link",
    haTitle: "Use this link in Home Assistant or Apple Home",
    haBodyHtml:
      'Install the official <a class="text-link" href="/integrations/home-assistant">HACS integration</a> or the <a class="text-link" href="/integrations/matter">Matter / Apple Home bridge</a>, then paste the token from your share URL (<code>/share/YOUR_TOKEN</code>).',
    haGuide: "HACS install guide",
    matterGuide: "Matter bridge guide",
    hacsRepo: "HACS repo",
    familyDefaultLabel: "Family live view",
    familyTitle: "Create family link",
    familyBody: "Live sensors, expires in 7 days. Revoke anytime.",
    familyFreeNote: "Free includes one live family link. Pro adds history, metrics, and never-expire.",
    familySubmit: "Create family live link",
    moreOptions: "More share options (Pro)",
    label: "Label",
    scope: "Scope",
    scopeLive: "Live sensors",
    scopeHistory: "History (7-day chart)",
    scopeMetrics: "Metrics (Prometheus / Grafana)",
    expires: "Expires",
    expiresNever: "Never (household)",
    expires2: "2 days",
    expires7: "7 days (guest / renter)",
    expires14: "14 days",
    expires30: "30 days",
    create: "Create",
    yourLinks: "Your links",
    noLinks: "No share links yet.",
    badgeNew: "New",
    badgeExpired: "Expired",
    scopeLine: "Scope: {scope}",
    expiredOn: " · Expired {date}",
    expiresOn: " · Expires {date}",
    noExpiry: " · No expiry",
    embed: "Embed: {url}",
    scrape: "Scrape: {url}",
    confirmRevoke: "Revoke this share link?",
    linkHidden: "For security, the full link is only shown when it’s created. Regenerate it if you need it again.",
    regenerate: "Regenerate link",
    confirmRegenerate: "Make a new link? The current link, and any embed or scrape using it, will stop working.",
    revoke: "Revoke",
    remove: "Remove",
    statusTitle: "Public status pages",
    statusBodyHtml:
      "Minimal read-only status board at <code>/status/&lt;token&gt;</code>, no login required. Embed a live SVG badge at <code>/badge/status/&lt;token&gt;.svg</code> on property pages or tenant portals.",
    copyStatusUrl: "Copy status URL",
    statusDefaultLabel: "Household status",
    createStatus: "Create status page",
    noStatusPages: "No status pages yet.",
    statusUrlHidden: "For security, the link is only shown when it’s created. Regenerate it if you need it again.",
    regenerateStatus: "Regenerate link",
    confirmRegenerateStatus: "Make a new link? The current link and badge will stop working.",
    badgeLabel: "Badge:",
    preview: "preview",
  },
  api: {
    subtitle: "API keys, inbound webhooks, and ingest stats.",
    firstTitle: "First success path",
    firstBody:
      "Most integrators start with device ingest (not Prometheus). Create a push device, then POST JSON with the per-device key: curl example lives on the HTTP API docs.",
    createPushDevice: "Create push device",
    apiDocsIngest: "API docs: ingest curl",
    copySample: "Copy sample JSON from simulator",
    keysTitle: "Dashboard API keys",
    keysBodyHtml:
      "Scrape Prometheus metrics with <code>Authorization: Bearer &lt;key&gt;</code> at <code>/api/v1/metrics</code>.",
    copyKey: "Copy key",
    name: "Name",
    keyDefaultName: "Metrics key",
    createKey: "Create API key",
    noKeys: "No active API keys.",
    revoke: "Revoke",
    downloadGrafana: "Download Grafana dashboard JSON",
    inboundTitle: "Inbound webhooks",
    inboundBodyHtml:
      'Let Home Assistant or Zapier POST to ProbeHarbor. Actions: <code>snooze</code>, <code>vacation</code>, <code>clear_snooze</code>, <code>clear_vacation</code>, <code>status</code>. Example: <code>{"action":"snooze","hours":24}</code> to <code>POST /api/inbound/&lt;token&gt;</code>.',
    inboundViewOnly: "View-only: cannot create or revoke inbound webhooks.",
    newWebhookUrl: "New webhook URL (copy now):",
    signingSecret: "Signing secret (for X-ProbeHarbor-Signature, copy now):",
    copyUrl: "Copy URL",
    inboundDefaultName: "HA automation",
    createInbound: "Create inbound webhook",
    noInbound: "No inbound webhooks yet.",
    statsTitle: "Ingest stats (7 days)",
    statsBody: "Daily POST success and error counts per push device.",
    statsEmpty: "No ingest activity recorded yet. POST from a push device to populate.",
    colDevice: "Device",
    colDay: "Day",
    colOk: "OK",
    colErrors: "Errors",
  },
  integrations: {
    subtitle: "Grafana, Home Assistant, Zapier, and webhook delivery.",
    activityTitle: "Recent activity",
    activityEmpty:
      "Household actions (share links, alert saves, device transfers, ingest key reveals) will appear here.",
    exportTitle: "Export your data",
    exportBody: "Download preferences, alert settings, history sample, and devices as JSON.",
    exportButton: "Download export.json",
  },
  grafana: {
    title: "Grafana setup wizard",
    introHtml:
      "Scrape <code>probeharbor_sensor_value</code> from ProbeHarbor with a Pro API key, then import the bundled dashboard JSON.",
    step1: "Create an API key above (prefix {prefix}).",
    prefixPending: "shown after create",
    step2Lead: "In Grafana → Connections → Data sources → Add Prometheus, set URL to",
    step2TailHtml: "and add header <code>Authorization: Bearer &lt;your-api-key&gt;</code>.",
    step3Lead: "Download",
    step3Tail: "and import via Dashboards → New → Import.",
    step4: "Optional: duplicate panels per probe label or household device name.",
    snippetLabel: "Scrape config snippet",
    jsonUrlLabel: "Dashboard JSON URL for automation:",
  },
  webhookLog: {
    title: "Webhook delivery log",
    subtitle:
      "Recent POST attempts for outbound alert and reading webhooks (host only. URLs are not stored).",
    empty: "No webhook deliveries recorded yet.",
    colWhen: "When",
    colType: "Type",
    colHost: "Host",
    colStatus: "Status",
    colDuration: "Duration",
    typeReading: "Reading",
    typeAlert: "Alert",
    ok: "OK",
    failed: "Failed",
  },
  ha: {
    title: "Home Assistant setup",
    introHtml:
      'Install the official <a class="text-link" href="{integrationHref}">HACS integration</a> for automatic sensors, or import YAML blueprints and webhook recipes below.',
    recommended: "Recommended:",
    hacsCustom: "HACS custom integration",
    hacsCustomTail: "paste a share-link token; optional inbound webhook + ingest key for services",
    guide: "Home Assistant integration guide",
    devDocs: "Developer docs",
    downloadEntities: "Download entity naming YAML",
    downloadBlueprint: "Download webhook automation YAML",
    blueprintLead: "Blueprint-style import: copy",
    blueprintTail: "into HA → Settings → Automations → Create → Import from YAML.",
    inboundHtml:
      'Create an inbound webhook under Share, then POST <code>{"action":"status"}</code> from a rest_command.',
    scrapeHtml: "Scrape Prometheus metrics at <code>/api/v1/metrics</code> with a Pro API key.",
    prefillRest: "Prefill: rest_command",
    prefillPrometheus: "Prefill: Prometheus scrape",
    seeAlsoHtml:
      'See also <a class="text-link" href="/docs/api">API docs</a> and the Grafana wizard on this page.',
  },
  haDiag: {
    title: "Home Assistant diagnostics",
    emptyHtml:
      'No device has received readings from Home Assistant yet. After installing the <a class="text-link" href="{hacsHref}" target="_blank" rel="noreferrer">HACS integration</a>, add a device\'s ingest key in the integration\'s options and call the <code>thermaltrace.push</code> service from an automation; the device shows up here after its first push. (Reading data into Home Assistant through a share link isn\'t tracked here.)',
    subtitle: 'Devices fed by Home Assistant, newest first. "Stale" means no push in over 2 hours.',
    caption: "Devices receiving readings from Home Assistant",
    colDevice: "Device",
    colSensors: "Sensors",
    colLastPush: "Last push",
    colHa: "Home Assistant",
    stale: "Stale",
    versionUnknown: "version unknown",
    staleHintHtml:
      "A stale device usually means the automation calling <code>thermaltrace.push</code> stopped firing, or Home Assistant itself is offline. The outage alert covers the second case.",
    age: {
      never: "never",
      justNow: "just now",
      minutes: "{count}m ago",
      hours: "{count}h ago",
      days: "{count}d ago",
    },
  },
  lan: {
    title: "ESPHome & Shelly",
    subtitle: "Push readings from off-the-shelf LAN sensors without writing custom firmware.",
    pushDeviceHtml:
      'Create a <strong>push device</strong> under <a class="text-link" href="/dashboard/devices">Devices</a> and copy the ingest URL.',
    recipesHtml:
      '<a class="text-link" href="/about/esphome-shelly-recipes">ESPHome &amp; Shelly recipes</a> HTTP POST examples for temperature, humidity, and door contacts.',
    doorHtml:
      'Pair a door sensor with a freeze rule: <a class="text-link" href="/about/garage-door-cold-playbook">door + cold playbook</a>.',
    snippetHtml:
      '<a class="text-link" href="/esphome/probeharbor.yaml" download>Download ESPHome snippet</a> copy into your device YAML after setting <code>probeharbor_ingest_url</code> in secrets.',
    haHtml:
      'Already on Home Assistant? Use the <a class="text-link" href="/integrations/home-assistant">HACS integration</a> or <a class="text-link" href="/about/adding-devices">MQTT bridge</a> instead.',
  },
  nodeRed: {
    title: "Node-RED MQTT bridge",
    subtitle:
      "Import a flow to mirror Mosquitto readings (and optional door state) to ProbeHarbor over HTTPS.",
    step1Html:
      'Create a push device under <a class="text-link" href="/dashboard/devices">Devices</a> and copy the ingest key.',
    step2: "In Node-RED: Menu → Import → paste URL or upload JSON.",
    step3Html: 'Set env <code class="text-xs">PROBEHARBOR_INGEST_KEY</code> (or edit the function node).',
    step4: "Point the MQTT nodes at your broker; deploy and watch for HTTP 200 on the debug node.",
    downloadFlow: "Download flow JSON",
    devDocs: "Developer docs",
    fullGuide: "Full Node-RED guide",
    footerHtml:
      'Includes rate limiting (1 POST/min) and an optional door-sensor tab. Pair with <a class="text-link" href="/about/garage-door-cold-playbook">door + cold alerts</a>.',
  },
  zapier: {
    title: "Zapier / Make",
    subtitle:
      "Automate freeze and leak alerts outbound, or call ProbeHarbor from Zapier/Make via inbound webhooks.",
    outboundHtml:
      'Outbound: configure a webhook channel on <a class="text-link" href="/dashboard/alerts">Alerts</a> so freeze, leak, and threshold events POST to your Zap or Make scenario.',
    recipesHtml:
      'Recipes and payload tips: <a class="text-link" href="/about/zapier-make-recipes">Zapier / Make recipes</a>.',
    inboundHtml:
      'Inbound: create a webhook on this Share page, then POST <code>{"action":"snooze","hours":24}</code> (or <code>status</code>, <code>vacation</code>).',
    urlLabel: "Inbound webhook URL",
    copyUrl: "Copy URL",
    tokenHint:
      "Token prefixes are listed under Inbound webhooks above, create a new one to reveal a full URL once.",
    createHtml:
      '<a class="text-link" href="#inbound-webhooks">Create an inbound webhook</a> on this page to get a copy-ready URL for Zapier/Make.',
  },
};

export type ShareMessages = typeof en;
export default en;
