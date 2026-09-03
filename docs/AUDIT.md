# v6.2 audit

Findings from the current codebase and the live deployment, 2026-09-03.
Baseline for what v7 has to beat.

## Measured — live deployment

Collected from `performance.getEntriesByType('resource')` on
<https://jebershonvethasingh.vercel.app/>.

| Finding | Measured | Note |
|---|---|---|
| Total page weight | **2,123 KB** / 24 requests | Roughly 4× what this page needs to be |
| Images | 1,362 KB | `culinary-Delights.png` alone is **1,067 KB** — an unoptimised PNG screenshot |
| CSS | 382 KB | Bootstrap + AOS + icomoon + bootstrap-icons, nearly all unused |
| JS | 320 KB | Includes **three.min.js at 118 KB** |
| Fonts in `src/` | 5.0 MB | Glyphicons + icomoon, bundled but largely unreferenced |
| Artificial load gate | 1,000 ms | `setTimeout` in `Home.jsx:20` blocks *all* content behind a spinner |

Two of these are worth pausing on:

**Three.js is already being downloaded.** Vanta pulls the whole library in to
render a stock `birds` preset with default settings. Moving to a purpose-built
scene costs nothing that isn't already being spent.

**The 1,000 ms spinner is self-inflicted.** The content is ready; a timer holds
it back. Straight deletion, no replacement needed.

## Content

Every claim on the site describes a student. Actual state as of Sep 2026:
2 years 3 months at RapidData (Trainee from Jul 2024, Software Engineer from
Jun 2025), preceded by PG Softwares. See [DATA-SOURCES.md](DATA-SOURCES.md).

| Where | Says | Reality |
|---|---|---|
| `Aboutme.jsx` | "Self-motivated… looking for a responsible position to acquire knowledge" | Employed software engineer |
| `Aboutme.jsx` | "BTECH in Information Technology… eager to contribute" | Graduated May 2025 |
| `Aboutme.jsx` | Timeline ends "Problem Solving Using Java — Current 2024" | Two years of work since |
| `MyProjects.jsx` | Calculator, TaskFlow, Blog Tool, Culinary Delights | All college-era |
| `Footer.jsx` | © 2021 | — |
| `Asserts/` | CV filed under roll number `717821f219` | College resume |

The LinkedIn summary has the same problem — it still says *"Currently pursuing a
Bachelor of Technology"*. Worth fixing at the source too.

## Architecture

**Content is hardcoded across five components.** `Aboutme.jsx`, `MyProjects.jsx`,
`Myskills.jsx`, `Footer.jsx` and `ParticalBg.jsx` each carry copy inline in JSX.
This is the root cause of the staleness — updating a fact means editing markup,
so it never happens. Fixing this is phase 02 and gates everything else.

**`react-scripts` 5.0.1 is unmaintained.** CRA was deprecated; no security
patches, slow builds, webpack config locked behind `eject`.

## Code issues

- `package.json` lists `"portfolio": "file:"` — the package depends on itself
- EmailJS service, template and public keys are literals in `HireMe.jsx:56`.
  The public key is *designed* to be public, so this is not a leak — but it needs
  domain allow-listing in the EmailJS dashboard, or anyone can send through the quota
- `class` used instead of `className` throughout — React ignores it, so the
  associated CSS silently never applies
- `Aboutme.jsx` closes a `<Container>` in the wrong order
- `Home.jsx:49` registers a `scroll` listener on every render, never removed
- `Myskills.jsx` uses 16 PNG icons at 96 px where SVG would be a fraction of the size
- `src/Components/test.txt` is commented-out JSX left in the tree
- `Asserts/` is a misspelling of `Assets/`, propagated through every import

## Carry forward

Not everything here is wrong. Worth keeping in some form:

- The bottom-nav dot rail is a genuinely nice piece of interaction
- The scroll-progress bar
- The idea of a 3D hero — the execution is a stock preset, but the instinct is right
- EmailJS for contact; no backend needed, just move the keys and lock the domain
