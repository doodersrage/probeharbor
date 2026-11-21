# ProbeHarbor: brand search plan

2026-11-20. Companion to [`IMPLEMENTATION_PLAN.md`](IMPLEMENTATION_PLAN.md);
record completed increments in `IMPLEMENTATION_LOG.md`.

## Problem

Searching Google for `probeharbor.dev` returns the site. Searching for
`probeharbor` or `probe harbor` does not; the owner reports Harbor Freight
results instead (owner's observation, 2026-11-20; not reproduced from this
repository, and Google results vary by person and place).

## Likely cause

Not confirmed; step 0 is there to confirm it.

- The name dates from 2026-10-09 (`src/lib/rebrand.ts`), about six weeks
  ago. Google has few pages outside this site that use the word
  "ProbeHarbor", so it reads the query as "probe" + "harbor" and serves the
  strongest match for those two words.
- The site itself is not the weak point. Already in place: canonical URLs,
  `og:site_name`, Organization / WebSite / SoftwareApplication JSON-LD
  (`src/lib/schemaMarkup.ts`), sitemap, IndexNow after each deploy, and 301s
  from the ThermalTrace hosts (`src/lib/siteConfig.ts`).
- The funnel note in `IMPLEMENTATION_PLAN.md` ("Waiting on the owner", 7)
  already names acquisition as the constraint, and the outreach drafts in
  `docs/community/` are not posted yet. Those posts are also the main fix
  here: they are what puts the name on other sites.

## Gaps found in the repository

1. The two-word spelling "Probe Harbor" appears nowhere in `src/`, so the
   site has nothing to match that query against.
2. `Organization.alternateName` is "ProbeHarbor temperature dashboard", a
   description. It does not carry the two-word spelling.
3. `Organization.sameAs` lists only the GitHub repository.
4. Page titles put the brand last (`Layout.astro`: `${title} · ${BRAND_NAME}`).
   Fine for guides; on the home page the brand should lead.
5. No page is about the name itself (what ProbeHarbor is, who runs it, that
   it was ThermalTrace). The FAQ answer is the only place.

## Scope

Make the site rank first for its own name, in both spellings.

## Non-goals

- Ranking for "probe", "harbor" or any Harbor Freight product term.
- Paid search ads.
- Renaming again.
- Changes to app behaviour, ingest, alerts or data.

## Steps

### 0. Baseline (owner, before any change)

- Search Console → Performance, last 28 days, queries containing
  `probeharbor` and `probe harbor`: impressions, clicks, average position.
  Zero impressions and a low position are different problems.
- Search Console → URL inspection on `https://probeharbor.dev/`: indexed,
  and the canonical Google chose.
- Search `probeharbor` signed out. Note whether Google prints "Showing
  results for probe harbor" or "Did you mean". If it does, Google is
  rewriting the query, which only brand usage elsewhere corrects.
- Ahrefs: referring domains to `probeharbor.dev` and how many use
  "ProbeHarbor" as the link text.
- Add these numbers here, dated.

### 1. On-site changes (one small increment)

- `getOrganizationSchema` and `getWebSiteSchema`: `alternateName` becomes
  `["Probe Harbor"]`. See the decision below about the former name.
- `sameAs`: add each real profile that exists (Discord invite, Hackaday.io
  project, Home Assistant community thread, the Android app listing). Only
  add URLs that are live.
- Home page title leads with the brand: "ProbeHarbor · Garage freeze &
  flood monitoring", in all five languages. Other pages keep brand-last.
- One visible use of "Probe Harbor (ProbeHarbor)" on the home page or
  footer, and in the FAQ answer about the name, in all five languages.
- Tests: update the `schemaMarkup` unit tests; `pnpm test`,
  `pnpm typecheck`, `pnpm lint`, `pnpm build`. After deploy, check the home
  page in Google's Rich Results Test.

### 2. A page about the name (optional, small)

`/about/probeharbor` or a section on an existing About page: what it is,
who builds it, the rename date, links to the repository and docs. Gives
Google one page whose subject is the brand. Skip if step 1 and step 3 move
the baseline.

### 3. Off-site mentions (owner; the step that matters most)

Each item is a page on another site that says "ProbeHarbor" and links to
`https://probeharbor.dev`.

- GitHub: repository description and topics; the same for the integration
  and companion repositories; profile README.
- Post the drafts already in `docs/community/`: the ESP32 freeze-probe
  build write-up, the Home Assistant forum post, the Discord / HACS
  announcement, the freeze-alerts outreach.
- Project listings: Hackaday.io, the ESPHome and Home Assistant community
  showcases, AlternativeTo, awesome-esp / awesome-home-assistant lists.
- `robmcd.name`: a project entry that links with the text "ProbeHarbor".
- Anything still published under the ThermalTrace name (old posts, store
  listings, package names): edit the name and link where the owner
  controls it.

### 4. Review

Repeat step 0 at 2, 4 and 8 weeks after step 1 deploys. Record the numbers
here.

## Owner decisions

1. **Former name in structured data.** Listing "ThermalTrace" as an
   `alternateName` would help people who search the old name, but the
   rename happened because that name collided with another product.
   Default in this plan: leave it out.
2. **Hyphenated or spaced variants** ("Probe-Harbor") in visible copy:
   default no; one two-word mention is enough.
3. **Which community posts go out, and when.** Freeze season is the
   natural hook.

## Acceptance criteria

- `probeharbor` (signed out, US): probeharbor.dev in first position.
- `probe harbor`: probeharbor.dev on the first page.
- Search Console shows impressions for both queries with average position
  3 or better for `probeharbor`.
- At least 10 referring domains that use the brand name.

The one-word query should move within a few weeks of step 3. The two-word
query competes with ordinary words and may take months; if it has not
reached the first page 8 weeks after step 3, revisit step 2 and the
outreach list before anything else.

## Risks

- A home-page title change can shift rankings for the freeze and flood
  queries the page serves now. Keep the descriptive half of the title, and
  compare Search Console for those queries before and after.
- Translated copy: the brand stays untranslated; check the five locales
  render the two-word mention sensibly.
- A push to `main` deploys to production. Step 1 goes through a branch and
  the usual checks.
- Outreach posts that read as advertising get removed. The drafts in
  `docs/community/` are build write-ups; keep them that way.

## Status

| Step | Status |
|---|---|
| 0. Baseline | Open (owner) |
| 1. On-site changes | Done 2026-11-20 except `sameAs` (see below) |
| 2. Name page | Open (optional) |
| 3. Off-site mentions | Open (owner) |
| 4. Review | Open |

Step 1, 2026-11-20: `alternateName: ["Probe Harbor"]` on Organization and
WebSite; home page title is brand-first in all five languages (Layout
`brandFirst`); the home hero line and the FAQ answer about the name carry
the two-word spelling in all five languages. `sameAs` is unchanged: no
Discord, Hackaday.io, forum thread or Play Store URL is confirmed live from
this repository. Add each one when it exists. Checks: `pnpm test` (3805
passed), `pnpm typecheck`, `pnpm lint`, `pnpm build`; titles and JSON-LD
checked on a local dev server. Rich Results Test after deploy: not yet run.
