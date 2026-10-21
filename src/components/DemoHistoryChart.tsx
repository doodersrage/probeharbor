import { useEffect, useState } from "preact/hooks";
import HistoryChart, { type HistoryChartUi } from "./HistoryChart";

type Point = { timestamp: string; tempf: number; humidity: number; probeLabel: string };
type DemoHistory = { location: string | null; points: Point[]; outdoor: Point[] };

/**
 * Visible copy. Plain strings only (island props are serialized); `{location}`
 * is a placeholder. Marketing pages pass a translation from
 * `src/i18n/messages/demoIslands/`.
 */
export const DEMO_HISTORY_TEXT_EN = {
  unavailable: "The 7-day chart is unavailable right now. Live readings above still update.",
  loading: "Loading the last 7 days…",
  outdoor: "Outdoor",
  outdoorAt: "Outdoor ({location})",
  title: "Example shop, last 7 days",
};

export type DemoHistoryText = typeof DEMO_HISTORY_TEXT_EN;

/** Live 7-day chart of the demo shop for signed-out visitors. */
export default function DemoHistoryChart({
  freezeThresholdF = 34,
  text = DEMO_HISTORY_TEXT_EN,
  ui,
}: {
  freezeThresholdF?: number;
  text?: DemoHistoryText;
  /** Translated chart chrome; English when omitted. */
  ui?: Partial<HistoryChartUi>;
}) {
  const [data, setData] = useState<DemoHistory | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/home/demo-history")
      .then((res) => (res.ok ? (res.json() as Promise<DemoHistory>) : Promise.reject(new Error(String(res.status)))))
      .then((body) => {
        if (!cancelled) setData(body);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (failed) {
    return <p class="m-0 text-sm text-[var(--color-text-muted)]">{text.unavailable}</p>;
  }
  if (!data) {
    return <div class="history-chart-wrap" aria-busy="true"><p class="m-0 text-sm text-[var(--color-text-muted)]">{text.loading}</p></div>;
  }
  return (
    <HistoryChart
      points={data.points}
      housePoints={data.outdoor}
      houseLegend={data.location ? text.outdoorAt.replace("{location}", data.location) : text.outdoor}
      title={text.title}
      freezeThresholdF={freezeThresholdF}
      guest
      ui={ui}
    />
  );
}
