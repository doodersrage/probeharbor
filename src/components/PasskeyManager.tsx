import { useEffect, useState } from "preact/hooks";
import { formatDateTime } from "../i18n/format";
import type { Locale } from "../i18n/locales";
import en, { type MfaEnrollText } from "../i18n/messages/app/settings/en";
import { browserSupportsWebAuthn, performWebAuthnCreate } from "../lib/webauthnMfaBrowser";

/**
 * Settings → passkeys (shown only when sign-in runs on Better Auth). Talks
 * to /api/auth/passkey; the browser part is the same WebAuthn helper the
 * old security-key setup used.
 */
type Passkey = { id: string; name: string | null; createdAt: string | null };

async function api(body: unknown): Promise<{ ok: boolean; data: Record<string, unknown> }> {
  const res = await fetch("/api/auth/passkey", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return { ok: res.ok, data: (await res.json().catch(() => ({}))) as Record<string, unknown> };
}

interface Props {
  text?: MfaEnrollText;
  locale?: Locale;
}

export default function PasskeyManager({ text: t = en.mfa, locale = "en" }: Props) {
  const [passkeys, setPasskeys] = useState<Passkey[]>([]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const supported = typeof window === "undefined" ? true : browserSupportsWebAuthn();

  async function refresh() {
    const res = await fetch("/api/auth/passkey", { credentials: "same-origin" });
    const data = (await res.json().catch(() => ({}))) as { passkeys?: Passkey[] };
    if (res.ok) setPasskeys(data.passkeys ?? []);
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function add() {
    setBusy(true);
    setMessage("");
    try {
      const started = await api({ action: "register_options" });
      if (!started.ok) {
        const error = started.data.error;
        throw new Error(error === "session_not_fresh" ? t.passkeyFresh : typeof error === "string" && error !== "generic" ? error : t.passkeyFailed);
      }
      const response = await performWebAuthnCreate(started.data.options as Record<string, unknown>);
      const verified = await api({ action: "register_verify", response, name: t.passkeyDefaultName });
      if (!verified.ok) throw new Error(t.passkeyFailed);
      setMessage(t.passkeyAdded);
      await refresh();
    } catch (error) {
      // The browser's own cancel / not-allowed errors aren't translated: show ours.
      setMessage(error instanceof Error && Object.values(t).includes(error.message) ? error.message : t.passkeyFailed);
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    setBusy(true);
    setMessage("");
    const res = await api({ action: "delete", id });
    setMessage(res.ok ? t.passkeyRemoved : t.passkeyFailed);
    await refresh();
    setBusy(false);
  }

  return (
    <div class="mt-6 pt-3 border-t border-[var(--color-border)]">
      <h3 class="mt-0 mb-1 text-base font-semibold">{t.passkeysHeading}</h3>
      <p class="text-sm text-[var(--color-text-muted)] mb-3">{t.passkeysHint}</p>
      {passkeys.length > 0 && (
        <ul class="mb-3 space-y-2 text-sm">
          {passkeys.map((p) => (
            <li class="flex flex-wrap items-center gap-2" key={p.id}>
              <span>
                {p.name || t.passkeyDefaultName}
                {p.createdAt ? ` · ${formatDateTime(p.createdAt, locale, { dateStyle: "medium" })}` : ""}
              </span>
              <button type="button" class="btn-ghost" disabled={busy} onClick={() => void remove(p.id)}>
                {t.remove}
              </button>
            </li>
          ))}
        </ul>
      )}
      {supported ? (
        <button type="button" class="btn-secondary" disabled={busy} onClick={() => void add()}>
          {t.addPasskey}
        </button>
      ) : (
        <p class="text-sm text-[var(--color-text-muted)] mb-0">{t.passkeyUnsupported}</p>
      )}
      {message && (
        <p class="text-sm text-[var(--color-text-muted)] mt-3 mb-0" role="status" aria-live="polite">
          {message}
        </p>
      )}
    </div>
  );
}
