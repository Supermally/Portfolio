export const MAP_VIEW_WIDTH = 1000;
export const MAP_VIEW_HEIGHT = 3500;
const X_SCALE = 10;
const Y_SCALE = 26;

export function stationToSvg(coords: { x: number; y: number }) {
  return { x: coords.x * X_SCALE, y: coords.y * Y_SCALE };
}

export function svgToStation(point: { x: number; y: number }) {
  return {
    x: Math.max(0, Math.min(100, Math.round((point.x / X_SCALE) * 2) / 2)),
    y: Math.max(0, Math.min(100, Math.round((point.y / Y_SCALE) * 2) / 2)),
  };
}

export function clientPointToSvg(svg: SVGSVGElement, clientX: number, clientY: number) {
  const point = svg.createSVGPoint();
  point.x = clientX;
  point.y = clientY;
  const matrix = svg.getScreenCTM();
  if (!matrix) return { x: 0, y: 0 };
  const mapped = point.matrixTransform(matrix.inverse());
  return { x: mapped.x, y: mapped.y };
}

/** Orthogonal subway-style path through stop coordinates (0–100 map space). */
export function pathThroughStations(coords: { x: number; y: number }[]) {
  if (coords.length === 0) return "";
  const points = coords.map((item) => {
    const svg = stationToSvg(item);
    return { x: Math.round(svg.x), y: Math.round(svg.y) };
  });
  const first = points[0];
  const last = points[points.length - 1];
  const start = { x: first.x, y: Math.max(80, first.y - 80) };
  const end = { x: last.x, y: Math.min(MAP_VIEW_HEIGHT - 80, last.y + 80) };
  const route = [start, ...points, end];
  let path = `M ${route[0].x} ${route[0].y}`;
  for (let index = 1; index < route.length; index += 1) {
    const previous = route[index - 1];
    const current = route[index];
    if (previous.x !== current.x) path += ` L ${current.x} ${previous.y}`;
    if (previous.y !== current.y) path += ` L ${current.x} ${current.y}`;
  }
  return path;
}
