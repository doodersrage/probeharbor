import { describe, expect, it } from "vitest";
import type { AlertEventRow } from "./alertEvents";
import { groupAlertEvents } from "./alertEventGroups";

let nextId = 1;
function ev(overrides: Partial<AlertEventRow> = {}): AlertEventRow {
  return {
    id: nextId++,
    user_id: "u1",
    kind: "threshold",
    title: "Temperature alert",
    body: "",
    channels_sent: ["email"],
    channels_skipped: [],
    created_at: "2026-10-12T00:00:00Z",
    acknowledged_at: null,
    ...overrides,
  };
}

describe("groupAlertEvents", () => {
  it("folds a run of identical alerts under the newest one", () => {
    const events = [ev(), ev(), ev(), ev()];
    const groups = groupAlertEvents(events);
    expect(groups).toHaveLength(1);
    expect(groups[0]!.lead.id).toBe(events[0]!.id);
    expect(groups[0]!.rest.map((e) => e.id)).toEqual(events.slice(1).map((e) => e.id));
  });

  it("treats the same probe at different temperatures as repeats, but not a different probe", () => {
    const events = [
      ev({ title: "Freeze: Garage 31.2°F" }),
      ev({ title: "Freeze: Garage 30.8°F" }),
      ev({ title: "Freeze: Garage 29°F" }),
      ev({ title: "Freeze: Attic 30°F" }),
    ];
    expect(groupAlertEvents(events).map((g) => g.rest.length)).toEqual([2, 0]);
  });

  it("leaves runs of two as separate rows", () => {
    expect(groupAlertEvents([ev(), ev()]).every((g) => g.rest.length === 0)).toBe(true);
  });

  it("breaks runs on a different title, channel, or handled state, keeping order", () => {
    const events = [
      ev(), ev(), ev(),
      ev({ title: "Flood alert" }),
      ev({ channels_sent: ["sms"] }),
      ev({ acknowledged_at: "2026-10-12T01:00:00Z" }),
    ];
    const groups = groupAlertEvents(events);
    expect(groups.map((g) => [g.lead.id, g.rest.length])).toEqual([
      [events[0]!.id, 2],
      [events[3]!.id, 0],
      [events[4]!.id, 0],
      [events[5]!.id, 0],
    ]);
    expect(groups.flatMap((g) => [g.lead, ...g.rest])).toEqual(events);
  });

  it("never folds alerts that carry a suggested fix or false-alarm feedback", () => {
    const events = [ev({ meta: { suggestedTipId: "placement" } }), ev({ meta: { suggestedTipId: "placement" } }), ev({ meta: { suggestedTipId: "placement" } })];
    expect(groupAlertEvents(events as AlertEventRow[]).every((g) => g.rest.length === 0)).toBe(true);
  });
});
