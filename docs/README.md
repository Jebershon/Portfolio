# docs/

Working documents for the v7 portfolio rebuild. Not shipped with the site — this
folder is for planning, decisions and reference material only.

| File | What it holds |
|---|---|
| [PLAN.md](PLAN.md) | The phased rebuild plan, current status, and the gates between phases |
| [AUDIT.md](AUDIT.md) | Findings from the v6.2 codebase and live-deployment audit |
| [DATA-SOURCES.md](DATA-SOURCES.md) | Where profile data comes from, what we have, what's still missing |
| [IDEAS.md](IDEAS.md) | Theme directions, project shortlist, positioning questions |

## Conventions

- **Decisions get recorded**, not just made. If we settle a question, it goes in
  the relevant doc with a date so we don't relitigate it three sessions later.
- **Open questions live at the bottom of each doc** under `## Open`.
- `data/_raw/` is gitignored. It holds personal source material (LinkedIn export,
  resume) that shouldn't be in a public repo.

## Branch

Work happens on `rebuild/v7`. `main` stays on v6.2 and keeps serving the live
Vercel deployment until cutover.
