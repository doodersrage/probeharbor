/** Pre-season freeze drill email and its push/Telegram copy. */
const en = {
  subject: "Freeze readiness {score}%: pre-season drill",
  eyebrow: "Pre-season freeze drill",
  preheader: "Readiness score {score}%",
  title: "Time for your freeze-season check",
  intro: "Before the first hard freeze, confirm alerts and probes are ready.",
  readiness: "Readiness",
  score: "{score}%",
  ctaDashboard: "Open dashboard",
  ctaTest: "Send test alert",
  footerNote: "Disable pre-season drills in Dashboard → Alerts.",
  notifyTitle: "Pre-season freeze drill",
  notifyBody: "Readiness {score}%. Open the dashboard and send a test alert if you have not this season.",
};

export type FreezeDrillEmailMessages = typeof en;
export default en;
