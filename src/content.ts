/**
 * The view model: it turns the facts in /data (via src/data.ts) into the exact
 * shapes the components render, and holds the presentation-only copy (the headline,
 * section labels, footer). Components read from here and never touch the raw data.
 */
import { profile, experience, education, projects } from "./data";

const monthNames = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2025-06" → "Jun 2025"; a null end → "now". */
function label(ym: string | null): string {
  if (!ym) return "now";
  const [year, month] = ym.split("-");
  return month ? `${monthNames[+month]} ${year}` : year;
}

// ── brand + nav (presentation) ──
export const brand = { left: "jebershon", right: "vs" };

export const nav = [
  { label: "Work", href: "#work" },
  { label: "Path", href: "#path" },
  { label: "Contact", href: "#contact" },
];

// ── hero ──
export const hero = {
  specTop: [profile.headline, "Mendix · Full-Stack · Mobile", profile.location],
  // Presentation copy; `em` italicises the forge accent word.
  headline: [
    { text: "I" },
    { text: "build" },
    { text: "the" },
    { text: "tools", em: true },
    { text: "developers" },
    { text: "use." },
  ] as { text: string; em?: boolean }[],
  lede: profile.summary,
  stats: profile.stats,
};

// ── work: the lead project is featured, the rest form the ledger ──
const [lead, ...rest] = projects.featured;

export const work = {
  index: "01",
  title: "Selected work",
  blurb: "Developer tooling first — the tools other engineers use — plus the enterprise apps behind them.",
  featured: {
    kicker: "Featured — developer tooling",
    name: lead.name,
    blurb: lead.oneLiner,
    ctaLabel: lead.links.demo ? "View live" : "View on GitHub",
    ctaHref: lead.links.demo ?? lead.links.repo ?? "#",
    spec: [
      { label: "Stack", value: lead.stack.join(" · ") },
      { label: "Type", value: lead.type },
      { label: "Year", value: String(lead.year) },
      { label: "Status", value: lead.status },
    ],
  },
  ledger: rest.map((p, i) => ({
    n: String(i + 2).padStart(2, "0"),
    name: p.name,
    desc: p.oneLiner,
    spec: [p.stack[0], p.type, String(p.year)],
  })),
};

// ── path: experience then education, as a build log ──
export const path = {
  index: "02",
  title: "The path",
  blurb: "Two years of shipping, from a first internship to building developer tooling in production.",
  log: [
    ...experience.roles.map((r) => ({
      when: `${label(r.start)} → ${label(r.end)}`,
      kind: r.kind,
      title: `${r.title} @ ${r.company}`,
      detail: r.summary,
    })),
    ...education.degrees.map((d) => ({
      when: `${d.start.slice(0, 4)} → ${d.end.slice(0, 4)}`,
      kind: d.kind,
      title: `${d.degree} @ ${d.school}`,
      detail: `${education.certificationCount} certifications, incl. 2× Mendix Certified Developer.`,
    })),
  ],
};

// ── contact ──
export const contact = {
  lead: { before: "Let's ", em: "build", after: " something." },
  email: profile.email,
  emailHref: `mailto:${profile.email}`,
  availability: `${profile.location} — open to interesting problems`,
};

// ── footer ──
export const footer = [`© ${profile.name} 2026`, "Built with React + Three.js", profile.location];
