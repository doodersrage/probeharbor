import { describe, expect, it } from "vitest";
import { uniqueDeviceName } from "./uniqueDeviceName";

describe("uniqueDeviceName", () => {
  it("keeps a free name and numbers a taken one", () => {
    expect(uniqueDeviceName("Workshop probe", [])).toBe("Workshop probe");
    expect(uniqueDeviceName("Workshop probe", ["Workshop probe"])).toBe("Workshop probe 2");
    expect(uniqueDeviceName("Workshop probe", ["workshop probe", "Workshop probe 2"])).toBe("Workshop probe 3");
  });
});
