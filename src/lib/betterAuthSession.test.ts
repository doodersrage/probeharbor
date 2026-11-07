import { describe, expect, it } from "vitest";
import { betterAuthCookieHeader } from "./betterAuthSession";

describe("betterAuthCookieHeader", () => {
  it("re-encodes the decoded value Astro gives back (signatures contain + / =)", () => {
    const decoded = "tok.ab+cd/ef=";
    expect(betterAuthCookieHeader((n) => (n === "better-auth.session_token" ? decoded : undefined))).toBe(
      "better-auth.session_token=tok.ab%2Bcd%2Fef%3D",
    );
  });

  it("sends both names when both are set, none when neither is", () => {
    expect(betterAuthCookieHeader(() => "v")).toBe("__Secure-better-auth.session_token=v; better-auth.session_token=v");
    expect(betterAuthCookieHeader(() => undefined)).toBeNull();
  });
});
