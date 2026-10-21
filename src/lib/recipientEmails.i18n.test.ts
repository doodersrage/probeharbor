import { beforeAll, describe, expect, it, vi } from "vitest";
import { ensureLocale } from "../i18n/catalog";
import { buildWeeklyDigestParts } from "./digestEmails";
import { buildDripEmail } from "./dripEmails";
import { buildBrandedEmailHtml } from "./emailLayout";
import { buildMonthlyReportPlainText } from "./monthlyReportHtml";
import { formatQuarterlyWindowLabel } from "./quarterlyReportEmails";
import type { ChartPoint } from "./garageTempsHistory";

const mockSendEmail = vi.fn();
vi.mock("./mailer", () => ({
  sendEmail: (...a: unknown[]) => mockSendEmail(...a),
  isMailerRecipientNotAllowed: () => false,
  partitionMailErrors: () => ({ hardErrors: [], restrictedErrors: [] }),
}));
vi.mock("./supabase", () => ({ createServerClient: vi.fn(), createAdminClient: vi.fn() }));

const points: ChartPoint[] = [
  { timestamp: "2026-01-05T08:00:00Z", tempf: 40.5, humidity: 50, probeLabel: "Garage" },
  { timestamp: "2026-01-06T04:00:00Z", tempf: 30.25, humidity: 61, probeLabel: "Garage" },
];

beforeAll(async () => {
  await ensureLocale("de", ["app"]);
  await ensureLocale("es", ["app"]);
});

describe("recipient-language emails", () => {
  it("renders the weekly digest in German with German numbers and dates", () => {
    const digest = buildWeeklyDigestParts(
      { points, freezeThresholdF: 34, siteUrl: "https://probeharbor.dev" },
      "de",
    );
    const en = buildWeeklyDigestParts({ points, freezeThresholdF: 34, siteUrl: "https://probeharbor.dev" });

    expect(digest.subject).not.toBe(en.subject);
    expect(digest.subject).toContain("30,3°F");
    expect(digest.html).toContain('<html lang="de">');
    expect(digest.html).not.toContain("This week at your probes");
    expect(digest.text).not.toContain("Freeze exposure");
    expect(digest.html).toContain("Garage");
    expect(en.subject).toBe("Weekly digest — coldest Tue, Jan 6 30.3°F");
  });

  it("renders the weekly digest in Spanish", () => {
    const digest = buildWeeklyDigestParts(
      { points, freezeThresholdF: 34, siteUrl: "https://probeharbor.dev" },
      "es",
    );
    expect(digest.html).toContain('<html lang="es">');
    expect(digest.html).not.toContain("Highlights");
    expect(digest.notifyBody).toContain("30,3");
  });

  it("renders a drip email in German and Spanish, links unchanged", () => {
    const en = buildDripEmail("day1", "https://probeharbor.dev");
    for (const locale of ["de", "es"] as const) {
      const mail = buildDripEmail("day1", "https://probeharbor.dev", null, locale);
      expect(mail.subject).not.toBe(en.subject);
      expect(mail.html).not.toContain("Connect your first probe");
      expect(mail.html).toContain("https://probeharbor.dev/dashboard/devices?view=setup");
      expect(mail.html).toContain(`<html lang="${locale}">`);
    }
  });

  it("sends the household invite in the inviter's language", async () => {
    const { sendInviteEmail } = await import("./householdInvites");
    mockSendEmail.mockReset().mockResolvedValue(undefined);

    await sendInviteEmail("guest@example.com", "https://probeharbor.dev/invite/t", "Ferienhaus", "owner@example.com", "de");
    const [to, subject, text, options] = mockSendEmail.mock.calls[0] as [string, string, string, { html: string }];
    expect(to).toBe("guest@example.com");
    expect(subject).toContain("Ferienhaus");
    expect(subject).not.toContain("You're invited");
    expect(text).toContain("owner@example.com");
    expect(options.html).toContain('<html lang="de">');

    mockSendEmail.mockReset().mockResolvedValue(undefined);
    await sendInviteEmail("guest@example.com", "https://probeharbor.dev/invite/t", "Casa", null, "es");
    const [, esSubject, esText] = mockSendEmail.mock.calls[0] as [string, string, string];
    expect(esSubject).toContain("Casa");
    expect(esSubject).not.toContain("You're invited");
    expect(esText).not.toContain("Someone");
  });

  it("keeps the shared layout English by default", () => {
    const html = buildBrandedEmailHtml({ title: "Alert", unsubscribeUrl: "https://x.test/u" });
    expect(html).toContain('<html lang="en">');
    expect(html).toContain(">Alert settings</a>");
    expect(html).toContain(">Unsubscribe</a>");
  });

  it("localizes report text and the quarter label", () => {
    expect(formatQuarterlyWindowLabel(new Date("2026-01-01T08:00:00Z"))).toBe("Q4 2025 (Oct–Dec)");
    expect(formatQuarterlyWindowLabel(new Date("2026-01-01T08:00:00Z"), "de")).not.toContain("Oct");
    const text = buildMonthlyReportPlainText(
      {
        monthLabel: "Oktober 2026",
        periodDays: 30,
        reportKind: "monthly",
        readingCount: 2016,
        minTempF: 28.5,
        maxTempF: 72.1,
        avgTempF: 48.3,
        freezeThresholdF: 34,
        nightsAtRisk: 1,
        nights: [{ date: "2026-10-22", dateLabel: "Thu, Oct 22", minTempF: 31, atRisk: true }],
        freezeHours: { hoursBelow34: 12.5, degreeHoursBelow: 40, readingsBelow34: 8, totalReadings: 42, coldestF: 28.5 },
        probes: [],
        alertsUrl: "https://probeharbor.dev/dashboard/alerts",
        historyUrl: "https://probeharbor.dev/dashboard/history",
      },
      "de",
    );
    expect(text).toContain("2.016");
    expect(text).toContain("28,5°F");
    expect(text).not.toContain("Thu, Oct 22");
    expect(text).not.toContain("HTML report is attached");
  });
});
