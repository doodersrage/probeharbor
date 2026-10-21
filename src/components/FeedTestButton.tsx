import { useState } from "preact/hooks";
import en, { type FeedTestText } from "../i18n/messages/app/deviceSetup/pull/en";

interface Props {
  inputId: string;
  /** Optional input that holds the JSON root key (default `temp`). */
  rootInputId?: string;
  /** Translated strings from the server; English when missing. */
  text?: FeedTestText;
}

export default function FeedTestButton({ inputId, rootInputId, text = en.feedTest }: Props) {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function testFeed() {
    const input = document.getElementById(inputId) as HTMLInputElement | null;
    const url = input?.value.trim();
    const rootInput = rootInputId
      ? (document.getElementById(rootInputId) as HTMLInputElement | null)
      : null;
    const jsonRoot = rootInput?.value.trim() || "temp";

    if (!url) {
      setStatus(text.enterUrl);
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch("/api/feeds/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, jsonRoot }),
      });
      const data = (await response.json()) as { message?: string; ok?: boolean };
      setStatus(data.message ?? (data.ok ? text.ok : text.failed));
    } catch {
      setStatus(text.unable);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div class="mt-2 flex flex-wrap items-center gap-3">
      <button
        type="button"
        class="btn-secondary"
        onClick={testFeed}
        disabled={loading}
      >
        {loading ? text.testing : text.test}
      </button>
      {status && <span class="text-sm text-[var(--color-text-muted)]">{status}</span>}
    </div>
  );
}
