#!/usr/bin/env node
/**
 * sync-github.mjs — snapshot every public repo into data/_generated/github.json
 *
 * The portfolio reads live repo facts (language, stars, last push) from this
 * file instead of having them typed into JSX. Re-run it whenever you want the
 * site to catch up with reality.
 *
 *   node scripts/sync-github.mjs
 *   node scripts/sync-github.mjs --user Jebershon --languages
 *
 * Options
 *   --user <login>   GitHub user            (default: Jebershon)
 *   --languages      also fetch the per-repo language breakdown. Costs one
 *                    request per repo, so it needs GITHUB_TOKEN in practice.
 *   --include-forks  keep forked repos      (default: dropped)
 *   --out <path>     output file            (default: data/_generated/github.json)
 *
 * Auth is optional. Unauthenticated you get 60 requests/hour, which is enough
 * for the default run but not for --languages. To raise it to 5,000:
 *   export GITHUB_TOKEN=ghp_...        (bash)
 *   $env:GITHUB_TOKEN = "ghp_..."      (PowerShell)
 */

import { writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function parseArgs(argv) {
  const opts = {
    user: "Jebershon",
    languages: false,
    includeForks: false,
    out: "data/_generated/github.json",
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--user") opts.user = argv[++i];
    else if (a === "--out") opts.out = argv[++i];
    else if (a === "--languages") opts.languages = true;
    else if (a === "--include-forks") opts.includeForks = true;
    else if (a === "--help" || a === "-h") opts.help = true;
    else throw new Error(`Unknown option: ${a}`);
  }
  return opts;
}

const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;

async function gh(path) {
  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "portfolio-sync",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`https://api.github.com${path}`, { headers });

  if (res.status === 403 || res.status === 429) {
    const remaining = res.headers.get("x-ratelimit-remaining");
    const reset = Number(res.headers.get("x-ratelimit-reset") || 0);
    if (remaining === "0") {
      const mins = Math.max(0, Math.ceil((reset * 1000 - Date.now()) / 60000));
      throw new Error(
        `GitHub rate limit hit. Resets in ~${mins} min.` +
          (token ? "" : " Set GITHUB_TOKEN to raise the limit from 60 to 5,000/hour.")
      );
    }
  }
  if (!res.ok) throw new Error(`GET ${path} -> ${res.status} ${res.statusText}`);
  return res.json();
}

async function fetchAllRepos(user) {
  const all = [];
  for (let page = 1; ; page++) {
    const batch = await gh(
      `/users/${encodeURIComponent(user)}/repos?per_page=100&page=${page}&sort=pushed&direction=desc`
    );
    all.push(...batch);
    if (batch.length < 100) break;
  }
  return all;
}

/** Trim the API payload down to what the site actually renders. */
function shape(r) {
  return {
    name: r.name,
    fullName: r.full_name,
    description: r.description,
    url: r.html_url,
    homepage: r.homepage || null,
    language: r.language,
    topics: r.topics ?? [],
    stars: r.stargazers_count,
    forks: r.forks_count,
    watchers: r.subscribers_count ?? null,
    openIssues: r.open_issues_count,
    sizeKb: r.size,
    license: r.license?.spdx_id ?? null,
    isFork: r.fork,
    isArchived: r.archived,
    createdAt: r.created_at,
    pushedAt: r.pushed_at,
    updatedAt: r.updated_at,
  };
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) {
    console.log(
      String(await import("node:fs").then((fs) => fs.readFileSync(fileURLToPath(import.meta.url), "utf8")))
        .split("*/")[0]
        .replace(/^#!.*\n/, "")
    );
    return;
  }

  console.log(`Syncing github.com/${opts.user}${token ? " (authenticated)" : " (anonymous, 60 req/hr)"}`);

  const raw = await fetchAllRepos(opts.user);
  console.log(`  fetched ${raw.length} repos`);

  let repos = raw.map(shape);
  const forkCount = repos.filter((r) => r.isFork).length;
  if (!opts.includeForks) {
    repos = repos.filter((r) => !r.isFork);
    if (forkCount) console.log(`  dropped ${forkCount} fork(s) — pass --include-forks to keep them`);
  }

  if (opts.languages) {
    console.log(`  fetching language breakdown for ${repos.length} repos...`);
    for (const r of repos) {
      try {
        r.languages = await gh(`/repos/${r.fullName}/languages`);
      } catch (err) {
        console.warn(`  ! ${r.name}: ${err.message}`);
        r.languages = null;
      }
    }
  }

  // Handy derived views so projects.json doesn't have to recompute them.
  const byLanguage = {};
  for (const r of repos) {
    if (!r.language) continue;
    byLanguage[r.language] = (byLanguage[r.language] || 0) + 1;
  }

  const payload = {
    _syncedAt: new Date().toISOString(),
    _source: `https://api.github.com/users/${opts.user}/repos`,
    _note: "Generated by scripts/sync-github.mjs. Do not hand-edit — re-run the script.",
    user: opts.user,
    counts: {
      total: raw.length,
      included: repos.length,
      forks: forkCount,
      withHomepage: repos.filter((r) => r.homepage).length,
      totalStars: repos.reduce((n, r) => n + r.stars, 0),
    },
    byLanguage: Object.fromEntries(Object.entries(byLanguage).sort((a, b) => b[1] - a[1])),
    repos,
  };

  const outPath = resolve(ROOT, opts.out);
  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, JSON.stringify(payload, null, 2) + "\n", "utf8");

  console.log(`\n  ${repos.length} repos -> ${opts.out}`);
  console.log(`  ${payload.counts.totalStars} stars, ${payload.counts.withHomepage} with a live demo`);
  console.log(
    `  top languages: ${Object.entries(payload.byLanguage).slice(0, 5).map(([k, v]) => `${k} (${v})`).join(", ")}`
  );
}

main().catch((err) => {
  console.error(`\nsync-github failed: ${err.message}`);
  process.exit(1);
});
