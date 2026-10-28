import { test, expect, type Page } from "@playwright/test";
import { getE2ECredentials, signIn } from "./helpers/auth";

/**
 * Invite links are stored hashed (IMPLEMENTATION_PLAN.md S5): the link is
 * shown once, pending invites have no copyable link, and Resend issues a new
 * link that replaces the old one.
 *
 * Runs against the real project with the E2E account, and sends real invite
 * emails to E2E_INVITE_EMAIL (an inbox the owner controls). The invite is
 * cancelled at the end, and any leftover from a failed run is cancelled first.
 */
const INVITE_EMAIL = process.env.E2E_INVITE_EMAIL?.trim().toLowerCase() ?? "";

function pendingRow(page: Page) {
  return page.locator("li", { has: page.locator("strong", { hasText: INVITE_EMAIL }) });
}

async function cancelPendingInvites(page: Page) {
  await page.goto("/dashboard/household");
  for (let i = 0; i < 5 && (await pendingRow(page).count()) > 0; i += 1) {
    await pendingRow(page).first().getByRole("button", { name: "Cancel", exact: true }).click();
    await page.waitForURL(/invite_revoked=1/, { timeout: 15_000 });
  }
}

async function shownLink(page: Page): Promise<string> {
  await expect(page.getByRole("heading", { name: "Invite link" })).toBeVisible({ timeout: 15_000 });
  const link = (await page.locator("code", { hasText: "/invite/" }).first().textContent())?.trim() ?? "";
  expect(link).toMatch(/\/invite\/[0-9a-f]{48}$/);
  return link;
}

test.describe("household invites", () => {
  test("invite link is shown once, and Resend replaces it", async ({ page }) => {
    test.skip(!getE2ECredentials(), "Set E2E_TEST_EMAIL and E2E_TEST_PASSWORD");
    test.skip(!INVITE_EMAIL, "Set E2E_INVITE_EMAIL to an inbox you control");
    test.setTimeout(120_000);

    // Cancel and Resend ask for confirmation.
    page.on("dialog", (dialog) => void dialog.accept());

    await signIn(page, "/dashboard/household");
    test.skip(
      (await page.locator("#household-invite-form").count()) === 0,
      "The E2E account doesn't own a household here, so it can't invite",
    );
    await cancelPendingInvites(page);

    try {
      // Send: the page reloads and shows the link once.
      await page.fill("#email", INVITE_EMAIL);
      await page.locator("#invite-submit").click();
      const first = await shownLink(page);

      // Pending invites never show a link; a reload drops the one-time card.
      await page.reload();
      await expect(page.getByRole("heading", { name: "Invite link" })).toHaveCount(0);
      await expect(pendingRow(page)).toHaveCount(1);
      await expect(page.locator("code", { hasText: "/invite/" })).toHaveCount(0);

      // Resend: a new link, shown once.
      await pendingRow(page).getByRole("button", { name: "Resend", exact: true }).click();
      await page.waitForURL(/invite_resent=1/, { timeout: 15_000 });
      const second = await shownLink(page);
      expect(second).not.toBe(first);

      // The old link no longer works; the new one does.
      await page.goto(new URL(first).pathname);
      await expect(page.getByText("This invite link is invalid.")).toBeVisible();
      await page.goto(new URL(second).pathname);
      await expect(page.getByText("This invite link is invalid.")).toHaveCount(0);
    } finally {
      await cancelPendingInvites(page);
    }
  });
});
