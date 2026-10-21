import type { Locale } from "../i18n/locales";
import { authSigninMessages } from "../i18n/messages/app/auth/signin";
import signinEn from "../i18n/messages/app/auth/signin/en";

/** English sign-in error text by code (translations: app/auth/signin `errors`). */
export const SIGNIN_ERROR_MESSAGES = signinEn.errors;

export type SignInErrorCode = keyof typeof SIGNIN_ERROR_MESSAGES;

export function getSignInErrorMessage(
  code: string | null,
  locale: Locale = "en",
): string | null {
  if (!code) {
    return null;
  }

  const messages = authSigninMessages(locale).errors;
  if (Object.hasOwn(SIGNIN_ERROR_MESSAGES, code)) {
    return messages[code as SignInErrorCode];
  }

  return messages.generic;
}

export function mapSignInError(error: { message: string }): SignInErrorCode {
  const message = error.message.toLowerCase();

  if (message.includes("invalid login credentials")) {
    return "invalid_credentials";
  }

  if (message.includes("email not confirmed")) {
    return "email_not_confirmed";
  }

  return "generic";
}

export function buildSignInRedirectUrl(
  errorCode: SignInErrorCode,
  email?: string,
  oauthDetail?: string | null,
): string {
  const params = new URLSearchParams({ error: errorCode });

  if (email) {
    params.set("email", email);
  }

  if (oauthDetail) {
    params.set("oauth_detail", oauthDetail);
  }

  return `/signin?${params.toString()}`;
}
