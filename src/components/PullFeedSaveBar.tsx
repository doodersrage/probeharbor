import { useEffect, useState } from "preact/hooks";
import en, { type PullFeedSaveBarText } from "../i18n/messages/app/deviceSetup/pull/en";

interface Props {
  hasFeeds: boolean;
  /** Translated strings from the server; English when missing. */
  text?: PullFeedSaveBarText;
}

export default function PullFeedSaveBar({ hasFeeds, text = en.saveBar }: Props) {
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const onError = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail;
      setStatus(detail ?? text.saveFailed);
    };
    window.addEventListener("pull-setup:save-error", onError);
    return () => window.removeEventListener("pull-setup:save-error", onError);
  }, []);

  function savePullSetup() {
    setStatus(null);
    const root = document.getElementById("pull-feeds-form");
    const urlInput = root?.querySelector<HTMLInputElement>('input[name^="feed_"][name$="_url"]');
    if (!urlInput?.value.trim()) {
      setStatus(text.enterUrl);
      return;
    }
    window.dispatchEvent(new CustomEvent("pull-setup:save"));
    setStatus(text.saving);
  }

  return (
    <div class="sticky-save-bar rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-muted)] p-3 flex flex-wrap items-center gap-3">
      <button type="button" class="btn-primary" onClick={savePullSetup}>
        {text.save}
      </button>
      <span class="text-sm text-[var(--color-text-muted)]">
        {hasFeeds
          ? text.hintWithFeeds
          : text.hintNoFeeds}
      </span>
      {status ? <span class="text-sm text-[var(--color-text-muted)]">{status}</span> : null}
    </div>
  );
}
