/**
 * Messages returned by /api/auth/* JSON endpoints that the dashboard shows as
 * is (MfaEnroll displays `error`). Error codes and developer-facing errors
 * ("Unauthorized", "Invalid JSON", "Missing factorId") stay English in code.
 */
const en = {
  mfa: {
    verifyBeforeAdding: "Verify MFA before adding another authenticator",
    invalidCode: "Enter a valid 6-digit code",
    verificationFailed: "Verification failed",
    challengeFailed: "Challenge failed",
    yubikeyNotConfigured: "YubiKey OTP is not configured on this site",
    tapYubikey: "Tap your YubiKey in the OTP field",
    yubikeyAlreadyEnrolled: "This YubiKey is already enrolled",
    yubikeyLimit: "Maximum of 5 YubiKeys per account",
    yubikeyNotFound: "YubiKey not found on this account",
    verifyBeforeRemovingYubikeys: "Verify MFA again before removing YubiKeys",
    tapYubikeyToRemove: "Tap the YubiKey you are removing to confirm",
    yubikeyConfirmFailed: "YubiKey confirmation failed",
    verifyBeforeRemoving: "Verify MFA again before removing authenticators",
  },
};

export type AuthApiMessages = typeof en;
export default en;
