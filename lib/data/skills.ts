export type Line = {
  id: string;                  // "ee-line", "aero-line", "polisci-line"
  label: string;
  shortLabel: string;
  bullet: string;              // "EE", "AER", "POL"
  color: string;               // Bold MTA hex color
  description?: string;
  underConstruction?: boolean;
  stations: string[];          // ordered station ids along this line (top-to-bottom)
};

export const LINES: Line[] = [
  {
    id: "ee-line",
    label: "Computers & Electronics",
    shortLabel: "Computer Systems Line",
    bullet: "EE",
    color: "#ff6319", // MTA Orange
    description: "Compatibility bridges, microchips, circuit boards, and real-time hardware systems.",
    stations: [
      "station-grand-central",
      "station-windows-runner",
      "station-embedded-os",
      "station-fpga-dsp",
    ],
  },
  {
    id: "aero-line",
    label: "Aerospace & Flight",
    shortLabel: "Aerospace Dynamics (Coming Soon)",
    bullet: "AER",
    color: "#0039a6", // MTA Blue
    underConstruction: true,
    description: "Aerodynamics, propulsion cycles, and flight physics. (Line extension currently under construction • Coming Soon).",
    stations: [
      "station-grand-central",
      "station-flight-research",
    ],
  },
  {
    id: "polisci-line",
    label: "Political Science & Policy",
    shortLabel: "Political Modeling Line",
    bullet: "POL",
    color: "#ee352e", // MTA Red
    description: "Political compass scoring models, electoral simulation architectures, and technology policy research.",
    stations: [
      "station-grand-central",
      "station-ideology-test",
      "station-election-sim",
    ],
  },
];
