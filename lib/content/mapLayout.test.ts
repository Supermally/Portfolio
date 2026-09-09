import assert from "node:assert/strict";
import { pathThroughStations, stationToSvg, svgToStation } from "./mapLayout.ts";

const svg = stationToSvg({ x: 50, y: 10 });
assert.equal(svg.x, 500);
assert.equal(svg.y, 260);

const roundTrip = svgToStation(svg);
assert.equal(roundTrip.x, 50);
assert.equal(roundTrip.y, 10);

const path = pathThroughStations([{ x: 50, y: 10 }, { x: 27, y: 30 }]);
assert.match(path, /^M /);
assert.ok(path.includes("L "));
assert.doesNotMatch(path, /NaN/);

console.log("mapLayout tests passed");
