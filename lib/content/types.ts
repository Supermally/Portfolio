import type { Station } from "@/lib/data/projects";
import type { Line } from "@/lib/data/skills";
import type { Waypoint } from "@/lib/data/certifications";

export type ResumeExperience = {
  period: string;
  role: string;
  organization: string;
  location: string;
  type: string;
  points: string[];
};

export type ResumeEducation = {
  school: string;
  program: string;
  location: string;
  graduation: string;
};

export type ResumeCertification = {
  title: string;
  issuer: string;
  date: string;
  badge: string;
};

export type SkillCategory = { category: string; skills: string[] };
export type Language = { name: string; proficiency: string };

export type ResumeContent = {
  name: string;
  location: string;
  status: string;
  summary: string;
  pdfUrl: string;
  experiences: ResumeExperience[];
  education: ResumeEducation;
  certifications: ResumeCertification[];
  skillCategories: SkillCategory[];
  languages: Language[];
};

export type ContactPlatform = {
  id: string;
  label: string;
  channel: "GitHub" | "LinkedIn" | "Website";
  handle: string;
  link: string;
  desc: string;
  color: string;
};

export type ContactContent = {
  email: string;
  intro: string;
  availability: string;
  responseWindow: string;
  platforms: ContactPlatform[];
};

export type FeaturedDisplays = {
  activeProjectId: string;
  activeLabel: string;
  activeFocus: string;
  diagnosticsProjectId: string;
  diagnosticsAlert: string;
  diagnosticsSummary: string;
};

export type SiteContent = {
  version: 1;
  updatedAt: string;
  stations: Station[];
  lines: Line[];
  waypoints: Waypoint[];
  featured: FeaturedDisplays;
  resume: ResumeContent;
  contact: ContactContent;
};
