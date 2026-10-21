/**
 * Overview nudge and tip cards (src/components/Dashboard*Nudge.astro,
 * src/components/dashboard/*Nudge.astro, ColdSnapChecklistCard, …).
 */
const en = {
  dismiss: "Dismiss",
  openAlerts: "Open alerts",
  android: {
    title: "Android companion",
    body: "Live probes, alerts, and household tools on your phone: the phone is not a sensor.",
    googlePlay: "Get it on Google Play",
    earlyAccess: "Android early access",
    orPwa: "Or install the PWA",
  },
  bayBuddy: {
    body: "Desktop glance for one space: freeze and flood moods without opening the full dashboard.",
    get: "Get {name}",
    android: "Android companion",
  },
  demoPull: {
    title: "Try without hardware",
    body: "One click adds our public example HTTPS feed. Overview shows live temperatures with no ESP required.",
    button: "Try demo feed",
  },
  probeSimulator: {
    title: "Still exploring?",
    body: "Cause a cold snap or door draft in the interactive simulator, same Overview space-status logic, no hardware required. When you’re ready, come back and connect a real probe.",
    open: "Open probe simulator",
    doorDraft: "Try door draft",
  },
  nest: {
    title: "Nest or Ecobee?",
    bodyEntitled:
      "Connect Nest/Ecobee under Devices → Pull feeds for indoor house context alongside your probes.",
    bodyNotEntitled:
      "Thermostat OAuth for Nest/Ecobee is on Pro. Free/Member can still push climate temperature from Home Assistant as an Indoor reference.",
    open: "Open Pull feeds & thermostats",
    guide: "Thermostat OAuth guide",
    viewPro: "View Pro",
  },
  pwa: {
    title: "Install on your phone",
    body: "Add ProbeHarbor to your home screen for faster access, optional browser push lives under Alerts.",
    install: "Install / PWA",
    guide: "Install guide",
  },
  youreLive: {
    title: "Probe cards live on Live",
    body: "Glanceable readings moved to Dashboard → Live. Overview stays for risk and what to do next.",
    openLive: "Open Live",
    finishAlertSetup: "Finish alert setup",
    sendTestAlert: "Send a test alert",
    reviewHistory: "Review history",
  },
  alertSetup: {
    title: "Finish alert setup",
    thresholdText:
      "Alerts are off or missing a freeze threshold. Set one before cold weather hits so you get warned in time.",
    emailText:
      "Alerts are on but email is not configured. Enable the email channel and save so freeze warnings reach your inbox.",
    setFreezeEmail: "Set freeze + email",
    enableEmail: "Enable email alerts",
  },
  story: {
    eyebrow: "Freeze scenario",
    title: "What a heater failure at 2 a.m. looks like",
    body: "A walkthrough of probe placement, thresholds, and how the alerts play out when pipes are at risk.",
    read: "Read the scenario",
    deepDive: "Technical deep dive",
  },
  testAlert: {
    title: "Send a test alert before the next cold night",
    body: "Alerts are configured but you have not confirmed delivery yet. A 30-second test now avoids discovering a typo in your email or SMS number during a real freeze.",
    send: "Send test alert",
  },
  freezeMap: {
    title: "Compare your probes to the neighborhood",
    bodyCity:
      "Opt in to the public freeze map to see how your coldest probe compares to other ProbeHarbor households in {city}: anonymized averages only, no address or device names.",
    bodyNoCity:
      "Opt in to the public freeze map to see how your coldest probe compares to other ProbeHarbor households in your city: anonymized averages only, no address or device names.",
    optIn: "Opt in on household settings",
    viewMap: "View the map",
  },
  multiProperty: {
    title: "More than one property?",
    body: "Pro already supports multiple households from one account, add a second property, rental, or workshop and switch between them from the dashboard. Portfolio raises the property ceiling for larger landlords.",
    add: "Add another property",
    portfolio: "Portfolio for landlords",
  },
  alertMoment: {
    /** Short names for the alert kind (findAlertMoment's `label`). */
    labels: {
      freeze: "freeze alert",
      leak: "leak alert",
      forecast: "freeze forecast",
    },
    titles: {
      freeze: "Your freeze alert on {when} went to email only",
      leak: "Your leak alert on {when} went to email only",
      forecast: "Your freeze forecast on {when} went to email only",
    },
    body: "Email is easy to miss overnight. Pro texts the next freeze or leak alert to your phone, and can send it during quiet hours.",
    getSms: "Get SMS alerts with Pro",
    comparePlans: "Compare plans",
    notNow: "Not now",
  },
  coldSnap: {
    title: "Cold-snap checklist",
    body: "Forecast or outdoor temps look cold. Quick household steps while freeze alerts watch the probes.",
    forecastOffHtml:
      'The forecast freeze warning is off. <a class="text-link" href="/dashboard/alerts?tab=settings#alert-section-essentials">Turn it on</a> so you get warned before outdoor lows hit your threshold.',
    memberHtml:
      'Forecast cold-snap alerts unlock on Member. <a class="text-link" href="/dashboard/plans">Compare plans</a>',
    /** Same order and length as COLD_SNAP_CHECKLIST (src/lib/coldSnapChecklist.ts). */
    checklist: [
      "Drip faucets on exterior walls if supply lines run through cold spaces.",
      "Check door seals (garage, shop, crawlspace access) and close any propped-open doors.",
      "Insulate outdoor spigots and disconnect garden hoses.",
      "Confirm freeze alerts are on, send a test if you have not lately.",
      "Verify a probe sits in the coldest corner near pipes or stored goods.",
    ],
    seasonGuide: "Full freeze-season guide",
    playbook: "Cold-snap playbook",
    essentials: "Alert essentials",
    sendTest: "Send a test alert",
  },
};

export type OverviewNudgesMessages = typeof en;
export default en;
