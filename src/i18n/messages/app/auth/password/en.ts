/** Forgot password, reset password and resend confirmation pages. */
const en = {
  backToSignIn: "Back to sign in",
  email: "Email",
  errors: {
    missing_email: "Enter the email address for your account.",
    verification: "Verification failed. Please try again.",
  },
  forgot: {
    title: "Forgot password",
    description: "Request a password reset link for your ProbeHarbor account.",
    heading: "Forgot password",
    lede: "Enter your account email and we will send a link to choose a new password.",
    sent: "If an account exists for that email, a reset link is on its way. Check your inbox and spam folder.",
    submit: "Send reset link",
  },
  reset: {
    title: "Reset password",
    description: "Choose a new password for your ProbeHarbor account.",
    heading: "Choose a new password",
    withSession: "Enter and confirm your new password below.",
    withoutSession: "Open the reset link from your email to continue.",
    needsLinkHtml:
      'This page needs a valid reset link. <a class="text-link" href="/forgot-password">Request a new one</a>.',
    newPassword: "New password",
    confirmPassword: "Confirm password",
    submit: "Update password",
    errors: {
      weak: "Password must be at least 8 characters.",
      mismatch: "Passwords do not match.",
      session: "Your reset session expired. Request a new link.",
      update: "Could not update password. Try again.",
    },
  },
  resend: {
    title: "Resend confirmation",
    description: "Request a new email confirmation link for your ProbeHarbor account.",
    heading: "Resend confirmation email",
    lede: "Confirmation links expire. Enter the email you signed up with and we will send a fresh one.",
    sentHtml:
      'If that address has an unconfirmed account, a new confirmation link is on its way. Check your inbox and spam folder. Already confirmed? <a class="text-link" href="/signin">Sign in</a>.',
    submit: "Send confirmation link",
  },
};

export type AuthPasswordMessages = typeof en;
export default en;
