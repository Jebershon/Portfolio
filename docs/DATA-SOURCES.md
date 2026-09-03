# Data sources

Where every fact on the new site comes from. Updated 2026-09-03.

## Status

| Source | State | Notes |
|---|---|---|
| GitHub (public API) | **Collected** | 59 repos: languages, sizes, descriptions, topics, stars, homepages, push dates |
| **Apify LinkedIn scrape** | **Collected — primary source** | `data/_generated/linkedin.json`. 22 certifications, 5 projects, 45 skills, 3 roles, IEEE publication. Supersedes the two below |
| LinkedIn profile PDF | Collected | `data/_raw/linkedin-profile.pdf` — summary view, now redundant |
| LinkedIn public page | Partially collected | `data/_raw/linkedin-public-scrape.md` — one page before the auth wall |
| LinkedIn full archive | **Dropped** | Superseded by the Apify scrape. Reasoning under *Routes we didn't take* |
| Current resume | **Missing** | The one in `src/Components/Asserts/` is the college version (roll no. `717821f219`) |
| Headshot | **Missing** | Optional, only if we want one on the site |

---

## Apify scrape — 2026-09-03

`node scripts/parse-linkedin-apify.mjs` → `data/_generated/linkedin.json`.
Everything the PDF and the public page were missing.

**Verified against LinkedIn's own `sectionTotals`.** One gap: 45 skills scraped
against 47 reported. Everything else matches exactly.

### The find: the publication is real and citable

**ECO-Bot: Autonomous Agricultural Data Collection Robot** — published in
**IEEE Xplore**, 9 March 2026:
<https://ieeexplore.ieee.org/document/11414537>

A verifiable IEEE paper is a stronger credential than anything else on the
profile, and it backs `Env_Monitor` with peer review rather than a README.

### 22 certifications, 18 with verifiable credential URLs

The PDF listed five. Highlights not previously known:

- **Mendix Rapid Developer** (Sep 2024) + **Mendix Intermediate Developer**
  (Jan 2026) — the "2× Mendix Certified" claim, now with dates
- **Apigee API Platform** — Google Cloud Skills Boost, Apr 2026
- **Meta Front-End Developer** — Feb 2024
- **Snowflake** data warehousing, **Qlik** ×2, **Microsoft Applied Skills (C#)** —
  all Jul 2026, so actively certifying right now
- HackerRank ×6 (SQL, React, JavaScript, Java, CSS, Problem Solving), NPTEL IoT,
  MongoDB, AWS Prompt Engineering, Azure Fundamentals

### Employment, settled

| Role | Company | Type | Period |
|---|---|---|---|
| Software Engineer | RapidData | Full-time, on-site | Jun 2025 – present |
| Trainee Software Engineer | RapidData | Full-time, on-site | Jul 2024 – Jun 2025 |
| Web Development Intern | PG Softwares | **Internship**, hybrid | Jul 2022 – Aug 2023 |

PG Softwares is tagged **Internship**, which settles the positioning question —
see [IDEAS.md](IDEAS.md#how-much-experience-to-claim).

The PG Softwares entry had **no job title** on LinkedIn (the company name sits
in the position field). Set to *Web Development Intern* in `data/overrides.json`
and confirmed by Jebershon on 2026-09-03 — corrections go there, not into
`data/_generated/`, so they survive the next sync.

### Genuinely empty
Honors, courses, languages, volunteering, patents, organizations, recommendations
— all zero in `sectionTotals`. Not scrape failures; those sections are unused.

### Skills — 45 of 47
Top five: **Java · React.js · Node.js · Apigee API Management · Mendix Platform**.
Notable that the profile already carries *Large Language Models (LLM)*, *Prompt
Engineering* and *Prompt Design*, which supports the AI-tooling positioning.

---

## What the LinkedIn PDF gave us

More than expected. It confirmed the entire employment history, which was the
biggest gap:

### Identity
- **Jebershon Vetha Singh J**
- Headline: *Software Engineer @ RapidData | Building Scalable Applications*
- Coimbatore, Tamil Nadu, India (RapidData work location is Chennai)
- Email and phone: see `data/_raw/linkedin-profile.pdf` (kept out of the repo
  deliberately — this folder is committed and the remote is public)
- [linkedin.com/in/jebershon-vetha-singh](https://www.linkedin.com/in/jebershon-vetha-singh)
  · [github.com/Jebershon](https://github.com/Jebershon)
  · [jebershonvethasingh.vercel.app](https://jebershonvethasingh.vercel.app/)

### Experience
**RapidData** — 2 years 3 months total
- **Software Engineer**, June 2025 – present, Chennai
  - Integrated Jira and Oracle Fusion APIs with Mendix
  - Optimisation and code reuse across Mendix microflows and nanoflows
  - Java actions for data handling using lists and hash maps
  - Microsoft Graph API for retrieving organisational data inside Mendix
  - Node.js automation: cross-platform form submissions, dynamic document
    generation from URLs, automated email via Nodemailer
  - Mendix Native Mobile apps — APKs via Android Studio, iOS builds via Xcode
  - Custom Mendix widgets
- **Trainee Software Engineer**, July 2024 – June 2025, Chennai

**PG Softwares** — July 2022 – August 2023, Coimbatore
- Responsive web design, web application development in HTML, CSS, MySQL, Java
- E-commerce customisation, live support, FAQ, articles, classifieds, blogs, portals

### Education
- **Karpagam College of Engineering** — BTech, Information Technology, Oct 2021 – May 2025
- **Bharathi Matriculation Higher Secondary School** — HSC, Computer Science, April 2021

### Certifications *(titles only — no dates, issuers or credential IDs in the PDF)*
- Certified CSS Developer — HackerRank
- MongoDB and the Document Model
- Microsoft Certified: Azure Fundamentals
- Foundations of Prompt Engineering
- Python programming

Two more surfaced from the public page and are **absent from the PDF** — worth
checking whether the PDF export is simply truncating the list:
- **2× Mendix Certified Developer**
- **API Design and Fundamentals of Google Cloud's Apigee API Platform** —
  Coursera / Google Cloud, ~May 2026

### Publications
- **ECO-Bot: Autonomous Agricultural Data Collection Robot** — title only, no
  venue, date, DOI or co-authors

### Top skills *(LinkedIn shows only three in the PDF export)*
Databases · Data Warehousing · Data Transformation

---

## Routes we didn't take

Recorded so we don't relitigate it.

**LinkedIn's official data export** (`download-my-data`). Was the plan until the
Apify scrape landed and covered every section. Its one remaining advantage was
`Shares.csv` — your full post history, which is where the WidgetForge detail
came from. Judged not worth a 24-hour wait plus a CSV parser to maintain, so
`scripts/parse-linkedin-export.mjs` was written, tested, then **removed on
2026-09-03**. It's in git history at `9f456f6` if the post archive ever matters.

**An authenticated scraper.** Needs the `li_at` session cookie, which is the
pattern LinkedIn restricts and bans accounts for. Bad trade against an account
with 1,700 followers while job-hunting. Apify runs on its own infrastructure and
sidesteps that exposure.

### What we tried instead, and how far it got — 2026-09-03

Attempted the browser route before requesting the export. Result, for the record:

1. **Claude in Chrome** (real browser, real session) — the only connected
   instance was on a macOS device, not this machine, and the extension
   disconnected mid-navigation. Never reached the profile.
2. **In-app browser, logged out** — the main public profile rendered fine and was
   genuinely productive (see `data/_raw/linkedin-public-scrape.md`: two
   certifications missing from the PDF, and the real WidgetForge story).
   Then LinkedIn served the auth wall from roughly the fourth request on.
   All `/details/*` sub-pages required sign-in from the first attempt.

So the public page is worth one careful read and nothing more. **Projects,
Publications, Skills and Certification metadata are all behind the wall**, and
signing in on your behalf is off the table.

The official export remains the only route to those four sections. It is also
strictly better output — structured CSV rather than scraped prose — and takes
about ten minutes.

---

## GitHub

Collected via the public REST API, no auth needed. `scripts/sync-github.mjs`
(phase 01) re-runs this on demand and writes `data/_generated/github.json`, so
stars, languages and push dates never need hand-editing.

**Not** derivable from GitHub, and therefore needing your input per project:
the problem each one solved, your role, the outcome, and anything that was
never pushed publicly.

---

## Open

- [ ] Request the LinkedIn targeted export (see above) — blocks the Projects,
      Publications and full Skills data
- [ ] Current resume into `data/_raw/`
- [ ] Confirm whether **PG Softwares (Jul 2022 – Aug 2023)** should appear on the
      site. It overlaps your degree, so it reads as internship or part-time work.
      Including it changes the headline from "2 years" to "3+ years" — see
      [IDEAS.md](IDEAS.md#positioning)
- [ ] Your LinkedIn summary still says *"Currently pursuing a Bachelor of
      Technology"* — stale since May 2025. Worth fixing on LinkedIn itself, not
      just here
