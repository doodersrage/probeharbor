/**
 * /integrations hub and its six guide pages. Keys ending in `Html` hold
 * trusted inline HTML rendered with `set:html`; keep internal hrefs English
 * (`/dashboard/share`), middleware localizes them. Code blocks, YAML, JSON,
 * commands, entity ids and MQTT topics stay in the pages, untranslated.
 */
const en = {
  breadcrumbHome: "Home",
  breadcrumbIntegrations: "Integrations",
  allIntegrations: "All integrations",
  createShareLink: "Create a share link",
  startFreeShareLink: "Start free → share link",
  pluginOnGithub: "Plugin on GitHub",

  hub: {
    title: "Integrations",
    description:
      "Connect ProbeHarbor to Home Assistant, Matter, MQTT, Grafana, Nest, Ecobee, webhooks, and Zapier for freeze and flood alerts.",
    kicker: "Integrations",
    heading: "Wire ProbeHarbor into your stack",
    lede: "Hosted freeze and flood/leak alerts plus history for ESP/Arduino probes, with optional Home Assistant, Matter / SmartThings, Node-RED, Influx, Prometheus metrics, thermostat context, and webhook automations. Guides below stay on probeharbor.dev; deep payload/Grafana write-ups live on the developer docs site and are labeled when they leave.",
    dashboardShare: "Dashboard → Share",
    startFree: "Start free",
    hacsStatus: "Official HACS custom integration: default store submission in progress.",
    devDocsHtml: (devDocsUrl: string) =>
      `Looking for OpenAPI schemas or Grafana dashboard JSON details? <a class="text-link" href="${devDocsUrl}" target="_blank" rel="noreferrer">Developer docs (GitHub Pages)</a> open in a new tab. Also: <a class="text-link" href="/integrations/influx">Influx / Telegraf</a>, <a class="text-link" href="/integrations/node-red">Node-RED</a>, <a class="text-link" href="/integrations/automation">IFTTT / n8n</a>.`,
    learnMore: "Learn more",
    more: "More",
    opensDevDocs: " (opens developer docs)",
    diyTitle: "Still on DIY MQTT?",
    diyCopy:
      "You can keep Mosquitto on the LAN and mirror readings to ProbeHarbor for freeze/flood alerts, share links, and claims evidence.",
    compareDiy: "Compare vs DIY MQTT",
    guidesHub: "Guides hub",
    hacsInstallGuide: "HACS install guide",
    ingestWebhooks: "Ingest & webhooks",
    freezeMapEmbed: "Freeze map embed",
  },

  ha: {
    title: "Off-site freeze alerts for Home Assistant",
    kicker: "HACS integration",
    heading: "The freeze alert that still works when Home Assistant is down",
    lede: "A Home Assistant automation cannot warn you about the power cut or internet outage that takes Home Assistant offline, and that is often the same event that lets the house get cold. Send the sensors you already have to ProbeHarbor and it alerts you off-site when a space nears freezing, when a leak sensor gets wet, and when the readings stop arriving. Keep everything local in Home Assistant; add this for the alerts that have to reach you.",
    hacsRepo: "HACS repo on GitHub",
    vsDiyMqtt: "vs DIY MQTT",
    statusHtml:
      'Install as a HACS custom repository today. <a class="text-link" href="https://github.com/hacs/default/pull/11756" target="_blank" rel="noreferrer">default store PR #11756</a> is in review. <a class="text-link" href="https://github.com/doodersrage/probeharbor/blob/main/docs/community/home-assistant-forum-post.md" target="_blank" rel="noreferrer">Forum post draft</a>',
    addsTitle: "What it adds to a Home Assistant setup",
    addsItemsHtml: [
      "<strong>An alert when the house goes quiet.</strong> If readings stop for a set number of hours, ProbeHarbor tells you. Silence in winter usually means the power or internet is out, and the heat may be out with it.",
      "<strong>Alerts that do not depend on your network.</strong> Email, push, and chat apps on the free plan; SMS on Pro. Household members get them without access to your Home Assistant.",
      "<strong>Warning before the cold arrives.</strong> A time-to-freeze estimate on every plan, forecast freeze warnings on Member, and National Weather Service alerts on Pro.",
      "<strong>No new hardware.</strong> Push any temperature or leak entity from Home Assistant. Two devices are free.",
    ],
    addsFootHtml:
      'Two directions, use either or both: push entities from Home Assistant to ProbeHarbor for off-site alerts (YAML is generated with your key under <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> when you pick Home Assistant), and pull ProbeHarbor probes into Home Assistant as entities with the HACS integration below. Background: <a class="text-link" href="/answers/home-assistant-freeze-alert">setting up a freeze alert in Home Assistant</a> and <a class="text-link" href="/answers/wifi-freeze-alarm-power-outage">what happens in a power outage</a>.',
    installTitle: "Install via HACS",
    installStep1Html: "In Home Assistant: <strong>HACS → Integrations → ⋮ → Custom repositories</strong>",
    installStep2Html: (repo: string) =>
      `Add repository <code class="text-xs break-all">${repo}</code> (category: Integration)`,
    installStep3Html: "Install <strong>ProbeHarbor</strong> and restart Home Assistant",
    installStep4Html: "<strong>Settings → Devices &amp; services → Add integration → ProbeHarbor</strong>",
    installStep5Html:
      'Create a <strong>live</strong> share link under <a class="text-link" href="/dashboard/share/links">Dashboard → Share</a> (Free includes one family live link; Pro adds history/metrics and never-expire) and paste the token from <code>/share/YOUR_TOKEN</code>',
    installFootHtml: (devDocsUrl: string) =>
      `Extended developer walkthrough: <a class="text-link" href="${devDocsUrl}" target="_blank" rel="noreferrer">Home Assistant guide ↗</a> · Manual YAML recipes still work if you prefer REST sensors over HACS.`,
    showsTitle: "What shows up in HA",
    showsItemsHtml: [
      "<strong>Sensors</strong>: temperature, humidity, CO₂, pressure, PM2.5, VOC, level, energy, and generic numeric probes",
      "<strong>Binary sensors</strong>: door, flood/leak, motion, and power states",
      "<strong>Polling</strong>. HACS defaults to every 5 minutes (60–3600 s configurable). That is fine for dashboards; for time-critical freeze thresholds and wet contacts prefer <strong>native push ingest</strong> (ESP/Arduino → ProbeHarbor) so alerts fire on the reading, not after the next HA poll. Dual-run is normal: push for freeze and leak SMS, HACS for local entities.",
      "<strong>Services</strong> (optional inbound webhook + secret from Dashboard → Share): <code>thermaltrace.snooze</code>, <code>vacation</code>, <code>clear_snooze</code>, <code>clear_vacation</code>, <code>status</code>",
      "<strong>Push service</strong> (optional ingest key): <code>thermaltrace.push</code> with a JSON <code>payload</code> dict",
    ],
    formatsTitle: "Native JSON formats (push & pull)",
    formatsLede:
      "Beyond the HACS share-link path, ProbeHarbor auto-detects JSON your HA stack may already emit, no custom wrapper required.",
    formatsItemsHtml: [
      '<strong>Home Assistant REST sensor</strong>. POST or pull <code>{ "state": "65.3", "attributes": { "unit_of_measurement": "°F" } }</code>; map probe key <code>state</code> on Devices',
      "<strong>SenML (RFC 8428)</strong>. JSON array with <code>Cel</code> / <code>%RH</code> units; common on IoT gateways",
      "<strong>thermaltrace.push</strong>: native <code>sensors[]</code> from automations (see indoor temperature below)",
      "<strong>MQTT bridge</strong>: unwrap LAN MQTT payloads via <code>POST /api/ingest/mqtt</code>",
    ],
    liveSamples: "Live samples:",
    sampleHaRest: "HA REST",
    sampleSenml: "SenML",
    ingestFormatsGuide: "Ingest formats guide",
    indoorTitle: "Indoor temperature via Home Assistant",
    indoorLede:
      "Prefer house vs probe context on Overview and History. Two paths: Nest OAuth on Pro (when available), or push any HA climate entity as Plan B: useful when Ecobee developer signups are closed or you use another thermostat brand.",
    nestTitle: "Nest OAuth (Pro, preferred when available)",
    nestCopyHtml:
      'On <strong>probeharbor.dev</strong>, Pro households can connect Nest from <a class="text-link" href="/dashboard/devices">Dashboard → Temperature</a> for live indoor temp, setpoint, and HVAC mode next to attic/crawlspace/shop probes: freeze alerts can include that context. History stores thermostat snapshots on the same ~15-minute cron as other Pro collectors.',
    nestCompareHtml: 'End-user compare: <a class="text-link" href="/compare/nest">ProbeHarbor vs Nest</a>',
    nestOperatorHtml:
      'Self-hosted operators enabling OAuth secrets: <a class="text-link" href="/about/thermostat-oauth">Nest &amp; Ecobee operator setup</a>',
    planBTitle: "Plan B: push indoor air from Home Assistant",
    planBCopyHtml:
      "Ecobee’s developer program signups are often closed, so Ecobee OAuth may not be available even on Pro. Any thermostat already in HA (Ecobee, Nest via HA, generic <code>climate.*</code>) can still feed ProbeHarbor: push indoor air with <code>thermaltrace.push</code>, then choose that probe as your <strong>Indoor reference</strong> under Dashboard → Devices.",
    planBStepsHtml: [
      "Expose your thermostat in HA (e.g. <code>climate.living_room</code>).",
      "Every 15 minutes, call <code>thermaltrace.push</code> with a <code>temperature</code> sensor (key <code>house_indoor</code>).",
      'In ProbeHarbor: <a class="text-link" href="/dashboard/devices?view=setup&amp;tab=thermostat#indoor-reference">Devices → Indoor reference</a>: pick that sensor.',
    ],
    planBFootHtml:
      'Also useful for Ecobee via HA when OAuth is unavailable: see <a class="text-link" href="/compare/ecobee">ProbeHarbor vs Ecobee</a>. Extended payload notes (GitHub Pages): <a class="text-link" href="https://probeharbor.dev/developers/integrations/home-assistant#indoor-temperature-ecobee--any-thermostat" target="_blank" rel="noreferrer">developer docs ↗</a>',
    mqttTitle: "Dual-run with MQTT (usual pattern)",
    mqttLede:
      "ProbeHarbor is not an MQTT broker. Most homelabbers keep Mosquitto / ESPHome / HA MQTT on the LAN and mirror selected topics over HTTPS when they want cloud freeze and leak alerts and history.",
    mqttItemsHtml: [
      '<a class="text-link" href="/about/mqtt-bridge">MQTT → HTTPS bridge recipe</a> <code>POST /api/ingest/mqtt</code> with your device key',
      '<a class="text-link" href="/nodered/mqtt-to-probeharbor.json" download>Node-RED flow</a> for Mosquitto subscribers',
      '<a class="text-link" href="/compare/diy-mqtt">ProbeHarbor vs self-hosted MQTT</a>, when hosted alerts beat running your own stack',
    ],
    alertsTitle: "Alerts into Home Assistant",
    alertsLede:
      "Pro outbound webhooks fire when ProbeHarbor sends a freeze, leak, or custom-rule alert. Point the URL at your HA webhook endpoint or import the blueprint.",
    downloadBlueprint: "Download webhook blueprint YAML",
    entityYamlHtml: (href: string) =>
      `<a class="text-link" href="${href}" download>Entity naming YAML</a> for push devices`,
    productGuideHtml:
      'Product guide: <a class="text-link" href="/about/ingest-and-webhooks">Ingest &amp; webhooks</a>',
    configureTokensHtml:
      'Configure outbound + inbound tokens under <a class="text-link" href="/dashboard/share">Dashboard → Share</a>',
    verifyHtml:
      '<strong>Verify <code>X-Signature</code></strong> when you set a webhook signing secret in ProbeHarbor. HA (or any receiver) should reject POSTs that fail the HMAC check. The blueprint documents the header; details in the <a class="text-link" href="/about/ingest-and-webhooks">ingest &amp; webhooks guide</a> and FAQ below.',
    exampleTitle: "Example automation",
    exampleLede: "Snooze ProbeHarbor freeze and leak alerts while a door is open for maintenance:",
    faqLede: "Common questions about HACS, share links, and dual-running with MQTT.",
  },

  matter: {
    title: "Matter / Apple Home bridge",
    breadcrumb: "Matter",
    kicker: "Matter bridge",
    heading: "ProbeHarbor in Apple Home",
    lede: "Install the Matterbridge plugin on a Pi, NAS, or always-on PC, paste a family live share-link token (Free includes one), and get temperature, humidity, leak, door, power, and motion accessories in Apple Home, Google Home, or Alexa. Not CSA-certified. Probes stay on ESP/Arduino; this bridge only polls your share link.",
    vsHomeAssistant: "vs Home Assistant",
    whyTitle: "Why Matter instead of an iOS app?",
    whyCopyHtml:
      'Household members who already live in the Home app get garage freeze and flood glance without a ProbeHarbor login. Same share-link contract as the <a class="text-link" href="/integrations/home-assistant">HACS integration</a>, aimed at people who will never install Home Assistant. Critical freeze SMS still comes from ProbeHarbor push ingest — this poll is for Home automations and glance.',
    installTitle: "Install",
    installStep1Html:
      'Install <a class="text-link" href="https://matterbridge.io/" target="_blank" rel="noreferrer">Matterbridge</a> on a LAN host (Raspberry Pi, NAS, or always-on PC). Matter pairing needs local mDNS — it does not run on Cloudflare Workers.',
    installStep2Html: (repo: string) =>
      `Clone <code class="text-xs break-all">${repo}</code>, run <code>npm install &amp;&amp; npm run build</code>, then <code>matterbridge --add .</code>`,
    installStep3Html:
      'Create a <strong>family live</strong> share link under <a class="text-link" href="/dashboard/share/links">Dashboard → Share</a> and paste the token from <code>/share/YOUR_TOKEN</code> into the plugin config.',
    installStep4: "Restart Matterbridge and pair the QR code in Apple Home / Google Home / Alexa.",
    readmeLead: "Full README and config schema:",
    mapTitle: "Sensor map",
    mapCaption: "ProbeHarbor kinds mapped to Matter device types",
    mapKindHeader: "ProbeHarbor kind",
    mapAccessoryHeader: "Matter accessory",
    /** Accessory per ProbeHarbor kind (row order: temperature, humidity, flood, door, power, motion). */
    mapRows: [
      "Temperature Sensor (°F → °C)",
      "Humidity Sensor",
      "Water Leak Detector",
      "Contact Sensor",
      "Contact Sensor (powered = closed)",
      "Occupancy Sensor",
    ],
    mapFootHtml:
      "Skipped in v1: energy, level, air-quality clusters, and time-to-freeze (no honest native Matter type). Optional Pro <strong>Snooze</strong> switch POSTs the same inbound webhook as Home Assistant.",
    dualTitle: "Home Assistant dual-run",
    dualCopyHtml:
      'Homelabbers can keep <a class="text-link" href="/integrations/home-assistant">HACS</a> for local entities and add this Matter bridge for Apple Home on the same share link. Poll every 60–300 seconds; share readings allow about 60 requests per minute.',
    faqTitle: "Matter FAQ",
    faqLede: "Certification, install host, and how this relates to probes and Home Assistant.",
  },

  automation: {
    title: "IFTTT, n8n & Sheets",
    breadcrumb: "Automation",
    kicker: "No-code & self-hosted",
    heading: "IFTTT, n8n, Sheets & Notion",
    alertsWebhooks: "Alerts → webhooks",
    startFreeTrial: "Start free / Pro trial",
    downloadN8n: "Download n8n → Sheets",
    zapierMake: "Zapier & Make",
    iftttStepsHtml: [
      "Create an applet with trigger <strong>Webhooks → Receive a web request</strong> (event name e.g. <code>probeharbor_alert</code>).",
      "Copy the IFTTT Maker URL into ProbeHarbor <strong>Pro → Alerts → Outbound webhook</strong>. Optionally set a signing secret and verify <code>X-Signature</code> in a filter step if your plan allows code.",
      "Action: notify, toggle a smart plug, or append to a Google Sheet via IFTTT’s Sheets service.",
    ],
    n8nStep1Html: (href: string) =>
      `Import <a class="text-link" href="${href}" download>probeharbor-alert-to-sheets.json</a> (Webhook → Set → Google Sheets append).`,
    n8nStep2: "Activate the workflow; copy the production webhook URL into ProbeHarbor outbound webhook.",
    n8nStep3Html:
      "Replace <code>YOUR_GOOGLE_SHEET_ID</code>; sheet headers: <code>sent_at</code>, <code>kind</code>, <code>title</code>, <code>body</code>.",
    n8nFootHtml:
      "Same payload as Zapier: <code>title</code>, <code>body</code>, <code>kind</code>, <code>sent_at</code>. <code>kind</code> may be <code>threshold</code>, <code>flood</code>, <code>runway</code>, <code>forecast</code>, and others.",
    sheetsTitle: "Google Sheets & Notion",
    sheetsLede: "Landlord / claims paper trail without building a PMS connector:",
    sheetsItemHtml:
      "<strong>Sheets</strong> — use the n8n flow above, IFTTT Sheets, or Zapier “Create Spreadsheet Row”.",
    notionItemHtml:
      "<strong>Notion</strong> — n8n Notion node or Make “Create a database item” from the same Catch Hook; map <code>title</code> → Name, <code>kind</code> → Select, <code>body</code> → Text, <code>sent_at</code> → Date.",
    inboundTitle: "Inbound snooze (Pro)",
    inboundLede: "From IFTTT/n8n when you arm the alarm or leave home:",
    inboundFootHtml:
      'Create the token under Dashboard → Share. Details: <a class="text-link" href="/about/ingest-and-webhooks">ingest &amp; webhooks</a> · <a class="text-link" href="/about/zapier-make-recipes">Zapier &amp; Make recipes</a>.',
    faqTitle: "Automation FAQ",
    faqLede: "IFTTT vs n8n vs Zapier, and logging alerts to Sheets.",
  },

  influx: {
    title: "InfluxDB, Telegraf & VictoriaMetrics",
    breadcrumb: "InfluxDB",
    kicker: "Time series",
    heading: "Scrape ProbeHarbor into Influx",
    downloadTelegraf: "Download Telegraf config",
    createApiKey: "Create API key",
    startFreePro: "Start free / Pro",
    httpApi: "HTTP API",
    howTitle: "How it works",
    howCopyHtml:
      'Pro API keys expose Prometheus text at <code>GET /api/v1/metrics</code>. Telegraf’s <code>inputs.prometheus</code> scrapes that endpoint and writes to InfluxDB 2.x, VictoriaMetrics, or any Telegraf output. No new ProbeHarbor API — same contract as <a class="text-link" href="https://probeharbor.dev/developers/integrations/grafana" target="_blank" rel="noreferrer">Grafana</a>.',
    quickTitle: "Quick start",
    quickStep1Html:
      'Create a Pro API key under <a class="text-link" href="/dashboard/share">Dashboard → Share</a>.',
    quickStep2Html: (href: string) =>
      `Download <a class="text-link" href="${href}" download>telegraf/probeharbor.conf</a> and set <code>PROBEHARBOR_API_KEY</code>, <code>INFLUX_TOKEN</code>, <code>INFLUX_ORG</code>, <code>INFLUX_BUCKET</code>.`,
    quickStep3Html:
      "<code>telegraf --config probeharbor.conf</code> — confirm <code>probeharbor_sensor_value</code> points land in the bucket.",
    shapeTitle: "Metric shape",
    shapeCopyHtml:
      "Single gauge <code>probeharbor_sensor_value</code> with labels <code>device</code>, <code>key</code>, <code>kind</code> (<code>temperature</code>, <code>humidity</code>, <code>flood</code>, …). Numeric readings only — booleans stay on share JSON / HACS / Matter.",
    shapeFoot:
      "Self-hosted: replace the host in the Telegraf URL. VictoriaMetrics users can swap the output for Prometheus remote write (commented example in the config).",
    grafanaTitle: "Grafana still works",
    grafanaCopyHtml:
      'Prefer dashboards over long-term TSDB? Import <a class="text-link" href="/grafana/probeharbor-dashboard.json" download>probeharbor-dashboard.json</a> against a Prometheus data source pointing at the same metrics URL.',
    faqTitle: "Influx FAQ",
    faqLede: "Telegraf scrape, Pro keys, and VictoriaMetrics.",
  },

  nodeRed: {
    title: "Node-RED MQTT bridge",
    kicker: "Node-RED",
    heading: "Mirror Mosquitto to ProbeHarbor",
    downloadFlow: "Download flow JSON",
    createPushDevice: "Create a push device",
    startFreeDevices: "Start free → Devices",
    mqttBridgeRecipe: "MQTT bridge recipe",
    installTitle: "Install",
    step1Html:
      'Create a <strong>push device</strong> under <a class="text-link" href="/dashboard/devices">Dashboard → Devices</a> and copy the ingest key.',
    step2Html: (href: string) =>
      `In Node-RED: <strong>Menu → Import</strong> → upload <a class="text-link" href="${href}" download>mqtt-to-probeharbor.json</a> (or paste the URL).`,
    step3Html:
      "Set env <code>PROBEHARBOR_INGEST_KEY</code> (or edit the function node). Point MQTT nodes at your broker.",
    step4: "Deploy and confirm HTTP 200 on the debug node. Readings appear under Devices / Overview.",
    installFoot:
      "The flow rate-limits to about 1 POST per minute and includes an optional garage-door tab. ProbeHarbor is not an MQTT broker — keep Mosquitto on the LAN.",
    postsTitle: "What it POSTs",
    postsLedeHtml:
      "Envelope for <code>POST /api/ingest/mqtt</code> with header <code>X-Ingest-Key</code>:",
    relatedTitle: "Related",
    relatedItemsHtml: [
      '<a class="text-link" href="/integrations/home-assistant">Home Assistant (HACS)</a> — share-link entities without Node-RED',
      '<a class="text-link" href="/integrations/matter">Matter / Apple Home</a> — Home app sensors from the same household',
      '<a class="text-link" href="/about/garage-door-cold-playbook">Door + cold playbook</a> — pair with the door tab',
    ],
    faqTitle: "Node-RED FAQ",
    faqLede: "Import, keys, and how this relates to Home Assistant.",
  },

  smartThings: {
    title: "SmartThings via Matter",
    kicker: "SmartThings",
    heading: "Garage sensors in SmartThings",
    matterGuide: "Matter bridge guide",
    shareLink: "Share link",
    startFree: "Start free",
    vsGovee: "vs Govee / ST pods",
    noC2cTitle: "No Cloud-to-Cloud app (on purpose)",
    noC2cCopyHtml:
      "A Samsung SmartThings Cloud-to-Cloud connector means store review, OAuth, and a second cloud hop. ProbeHarbor already has a <strong>Matterbridge</strong> plugin that exposes share-link temperature, humidity, leak, door, power, and motion on your LAN. SmartThings (like Apple Home and Google Home) can add that Matter bridge — one install path for all three.",
    setupTitle: "Setup",
    setupStep1Html:
      'Create a family live share link under <a class="text-link" href="/dashboard/share/links">Dashboard → Share</a>.',
    setupStep2Html: (href: string) =>
      `Install Matterbridge + <a class="text-link" href="${href}" target="_blank" rel="noreferrer">probeharbor-matter</a> on a Pi/NAS.`,
    setupStep3: "In the SmartThings app: add a Matter device / scan the Matterbridge QR (same flow as other Matter bridges).",
    setupStep4: "Keep freeze SMS on ProbeHarbor push ingest — Matter polling is for glance and local automations.",
    aloneTitle: "When to stay on ProbeHarbor alone",
    aloneCopyHtml:
      'Consumer ST/Govee pods win on price for bedrooms. For detached garages and shops, ESP ingest + household freeze/leak channels still beat vendor Bluetooth range. See <a class="text-link" href="/compare/govee">ProbeHarbor vs Govee / SmartThings</a>.',
    faqTitle: "SmartThings FAQ",
    faqLede: "Matter path vs a dedicated SmartThings cloud app.",
  },
};

export type IntegrationsMessages = typeof en;
export default en;
