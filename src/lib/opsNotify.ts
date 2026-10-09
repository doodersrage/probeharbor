/** Operator notifications for failed background jobs. */

/**
 * Worker secrets first (set by `pnpm secrets:push`), then build-time env.
 * Imported lazily: a static import pulls in `cloudflare:workers`, which
 * breaks prerendered pages (e.g. /badge/*.svg) that reach this module.
 */
async function readOpsEnv(key: string): Promise<string> {
  try {
    const { getRuntimeEnv } = await import("./runtimeEnv");
    return cleanEnv(getRuntimeEnv(key));
  } catch {
    return cleanEnv((import.meta.env as Record<string, unknown>)[key]);
  }
}

function cleanEnv(value: unknown): string {
  return String(value ?? "").replace(/\r/g, "").trim();
}

async function sendOpsEmail(subject: string, body: string): Promise<boolean> {
  const to = await readOpsEnv("SMTP_MAIL_TO");
  const from = await readOpsEnv("SMTP_MAIL_FROM");
  if (!to || !from) return false;

  try {
    const { sendEmail } = await import("./mailer");
    const { brandedEmailParts } = await import("./emailLayout");
    const parts = brandedEmailParts({
      eyebrow: "Ops",
      title: subject,
      intro: body,
      tone: "alert",
      footerNote: "ProbeHarbor operator notification.",
    });
    await sendEmail(to, subject, parts.text, {
      html: parts.html,
      fromName: "ProbeHarbor Ops",
    });
    return true;
  } catch (error) {
    console.error("Failed to send ops email:", error);
    return false;
  }
}

async function sendOpsDiscord(title: string, body: string): Promise<boolean> {
  // OPS_DISCORD_WEBHOOK_URL is a Worker runtime secret, not a build-time var.
  const webhook =
    (await readOpsEnv("OPS_DISCORD_WEBHOOK_URL")) ||
    (await readOpsEnv("DISCORD_OPS_WEBHOOK_URL"));
  if (!webhook) return false;

  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: `**${title}**\n${body}`.slice(0, 1900) }),
    });
    return response.ok;
  } catch (error) {
    console.error("Failed to send ops Discord webhook:", error);
    return false;
  }
}

export async function notifyOps(title: string, body: string): Promise<void> {
  const [emailOk, discordOk] = await Promise.all([
    sendOpsEmail(title, body),
    sendOpsDiscord(title, body),
  ]);

  if (!emailOk && !discordOk) {
    console.error(`Ops notify skipped (no channel configured): ${title} — ${body}`);
  }
}

export function formatJobFailureBody(
  jobName: string,
  details: Record<string, unknown> | null | undefined,
): string {
  const lines = [
    `Job: ${jobName}`,
    `Time: ${new Date().toISOString()}`,
  ];

  if (details && typeof details === "object") {
    const message = details.message;
    if (typeof message === "string" && message) {
      lines.push(`Message: ${message}`);
    }
    const errors = details.errors;
    if (Array.isArray(errors) && errors.length > 0) {
      lines.push("Errors:");
      for (const err of errors.slice(0, 10)) {
        lines.push(`- ${String(err)}`);
      }
    }
    const rolled = JSON.stringify(details);
    if (rolled.length < 1500) {
      lines.push(`Details: ${rolled}`);
    }
  }

  return lines.join("\n");
}
