# Design system — Psychedelics & Contemplation Lab

Shared visual identity for the lab's four websites. **Change something here and every site picks it up at its next build** — nothing has to be re-implemented site by site.

| Site | Repository | Accent |
|---|---|---|
| Psychedelics & Contemplation Lab | `lab-website` | `#4B6A8A` |
| The ReSPCT Guidelines | `respct-guidelines-website` | `#3F6F6B` |
| StaMPS Data Framework | `stamps-website` | `#B5502F` |
| The Montreal Model | `montreal-model-website` | `#6E4560` |

Living style guide: https://the-psychedelics-and-contemplation-lab.github.io/design-system/

## What is in here

```
src/styles/tokens.css     colours, type scale, spacing, radii — the single source of truth
src/styles/fonts.css      self-hosted Source Serif 4 + Inter (Latin subsets, ~660 KB)
src/styles/base.css       reset, typography, links (↗ / ⤓ automatic), tables, buttons, cards, focus ring
src/styles/print.css      print sheet: no nav/footer, repeated table headers, link URLs printed
src/components/           Layout, Header (McGill | LDI–JGH | site lockup), Footer, Seo, Button, Card, PageHeader, Section, LangSwitch
src/assets/logos/         official McGill and LDI–JGH SVGs
docs/                     the style-guide site (published to GitHub Pages)
```

## How a site uses it

```json
"dependencies": { "@pcl/design-system": "github:The-Psychedelics-and-Contemplation-Lab/design-system#main" }
```

```astro
---
import { Layout, PageHeader, Section } from '@pcl/design-system';
import { site, nav } from '../site.config';
---
<Layout site={site} page={{ title: '…', description: '…', path: '/' }} nav={nav}>
  <main id="main">
    <PageHeader eyebrow="…" title="The one and only H1" lead="…" />
    <Section><div class="prose">…</div></Section>
  </main>
</Layout>
```

The site's `site.config.ts` sets its **accent** and its affiliation text; everything else comes from here.

## Making a design change

1. Edit a token or a component, open a pull request (or push to `main` if you are an admin).
2. The style guide rebuilds automatically so you can check the result.
3. Each site rebuilds nightly and on every push, pulling the latest `main` of this package. To rebuild a site immediately, open its repository → *Actions* → *Build and deploy* → *Run workflow*.

Pin a site to a tag (`#v1.2.0`) instead of `#main` if you ever need to freeze it.

## Rules baked in

- Exactly one `<h1>` per page (`<PageHeader>`), headings in order, `scope="col"` on table headers.
- Every animation is wrapped in `@media (prefers-reduced-motion: no-preference)`.
- Measured contrast: body text ≥ 4.5:1, large text ≥ 3:1, on `#FBFAF8` and `#FFFFFF`.
- Outbound links get `target="_blank" rel="noopener noreferrer"` + ↗, PDFs get ⤓ — automatically, via CSS.
- No background video. A `<canvas>` hero is allowed only behind `prefers-reduced-motion`.
- No participant-recruitment or health-data forms, ever. Link to REDCap / institutional tools.
