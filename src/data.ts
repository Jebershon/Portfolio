/**
 * Typed access to the canonical data in /data. Each JSON is cast to an interface,
 * so if a hand-edit drops a required field the build fails here rather than showing
 * a blank section. Presentation lives in content.ts; this file is facts only.
 */
import profileJson from "@data/profile.json";
import experienceJson from "@data/experience.json";
import educationJson from "@data/education.json";
import skillsJson from "@data/skills.json";
import projectsJson from "@data/projects.json";
import metaJson from "@data/meta.json";

export interface Profile {
  name: string;
  shortName: string;
  initials: string;
  role: string;
  headline: string;
  location: string;
  email: string;
  socials: { github: string; linkedin: string; portfolio: string };
  summary: string;
  stats: { label: string; value: string }[];
}

export interface Role {
  kind: string;
  company: string;
  title: string;
  location: string;
  start: string;
  end: string | null;
  summary: string;
}

export interface Degree {
  kind: string;
  school: string;
  degree: string;
  location: string;
  start: string;
  end: string;
}

// Enterprise work delivered for a client. No public links (proprietary).
export interface ClientProject {
  slug: string;
  name: string;
  client: string;
  featured?: boolean;
  oneLiner: string;
  stack: string[];
  type: string;
  role: string;
}

// Open-source side project, linked to its GitHub repo.
export interface Tool {
  slug: string;
  name: string;
  oneLiner: string;
  stack: string[];
  type: string;
  links: { demo?: string; repo?: string; paper?: string };
}

export const profile = profileJson as Profile;
export const experience = experienceJson as { roles: Role[] };
export const education = educationJson as {
  degrees: Degree[];
  certificationCount: number;
  certifications: { name: string; issuer: string; year: number }[];
};
export const skills = skillsJson as { groups: { name: string; items: string[] }[]; top: string[] };
export const projects = projectsJson as {
  clients: ClientProject[];
  tools: Tool[];
  collection: { name: string; oneLiner: string; count: number; examples: string[] };
  publication: { title: string; venue: string; date: string; url: string };
};
export const meta = metaJson as {
  title: string;
  description: string;
  url: string;
  themeColor: string;
  resume: string;
  lastSynced: string;
};
