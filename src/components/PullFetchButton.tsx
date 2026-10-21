import { useEffect, useState } from "preact/hooks";
import { fmt } from "../i18n/format";
import en, { type PullFetchText } from "../i18n/messages/app/deviceSetup/pull/en";

interface Props {
  feedIds?: string[];
  autoFetch?: boolean;
  /** Translated strings from the server; English when missing. */
  text?: PullFetchText;
}

type FetchResult = {
  ok?: boolean;
  error?: string;
  feeds?: Array<{ feedId: string; name: string; ok: boolean; message: string }>;
};

export default function PullFetchButton({ feedIds = [], autoFetch = false, text = en.fetch }: Props) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  if (feedIds.length === 0) return null;

  function setFeedStatus(feedId: string, message: string, ok: boolean) {
    const el = document.querySelector<HTMLElement>(`[data-pull-fetch-status="${feedId}"]`);
    if (!el) return;
    el.textContent = message;
    el.classList.toggle("text-[var(--color-success)]", ok);
    el.classList.toggle("text-[var(--color-danger)]", !ok);
  }

  async function fetchNow() {
    setLoading(true);
    setStatus(null);
    for (const feedId of feedIds) {
      setFeedStatus(feedId, text.fetching, true);
    }
    try {
      const response = await fetch("/api/devices/pull-fetch", {
        method: "POST",
        credentials: "same-origin",
        headers: { Accept: "application/json" },
      });
      const data = (await response.json()) as FetchResult;
      if (!response.ok || !data.ok) {
        const message = data.error ?? text.fetchFailed;
        setStatus(message);
        for (const feedId of feedIds) {
          setFeedStatus(feedId, message, false);
        }
        return;
      }
      const byId = new Map((data.feeds ?? []).map((feed) => [feed.feedId, feed]));
      for (const feedId of feedIds) {
        const row = byId.get(feedId);
        if (row) {
          setFeedStatus(feedId, row.ok ? row.message : fmt(text.errorPrefix, { message: row.message }), row.ok);
        } else {
          setFeedStatus(feedId, text.notFetched, false);
        }
      }
      setStatus(text.complete);
    } catch {
      setStatus(text.couldNotFetch);
      for (const feedId of feedIds) {
        setFeedStatus(feedId, text.rowFailed, false);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!autoFetch) return;
    void fetchNow();
  }, [autoFetch]);

  return (
    <div class="flex flex-wrap items-center gap-3">
      <button type="button" class="btn-secondary" disabled={loading} onClick={() => void fetchNow()}>
        {loading ? text.fetching : text.fetchNow}
      </button>
      <span class="text-sm text-[var(--color-text-muted)]">
        {text.hint}
      </span>
      {status ? <span class="text-sm text-[var(--color-text-muted)]">{status}</span> : null}
    </div>
  );
}
