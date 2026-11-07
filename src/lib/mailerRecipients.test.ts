import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";

const suppressed = new Set<string>();
const recorded: string[] = [];
vi.mock("./emailSuppressions", async (orig) => ({
  ...(await orig<typeof import("./emailSuppressions")>()),
  isEmailSuppressed: async (email: string) => suppressed.has(email.toLowerCase()),
  suppressEmail: async (email: string) => void recorded.push(email),
}));

import { assertRecipientSendable } from "./mailer";

beforeEach(() => {
  suppressed.clear();
  recorded.length = 0;
});

describe("assertRecipientSendable", () => {
  it("lets a normal address through", async () => {
    await expect(assertRecipientSendable("person@example.com")).resolves.toBeUndefined();
  });

  it("refuses suppressed addresses (bounced, unsubscribed)", async () => {
    suppressed.add("bounced@example.com");
    await expect(assertRecipientSendable("bounced@example.com")).rejects.toThrow(/suppressed/);
  });

  it("refuses and records implausible addresses", async () => {
    await expect(assertRecipientSendable("not-an-address")).rejects.toThrow(/invalid/);
    expect(recorded).toEqual(["not-an-address"]);
  });
});

describe("every raw email sender checks the recipient", () => {
  it("files that call sendMailerRaw also call assertRecipientSendable (or go through sendEmail)", () => {
    const files: string[] = [];
    const walk = (dir: string) => {
      for (const name of readdirSync(dir)) {
        const path = join(dir, name);
        if (statSync(path).isDirectory()) walk(path);
        else if (/\.ts$/.test(name) && !/\.test\.ts$/.test(name)) files.push(path);
      }
    };
    walk(join(process.cwd(), "src"));
    const unchecked = files.filter((f) => {
      const src = readFileSync(f, "utf8");
      if (!/sendMailerRaw\s*\(/.test(src) || /export async function sendMailerRaw/.test(src)) return false;
      return !/assertRecipientSendable\s*\(/.test(src);
    });
    // The contact form sends to the site's own inbox (SMTP_MAIL_TO), not a user address.
    expect(unchecked.map((f) => f.replace(`${process.cwd()}/`, ""))).toEqual(["src/pages/api/contact.ts"]);
  });
});
