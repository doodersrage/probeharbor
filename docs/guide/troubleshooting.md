---
description: "Fix common ProbeHarbor problems: a device that never sends its first reading, ingest 401s, devices online with an empty dashboard, lost ingest keys, and alerts that never arrive."
---

# Troubleshooting

## A device never sent its first reading

After you create a push device, Devices shows **Waiting for the first reading** and checks every 5 seconds. If nothing arrives within a couple of minutes, the page lists these checks:

1. **2.4 GHz Wi-Fi.** Most boards (ESP32, Pico W) only join 2.4 GHz networks, not 5 GHz. Re-check the network name and password you gave the device. The [browser flasher](https://probeharbor.dev/flash) reports Wi-Fi failures on its status line while the board is still on USB.
2. **The key, exactly.** If you typed or pasted the key yourself, it must match with no extra spaces. If you lost it, use **Rotate key** on the device page and update the device (the old key stops working).
3. **Outgoing HTTPS.** The device must reach `https://probeharbor.dev` on port 443. Guest networks and Wi-Fi that needs a sign-in page usually block it.
4. **The payload.** Paste what your device sends into the [payload checker](https://probeharbor.dev/payload-checker) to see how ProbeHarbor reads it.
5. **Still nothing?** Work through [Debugging stale or missing readings](https://probeharbor.dev/about/debugging-stale-readings), then the 401 section below and [circuit wiring troubleshooting](https://probeharbor.dev/about/circuit-wiring-troubleshooting).

## Ingest returns 401

- Key typo or old key after **rotate**
- Extra whitespace in firmware URL
- Posting to the wrong host (`workers.dev` vs `probeharbor.dev`) — prefer the apex

## Device online but Overview is empty

1. Devices → confirm the device has received at least one POST (sensors auto-import; rename labels afterward if needed)  
2. Hard-refresh [Overview](https://probeharbor.dev/dashboard) while signed into the same household  
3. Check Ops / system status if you admin the project  

## Lost ingest key

- Copy from the 30-minute callout right after device creation  
- **Reveal ingest key** on the device card (requires operator `INGEST_KEY_ENCRYPTION_SECRET`)  
- **Rotate key** to issue a new one (update firmware with the new URL)

## Alerts not arriving

- Dashboard → Alerts: enabled? freeze threshold set? channel toggled?  
- Quiet hours / vacation / snooze  
- Email: confirm address; SMS needs Pro + Twilio secrets  
- Webhook: HTTPS URL reachable; verify HMAC if secret set  

## CSV export 403

Member/Pro (or admin) required. Free accounts see an upgrade nudge instead.

## GitHub Pages 404 on `/probeharbor/`

Site is published at the **project** base path:

`https://doodersrage.github.io/probeharbor/`

Not at `https://doodersrage.github.io/` (user site).

## Manual cron returns 401

`POST /api/cron/collect-history` requires `Authorization: Bearer $CRON_SECRET`. The path is rate-limited per IP. Do not commit the secret.

## Still stuck

- [System status](https://probeharbor.dev/system-status)  
- [Contact](https://probeharbor.dev/contact)  
- [Open an issue](https://github.com/doodersrage/probeharbor/issues)
