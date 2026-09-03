# Data sources

Where every fact on the new site comes from. Updated 2026-09-03.

## Status

| Source | State | Notes |
|---|---|---|
| GitHub (public API) | **Collected** | 59 repos: languages, sizes, descriptions, topics, stars, homepages, push dates |
| LinkedIn profile PDF | **Collected** | `data/_raw/linkedin-profile.pdf` — experience, education, certs, publication title |
| LinkedIn public page | **Partially collected** | `data/_raw/linkedin-public-scrape.md` — one page before the auth wall. Yielded 2 certs and the real WidgetForge story |
| LinkedIn full export | **Not yet requested** | The only way to get Projects, Publications detail, and the full Skills list. See below |
| Current resume | **Missing** | The one in `src/Components/Asserts/` is the college version (roll no. `717821f219`) |
| Headshot | **Missing** | Optional, only if we want one on the site |

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

## What the PDF left out, and how to get it

The "Save to PDF" export is a **summary view**. It deliberately omits several
sections and truncates others. Missing:

- **Projects** — the whole section
- **Publications** — everything except the title
- **Certifications** — issue dates, issuing organisations, credential IDs and URLs
- **Skills** — only the top 3 of what is usually 30–50
- Honors & awards, courses, languages, volunteering, recommendations, endorsements
- Any media or attachments on experience entries

### The fix: LinkedIn's official data export

This is the complete, structured, terms-compliant route, and it returns exactly
the sections you asked about — as CSV files, one per section.

1. Go to **[linkedin.com/mypreferences/d/download-my-data](https://www.linkedin.com/mypreferences/d/download-my-data)**
   (or *Me → Settings & Privacy → Data Privacy → Get a copy of your data*)
2. Choose **"Download larger data archive"** — the *"Want something in
   particular?"* option is a trimmed subset. The full archive takes up to 24 hours
   but is the one that contains everything below
3. LinkedIn emails a download link; unzip into `data/_raw/linkedin-export/`
4. Run `node scripts/parse-linkedin-export.mjs`

**Decided 2026-09-03:** full archive over the subset, and over scraping. An
authenticated scraper needs the `li_at` session cookie, which is the pattern
LinkedIn restricts and bans accounts for — a bad trade against an account with
2K followers while job-hunting. The archive is also *more* complete than a
scraper could be: it's LinkedIn's own database dump rather than a rendering of it.

The files that matter:

| File | Feeds |
|---|---|
| `Profile.csv` | headline, summary, industry |
| `Positions.csv` | `experience.json` |
| `Education.csv` | `education.json` |
| `Certifications.csv` | `education.json` — with dates, issuers, credential URLs |
| `Projects.csv` | cross-referenced against `projects.json` |
| `Publications.csv` | ECO-Bot detail |
| `Skills.csv` | `skills.json` — the full list, not just the top 3 |
| `Shares.csv` | **every post you've written** — the source of the WidgetForge detail |
| `Honors.csv` `Courses.csv` `Languages.csv` `Recommendations_Received.csv` | timeline and social proof |

The parser skips files containing other people's data (Connections, messages,
contacts, ad targeting) and never writes them to output, since
`data/_generated/` is committed.

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
