import { describe, expect, it } from "vitest";
import {
  ALERT_ACTIVITY_FILTERS,
  alertActivityFilterOptions,
  resolveAlertActivityFilter,
} from "./alertActivityFilter";
import type { NotifyKind } from "./alerts";

describe("resolveAlertActivityFilter", () => {
  it("maps the freeze filter to the stored threshold kind", () => {
    expect(resolveAlertActivityFilter("threshold")).toEqual({ id: "threshold", kinds: ["threshold", "freeze"] });
  });

  it("keeps old ?activity_kind=freeze and =test links working", () => {
    expect(resolveAlertActivityFilter("freeze")?.kinds).toContain("threshold");
    expect(resolveAlertActivityFilter("test")).toEqual({ id: "generic", kinds: ["generic", "test"] });
  });

  it("maps single-kind options exactly", () => {
    expect(resolveAlertActivityFilter("flood")?.kinds).toEqual(["flood"]);
    expect(resolveAlertActivityFilter(" Power ")?.kinds).toEqual(["power"]);
    expect(resolveAlertActivityFilter("outage")?.kinds).toEqual(["outage"]);
  });

  it("shows everything for empty or unknown values", () => {
    expect(resolveAlertActivityFilter("")).toBeNull();
    expect(resolveAlertActivityFilter(null)).toBeNull();
    expect(resolveAlertActivityFilter("%")).toBeNull();
    expect(resolveAlertActivityFilter("thresh")).toBeNull();
  });

  it("covers every alert kind notifyUser can store", () => {
    const stored: NotifyKind[] = [
      "threshold",
      "rate",
      "outage",
      "forecast",
      "runway",
      "nws",
      "flood",
      "rule",
      "battery",
      "rssi",
      "stuck",
      "power",
      "recovery",
      "generic",
    ];
    const covered = new Set(ALERT_ACTIVITY_FILTERS.flatMap((filter) => filter.kinds));
    for (const kind of stored) expect(covered.has(kind)).toBe(true);
  });
});

describe("alertActivityFilterOptions", () => {
  it("labels options with the Activity list names", () => {
    const options = alertActivityFilterOptions("en", "Tests and messages");
    expect(options.find((o) => o.id === "threshold")?.label).toBe("Freeze or humidity");
    expect(options.find((o) => o.id === "flood")?.label).toBe("Leak");
    expect(options.find((o) => o.id === "outage")?.label).toBe("Sensor silent");
    expect(options.find((o) => o.id === "generic")?.label).toBe("Tests and messages");
    expect(new Set(options.map((o) => o.id)).size).toBe(options.length);
  });
});
