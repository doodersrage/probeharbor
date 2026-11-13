import { describe, expect, it } from "vitest";
import { interpretIngestPayload } from "./ingestInterpret";

describe("interpretIngestPayload: tls", () => {
  it('flags "tls":"unverified" and nothing else', () => {
    expect(interpretIngestPayload({ temp1: 40, tls: "unverified" }).tlsUnverified).toBe(true);
    expect(interpretIngestPayload({ temp1: 40 }).tlsUnverified).toBe(false);
    expect(interpretIngestPayload({ temp1: 40, tls: "verified" }).tlsUnverified).toBe(false);
    expect(interpretIngestPayload({ temp1: 40, tls: true }).tlsUnverified).toBe(false);
  });

  it("is a device field, not a sensor", () => {
    const result = interpretIngestPayload({ temp1: 40, tls: "unverified" });
    expect(result.readings.map((r) => r.key)).toEqual(["temp1"]);
  });
});
