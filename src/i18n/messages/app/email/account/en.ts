/**
 * Account emails sent by the app once sign-in moves to Better Auth (step 4 of
 * the move off Supabase). Same wording as the Supabase templates in
 * supabase/templates/, now translated.
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
};

export type AccountEmailMessages = typeof en;
export default en;
