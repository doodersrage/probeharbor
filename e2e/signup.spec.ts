import { test, expect } from "@playwright/test";

/**
 * Signup / register surface without completing a real account create
 * (Turnstile blocks unattended signup in CI/prod).
 */
test.describe("signup", () => {
  test("register page loads with email/password and Turnstile widget", async ({
    page,
  }) => {
    await page.goto("/register");
    await expect(page.getByRole("heading", { name: /Create your account/i })).toBeVisible();
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#password")).toBeVisible();
    await expect(page.getByRole("button", { name: /Create account/i })).toBeVisible();
    await expect(page.locator(".cf-turnstile")).toBeVisible();
    await expect(page.getByRole("link", { name: "Live demo (no account)" })).toBeVisible();
  });

  test("register page shows referral banner and validation errors from query", async ({
    page,
  }) => {
    await page.goto("/register?ref=abc123&error=weak_password");
    await expect(page.getByText(/Referral code/i)).toBeVisible();
    await expect(page.getByText(/abc123/)).toBeVisible();
    await expect(
      page.getByText(/Password must be at least 8 characters/i),
    ).toBeVisible();
  });

  test("HTML required attributes block empty submit", async ({ page }) => {
    await page.goto("/register");
    await page.getByRole("button", { name: /Create account/i }).click();
    await expect(page.locator("#email")).toHaveJSProperty("validity.valueMissing", true);
  });

  test("register API redirects to verification when Turnstile is missing", async ({
    request,
  }) => {
    const res = await request.post("/api/auth/register", {
      form: {
        email: "e2e-signup@example.com",
        password: "password123",
      },
      maxRedirects: 0,
    });
    expect([302, 303]).toContain(res.status());
    // The error redirect keeps the email in a /register-only cookie, never in the URL
    // (analytics record page URLs), and never the password at all.
    const location = new URL(res.headers()["location"] ?? "", "http://127.0.0.1");
    expect(location.pathname).toBe("/register");
    expect(location.searchParams.get("error")).toBe("verification");
    expect(location.search).not.toContain("e2e-signup");
    expect(location.search).not.toContain("password123");
    const setCookie = res.headers()["set-cookie"] ?? "";
    expect(setCookie).toContain("ph_register_email=");
    expect(setCookie).toContain("Path=/register");
    expect(setCookie).toContain("HttpOnly");
  });

  test("signin page shows post-register flash pointing at Devices", async ({ page }) => {
    await page.goto("/signin?registered=1&next=/dashboard/devices");
    await expect(page.getByRole("status")).toContainText(/Account created/i);
    await expect(page.getByRole("status")).toContainText(/Devices/i);
  });
});
