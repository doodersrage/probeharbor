/** System-status subscriber emails (confirm + up/down change). */
const en = {
  confirm: {
    subject: "Confirm your ProbeHarbor status subscription",
    eyebrow: "Status updates",
    title: "Confirm your subscription",
    intro: "Click below to start receiving an email whenever ProbeHarbor's system status changes.",
    body: "If you didn't request this, you can ignore this message -- you won't be subscribed unless you confirm.",
    cta: "Confirm subscription",
    footerNote:
      "You're receiving this because someone entered this address on the ProbeHarbor status page. Confirming subscribes you to status-change emails only.",
  },
  change: {
    eyebrow: "Status update",
    subjectHealthy: "ProbeHarbor: back to normal",
    subjectDegraded: "ProbeHarbor: service degraded",
    titleHealthy: "ProbeHarbor is back to normal",
    titleDegraded: "ProbeHarbor is degraded",
    introHealthy: "Scheduled jobs and ingest monitoring are healthy again.",
    introDegraded: "We're seeing job failures or missed schedules. We're investigating.",
    cta: "View system status",
    unsubscribe: "Unsubscribe from status updates",
    footerNote: "You're receiving this because you subscribed to ProbeHarbor status updates.",
  },
};

export type StatusEmailMessages = typeof en;
export default en;
