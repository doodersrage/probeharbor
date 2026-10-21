/**
 * Dashboard → Alerts page (activity tab, test card, settings history), the
 * alert activity list, acknowledge actions, false-alarm tips and the
 * referral card. The settings form itself lives in its own namespace.
 */
const en = {
  page: {
    title: "Alerts",
    subtitle: "What fired and who was told. Settings decides when to alert and how.",
    tabsLabel: "Alert sections",
    tabActivity: "Activity",
    tabActivityCount: "Activity ({count})",
    tabSettings: "Settings",
  },
  notices: {
    restored:
      "Earlier alert settings restored. Your previous version is in Recent changes if you want it back.",
    savedIncomplete:
      "Alert settings saved. Some enabled channels are missing a destination and will be skipped until filled in.",
    saved: "Alert settings saved.",
    invalidWebhookUrl:
      "One of your webhook URLs isn't a valid https:// address, or points to a private network. Fix it and save again.",
    weakTelegramSecret:
      "Telegram webhook secret must be at least 16 characters -- it's the only thing protecting that endpoint. Use a longer random value and save again.",
    restoreFailed: "Couldn't restore those settings. Nothing was changed.",
    saveFailed: "Unable to save alert settings.",
    testSentSkipped: "Test sent via {sent}. Skipped incomplete: {skipped}.",
    testSentVia: "Test alert sent via {channels}.",
    yourEnabledChannels: "your enabled channels",
    testIncomplete: "No channels could send: enable a channel and fill in its destination, then try again.",
    testNoChannels: "No alert channels are enabled. Turn on at least one channel, save, then retry.",
    testFailed: "Could not send test alert. Check channel settings and try again.",
    ackOk: "Alert marked as handled.",
    ackError: "Could not acknowledge alert.",
  },
  status: {
    label: "Status:",
    on: "On",
    off: "Off",
    lastAlert: "Last alert {age}",
    noAlertsYet: "No alerts sent yet",
  },
  activity: {
    heading: "Recent alert activity",
    subtitle: "Audit trail of delivered and skipped channels.",
    kindLabel: "Kind",
    kinds: {
      all: "All",
      freeze: "Freeze",
      flood: "Flood",
      forecast: "Forecast",
      threshold: "Threshold",
      test: "Test",
    },
    unhandledOnly: "Unhandled only",
    filter: "Filter",
    clear: "Clear",
    confirmAckAll: "Mark all {count} unhandled alerts as handled?",
    markAllHandled: "Mark all {count} handled",
    newer: "Newer",
    older: "Older",
  },
  claims: {
    heading: "Need evidence for a claim?",
    body: "After a real freeze or leak event, export a dated summary with matching readings from History.",
    open: "Open claims pack",
    seePro: "See claims pack (Pro)",
  },
  testSent: {
    heading: "Alerts are working",
    body: "Delivery path confirmed. A few useful next steps while you’re here:",
    shareFamily: "Share a live link with family",
    shareLinks: "Share links",
    downloadClaims: "Download claims pack",
    claimsEvidence: "Claims evidence pack",
    comparePlans: "Compare plans",
  },
  testCard: {
    heading: "Send a test alert",
    bodyRepeat:
      "Fires a sample message to every channel you currently have enabled. Save settings first if you just changed them.",
    bodyFirst:
      "Confirm delivery once before you rely on freeze warnings. Turn on at least one channel above, save, then send.",
    sendNow: "Send test now",
  },
  history: {
    heading: "Recent changes",
    body: "Each save, newest first. Restore puts settings back to how they were just before that save; your current version is kept here too.",
    confirmUndo: "Undo your last alert settings change?",
    confirmRestore: "Put alert settings back to how they were before this change? Later changes are undone too.",
    undo: "Undo",
    restoreBefore: "Restore to before this",
  },
  list: {
    empty:
      "No alert events match this filter yet. After freeze, flood, or test delivery, rows appear here with Why details and false-alarm actions.",
    sent: "Sent {channels}",
    skipped: "Skipped {channels}",
    why: "Why",
    suggested: "Suggested: {tip}.",
    suggestedFix: "Suggested fix: {tip}.",
    open: "Open",
    raiseThreshold: "Raise freeze threshold +2°F",
    checkPlacement: "Check probe placement",
    handled: "Handled",
    recovered: "Recovered",
    expired: "Expired",
    showMore: {
      one: "Show {count} more like this (back to {oldest})",
      other: "Show {count} more like this (back to {oldest})",
    },
    hideSimilar: { one: "Hide {count} similar", other: "Hide {count} similar" },
    caption: "Recent alert delivery and acknowledgement events",
    columns: {
      when: "When",
      kind: "Kind",
      title: "Title",
      why: "Why",
      sent: "Sent",
      skipped: "Skipped",
      ack: "Ack",
    },
  },
  ack: {
    imOnIt: "I'm on it",
    imOnItTitle: "Stops repeat alerts until the space warms back above your threshold",
    more: "More",
    snooze1h: "Handle & snooze 1h",
    snooze4h: "Handle & snooze 4h",
    snooze24h: "Handle & snooze 24h",
    falseAlarm: "False alarm (snooze 24h)",
    raiseThreshold: "False alarm + raise threshold +2°F",
    notifyTenant: "Handle & email tenant",
    webhookPing: "Handle & ping webhook",
  },
  tipsCard: {
    summary: "Getting too many alerts? Tips for cutting false alarms",
    intro:
      "Freeze noise is usually placement or threshold. Flood noise is splash, condensation, or sump cycles: wet contacts still fire during snooze.",
    freeze: "Freeze",
    flood: "Flood / leak",
  },
  /** Text of the tips in src/lib/falseAlarmHints.ts, keyed by tip id. */
  tips: {
    placement: {
      title: "Check probe placement",
      detail:
        "Probes on door tracks, near exhaust fans, or in sun-loaded walls swing hard and trip freeze alerts that the pipes never see. Move toward the coldest pipe run or slab corner.",
      hrefLabel: "Probe simulator",
    },
    unplugged: {
      title: "Stale often means unplugged",
      detail:
        "If a probe goes quiet for hours, treat it as power/Wi‑Fi first, not a freeze. Enable outage alerts and confirm the ESP still POSTs from Devices.",
      hrefLabel: "Stale readings guide",
    },
    threshold: {
      title: "Raise the threshold a degree or two",
      detail:
        "A 32°F trip fires on every brief draft. Many households use 34–36°F so they act before ice forms without waking for every door open.",
      hrefLabel: "Alert essentials",
    },
    snooze: {
      title: "Snooze while you fix it",
      detail:
        "Working in a cold bay? Snooze 4–24 hours so threshold noise stops while you weatherstrip, drip faucets, or reseat the probe: forecast and flood alerts still get through on vacation mode.",
    },
    splash: {
      title: "Splash and condensation bounce",
      detail:
        "A contact under a water heater or laundry tub can flicker wet from condensation or a drip that already stopped. Mount on the pan floor away from drip lines, and wipe/dry after a false trip.",
    },
    sump_cycle: {
      title: "Sump duty cycle ≠ leak",
      detail:
        "Rising sump level during a storm is normal. Use a flood/leak contact for standing water, and a custom level_above rule only if you want pump-failure early warning, not every pump cycle.",
      hrefLabel: "Alert rules",
    },
    test_wet: {
      title: "Test with a damp cloth, then dry",
      detail:
        "Flood alerts fire automatically when wet (even during vacation). After a placement test, dry the contact so you do not leave a sticky wet state overnight.",
    },
  } as Record<string, { title: string; detail: string; hrefLabel?: string }>,
  staleProbes: {
    one: "{count} probe looks stale: likely unplugged, offline Wi‑Fi, or a dead battery. Check power and Devices before treating it as a freeze.",
    other:
      "{count} probes look stale: likely unplugged, offline Wi‑Fi, or a dead battery. Check power and Devices before treating it as a freeze.",
  },
  wetFlood: {
    one: "{count} flood/leak sensor is wet right now: flood alerts bypass snooze and vacation. Check the pan, sump, or supply line.",
    other:
      "{count} flood/leak sensors are wet right now: flood alerts bypass snooze and vacation. Check the pan, sump, or supply line.",
  },
  /** Parts of the "Why" line, joined with " · ". Temperatures are stored in °F. */
  why: {
    probeAt: "{probe} at {temp}°F",
    probeAtUnnamed: "Probe at {temp}°F",
    threshold: "threshold {temp}°F",
    outdoor: "outdoor {temp}°F",
    deltaT: "ΔT {delta}°F",
    runway: "~{hours}h runway",
    doorOpen: "door open nearby",
  },
  referral: {
    heading: "Gift a winter of monitoring",
    introHtml: "Share your link: new signups get <strong>7 extra days</strong> on Pro trial.",
    bonusDays: {
      one: "You have {count} bonus trial day from successful referrals.",
      other: "You have {count} bonus trial days from successful referrals.",
    },
    earn: "You earn +7 trial days when a referred friend subscribes to Pro.",
    howGifting: "How gifting works",
    loading: "Loading referral link…",
    copyInvite: "Copy invite link",
    copied: "Copied!",
    copyFailed: "Copy failed",
    unavailable: "Referral link unavailable.",
    friendsJoined: {
      one: "{count} friend joined via your link.",
      other: "{count} friends joined via your link.",
    },
    noSignups: "No signups yet, share the link above.",
  },
};

export type AlertsMessages = typeof en;
export default en;
