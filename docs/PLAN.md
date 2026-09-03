# Portfolio v7 — rebuild plan

Rebuilding [jebershonvethasingh.vercel.app](https://jebershonvethasingh.vercel.app/)
from a CRA site that describes a final-year student into one that describes a
software engineer two years into shipping developer tooling.

**Branch:** `rebuild/v7` (off `dbd4056`) · **`main` stays live on v6.2 until cutover**

Full visual brief with live theme previews:
<https://claude.ai/code/artifact/07974c8e-a9a8-4cba-ad93-5f0503511c4f>

---

## The framing

This is **not primarily a theme problem**. Three separate issues, in order of
how much they matter:

1. **Content is two years stale.** Every claim on the site describes a student.
   Nothing from 2025–26 exists on it at all.
2. **Content is welded into JSX.** Bio, projects, skills and timeline are hardcoded
   across five `.jsx` files. That is *why* it went stale — updating it means
   editing markup. A new Three.js theme on top of hardcoded content rots exactly
   the same way in another two years.
3. **The shell is aging.** `react-scripts` 5.0.1 is unmaintained and the page
   ships 2.1 MB. Real, but the smallest of the three.

So the data layer is the gate everything else waits behind, and the site must be
complete and fast *before* any WebGL is added.

Details in [AUDIT.md](AUDIT.md).

---

## Phases

| # | Phase | Status |
|---|---|---|
| 00 | Freeze | ✅ done |
| 01 | Harvest | ✅ done |
| 02 | Data layer | ⬜ next |
| 03 | Curate and write the projects | ⬜ |
| 04 | Scaffold + dual-theme design system | ⬜ needs the stack decision |
| 05 | Composite scene — 05a Aurora, 05b Lattice, 05c Prism | ⬜ |
| 06 | Theme parity for the 3D | ⬜ |
| 07 | Content, contact, polish | ⬜ |
| 08 | Ship | ⬜ |


### 00 — Freeze ✅ done
Branch `rebuild/v7` created off `dbd4056`. `main` untouched, live deployment
unaffected. Optional: tag the fallback point.

```bash
git tag -a v6.2-legacy dbd4056 -m "Portfolio v6.2 — last CRA build before v7 rebuild"
```

### 01 — Harvest ✅ done
Raw source material only, no interpretation yet.

- ✅ `scripts/sync-github.mjs` → `data/_generated/github.json` — **56 repos**
  (3 forks dropped), 78 stars, 16 with a live demo
- ✅ LinkedIn profile PDF → `data/_raw/linkedin-profile.pdf`
- ✅ LinkedIn public page → `data/_raw/linkedin-public-scrape.md` — one page
  before the auth wall; yielded 2 unlisted certs and the real WidgetForge story
- ✅ **Apify LinkedIn scrape** → `data/_generated/linkedin.json` via
  `scripts/parse-linkedin-apify.mjs`. 22 certifications, 5 projects, 45 skills,
  3 roles, and the **IEEE publication**. Cross-checked against LinkedIn's own
  `sectionTotals` — only gap is 45 skills vs 47 reported
- ✅ `data/overrides.json` — hand-authored corrections re-applied on every sync,
  so a re-scrape never clobbers them
- ✂️ LinkedIn CSV-export parser **removed** — the Apify scrape covers every
  section, so it was dead code. See *Routes we didn't take* in
  [DATA-SOURCES.md](DATA-SOURCES.md)
- ⬜ Current resume → `data/_raw/`

> **Caution for phase 03.** GitHub stars invert the ranking we want:
> `calculator` and `TaskScheduler` have 5 each, `mcp-redmine-rd` and
> `rapid-reporter` have 0. Stars here measure age, not quality. Never sort the
> project grid by them.

### 02 — Data layer
Turn raw material into the JSON that the whole site reads from, with a JSON
Schema so bad edits fail loudly instead of rendering as blank sections.

```
data/
  profile.json      identity, headline, bio, socials, availability
  experience.json   roles, dates, stack, achievements
  education.json    degree, certifications
  skills.json       grouped, with years + evidence pointing at real repos
  projects.json     the tiered catalogue
  meta.json         SEO, OG, resume path, lastSynced
  overrides.json    ✅ hand-authored fixes layered onto _generated/
  _generated/       ✅ machine-written, never hand-edited
    github.json       sync-github.mjs
    linkedin.json     parse-linkedin-apify.mjs
  _raw/             source material (gitignored)
```

The three-layer split is the point: `_raw/` is what we were given, `_generated/`
is what the scripts derive from it and will happily overwrite, and everything
else is authored by hand. `overrides.json` is the seam — corrections to scraped
data live there and get re-applied on every sync, so nothing hand-fixed is ever
lost to a re-run.

`skills.json` carries **evidence**, not self-assessed percentages. "TypeScript,
2 years" is a claim; "TypeScript — see `widgetforge-server`" is a citation.

> **Gate.** You read the JSON end to end and confirm every fact. Last cheap
> moment to correct anything — after this, copy is woven into layout.

### 03 — Curate and write the projects
Lock the featured list ([IDEAS.md](IDEAS.md#project-shortlist)), then write each
as **problem → approach → outcome**, not a feature list. Fresh screenshots or
short recordings for anything with a live demo.

Highest-leverage writing on the site, and mostly your input rather than mine.

### 04 — Scaffold + dual-theme design system, no 3D
Vite + React + TypeScript. Routing, layout, accessibility baseline, everything
reading from `/data`.

**The theming happens here, not later.** Both palettes are defined as CSS custom
properties in this phase, with the three-state toggle (System / Light / Dark)
working across the whole DOM. The 3D layer reads its colours from those same
properties in phase 05, so if theming is bolted on afterwards the shaders end up
with hardcoded hexes and two sources of truth.

Ends with a complete, fast, entirely boring portfolio — **in both themes** —
that already beats what's live now.

> **Why this order.** The 3D has to be an enhancement, not a dependency. If the
> site is only good with WebGL running, it's broken for every recruiter on a
> locked-down laptop or a mid-range phone.

### 05 — The composite scene, one layer at a time
Spec: [THEME.md](THEME.md). React Three Fiber + drei, code-split so the 3D loads
after first paint.

Built and **measured** in three stages rather than all at once, so a layer that
blows the budget gets caught when it's cheap to drop rather than at the end:

- **05a — Aurora.** The ground and the palette. Cheapest layer, biggest
  atmospheric return. Ships with the tier C static fallback so the degradation
  path exists from day one rather than being retrofitted.
- **05b — Lattice.** Structure and cursor response, composited into the aurora.
  This is the layer that carries the positioning.
- **05c — Prism.** One glass object, refracting the two layers behind it. The
  expensive one, and the one most likely to be cut on mobile.

> **Gate after each stage.** Frame cost measured on a mid-range Android profile,
> not desktop. If a layer can't hold its budget, it ships at a lower tier or
> doesn't ship. Aurora and Lattice are each independently shippable — Prism is
> the only optional one.

### 06 — Theme parity for the 3D
Light mode is where WebGL themes usually fall apart, so it gets its own pass
rather than being assumed.

Per-layer palette work from [THEME.md](THEME.md#per-layer-adjustments): aurora
switches from additive to multiply-style blending, lattice heat becomes
saturation instead of brightness, and prism gains iridescence plus an
attenuation tint so it doesn't vanish on a pale ground. Uniform cross-fade on
theme change, no renderer teardown.

> **Gate.** Both themes screenshotted side by side at every breakpoint. Neither
> is allowed to look like the afterthought.

### 07 — Content, contact, polish
Case-study pages, current resume download, contact form with keys in env vars
and the EmailJS domain allow-list configured, OG images (one per theme), sitemap,
favicons, 404.

### 08 — Ship
Lighthouse against the budget, cross-browser and real-device check, deploy,
repoint the domain. Legacy build stays reachable for a week.

> **Gate.** Budget met on a throttled mobile profile, not on desktop. Desktop
> numbers on a Three.js site are meaningless.

---

## Quality budget

Hard gates, checked on throttled mobile before shipping.

| Metric | Target | Today |
|---|---|---|
| LCP, 4G mobile | < 2.0 s | — |
| Initial JS (gzip), no 3D | < 120 KB | — |
| 3D chunk (gzip), lazy | < 180 KB | — |
| Total page weight | < 900 KB | 2,123 KB |
| Lighthouse accessibility | 100, **both themes** | — |

**Frame budget**, measured per layer on a mid-range Android profile. Phase 05
gates on these individually — a layer that misses its number ships at a lower
tier or doesn't ship:

| Layer | Budget | Notes |
|---|---|---|
| Aurora | ≤ 2 ms | One fullscreen shader. Should be nearly free |
| Lattice | ≤ 3 ms | ~1,600 instances, one draw call |
| Prism | ≤ 5 ms | Transmission costs an extra scene pass. The risky one |
| **Hero total** | **≤ 10 ms** | Leaves 6 ms of the 16.7 ms frame for everything else |

- 3D never blocks first paint. The 1,000 ms artificial spinner does not come with us.
- Three tiers per [THEME.md](THEME.md#performance-tiers). Demotion is one-way
  within a session — a page that oscillates between quality levels while you
  scroll is worse than one that just picks the lower tier.
- The site is **fully usable with WebGL disabled** — not degraded, complete.
- **Both themes are first-class.** Every gate is checked twice. Light mode is
  where WebGL themes normally fall apart, so it gets equal scrutiny, not a
  glance at the end.
- Images as AVIF with WebP fallback, sized to their layout box.
- Keyboard navigable end to end, visible focus, skip link. Canvases `aria-hidden`.
- Theme switch never re-initialises the renderer — uniforms cross-fade instead.

---

## Open

- [ ] **Stack** — recommend Vite + React + TypeScript. Next.js only if you want
      written case studies with real SEO; Astro if raw performance matters most
- [ ] **Theme** — recommend Lattice, optionally with one Prism object on contact.
      See the live previews in the brief
- [ ] **LinkedIn export** — blocks phase 02 completion
- [ ] **Employer-built projects** — four strong candidates name internal RapidData
      systems. See [IDEAS.md](IDEAS.md#the-employer-question)
