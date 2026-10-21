/** Shared API error text shown in the dashboard (src/pages/api/**). */
const en = {
  unauthorized: "Unauthorized",
  invalidJson: "Invalid JSON",
  viewOnly: "View-only access.",
  tooManyRequests: "Too many requests",
  signInRequired: "Sign in required.",
  sessionExpired: "Session expired.",
  sessionError: "Session error",
  forbidden: "Forbidden",
  notFound: "Not found",
  unknownAction: "Unknown action",
  editorRequired: "Editor role required",
  proPlanRequired: "Pro plan required",
  portfolioPlanRequired: "Portfolio requires Pro or Portfolio plan",
  pickFutureReturnDate: "Pick a future return date.",
  /** Last-reading age when there is no reading yet. */
  never: "never",
};

export type ApiCommonMessages = typeof en;
export default en;
