import { describe, expect, it } from "vitest";

import {
  clipDoorBands,
  doorBandsAt,
  doorLabels,
  doorLanes,
  summarizeDoorBands,
  toDoorStates,
  type ChartDoorBand,
} from "./chartDoorBands";

const ms = (iso: string) => Date.parse(iso);

const bands: ChartDoorBand[] = [
  { label: "Garage door", openedAt: "2026-10-28T08:00:00Z", closedAt: "2026-10-28T08:30:00Z" },
  { label: "Shop door", openedAt: "2026-10-28T23:00:00Z", closedAt: "2026-10-29T01:00:00Z" },
  { label: "Garage door", openedAt: "2026-10-29T11:00:00Z", closedAt: null },
];

describe("door band helpers", () => {
  it("clips bands to the window and runs an open band to the window end", () => {
    expect(clipDoorBands(bands, ms("2026-10-29T00:00:00Z"), ms("2026-10-29T12:00:00Z"))).toEqual([
      { label: "Shop door", startMs: ms("2026-10-29T00:00:00Z"), endMs: ms("2026-10-29T01:00:00Z") },
      { label: "Garage door", startMs: ms("2026-10-29T11:00:00Z"), endMs: ms("2026-10-29T12:00:00Z") },
    ]);
  });

  it("drops bands entirely outside the window", () => {
    expect(clipDoorBands(bands, ms("2026-10-28T09:00:00Z"), ms("2026-10-28T22:00:00Z"))).toEqual([]);
  });

  it("finds the bands covering an instant, including their edges", () => {
    expect(doorBandsAt(bands, ms("2026-10-28T08:30:00Z")).map((b) => b.label)).toEqual(["Garage door"]);
    expect(doorBandsAt(bands, ms("2026-10-28T12:00:00Z"))).toEqual([]);
    expect(doorBandsAt(bands, ms("2026-10-30T00:00:00Z"))[0]?.closedAt).toBeNull();
  });

  it("counts periods in the window, in total and per door", () => {
    expect(summarizeDoorBands(bands, ms("2026-10-28T00:00:00Z"), ms("2026-10-29T12:00:00Z"))).toEqual({
      count: 3,
      labels: ["Garage door", "Shop door"],
      perDoor: [
        { label: "Garage door", count: 2 },
        { label: "Shop door", count: 1 },
      ],
    });
  });

  it("orders door names alphabetically, each once", () => {
    expect(doorLabels([{ label: "Side" }, { label: "Garage" }, { label: "Side" }])).toEqual(["Garage", "Side"]);
  });

  it("gives no rows for one door, a row each for several, and caps the rows", () => {
    expect(doorLanes([])).toEqual({ lanes: [], overflow: 0 });
    expect(doorLanes(["Garage"])).toEqual({ lanes: [], overflow: 0 });
    expect(doorLanes(["Garage", "Side"])).toEqual({ lanes: ["Garage", "Side"], overflow: 0 });
    expect(doorLanes(["A", "B", "C", "D", "E", "F"])).toEqual({ lanes: ["A", "B", "C", "D"], overflow: 2 });
    expect(doorLanes(["A", "B", "C"], 2)).toEqual({ lanes: ["A", "B"], overflow: 1 });
  });

  it("maps bands to open periods for anomaly notes", () => {
    expect(toDoorStates(bands.slice(2))).toEqual([
      { label: "Garage door", open: true, recordedAt: "2026-10-29T11:00:00Z", until: null },
    ]);
  });
});
