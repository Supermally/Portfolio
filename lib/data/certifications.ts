export type Waypoint = {
  id: string;
  stationId: string;             // attaches to a station, not standalone
  label: string;
  issuer: string;
  date: string;
  badgeCode?: string;
  credentialUrl?: string;
};

export const WAYPOINTS: Waypoint[] = [
  {
    id: "waypoint-certiport-html-css",
    stationId: "station-windows-runner",
    label: "IT Specialist — HTML and CSS",
    issuer: "Certiport",
    date: "February 2024",
    badgeCode: "CERT-HTML-CSS",
    credentialUrl: "https://www.certiport.com",
  },
  {
    id: "waypoint-comptia-itf",
    stationId: "station-embedded-os",
    label: "CompTIA IT Fundamentals+ (ITF+)",
    issuer: "CompTIA",
    date: "2024",
    badgeCode: "COMPTIA-ITF+",
    credentialUrl: "https://www.comptia.org",
  },
];
