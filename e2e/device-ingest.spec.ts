import { test, expect } from "@playwright/test";
import { getE2ECredentials, signIn } from "./helpers/auth";

test.describe("device ingest", () => {
  test("ingest rejects an unknown key", async ({ request }) => {
    const res = await request.post("/api/ingest/not-a-real-key", {
      data: { temp1: 40 },
    });
    expect(res.status()).toBe(401);
  });

  test("ingest rejects empty body for unknown key", async ({ request }) => {
    const res = await request.post("/api/ingest/not-a-real-key", {
      data: {},
    });
    expect(res.status()).toBe(401);
  });

  test("create device, POST a reading, see it land, then clean up", async ({ page }) => {
    test.skip(!getE2ECredentials(), "Set E2E_TEST_EMAIL and E2E_TEST_PASSWORD");

    await signIn(page, "/dashboard/devices?view=setup&tab=push");

    const deviceName = `E2E probe ${Date.now()}`;
    const nameInput = page.locator("#create-name");
    if (await nameInput.count()) {
      await nameInput.fill(deviceName);
      await page.locator("#create-space").fill("E2E bench");
      await page.getByRole("button", { name: "Create device", exact: true }).click();
    } else {
      // Empty account: the first-run card creates the device in one click.
      await page.getByRole("button", { name: /Create device & flash it/i }).click();
    }

    // Device creation stores the key in a flash cookie — not the URL.
    await page.waitForURL(/view=setup.*device_created=1.*focus_device=.+/, {
      timeout: 20_000,
    });
    const url = new URL(page.url());
    const deviceId = url.searchParams.get("focus_device");
    expect(deviceId).toBeTruthy();

    try {
      await expect(page.locator("#ingest-key-value")).toBeVisible({ timeout: 10_000 });
      const ingestKey = (await page.locator("#ingest-key-value").textContent())?.trim();
      expect(ingestKey).toBeTruthy();

      // This is the core product loop: probe posts JSON, dashboard reflects it.
      const ingestRes = await page.request.post(`/api/ingest/${ingestKey}`, {
        data: { temp1: 41.2, battery: 90 },
      });
      expect(ingestRes.ok()).toBeTruthy();

      // This page polls for the first reading every 5 s and then redirects itself
      // (`ingest_ok=1`). Navigating away while that redirect fires aborts our
      // goto (net::ERR_ABORTED), so let it land first. It also checks that the
      // waiting screen notices the reading.
      await page.waitForURL(/ingest_ok=1/, { timeout: 15_000 }).catch(() => {});

      // The device page lists the auto-imported sensor with its reading.
      await page.goto(`/dashboard/devices/${encodeURIComponent(deviceId!)}`);
      await expect(page.getByRole("heading", { name: /Sensors \(1\)/ })).toBeVisible({ timeout: 15_000 });
      await expect(page.locator(".device-sensor-reading")).toContainText("41.2");

      // And the Devices list links to it.
      await page.goto("/dashboard/devices?view=ops");
      await expect(page.locator(`[data-device-row="${deviceId}"]`)).toBeVisible();
    } finally {
      // Always remove the device this test created, even if an assertion above failed.
      // Posted straight to the API so a changed or collapsed UI can't leave it behind.
      const origin = new URL(page.url()).origin;
      const res = await page.request.post("/api/devices", {
        form: { action: "delete", device_id: deviceId!, redirect: "/dashboard/devices" },
        headers: { Origin: origin },
        maxRedirects: 0,
      });
      expect([302, 303]).toContain(res.status());
    }
  });
});
