import { STATIONS, Station } from "@/lib/data/projects";
import { LINES, Line } from "@/lib/data/skills";
import { WAYPOINTS, Waypoint } from "@/lib/data/certifications";

export interface MapPoint {
  x: number;
  y: number;
}

export interface RenderStation extends Station {
  pixelX: number;
  pixelY: number;
  isInterchange: boolean;
  waypoints: Waypoint[];
}

export interface RenderLine extends Line {
  points: MapPoint[];
}

export interface BackgroundTerritory {
  label: string;
  x: number;
  y: number;
}

/**
 * Calculates canvas-space pixel coordinates from normalized (0-100) coordinates,
 * with responsive padding and aspect scaling.
 */
export function calculateMapCoordinates(
  width: number,
  height: number
): {
  stations: RenderStation[];
  lines: RenderLine[];
  territories: BackgroundTerritory[];
} {
  const paddingX = Math.max(width * 0.1, 50);
  const paddingY = Math.max(height * 0.12, 50);
  const usableWidth = width - paddingX * 2;
  const usableHeight = height - paddingY * 2;

  // Background "Borough / Territory" watermark labels sitting low-contrast behind lines
  const territories: BackgroundTerritory[] = [
    { label: "EMBEDDED SYSTEMS & SILICON", x: width * 0.2, y: height * 0.2 },
    { label: "FLIGHT DYNAMICS & ORBIT", x: width * 0.72, y: height * 0.18 },
    { label: "SYSTEMS POLICY & COMPLIANCE", x: width * 0.5, y: height * 0.82 },
  ];

  // Map stations to pixel positions
  const renderStations: RenderStation[] = STATIONS.map((station) => {
    const pixelX = paddingX + (station.coords.x / 100) * usableWidth;
    const pixelY = paddingY + (station.coords.y / 100) * usableHeight;
    const stationWaypoints = WAYPOINTS.filter((w) => w.stationId === station.id);

    return {
      ...station,
      pixelX,
      pixelY,
      isInterchange: station.lines.length > 1,
      waypoints: stationWaypoints,
    };
  });

  const stationMap = new Map<string, RenderStation>();
  renderStations.forEach((s) => stationMap.set(s.id, s));

  // Map lines with transit schematic routing (octolinear 45°/90° path routing)
  const renderLines: RenderLine[] = LINES.map((line) => {
    const points: MapPoint[] = [];

    for (let i = 0; i < line.stations.length; i++) {
      const station = stationMap.get(line.stations[i]);
      if (!station) continue;

      if (points.length === 0) {
        points.push({ x: station.pixelX, y: station.pixelY });
      } else {
        const prev = points[points.length - 1];
        const targetX = station.pixelX;
        const targetY = station.pixelY;

        const dx = targetX - prev.x;
        const dy = targetY - prev.y;

        if (Math.abs(dx) > 0 && Math.abs(dy) > 0) {
          // Classic 45/90 degree dog-leg transit bend
          const midX = prev.x + dx * 0.5;
          points.push({ x: midX, y: prev.y });
          points.push({ x: midX, y: targetY });
        }
        points.push({ x: targetX, y: targetY });
      }
    }

    return {
      ...line,
      points,
    };
  });

  return { stations: renderStations, lines: renderLines, territories };
}
