export const REGISTER_ERROR_MESSAGES = {
  missing_fields: "Please enter both your email and password.",
  verification: "Verification failed. Please try again.",
  weak_password: "Password must be at least 8 characters.",
  generic: "Something went wrong while creating your account. Please try again.",
  signup_failed: "Something went wrong while creating your account. Please try again.",
  email_taken: "This email may already have an account. Sign in, or reset your password if you forgot it.",
} as const;

export type RegisterErrorCode = keyof typeof REGISTER_ERROR_MESSAGES;

export function getRegisterErrorMessage(code: string | null): string | null {
  if (!code) {
    return null;
  }

  if (code in REGISTER_ERROR_MESSAGES) {
    return REGISTER_ERROR_MESSAGES[code as RegisterErrorCode];
  }

  // Not a known code: show short plain text as is (the register route itself only sends known codes).
  if (code.length > 0 && code.length < 200 && !code.includes("<")) {
    return code;
  }

  return REGISTER_ERROR_MESSAGES.generic;
}
