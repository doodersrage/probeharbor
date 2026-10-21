import { useState } from "preact/hooks";
import { fmt } from "../i18n/format";
import en, { type RevealIngestKeyText } from "../i18n/messages/app/deviceSetup/push/en";

interface Props {
  deviceId: string;
  deviceName: string;
  /** Translated strings from the server; English when missing. */
  text?: RevealIngestKeyText;
}

export default function RevealIngestKeyButton({ deviceId, deviceName, text = en.revealKey }: Props) {
  const [loading, setLoading] = useState(false);
  const [key, setKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function reveal() {
    setLoading(true);
    setError(null);
    setCopied(false);
    try {
      const response = await fetch("/api/devices/reveal-ingest-key", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ device_id: deviceId }),
      });
      const data = (await response.json()) as { ok?: boolean; ingest_key?: string; error?: string };
      if (!response.ok || !data.ok || !data.ingest_key) {
        setError(data.error ?? text.errorDisabled);
        return;
      }
      setKey(data.ingest_key);
    } catch {
      setError(text.errorNetwork);
    } finally {
      setLoading(false);
    }
  }

  async function copyKey() {
    if (!key) return;
    try {
      await navigator.clipboard.writeText(key);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError(text.errorCopy);
    }
  }

  return (
    <div class="inline-flex flex-col gap-1">
      <button type="button" class="btn-secondary" disabled={loading} onClick={() => void reveal()}>
        {loading ? text.loading : key ? text.keyShown : text.reveal}
      </button>
      {key ? (
        <div class="flex flex-wrap items-center gap-2">
          <p class="m-0 text-xs font-mono break-all text-[var(--color-text-muted)]">
            <span class="sr-only">{fmt(text.srKeyFor, { name: deviceName })}</span>
            {key}
          </p>
          <button type="button" class="btn-ghost text-xs" onClick={() => void copyKey()}>
            {copied ? text.copied : text.copyKey}
          </button>
        </div>
      ) : null}
      {error ? <p class="m-0 text-xs text-[var(--color-danger)]">{error}</p> : null}
    </div>
  );
}
