import { describe, expect, it } from "vitest";
import {
  REGISTER_NEXT_DEVICES,
  buildRegisterErrorHref,
  buildRegisterHref,
  sanitizeRegisterNext,
} from "./registerUrl";

describe("registerUrl", () => {
  it("defaults next to Devices", () => {
    expect(buildRegisterHref()).toBe(
      `/register?next=${encodeURIComponent(REGISTER_NEXT_DEVICES)}`,
    );
  });

  it("keeps a safe custom next and ref", () => {
    expect(buildRegisterHref({ next: "/dashboard/alerts", ref: "ABC" })).toBe(
      "/register?next=%2Fdashboard%2Falerts&ref=abc",
    );
  });

  it("rejects protocol-relative next", () => {
    expect(sanitizeRegisterNext("//evil.example")).toBeNull();
    expect(buildRegisterHref({ next: "//evil.example" })).toContain(
      encodeURIComponent(REGISTER_NEXT_DEVICES),
    );
  });

  it("rejects backslash and NUL tricks in next", () => {
    expect(sanitizeRegisterNext("/\\evil.example")).toBeNull();
    expect(sanitizeRegisterNext("/dashboard\0")).toBeNull();
    expect(sanitizeRegisterNext("https://evil.example/")).toBeNull();
  });
});

describe("buildRegisterErrorHref", () => {
  it("keeps the email, next and ref with the error code", () => {
    const url = new URL(
      buildRegisterErrorHref("signup_failed", {
        email: " someone@example.com ",
        next: "/dashboard/alerts",
        ref: " FRIEND1 ",
      }),
      "https://example.com",
    );
    expect(url.pathname).toBe("/register");
    expect(url.searchParams.get("error")).toBe("signup_failed");
    expect(url.searchParams.get("email")).toBe("someone@example.com");
    expect(url.searchParams.get("next")).toBe("/dashboard/alerts");
    expect(url.searchParams.get("ref")).toBe("friend1");
  });

  it("encodes characters that would otherwise break the query", () => {
    const href = buildRegisterErrorHref("weak_password", { email: "a+b&c=d@example.com" });
    expect(new URL(href, "https://example.com").searchParams.get("email")).toBe("a+b&c=d@example.com");
  });

  it("falls back to Devices for a missing or off-site next", () => {
    for (const next of [undefined, "", "//evil.example", "https://evil.example", "/\\evil.example"]) {
      const url = new URL(buildRegisterErrorHref("verification", { next }), "https://example.com");
      expect(url.searchParams.get("next")).toBe(REGISTER_NEXT_DEVICES);
    }
  });

  it("leaves out an empty or oversized email and an empty ref", () => {
    const empty = new URL(buildRegisterErrorHref("missing_fields", { email: "  ", ref: "" }), "https://example.com");
    expect(empty.searchParams.has("email")).toBe(false);
    expect(empty.searchParams.has("ref")).toBe(false);

    const long = `${"a".repeat(250)}@example.com`;
    const oversized = new URL(buildRegisterErrorHref("missing_fields", { email: long }), "https://example.com");
    expect(oversized.searchParams.has("email")).toBe(false);
  });
});
