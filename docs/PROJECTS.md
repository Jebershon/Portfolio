# Featured projects — the pick

**Selected 2026-09-03.** Six featured projects plus one collection entry, chosen
to cover the widest span of demonstrable expertise with the least overlap.

Evidence: language byte counts and repo structure probed from the GitHub API,
not read off descriptions. That probe changed two rankings — see *Cut on
evidence* below.

---

## The selection rule

Six slots. Each one has to prove something **no other slot proves**. A portfolio
with five projects that all say "I can build a React app" says it once, badly.

| # | Project | Proves |
|---|---|---|
| 1 | **WidgetForge** | AI-assisted tooling · full-stack TypeScript · product thinking |
| 2 | **react-native-airfob** | Native mobile, *both* platforms · BLE hardware · pragmatic architecture |
| 3 | **mcp-redmine-rd** ⚑ | AI-native protocol work · Python · engineering rigour |
| 4 | **mxtest-cli** | CI/CD · containerisation · E2E testing · CLI design |
| 5 | **ECO-Bot / Env_Monitor** | IoT · **peer-reviewed research** · domain range |
| 6 | **rapid-reporter** ⚑ | Browser extension APIs · debugging tooling · demos instantly |
| + | **Mendix widget library** | Depth on the professional platform — 12 shipped widgets |

⚑ = built for RapidData, names internal systems. See *The employer question*.

---

## 1. WidgetForge — lead with this

**263 KB TypeScript** across two repos (`widgetforge-frontend` 209 KB, 71% TS ·
`widgetforge-server` 54 KB, 100% TS). Live demo.

Describe a Mendix widget in plain English; it generates the TSX, the XML, and a
deployable `.mpk`. Multi-provider AI — OpenAI, Gemini, Anthropic — with BYOK,
live build-log streaming, and a manual mode for when you want control.

Why it leads: it's the only entry that is simultaneously a **product**, a
**full-stack system**, and an **AI integration**. It also has the best origin
story on the list, in your own words — *"I got tired of fighting XML,
boilerplate, and .mpk packaging, so I built something that fights it for me."*
That sentence does more work than any feature list.

⚠️ Frontend responds, but the Railway backend was on a trial. **Needs a real
functional test before we feature the demo link.**

## 2. react-native-airfob — the technical differentiator

**Kotlin 30% · Swift 29% · JavaScript 28%**, with CI configured. 151 KB.

BLE tap-and-go access credentials behind a single JS API, shipped with a working
mock so the whole chain runs before the SDK licence lands.

Why it ranks this high: that language split is **rare**. Most web developers who
claim "React Native" have written zero native code. You have near-equal Kotlin
and Swift, which means you actually built the native modules on both platforms.
It's the hardest thing on this list to fake and the easiest to verify.

The mock is worth writing about explicitly — unblocking your team on a
dependency you didn't control is a judgement call, not a coding task.

## 3. mcp-redmine-rd — the best-engineered repo you have ⚑

**143 KB Python**, and the *only* repo in the set carrying **tests, a
Dockerfile, and a LICENSE**.

An MCP server pulling tickets — screenshots included as viewable images — into
Claude Code, plus a skill that carries an issue from ticket to verified fix.

Two reasons it earns a slot. MCP is the most in-demand thing on this list right
now. And it's the one repo where the *engineering practice* is visible from the
file tree alone, which quietly says more about you than the feature does.

## 4. mxtest-cli — the CI story

**158 KB JavaScript.** Zero-config build, run and test for Mendix apps on Docker
and Playwright.

Containerisation, end-to-end automation and CLI ergonomics in one artifact.
That combination reads as "can own the pipeline," which is a role, not a skill.

## 5. ECO-Bot / Env_Monitor — the credential

**84 KB JavaScript**, live demo — but the code is not the point.

**Published in IEEE Xplore**, 9 March 2026:
<https://ieeexplore.ieee.org/document/11414537>

An IoT-powered automated tractor doing land analysis, ploughing and irrigation.
A citable IEEE paper is the single strongest credential on your whole profile,
and it's the only non-tooling project here — which is exactly why it stays.
Six tooling projects in a row is a monotone.

**Lead this entry with the paper, not the repo.**

## 6. rapid-reporter — the ten-second demo ⚑

**82 KB JavaScript**, Chrome/Edge MV3, MIT licensed.

One-click bug reports capturing screenshot, console, network and DOM state.

It earns its slot on **demonstrability**. Most of this list needs explaining;
this one you show. Click, bug filed, done. Being MIT-licensed and useful outside
its origin also makes it the easiest to talk about publicly.

## + The Mendix widget library — one entry, never twelve

Twelve shipped pluggable widgets: Carousel Container, CarouselCharts, PagetoPDF,
BarCode, CompactText, FileUpload, NativeImageViewer, NativeImageUploader,
CustomWebView, PWA SwipeRefresh, audioTextSync, **Apryse WebViewer**
(158 KB TypeScript — the substantial one, worth naming).

*"Twelve production widgets"* is a strong signal. Twelve thin cards dilute the
six above and turn the page into a scroll. One entry, a strip of names, one link.

---

## Cut on evidence

Two projects were in the draft shortlist and came out after probing. Repo `size`
from the GitHub API counts **everything** — assets, PDFs, build output — so it's
a bad proxy for engineering effort.

| Project | Looked like | Actually is |
|---|---|---|
| **MendixDependencyCheckerGUI** | 1,621 KB, "desktop utility" | **HTML 59%, TeX 40%, Python 1%** — the bulk is generated docs and LaTeX. Maybe 16 KB of real Python |
| **AutomatedBugFix** | 2,076 KB repo, "automation setup" | **8 KB of Python.** A thin wrapper script, not a project |

Also cut from featured: **MovieVerse** (28 KB) and **Voxel** (59 KB) are too
small to displace anything above, and a consumer app would dilute the tooling
story rather than round it out. `ConferenceRoomsClient` is 15 KB of actual code;
`ebenezerConsultancy` is 3 KB.

And the whole college set stays cut: Calculator · TaskFlow · Blog Management ·
Culinary Delights · todo_List · Quiz · Library · TaskScheduler ·
StudentManagement · Sample-Javascript · Cartoon.

> **Never sort by stars.** `calculator` has 5, `mcp-redmine-rd` has 0. Stars here
> measure age and classmate goodwill, not quality.

---

## What the six add up to

Read together they describe someone who:

- builds **developer tooling**, not just applications — five of six are tools
  other engineers use
- works **across the stack and across platforms** — TypeScript, Python, Kotlin,
  Swift, JavaScript, Docker
- is **early on AI-native workflows** — MCP servers and multi-provider LLM
  integration, shipped, not demoed
- has **research credibility** — an IEEE paper
- ships with **practice**, not just code — tests, CI, Docker, licences

That is a materially different person from the one the current site describes.

## The employer question ⚑

`mcp-redmine-rd` and `rapid-reporter` were built for RapidData, and
`mcp-redmine-rd` names `tracker.rapiddata.com` in its description. Already public
on GitHub, but a portfolio *markets* them, which is different.

Recommended: an informal OK from your manager, and rewrite both descriptions to
drop internal hostnames and ticket references regardless. The engineering reads
just as well described generically as "a bug tracker." The `confidential` flag in
`projects.json` exists so a project can render with detail withheld rather than
being dropped.

**This is the one open decision blocking phase 03.**

## Open

- [ ] Functional test of the WidgetForge demo — is the Railway backend alive?
- [ ] Employer sign-off on the two ⚑ projects
- [ ] Order: WidgetForge first is settled. Is airfob or mcp-redmine second?
- [ ] Whether Culinary Delights survives as a one-line "earlier work" mention
