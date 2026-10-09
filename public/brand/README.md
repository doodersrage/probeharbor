# ProbeHarbor brand marks

Logo system (2026-10): lighthouse in a shield, beacon arcs, harbor waves.
Hand-drawn SVG after the ProbeHarbor brand board; wordmark is Plus Jakarta Sans 700
converted to outlines, so it renders the same as an `<img>` without web fonts.

| File | Concept | Use |
|------|---------|-----|
| `../logo.svg` / `src/assets/gtm-light.svg` | Wordmark, navy + deep teal | Light backgrounds, schema.org logo |
| `../logo-on-dark.svg` / `src/assets/gtm.svg` | Wordmark, sky + teal | Dark UI header / sidebar |
| `../favicon.svg` | Simplified filled shield (no thin arcs) | Browser tab, 16–48px |
| `mark-dark.svg` | Mark on navy tile | App / PWA icon source |
| `mark-circle.svg` | Mark on navy circle | Discord / social avatar |
| `mark.svg` | Full-color mark, white inner | Light backgrounds / print |
| `mark-on-dark.svg` | Sky outline mark | Dark UI without tile |
| `mark-line.svg` | Single-color `currentColor` | Mono / small UI |
| `mark-fg.svg` | Adaptive foreground | Android foreground |
| `mark-maskable.svg` | Full-bleed navy, safe-zone mark | PWA maskable |

Not trademark-cleared: search before printing on hardware or packaging.

## Palette

| Token | Hex | Role |
|-------|-----|------|
| `--color-brand-navy` | `#0B3D5B` | Harbor Blue: logo, light-theme footer, app tiles |
| `--color-brand-teal` | `#0EA5C0` | Signal Teal: beacon, waves, "Harbor" |
| `--color-brand-sky` | `#E6F4FB` | Sky: on-dark logo, pale surfaces |
| `--color-brand-slate` | `#64748B` | Secondary text in print/brand assets |

UI accent derives from Signal Teal: `#22B8D4` on dark (dark ink on buttons, 7.1:1) and
`#08708A` on light (white text, 5.7:1). White on `#0EA5C0` is under 3:1, so never use it for button text.

Fonts: **Plus Jakarta Sans** (UI + wordmark outlines), **JetBrains Mono** (readings).

## CSS usage

Defined in `src/styles/global.css` `@theme`:

| Token family | Use for |
|--------------|---------|
| `--color-accent*` | Primary buttons, text links, focus rings, selected chrome, primary chart trace |
| `--color-info*` | Informational banners/chips only (stays blue) |
| `--color-warning*` | Freeze / high-risk urgency (amber) |
| `--color-success*` | Normal / healthy states (restrained green) |
| `--color-danger*` | Errors / failures |

Legacy `--color-peach` / `--color-terracotta` map to the teal accent family for old class names.

Regenerate rasters: `pnpm brand:icons`
