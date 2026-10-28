import { describe, expect, it } from "vitest";
import { REDACTED, scrubBreadcrumb, scrubDeep, scrubEvent, scrubText, scrubUrl } from "./sentryScrub";

const KEY = "0123456789abcdef0123456789abcdef0123456789abcdef";

describe("scrubUrl", () => {
  it.each([
    [`https://probeharbor.dev/api/ingest/${KEY}`, `https://probeharbor.dev/api/ingest/${REDACTED}`],
    [`/share/${KEY}`, `/share/${REDACTED}`],
    [`/embed/${KEY}`, `/embed/${REDACTED}`],
    [`/api/share/${KEY}/readings?format=prometheus`, `/api/share/${REDACTED}/readings?format=prometheus`],
    ["/status/ffffffffffffffffffffffffffffffffffff", `/status/${REDACTED}`],
    ["/badge/status/abc123.svg", `/badge/status/${REDACTED}`],
    ["/invite/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", `/invite/${REDACTED}`],
    ["/api/inbound/gtw_0123456789abcdef0123", `/api/inbound/${REDACTED}`],
    ["/share/chart/short-ish-token-1", `/share/chart/${REDACTED}`],
  ])("masks the credential in %s", (input, expected) => {
    expect(scrubUrl(input)).toBe(expected);
  });

  it("keeps ordinary page paths readable", () => {
    expect(scrubUrl("/dashboard/share/links")).toBe("/dashboard/share/links");
    expect(scrubUrl("/api/share/manage")).toBe("/api/share/manage");
    expect(scrubUrl("/api/status/manage")).toBe("/api/status/manage");
    expect(scrubUrl("/system-status")).toBe("/system-status");
  });

  it("masks secret query parameters and token-like values", () => {
    expect(scrubUrl("/api/alerts/snooze?token=0123456789abcdef0123456789abcdef&lang=de")).toBe(
      `/api/alerts/snooze?token=${REDACTED}&lang=de`,
    );
    expect(scrubUrl(`/x?key=abc&other=${KEY}`)).toBe(`/x?key=${REDACTED}&other=${REDACTED}`);
    expect(scrubUrl("/page#access_token=abc")).toBe(`/page#${REDACTED}`);
  });

  it("keeps only the origin of third-party URLs (webhooks can hide secrets anywhere)", () => {
    expect(scrubUrl("https://api.telegram.org/bot123456%3AAAH-secret_x/sendMessage")).toBe(
      `https://api.telegram.org/${REDACTED}`,
    );
    expect(scrubUrl("https://hooks.zapier.com/hooks/catch/123/ab1cd2/")).toBe(`https://hooks.zapier.com/${REDACTED}`);
    expect(scrubUrl("https://n8n.example.com/webhook?pw=short")).toBe(`https://n8n.example.com/${REDACTED}`);
    expect(scrubUrl("https://example.com")).toBe("https://example.com");
  });

  it("still masks Telegram, Slack and Discord secrets in relative or own-host paths", () => {
    expect(scrubUrl("/bot123456:AAH-secret_x/sendMessage")).toBe(`/bot${REDACTED}/sendMessage`);
    expect(scrubUrl("/services/T000/B000/XXXXsecret")).toBe(`/services/${REDACTED}`);
    expect(scrubUrl("/api/webhooks/123456/abcDEF-secret")).toBe(`/api/webhooks/${REDACTED}`);
  });

  it("scrubs own-host absolute URLs by path, not by origin", () => {
    expect(scrubUrl(`https://www.probeharbor.dev/share/${KEY}`)).toBe(`https://www.probeharbor.dev/share/${REDACTED}`);
  });
});

describe("scrubText", () => {
  it("scrubs URLs and tokens inside error messages", () => {
    const text = scrubText(`fetch failed: https://probeharbor.dev/api/ingest/${KEY} (key ${KEY})`);
    expect(text).not.toContain(KEY);
    expect(text).toContain(`/api/ingest/${REDACTED}`);
  });
});

describe("scrubEvent", () => {
  it("removes credentials from the request, exception, message and breadcrumbs", () => {
    const event = scrubEvent({
      message: `boom /share/${KEY}`,
      request: {
        url: `https://probeharbor.dev/api/ingest/${KEY}`,
        query_string: "token=abc&x=1",
        headers: { "X-Ingest-Key": KEY, Cookie: "sb=1", "X-ProbeHarbor-Signature": "sha256=1", "User-Agent": "ESP32" },
        cookies: { sb: "1" },
        data: '{"password":"wifi"}',
      },
      exception: { values: [{ value: `invalid key ${KEY}` }] },
      breadcrumbs: [{ data: { url: "https://api.telegram.org/bot1:secret/sendMessage" } }],
    });

    const json = JSON.stringify(event);
    expect(json).not.toContain(KEY);
    expect(json).not.toContain("secret");
    expect(json).not.toContain("wifi");
    expect(event.request?.headers).toEqual({ "User-Agent": "ESP32" });
    expect(event.request?.cookies).toBeUndefined();
    expect(event.request?.query_string).toBe(`token=${REDACTED}&x=1`);
  });
});

describe("scrubBreadcrumb / scrubDeep", () => {
  it("scrubs fetch breadcrumb URLs and navigation targets", () => {
    const crumb = scrubBreadcrumb({ data: { url: `/api/share/${KEY}/readings`, to: `/invite/${KEY}`, from: "/" } });
    expect(JSON.stringify(crumb)).not.toContain(KEY);
  });

  it("scrubs strings nested in replay recording events", () => {
    const recording = scrubDeep({ data: { payload: { description: `https://probeharbor.dev/share/${KEY}`, list: [KEY] } } });
    expect(JSON.stringify(recording)).not.toContain(KEY);
  });
});
