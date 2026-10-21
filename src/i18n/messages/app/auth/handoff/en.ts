/** Household invite page (/invite/[token]) and the app sign-in handoff page (/app/oauth). */
const en = {
  invite: {
    title: "Household invite",
    description: "Accept a household sharing invite.",
    heading: "Household invite",
    aHousehold: "a household",
    invalid: "This invite link is invalid.",
    expired: "This invite has expired. Ask the household owner to send a new one.",
    alreadyAccepted: "This invite was already accepted.",
    openHousehold: "Open household",
    /** `{household}` and `{email}` are rendered in <strong>. */
    invited: "You've been invited to share sensors in {household}.",
    invitedAs: "You've been invited to share sensors in {household} as {email}.",
    signOutButton: "Sign out",
    signOut: "Sign out",
    useInvitedEmail: "and use the invited email.",
    signInOrRegisterAs: "Sign in or register with {email} to accept.",
    signInOrRegister: "Sign in or register with the invited email to accept.",
    signIn: "Sign in",
    createAccount: "Create account",
    signedInMismatch: "Signed in as {email}. Sign out and use the invited address to join.",
    signInAs: "Sign in as {email}",
    signInAsInvited: "Sign in as invited email",
    signedInAs: "Signed in as {email}",
    join: "Join household",
  },
  appOAuth: {
    signInFinished: "Sign-in finished in the browser.",
    missingTitle: "Missing sign-in token",
    baybuddy: {
      title: "Return to Bay Buddy",
      description: "Finish ProbeHarbor sign-in by returning to Bay Buddy.",
      open: "Open Bay Buddy",
      handoff: "If Bay Buddy is waiting, it should pick up automatically. If not, tap the button below.",
      close: "You can close this tab once Bay Buddy shows your live garage mood.",
      missing: "This page returns you to Bay Buddy after sign-in. Open Bay Buddy and choose Connect again.",
    },
    desktop: {
      title: "Return to ProbeHarbor Desktop",
      description: "Finish ProbeHarbor sign-in by returning to ProbeHarbor Desktop.",
      open: "Open ProbeHarbor Desktop",
      handoff:
        "If ProbeHarbor Desktop is waiting on the loopback handoff, it should finish automatically. If not, this page is a fallback — reopen the app and Connect again.",
      close: "You can close this tab once ProbeHarbor Desktop shows your dashboard.",
      missing:
        "This page returns you to ProbeHarbor Desktop after sign-in. Open the desktop app and choose Connect again.",
    },
    android: {
      title: "Return to the Android app",
      description: "Finish ProbeHarbor sign-in by returning to the Android app.",
      open: "Open ProbeHarbor",
      handoff:
        "Chrome often stays here after a Google or YubiKey security step: tap the button to return to the app and finish MFA there if needed.",
      close:
        "If nothing happens, use the phone’s back button to return to the app, or open ProbeHarbor from your app drawer.",
      missing:
        "This page is only used to return to the Android app after Google sign-in. Open ProbeHarbor on your phone and try Google again.",
    },
  },
};

export type AuthHandoffMessages = typeof en;
export default en;
