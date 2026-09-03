#!/usr/bin/env node
/**
 * parse-linkedin-export.mjs — turn a LinkedIn data archive into structured JSON
 *
 * Consumes the CSVs from LinkedIn's official export and writes one normalised
 * file the data layer can read. This is the route that actually gets Projects,
 * Publications, the full Skills list and certification metadata — none of which
 * the "Save to PDF" view or a logged-out page read will give you.
 *
 * Getting the archive:
 *   1. linkedin.com/mypreferences/d/download-my-data
 *   2. Choose "Download larger data archive" (NOT "Want something in
 *      particular?", which is the trimmed subset). Ready within ~24h.
 *   3. Unzip it into data/_raw/linkedin-export/
 *
 * Then:
 *   node scripts/parse-linkedin-export.mjs
 *
 * Options
 *   --in <dir>    archive directory  (default: data/_raw/linkedin-export)
 *   --out <path>  output file        (default: data/_generated/linkedin.json)
 *   --all         also parse bulky/low-value files (Reactions, Comments, Votes)
 *
 * Privacy: files containing other people's personal data — Connections,
 * messages, contacts, ad-targeting — are skipped and never written to output,
 * because data/_generated/ is committed. Recommendations are kept (they're
 * about you and you'd want them on the site) but carry the author's name, so
 * review before publishing.
 */

import { readdir, readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { dirname, resolve, join, basename } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/* ------------------------------------------------------------------ CSV --- */

/**
 * RFC 4180 parser. LinkedIn's exports contain quoted fields with embedded
 * commas, newlines and doubled quotes — a naive split(",") mangles roughly
 * every Description column, so this does it properly.
 */
function parseCsv(text) {
  // strip BOM
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);

  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];

    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }   // escaped quote
        else inQuotes = false;
      } else field += c;
      continue;
    }

    if (c === '"') { inQuotes = true; }
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\r") { /* handled by \n */ }
    else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else field += c;
  }
  if (field !== "" || row.length) { row.push(field); rows.push(row); }

  if (!rows.length) return [];

  // Some LinkedIn files open with a "Notes:" preamble before the real header.
  // Detect it by column count rather than by "is it a single cell" — Skills.csv
  // is legitimately one column, and a naive check strips the whole file.
  const maxCols = rows.reduce((n, r) => Math.max(n, r.length), 0);
  if (maxCols > 1) while (rows.length && rows[0].length < maxCols) rows.shift();
  if (!rows.length) return [];

  const header = rows.shift().map((h) => h.trim());
  return rows
    .filter((r) => r.some((c) => c.trim() !== ""))
    .map((r) => Object.fromEntries(header.map((h, i) => [h, (r[i] ?? "").trim()])));
}

/* ----------------------------------------------------------------- dates -- */

const MONTHS = { jan:1, feb:2, mar:3, apr:4, may:5, jun:6, jul:7, aug:8, sep:9, oct:10, nov:11, dec:12 };

/** LinkedIn mixes "Jan 2024", "2024-01-15", "1/15/24" and "". Normalise best-effort. */
function normDate(raw) {
  if (!raw) return null;
  const s = raw.trim();
  if (!s || /^present$/i.test(s)) return { raw: s, iso: null, present: true };

  let m;
  if ((m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/)))
    return { raw: s, iso: `${m[1]}-${m[2]}-${m[3]}`, year: +m[1], month: +m[2] };
  if ((m = s.match(/^([A-Za-z]{3})[a-z]*\s+(\d{4})$/))) {
    const mo = MONTHS[m[1].toLowerCase()];
    return mo ? { raw: s, iso: `${m[2]}-${String(mo).padStart(2, "0")}`, year: +m[2], month: mo } : { raw: s, iso: null };
  }
  if ((m = s.match(/^(\d{4})$/))) return { raw: s, iso: m[1], year: +m[1] };
  return { raw: s, iso: null };
}

const pick = (row, ...keys) => {
  for (const k of keys) if (row[k] != null && row[k] !== "") return row[k];
  return null;
};

/* --------------------------------------------------------------- mappers -- */

/** filename (lowercased, no extension) -> { key, map, note } */
const HANDLERS = {
  profile: {
    key: "profile",
    single: true,
    map: (r) => ({
      firstName: pick(r, "First Name"),
      lastName: pick(r, "Last Name"),
      headline: pick(r, "Headline"),
      summary: pick(r, "Summary"),
      industry: pick(r, "Industry"),
      location: pick(r, "Geo Location", "Address"),
      websites: pick(r, "Websites"),
    }),
  },
  positions: {
    key: "experience",
    map: (r) => ({
      company: pick(r, "Company Name"),
      title: pick(r, "Title"),
      description: pick(r, "Description"),
      location: pick(r, "Location"),
      startedOn: normDate(pick(r, "Started On")),
      finishedOn: normDate(pick(r, "Finished On")),
      current: !pick(r, "Finished On"),
    }),
  },
  education: {
    key: "education",
    map: (r) => ({
      school: pick(r, "School Name"),
      degree: pick(r, "Degree Name"),
      notes: pick(r, "Notes"),
      activities: pick(r, "Activities"),
      startedOn: normDate(pick(r, "Start Date", "Started On")),
      finishedOn: normDate(pick(r, "End Date", "Finished On")),
    }),
  },
  certifications: {
    key: "certifications",
    map: (r) => ({
      name: pick(r, "Name"),
      authority: pick(r, "Authority"),
      licenseNumber: pick(r, "License Number"),
      url: pick(r, "Url"),
      startedOn: normDate(pick(r, "Started On")),
      finishedOn: normDate(pick(r, "Finished On")),
    }),
  },
  projects: {
    key: "projects",
    map: (r) => ({
      title: pick(r, "Title"),
      description: pick(r, "Description"),
      url: pick(r, "Url"),
      startedOn: normDate(pick(r, "Started On")),
      finishedOn: normDate(pick(r, "Finished On")),
    }),
  },
  publications: {
    key: "publications",
    map: (r) => ({
      name: pick(r, "Name"),
      publisher: pick(r, "Publisher"),
      description: pick(r, "Description"),
      url: pick(r, "Url"),
      publishedOn: normDate(pick(r, "Published On")),
    }),
  },
  skills: { key: "skills", map: (r) => ({ name: pick(r, "Name") }) },
  honors:  { key: "honors",  map: (r) => ({ title: pick(r, "Title"), description: pick(r, "Description"), issuer: pick(r, "Issuer"), issuedOn: normDate(pick(r, "Issued On")) }) },
  courses: { key: "courses", map: (r) => ({ name: pick(r, "Name"), number: pick(r, "Number") }) },
  languages: { key: "languages", map: (r) => ({ name: pick(r, "Name"), proficiency: pick(r, "Proficiency") }) },
  patents: { key: "patents", map: (r) => ({ title: pick(r, "Title"), status: pick(r, "Status"), number: pick(r, "Number"), url: pick(r, "Url"), issuedOn: normDate(pick(r, "Issued On")) }) },
  "recommendations_received": {
    key: "recommendationsReceived",
    map: (r) => ({
      from: [pick(r, "First Name"), pick(r, "Last Name")].filter(Boolean).join(" ") || null,
      company: pick(r, "Company"),
      jobTitle: pick(r, "Job Title"),
      text: pick(r, "Text"),
      status: pick(r, "Status"),
      createdOn: normDate(pick(r, "Creation Date")),
    }),
  },
  shares: {
    key: "posts",
    map: (r) => ({
      date: normDate(pick(r, "Date")),
      text: pick(r, "ShareCommentary"),
      link: pick(r, "ShareLink"),
      sharedUrl: pick(r, "SharedUrl"),
      visibility: pick(r, "Visibility"),
    }),
  },
};

/** Bulky or low-signal unless you ask for them. */
const OPTIONAL = new Set(["reactions", "comments", "votes", "endorsement_received_info"]);

/** Never written to output — other people's personal data. */
const SKIP = [
  /^connections/i, /^contacts/i, /^messages/i, /^invitations/i,
  /^ad_targeting/i, /^ads_/i, /^rich_media/i, /^search_queries/i,
  /^phonenumbers/i, /^email addresses/i, /^security/i, /^logins/i,
  /^account_status/i, /^inferences/i, /^member_follows/i,
];

/* ------------------------------------------------------------------ main -- */

function parseArgs(argv) {
  const o = { in: "data/_raw/linkedin-export", out: "data/_generated/linkedin.json", all: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--in") o.in = argv[++i];
    else if (a === "--out") o.out = argv[++i];
    else if (a === "--all") o.all = true;
    else throw new Error(`Unknown option: ${a}`);
  }
  return o;
}

/** LinkedIn nests CSVs one level deep in some archives — walk it. */
async function findCsvs(dir) {
  const found = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) found.push(...(await findCsvs(full)));
    else if (/\.csv$/i.test(entry.name)) found.push(full);
  }
  return found;
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const inDir = resolve(ROOT, opts.in);

  try {
    if (!(await stat(inDir)).isDirectory()) throw new Error("not a directory");
  } catch {
    console.error(`\nNo archive found at ${opts.in}\n`);
    console.error("  1. linkedin.com/mypreferences/d/download-my-data");
    console.error('  2. Choose "Download larger data archive" — not the "something in particular" subset');
    console.error(`  3. Unzip into ${opts.in}/\n`);
    if (/\.zip$/i.test(opts.in)) console.error("  (point --in at the unzipped folder, not the .zip)\n");
    process.exit(1);
  }

  const files = await findCsvs(inDir);
  if (!files.length) {
    console.error(`No .csv files under ${opts.in} — is the archive unzipped?`);
    process.exit(1);
  }

  console.log(`Reading ${files.length} CSV files from ${opts.in}\n`);

  const out = {};
  const report = { parsed: [], skipped: [], unrecognised: [] };

  for (const file of files) {
    const stem = basename(file).replace(/\.csv$/i, "");
    const norm = stem.toLowerCase().replace(/\s+/g, "_");

    if (SKIP.some((re) => re.test(norm))) { report.skipped.push(stem); continue; }
    if (OPTIONAL.has(norm) && !opts.all) { report.skipped.push(`${stem} (use --all)`); continue; }

    const handler = HANDLERS[norm];
    const rows = parseCsv(await readFile(file, "utf8"));

    if (!handler) {
      report.unrecognised.push(`${stem} (${rows.length})`);
      out[`_raw_${norm}`] = rows;          // keep it rather than lose it
      continue;
    }

    const mapped = rows.map(handler.map).filter((r) => Object.values(r).some((v) => v != null && v !== ""));
    out[handler.key] = handler.single ? (mapped[0] ?? null) : mapped;
    report.parsed.push(`${handler.key} (${handler.single ? 1 : mapped.length})`);
  }

  const payload = {
    _syncedAt: new Date().toISOString(),
    _source: "LinkedIn official data export",
    _note: "Generated by scripts/parse-linkedin-export.mjs. Do not hand-edit — re-run the script.",
    ...out,
  };

  const outPath = resolve(ROOT, opts.out);
  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, JSON.stringify(payload, null, 2) + "\n", "utf8");

  console.log(`  parsed:       ${report.parsed.join(", ") || "(none)"}`);
  if (report.unrecognised.length) console.log(`  kept as raw:  ${report.unrecognised.join(", ")}`);
  console.log(`  skipped:      ${report.skipped.length} file(s) — private or bulky`);
  console.log(`\n  -> ${opts.out}`);

  // The four sections that motivated the whole export.
  const want = ["projects", "publications", "skills", "certifications"];
  const missing = want.filter((k) => !out[k]?.length);
  if (missing.length) {
    console.log(`\n  ! Still empty: ${missing.join(", ")}`);
    console.log(`    If you took the "something in particular" subset, those files aren't in it.`);
  } else {
    console.log(`\n  All four target sections present.`);
  }
}

main().catch((err) => {
  console.error(`\nparse-linkedin-export failed: ${err.message}`);
  process.exit(1);
});
