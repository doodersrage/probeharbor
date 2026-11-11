import { describe, expect, it } from "vitest";
import { escapeHtml } from "./htmlEscape";
import { verifyInboundRequest } from "./inboundSigning";
import { timestampedSignatureHeaders } from "./webhookSigning";

describe("escapeHtml", () => {
  it("escapes markup", () => {
    expect(escapeHtml(`<img src=x onerror="alert(1)">`)).toBe(
      "&lt;img src=x onerror=&quot;alert(1)&quot;&gt;",
    );
  });
});

describe("verifyInboundRequest", () => {
  it("rejects missing signing secret (fail closed)", async () => {
    const headers = new Headers(await timestampedSignatureHeaders("abc", "{}", Date.now()));
    expect((await verifyInboundRequest(null, "{}", headers)).ok).toBe(false);
    expect((await verifyInboundRequest("", "{}", headers)).ok).toBe(false);
  });
});
