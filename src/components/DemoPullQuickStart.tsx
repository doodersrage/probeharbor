import { useState } from "preact/hooks";
import en, { type DemoPullText } from "../i18n/messages/app/deviceSetup/pull/en";

interface Props {
  exampleFeedUrl: string;
  redirectTo?: string;
  buttonLabel?: string;
  /** Translated strings from the server; English when missing. */
  text?: DemoPullText;
}

export default function DemoPullQuickStart({
  exampleFeedUrl,
  redirectTo = "/dashboard",
  text = en.demo,
  buttonLabel = text.button,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function startExampleFeed() {
    setLoading(true);
    setStatus(null);
    try {
      const response = await fetch("/api/user/pull-setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          redirect: redirectTo,
          feeds: [
            {
              id: "example-weather",
              name: "Example weather feed",
              url: exampleFeedUrl,
              enabled: true,
              jsonRoot: "temp",
            },
          ],
          probes: [],
        }),
      });
      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
        redirect?: string;
      };
      if (!response.ok || !data.ok) {
        setStatus(data.error ?? text.couldNotSave);
        return;
      }
      try {
        await fetch("/api/devices/pull-fetch", {
          method: "POST",
          credentials: "same-origin",
          headers: { Accept: "application/json" },
        });
      } catch {
        // Still land on Overview; scheduled poll will catch up.
      }
      const next = data.redirect ?? redirectTo;
      const joiner = next.includes("?") ? "&" : "?";
      window.location.href = `${next}${joiner}pull_saved=1&demo_pull=1`;
    } catch {
      setStatus(text.couldNotSave);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div class="flex flex-wrap items-center gap-3">
      <button type="button" class="btn-primary" disabled={loading} onClick={() => void startExampleFeed()}>
        {loading ? text.settingUp : buttonLabel}
      </button>
      <span class="text-sm text-[var(--color-text-muted)]">
        {text.hint}
      </span>
      {status ? <span class="text-sm text-[var(--color-danger)]">{status}</span> : null}
    </div>
  );
}
