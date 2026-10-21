import { beforeEach, describe, expect, it, vi } from "vitest";
import type { APIContext } from "astro";

const mockAuth = vi.fn();
vi.mock("../../../lib/auth", () => ({ getAuthFromRequest: (...a: unknown[]) => mockAuth(...a) }));
const mockRestore = vi.fn();
vi.mock("../../../lib/alertSettingsHistory", () => ({ restoreAlertSettings: (...a: unknown[]) => mockRestore(...a) }));
const mockRequireEditor = vi.fn();
vi.mock("../../../lib/householdAuth", () => ({
  requireHouseholdEditor: (...a: unknown[]) => mockRequireEditor(...a),
  redirectUnlessEditor: (editor: { ok: boolean }, to: string, redirect: (p: string) => Response) =>
    editor.ok ? null : redirect(`${to}&error=viewer`),
}));
vi.mock("../../../lib/householdActivity", () => ({ recordHouseholdActivity: vi.fn() }));
vi.mock("../../../lib/households", () => ({ getUserHouseholdId: async () => "hh" }));

function ctx(form: Record<string, string>): APIContext {
  const formData = new FormData();
  for (const [k, v] of Object.entries(form)) formData.set(k, v);
  const redirect = vi.fn((path: string) => new Response(null, { status: 302, headers: { Location: path } }));
  return { request: { formData: async () => formData } as unknown as Request, cookies: {}, redirect } as unknown as APIContext;
}

beforeEach(() => {
  mockAuth.mockReset().mockResolvedValue({ session: {}, user: { id: "u1" } });
  mockRestore.mockReset().mockResolvedValue({ error: null });
  mockRequireEditor.mockReset().mockResolvedValue({ ok: true });
});

describe("alert-settings-restore", () => {
  it("restores the chosen entry and says so", async () => {
    const { POST } = await import("./alert-settings-restore");
    const res = await POST(ctx({ history_id: "12", redirect: "/dashboard/alerts?tab=settings" }));
    expect(mockRestore).toHaveBeenCalledWith("u1", 12, "en");
    expect(res.headers.get("Location")).toBe("/dashboard/alerts?tab=settings&alert_saved=restored");
  });

  it("rejects a bad id and reports a failed restore", async () => {
    const { POST } = await import("./alert-settings-restore");
    expect((await POST(ctx({ history_id: "abc" }))).headers.get("Location")).toContain("alert_error=restore_failed");
    mockRestore.mockResolvedValue({ error: "not_found" });
    expect((await POST(ctx({ history_id: "5" }))).headers.get("Location")).toContain("alert_error=restore_failed");
  });

  it("blocks view-only members", async () => {
    mockRequireEditor.mockResolvedValue({ ok: false });
    const { POST } = await import("./alert-settings-restore");
    await POST(ctx({ history_id: "12", redirect: "/dashboard/alerts?tab=settings" }));
    expect(mockRestore).not.toHaveBeenCalled();
  });
});
