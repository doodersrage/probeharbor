import { useEffect, useState } from "preact/hooks";
import { fmt } from "../i18n/format";

export type PairProbeText = {
  button: string;
  newCode: string;
  making: string;
  hint: string;
  validUntil: string;
  expired: string;
  error: string;
  waiting: string;
  paired: string;
  pairedHint: string;
  replaced: string;
};

const EN: PairProbeText = {
  button: "Pair a probe",
  newCode: "New code",
  making: "Making a code…",
  hint: "Type this code where the probe asks for its device key: on its setup page (phone) or on /flash. It works once.",
  validUntil: "Valid until {time}",
  expired: "This code has expired. Make a new one.",
  error: "Couldn't make a code. Try again.",
  waiting: "Waiting for the probe to use it…",
  paired: "Paired ✓ with {chip} at {time}",
  pairedHint: "The probe now uses its new key; its next reading appears here within a minute.",
  replaced: "A newer code replaced this one.",
};

type PairingState = "waiting" | "paired" | "expired" | "replaced";
const POLL_MS = 5_000;

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
  const [code, setCode] = useState<{ id: string; code: string; expiresAt: number } | null>(null);
  const [state, setState] = useState<PairingState>("waiting");
  const [paired, setPaired] = useState<{ chip: string | null; at: number } | null>(null);
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
        id?: string;
        code?: string;
        expires_at?: string;
        error?: string;
      };
      if (!response.ok || !body.id || !body.code || !body.expires_at) {
        setError(body.error ?? text.error);
        return;
      }
      setCode({ id: body.id, code: body.code, expiresAt: Date.parse(body.expires_at) });
      setState("waiting");
      setPaired(null);
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

  // The probe's setup page closes once Wi-Fi joins and can't say whether
  // pairing worked, so this page follows the code: every 5 s while the tab
  // is visible, until it's paired, expired or replaced.
  useEffect(() => {
    if (!code || state !== "waiting") return;
    let stopped = false;
    const check = async () => {
      if (stopped || document.visibilityState !== "visible") return;
      try {
        const response = await fetch(`/api/devices/pairing?id=${encodeURIComponent(code.id)}`, {
          credentials: "same-origin",
        });
        if (!response.ok) return; // try again on the next tick
        const body = (await response.json()) as {
          status?: PairingState;
          chip?: string | null;
          paired_at?: string;
        };
        if (stopped || !body.status || body.status === "waiting") return;
        if (body.status === "paired") {
          setPaired({
            chip: body.chip ?? null,
            at: Date.parse(body.paired_at ?? "") || Date.now(),
          });
        }
        setState(body.status);
      } catch {
        // offline for a moment: the next tick tries again
      }
    };
    const timer = setInterval(() => void check(), POLL_MS);
    return () => {
      stopped = true;
      clearInterval(timer);
    };
  }, [code, state]);

  const expired =
    code != null && (state === "expired" || (state === "waiting" && now >= code.expiresAt));
  const clock = (ms: number) =>
    new Date(ms).toLocaleTimeString(locale, { hour: "numeric", minute: "2-digit" });
  const time = code ? clock(code.expiresAt) : "";

  return (
    <div class="pair-probe" data-testid="pair-probe">
      <button type="button" class="btn-secondary" onClick={() => void make()} disabled={loading}>
        {loading ? text.making : code ? text.newCode : text.button}
      </button>
      {code && (
        <div class="mt-2" aria-live="polite">
          <p
            class={`m-0 font-mono text-2xl font-semibold tracking-widest ${expired || state === "replaced" || state === "paired" ? "line-through text-[var(--color-text-muted)]" : ""}`}
            data-testid="pair-probe-code"
          >
            {code.code}
          </p>
          {state === "paired" && paired ? (
            <div data-testid="pair-probe-paired">
              <p class="m-0 mt-1 text-sm font-semibold">
                {fmt(text.paired, { chip: paired.chip ?? "?", time: clock(paired.at) })}
              </p>
              <p class="m-0 text-sm">{text.pairedHint}</p>
            </div>
          ) : state === "replaced" ? (
            <p class="m-0 text-xs text-[var(--color-text-muted)]">{text.replaced}</p>
          ) : (
            <>
              <p class="m-0 text-xs text-[var(--color-text-muted)]">
                {expired ? text.expired : fmt(text.validUntil, { time })}
              </p>
              {!expired && <p class="m-0 mt-1 text-sm">{text.hint}</p>}
              {!expired && (
                <p
                  class="m-0 mt-1 text-xs text-[var(--color-text-muted)]"
                  data-testid="pair-probe-waiting"
                >
                  {text.waiting}
                </p>
              )}
            </>
          )}
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
