/**
 * Account emails the app sends (sign-in runs on Better Auth). The wording
 * started from the email templates the app used on Supabase.
 */
const en = {
  confirm: {
    subject: "Confirm your email address",
    eyebrow: "Finish signing up",
    preheader: "Confirm this email address to finish creating your ProbeHarbor account.",
    title: "Confirm your email address",
    intro: "Follow the link below to confirm this email address and finish signing up.",
    cta: "Confirm email address",
    footerNote: "If you didn't create a ProbeHarbor account, you can safely ignore this email.",
  },
  reset: {
    subject: "Reset your password",
    eyebrow: "Password reset",
    preheader: "Choose a new password for your ProbeHarbor account.",
    title: "Reset your password",
    intro: "We received a request to reset your password. Follow the link below to choose a new one. The link expires in 1 hour.",
    cta: "Reset password",
    footerNote: "If you didn't request this, you can safely ignore this email.",
  },
};

export type AccountEmailMessages = typeof en;
export default en;
