import { useEffect, useState } from "preact/hooks";
import HistoryChart from "./HistoryChart";

type Point = { timestamp: string; tempf: number; humidity: number; probeLabel: string };
type DemoHistory = { location: string | null; points: Point[]; outdoor: Point[] };

/** Live 7-day chart of the demo shop for signed-out visitors. */
export default function DemoHistoryChart({ freezeThresholdF = 34 }: { freezeThresholdF?: number }) {
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
    return <p class="m-0 text-sm text-[var(--color-text-muted)]">The 7-day chart is unavailable right now. Live readings above still update.</p>;
  }
  if (!data) {
    return <div class="history-chart-wrap" aria-busy="true"><p class="m-0 text-sm text-[var(--color-text-muted)]">Loading the last 7 days…</p></div>;
  }
  return (
    <HistoryChart
      points={data.points}
      housePoints={data.outdoor}
      houseLegend={data.location ? `Outdoor (${data.location})` : "Outdoor"}
      title="Example shop, last 7 days"
      freezeThresholdF={freezeThresholdF}
      guest
    />
  );
}
