import type { AstroCookies } from "astro";
import { describe, expect, it } from "vitest";
import {
  buildMobileOAuthCustomUrl,
  buildMobileOAuthHttpsUrl,
  buildMobileOAuthIntentUrl,
  hasMobileOAuthCookie,
  setMobileOAuthCookie,
} from "./mobileAuthRedirect";
import { resolveAndroidAppId } from "./mobileAuthExchange";

function cookieJar(): AstroCookies {
  const store = new Map<string, string>();
  return {
    set: (name: string, value: string) => void store.set(name, value),
    get: (name: string) => (store.has(name) ? { value: store.get(name)! } : undefined),
    delete: (name: string) => void store.delete(name),
  } as unknown as AstroCookies;
}

describe("mobile OAuth return URLs", () => {
  const token = "payload.sig";

  it("uses host oauth (not a path) so Android intent-filters match", () => {
    expect(buildMobileOAuthCustomUrl(token)).toBe(
      "dev.thermaltrace.android://oauth?exchange=payload.sig",
    );
  });

  it("sends Chrome to an HTTPS App Link instead of a custom-scheme 302", () => {
    expect(buildMobileOAuthHttpsUrl(token, "https://probeharbor.dev")).toBe(
      "https://probeharbor.dev/app/oauth?exchange=payload.sig",
    );
  });

  it("builds an Android intent:// URL Chrome will hand off after WebAuthn", () => {
    expect(buildMobileOAuthIntentUrl(token)).toBe(
      "intent://oauth?exchange=payload.sig#Intent;scheme=dev.thermaltrace.android;package=dev.thermaltrace.android;end",
    );
  });

  it("targets the renamed app when it identifies itself", () => {
    expect(buildMobileOAuthCustomUrl(token, "dev.probeharbor.android")).toBe(
      "dev.probeharbor.android://oauth?exchange=payload.sig",
    );
    expect(buildMobileOAuthHttpsUrl(token, "https://probeharbor.dev", "dev.probeharbor.android")).toBe(
      "https://probeharbor.dev/app/oauth?exchange=payload.sig&app=dev.probeharbor.android",
    );
    expect(buildMobileOAuthIntentUrl(token, "dev.probeharbor.android")).toBe(
      "intent://oauth?exchange=payload.sig#Intent;scheme=dev.probeharbor.android;package=dev.probeharbor.android;end",
    );
  });
});

describe("Android app ID", () => {
  it("falls back to the legacy ID for unknown or missing values", () => {
    expect(resolveAndroidAppId("dev.probeharbor.android")).toBe("dev.probeharbor.android");
    expect(resolveAndroidAppId(null)).toBe("dev.thermaltrace.android");
    expect(resolveAndroidAppId("com.evil.app")).toBe("dev.thermaltrace.android");
  });

  it("remembers the new app ID in the mobile cookie and ignores unknown ones", () => {
    const jar = cookieJar();
    setMobileOAuthCookie(jar, "dev.probeharbor.android");
    expect(jar.get("mobile_oauth")?.value).toBe("dev.probeharbor.android");
    expect(hasMobileOAuthCookie(jar)).toBe(true);

    const legacy = cookieJar();
    setMobileOAuthCookie(legacy, "com.evil.app");
    expect(legacy.get("mobile_oauth")?.value).toBe("1");
    expect(hasMobileOAuthCookie(legacy)).toBe(true);
  });
});
