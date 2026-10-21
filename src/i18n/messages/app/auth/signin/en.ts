import { YUBIKEY_OTP_SIGNIN_HINT, YUBIKEY_TOTP_SIGNIN_HINT } from "../../../../../lib/mfaWebAuthnUi";

/** Sign-in, register and MFA challenge pages, OAuth buttons and sign-in errors. */
const en = {
  signin: {
    title: "Sign in",
    description:
      "Sign in to your dashboard to manage display preferences, probe feeds, reading history, and CSV export.",
    heading: "Sign in",
    lede: "Pick up where you left off: preferences, feeds, and saved readings are in your dashboard.",
    registeredHtml:
      "Account created. Check your email to confirm, then sign in. Next step after sign-in: <strong>Devices</strong>: create a push key and POST your first reading.",
    confirmedHtml:
      "Email confirmed. Sign in to finish setup: next stop is <strong>Devices</strong>, where you connect your first sensor.",
    signedOutAll: "Signed out on every device. Sign in again here when you're ready.",
    resendConfirmation: "Resend the confirmation email",
    email: "Email",
    password: "Password",
    submit: "Sign in with email",
    forgotPassword: "Forgot password?",
    newHere: "New here?",
    createAccount: "Create a free account",
    privacy: "Privacy",
    terms: "Terms",
  },
  register: {
    title: "Register",
    description:
      "Create a free ProbeHarbor account, no credit card. Connect ESP/Arduino probes, freeze and flood/leak alerts, and history for your household.",
    heading: "Create your account",
    lede: "Free forever, no credit card. After signup you’ll land on Devices to connect your first probe or wet-contact alert path.",
    preferLook: "Prefer a look first?",
    liveDemo: "Live demo (no account)",
    referral: "Referral code {code} applied. Pro trial includes an extra 7 days.",
    email: "Email",
    password: "Password",
    passwordHint: "Use at least 8 characters.",
    submit: "Create account with email",
    agreeHtml:
      'By creating an account you agree to our <a class="text-link" href="/terms">Terms</a> and <a class="text-link" href="/privacy">Privacy policy</a>.',
    haveAccount: "Already have an account?",
    signIn: "Sign in",
    errors: {
      missing_fields: "Please enter both your email and password.",
      verification: "Verification failed. Please try again.",
      weak_password: "Password must be at least 8 characters.",
      generic: "Something went wrong while creating your account. Please try again.",
      signup_failed: "Something went wrong while creating your account. Please try again.",
    },
  },
  oauth: {
    google: "Continue with Google",
    github: "Continue with GitHub",
    discord: "Continue with Discord",
    orContinueWith: "or continue with",
    orUseEmail: "or use email",
  },
  /** Shown on /signin for ?error=<code>. Codes come from src/lib/signInErrors.ts. */
  errors: {
    missing_fields: "Please enter both your email and password.",
    invalid_credentials: "We couldn't sign you in. Check your email and password and try again.",
    email_not_confirmed:
      "Please confirm your email address before signing in. Check your inbox for the confirmation link.",
    oauth_failed: "We couldn't start social sign-in. Please try again or sign in with email.",
    oauth_denied: "Social sign-in was cancelled. Try again when you're ready.",
    oauth_provider_failed: "Social sign-in failed at the provider. Try again or sign in with email.",
    oauth_secret_mismatch:
      "Social sign-in credentials are out of date. Regenerate the client secret in the provider app (Discord, GitHub, or Google) and paste the new value into Supabase → Authentication → Providers.",
    oauth_github_profile:
      "GitHub sign-in could not read your profile or email. Revoke ProbeHarbor under GitHub → Settings → Authorized OAuth Apps, then try again: the authorize screen must show ProbeHarbor and request email access.",
    oauth_exchange_failed: "Something went wrong while completing social sign-in. Please try again.",
    confirm_link:
      "That confirmation link has expired or was already used. If you already confirmed, just sign in.",
    turnstile_failed: "Please complete the human verification checkbox, then try again.",
    rate_limited: "Too many sign-in attempts for this account. Please wait a few minutes and try again.",
    generic: "Something went wrong while signing in. Please try again.",
  },
  mfa: {
    title: "Two-factor authentication",
    description: "Complete sign-in with an authenticator code or YubiKey OTP.",
    yourAccount: "your account",
    errors: {
      invalid_code: "That code was incorrect or expired. Enter a fresh code from your authenticator app.",
      invalid_yubikey:
        "That YubiKey OTP was not accepted. Click the YubiKey OTP field, tap your key (long touch), and wait for the full code before submitting.",
      replayed_otp: "That YubiKey OTP was already used. Tap your key again to generate a fresh code.",
      yubikey_not_enrolled:
        "That YubiKey is not enrolled on this account. Add it under Settings → Security, or use your authenticator code.",
      no_factor: "No MFA factor is enrolled on this account. Sign in again and add one under Settings.",
      rate_limited: "Too many incorrect attempts. Please wait a few minutes and try again.",
      generic: "Something went wrong verifying your code. Try again.",
    },
    /** MfaSignInChallenge island (passed as its `text` prop). */
    challenge: {
      heading: "Two-factor authentication",
      lede: "Complete sign-in for {email} with an authenticator code or YubiKey OTP.",
      codeLabel: "Authenticator code",
      verifyCode: "Verify code",
      totpHint: YUBIKEY_TOTP_SIGNIN_HINT,
      yubikeyLabel: "YubiKey OTP",
      verifyYubikey: "Verify with YubiKey",
      otpHint: YUBIKEY_OTP_SIGNIN_HINT,
      differentAccount: "Use a different account",
    },
  },
};

export type AuthSigninMessages = typeof en;
export default en;
