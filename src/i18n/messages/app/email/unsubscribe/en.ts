/** One-click unsubscribe confirmation pages (/api/email/unsubscribe). */
const en = {
  /** Fills {emails} in the sentences below. */
  labels: {
    digest: "weekly digest emails",
    monthly_report: "monthly report emails",
    quarterly_report: "quarterly report emails",
    drip: "tips and onboarding emails",
    freeze_drill: "freeze-readiness drill emails",
  },
  emailSettings: "Email settings",
  invalidTitle: "Link not valid",
  invalidBody: "This unsubscribe link is invalid. You can change email preferences from your dashboard.",
  confirmTitle: "Unsubscribe?",
  confirmBody: "Stop sending {emails}? Freeze and flood alerts are not affected.",
  confirmButton: "Unsubscribe",
  errorTitle: "Something went wrong",
  errorBody: "We couldn't update your preferences. Please try again, or change them from your dashboard.",
  doneTitle: "You're unsubscribed",
  doneBody: "You won't receive {emails} anymore. Freeze and flood alerts are not affected.",
};

export type UnsubscribeMessages = typeof en;
export default en;
