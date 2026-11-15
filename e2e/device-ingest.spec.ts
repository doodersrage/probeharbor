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

      // The last 24 hours on the device page (the History chart, loaded when visible).
      // One reading is not a line: the chart says so.
      const chartCard = page.locator("#chart");
      await chartCard.scrollIntoViewIfNeeded();
      await expect(chartCard.getByRole("heading", { name: "Last 24 hours" })).toBeVisible();
      await expect(chartCard.getByTestId("device-chart-empty")).toHaveCount(0);
      await expect(chartCard.getByText("Not enough readings yet for a chart.")).toBeVisible({ timeout: 15_000 });

      // A second reading, half an hour earlier (the device's own time), makes a line.
      const earlier = Math.floor(Date.now() / 1000) - 30 * 60;
      const earlierRes = await page.request.post(`/api/ingest/${ingestKey}`, {
        data: { temp1: 40.6, recorded_at: earlier },
      });
      expect(earlierRes.ok()).toBeTruthy();
      await page.reload();
      await page.locator("#chart").scrollIntoViewIfNeeded();
      await expect(page.locator("#chart canvas.history-chart-canvas")).toBeVisible({ timeout: 15_000 });

      // A probe crash report (firmware 1.5.1+) is decoded with that build's function
      // table: 1f770d3282f88e89 is the released 1.5.0 ESP32 image, whose loop() starts
      // at 0x400d61c8 (public/firmware/symbols/1f770d3282f88e89.json).
      const crashRes = await page.request.post(`/api/ingest/${ingestKey}`, {
        data: {
          temp1: 41.3,
          fw: "1.5.1",
          crash: { elf: "1f770d3282f88e89", task: "loopTask", pc: "0x400d61cc", bt: ["0x400d61cc"], cause: 28, addr: "0x0", reset: "panic" },
        },
      });
      expect(crashRes.ok()).toBeTruthy();
      await page.goto(`/dashboard/devices/${encodeURIComponent(deviceId!)}`);
      await expect(page.getByText("Stopped in loop()")).toBeVisible({ timeout: 15_000 });
      await expect(page.getByText(/Cause: LoadProhibited/)).toBeVisible();
      await expect(page.getByTestId("crash-frames")).toContainText("0x400d61cc +0x4");

      // A watchdog restart is worded as one, not as a crash in the idle task.
      const wdtRes = await page.request.post(`/api/ingest/${ingestKey}`, {
        data: {
          temp1: 41.4,
          fw: "1.5.1",
          crash: { elf: "1f770d3282f88e89", task: "IDLE0", pc: "0x400d61cc", bt: [], cause: 0, addr: "0x0", reset: "task_wdt" },
        },
      });
      expect(wdtRes.ok()).toBeTruthy();
      await page.goto(`/dashboard/devices/${encodeURIComponent(deviceId!)}`);
      await expect(page.getByText("Restarted by the watchdog: the probe stopped responding")).toBeVisible({ timeout: 15_000 });
      await expect(page.getByText(/Cause:/)).toHaveCount(0);

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
