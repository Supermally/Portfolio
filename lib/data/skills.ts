export type Line = {
  id: string;                  // "ee-line", "aero-line", "polisci-line"
  label: string;
  shortLabel: string;
  bullet: string;              // "EE", "AER", "POL"
  color: string;               // Bold MTA hex color
  description?: string;
  underConstruction?: boolean;
  interlinesWith?: string[];
  pathD?: string;
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
    interlinesWith: ["aero-line", "polisci-line"],
    pathD: "M 490 100 L 490 540 L 270 540 L 270 1340 L 490 1340 L 490 1420 L 490 1720 L 270 1720 L 270 2520 L 100 2520 L 100 3360 L 1000 3360",
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
    interlinesWith: ["ee-line"],
    pathD: "M 500 100 L 500 620 L 730 620 L 730 1340 L 500 1340 L 500 1420 L 500 1660 L 730 1660 L 730 2560 L 110 2560 L 110 3350 L 1000 3350",
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
    interlinesWith: ["ee-line"],
    pathD: "M 510 100 L 510 460 L 260 460 L 260 2600 L 120 2600 L 120 3340 L 1000 3340",
    stations: [
      "station-grand-central",
      "station-ideology-test",
      "station-election-sim",
    ],
  },
];
