import * as neonTools from "./db/householdTools";
import { type InboundSignatureFormat, randomSigningSecret } from "./inboundSigning";

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value),
  );
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function randomToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  return `gtw_${[...bytes].map((b) => b.toString(16).padStart(2, "0")).join("")}`;
}

export type InboundWebhook = {
  id: string;
  household_id: string;
  name: string;
  token_prefix: string;
  created_at: string;
  last_used_at: string | null;
  has_signing_secret: boolean;
};

export async function createInboundWebhook(
  householdId: string,
  userId: string,
  name: string,
): Promise<{ token: string | null; signingSecret: string | null; error: string | null }> {
  const token = randomToken();
  const signingSecret = randomSigningSecret();
  const token_hash = await sha256Hex(token);
  const token_prefix = token.slice(0, 12);
  const created = await neonTools.insertInboundWebhook({
    household_id: householdId,
    name: name.trim() || "Inbound webhook",
    token_prefix,
    token_hash,
    created_by: userId,
    signing_secret: signingSecret,
  });
  return {
    token: created.error ? null : token,
    signingSecret: created.error ? null : signingSecret,
    error: created.error,
  };
}

export async function listInboundWebhooks(
  householdId: string,
): Promise<{ webhooks: InboundWebhook[]; error: string | null }> {
  const listed = await neonTools.listInboundWebhooks(householdId);
  return { webhooks: listed.rows, error: listed.error };
}

export async function revokeInboundWebhook(
  webhookId: string,
  householdId: string,
): Promise<{ error: string | null }> {
  return neonTools.deleteInboundWebhook(householdId, webhookId);
}

export async function resolveInboundWebhook(
  token: string,
): Promise<{ householdId: string; webhookId: string; signingSecret: string | null } | null> {
  const token_hash = await sha256Hex(token.trim());
  return neonTools.resolveInboundWebhook(token_hash);
}

/**
 * Record which signature format a webhook last used. Best effort: a failure
 * is logged and never blocks the request.
 */
export async function recordInboundSignatureFormat(
  webhookId: string,
  format: InboundSignatureFormat,
): Promise<void> {
  try {
    await neonTools.setSignatureFormat(webhookId, format);
  } catch (error) {
    console.warn("inbound webhook: could not record signature format", error);
  }
}
