import { describe, expect, it } from "vitest";
import { detectIngestClient, ingestClientPatch, readIngestClient } from "./ingestClient";

const at = "2026-10-12T12:00:00.000Z";

describe("ingest client detection", () => {
  it("recognizes Home Assistant's HTTP session", () => {
    expect(detectIngestClient("HomeAssistant/2026.10.1 aiohttp/3.11.0 Python/3.13", at)).toEqual({
      name: "Home Assistant",
      version: "2026.10.1",
      at,
    });
    expect(detectIngestClient("curl/8.5.0", at)).toBeNull();
    expect(detectIngestClient(null, at)).toBeNull();
  });

  it("rewrites device meta only on a change or hourly", () => {
    const next = detectIngestClient("HomeAssistant/2026.10.1", at);
    const prev = { name: "Home Assistant", version: "2026.10.1", at: "2026-10-12T11:30:00.000Z" };
    expect(ingestClientPatch(prev, next)).toBeNull();
    expect(ingestClientPatch({ ...prev, at: "2026-10-12T10:00:00.000Z" }, next)).toEqual(next);
    expect(ingestClientPatch({ ...prev, version: "2026.9.0" }, next)).toEqual(next);
    expect(ingestClientPatch(undefined, next)).toEqual(next);
    expect(ingestClientPatch(prev, null)).toBeNull();
  });

  it("reads only well-formed stored values", () => {
    expect(readIngestClient({ name: "Other", at })).toBeNull();
    expect(readIngestClient("x")).toBeNull();
  });
});
