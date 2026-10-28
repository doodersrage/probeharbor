---
description: "Route ProbeHarbor freeze and leak alerts to IFTTT, n8n, Zapier, Make, or Google Sheets with outbound webhooks and ready-made recipes."
---

# IFTTT, n8n & Sheets

Pro outbound alert webhooks work with IFTTT Maker, self-hosted n8n, Zapier, and Make.

- Product guide: [probeharbor.dev/integrations/automation](https://probeharbor.dev/integrations/automation)
- Zapier/Make: [probeharbor.dev/about/zapier-make-recipes](https://probeharbor.dev/about/zapier-make-recipes)
- n8n → Sheets workflow: [probeharbor.dev/n8n/probeharbor-alert-to-sheets.json](https://probeharbor.dev/n8n/probeharbor-alert-to-sheets.json)

## Outbound payload

```json
{
  "title": "Garage temperature alert",
  "body": "Probe 1 is 31.2°F …",
  "kind": "threshold",
  "sent_at": "2026-08-25T12:00:00.000Z"
}
```

Verify the signature when a webhook secret is set. Prefer the timestamped `X-ProbeHarbor-Signature-V2` (rejects replays); `X-Signature` (HMAC-SHA256 hex of the body) is still sent. See [Alert webhooks](/integrations/webhooks#hmac-verification).

## Inbound snooze

`POST /api/inbound/{token}` with `{"action":"snooze","hours":24}`, signed with `X-ProbeHarbor-Timestamp` and `X-ProbeHarbor-Signature-V2` ([how](/integrations/webhooks#signing-inbound-calls)). The body-only `X-ProbeHarbor-Signature` still works for now.
