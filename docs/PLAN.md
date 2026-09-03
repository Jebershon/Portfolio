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

### 00 — Freeze ✅ done
Branch `rebuild/v7` created off `dbd4056`. `main` untouched, live deployment
unaffected. Optional: tag the fallback point.

```bash
git tag -a v6.2-legacy dbd4056 -m "Portfolio v6.2 — last CRA build before v7 rebuild"
```

### 01 — Harvest 🔄 waiting on the archive
Raw source material only, no interpretation yet.

- ✅ `scripts/sync-github.mjs` → `data/_generated/github.json` — **56 repos**
  (3 forks dropped), 78 stars, 16 with a live demo
- ✅ LinkedIn profile PDF → `data/_raw/linkedin-profile.pdf`
- ✅ LinkedIn public page → `data/_raw/linkedin-public-scrape.md` — one page
  before the auth wall; yielded 2 unlisted certs and the real WidgetForge story
- ✅ `scripts/parse-linkedin-export.mjs` — written and tested against a fixture,
  ready for the archive
- ⏳ **LinkedIn full archive requested — up to 24h.** Unzip into
  `data/_raw/linkedin-export/`, then run the parser
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
  _generated/
    github.json     written by sync-github.mjs, never hand-edited
  _raw/             source material (gitignored)
```

`skills.json` carries **evidence**, not self-assessed percentages. "TypeScript,
2 years" is a claim; "TypeScript — see `widgetforge-server`" is a citation.

> **Gate.** You read the JSON end to end and confirm every fact. Last cheap
> moment to correct anything — after this, copy is woven into layout.

### 03 — Curate and write the projects
Lock the featured list ([IDEAS.md](IDEAS.md#project-shortlist)), then write each
as **problem → approach → outcome**, not a feature list. Fresh screenshots or
short recordings for anything with a live demo.

Highest-leverage writing on the site, and mostly your input rather than mine.

### 04 — Scaffold, no 3D
Vite + React + TypeScript. Design tokens, type scale, routing, layout,
accessibility baseline, everything reading from `/data`.

Ends with a complete, fast, entirely boring portfolio that already beats what's
live now.

> **Why this order.** The 3D has to be an enhancement, not a dependency. If the
> site is only good with WebGL running, it's broken for every recruiter on a
> locked-down laptop or a mid-range phone.

### 05 — Build the chosen theme
React Three Fiber + drei, code-split so the 3D loads after first paint. Ships
with a `prefers-reduced-motion` static fallback, a reduced mobile tier, and a
graceful path when WebGL is unavailable. Held to the budget below.

### 06 — Content, contact, polish
Case-study pages, current resume download, contact form with keys in env vars
and the EmailJS domain allow-list configured, OG images, sitemap, favicons, 404.

### 07 — Ship
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
| Initial JS (gzip) | < 120 KB | — |
| Total page weight | < 900 KB | 2,123 KB |
| Lighthouse accessibility | 100 | — |

- 3D never blocks first paint. The 1,000 ms artificial spinner does not come with us.
- Every scene has three tiers: full desktop, reduced mobile, static image for
  reduced-motion or missing WebGL. Auto-downgrade below 45 fps for two seconds.
- The site is **fully usable with WebGL disabled** — not degraded, complete.
- Images as AVIF with WebP fallback, sized to their layout box.
- Keyboard navigable end to end, visible focus, skip link. Canvases `aria-hidden`.

---

## Open

- [ ] **Stack** — recommend Vite + React + TypeScript. Next.js only if you want
      written case studies with real SEO; Astro if raw performance matters most
- [ ] **Theme** — recommend Lattice, optionally with one Prism object on contact.
      See the live previews in the brief
- [ ] **LinkedIn export** — blocks phase 02 completion
- [ ] **Employer-built projects** — four strong candidates name internal RapidData
      systems. See [IDEAS.md](IDEAS.md#the-employer-question)
