#!/usr/bin/env node
/**
 * Tell search engines which public URLs exist, via IndexNow (Bing, Yandex,
 * Seznam, Naver; Bing's index also feeds Copilot and ChatGPT search).
 * Google does not take part and retired its sitemap ping endpoint in 2023:
 * submit the sitemap once in Search Console and it re-reads it on its own.
 *
 * Usage: pnpm ping:sitemaps [baseUrl] [--dry-run]
 */
const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const base = (
  args.find((arg) => !arg.startsWith("--")) ??
  process.env.SITE_URL ??
  "https://thermaltrace.dev"
).replace(/\/+$/, "");

/** Public by design: IndexNow verifies ownership by fetching /<key>.txt (see public/). */
const INDEXNOW_KEY = "a5544ddcbde3481a9d1cd26a024119fc";
const sitemapUrl = `${base}/sitemap-0.xml`;

const sitemapRes = await fetch(sitemapUrl);
if (!sitemapRes.ok) {
  console.error(`✗ ${sitemapUrl} — HTTP ${sitemapRes.status}`);
  process.exit(1);
}
const urlList = [...(await sitemapRes.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) =>
  m[1].replace(/&amp;/g, "&"),
);
console.log(`Sitemap: ${sitemapUrl} (${urlList.length} URLs)`);

if (urlList.length === 0) {
  console.error("✗ Sitemap has no URLs; nothing to submit.");
  process.exit(1);
}

if (dryRun) {
  console.log("Dry run: not submitting to IndexNow.");
  process.exit(0);
}

const keyRes = await fetch(`${base}/${INDEXNOW_KEY}.txt`);
if (!keyRes.ok || (await keyRes.text()).trim() !== INDEXNOW_KEY) {
  console.error(`✗ ${base}/${INDEXNOW_KEY}.txt is not serving the key; deploy first.`);
  process.exit(1);
}

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: new URL(base).host,
    key: INDEXNOW_KEY,
    keyLocation: `${base}/${INDEXNOW_KEY}.txt`,
    urlList,
  }),
});

// 200 = accepted, 202 = accepted, key validation pending.
if (res.status === 200 || res.status === 202) {
  console.log(`✓ IndexNow accepted ${urlList.length} URLs — HTTP ${res.status}`);
} else {
  console.error(`✗ IndexNow — HTTP ${res.status} ${await res.text()}`);
  process.exit(1);
}

console.log(`\nGoogle: submit ${base}/sitemap-index.xml once in Search Console → Sitemaps.`);
