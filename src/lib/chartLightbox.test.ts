import { describe, expect, it } from "vitest";
import { expandedChartDialogAttrs } from "./chartLightbox";

describe("expandedChartDialogAttrs", () => {
  it("marks the expanded chart as a labelled modal dialog", () => {
    expect(expandedChartDialogAttrs(true, "Battery")).toEqual({
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "Battery",
    });
  });

  it("adds nothing while collapsed", () => {
    expect(expandedChartDialogAttrs(false, "Battery")).toEqual({});
  });
});
