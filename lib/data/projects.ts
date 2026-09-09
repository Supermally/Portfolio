export type Station = {
  id: string;
  title: string;
  lines: string[];              // which line(s) pass through — interchange if >1
  coords: { x: number; y: number };   // map-space normalized position (0 to 100)
  letterZone?: string;         // M, A, L, A, C, H, I
  summary: string;
  date: string;
  tags: string[];
  links: { repo?: string; demo?: string; writeup?: string };
  status: "complete" | "in-progress" | "archived";
  image?: string;
  specs?: Record<string, string>;
  inDevelopment?: boolean;
};

export const STATIONS: Station[] = [
  {
    id: "station-grand-central",
    title: "Grand Central Hub",
    lines: ["ee-line", "aero-line", "polisci-line"],
    coords: { x: 50, y: 10 },
    letterZone: "M",
    summary: "The central meeting point where computer systems, aerospace concepts, and political science modeling converge.",
    date: "SYSTEM ORIGIN",
    tags: ["Systems Overview", "Main Interchange", "Core Portfolio"],
    links: {},
    status: "complete",
    specs: {
      "Hub Type": "Main 3-Line Interchange",
      "Disciplines": "Computer Systems, Aerospace & Policy",
      "Format": "Interactive Transit Map",
    },
  },
  {
    id: "station-windows-runner",
    title: "Porta — Windows App Compatibility Runner",
    lines: ["ee-line"],
    coords: { x: 25, y: 25 },
    letterZone: "A",
    summary: "First stop on the Computer Systems line: A compatibility bridge tool designed to run Windows applications seamlessly on macOS and Linux. Actively in development with current focus on resolving graphics translation pipeline issues and memory bridging.",
    date: "ACTIVE WORK",
    tags: ["Porta", "Wine", "C++", "System Bridge", "Graphics Drivers"],
    links: {
      repo: "https://github.com/Supermally/Porta",
    },
    status: "in-progress",
    specs: {
      "Current Status": "Active Work in Progress",
      "Repository": "github.com/Supermally/Porta",
      "Known Issue": "Graphics driver translation pipeline",
      "Next Milestone": "Memory bridge & UI windowing fixes",
    },
  },
  {
    id: "station-flight-research",
    title: "Aerospace Project Idea #1",
    lines: ["aero-line"],
    coords: { x: 75, y: 38 },
    letterZone: "L",
    summary: "Aerospace extension under construction: A planned project exploring aerodynamics, propulsion cycles, and atmospheric flight modeling tools.",
    date: "UNDER CONSTRUCTION",
    tags: ["Aerospace Concept", "Propulsion", "Flight Physics", "Under Construction"],
    links: {},
    status: "in-progress",
    inDevelopment: true,
    specs: {
      "Status": "Extension Under Construction",
      "Focus Area": "Aerodynamics & Propulsion Modeling",
      "Line": "Aerospace Dynamics (Coming Soon)",
    },
  },
  {
    id: "station-embedded-os",
    title: "Engineering Project Idea #1",
    lines: ["ee-line"],
    coords: { x: 50, y: 50 },
    letterZone: "A",
    summary: "Planned engineering station under construction: A project idea exploring deterministic embedded hardware and fault-tolerant sensor control.",
    date: "UNDER CONSTRUCTION",
    tags: ["Embedded Hardware", "C++", "Sensors", "Under Construction"],
    links: {},
    status: "in-progress",
    inDevelopment: true,
    specs: {
      "Status": "Station Under Construction",
      "Discipline": "Computer Systems & Hardware",
      "Stage": "Concept & Component Planning",
    },
  },
  {
    id: "station-ideology-test",
    title: "Ideology Test & Political Compass",
    lines: ["polisci-line"],
    coords: { x: 25, y: 63 },
    letterZone: "C",
    summary: "First stop on the Political Science line: An interactive political survey and scoring model designed to map voter policy beliefs across multi-dimensional economic and social spectrums without leading or biased questions.",
    date: "PRE-BUILD",
    tags: ["Political Science", "Survey Design", "Data Scoring", "Policy Analysis"],
    links: {},
    status: "in-progress",
    inDevelopment: true,
    specs: {
      "Stage": "Survey Architecture & Scoring Model",
      "Dimensions": "Multi-axis Social & Economic Spectrum",
      "Methodology": "Unbiased Question Framing",
    },
  },
  {
    id: "station-election-sim",
    title: "Policy Project Idea #1",
    lines: ["polisci-line"],
    coords: { x: 75, y: 75 },
    letterZone: "H",
    summary: "Political science station under construction: A planned simulation concept testing how shifting demographics and district boundaries alter electoral outcomes.",
    date: "UNDER CONSTRUCTION",
    tags: ["Electoral Systems", "Simulation", "Demographics", "Under Construction"],
    links: {},
    status: "in-progress",
    inDevelopment: true,
    specs: {
      "Status": "Station Under Construction",
      "Scope": "Comparative Electoral Systems",
      "Stage": "Model Architecture",
    },
  },
  {
    id: "station-fpga-dsp",
    title: "Engineering Project Idea #2",
    lines: ["ee-line"],
    coords: { x: 50, y: 88 },
    letterZone: "I",
    summary: "Hardware engineering station under construction: A planned digital architecture exploring real-time high-speed signal processing.",
    date: "UNDER CONSTRUCTION",
    tags: ["Custom Silicon", "Signal Processing", "Hardware", "Under Construction"],
    links: {},
    status: "in-progress",
    inDevelopment: true,
    specs: {
      "Status": "Station Under Construction",
      "Discipline": "Computer Systems & Digital Logic",
      "Stage": "Pipeline Architecture",
    },
  },
];
