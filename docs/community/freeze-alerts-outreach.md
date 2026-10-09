# Freeze alerts outreach (drafts)

Copy-ready text for spreading the free, no-hardware freeze alerts on
[/pipe-freeze-forecast](https://probeharbor.dev/pipe-freeze-forecast). Post them yourself, from your own accounts.

Ground rules:

- **Say you built it**, every time. Reddit and most forums treat undisclosed self-promotion as spam.
- **Answer the question first.** The link is a footnote, not the point. If a thread doesn't need it, don't post it.
- **Stick to sourced numbers.** The 20°F danger point is the University of Illinois figure the site already cites; don't invent stats or testimonials.
- Timing: the week before the first hard freeze in a region is when these threads appear and when people act.

---

## 1. Answering "will my pipes freeze?" threads

For r/HomeImprovement, r/Plumbing, r/homeowners, and local-city subreddits during a cold snap.

> It depends less on the exact low than on how long it stays below freezing and where the pipe is. The commonly cited danger point for pipes in unheated spaces is an outdoor low around 20°F (University of Illinois research), but a long or windy night in the upper 20s can still freeze a pipe on an exterior wall, near a garage door, or in a vented crawlspace.
>
> Tonight: open the cabinet doors under sinks on exterior walls, keep the garage door shut, let a faucet on the most exposed line drip, and know where your main shutoff is.
>
> Disclosure: I built a free tool that shows the next five nights' lows and hours below freezing for a US ZIP, and can email you the afternoon before a freezing night: probeharbor.dev/pipe-freeze-forecast. No account or hardware needed.

## 2. Home Assistant / maker communities

For r/homeassistant, r/esp32, and the ESPHome Discord. These readers want the sensor version, so lead with that and mention the alerts as the zero-setup option.

> I built ProbeHarbor, an open-source freeze and leak monitor for garages, crawlspaces, and shops: an ESP32 + DS18B20 (about $25 in parts) or any temperature sensor already in Home Assistant posts readings, and it alerts you before the space hits your freeze threshold. There's a HACS integration (under review for the default store) and the server is open source.
>
> If you just want a heads-up before cold nights without wiring anything, the forecast page does free email alerts by ZIP from the NWS forecast: probeharbor.dev/pipe-freeze-forecast
>
> Happy to answer questions. Feedback on the setup flow especially welcome.

## 3. Local outreach for the embeddable widget

For plumbers, HOAs, property managers, and neighborhood or local-news sites. Send one at a time, personalized. The widget includes a plain link back, and now a "Get free freeze alerts" link for their readers.

**Subject:** Free pipe-freeze widget for your site

> Hi {name},
>
> I run ProbeHarbor, a small freeze-monitoring project. I made a free widget that shows the next three nights' pipe-freeze risk for {city} from the National Weather Service forecast, with a link your visitors can use to get a free email before freezing nights.
>
> It's one line of code and updates on its own: {embed link from the "Embed this forecast" box on probeharbor.dev/pipe-freeze-forecast after looking up {city}}
>
> No cost, no tracking, and nothing to sign up for on your end. If it's useful for your {customers / residents / readers} this winter, feel free to use it; if not, no worries.
>
> Robert

Good fits: plumbers who blog about frozen pipes, HOA newsletters, property managers with vacant units, rural electric co-ops, local weather blogs.

## 4. Neighborhood post (Nextdoor, local Facebook groups)

Only where self-promotion is allowed; read the group rules first.

> Cold nights are coming. I built a free tool that emails you the afternoon before a night cold enough to freeze pipes in garages, crawlspaces, and attics, using the National Weather Service forecast for your ZIP. No app, no sign-up beyond your email, one-click unsubscribe: probeharbor.dev/pipe-freeze-forecast
>
> Quick list for those nights: open sink cabinets on outside walls, keep the garage door shut, drip the most exposed faucet, and know where your main water shutoff is.

---

## Tracking

After each round, check confirmed freeze-alert subscriptions (table `freeze_alert_subscriptions`, `confirmed_at` not null) and which posts or sites sent visitors (GA, referral source). Note what worked here.
