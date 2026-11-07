import type { Page } from "@playwright/test";
import pg from "pg";
import { createBetterAuth } from "../../src/lib/betterAuthConfig";

export function getE2ECredentials(): { email: string; password: string } | null {
  const email = process.env.E2E_TEST_EMAIL?.trim();
  const password = process.env.E2E_TEST_PASSWORD;
  if (!email || !password) return null;
  return { email, password };
}

/**
 * The database and Better Auth secret the preview under test uses. Explicit
 * E2E_* names on purpose (CI: the Neon dev branch), never DATABASE_URL, so a
 * local run can't sign in to production by accident.
 */
function getE2EAuthConfig(): { databaseUrl: string; secret: string } | null {
  const databaseUrl = process.env.E2E_DATABASE_URL?.trim();
  const secret = process.env.E2E_BETTER_AUTH_SECRET?.trim();
  if (!databaseUrl || !secret) return null;
  return { databaseUrl, secret };
}

/** Cookie domain for PLAYWRIGHT_BASE_URL (defaults to localhost). */
function cookieDomainFromBaseUrl(baseURL: string | undefined): string {
  if (!baseURL) return "127.0.0.1";
  try {
    return new URL(baseURL).hostname;
  } catch {
    return "127.0.0.1";
  }
}

/**
 * Sign in with the e2e account's real password through Better Auth (same
 * setup as the app, same database and secret as the preview) and hand the
 * signed session cookie to the browser. Skips the HTML form, which needs
 * Turnstile in production builds.
 */
export async function signIn(page: Page, next = "/dashboard/alerts"): Promise<void> {
  const creds = getE2ECredentials();
  if (!creds) {
    throw new Error("E2E_TEST_EMAIL and E2E_TEST_PASSWORD are required");
  }
  const config = getE2EAuthConfig();
  if (!config) {
    throw new Error("E2E_DATABASE_URL and E2E_BETTER_AUTH_SECRET are required for E2E sign-in (the preview's database and secret)");
  }

  const pool = new pg.Pool({ connectionString: config.databaseUrl, max: 1 });
  let setCookies: string[];
  try {
    const auth = createBetterAuth({
      database: pool,
      secret: config.secret,
      baseURL: process.env.SITE_URL?.trim() || "https://probeharbor.dev",
      rpID: "localhost",
      // The preview is a production build: "__Secure-" cookie names.
      secureCookies: true,
      sendVerificationEmail: async () => {},
      sendResetPassword: async () => {},
    });
    const response = await auth.api.signInEmail({
      body: { email: creds.email, password: creds.password },
      asResponse: true,
    });
    if (!response.ok) {
      throw new Error(`Better Auth sign-in failed (${response.status}) — check E2E_TEST_EMAIL / E2E_TEST_PASSWORD against E2E_DATABASE_URL`);
    }
    const body = (await response.json().catch(() => null)) as { twoFactorRedirect?: boolean } | null;
    if (body?.twoFactorRedirect) {
      throw new Error("E2E user has an authenticator app enrolled — use a test account without MFA");
    }
    setCookies = response.headers.getSetCookie();
  } finally {
    await pool.end();
  }

  const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1";
  const domain = cookieDomainFromBaseUrl(baseURL);
  const cookies = setCookies
    .map((header) => header.split(";")[0] ?? "")
    .map((pair) => [pair.slice(0, pair.indexOf("=")), pair.slice(pair.indexOf("=") + 1)] as const)
    .filter(([name, value]) => name.includes("better-auth.session_token") && value);
  if (cookies.length === 0) throw new Error("Better Auth sign-in returned no session cookie");

  await page.context().addCookies(
    cookies.map(([name, value]) => ({
      name,
      value,
      domain,
      path: "/",
      httpOnly: true,
      // Chromium treats http://127.0.0.1 and localhost as secure for cookies.
      secure: true,
      sameSite: "Lax" as const,
    })),
  );

  await page.goto(next, { waitUntil: "domcontentloaded" });
  const nextPath = next.split("?")[0] ?? next;
  await page.waitForURL(
    (url) => {
      const path = url.pathname;
      if (path.startsWith("/signin")) return true;
      return path === nextPath || path.startsWith(`${nextPath}/`);
    },
    { timeout: 20_000 },
  );

  const landed = new URL(page.url()).pathname;
  if (landed.startsWith("/signin/mfa")) {
    throw new Error(
      "E2E user requires MFA — use a test account without MFA enrolled, or complete step-up manually",
    );
  }
  if (landed.startsWith("/signin")) {
    throw new Error(
      "Session cookie was rejected by the preview server — E2E_DATABASE_URL / E2E_BETTER_AUTH_SECRET must match the preview's DATABASE_URL / BETTER_AUTH_SECRET",
    );
  }
}
