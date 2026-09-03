# Ideas & directions

Thinking that hasn't hardened into a decision yet. Anything settled moves to
[PLAN.md](PLAN.md) with a date.

---

## Positioning

The single most important call, and it changes every line of copy on the site.

Your four current projects aren't just simple — they're the **wrong genre**. A
calculator and a blog CRUD say "I can follow a tutorial." Your actual body of
work says something rarer and far more employable:

> **You build the tools other developers use.**

WidgetForge, `mxtest-cli`, an MCP server, a Chrome extension, twelve production
Mendix widgets, a Python desktop utility. Very few people two years in have that.
Everything else here assumes we lean into it hard.

The LinkedIn headline — *"Software Engineer @ RapidData | Building Scalable
Applications"* — is accurate but generic. It describes half a million people.
Something closer to *"I build the tooling that makes Mendix teams faster"* says
what's actually true and is far harder to copy.

**Sharpen it further with the AI angle.** The public LinkedIn page (2026-09-03)
showed something the repos alone didn't: WidgetForge generates widgets from
natural language across three LLM providers, `mcp-redmine-rd` is an MCP server,
`AutomatedBugFix` wires Claude Code into a bug tracker, and your feed is deep in
the MxCLI / Maia MCP conversation. That's not "a developer who also uses AI" —
that's **AI-assisted developer tooling as a specialism**, which is both rare and
very much in demand right now. Strong candidate for the actual positioning.

Also surfaced and currently missing from every plan document: you are a
**2× Mendix Certified Developer** and hold the **Google Cloud Apigee API
Platform** certification, with live Apigee work in your current project. The
certifications belong on the site; the Apigee work may deserve its own timeline
entry.

### How much experience to claim

You described yourself as "2 years experience." LinkedIn says more:

| | Period | Length |
|---|---|---|
| RapidData — Software Engineer | Jun 2025 – present | 1 y 4 m |
| RapidData — Trainee Software Engineer | Jul 2024 – Jun 2025 | 1 y |
| PG Softwares | Jul 2022 – Aug 2023 | 1 y 2 m |

**Settled 2026-09-03.** The Apify scrape tags PG Softwares as **Internship**
(hybrid), so there's no judgement call left: lead with **2+ years professional**
at RapidData, and list PG Softwares in the timeline as the internship it was.
Claiming "3+ years" would fold an internship into a full-time count, which is
exactly the kind of thing an interviewer checks.

Resolved: the entry had no job title on LinkedIn, now set to **Web Development
Intern** in `data/overrides.json`.

---

## Project shortlist — decided

**Six featured + one collection entry.** Locked 2026-09-03, full reasoning and
evidence in **[PROJECTS.md](PROJECTS.md)**.

WidgetForge · react-native-airfob · mcp-redmine-rd · mxtest-cli ·
ECO-Bot/Env_Monitor · rapid-reporter, plus the 12-widget Mendix library as a
single entry.

Two draft picks were cut after probing the repos properly: repo `size` from the
GitHub API counts assets and build output, so MendixDependencyCheckerGUI
(1,621 KB, but 40% TeX and 1% Python) and AutomatedBugFix (8 KB of actual code)
were both far smaller than they looked.

---

## Themes — decided

**Composite of all three: Aurora + Lattice + Prism, in light and dark.**
Chosen 2026-09-03. Full spec in **[THEME.md](THEME.md)**.

Short version: not three effects on a page, but one scene of three layers where
Prism's transmission material refracts the Aurora and Lattice behind it — so the
expensive layer becomes a lens onto the cheap ones instead of a third cost.
Scroll staging means only the hero renders all three.

Implementation note kept from the preview build: `InstancedMesh` per-instance
colour needs `setColorAt()` **without** `vertexColors: true` on the material.
Setting `vertexColors` makes the shader look for a geometry `color` attribute
that BoxGeometry doesn't have, which zeroes every instance colour to black.

---

### Your LinkedIn Projects section has the same problem as the site

The scrape shows only five projects listed, and **every one is college-era**:
Culinary Delights, Env_Monitor, MovieVerse, Personal Portfolio, Voxel. Four are
tagged *"Associated with Karpagam College of Engineering"*.

None of WidgetForge, mxtest-cli, rapid-reporter or mcp-redmine-rd appears. So
the staleness isn't a portfolio problem — it's a **profile-wide** one, and fixing
only the site leaves the same wrong story on the channel recruiters actually
search. Worth updating both.

One reclassification: **Voxel is tagged "Associated with PG Softwares"**, so it
was internship work, not a personal project. Frame it as client work — that's a
stronger claim, not a weaker one.

---

## Smaller ideas

- **Evidence over percentages.** No "React 85%" bars. Each skill points at the
  repo that proves it. Honest, and far more interesting to read
- **A live "what I'm building" strip** fed by `sync-github.mjs` — most recent
  pushes, auto-updating. Directly counters the staleness problem
- **Case studies as their own pages**, not modals. Linkable, and a URL you can
  paste into an application
- **Keep the bottom-nav dot rail** from v6.2 in some form. It's genuinely good
- **`Asserts/` → `Assets/`** while we're rewriting anyway

---

## Open

- [ ] Headline copy — how to phrase the tooling angle without overclaiming
- [ ] Whether PG Softwares appears in the timeline
- [ ] Whether Culinary Delights survives as "earlier work" or is cut entirely
- [ ] MovieVerse or Voxel for the consumer-facing slot
