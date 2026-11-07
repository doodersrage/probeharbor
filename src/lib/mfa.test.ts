import { describe, expect, it, vi } from "vitest";
import { buildMfaChallengeUrl, MFA_REQUIRED_COOKIE, setMfaRequiredCookie } from "./mfa";

describe("mfa helpers", () => {
  it("builds MFA challenge URLs with safe next paths", () => {
    expect(buildMfaChallengeUrl(null)).toBe("/signin/mfa");
    expect(buildMfaChallengeUrl("/dashboard")).toBe("/signin/mfa");
    expect(buildMfaChallengeUrl("/dashboard/alerts")).toBe("/signin/mfa?next=%2Fdashboard%2Falerts");
    expect(buildMfaChallengeUrl("https://evil.example")).toBe("/signin/mfa");
  });

  it("sets and clears the hint cookie", () => {
    const cookies = { set: vi.fn(), delete: vi.fn() };
    setMfaRequiredCookie(cookies as never, true);
    expect(cookies.set).toHaveBeenCalledWith(MFA_REQUIRED_COOKIE, "1", expect.objectContaining({ httpOnly: true, maxAge: 900 }));
    setMfaRequiredCookie(cookies as never, "clear");
    expect(cookies.delete).toHaveBeenCalledWith(MFA_REQUIRED_COOKIE, { path: "/" });
  });
});
