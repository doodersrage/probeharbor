import { describe, expect, it } from "vitest";
import { isActionableAlertKind, isUnhandledAlertEvent } from "./alertEvents";

const minutesAgo = (m: number) => new Date(Date.now() - m * 60 * 1000).toISOString();

const ev = (kind: string, sent: string[], acked: string | null = null) => ({
  kind,
  channels_sent: sent,
  acknowledged_at: acked,
});

describe("unhandled alerts", () => {
  it("classifies kinds for the activity list", () => {
    expect(isActionableAlertKind("threshold")).toBe(true);
    expect(isActionableAlertKind("flood")).toBe(true);
    expect(isActionableAlertKind("generic")).toBe(false);
    expect(isActionableAlertKind("digest")).toBe(false);
  });

  it("counts a delivered actionable alert, not test alerts or digests", () => {
    expect(isUnhandledAlertEvent(ev("threshold", ["email"]))).toBe(true);
    expect(isUnhandledAlertEvent(ev("generic", ["email"]))).toBe(false);
    expect(isUnhandledAlertEvent(ev("digest", ["email"]))).toBe(false);
  });
});

describe("undelivered safety alerts count as unhandled", () => {
  it("counts held/failed freeze, leak, power, sensor-silent, early-warning and stuck-probe alerts", () => {
    for (const kind of ["threshold", "flood", "power", "outage", "freeze", "forecast", "runway", "nws", "stuck"]) {
      expect(isUnhandledAlertEvent(ev(kind, [])), kind).toBe(true);
    }
  });

  it("does not count held or failed routine and informational alerts", () => {
    for (const kind of ["rule", "battery", "rate", "generic", "digest", "recovery"]) {
      expect(isUnhandledAlertEvent(ev(kind, [])), kind).toBe(false);
    }
  });

  it("still counts a routine alert that reached someone", () => {
    expect(isUnhandledAlertEvent(ev("rule", ["email"]))).toBe(true);
  });

  it("does not count a sent alert once acknowledged, nor an acknowledged held one", () => {
    expect(isUnhandledAlertEvent(ev("threshold", ["email"], minutesAgo(1)))).toBe(false);
    expect(isUnhandledAlertEvent(ev("flood", [], minutesAgo(1)))).toBe(false);
  });
});
