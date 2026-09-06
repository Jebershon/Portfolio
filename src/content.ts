/**
 * The view model: it turns the facts in /data (via src/data.ts) into the exact
 * shapes the components render, and holds the presentation-only copy (the headline,
 * section labels, footer). Components read from here and never touch the raw data.
 */
import { profile, experience, education, skills, projects } from "./data";

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
  { label: "Stack", href: "#stack" },
  { label: "Path", href: "#path" },
  { label: "Credentials", href: "#creds" },
  { label: "Contact", href: "#contact" },
];

// ── hero ──
export const hero = {
  specTop: [profile.headline, "Mendix · Full-Stack · Mobile", profile.location],
  // Presentation copy; `em` italicises the forge accent word.
  headline: [
    { text: "I" },
    { text: "build" },
    { text: "enterprise", em: true },
    { text: "apps" },
    { text: "end" },
    { text: "to" },
    { text: "end." },
  ] as { text: string; em?: boolean }[],
  lede: profile.summary,
  stats: profile.stats,
};

// ── work: client/enterprise projects; the featured one leads, the rest form the ledger ──
const featured = projects.clients.find((c) => c.featured) ?? projects.clients[0];
const rest = projects.clients.filter((c) => c !== featured);

export const work = {
  index: "01",
  title: "Selected work",
  blurb: "Enterprise apps shipped end to end at RapidData — HR platforms, legal systems and government workflows on Mendix, React, Java and Node.",
  featured: {
    kicker: "Featured — enterprise HRMS",
    name: featured.name,
    blurb: featured.oneLiner,
    ctaLabel: "",
    ctaHref: "", // client work is proprietary, so no public link
    spec: [
      { label: "Client", value: featured.client },
      { label: "Stack", value: featured.stack.join(" · ") },
      { label: "Type", value: featured.type },
      { label: "Role", value: featured.role },
    ],
  },
  ledger: rest.map((c, i) => ({
    n: String(i + 2).padStart(2, "0"),
    name: c.name,
    desc: c.oneLiner,
    spec: [c.client, c.type],
  })),
};

// ── stack: grouped skills, Mendix core outward ──
export const stack = {
  index: "02",
  title: "The stack",
  blurb: "A Mendix core, with the React, Java, Node, cloud and DevOps around it — the toolkit I build enterprise apps with.",
  groups: skills.groups.map((g) => ({ name: g.name, items: g.items.join(" · ") })),
};

// ── tools: secondary open-source work, each row linking to its GitHub repo ──
export const tools = {
  index: "03",
  title: "Tools & open source",
  blurb: "Open-source projects I build on the side — Mendix tooling and CLIs, an MCP server, a bug-report extension, and a couple of experiments beyond client work.",
  items: projects.tools.map((t, i) => ({
    n: String(i + 1).padStart(2, "0"),
    name: t.name,
    desc: t.oneLiner,
    link: t.links.repo ?? t.links.demo ?? "#",
    linkLabel: "GitHub",
  })),
};

// ── path: experience then education, as a build log ──
export const path = {
  index: "04",
  title: "The path",
  blurb: "From a B.Tech in IT and an IEEE-published IoT project to shipping enterprise Mendix apps and the tooling around them.",
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
      detail: "Final-year IoT project (ECO-Bot) peer-reviewed and published in IEEE Xplore.",
    })),
  ],
};

// ── credentials: achievements above every certification ──
export const credentials = {
  index: "05",
  title: "Credentials",
  blurb: "IEEE-published in IoT, with 22 certifications spanning Mendix, Apigee and Google Cloud, and a B.Tech in Information Technology.",
  awards: [
    { label: "IEEE", text: `${projects.publication.title} — ${projects.publication.venue}, Mar 2026.`, href: projects.publication.url },
    { label: "Mendix", text: "Mendix Intermediate Developer (2026) and Mendix Rapid Developer (2024)." },
    { label: "Google Cloud", text: "Apigee API Platform certification (2026)." },
    { label: "Shipped", text: "12 production Mendix pluggable widgets, plus enterprise apps live on the App Store and Play Store." },
  ] as { label: string; text: string; href?: string }[],
  certs: education.certifications.map((c) => ({ name: c.name, issuer: c.issuer })),
  certTotal: education.certificationCount,
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
