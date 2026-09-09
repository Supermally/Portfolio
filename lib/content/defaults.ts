import { STATIONS } from "@/lib/data/projects";
import { LINES } from "@/lib/data/skills";
import { WAYPOINTS } from "@/lib/data/certifications";
import type { SiteContent } from "./types";

export const DEFAULT_CONTENT: SiteContent = {
  version: 1,
  updatedAt: "2026-09-09T00:00:00.000Z",
  stations: STATIONS,
  lines: LINES,
  waypoints: WAYPOINTS,
  featured: {
    activeProjectId: "station-windows-runner",
    activeLabel: "ACTIVE WORK IN PROGRESS",
    activeFocus: "Fixing graphics driver translation",
    diagnosticsProjectId: "station-windows-runner",
    diagnosticsAlert: "Investigating Windows compatibility driver translation and memory bridges",
    diagnosticsSummary: "Bridging Windows API calls to POSIX with custom memory mapping"
  },
  resume: {
    name: "Malachi McDonald",
    location: "Brooklyn, NY",
    status: "ACTIVE CANDIDATE",
    summary: "Site Monitor with experience managing participant records, worksite compliance, and payroll processing for NYC DYCD-administered youth workforce programs. Skilled in Microsoft 365, Excel, and ADP Payroll, with a background in computer engineering, programming, and cloud-based data analysis.",
    pdfUrl: "/assets/Malachi_McDonald_Resume.pdf",
    experiences: [
      { period: "APRIL 2026 — PRESENT", role: "SYEP Site Monitor", organization: "Good Shepherd Services", location: "Bronx, NY", type: "WORKFORCE OPERATIONS & COMPLIANCE", points: ["Manage participant, worksite, and program records and conduct regular worksite visits to monitor operations and address concerns.", "Process weekly participant payroll and maintain accurate attendance, payroll, and program documentation.", "Coordinate with worksites, program staff, and partners while assisting with youth events and activities.", "Use Microsoft 365, ADP Payroll, and NYC DYCD systems for program administration and data management."] },
      { period: "DEC 2025 — APRIL 2026", role: "Work, Learn & Grow (WLG) Site Monitor", organization: "Good Shepherd Services", location: "Bronx, NY", type: "PROGRAM MANAGEMENT & PAYROLL", points: ["Supported day-to-day operations across WLG, SYEP, and school-based internship worksites.", "Processed weekly ADP payroll for program staff and high school student interns.", "Posted employment and internship opportunities and conducted outreach to prospective worksites and organizational partners.", "Conducted worksite visits, maintained records, and supported program events and activities using Microsoft 365, ADP, and DYCD."] },
      { period: "DEC 2024 — AUGUST 2025", role: "SYEP Site Monitor Intern", organization: "Good Shepherd Services", location: "Bronx, NY", type: "ADMINISTRATIVE OPERATIONS", points: ["Provided administrative support through records management, document organization, office coordination, and participant communications.", "Assisted with weekly program payroll and maintained related documentation.", "Supported event coordination and daily program operations using Microsoft 365."] },
      { period: "JULY 2024 — AUGUST 2024", role: "Research Intern, DREAM-High Program", organization: "Columbia University", location: "New York, NY", type: "DATA ANALYSIS & CLOUD COMPUTING", points: ["Analyzed and visualized genomic, clinical, and physical data from breast cancer cells using R/RStudio in a cloud computing environment.", "Applied programming, statistical analysis, and data visualization techniques to explore biological datasets."] },
      { period: "OCT 2024 — DEC 2024", role: "Farm Worker Intern", organization: "Teens for Food Justice", location: "Bronx, NY", type: "HYDROPONICS & PROCESS OPTIMIZATION", points: ["Performed seeding, transplanting, harvesting, cleaning, crop-yield logging, and plant-health monitoring.", "Developed recipes using harvested ingredients while minimizing waste and collaborated with team members to improve workflow."] },
      { period: "JULY 2024 — AUGUST 2024", role: "Retail Associate", organization: "Five Below", location: "New York, NY", type: "OPERATIONS & CUSTOMER SERVICE", points: ["Provided customer service while receiving, organizing, stocking, and maintaining merchandise and sales-floor operations.", "Demonstrated communication, problem-solving, and multitasking skills in a fast-paced environment."] }
    ],
    education: { school: "DeWitt Clinton High School", program: "Computer & Information Sciences and Support Services", location: "Bronx, NY", graduation: "2025" },
    certifications: [
      { title: "IT Specialist — HTML and CSS", issuer: "Certiport", date: "February 2024", badge: "CERTIPORT" },
      { title: "CompTIA IT Fundamentals+ (ITF+)", issuer: "CompTIA", date: "2024", badge: "COMPTIA" }
    ],
    skillCategories: [
      { category: "Programming & Web", skills: ["Python", "C++", "R", "SQL", "MySQL", "HTML5", "CSS", "JavaScript", "DHTML"] },
      { category: "Software & Tools", skills: ["Microsoft 365", "Excel", "ADP Payroll", "RStudio", "Git", "GitHub", "AutoCAD", "NYC DYCD"] },
      { category: "Engineering & Analysis", skills: ["Data Analysis", "Computer Engineering", "Web Design", "Statistical Modeling", "Worksite Compliance"] }
    ],
    languages: [{ name: "English", proficiency: "Native" }, { name: "German", proficiency: "Limited working proficiency" }]
  },
  contact: {
    email: "malachimcd1@gmail.com",
    intro: "Open for engineering roles, technical advisory on hardware/aerospace programs, and systems architecture inquiries.",
    availability: "Available for select engineering collaborations, research opportunities, and technical consulting engagements.",
    responseWindow: "24–48 HRS",
    platforms: [
      { id: "platform-github", label: "PLATFORM A // CODE REPOSITORIES", channel: "GitHub", handle: "@Supermally", link: "https://github.com/Supermally", desc: "Hardware HDL, firmware kernels, and simulation sources.", color: "#ff6319" },
      { id: "platform-linkedin", label: "PLATFORM B // PROFESSIONAL NETWORK", channel: "LinkedIn", handle: "in/malachi-mcdonald-546ba4209", link: "https://www.linkedin.com/in/malachi-mcdonald-546ba4209/", desc: "Engineering career history and research affiliations.", color: "#0039a6" }
    ]
  }
};
