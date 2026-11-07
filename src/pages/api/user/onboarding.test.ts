import { beforeEach, describe, expect, it, vi } from "vitest";
import type { APIContext } from "astro";

const mockGetAuthFromCookies = vi.fn();
vi.mock("../../../lib/auth", () => ({
  getAuthFromCookies: (...a: unknown[]) => mockGetAuthFromCookies(...a),
}));

// The write itself (session token → user_profiles.metadata) is tested against
// Postgres in accountSettings.db.test.ts.
const mockUpdateSessionUserMetadata = vi.fn();
vi.mock("../../../lib/sessionMetadata", () => ({
  updateSessionUserMetadata: (...a: unknown[]) => mockUpdateSessionUserMetadata(...a),
}));

const mockFormRedirectPath = vi.fn();
vi.mock("../../../lib/siteUrl", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../../../lib/siteUrl")>()),
  formRedirectPath: (...a: unknown[]) => mockFormRedirectPath(...a),
}));

function fakeRedirect(path: string): Response {
  return new Response(null, { status: 302, headers: { Location: path } });
}

function makeContext(body: Record<string, string> = {}): APIContext {
  const formData = new FormData();
  for (const [key, value] of Object.entries(body)) formData.set(key, value);
  const request = { formData: async () => formData } as unknown as Request;
  const redirect = vi.fn(fakeRedirect);
  return { request, cookies: { get: vi.fn() }, redirect } as unknown as APIContext;
}

beforeEach(() => {
  mockGetAuthFromCookies.mockReset().mockResolvedValue({
    session: { access_token: "access-tok", refresh_token: "" },
    user: { id: "user-1", user_metadata: { existing: true } },
  });
  mockFormRedirectPath.mockReset().mockReturnValue("/dashboard");
  mockUpdateSessionUserMetadata.mockReset().mockResolvedValue({ user: { id: "user-1" }, error: null });
});

describe("POST /api/user/onboarding", () => {
  it("redirects to /signin when not authenticated", async () => {
    mockGetAuthFromCookies.mockResolvedValue({ session: null, user: null });
    const { POST } = await import("./onboarding");
    const context = makeContext();

    const response = await POST(context);

    expect(context.redirect).toHaveBeenCalledWith("/signin");
    expect(response.status).toBe(302);
    expect(mockUpdateSessionUserMetadata).not.toHaveBeenCalled();
  });

  it("dismisses onboarding, keeping the other settings", async () => {
    const { POST } = await import("./onboarding");
    const context = makeContext({ action: "dismiss" });

    const response = await POST(context);

    expect(mockUpdateSessionUserMetadata).toHaveBeenCalledWith("access-tok", "", {
      existing: true,
      onboarding_dismissed: true,
    });
    expect(context.redirect).toHaveBeenCalledWith("/dashboard?onboarding_dismissed=1");
    expect(response.status).toBe(302);
  });

  it("resets onboarding when action is reset", async () => {
    const { POST } = await import("./onboarding");
    const context = makeContext({ action: "reset" });

    await POST(context);

    expect(mockUpdateSessionUserMetadata).toHaveBeenCalledWith("access-tok", "", {
      existing: true,
      onboarding_dismissed: false,
    });
    expect(context.redirect).toHaveBeenCalledWith("/dashboard?onboarding_reset=1");
  });

  it("redirects with onboarding_error when the write fails (e.g. expired session)", async () => {
    mockUpdateSessionUserMetadata.mockResolvedValue({ user: null, error: new Error("Invalid session") });
    const { POST } = await import("./onboarding");
    const context = makeContext();

    await POST(context);

    expect(context.redirect).toHaveBeenCalledWith("/dashboard?onboarding_error=1");
  });
});
