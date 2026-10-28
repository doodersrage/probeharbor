---
description: "ProbeHarbor outbound alert webhooks: the JSON payload each freeze, leak, or outage alert POSTs, and how to verify its HMAC signature."
---

# Alert webhooks

Pro accounts can enable an **outbound webhook** under Dashboard → Alerts. Each alert POSTs JSON:

```json
{
  "title": "Garage temperature alert",
  "body": "Probe 1 is 31.2°F …",
  "kind": "threshold",
  "sent_at": "2026-08-25T12:00:00.000Z"
}
```

`kind` may be `threshold`, `rate`, `outage`, `forecast`, `runway` (time-to-freeze remaining hours), `rule`, `digest`, or `generic`.

## HMAC verification

When a webhook secret is configured, requests include:

```http
X-Signature: <hex HMAC-SHA256 of raw body>
X-ProbeHarbor-Timestamp: 1761650000
X-ProbeHarbor-Signature-V2: sha256=<hex HMAC-SHA256 of "<timestamp>.<raw body>">
```

Verify before acting on the payload (Home Assistant, Zapier code step, custom worker).

**Prefer the timestamped (v2) signature.** `X-Signature` covers only the body, so
a copied request still verifies later. The v2 signature also covers the time it
was sent, so you can reject replays:

1. Read `X-ProbeHarbor-Timestamp` (Unix seconds). Reject it if it is more than
   5 minutes from your clock.
2. Compute `HMAC-SHA256(secret, timestamp + "." + rawBody)` as lowercase hex.
3. Compare it with `X-ProbeHarbor-Signature-V2` after the `sha256=` prefix,
   using a constant-time comparison.

```js
// Node.js
import { createHmac, timingSafeEqual } from "node:crypto";

function verify(secret, rawBody, headers) {
  const ts = headers["x-probeharbor-timestamp"];
  const sig = (headers["x-probeharbor-signature-v2"] ?? "").replace(/^sha256=/, "");
  if (!/^\d+$/.test(ts ?? "") || Math.abs(Date.now() / 1000 - Number(ts)) > 300) return false;
  const expected = createHmac("sha256", secret).update(`${ts}.${rawBody}`).digest("hex");
  return sig.length === expected.length && timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
}
```

`X-Signature` (and, on reading webhooks, `X-ProbeHarbor-Signature`) is still
sent unchanged, so existing verifiers keep working.

## Reading webhooks

Separately, Pro can POST **reading** payloads to a URL for every stored snapshot (high volume — use carefully).
When a signing secret is set, requests include `X-ProbeHarbor-Signature` (and the legacy `X-ThermalTrace-Signature` and `X-GarageTemp-Signature` aliases) as `sha256=<hex>`, plus the same timestamped `X-ProbeHarbor-Timestamp` and `X-ProbeHarbor-Signature-V2` headers as alert webhooks (see above).

## Signing inbound calls

`POST /api/inbound/{token}` accepts the same v2 scheme, and it's the recommended format:

```http
X-ProbeHarbor-Timestamp: <current Unix seconds>
X-ProbeHarbor-Signature-V2: sha256=<hex HMAC-SHA256 of "<timestamp>.<raw body>">
```

Requests more than 5 minutes old (or ahead) are rejected with `401`. If the v2
header is present, it alone is checked. The older body-only
`X-ProbeHarbor-Signature` is still accepted for now, but a copy of such a
request can be replayed, so switch to v2. Body-only signatures may stop being
accepted in a future release, with notice.

## Home Assistant

**Recommended:** install the [official HACS integration](https://probeharbor.dev/integrations/home-assistant). Share-link tokens populate temperature, humidity, door, and leak entities; optional Pro **inbound webhooks** expose `thermaltrace.snooze`, `thermaltrace.vacation`, and `thermaltrace.status` services.

For **alerts into HA** (ProbeHarbor → Home Assistant), use a Pro **outbound webhook** URL in Dashboard → Alerts, or import the [ProbeHarbor webhook blueprint](https://probeharbor.dev/ha/probeharbor_webhook.yaml). Verify HMAC with the same secret pattern as inbound calls when configured.

## Zapier / Make / IFTTT / n8n

Use **Webhooks by Zapier → Catch Hook**, IFTTT Maker, or an n8n Webhook node as the outbound URL.
Product recipes:

- [IFTTT, n8n & Sheets](https://probeharbor.dev/integrations/automation)
- [Zapier & Make](https://probeharbor.dev/about/zapier-make-recipes)

## Channels beyond webhooks

Email, Discord, Telegram, Slack, Teams, ntfy, Pushover on Free+; SMS / WhatsApp / browser push on Pro when configured.
