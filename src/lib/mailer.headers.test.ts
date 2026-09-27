import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const sent: Array<{ from: string; to: string; raw: string }> = [];
vi.mock("cloudflare:email", () => ({
  EmailMessage: class {
    constructor(
      public from: string,
      public to: string,
      public raw: string,
    ) {}
  },
}));
vi.mock("cloudflare:workers", () => ({
  env: { MAILER: { send: async (message: { from: string; to: string; raw: string }) => void sent.push(message) } },
}));
vi.mock("./emailSuppressions", () => ({
  isEmailSuppressed: async () => false,
  isPlausibleEmailAddress: () => true,
  suppressEmail: async () => undefined,
}));

beforeEach(() => {
  sent.length = 0;
  vi.stubEnv("SMTP_MAIL_FROM", "alerts@thermaltrace.test");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("sendEmail headers", () => {
  it("writes List-Unsubscribe headers into the raw message", async () => {
    const { sendEmail } = await import("./mailer");
    const url =
      "https://thermaltrace.dev/api/email/unsubscribe?uid=0b9c3c1e-5a8f-4a57-9f3e-0f5b6f6f2a11&kind=digest&sig=" +
      "a".repeat(64);

    await sendEmail("user@example.com", "Weekly digest", "Body", {
      headers: {
        "List-Unsubscribe": `<${url}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    });

    // Unfold continuation lines (RFC 5322) before matching.
    const unfolded = sent[0]!.raw.replace(/\r?\n[ \t]+/g, " ");
    if (process.env.PRINT_RAW) console.log(sent[0]!.raw.split(/\r?\n\r?\n/)[0]);
    expect(unfolded).toMatch(/^List-Unsubscribe: <https:\/\/thermaltrace\.dev\/api\/email\/unsubscribe\?uid=/m);
    expect(unfolded).toContain(url);
    expect(unfolded).toMatch(/^List-Unsubscribe-Post: List-Unsubscribe=One-Click$/m);
  });
});
