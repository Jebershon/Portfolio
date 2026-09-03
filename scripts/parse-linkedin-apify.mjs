#!/usr/bin/env node
/**
 * parse-linkedin-apify.mjs — normalise an Apify LinkedIn profile scrape
 *
 * Emits the same shape as parse-linkedin-export.mjs, so whichever source you
 * have, the data layer reads one file: data/_generated/linkedin.json
 *
 *   node scripts/parse-linkedin-apify.mjs
 *   node scripts/parse-linkedin-apify.mjs --in data/_raw/dataset_*.json
 *
 * Options
 *   --in <path>   Apify dataset JSON. Defaults to the newest
 *                 data/_raw/dataset_linkedin*.json
 *   --out <path>  default: data/_generated/linkedin.json
 *
 * Drops the media bloat (logo/photo URL sets with expiring signed tokens) —
 * those are several hundred lines of noise that rot within weeks.
 */

import { readdir, readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const MONTHS = { jan:1, feb:2, mar:3, apr:4, may:5, jun:6, jul:7, aug:8, sep:9, oct:10, nov:11, dec:12 };

/** Apify gives {month:"Jun", year:2025, text:"Jun 2025"} | {text:"Present"} | null | {} */
function normDate(d) {
  if (!d || typeof d !== "object" || !Object.keys(d).length) return null;
  if (/^present$/i.test(d.text || "")) return { raw: d.text, iso: null, present: true };
  const year = d.year ?? null;
  const month = d.month ? MONTHS[String(d.month).slice(0, 3).toLowerCase()] ?? null : null;
  if (!year) return d.text ? { raw: d.text, iso: null } : null;
  return {
    raw: d.text ?? String(year),
    iso: month ? `${year}-${String(month).padStart(2, "0")}` : String(year),
    year,
    ...(month ? { month } : {}),
  };
}

/** "Issued Jul 2026" / "Mar 9, 2026" -> best-effort ISO */
function normLoose(s) {
  if (!s) return null;
  const t = String(s).replace(/^issued\s+/i, "").trim();
  let m;
  if ((m = t.match(/^([A-Za-z]{3})[a-z]*\s+(\d{1,2}),\s*(\d{4})$/))) {
    const mo = MONTHS[m[1].toLowerCase()];
    return { raw: s, iso: mo ? `${m[3]}-${String(mo).padStart(2,"0")}-${m[2].padStart(2,"0")}` : null, year: +m[3], month: mo };
  }
  if ((m = t.match(/^([A-Za-z]{3})[a-z]*\s+(\d{4})$/))) {
    const mo = MONTHS[m[1].toLowerCase()];
    return { raw: s, iso: mo ? `${m[2]}-${String(mo).padStart(2,"0")}` : null, year: +m[2], month: mo };
  }
  if ((m = t.match(/^(\d{4})$/))) return { raw: s, iso: m[1], year: +m[1] };
  return { raw: s, iso: null };
}

const clean = (v) => (v == null || v === "" ? null : v);

function parseArgs(argv) {
  const o = { in: null, out: "data/_generated/linkedin.json" };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--in") o.in = argv[++i];
    else if (argv[i] === "--out") o.out = argv[++i];
    else throw new Error(`Unknown option: ${argv[i]}`);
  }
  return o;
}

async function findNewest() {
  const dir = resolve(ROOT, "data/_raw");
  let names;
  try { names = await readdir(dir); } catch { return null; }
  const cands = names.filter((n) => /^dataset_linkedin.*\.json$/i.test(n));
  if (!cands.length) return null;
  const withTime = await Promise.all(
    cands.map(async (n) => ({ n, t: (await stat(join(dir, n))).mtimeMs }))
  );
  withTime.sort((a, b) => b.t - a.t);
  return join(dir, withTime[0].n);
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const inPath = opts.in ? resolve(ROOT, opts.in) : await findNewest();

  if (!inPath) {
    console.error("\nNo Apify dataset found in data/_raw/ (expected dataset_linkedin*.json)");
    console.error("Pass one explicitly with --in <path>\n");
    process.exit(1);
  }

  const parsed = JSON.parse(await readFile(inPath, "utf8"));
  const p = Array.isArray(parsed) ? parsed[0] : parsed;
  if (!p) throw new Error("dataset is empty");

  const out = {
    profile: {
      firstName: clean(p.firstName),
      lastName: clean(p.lastName),
      headline: clean(p.headline),
      summary: clean(p.about),
      location: clean(p.location?.linkedinText),
      city: clean(p.location?.parsed?.city),
      country: clean(p.location?.parsed?.country),
      linkedinUrl: clean(p.linkedinUrl),
      publicIdentifier: clean(p.publicIdentifier),
      websites: p.websites ?? [],
      followers: p.followerCount ? Number(p.followerCount) : null,
      connections: p.connectionsCount ? Number(p.connectionsCount) : null,
      openToWork: p.openToWork === "True" || p.openToWork === true,
      verified: p.verified === "True" || p.verified === true,
    },

    experience: (p.experience ?? []).map((e) => ({
      company: clean(e.companyName),
      // LinkedIn stores the company name in `position` when the role had no title
      title: clean(e.position) === clean(e.companyName) ? null : clean(e.position),
      employmentType: clean(e.employmentType),
      workplaceType: clean(e.workplaceType),
      location: clean(e.location),
      description: clean(e.description),
      skills: e.skills ?? [],
      duration: clean(e.duration),
      companyUrl: clean(e.companyLinkedinUrl),
      startedOn: normDate(e.startDate),
      finishedOn: normDate(e.endDate),
      current: /present/i.test(e.endDate?.text ?? ""),
    })),

    education: (p.education ?? []).map((e) => ({
      school: clean(e.schoolName),
      degree: clean(e.degree),
      fieldOfStudy: clean(e.fieldOfStudy),
      period: clean(e.period),
      startedOn: normDate(e.startDate),
      finishedOn: normDate(e.endDate),
    })),

    certifications: (p.certifications ?? []).map((c) => ({
      name: clean(c.title ?? c.name),
      authority: clean(c.issuedBy ?? c.authority),
      issuedOn: normLoose(c.issuedAt),
      url: clean(c.credentialUrl ?? c.link),
    })),

    projects: (p.projects ?? []).map((pr) => ({
      title: clean(pr.title),
      description: clean(pr.description),
      associatedWith: clean(pr.associatedWith?.replace(/^Associated with\s+/i, "")),
      contributors: (pr.contributors ?? []).length,
      startedOn: normDate(pr.startDate),
      finishedOn: normDate(pr.endDate),
    })),

    publications: (p.publications ?? []).map((pu) => ({
      name: clean(pu.title ?? pu.name),
      publisher: clean(pu.publisher),
      description: clean(pu.description),
      url: clean(pu.link ?? pu.url),
      publishedOn: normLoose(pu.publishedAt),
    })),

    skills: (p.skills ?? []).map((s) => ({ name: clean(typeof s === "string" ? s : s.title ?? s.name) })),
    topSkills: (p.topSkills ?? []).map((s) => (typeof s === "string" ? s : s.title ?? s.name)),

    honors: p.honorsAndAwards ?? [],
    courses: p.courses ?? [],
    languages: p.languages ?? [],
    recommendationsReceived: p.receivedRecommendations ?? [],
  };

  const payload = {
    _syncedAt: new Date().toISOString(),
    _source: "Apify LinkedIn profile scrape",
    _sourceFile: inPath.replace(ROOT, "").replace(/\\/g, "/").replace(/^\//, ""),
    _note: "Generated by scripts/parse-linkedin-apify.mjs. Do not hand-edit — re-run the script.",
    ...out,
  };

  const outPath = resolve(ROOT, opts.out);
  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, JSON.stringify(payload, null, 2) + "\n", "utf8");

  const n = (k) => (Array.isArray(out[k]) ? out[k].length : 0);
  console.log(`Parsed ${payload._sourceFile}\n`);
  console.log(`  experience ${n("experience")} · education ${n("education")} · certifications ${n("certifications")}`);
  console.log(`  projects ${n("projects")} · publications ${n("publications")} · skills ${n("skills")}`);
  console.log(`\n  -> ${opts.out}`);

  // Cross-check against LinkedIn's own section counts, if present.
  const totals = p.sectionTotals ?? {};
  const mismatches = Object.entries({
    experience: n("experience"), education: n("education"),
    certifications: n("certifications"), projects: n("projects"),
    publications: n("publications"), skills: n("skills"),
  }).filter(([k, v]) => totals[k] != null && totals[k] !== v);

  if (mismatches.length) {
    console.log(`\n  ! Count mismatch vs LinkedIn's sectionTotals — the scrape may be truncated:`);
    for (const [k, v] of mismatches) console.log(`      ${k}: got ${v}, LinkedIn reports ${totals[k]}`);
  }

  // Roles where LinkedIn has no distinct title (the company name was entered as
  // the position) can't be rendered as "Title at Company" — flag for a manual fix.
  const untitled = out.experience.filter((e) => !e.title).map((e) => e.company);
  if (untitled.length) {
    console.log(`\n  ! No job title on LinkedIn for: ${untitled.join(", ")}`);
    console.log(`    Set one by hand in experience.json — the site can't render "null at Company".`);
  }
}

main().catch((err) => {
  console.error(`\nparse-linkedin-apify failed: ${err.message}`);
  process.exit(1);
});
