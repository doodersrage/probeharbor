import { beforeEach, describe, expect, it, vi } from "vitest";
import type { APIContext } from "astro";

const mockBuildSignInRedirectUrl = vi.fn();
vi.mock("../../../../lib/signInErrors", () => ({
  buildSignInRedirectUrl: (...a: unknown[]) => mockBuildSignInRedirectUrl(...a),
}));

vi.mock("../../../../lib/siteUrl", () => ({
  OAUTH_NEXT_COOKIE: "oauth_next",
  OAUTH_REF_COOKIE: "oauth_ref",
}));

const mockStartBetterAuthOAuth = vi.fn();
vi.mock("../../../../lib/betterAuthAppHandoff", () => ({
  startBetterAuthOAuth: (...a: unknown[]) => mockStartBetterAuthOAuth(...a),
}));

const mockSetMobileOAuthCookie = vi.fn();
vi.mock("../../../../lib/mobileAuthRedirect", () => ({
  setMobileOAuthCookie: (...a: unknown[]) => mockSetMobileOAuthCookie(...a),
}));

function makeCookies() {
  const store = new Map<string, string>();
  return {
    get: (name: string) => (store.has(name) ? { value: store.get(name)! } : undefined),
    set: vi.fn((name: string, value: string) => store.set(name, value)),
    delete: vi.fn((name: string) => store.delete(name)),
  };
}

function makeContext(search: Record<string, string> = {}): APIContext {
  const url = new URL("https://example.com/api/auth/mobile/start");
  for (const [k, v] of Object.entries(search)) url.searchParams.set(k, v);
  const redirect = vi.fn((path: string) => new Response(null, { status: 302, headers: { Location: path } }));
  return {
    url,
    cookies: makeCookies(),
    redirect,
    request: new Request(url),
    site: new URL("https://example.com"),
  } as unknown as APIContext;
}

beforeEach(() => {
  mockBuildSignInRedirectUrl.mockReset().mockImplementation((code: string) => `/signin?error=${code}`);
  mockStartBetterAuthOAuth
    .mockReset()
    .mockResolvedValue(new Response(null, { status: 302, headers: { Location: "https://provider.example.com/authorize" } }));
  mockSetMobileOAuthCookie.mockReset();
});

describe("GET /api/auth/mobile/start", () => {
  it("redirects to oauth_failed for an unrecognized provider", async () => {
    const { GET } = await import("./start");

    const response = await GET(makeContext({ provider: "carrier_pigeon" }));

    expect(response.headers.get("Location")).toBe("/signin?error=oauth_failed");
    expect(mockSetMobileOAuthCookie).not.toHaveBeenCalled();
    expect(mockStartBetterAuthOAuth).not.toHaveBeenCalled();
  });

  it("marks the flow as mobile, clears next/ref and redirects to the provider", async () => {
    const { GET } = await import("./start");
    const context = makeContext({ provider: "Google", app: "dev.probeharbor.app" });

    const response = await GET(context);

    expect(mockSetMobileOAuthCookie).toHaveBeenCalledWith(context.cookies, "dev.probeharbor.app");
    expect(context.cookies.delete).toHaveBeenCalledWith("oauth_next", { path: "/" });
    expect(context.cookies.delete).toHaveBeenCalledWith("oauth_ref", { path: "/" });
    expect(mockStartBetterAuthOAuth).toHaveBeenCalledWith(context.request, "google");
    expect(response.headers.get("Location")).toBe("https://provider.example.com/authorize");
  });

  it("redirects to oauth_failed when the provider can't be started", async () => {
    mockStartBetterAuthOAuth.mockResolvedValue(null);
    const { GET } = await import("./start");

    const response = await GET(makeContext({ provider: "github" }));

    expect(response.headers.get("Location")).toBe("/signin?error=oauth_failed");
  });
});
