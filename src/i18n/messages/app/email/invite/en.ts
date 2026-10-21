/** Household invite email. {who} is the inviter's email address (or `someone`). */
const en = {
  someone: "Someone",
  subject: "You're invited to {household}",
  eyebrow: "Household invite",
  preheader: "{who} invited you to share probe sensors on ProbeHarbor.",
  title: "You're invited to {household}",
  intro: "{who} wants to share live probes, freeze alerts, and leak contacts with you on ProbeHarbor.",
  body: "Accept the invite with this email address (sign in or register). The link expires in 7 days.",
  cta: "Accept invite",
  footerNote: "If you weren’t expecting this, you can ignore the message.",
};

export type InviteEmailMessages = typeof en;
export default en;
