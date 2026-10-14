import { describe, expect, it } from "vitest";
import { formatAlertKind } from "./alertKindLabels";

describe("formatAlertKind", () => {
  it("names known kinds plainly and tidies unknown ones", () => {
    expect(formatAlertKind("threshold")).toBe("Freeze or humidity");
    expect(formatAlertKind("rate")).toBe("Fast temperature drop");
    expect(formatAlertKind("door_left_open")).toBe("Door left open");
    expect(formatAlertKind(null)).toBe("Alert");
  });
});
