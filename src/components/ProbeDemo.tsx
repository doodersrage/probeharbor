import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import {
  applyProbeNoise,
  buildDemoFeedJson,
  buildDemoIngestJson,
  buildDemoSpaceStatus,
  computeAverageReading,
  computeDemoProbes,
  coldestProbeTempF,
  defaultDemoControls,
  doorDraftSpreadF,
  DEMO_PRESETS,
  DEMO_SPACES,
  type DemoControls,
  type DemoPresetId,
  type DemoProbe,
  type DemoSpaceKind,
} from "../lib/probeDemo";

/**
 * Visible strings for the probe demo. The page resolves these on the server and
 * passes them as the `text` prop (plain data, no functions). `{name}` marks a
 * placeholder. `presets`, `spaces` and `status` are optional overlays: when
 * missing, the English labels and status copy from `lib/probeDemo` are used.
 */
export type ProbeDemoText = {
  conditionsTitle: string;
  conditionsSubtitleHtml: string;
  presetsAria: string;
  spaceLabel: string;
  /** {temp} */
  outdoorLabel: string;
  /** {pct} */
  sunLabel: string;
  /** {temp} */
  freezeLabel: string;
  /** {spread}: a temperature difference */
  draftCalloutHtml: string;
  reset: string;
  /** {time} */
  updated: string;
  statusEyebrow: string;
  /** {coldest} {threshold} {outdoor} */
  coldestLine: string;
  riskNote: string;
  readingsTitle: string;
  readingsSubtitle: string;
  draftBadge: string;
  /** {primary}: the temperature in the main unit */
  statValue: string;
  /** {secondary}: the temperature in the other unit, {h} humidity */
  statDetail: string;
  belowFreeze: string;
  nearFreeze: string;
  averageLabel: string;
  comparisonTitle: string;
  comparisonOpen: string;
  comparisonClosed: string;
  barsAria: string;
  /** {threshold} */
  barThresholdTitle: string;
  /** {primary} */
  barValue: string;
  /** {threshold} */
  thresholdNote: string;
  jsonTitle: string;
  jsonSubtitleHtml: string;
  jsonTabsAria: string;
  tabPush: string;
  tabPull: string;
  copy: string;
  copied: string;
  copyFailed: string;
  convertTitle: string;
  convertSubtitle: string;
  kitCta: string;
  createAccount: string;
  allOptions: string;
  signedIn: string;
  addPush: string;
  essentials: string;
  presets?: Partial<Record<DemoPresetId, { label: string; hint: string }>>;
  spaces?: Partial<
    Record<DemoSpaceKind, { label: string; doorLabel: string; modelHint: string; probeLabels: string[] }>
  >;
  /** Space-status copy; placeholders {coldest} {coldestC} {threshold} {thresholdC} {n}. */
  status?: {
    freezeRiskTitle: string;
    freezeRiskDetail: string;
    coldSnapTitle: string;
    nightsTitleOne: string;
    nightsTitleOther: string;
    coldSnapDetail: string;
    nightsDetail: string;
    nearTitle: string;
    nearDetail: string;
    okTitle: string;
    okDetail: string;
  };
};

export const PROBE_DEMO_TEXT_EN: ProbeDemoText = {
  conditionsTitle: "Probe conditions",
  conditionsSubtitleHtml:
    "Pick a space, tweak weather, and watch zones respond the way Overview and Devices do with live ingest. Try <strong>Door draft</strong> or <strong>Cold snap</strong> first — cause the change, then read the bars.",
  presetsAria: "Scenario presets",
  spaceLabel: "Monitored space",
  outdoorLabel: "Outdoor temperature ({temp})",
  sunLabel: "Sun / heat load ({pct}%)",
  freezeLabel: "Freeze threshold ({temp})",
  draftCalloutHtml:
    "Door/entry zone is about <strong>{spread}</strong> colder than the warmest other probe — same reason a single workbench sensor can miss freeze risk at the door.",
  reset: "Reset demo",
  updated: "Simulated refresh every 2 seconds · Last update {time}",
  statusEyebrow: "Space status (simulated)",
  coldestLine: "Coldest probe {coldest} · threshold {threshold} · outdoor {outdoor}",
  riskNote:
    "In the real app this would fire your freeze essentials (email by default) — same logic as Overview’s space status card.",
  readingsTitle: "Live probe readings",
  readingsSubtitle: "Each card mirrors a sensor label you’d rename on Devices after first POST.",
  draftBadge: " draft",
  statValue: "{primary}",
  statDetail: "{secondary} · {h}% humidity",
  belowFreeze: " · below freeze",
  nearFreeze: " · near freeze",
  averageLabel: "Average · avg",
  comparisonTitle: "Probe comparison",
  comparisonOpen:
    "Open-door mix should drop the door/entry bar vs the others — dashed line is your freeze threshold.",
  comparisonClosed:
    "Relative temperature by zone — dashed line is your freeze threshold. Toggle the door open to widen the gap.",
  barsAria: "Bar chart comparing probe temperatures",
  barThresholdTitle: "Freeze {threshold}",
  barValue: "{primary}",
  thresholdNote: "Vertical marks show the {threshold} freeze threshold on each bar.",
  jsonTitle: "JSON feed preview",
  jsonSubtitleHtml:
    "Push ingest is what ESP/Arduino POST to Devices. Pull nests the same named probes under <code>temp</code> for scheduled HTTPS JSON.",
  jsonTabsAria: "JSON format",
  tabPush: "Push ingest",
  tabPull: "Pull feed",
  copy: "Copy JSON",
  copied: "Copied",
  copyFailed: "Copy failed",
  convertTitle: "Want this for your garage?",
  convertSubtitle:
    "Same JSON shapes and freeze essentials — about $25 in ESP32 + waterproof probe parts, then a free account, one POST, and a freeze threshold before the next cold night.",
  kitCta: "ESP32 freeze kit (~$25)",
  createAccount: "Create free account",
  allOptions: "All device options",
  signedIn: "Already signed in?",
  addPush: "Add a push device",
  essentials: "Freeze + email essentials",
};

function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

function fToC(f: number): number {
  return ((f - 32) * 5) / 9;
}

function formatHistoryTime(date: Date, locale?: string): string {
  return date.toLocaleTimeString(locale ? [locale] : [], {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });
}

type JsonTab = "pull" | "push";

function presetFromLocation(): DemoPresetId | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const raw = (params.get("preset") ?? "").trim();
  if (raw && raw in DEMO_PRESETS) return raw as DemoPresetId;
  const hash = window.location.hash.replace(/^#/, "");
  if (hash === "cold-snap" || hash === "coldSnap") return "coldSnap";
  if (hash === "door-draft" || hash === "doorDraft") return "doorDraft";
  if (hash === "sun-load" || hash === "sunny") return "sunny";
  if (hash === "mild") return "mild";
  return null;
}

type ProbeDemoProps = {
  /** Localized strings from the server; English when missing (dashboard usage). */
  text?: ProbeDemoText;
  /** BCP 47 tag for number/time formatting; English formatting when missing. */
  locale?: string;
};

export default function ProbeDemo({ text = PROBE_DEMO_TEXT_EN, locale }: ProbeDemoProps = {}) {
  const t = text;
  const numberFormat = useMemo(
    () =>
      locale
        ? new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 })
        : null,
    [locale],
  );
  const looseFormat = useMemo(
    () => (locale ? new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }) : null),
    [locale],
  );
  /** One decimal, like toFixed(1) in English. */
  const n1 = (value: number) => (numberFormat ? numberFormat.format(value) : value.toFixed(1));
  /** Slider values as entered (integers, or .5 steps). */
  const nRaw = (value: number) => (looseFormat ? looseFormat.format(value) : String(value));
  const cRaw = (f: number) => n1(fToC(f));
  /**
   * A temperature for `{temp}`-style placeholders: English as before ("28°F",
   * or "28 °F" when `spaced`), translations °C first with °F in parentheses.
   */
  const temp = (f: string, c: string, spaced = false) =>
    locale ? `${c} °C (${f} °F)` : spaced ? `${f} °F` : `${f}°F`;
  /** Main / secondary unit for a reading: °F then °C in English, °C then °F in translations. */
  const units = (f: number, c: number) =>
    locale
      ? { primary: `${n1(c)} °C`, secondary: `${n1(f)} °F` }
      : { primary: `${n1(f)} °F`, secondary: `${n1(c)} °C` };
  const [controls, setControls] = useState<DemoControls>(() => {
    const preset = presetFromLocation();
    if (!preset) return defaultDemoControls;
    return { ...defaultDemoControls, ...DEMO_PRESETS[preset].controls };
  });
  const [probes, setProbes] = useState<DemoProbe[]>(() =>
    computeDemoProbes(controls),
  );
  const [average, setAverage] = useState(() =>
    computeAverageReading(computeDemoProbes(controls)),
  );
  const [lastUpdated, setLastUpdated] = useState(() => new Date());
  const [jsonTab, setJsonTab] = useState<JsonTab>("push");
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const copyTimersRef = useRef<number[]>([]);

  useEffect(() => {
    const baseProbes = computeDemoProbes(controls);
    setProbes(baseProbes);
    setAverage(computeAverageReading(baseProbes));
    setLastUpdated(new Date());
  }, [controls]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (document.visibilityState === "hidden") return;
      const baseProbes = computeDemoProbes(controls);
      const { probes: nextProbes, average: nextAverage } =
        applyProbeNoise(baseProbes);
      setProbes(nextProbes);
      setAverage(nextAverage);
      setLastUpdated(new Date());
    }, 2000);

    return () => window.clearInterval(interval);
  }, [controls]);

  useEffect(() => {
    return () => {
      for (const id of copyTimersRef.current) window.clearTimeout(id);
      copyTimersRef.current = [];
    };
  }, []);

  const pullJson = useMemo(
    () => buildDemoFeedJson(probes, average),
    [probes, average],
  );
  const pushJson = useMemo(
    () => buildDemoIngestJson(probes, average),
    [probes, average],
  );
  const activeJson = jsonTab === "push" ? pushJson : pullJson;
  const spaceStatus = useMemo(
    () => buildDemoSpaceStatus(probes, controls),
    [probes, controls],
  );
  const coldest = coldestProbeTempF(probes);
  const space = DEMO_SPACES[controls.space];
  const spaceText = t.spaces?.[controls.space];
  const probeLabel = (probe: DemoProbe, index: number) =>
    t.spaces?.[controls.space]?.probeLabels[index] ?? probe.label;
  const statusText = (() => {
    const s = t.status;
    if (!s) return { title: spaceStatus.title, detail: spaceStatus.detail };
    // Mirrors the branches computeGarageRiskStatus can reach from buildDemoSpaceStatus.
    const threshold = controls.freezeThresholdF;
    const values = {
      coldest: coldest != null ? n1(coldest) : "",
      coldestC: coldest != null ? cRaw(coldest) : "",
      threshold: nRaw(threshold),
      thresholdC: cRaw(threshold),
      n: 1,
    };
    const nights = controls.outdoorF <= threshold + 5 ? 1 : 0;
    if (coldest != null && Number.isFinite(coldest) && coldest <= threshold) {
      return { title: fill(s.freezeRiskTitle, values), detail: fill(s.freezeRiskDetail, values) };
    }
    if (controls.outdoorF <= 25) {
      return {
        title: nights > 0 ? fill(s.nightsTitleOne, values) : s.coldSnapTitle,
        detail: s.coldSnapDetail,
      };
    }
    if (nights > 0) return { title: fill(s.nightsTitleOne, values), detail: s.nightsDetail };
    if (coldest != null && Number.isFinite(coldest) && coldest <= threshold + 5) {
      return { title: s.nearTitle, detail: fill(s.nearDetail, values) };
    }
    return { title: s.okTitle, detail: s.okDetail };
  })();
  const draftSpread = doorDraftSpreadF(probes);
  const maxBarTemp = Math.max(
    ...probes.map((probe) => probe.reading.f),
    average.f,
    controls.freezeThresholdF + 5,
    1,
  );
  const freezeBarPct = Math.min(100, (controls.freezeThresholdF / maxBarTemp) * 100);

  function updateControl<K extends keyof DemoControls>(
    key: K,
    value: DemoControls[K],
  ) {
    setControls((current) => ({ ...current, [key]: value }));
  }

  function applyPreset(id: DemoPresetId) {
    setControls((current) => ({
      ...current,
      ...DEMO_PRESETS[id].controls,
    }));
  }

  function resetDemo() {
    setControls(defaultDemoControls);
  }

  async function copyJson() {
    try {
      await navigator.clipboard.writeText(activeJson);
      setCopyStatus(t.copied);
      const id = window.setTimeout(() => setCopyStatus(null), 1500);
      copyTimersRef.current.push(id);
    } catch {
      setCopyStatus(t.copyFailed);
      const id = window.setTimeout(() => setCopyStatus(null), 2000);
      copyTimersRef.current.push(id);
    }
  }

  return (
    <div class="probe-demo">
      <section class="card">
        <h2 class="card-title">{t.conditionsTitle}</h2>
        <p class="card-subtitle" dangerouslySetInnerHTML={{ __html: t.conditionsSubtitleHtml }} />

        {/* biome-ignore lint/a11y/useSemanticElements: button toolbar; <fieldset> would add form semantics and default borders */}
        <div class="probe-demo-presets" role="group" aria-label={t.presetsAria}>
          {(Object.keys(DEMO_PRESETS) as DemoPresetId[]).map((id) => (
            <button
              key={id}
              type="button"
              class="btn-ghost"
              title={t.presets?.[id]?.hint ?? DEMO_PRESETS[id].hint}
              onClick={() => applyPreset(id)}
            >
              {t.presets?.[id]?.label ?? DEMO_PRESETS[id].label}
            </button>
          ))}
        </div>

        <div class="probe-demo-controls">
          <label class="probe-demo-control">
            <span class="form-label">{t.spaceLabel}</span>
            <select
              class="form-input"
              value={controls.space}
              onChange={(event) =>
                updateControl(
                  "space",
                  (event.currentTarget as HTMLSelectElement).value as DemoSpaceKind,
                )
              }
            >
              {(Object.keys(DEMO_SPACES) as DemoSpaceKind[]).map((id) => (
                <option value={id}>{t.spaces?.[id]?.label ?? DEMO_SPACES[id].label}</option>
              ))}
            </select>
            <span class="probe-demo-space-hint">{spaceText?.modelHint ?? space.modelHint}</span>
          </label>

          <label class="probe-demo-control">
            <span class="form-label">
              {fill(t.outdoorLabel, { temp: temp(nRaw(controls.outdoorF), cRaw(controls.outdoorF), true) })}
            </span>
            <input
              class="probe-demo-range"
              type="range"
              min={5}
              max={95}
              step={1}
              value={controls.outdoorF}
              onInput={(event) =>
                updateControl(
                  "outdoorF",
                  Number((event.currentTarget as HTMLInputElement).value),
                )
              }
            />
          </label>

          <label class="probe-demo-control">
            <span class="form-label">{fill(t.sunLabel, { pct: nRaw(controls.sunIntensity) })}</span>
            <input
              class="probe-demo-range"
              type="range"
              min={0}
              max={100}
              step={5}
              value={controls.sunIntensity}
              onInput={(event) =>
                updateControl(
                  "sunIntensity",
                  Number((event.currentTarget as HTMLInputElement).value),
                )
              }
            />
          </label>

          <label class="probe-demo-control">
            <span class="form-label">
              {fill(t.freezeLabel, {
                temp: temp(nRaw(controls.freezeThresholdF), cRaw(controls.freezeThresholdF), true),
              })}
            </span>
            <input
              class="probe-demo-range"
              type="range"
              min={20}
              max={45}
              step={0.5}
              value={controls.freezeThresholdF}
              onInput={(event) =>
                updateControl(
                  "freezeThresholdF",
                  Number((event.currentTarget as HTMLInputElement).value),
                )
              }
            />
          </label>

          <label class="checkbox-row probe-demo-toggle">
            <input
              type="checkbox"
              checked={controls.doorOpen}
              onChange={(event) =>
                updateControl(
                  "doorOpen",
                  (event.currentTarget as HTMLInputElement).checked,
                )
              }
            />
            <span>{spaceText?.doorLabel ?? space.doorLabel}</span>
          </label>
        </div>

        {controls.doorOpen && draftSpread != null && draftSpread >= 3 && (
          <p
            class="probe-demo-draft-callout"
            role="status"
            dangerouslySetInnerHTML={{
              __html: fill(t.draftCalloutHtml, {
                spread: temp(n1(draftSpread), n1((draftSpread * 5) / 9)),
              }),
            }}
          />
        )}

        <div class="probe-demo-actions">
          <button class="btn-secondary" type="button" onClick={resetDemo}>
            {t.reset}
          </button>
          <p class="probe-demo-updated m-0">
            {fill(t.updated, { time: formatHistoryTime(lastUpdated, locale) })}
          </p>
        </div>
      </section>

      <section
        class={`card garage-risk-status garage-risk-status--${spaceStatus.level}`}
        aria-live="polite"
      >
        <p class="garage-risk-eyebrow">{t.statusEyebrow}</p>
        <h2 class="card-title garage-risk-title">{statusText.title}</h2>
        <p class="card-subtitle mb-2">{statusText.detail}</p>
        {coldest != null && (
          <p class="text-sm text-[var(--color-text-muted)] mb-0">
            {fill(t.coldestLine, {
              coldest: temp(n1(coldest), cRaw(coldest)),
              threshold: temp(nRaw(controls.freezeThresholdF), cRaw(controls.freezeThresholdF)),
              outdoor: temp(nRaw(controls.outdoorF), cRaw(controls.outdoorF)),
            })}
          </p>
        )}
        {spaceStatus.level === "risk" && <p class="alert-warning mt-3 mb-0">{t.riskNote}</p>}
      </section>

      <section class="card">
        <h2 class="card-title">{t.readingsTitle}</h2>
        <p class="card-subtitle">{t.readingsSubtitle}</p>

        <div class="stat-grid">
          {probes.map((probe, index) => {
            const atRisk = probe.reading.f <= controls.freezeThresholdF;
            const near =
              !atRisk && probe.reading.f <= controls.freezeThresholdF + 5;
            const isDoorZone = probe.key === "1";
            return (
              <article
                class={`stat-item${atRisk ? " probe-demo-stat--risk" : near ? " probe-demo-stat--watch" : ""}${
                  controls.doorOpen && isDoorZone ? " probe-demo-stat--draft" : ""
                }`}
                key={probe.key}
              >
                <span class="stat-label">
                  {probeLabel(probe, index)}
                  <span class="probe-demo-key"> · {probe.ingestKey}</span>
                  {controls.doorOpen && isDoorZone ? (
                    <span class="probe-demo-draft-badge">{t.draftBadge}</span>
                  ) : null}
                </span>
                <p class="stat-value m-0">
                  {fill(t.statValue, units(probe.reading.f, probe.reading.c))}
                </p>
                <p class="stat-detail m-0">
                  {fill(t.statDetail, {
                    ...units(probe.reading.f, probe.reading.c),
                    h: n1(probe.reading.h),
                  })}
                  {atRisk ? t.belowFreeze : near ? t.nearFreeze : ""}
                </p>
              </article>
            );
          })}
          <article class="stat-item">
            <span class="stat-label">{t.averageLabel}</span>
            <p class="stat-value m-0">{fill(t.statValue, units(average.f, average.c))}</p>
            <p class="stat-detail m-0">
              {fill(t.statDetail, { ...units(average.f, average.c), h: n1(average.h) })}
            </p>
          </article>
        </div>
      </section>

      <section class="card">
        <h2 class="card-title">{t.comparisonTitle}</h2>
        <p class="card-subtitle">{controls.doorOpen ? t.comparisonOpen : t.comparisonClosed}</p>
        <div class="probe-demo-bars" role="img" aria-label={t.barsAria}>
          {probes.map((probe, index) => (
            <div
              class={`probe-demo-bar-row${
                controls.doorOpen && probe.key === "1" ? " probe-demo-bar-row--draft" : ""
              }`}
              key={probe.key}
            >
              <span class="probe-demo-bar-label">{probeLabel(probe, index)}</span>
              <div class="probe-demo-bar-track">
                <div
                  class={`probe-demo-bar-fill${
                    probe.reading.f <= controls.freezeThresholdF
                      ? " probe-demo-bar-fill--risk"
                      : controls.doorOpen && probe.key === "1"
                        ? " probe-demo-bar-fill--draft"
                        : ""
                  }`}
                  style={{ width: `${(probe.reading.f / maxBarTemp) * 100}%` }}
                />
                <span
                  class="probe-demo-bar-threshold"
                  style={{ left: `${freezeBarPct}%` }}
                  title={fill(t.barThresholdTitle, {
                    threshold: temp(nRaw(controls.freezeThresholdF), cRaw(controls.freezeThresholdF)),
                  })}
                />
              </div>
              <span class="probe-demo-bar-value">
                {fill(t.barValue, units(probe.reading.f, probe.reading.c))}
              </span>
            </div>
          ))}
        </div>
        <p class="mt-3 mb-0 text-sm text-[var(--color-text-muted)]">
          {fill(t.thresholdNote, {
            threshold: temp(nRaw(controls.freezeThresholdF), cRaw(controls.freezeThresholdF)),
          })}
        </p>
      </section>

      <section class="card">
        <h2 class="card-title">{t.jsonTitle}</h2>
        <p class="card-subtitle mb-3" dangerouslySetInnerHTML={{ __html: t.jsonSubtitleHtml }} />
        <div class="probe-demo-json-tabs" role="tablist" aria-label={t.jsonTabsAria}>
          <button
            type="button"
            role="tab"
            class={jsonTab === "push" ? "btn-secondary ring-2 ring-[var(--color-accent)]" : "btn-ghost"}
            aria-selected={jsonTab === "push"}
            onClick={() => setJsonTab("push")}
          >
            {t.tabPush}
          </button>
          <button
            type="button"
            role="tab"
            class={jsonTab === "pull" ? "btn-secondary ring-2 ring-[var(--color-accent)]" : "btn-ghost"}
            aria-selected={jsonTab === "pull"}
            onClick={() => setJsonTab("pull")}
          >
            {t.tabPull}
          </button>
          <button type="button" class="btn-ghost" onClick={() => void copyJson()}>
            {copyStatus ?? t.copy}
          </button>
        </div>
        <pre class="probe-demo-json"><code>{activeJson}</code></pre>
      </section>

      <section class="card probe-demo-convert" id="try-real">
        <h2 class="card-title">{t.convertTitle}</h2>
        <p class="card-subtitle mb-4">{t.convertSubtitle}</p>
        <div class="flex flex-wrap gap-3 mb-3">
          <a class="btn-primary" href="/about/esp32-freeze-kit">
            {t.kitCta}
          </a>
          <a class="btn-secondary" href="/register?next=/dashboard/devices">
            {t.createAccount}
          </a>
          <a class="btn-ghost" href="/about/adding-devices">
            {t.allOptions}
          </a>
        </div>
        <p class="mb-0 text-sm text-[var(--color-text-muted)]">
          {t.signedIn}
          {" "}
          <a class="text-link" href="/dashboard/devices">{t.addPush}</a>
          {" · "}
          <a class="text-link" href="/dashboard/alerts?tab=settings#alert-section-essentials">
            {t.essentials}
          </a>
        </p>
      </section>
    </div>
  );
}
