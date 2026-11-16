import { useState } from "preact/hooks";
import { fmt } from "../i18n/format";

export type PairProbeText = {
  button: string;
  newCode: string;
  making: string;
  hint: string;
  validUntil: string;
  expired: string;
  error: string;
};

const EN: PairProbeText = {
  button: "Pair a probe",
  newCode: "New code",
  making: "Making a code…",
  hint: "Type this code where the probe asks for its device key: on its setup page (phone) or on /flash. It works once.",
  validUntil: "Valid until {time}",
  expired: "This code has expired. Make a new one.",
  error: "Couldn't make a code. Try again.",
};

interface Props {
  deviceId: string;
  /** Translated strings from the server; English when missing. */
  text?: PairProbeText;
  locale?: string;
}

/**
 * Pairing code for a probe (IMPLEMENTATION_LOG.md, "Pairing codes"): asks
 * POST /api/devices/pairing and shows the code large, with its expiry. A new
 * code replaces the previous unused one on the server.
 */
export default function PairProbeButton({ deviceId, text = EN, locale }: Props) {
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState<{ code: string; expiresAt: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());

  async function make() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/devices/pairing", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ device_id: deviceId }),
      });
      const body = (await response.json().catch(() => ({}))) as {
        code?: string;
        expires_at?: string;
        error?: string;
      };
      if (!response.ok || !body.code || !body.expires_at) {
        setError(body.error ?? text.error);
        return;
      }
      setCode({ code: body.code, expiresAt: Date.parse(body.expires_at) });
      setNow(Date.now());
      // Re-check expiry now and then so an old code isn't presented as live.
      const timer = setInterval(() => setNow(Date.now()), 30_000);
      setTimeout(() => clearInterval(timer), 31 * 60_000);
    } catch {
      setError(text.error);
    } finally {
      setLoading(false);
    }
  }

  const expired = code != null && now >= code.expiresAt;
  const time = code
    ? new Date(code.expiresAt).toLocaleTimeString(locale, { hour: "numeric", minute: "2-digit" })
    : "";

  return (
    <div class="pair-probe" data-testid="pair-probe">
      <button type="button" class="btn-secondary" onClick={() => void make()} disabled={loading}>
        {loading ? text.making : code ? text.newCode : text.button}
      </button>
      {code && (
        <div class="mt-2" aria-live="polite">
          <p
            class={`m-0 font-mono text-2xl font-semibold tracking-widest ${expired ? "line-through text-[var(--color-text-muted)]" : ""}`}
            data-testid="pair-probe-code"
          >
            {code.code}
          </p>
          <p class="m-0 text-xs text-[var(--color-text-muted)]">
            {expired ? text.expired : fmt(text.validUntil, { time })}
          </p>
          {!expired && <p class="m-0 mt-1 text-sm">{text.hint}</p>}
        </div>
      )}
      {error && (
        <p class="m-0 mt-2 text-sm text-[var(--color-warning)]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
