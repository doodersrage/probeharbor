import { useRef, useState } from "preact/hooks";
import { fmt } from "../i18n/format";
import signinEn from "../i18n/messages/app/auth/signin/en";

type ChallengeText = typeof signinEn.mfa.challenge;

type Props = {
  safeNext: string;
  userEmail: string;
  initialError?: string | null;
  /** Translated strings from the page (app/auth/signin `mfa.challenge`); English when missing. */
  text?: ChallengeText;
};

export default function MfaSignInChallenge({
  safeNext,
  userEmail,
  initialError = null,
  text = signinEn.mfa.challenge,
}: Props) {
  // Uncontrolled: YubiKey types 44 chars + Enter faster than React state can sync.
  const yubikeyInputRef = useRef<HTMLInputElement>(null);
  const [yubikeyReady, setYubikeyReady] = useState(false);

  return (
    <div>
      <header class="auth-intro page-header">
        <h1 class="page-header-title">{text.heading}</h1>
        <p class="page-header-lede">{fmt(text.lede, { email: userEmail })}</p>
      </header>

      <div class="form-panel">
        {initialError && (
          <div class="alert-warning mb-4" role="alert">
            <p class="m-0">{initialError}</p>
          </div>
        )}

        <form action="/api/auth/mfa-verify" method="post" class="mb-4">
          <input type="hidden" name="next" value={safeNext} />
          <div class="form-field">
            <label class="form-label" for="code">
              {text.codeLabel}
            </label>
            <input
              class="form-input"
              type="text"
              name="code"
              id="code"
              inputmode="numeric"
              pattern="[0-9]{6}"
              autocomplete="one-time-code"
              maxLength={6}
            />
          </div>
          <button class="btn-primary" type="submit">
            {text.verifyCode}
          </button>
          <p class="text-sm text-[var(--color-text-muted)] mt-3 mb-0">
            {text.totpHint}
          </p>
        </form>

        <div class="pt-4 border-t border-[var(--color-border)]">
          <form action="/api/auth/mfa-verify" method="post">
            <input type="hidden" name="next" value={safeNext} />
            <div class="form-field">
              <label class="form-label" for="yubikey_otp">
                {text.yubikeyLabel}
              </label>
              <input
                ref={yubikeyInputRef}
                class="form-input font-mono text-sm"
                type="text"
                name="yubikey_otp"
                id="yubikey_otp"
                autocomplete="off"
                maxLength={48}
                onInput={() => {
                  const value = yubikeyInputRef.current?.value.trim() ?? "";
                  setYubikeyReady(value.length >= 44);
                }}
              />
            </div>
            <button
              class="btn-secondary w-full"
              type="submit"
              disabled={!yubikeyReady}
            >
              {text.verifyYubikey}
            </button>
            <p class="text-sm text-[var(--color-text-muted)] mt-3 mb-0">
              {text.otpHint}
            </p>
          </form>
        </div>

        <p class="m-0 mt-4 text-sm text-center">
          <a class="text-link" href="/api/auth/signout">
            {text.differentAccount}
          </a>
        </p>
      </div>
    </div>
  );
}
