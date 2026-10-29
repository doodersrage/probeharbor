/**
 * Account, alert, history, push, home and weather API text shown in the
 * dashboard (src/pages/api/{user,push,home,weather,garage-temps}).
 */
const en = {
  /** /api/user/alert-test and alert-essentials: the test alert itself. */
  testAlert: {
    title: "ProbeHarbor test alert",
    body: "This is a test notification from your ProbeHarbor dashboard. If you received this, your alert channels are working.",
    unknownChannel: "Unknown channel",
    noChannels: "No channels delivered",
    failed: "Test alert failed",
  },
  /** /api/user/alert-snooze ({count} hours/days; English keeps the plural word). */
  snooze: {
    snoozed: { one: "Alerts snoozed for {count} hours.", other: "Alerts snoozed for {count} hours." },
    vacationUntil: "Vacation until {date}.",
    vacationDays: { one: "Vacation mode for {count} days.", other: "Vacation mode for {count} days." },
    snoozeCleared: "Snooze cleared.",
    vacationCleared: "Vacation cleared.",
  },
  /** /api/user/alert-events/ack */
  ack: {
    nothing: "Nothing to acknowledge",
    handled: { one: "Handled {count} alert.", other: "Handled {count} alerts." },
  },
  /** /api/user/chart-share */
  chartShare: {
    upgradeRequired: "Upgrade required for chart share",
    invalidPng: "Invalid PNG",
  },
  /** /api/user/dashboard-pinned-metrics */
  pinned: {
    invalidMetric: "Invalid metric",
    max: "You can pin up to {max} Status metrics.",
    noMetrics: "No metrics",
  },
  noEditableProperties: "No editable properties",
  noProperty: "No property",
  /** /api/user/pull-setup */
  noValidFeeds: "No valid feeds provided.",
  feedIdRequired: "Feed id is required",
  /** /api/garage-temps/export.csv */
  csvRequiresPlan: "CSV export requires an active subscription or admin access",
  doorCsvFailed: "Door events export failed. Please try again in a moment.",
  doorCsvTooMany: "Too many door openings for one CSV (more than 5,000). Pick fewer days and try again.",
  doorEventsInvalidDate: "Use YYYY-MM-DD or a full timestamp for from and to.",
  doorEventsRangeOrder: "\"from\" must be before \"to\".",
  doorEventsFailed: "Door history couldn't be loaded. Please try again in a moment.",
  /** /api/push/* */
  push: {
    invalidSubscription: "Invalid subscription",
    missingEndpoint: "Missing endpoint",
    invalidFcmToken: "Invalid FCM token",
    invalidPlatform: "Invalid platform",
    missingToken: "Missing token",
  },
  /** /api/home/*, /api/weather/* */
  weather: {
    historyUnavailable: "Weather history unavailable",
    notConfigured: "Weather API not configured",
    locationUnavailable: "Unable to load weather for this location.",
    geocodeFailed: "Geocode failed",
    geocodeRequestFailed: "Geocode request failed",
  },
};

export type ApiUserMessages = typeof en;
export default en;
