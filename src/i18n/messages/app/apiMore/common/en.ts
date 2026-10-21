/** Shared API text people read: plain-text error pages, default names, small form errors. */
const en = {
  unauthorized: "Unauthorized",
  forbidden: "Forbidden",
  notFound: "Not found",
  /** Names used when a form leaves the name blank (stored, shown in lists). */
  defaults: {
    familyLiveView: "Family live view",
    statusPage: "Status page",
    metricsKey: "Metrics key",
    inboundWebhook: "Inbound webhook",
    myProperty: "My property",
    /** Invite email fallback when the household has no name ("You're invited to {household}"). */
    aHousehold: "a household",
  },
  tenant: {
    invalidEmail: "Invalid email address.",
  },
};

export type ApiMoreCommonMessages = typeof en;
export default en;
