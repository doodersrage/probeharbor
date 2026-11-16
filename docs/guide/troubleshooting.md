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
- A pairing code typed into firmware older than 1.6.0 (it's stored as a key): update the firmware, or use the full key

## "Pairing code rejected"

A pairing code (device page → **Pair a probe**, `XXXX-XXXX`) is typed where a
probe asks for its device key, on its setup page or on `/flash`. It works
once and for 30 minutes, and making a new code for a device cancels its
unused one. Firmware 1.6.0+ prints `TT pairing code rejected` when:

- the server doesn't know the code (mistyped, already used, expired, or
  replaced by a newer one): make a new code and type it again;
- what was typed isn't 8 letters and digits (`not a valid code`).

The probe keeps whatever key it had, so a probe that was already reporting
carries on. Older firmware stores a code as if it were a key and then gets
401: update it on `/flash`, or paste the full device key instead.
`TT pairing: no answer …, retrying` means it couldn't reach the server over a
verified connection yet (Wi-Fi, DNS, clock or certificate); it retries
every 30 s while the code is valid.

## Device online but Overview is empty

1. Devices → confirm the device has received at least one POST (sensors auto-import; rename labels afterward if needed)  
2. Hard-refresh [Overview](https://probeharbor.dev/dashboard) while signed into the same household  
3. Check Ops / system status if you admin the project  

## Lost ingest key

- Copy from the 30-minute callout right after device creation  
- **Reveal ingest key** on the device card (requires operator `INGEST_KEY_ENCRYPTION_SECRET`)  
- **Rotate key** to issue a new one (update firmware with the new URL)
- Or skip it: **Pair a probe** on the device page gives a short code the probe trades for a new key (firmware 1.6.0+; the old key stops working)

## Alerts not arriving

- Dashboard → Alerts: enabled? freeze threshold set? channel toggled?  
- Quiet hours / vacation / snooze  
- Email: confirm address; SMS needs Pro + Twilio secrets  
- Webhook: HTTPS URL reachable; verify HMAC if secret set  

## CSV export 403

Member/Pro (or admin) required. Free accounts see an upgrade nudge instead.

## A device shows "Last crash"

ProbeHarbor probe firmware 1.5.1 and newer saves a crash to flash, sends it
once with the next upload after restarting, then clears it. The device page
shows where it stopped, decoded into a function name when ProbeHarbor knows
that firmware build.

- **"Restarted by the watchdog"**: the probe stopped responding for a
  minute and restarted itself. The addresses are where the chip was when
  the watchdog fired (usually idle), not the code that hung.
- **A crash right after updating** is often an old one: the previous
  firmware saved it and the new one reports it at its first boot. The
  details show the crashed build's version.
- **Bare addresses ("Stopped at 0x…")**: no function table for that build
  (custom or very old builds). Still useful in a bug report.
- **What to do:** one crash after which the probe kept posting usually
  needs nothing. If it repeats, open an issue with the details box from the
  device page (build, chain of functions and addresses).

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
