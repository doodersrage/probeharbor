/** Shared chrome of every branded email (header, footer, unsubscribe). */
const en = {
  /** Plain-text footer when the email sets no footerNote. */
  textFooterDefault: "ProbeHarbor — live probe curves, freeze and flood/leak alerts, and history.",
  /** HTML footer when the email sets no footerNote. */
  htmlFooterDefault:
    "You’re receiving this because you have a ProbeHarbor account. Manage email preferences in Dashboard → Alerts.",
  unsubscribeText: "Unsubscribe: {url}",
  links: {
    dashboard: "Dashboard",
    alertSettings: "Alert settings",
    guides: "Guides",
    unsubscribe: "Unsubscribe",
  },
};

export type EmailLayoutMessages = typeof en;
export default en;
