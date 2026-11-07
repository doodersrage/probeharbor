import { beforeEach, describe, expect, it, vi } from "vitest";
import type { APIContext } from "astro";

const mockGetAuthFromCookies = vi.fn();
vi.mock("../../../../lib/auth", () => ({
  getAuthFromCookies: (...a: unknown[]) => mockGetAuthFromCookies(...a),
}));

const mockBuildSignInRedirectUrl = vi.fn();
vi.mock("../../../../lib/signInErrors", () => ({
  buildSignInRedirectUrl: (...a: unknown[]) => mockBuildSignInRedirectUrl(...a),
}));

vi.mock("../../../../lib/siteUrl", () => ({
  OAUTH_NEXT_COOKIE: "oauth_next",
  OAUTH_REF_COOKIE: "oauth_ref",
}));

const mockRedirectMobileOAuthComplete = vi.fn();
const mockSetMobileOAuthCookie = vi.fn();
vi.mock("../../../../lib/mobileAuthRedirect", () => ({
  redirectMobileOAuthComplete: (...a: unknown[]) => mockRedirectMobileOAuthComplete(...a),
  setMobileOAuthCookie: (...a: unknown[]) => mockSetMobileOAuthCookie(...a),
}));

const mockParseCompanionClient = vi.fn();
const mockSetCompanionClientCookie = vi.fn();
const mockSetCompanionLoopbackCookie = vi.fn();
vi.mock("../../../../lib/companionAuth", () => ({
  parseCompanionClient: (...a: unknown[]) => mockParseCompanionClient(...a),
  setCompanionClientCookie: (...a: unknown[]) => mockSetCompanionClientCookie(...a),
  setCompanionLoopbackCookie: (...a: unknown[]) => mockSetCompanionLoopbackCookie(...a),
}));

const mockBuildMfaChallengeUrl = vi.fn();
vi.mock("../../../../lib/mfa", () => ({
  buildMfaChallengeUrl: (...a: unknown[]) => mockBuildMfaChallengeUrl(...a),
}));

const mockHasValidMfaStepUpProof = vi.fn();
vi.mock("../../../../lib/mfaStepUpProof", () => ({
  hasValidMfaStepUpProof: (...a: unknown[]) => mockHasValidMfaStepUpProof(...a),
}));

const mockNeedsStepUp = vi.fn();
vi.mock("../../../../lib/betterAuthMfaGate", () => ({
  // The real gate asks the proof check only when a YubiKey is enrolled.
  betterAuthNeedsStepUp: async (user: { id: string }, hasProof: (id: string) => Promise<boolean>) =>
    (await mockNeedsStepUp(user)) && !(await hasProof(user.id)),
}));

const mockCreateAppSessionToken = vi.fn();
const mockStartBetterAuthOAuth = vi.fn();
vi.mock("../../../../lib/betterAuthAppHandoff", () => ({
  createAppSessionToken: (...a: unknown[]) => mockCreateAppSessionToken(...a),
  startBetterAuthOAuth: (...a: unknown[]) => mockStartBetterAuthOAuth(...a),
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
  const url = new URL("https://example.com/api/auth/companion/start");
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
  mockGetAuthFromCookies.mockReset().mockResolvedValue({ session: null, user: null });
  mockBuildSignInRedirectUrl.mockReset().mockImplementation((code: string) => `/signin?error=${code}`);
  mockRedirectMobileOAuthComplete.mockReset().mockResolvedValue(null);
  mockSetMobileOAuthCookie.mockReset();
  mockParseCompanionClient.mockReset().mockReturnValue("baybuddy");
  mockSetCompanionClientCookie.mockReset();
  mockSetCompanionLoopbackCookie.mockReset().mockReturnValue(true);
  mockBuildMfaChallengeUrl.mockReset().mockReturnValue("/signin/mfa?next=%2Fapi%2Fauth%2Fcompanion%2Fstart");
  mockHasValidMfaStepUpProof.mockReset().mockResolvedValue(true);
  mockNeedsStepUp.mockReset().mockResolvedValue(false);
  mockCreateAppSessionToken.mockReset().mockResolvedValue("app-token");
  mockStartBetterAuthOAuth
    .mockReset()
    .mockResolvedValue(new Response(null, { status: 302, headers: { Location: "https://provider.example.com/authorize" } }));
});

describe("GET /api/auth/companion/start", () => {
  it("returns 400 JSON for an invalid loopback URL", async () => {
    mockSetCompanionLoopbackCookie.mockReturnValue(false);
    const { GET } = await import("./start");

    const response = await GET(makeContext({ loopback: "not-a-url" }));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "Invalid loopback URL" });
  });

  it("redirects to email sign-in when not already signed in and no provider is given", async () => {
    const { GET } = await import("./start");
    const context = makeContext();

    await GET(context);

    expect(context.redirect).toHaveBeenCalledWith(
      "/signin?next=%2Fapi%2Fauth%2Fcompanion%2Fcomplete",
    );
  });

  it("redirects to the MFA challenge when the existing session needs step-up and has no proof", async () => {
    mockGetAuthFromCookies.mockResolvedValue({ session: { token: "s" }, user: { id: "user-1" } });
    mockNeedsStepUp.mockResolvedValue(true);
    mockHasValidMfaStepUpProof.mockResolvedValue(false);
    const { GET } = await import("./start");
    const context = makeContext({ client: "desktop" });

    await GET(context);

    expect(mockBuildMfaChallengeUrl).toHaveBeenCalledWith("/api/auth/companion/start?client=desktop");
    expect(context.redirect).toHaveBeenCalledWith(
      "/signin/mfa?next=%2Fapi%2Fauth%2Fcompanion%2Fstart",
    );
    expect(mockCreateAppSessionToken).not.toHaveBeenCalled();
  });

  it("hands off immediately with an app session when already signed in and no step-up is needed", async () => {
    mockGetAuthFromCookies.mockResolvedValue({ session: { token: "s" }, user: { id: "user-1" } });
    const handoff = new Response(null, { status: 302, headers: { Location: "myapp://done" } });
    mockRedirectMobileOAuthComplete.mockResolvedValue(handoff);
    const { GET } = await import("./start");
    const context = makeContext();

    const response = await GET(context);

    expect(mockCreateAppSessionToken).toHaveBeenCalledWith(context.request, "user-1");
    expect(mockRedirectMobileOAuthComplete).toHaveBeenCalledWith("app-token", "app-token", context.site);
    expect(response).toBe(handoff);
  });

  it("starts the provider's OAuth flow", async () => {
    const { GET } = await import("./start");
    const context = makeContext({ provider: "google" });

    const response = await GET(context);

    expect(mockStartBetterAuthOAuth).toHaveBeenCalledWith(context.request, "google");
    expect(response.headers.get("Location")).toBe("https://provider.example.com/authorize");
  });

  it("redirects to oauth_failed when the provider can't be started", async () => {
    mockStartBetterAuthOAuth.mockResolvedValue(null);
    const { GET } = await import("./start");
    const context = makeContext({ provider: "discord" });

    await GET(context);

    expect(context.redirect).toHaveBeenCalledWith("/signin?error=oauth_failed");
  });

  it("ignores an unrecognized provider and falls back to email sign-in", async () => {
    const { GET } = await import("./start");
    const context = makeContext({ provider: "carrier_pigeon" });

    await GET(context);

    expect(mockStartBetterAuthOAuth).not.toHaveBeenCalled();
    expect(context.redirect).toHaveBeenCalledWith(
      "/signin?next=%2Fapi%2Fauth%2Fcompanion%2Fcomplete",
    );
  });
});
