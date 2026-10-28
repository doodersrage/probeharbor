import { beforeEach, describe, expect, it, vi } from "vitest";
import type { APIContext } from "astro";

const mockApplyAckToken = vi.fn();
vi.mock("../../../lib/alertAckTokens", () => ({
  applyAckToken: (...a: unknown[]) => mockApplyAckToken(...a),
}));

const mockGetUserById = vi.fn();
vi.mock("../../../lib/supabase", () => ({
  createAdminClient: () => ({ auth: { admin: { getUserById: (...a: unknown[]) => mockGetUserById(...a) } } }),
}));

function makeContext(query: string): APIContext {
  const url = new URL(`https://example.com/api/alerts/ack${query}`);
  return { url } as unknown as APIContext;
}

beforeEach(() => {
  mockApplyAckToken.mockReset();
  mockGetUserById.mockReset().mockResolvedValue({ data: { user: { user_metadata: {} } } });
});

describe("POST /api/alerts/ack", () => {
  it("passes the link's event id through, so only that alert is acknowledged", async () => {
    mockApplyAckToken.mockResolvedValue({ ok: true, message: "Handled" });
    const { POST } = await import("./ack");

    await POST(makeContext("?uid=user-1&eid=42&exp=9999999999999&sig=abc"));

    expect(mockApplyAckToken).toHaveBeenCalledWith("user-1", 9999999999999, "abc", expect.any(String), 42);
  });

  it("rejects a malformed event id", async () => {
    const { POST } = await import("./ack");

    const response = await POST(makeContext("?uid=user-1&eid=42abc&exp=9999999999999&sig=abc"));

    expect(response.headers.get("Location")).toBe("https://example.com/dashboard/alerts?ack_error=1");
    expect(mockApplyAckToken).not.toHaveBeenCalled();
  });

  it("keeps the event id in the confirm page's form", async () => {
    const { GET } = await import("./ack");

    const response = await GET(makeContext("?uid=user-1&eid=42&exp=9999999999999&sig=abc"));

    expect(await response.text()).toContain("eid=42");
  });

  it("redirects with ack_error when uid is missing", async () => {
    const { POST } = await import("./ack");

    const response = await POST(makeContext("?exp=123&sig=abc"));

    expect(response.status).toBe(302);
    expect(response.headers.get("Location")).toBe(
      "https://example.com/dashboard/alerts?ack_error=1",
    );
    expect(mockApplyAckToken).not.toHaveBeenCalled();
  });

  it("redirects with ack_error when exp isn't a finite number", async () => {
    const { POST } = await import("./ack");

    const response = await POST(makeContext("?uid=user-1&exp=not-a-number&sig=abc"));

    expect(response.headers.get("Location")).toBe(
      "https://example.com/dashboard/alerts?ack_error=1",
    );
  });

  it("applies the token and redirects with the success message", async () => {
    mockApplyAckToken.mockResolvedValue({ ok: true, message: "Marked handled." });
    const { POST } = await import("./ack");

    const response = await POST(makeContext("?uid=user-1&exp=123&sig=abc"));

    expect(mockApplyAckToken).toHaveBeenCalledWith("user-1", 123, "abc", "en", null);
    const location = new URL(response.headers.get("Location")!);
    expect(location.searchParams.get("ack_ok")).toBe("1");
    expect(location.searchParams.get("ack_msg")).toBe("Marked handled.");
    expect(location.searchParams.get("ack_error")).toBeNull();
  });

  it("redirects with ack_error and ack_ok=0 when the token application fails", async () => {
    mockApplyAckToken.mockResolvedValue({ ok: false, message: "Invalid or expired." });
    const { POST } = await import("./ack");

    const response = await POST(makeContext("?uid=user-1&exp=123&sig=abc"));

    const location = new URL(response.headers.get("Location")!);
    expect(location.searchParams.get("ack_ok")).toBe("0");
    expect(location.searchParams.get("ack_error")).toBe("1");
  });

  it("treats a missing sig as an empty string rather than failing to parse the url", async () => {
    mockApplyAckToken.mockResolvedValue({ ok: true, message: "ok" });
    const { POST } = await import("./ack");

    await POST(makeContext("?uid=user-1&exp=123"));

    expect(mockApplyAckToken).toHaveBeenCalledWith("user-1", 123, "", "en", null);
  });
});

describe("GET /api/alerts/ack", () => {
  it("redirects with ack_error when any required param is missing", async () => {
    const { GET } = await import("./ack");

    const response = await GET(makeContext("?uid=user-1"));

    expect(response.status).toBe(302);
    expect(response.headers.get("Location")).toBe(
      "https://example.com/dashboard/alerts?ack_error=1",
    );
  });

  it("renders a confirm page with a POST form pointing back at this endpoint", async () => {
    const { GET } = await import("./ack");

    const response = await GET(makeContext("?uid=user-1&exp=123&sig=abc"));

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("text/html; charset=utf-8");
    const html = await response.text();
    expect(html).toContain('action="/api/alerts/ack?uid=user-1&exp=123&sig=abc"');
    expect(html).toContain('method="post"');
  });

  it("does not call applyAckToken (no side effects until POST)", async () => {
    const { GET } = await import("./ack");

    await GET(makeContext("?uid=user-1&exp=123&sig=abc"));

    expect(mockApplyAckToken).not.toHaveBeenCalled();
  });
});

describe("ack links in the alert owner's language", () => {
  it("renders the confirm page and the result in German", async () => {
    const { ensureLocale } = await import("../../../i18n/catalog");
    await ensureLocale("de", ["app"]);
    mockGetUserById.mockResolvedValue({ data: { user: { user_metadata: { locale: "de" } } } });
    const { GET, POST } = await import("./ack");

    const html = await (await GET(makeContext("?uid=user-1&exp=123&sig=abc"))).text();
    expect(html).toContain('<html lang="de">');
    expect(html).toContain("<h1>Alarm bestätigen?</h1>");
    expect(html).toContain("Ja, als erledigt markieren");

    mockApplyAckToken.mockResolvedValue({ ok: true, message: "Alarm als erledigt markiert." });
    await POST(makeContext("?uid=user-1&exp=123&sig=abc"));
    expect(mockApplyAckToken).toHaveBeenCalledWith("user-1", 123, "abc", "de", null);
  });
});
