import { beforeEach, describe, expect, it, vi } from "vitest";
import type { APIContext } from "astro";

const mockGetAuthFromRequest = vi.fn();
vi.mock("../../../lib/auth", () => ({
  getAuthFromRequest: (...a: unknown[]) => mockGetAuthFromRequest(...a),
}));

const mockGetOrCreateHouseholdForUser = vi.fn();
vi.mock("../../../lib/households", () => ({
  getOrCreateHouseholdForUser: (...a: unknown[]) => mockGetOrCreateHouseholdForUser(...a),
}));

const mockGetUserEntitlements = vi.fn();
vi.mock("../../../lib/entitlements", () => ({
  getUserEntitlements: (...a: unknown[]) => mockGetUserEntitlements(...a),
}));

const mockRequireHouseholdManager = vi.fn();
vi.mock("../../../lib/householdAuth", () => ({
  requireHouseholdManager: (...a: unknown[]) => mockRequireHouseholdManager(...a),
  redirectUnlessManager: (
    manager: { ok: boolean; error?: string },
    redirectTo: string,
    redirect: (url: string) => Response,
  ) => {
    if (manager.ok) return null;
    return redirect(
      `${redirectTo}?error=${manager.error === "manager_required" ? "manager_required" : "1"}`,
    );
  },
}));

const mockRecordHouseholdActivity = vi.fn();
vi.mock("../../../lib/householdActivity", () => ({
  recordHouseholdActivity: (...a: unknown[]) => mockRecordHouseholdActivity(...a),
}));

const mockFormRedirectPath = vi.fn();
vi.mock("../../../lib/siteUrl", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../../../lib/siteUrl")>()),
  formRedirectPath: (...a: unknown[]) => mockFormRedirectPath(...a),
}));

const mockSetSecretFlash = vi.fn();
vi.mock("../../../lib/secretFlash", () => ({
  FLASH_SHARE_TOKEN: "tt_flash_share_token",
  setSecretFlash: (...a: unknown[]) => mockSetSecretFlash(...a),
}));

const mockListShareLinks = vi.fn();
const mockDeleteShareLink = vi.fn();
const mockFindShareLink = vi.fn();
const mockReplaceShareLinkToken = vi.fn();
const mockCountLiveShareLinks = vi.fn();
const mockInsertShareLink = vi.fn();
vi.mock("../../../lib/shareLinksStore", () => ({
  listShareLinks: (...a: unknown[]) => mockListShareLinks(...a),
  deleteShareLink: (...a: unknown[]) => mockDeleteShareLink(...a),
  findShareLink: (...a: unknown[]) => mockFindShareLink(...a),
  replaceShareLinkToken: (...a: unknown[]) => mockReplaceShareLinkToken(...a),
  countLiveShareLinks: (...a: unknown[]) => mockCountLiveShareLinks(...a),
  insertShareLink: (...a: unknown[]) => mockInsertShareLink(...a),
}));

function fakeRedirect(path: string): Response {
  return new Response(null, { status: 302, headers: { Location: path } });
}

function makeGetContext(): APIContext {
  return {
    request: new Request("https://example.com/api/share/manage"),
    cookies: {},
  } as unknown as APIContext;
}

function makePostContext(fields: Record<string, string>): APIContext {
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) form.set(key, value);
  const request = { formData: () => Promise.resolve(form) } as unknown as Request;
  return {
    request,
    cookies: {},
    redirect: fakeRedirect,
  } as unknown as APIContext;
}

beforeEach(() => {
  mockGetAuthFromRequest.mockReset().mockResolvedValue({
    user: { id: "user-1", email: "user@example.com" },
  });
  mockGetOrCreateHouseholdForUser.mockReset().mockResolvedValue({
    householdId: "house-1",
  });
  mockGetUserEntitlements.mockReset().mockResolvedValue({
    canCreateShareLinks: true,
    canCreateFamilyShareLink: true,
  });
  mockRequireHouseholdManager.mockReset().mockResolvedValue({ ok: true });
  mockRecordHouseholdActivity.mockReset().mockResolvedValue(undefined);
  mockFormRedirectPath.mockReset().mockReturnValue("/dashboard/share");
  mockSetSecretFlash.mockReset();
  mockListShareLinks.mockReset().mockResolvedValue({
    links: [
      {
        id: "link-1",
        token: "abcd1234tokensecret",
        token_hash: "stored-hash",
        token_preview: null,
        scope: "live",
        label: "Live",
        expires_at: null,
        created_at: "2024-01-01",
      },
    ],
    error: null,
  });
  mockDeleteShareLink.mockReset().mockResolvedValue(undefined);
  mockFindShareLink.mockReset().mockResolvedValue(null);
  mockReplaceShareLinkToken.mockReset().mockResolvedValue({ error: null });
  mockCountLiveShareLinks.mockReset().mockResolvedValue(0);
  mockInsertShareLink.mockReset().mockResolvedValue({ error: null });
});

describe("GET /api/share/manage", () => {
  it("returns 401 when not authenticated", async () => {
    mockGetAuthFromRequest.mockResolvedValue({ user: null });
    const { GET } = await import("./manage");

    const response = await GET(makeGetContext());

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: "Unauthorized" });
  });

  it("returns 500 when household resolution fails", async () => {
    mockGetOrCreateHouseholdForUser.mockResolvedValue({
      householdId: null,
      error: "no household",
    });
    const { GET } = await import("./manage");

    const response = await GET(makeGetContext());

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: "no household" });
  });

  it("returns full tokens for household managers", async () => {
    const { GET } = await import("./manage");

    const response = await GET(makeGetContext());

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      links: [
        {
          id: "link-1",
          token: "abcd1234tokensecret",
          scope: "live",
          label: "Live",
          expires_at: null,
          created_at: "2024-01-01",
          token_preview: "cret",
        },
      ],
    });
  });

  it("masks tokens for non-managers", async () => {
    mockRequireHouseholdManager.mockResolvedValue({ ok: false });
    const { GET } = await import("./manage");

    const response = await GET(makeGetContext());

    expect(await response.json()).toEqual({
      links: [
        {
          id: "link-1",
          scope: "live",
          label: "Live",
          expires_at: null,
          created_at: "2024-01-01",
          token_preview: "cret",
        },
      ],
    });
  });
});

describe("GET /api/share/manage — errors", () => {
  it("returns 500 when the links can't be listed", async () => {
    mockListShareLinks.mockResolvedValue({ links: [], error: "db down" });
    const { GET } = await import("./manage");

    const response = await GET(makeGetContext());

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: "db down" });
  });
});

describe("POST /api/share/manage", () => {
  it("redirects to signin when not authenticated", async () => {
    mockGetAuthFromRequest.mockResolvedValue({ user: null });
    const { POST } = await import("./manage");

    const response = await POST(makePostContext({}));

    expect(response.headers.get("Location")).toBe("/signin");
  });

  it("redirects with manager_required when the user is not a manager", async () => {
    mockRequireHouseholdManager.mockResolvedValue({
      ok: false,
      error: "manager_required",
    });
    const { POST } = await import("./manage");

    const response = await POST(makePostContext({}));

    expect(response.headers.get("Location")).toBe(
      "/dashboard/share?error=manager_required",
    );
  });

  it("redirects with pro_required when the plan cannot create share links", async () => {
    mockGetUserEntitlements.mockResolvedValue({
      canCreateShareLinks: false,
      canCreateFamilyShareLink: false,
    });
    const { POST } = await import("./manage");

    const response = await POST(makePostContext({ scope: "live" }));

    expect(response.headers.get("Location")).toBe(
      "/dashboard/share?error=pro_required",
    );
  });

  it("creates a share link, flashes the token, and redirects", async () => {
    const { POST } = await import("./manage");

    const response = await POST(
      makePostContext({ scope: "live", label: "Family", expires_days: "7" }),
    );

    expect(mockInsertShareLink).toHaveBeenCalledWith(
      expect.objectContaining({
        household_id: "house-1",
        scope: "live",
        label: "Family",
        created_by: "user-1",
      }),
    );
    expect(mockRecordHouseholdActivity).toHaveBeenCalledWith({
      householdId: "house-1",
      userId: "user-1",
      action: "share_link_created",
      detail: "live",
    });
    expect(mockSetSecretFlash).toHaveBeenCalledWith(
      {},
      "tt_flash_share_token",
      expect.any(String),
    );
    expect(response.headers.get("Location")).toBe("/dashboard/share?created=1");

    // Only the hash and last 4 characters are stored, never the token.
    const token = mockSetSecretFlash.mock.calls[0][2] as string;
    const { sha256Hex } = await import("../../../lib/shareLinkTokens");
    expect(token).toMatch(/^[0-9a-f]{48}$/);
    expect(mockInsertShareLink).toHaveBeenCalledWith(
      expect.objectContaining({
        token: null,
        token_hash: await sha256Hex(token),
        token_preview: token.slice(-4),
      }),
    );
  });

  describe("regenerate", () => {
    function withLink(link: { id: string; scope: string } | null) {
      mockFindShareLink.mockResolvedValue(link);
    }

    it("stores a new hash, clears the raw token, flashes the new link once", async () => {
      withLink({ id: "link-1", scope: "metrics" });
      const { POST } = await import("./manage");

      const response = await POST(makePostContext({ action: "regenerate", id: "link-1" }));

      const token = mockSetSecretFlash.mock.calls[0][2] as string;
      const { sha256Hex } = await import("../../../lib/shareLinkTokens");
      expect(mockFindShareLink).toHaveBeenCalledWith("house-1", "link-1");
      expect(mockReplaceShareLinkToken).toHaveBeenCalledWith("house-1", "link-1", {
        token: null,
        token_hash: await sha256Hex(token),
        token_preview: token.slice(-4),
      });
      expect(mockRecordHouseholdActivity).toHaveBeenCalledWith(
        expect.objectContaining({ action: "share_link_regenerated", detail: "metrics" }),
      );
      expect(response.headers.get("Location")).toBe("/dashboard/share?regenerated=1");
    });

    it("lets a free family plan regenerate its live link, but not a Pro-only link", async () => {
      mockGetUserEntitlements.mockResolvedValue({
        canCreateShareLinks: false,
        canCreateFamilyShareLink: true,
      });
      const { POST } = await import("./manage");

      withLink({ id: "link-1", scope: "live" });
      const live = await POST(makePostContext({ action: "regenerate", id: "link-1" }));
      expect(live.headers.get("Location")).toBe("/dashboard/share?regenerated=1");

      mockReplaceShareLinkToken.mockClear();
      withLink({ id: "link-2", scope: "metrics" });
      const metrics = await POST(makePostContext({ action: "regenerate", id: "link-2" }));
      expect(metrics.headers.get("Location")).toBe("/dashboard/share?error=pro_required");
      expect(mockReplaceShareLinkToken).not.toHaveBeenCalled();
    });

    it("errors without touching anything for a link outside the household", async () => {
      withLink(null);
      const { POST } = await import("./manage");

      const response = await POST(makePostContext({ action: "regenerate", id: "other" }));

      expect(mockReplaceShareLinkToken).not.toHaveBeenCalled();
      expect(mockSetSecretFlash).not.toHaveBeenCalled();
      expect(response.headers.get("Location")).toBe("/dashboard/share?error=1");
    });

    it("errors without flashing a token when the new hash can't be stored", async () => {
      withLink({ id: "link-1", scope: "live" });
      mockReplaceShareLinkToken.mockResolvedValue({ error: "db down" });
      const { POST } = await import("./manage");

      const response = await POST(makePostContext({ action: "regenerate", id: "link-1" }));

      expect(mockSetSecretFlash).not.toHaveBeenCalled();
      expect(mockRecordHouseholdActivity).not.toHaveBeenCalled();
      expect(response.headers.get("Location")).toBe("/dashboard/share?error=1");
    });
  });

  it("caps a free family plan at one live link", async () => {
    mockGetUserEntitlements.mockResolvedValue({
      canCreateShareLinks: false,
      canCreateFamilyShareLink: true,
    });
    mockCountLiveShareLinks.mockResolvedValue(1);
    const { POST } = await import("./manage");

    const response = await POST(makePostContext({ scope: "metrics" }));

    expect(mockCountLiveShareLinks).toHaveBeenCalledWith("house-1");
    expect(mockInsertShareLink).not.toHaveBeenCalled();
    expect(response.headers.get("Location")).toBe("/dashboard/share?error=family_limit");
  });

  it("errors without flashing a token when the link can't be stored", async () => {
    mockInsertShareLink.mockResolvedValue({ error: "db down" });
    const { POST } = await import("./manage");

    const response = await POST(makePostContext({ scope: "live" }));

    expect(mockSetSecretFlash).not.toHaveBeenCalled();
    expect(response.headers.get("Location")).toBe("/dashboard/share?error=1");
  });

  it("revokes a share link and redirects", async () => {
    const { POST } = await import("./manage");

    const response = await POST(makePostContext({ action: "revoke", id: "link-1" }));

    expect(mockDeleteShareLink).toHaveBeenCalledWith("house-1", "link-1");
    expect(response.headers.get("Location")).toBe("/dashboard/share?revoked=1");
  });

  it("still revokes a share link after the plan is downgraded", async () => {
    mockGetUserEntitlements.mockResolvedValue({
      canCreateShareLinks: false,
      canCreateFamilyShareLink: false,
    });
    const { POST } = await import("./manage");

    const response = await POST(makePostContext({ action: "revoke", id: "link-1" }));

    expect(mockDeleteShareLink).toHaveBeenCalledWith("house-1", "link-1");
    expect(response.headers.get("Location")).toBe("/dashboard/share?revoked=1");
  });
});
