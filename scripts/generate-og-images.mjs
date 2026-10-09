/**
 * Renders the branded 1200x630 Open Graph cards into public/og-*.jpg.
 * The photo card og-story-freeze is not generated here.
 *
 * Usage: node scripts/generate-og-images.mjs
 * Needs network: Google Fonts, and the live /freeze-map for the map card.
 */
import { chromium } from "@playwright/test";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const pub = (p) => path.join(root, "public", p);
const dataUri = async (file, type) =>
  `data:${type};base64,${(await readFile(file)).toString("base64")}`;

const logo = await dataUri(pub("logo-on-dark.svg"), "image/svg+xml");
const mark = await dataUri(pub("brand/mark-on-dark.svg"), "image/svg+xml");
const appIcon = await dataUri(pub("brand/mark-dark.svg"), "image/svg+xml");
const chartShot = await dataUri(
  path.join(root, "src/assets/marketing/probeharbor-dashboard-history-chart.jpg"),
  "image/jpeg",
);

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function page({ kicker, title, sub, visual }) {
  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700;800&family=JetBrains+Mono:wght@500&display=block">
<style>
  * { box-sizing: border-box; margin: 0; }
  body { width: 1200px; height: 630px; overflow: hidden; font-family: "Plus Jakarta Sans", sans-serif; color: #e3edf3;
    background: radial-gradient(900px 520px at 100% 0%, rgb(14 165 192 / 0.22), transparent 60%),
                radial-gradient(700px 500px at 0% 100%, rgb(11 61 91 / 0.9), transparent 70%), #07111a; }
  .waves { position: absolute; left: 0; right: 0; bottom: 0; height: 120px; opacity: 0.5; }
  .wrap { position: absolute; inset: 0; padding: 56px 64px; display: grid; grid-template-columns: 470px 1fr; gap: 48px; align-items: center; }
  .logo { position: absolute; top: 48px; left: 64px; height: 44px; }
  .text { padding-top: 40px; }
  .kicker { font-weight: 700; font-size: 18px; letter-spacing: 0.08em; text-transform: uppercase; color: #22b8d4; margin-bottom: 16px; }
  h1 { font-weight: 800; font-size: 62px; line-height: 1.04; letter-spacing: -0.03em; color: #f3f8fb; }
  .sub { margin-top: 20px; font-weight: 500; font-size: 24px; line-height: 1.35; color: #b5c6d2; }
  .panel { justify-self: end; border-radius: 18px; border: 1px solid rgb(230 244 251 / 0.14); overflow: hidden;
    box-shadow: 0 24px 60px rgb(0 0 0 / 0.45); background: #0f1f2c; }
  .panel img { display: block; }
  pre { font-family: "JetBrains Mono", monospace; font-size: 17px; line-height: 1.6; padding: 26px 28px; color: #b5c6d2; white-space: pre; }
  .k { color: #22b8d4; } .s { color: #a7e3ef; } .m { color: #8aa0af; }
  .plans { display: grid; gap: 14px; width: 520px; padding: 22px; }
  .plan { display: flex; justify-content: space-between; align-items: baseline; padding: 20px 24px; border-radius: 12px;
    background: #142a3a; border: 1px solid rgb(230 244 251 / 0.1); }
  .plan b { font-size: 28px; font-weight: 800; color: #f3f8fb; } .plan span { font-size: 18px; color: #8aa0af; }
  .plan em { font-style: normal; font-size: 30px; font-weight: 800; color: #22b8d4; }
  .plan.pro { border-color: #22b8d4; background: rgb(34 184 212 / 0.12); }
</style></head><body>
<svg class="waves" viewBox="0 0 1200 120" preserveAspectRatio="none" fill="none">
  <path d="M0 70 C200 40 360 40 560 70 S920 100 1200 60 V120 H0 Z" fill="rgb(14 165 192 / 0.18)"/>
  <path d="M0 95 C240 70 420 78 640 96 S980 112 1200 88 V120 H0 Z" fill="rgb(11 61 91 / 0.7)"/>
</svg>
<img class="logo" src="${logo}" alt="">
<div class="wrap">
  <div class="text">
    <div class="kicker">${esc(kicker)}</div>
    <h1>${title}</h1>
    <p class="sub">${esc(sub)}</p>
  </div>
  ${visual}
</div></body></html>`;
}

const cards = {
  "og-dashboard.jpg": {
    kicker: "Garage & workshop monitoring",
    title: "Know before your pipes freeze",
    sub: "Live probe curves, freeze thresholds, and flood alerts from DIY sensors.",
    visual: `<div class="panel" style="width:600px"><img src="${chartShot}" width="600" alt=""></div>`,
  },
  "og-about.jpg": {
    kicker: "ProbeHarbor guides",
    title: "Guides &amp; Docs",
    sub: "Probes, firmware, freeze alerts, and ingest, step by step.",
    visual: `<img src="${mark}" width="360" style="justify-self:center;filter:drop-shadow(0 18px 40px rgb(14 165 192 / 0.35))" alt="">`,
  },
  "og-api.jpg": {
    kicker: "Developers",
    title: "HTTP API",
    sub: "Ingest, metrics, webhooks, and an OpenAPI spec.",
    visual: `<div class="panel"><pre><span class="k">curl</span> -X POST \\
  <span class="s">"https://probeharbor.dev/api/ingest/KEY"</span> \\
  -H <span class="s">"Content-Type: application/json"</span> \\
  -d <span class="s">'{"temp1": 42.5, "door1": false}'</span>

<span class="m">GET  /api/v1/devices
GET  /api/v1/metrics
POST /api/ingest/{key}</span></pre></div>`,
  },
  "og-pricing.jpg": {
    kicker: "Plans & pricing",
    title: "Freeze alerts that scale",
    sub: "Start free. Upgrade for longer history, NWS alerts, and SMS.",
    visual: `<div class="panel"><div class="plans">
      <div class="plan"><div><b>Free</b><br><span>Live curves, freeze + leak alerts</span></div><em>$0</em></div>
      <div class="plan"><div><b>Member</b><br><span>90-day history, forecasts</span></div><em>$4/mo</em></div>
      <div class="plan pro"><div><b>Pro</b><br><span>1-year history, NWS, SMS</span></div><em>$10/mo</em></div>
    </div></div>`,
  },
  "og-android.jpg": {
    kicker: "Android app",
    title: "ProbeHarbor for Android",
    sub: "Live probe readings, freeze alerts, and push notifications on your phone.",
    visual: `<img src="${appIcon}" width="300" style="justify-self:center;border-radius:66px;box-shadow:0 24px 60px rgb(0 0 0 / 0.5)" alt="">`,
  },
  "og-freeze-map.jpg": {
    kicker: "Public freeze map",
    title: "Freeze-risk map",
    sub: "Opt-in, city-level garage temperatures across North America.",
    visual: "__MAP__",
  },
};

const browser = await chromium.launch();

const mapPage = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });
await mapPage.goto("https://probeharbor.dev/freeze-map", { waitUntil: "domcontentloaded" });
await mapPage.waitForTimeout(6000);
await mapPage.addStyleTag({ content: ".leaflet-control-zoom, .leaflet-control-layers { display: none !important; }" });
const mapShot = `data:image/png;base64,${(await mapPage.locator(".leaflet-container").first().screenshot()).toString("base64")}`;
await mapPage.close();
cards["og-freeze-map.jpg"].visual = `<div class="panel" style="width:600px"><img src="${mapShot}" width="600" alt=""></div>`;

const page1200 = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
for (const [file, card] of Object.entries(cards)) {
  await page1200.setContent(page(card), { waitUntil: "networkidle" });
  await page1200.evaluate(() => document.fonts.ready);
  await page1200.screenshot({ path: pub(file), type: "jpeg", quality: 88 });
  console.log(`Wrote public/${file}`);
}
await browser.close();
