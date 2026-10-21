import { useEffect, useRef, useState } from "preact/hooks";
import { trackProductEvent } from "../lib/productAnalytics";
import {
  browserSupportsWebAuthn,
  performWebAuthnCreate,
} from "../lib/webauthnMfaBrowser";
import { MFA_WEBAUTHN_UI_ENABLED } from "../lib/mfaWebAuthnUi";
import { fmt, plural } from "../i18n/format";
import type { Locale } from "../i18n/locales";
import en, { type MfaEnrollText } from "../i18n/messages/app/settings/en";

type FactorRow = {
  id: string;
  friendly_name?: string | null;
  status: string;
};

type LoadState = "loading" | "ready" | "error";

async function mfaFetch(
  init?: RequestInit & { method?: string },
): Promise<Response> {
  return fetch("/api/auth/mfa-manage", {
    credentials: "same-origin",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
}

interface Props {
  /** Strings from settingsMessages(locale).mfa; English when omitted. */
  text?: MfaEnrollText;
  locale?: Locale;
}

export default function MfaEnroll({ text: t = en.mfa, locale = "en" }: Props) {
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [status, setStatus] = useState(t.checking);
  const [message, setMessage] = useState("");
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [factorId, setFactorId] = useState<string | null>(null);
  const [factors, setFactors] = useState<FactorRow[]>([]);
  const [webauthnFactors, setWebauthnFactors] = useState<FactorRow[]>([]);
  const [yubikeyPublicIds, setYubikeyPublicIds] = useState<string[]>([]);
  const [yubikeyConfigured, setYubikeyConfigured] = useState(false);
  const yubikeyInputRef = useRef<HTMLInputElement>(null);
  const [yubikeyReady, setYubikeyReady] = useState(false);
  const [verifyCode, setVerifyCode] = useState("");
  const [busy, setBusy] = useState(false);
  const webauthnSupported =
    MFA_WEBAUTHN_UI_ENABLED && browserSupportsWebAuthn();

  async function refreshFactorList() {
    const res = await mfaFetch({ method: "GET" });
    const payload = (await res.json().catch(() => ({}))) as {
      factors?: FactorRow[];
      totp?: FactorRow[];
      webauthn?: FactorRow[];
      yubikeyPublicIds?: string[];
      yubikeyOtpConfigured?: boolean;
      error?: string;
    };
    if (!res.ok) {
      throw new Error(payload.error ?? t.loadError);
    }
    const totp = payload.totp ?? payload.factors ?? [];
    const webauthn = payload.webauthn ?? [];
    setFactors(totp);
    setWebauthnFactors(webauthn);
    setYubikeyPublicIds(payload.yubikeyPublicIds ?? []);
    setYubikeyConfigured(payload.yubikeyOtpConfigured === true);
    const verifiedTotp = totp.filter((f) => f.status === "verified").length;
    const pendingTotp = totp.length - verifiedTotp;
    const verifiedWebauthn = webauthn.filter((f) => f.status === "verified").length;
    const pendingWebauthn = webauthn.length - verifiedWebauthn;
    const yubiCount = (payload.yubikeyPublicIds ?? []).length;
    const verifiedKeys = verifiedWebauthn + yubiCount;
    const pendingKeys = pendingWebauthn;
    const verified = verifiedTotp + verifiedKeys;
    const pending = pendingTotp + pendingKeys;
    const yubiConfigured = payload.yubikeyOtpConfigured === true;
    const total = totp.length + webauthn.length + yubiCount;
    if (total === 0) {
      setStatus(yubiConfigured ? t.noneWithYubikey : t.none);
    } else if (verified > 0 && pending === 0) {
      const keyPart =
        verifiedKeys > 0
          ? fmt(t.breakdown, {
              apps: verifiedTotp,
              keys: plural(t.keyCount, verifiedKeys, locale),
            })
          : "";
      setStatus(
        fmt(t.allVerified, {
          factors: plural(t.factorsEnrolled, verified, locale),
          breakdown: keyPart,
        }),
      );
    } else if (verified > 0) {
      setStatus(
        fmt(t.someUnfinished, {
          verified,
          unfinished: plural(t.unfinishedCount, pending, locale),
        }),
      );
    } else {
      setStatus(
        fmt(t.onlyUnfinished, { unfinished: plural(t.unfinishedCount, pending, locale) }),
      );
    }
    setLoadState("ready");
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await refreshFactorList();
      } catch (err) {
        if (cancelled) return;
        setLoadState("error");
        setStatus(
          err instanceof Error ? err.message : t.loadError,
        );
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function enroll() {
    setBusy(true);
    setMessage("");
    try {
      const res = await mfaFetch({
        method: "POST",
        body: JSON.stringify({ action: "enroll" }),
      });
      const payload = (await res.json().catch(() => ({}))) as {
        factorId?: string | null;
        qrCode?: string | null;
        error?: string;
      };
      if (!res.ok) throw new Error(payload.error ?? t.enrollFailed);
      setQrCode(payload.qrCode ?? null);
      setFactorId(payload.factorId ?? null);
      setMessage(t.scanQr);
      await refreshFactorList();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : t.enrollFailed);
    } finally {
      setBusy(false);
    }
  }

  async function verify() {
    if (!factorId || !verifyCode.trim()) return;
    setBusy(true);
    setMessage("");
    try {
      const res = await mfaFetch({
        method: "POST",
        body: JSON.stringify({
          action: "verify",
          factorId,
          code: verifyCode.trim(),
        }),
      });
      const payload = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(payload.error ?? t.verifyFailed);
      setMessage(t.totpEnrolled);
      setQrCode(null);
      setFactorId(null);
      setVerifyCode("");
      trackProductEvent("mfa_enrolled");
      await refreshFactorList();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : t.verifyFailed);
    } finally {
      setBusy(false);
    }
  }

  async function enrollSecurityKey() {
    if (!webauthnSupported) return;
    setBusy(true);
    setMessage("");
    try {
      const enrollRes = await mfaFetch({
        method: "POST",
        body: JSON.stringify({ action: "webauthn_enroll" }),
      });
      const enrolled = (await enrollRes.json().catch(() => ({}))) as {
        factorId?: string;
        error?: string;
      };
      if (!enrollRes.ok || !enrolled.factorId) {
        throw new Error(enrolled.error ?? t.keyEnrollFailed);
      }

      const challengeRes = await mfaFetch({
        method: "POST",
        body: JSON.stringify({
          action: "webauthn_challenge",
          factorId: enrolled.factorId,
        }),
      });
      const challenge = (await challengeRes.json().catch(() => ({}))) as {
        factorId?: string;
        challengeId?: string;
        ceremonyType?: "create" | "request";
        publicKey?: Record<string, unknown>;
        error?: string;
      };
      if (!challengeRes.ok || !challenge.publicKey) {
        throw new Error(challenge.error ?? t.keyStartFailed);
      }

      const credentialResponse = await performWebAuthnCreate(challenge.publicKey);

      const verifyRes = await mfaFetch({
        method: "POST",
        body: JSON.stringify({
          action: "webauthn_verify",
          factorId: challenge.factorId ?? enrolled.factorId,
          challengeId: challenge.challengeId,
          ceremonyType: challenge.ceremonyType ?? "create",
          credentialResponse,
        }),
      });
      const verified = (await verifyRes.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!verifyRes.ok || !verified.ok) {
        throw new Error(verified.error ?? t.keyVerifyFailed);
      }

      setMessage(t.keyEnrolled);
      trackProductEvent("mfa_enrolled");
      await refreshFactorList();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : t.keyEnrollmentFailed);
    } finally {
      setBusy(false);
    }
  }

  async function enrollYubiKey() {
    const otp = yubikeyInputRef.current?.value.trim() ?? "";
    if (!otp) return;
    setBusy(true);
    setMessage("");
    try {
      const res = await mfaFetch({
        method: "POST",
        body: JSON.stringify({
          action: "yubikey_enroll",
          otp,
        }),
      });
      const payload = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        publicId?: string;
        error?: string;
      };
      if (!res.ok) throw new Error(payload.error ?? t.yubikeyEnrollFailed);
      if (yubikeyInputRef.current) yubikeyInputRef.current.value = "";
      setYubikeyReady(false);
      setMessage(t.yubikeyEnrolled);
      trackProductEvent("mfa_enrolled");
      await refreshFactorList();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : t.yubikeyEnrollFailed);
    } finally {
      setBusy(false);
    }
  }

  async function unenrollYubiKey(publicId: string) {
    setBusy(true);
    setMessage("");
    const otp = yubikeyInputRef.current?.value.trim() ?? "";
    try {
      const res = await mfaFetch({
        method: "POST",
        body: JSON.stringify({
          action: "yubikey_unenroll",
          publicId,
          otp: otp || undefined,
        }),
      });
      const payload = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(payload.error ?? t.yubikeyRemoveFailed);
      if (yubikeyInputRef.current) yubikeyInputRef.current.value = "";
      setYubikeyReady(false);
      setMessage(t.yubikeyRemoved);
      await refreshFactorList();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : t.yubikeyRemoveFailed);
    } finally {
      setBusy(false);
    }
  }

  async function unenroll(id: string) {
    setBusy(true);
    setMessage("");
    try {
      const res = await mfaFetch({
        method: "POST",
        body: JSON.stringify({ action: "unenroll", factorId: id }),
      });
      const payload = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(payload.error ?? t.factorRemoveFailed);
      setMessage(t.totpRemoved);
      if (factorId === id) {
        setFactorId(null);
        setQrCode(null);
      }
      await refreshFactorList();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : t.factorRemoveFailed);
    } finally {
      setBusy(false);
    }
  }

  const loading = loadState === "loading";
  const blocked = busy || loading;

  return (
    <div>
      <p
        class="text-sm text-[var(--color-text-muted)] mb-3"
        role="status"
        aria-live="polite"
      >
        {status}
      </p>
      {loadState === "error" && (
        <button
          type="button"
          class="btn-secondary mb-3"
          disabled={busy}
          onClick={() => {
            setLoadState("loading");
            setStatus(t.checking);
            void refreshFactorList().catch((err) => {
              setLoadState("error");
              setStatus(
                err instanceof Error ? err.message : t.loadError,
              );
            });
          }}
        >
          {t.retry}
        </button>
      )}
      {factors.length > 0 && (
        <ul class="mb-3 space-y-2 text-sm">
          {factors.map((factor) => (
            <li class="flex flex-wrap items-center gap-2" key={factor.id}>
              <span>
                {factor.friendly_name || t.authenticator} ({t.statusLabels[factor.status] ?? factor.status})
              </span>
              <button
                type="button"
                class="btn-ghost"
                disabled={blocked}
                onClick={() => void unenroll(factor.id)}
              >
                {t.remove}
              </button>
            </li>
          ))}
        </ul>
      )}
      {webauthnFactors.length > 0 && (
        <ul class="mb-3 space-y-2 text-sm">
          {webauthnFactors.map((factor) => (
            <li class="flex flex-wrap items-center gap-2" key={factor.id}>
              <span>
                {factor.friendly_name || t.securityKey} ({t.statusLabels[factor.status] ?? factor.status})
              </span>
              <button
                type="button"
                class="btn-ghost"
                disabled={blocked}
                onClick={() => void unenroll(factor.id)}
              >
                {t.remove}
              </button>
            </li>
          ))}
        </ul>
      )}
      <p class="text-sm text-[var(--color-text-muted)] mb-3">
        {t.totpHint}
      </p>
      <div class="flex flex-wrap gap-2 mb-3">
        <button
          type="button"
          class="btn-secondary"
          disabled={blocked || loadState === "error"}
          onClick={() => void enroll()}
        >
          {loading ? t.loading : t.enrollApp}
        </button>
        {webauthnSupported && (
          <button
            type="button"
            class="btn-secondary"
            disabled={blocked || loadState === "error"}
            onClick={() => void enrollSecurityKey()}
          >
            {busy ? t.waitingForKey : t.addKey}
          </button>
        )}
      </div>
      {yubikeyConfigured && (
        <div class="mb-3 pt-3 border-t border-[var(--color-border)]">
          <p class="text-sm text-[var(--color-text-muted)] mb-3">
            {t.otpHint}
          </p>
          {yubikeyPublicIds.length > 0 && (
            <ul class="mb-3 space-y-2 text-sm">
              {yubikeyPublicIds.map((publicId) => (
                <li class="flex flex-wrap items-center gap-2" key={publicId}>
                  <span class="font-mono">YubiKey …{publicId.slice(-6)}</span>
                  <button
                    type="button"
                    class="btn-ghost"
                    disabled={blocked}
                    onClick={() => void unenrollYubiKey(publicId)}
                  >
                    {t.remove}
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div class="form-field mb-3">
            <label class="form-label" for="yubikey-enroll-otp">
              {t.yubikeyOtpLabel}
            </label>
            <input
              ref={yubikeyInputRef}
              class="form-input font-mono text-sm"
              id="yubikey-enroll-otp"
              type="text"
              autoComplete="off"
              onInput={() => {
                const value = yubikeyInputRef.current?.value.trim() ?? "";
                setYubikeyReady(value.length >= 44);
              }}
            />
          </div>
          <button
            type="button"
            class="btn-secondary"
            disabled={blocked || !yubikeyReady}
            onClick={() => void enrollYubiKey()}
          >
            {t.addYubikey}
          </button>
        </div>
      )}
      {qrCode && (
        <img src={qrCode} alt={t.qrAlt} width={180} height={180} class="mb-3" />
      )}
      {factorId && (
        <div class="form-field mb-3">
          <label class="form-label" for="mfa-verify-code">
            {t.verifyCodeLabel}
          </label>
          <input
            class="form-input"
            id="mfa-verify-code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            value={verifyCode}
            onInput={(e) => setVerifyCode((e.target as HTMLInputElement).value)}
          />
          <button
            type="button"
            class="btn-primary mt-2"
            disabled={blocked}
            onClick={() => void verify()}
          >
            {t.verifySubmit}
          </button>
        </div>
      )}
      {message && (
        <p class="text-sm text-[var(--color-text-muted)] mb-0" role="status">
          {message}
        </p>
      )}
    </div>
  );
}
