/**
 * All page copy in one place. Components read from here so the markup stays clean,
 * and this is the seam the real data layer (data/*.json) plugs into in phase 02.
 * Placeholder lorem for now, matching the approved prototype.
 */

export const brand = { left: "lorem", right: "ipsum" };

export const nav = [
  { label: "Work", href: "#work" },
  { label: "Path", href: "#path" },
  { label: "Contact", href: "#contact" },
];

export const hero = {
  specTop: ["Lorem ipsum engineer", "Dolor, Sit Amet", "Consectetur adipiscing"],
  // The headline is split into words so each can animate in; `em` italicises the accent word.
  headline: [
    { text: "Ut" },
    { text: "enim" },
    { text: "ad" },
    { text: "minim", em: true },
    { text: "veniam" },
    { text: "quis." },
  ] as { text: string; em?: boolean }[],
  lede: "Nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat, duis aute irure dolor in reprehenderit voluptate velit.",
  stats: [
    { label: "Lorem", value: "2+" },
    { label: "Ipsum dolor", value: "56" },
    { label: "Sit amet", value: "22" },
    { label: "Consectetur", value: "12" },
  ],
};

export const work = {
  index: "01",
  title: "Sed do eiusmod tempor",
  blurb: "Incididunt ut labore et dolore magna aliqua, ut enim ad minim veniam quis nostrud.",
  featured: {
    kicker: "Featured — lorem ipsum",
    name: "Ipsum Dolor Sit Amet",
    blurb:
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus.",
    ctaLabel: "Lorem ipsum",
    ctaHref: "#",
    spec: [
      { label: "Stack", value: "Lorem · Ipsum · Dolor" },
      { label: "Type", value: "Sit amet consectetur" },
      { label: "Year", value: "2026" },
      { label: "Status", value: "Adipiscing elit" },
    ],
  },
  ledger: [
    { n: "02", name: "Amet Consectetur", desc: "Perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque.", spec: ["Lorem", "Ipsum", "2026"] },
    { n: "03", name: "Adipiscing Elit", desc: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.", spec: ["Dolor", "Sit", "2026"] },
    { n: "04", name: "Eiusmod Tempor", desc: "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet consectetur.", spec: ["Amet", "Elit", "2025"] },
    { n: "05", name: "Incididunt Labore", desc: "Ut enim ad minima veniam quis nostrum exercitationem ullam corporis suscipit.", spec: ["Tempor", "Labore", "2025"] },
  ],
};

export const path = {
  index: "02",
  title: "Ut labore et dolore",
  blurb: "Magna aliqua, ut enim ad minim veniam — quis nostrud exercitation ullamco.",
  log: [
    { when: "2025-06 → now", kind: "deploy", title: "Lorem Ipsum Dolor @ Sit Amet", detail: "Consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
    { when: "2024-07 → 2025-06", kind: "build", title: "Consectetur Adipiscing @ Sit Amet", detail: "Veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo." },
    { when: "2022-07 → 2023-08", kind: "init", title: "Elit Sed Do @ Eiusmod", detail: "Reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur." },
    { when: "2021 → 2025", kind: "learn", title: "B.Tech Lorem Ipsum", detail: "Excepteur sint occaecat cupidatat non proident." },
  ],
};

export const contact = {
  // The headline splits around the accent word so it can be italicised in forge.
  lead: { before: "Duis aute ", em: "irure", after: " dolor in reprehenderit." },
  email: "lorem@ipsum.dev",
  emailHref: "#",
  availability: "Available — voluptate velit",
};

export const footer = ["© Lorem Ipsum 2026", "Prototype · placeholder copy", "Built with intent"];
