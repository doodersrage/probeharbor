import { useCallback, useEffect, useState } from "preact/hooks";
import { formatLiveTempDetail, formatLiveTempF } from "../lib/temperatureFormat";

type ProbeReading = {
  key: string;
  label: string;
  data: { f: number; c: number; h: number } | null;
};

type FeedGroup = {
  feedId: string;
  feedName: string;
  enabled: boolean;
  error?: string;
  probes: ProbeReading[];
};

/**
 * Visible copy. Plain strings only (island props are serialized), with
 * `{name}` placeholders. English is the default; marketing pages pass a
 * translation from `src/i18n/messages/demoIslands/`.
 */
export const DEMO_TEMPS_TEXT_EN = {
  loading: "Loading probe temperatures…",
  title: "Live demo readings",
  subtitle: "Public probe temperatures — free account (no card) to connect your own sensors.",
  loadError: "Unable to load probe temperatures",
  rateLimited: "Too many requests",
  retry: "Retry now",
  empty: "No temperature feeds are available yet.",
  emptyCta: "Create free account — connect probes",
  disabled: "Disabled",
  noProbes: "No probes are assigned to this feed yet.",
  noReading: 'No reading available for key "{key}"',
  updated: "Updated {time}. Next refresh in {seconds}s.",
  nextRefresh: "Next refresh in {seconds}s.",
  footerCta: "Free account — connect your probes",
  humidity: "humidity",
  /** Display names for API feed ids / probe keys; missing keys show the API's English label. */
  feedNames: {} as Record<string, string>,
  probeLabels: {} as Record<string, string>,
};

export type DemoTempsText = typeof DEMO_TEMPS_TEXT_EN;

interface Props {
  intervalMs?: number;
  text?: DemoTempsText;
  /** BCP 47 tag for number/time formatting. Omitted or English keeps the °F-first English layout. */
  locale?: string;
}

function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

export default function DemoTempsPanel({ intervalMs = 90000, text = DEMO_TEMPS_TEXT_EN, locale }: Props) {
  // Non-English pages read °C first with °F after, with locale decimals.
  const localized = locale != null && !locale.toLowerCase().startsWith("en");
  const decimal = (n: number, digits: number) =>
    Number.isFinite(n)
      ? new Intl.NumberFormat(locale, { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(n)
      : "—";
  const percent = (n: number) =>
    Number.isFinite(n)
      ? new Intl.NumberFormat(locale, { style: "percent", maximumFractionDigits: 0 }).format(n / 100)
      : "—";
  const [groups, setGroups] = useState<FeedGroup[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(intervalMs / 1000);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  const load = useCallback(async (signal?: AbortSignal) => {
    try {
      const response = await fetch("/api/home/demo-temps", {
        credentials: "same-origin",
        signal,
      });
      const payload = (await response.json()) as {
        error?: string;
        groups?: FeedGroup[];
        updatedAt?: string;
      };
      if (signal?.aborted) return;
      if (!response.ok) {
        throw new Error(
          response.status === 429
            ? text.rateLimited
            : localized
              ? text.loadError
              : (payload.error ?? text.loadError),
        );
      }
      setGroups(payload.groups ?? []);
      setUpdatedAt(payload.updatedAt ?? null);
      setError(null);
      setCountdown(intervalMs / 1000);
    } catch (e) {
      if (signal?.aborted || (e instanceof DOMException && e.name === "AbortError")) {
        return;
      }
      setError(
        e instanceof Error && (!localized || !(e instanceof TypeError)) ? e.message : text.loadError,
      );
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [intervalMs, localized, text]);

  useEffect(() => {
    const ac = new AbortController();
    void load(ac.signal);
    return () => ac.abort();
  }, [load]);

  useEffect(() => {
    const tick = window.setInterval(() => {
      if (document.visibilityState === "hidden") return;
      setCountdown((current) => {
        if (current <= 1) {
          void load();
          return intervalMs / 1000;
        }
        return current - 1;
      });
    }, 1000);
    return () => window.clearInterval(tick);
  }, [intervalMs, load]);

  if (loading && groups.length === 0) {
    return (
      <section class="card animate-slide-in-left">
        <div class="loading-state">
          <p class="m-0">{text.loading}</p>
        </div>
      </section>
    );
  }

  return (
    <section class="card animate-slide-in-left">
      <h2 class="card-title">{text.title}</h2>
      <p class="card-subtitle">{text.subtitle}</p>

      {error && (
        <div class="alert-warning mb-4">
          <p class="m-0">{error}</p>
          <button type="button" class="btn-secondary mt-3" onClick={() => void load()}>
            {text.retry}
          </button>
        </div>
      )}

      {!error && groups.length === 0 ? (
        <div class="empty-state">
          <p class="mb-4">{text.empty}</p>
          <a class="btn-primary" href="/register?next=/dashboard/devices">
            {text.emptyCta}
          </a>
        </div>
      ) : (
        <div class="feed-groups">
          {groups.map((group) => (
            <section class="feed-group" key={group.feedId}>
              <div class="feed-group-header">
                <h3 class="feed-group-title">{text.feedNames[group.feedId] ?? group.feedName}</h3>
                {!group.enabled && <span class="feed-group-badge">{text.disabled}</span>}
              </div>

              {group.error && (
                <div class="alert-warning mb-4">
                  <p class="m-0">{group.error}</p>
                </div>
              )}

              {group.probes.length === 0 ? (
                <p class="stat-detail m-0">{text.noProbes}</p>
              ) : (
                <div class="stat-grid">
                  {group.probes.map((probe) => (
                    <article class="stat-item" key={probe.key}>
                      <span class="stat-label">{text.probeLabels[probe.key] ?? probe.label}</span>
                      {probe.data ? (
                        <>
                          <p class="stat-value">
                            {localized ? `${decimal(probe.data.c, 1)} °C` : formatLiveTempF(probe.data.f)}
                          </p>
                          <p class="stat-detail">
                            {localized
                              ? `${decimal(probe.data.f, 1)} °F · ${percent(probe.data.h)} ${text.humidity}`
                              : formatLiveTempDetail(probe.data.c, probe.data.h)}
                          </p>
                        </>
                      ) : (
                        <p class="stat-detail">{fill(text.noReading, { key: probe.key })}</p>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      )}

      <p class="live-refresh-note">
        {updatedAt
          ? fill(text.updated, {
              time: new Date(updatedAt).toLocaleTimeString(localized ? locale : undefined),
              seconds: countdown,
            })
          : fill(text.nextRefresh, { seconds: countdown })}
        {" "}
        <a class="text-link" href="/register?next=/dashboard/devices">
          {text.footerCta}
        </a>
      </p>
    </section>
  );
}
