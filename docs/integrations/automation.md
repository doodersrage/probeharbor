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

`POST /api/inbound/{token}` with `{"action":"snooze","hours":24}`, signed with `X-ProbeHarbor-Timestamp` and `X-ProbeHarbor-Signature-V2` ([how](/integrations/webhooks#signing-inbound-calls)). Body-only signatures are no longer accepted (since 2026-11-11).

Actions: `snooze` (`hours`, 1-168, default 24), `vacation` (`days`, 1-90, default 7), `clear_snooze`, `clear_vacation`, `status`.

A snooze or vacation sent here applies to **the webhook's household only**. It holds that household's routine alerts for everyone in it, by the same rules as a personal snooze / vacation: freeze, leak, power and offline alerts still send. It does not change anyone's own alert settings, and someone who belongs to several households still gets the routine alerts for their other households. The Overview shows the household hold to its members. `status` returns it as `alertHold` (`snoozedUntil`, `vacationUntil`, ISO times or `null`). In the snooze / vacation responses, `members` is how many people the household has.

Before this change (November 2026) an inbound snooze or vacation set each member's personal, account-wide snooze. Holds set that way stay until they expire. Members can end them early from Dashboard → Alerts; an inbound `clear_*` doesn't clear them.
