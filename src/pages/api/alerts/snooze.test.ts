import { beforeEach, describe, expect, it, vi } from "vitest";
import type { APIContext } from "astro";

const mockApplySnoozeToken = vi.fn();
vi.mock("../../../lib/alertSnoozeTokens", () => ({
  applySnoozeToken: (...a: unknown[]) => mockApplySnoozeToken(...a),
}));

const mockGetUserById = vi.fn();
const mockTokenRow = vi.fn();
vi.mock("../../../lib/supabase", () => {
  const chain = {
    select: () => chain,
    eq: () => chain,
    maybeSingle: () => mockTokenRow(),
  };
  return {
    createServerClient: () => ({ from: () => chain }),
    createAdminClient: () => ({ auth: { admin: { getUserById: (...a: unknown[]) => mockGetUserById(...a) } } }),
  };
});

function makeContext(query: string): APIContext {
  const url = new URL(`https://example.com/api/alerts/snooze${query}`);
  return { url } as unknown as APIContext;
}

beforeEach(() => {
  mockApplySnoozeToken.mockReset();
  mockTokenRow.mockReset().mockResolvedValue({ data: { user_id: "user-1" } });
  mockGetUserById.mockReset().mockResolvedValue({ data: { user: { user_metadata: {} } } });
});

describe("POST /api/alerts/snooze", () => {
  it("returns 400 when there is no token", async () => {
    const { POST } = await import("./snooze");

    const response = await POST(makeContext(""));

    expect(response.status).toBe(400);
    expect(await response.text()).toBe("Missing token");
    expect(mockApplySnoozeToken).not.toHaveBeenCalled();
  });

  it("applies the token and redirects with the success message", async () => {
    mockApplySnoozeToken.mockResolvedValue({ ok: true, message: "Snoozed for 4 hours." });
    const { POST } = await import("./snooze");

    const response = await POST(makeContext("?token=tok-1"));

    expect(response.status).toBe(302);
    expect(mockApplySnoozeToken).toHaveBeenCalledWith("tok-1", "en");
    const location = new URL(response.headers.get("Location")!);
    expect(location.searchParams.get("alert_saved")).toBe("1");
    expect(location.searchParams.get("snooze")).toBe("1");
    expect(location.searchParams.get("snooze_msg")).toBe("Snoozed for 4 hours.");
  });

  it("redirects with snooze=0 when the token application fails", async () => {
    mockApplySnoozeToken.mockResolvedValue({ ok: false, message: "Invalid token." });
    const { POST } = await import("./snooze");

    const response = await POST(makeContext("?token=bad"));

    const location = new URL(response.headers.get("Location")!);
    expect(location.searchParams.get("snooze")).toBe("0");
    expect(location.searchParams.get("snooze_msg")).toBe("Invalid token.");
  });
});

describe("GET /api/alerts/snooze", () => {
  it("returns 400 when there is no token", async () => {
    const { GET } = await import("./snooze");

    const response = await GET(makeContext(""));

    expect(response.status).toBe(400);
  });

  it("renders a confirm page with a POST form pointing back at this endpoint", async () => {
    const { GET } = await import("./snooze");

    const response = await GET(makeContext("?token=tok-1"));

    expect(response.status).toBe(200);
    const html = await response.text();
    expect(html).toContain('action="/api/alerts/snooze?token=tok-1"');
    expect(html).toContain('method="post"');
  });

  it("does not call applySnoozeToken (no side effects until POST)", async () => {
    const { GET } = await import("./snooze");

    await GET(makeContext("?token=tok-1"));

    expect(mockApplySnoozeToken).not.toHaveBeenCalled();
  });
});

describe("snooze links in the alert owner's language", () => {
  it("renders the confirm page and the result in Spanish", async () => {
    const { ensureLocale } = await import("../../../i18n/catalog");
    await ensureLocale("es", ["app"]);
    mockGetUserById.mockResolvedValue({ data: { user: { user_metadata: { locale: "es" } } } });
    const { GET, POST } = await import("./snooze");

    const html = await (await GET(makeContext("?token=tok-1"))).text();
    expect(html).toContain('<html lang="es">');
    expect(html).toContain("<h1>¿Posponer las alertas?</h1>");

    mockApplySnoozeToken.mockResolvedValue({ ok: true, message: "Alertas pospuestas 24 horas." });
    await POST(makeContext("?token=tok-1"));
    expect(mockApplySnoozeToken).toHaveBeenCalledWith("tok-1", "es");
  });
});
