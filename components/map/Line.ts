import * as PIXI from "pixi.js";
import { RenderLine } from "./mapData";

export class MapLineView {
  public data: RenderLine;
  public container: PIXI.Container;
  private graphics: PIXI.Graphics;
  private casingGraphics: PIXI.Graphics;

  constructor(line: RenderLine) {
    this.data = line;
    this.container = new PIXI.Container();
    this.casingGraphics = new PIXI.Graphics();
    this.graphics = new PIXI.Graphics();

    this.container.addChild(this.casingGraphics);
    this.container.addChild(this.graphics);
  }

  public render(progress: number = 1, isHighlighted: boolean = false, isDimmed: boolean = false) {
    this.graphics.clear();
    this.casingGraphics.clear();

    const points = this.data.points;
    if (!points || points.length < 2) return;

    // Convert hex color
    const colorHex = parseInt(this.data.color.replace("#", ""), 16);
    const alpha = isDimmed ? 0.22 : 1.0;
    const strokeWidth = isHighlighted ? 12 : 9;

    const totalSegments = points.length - 1;
    const activeSegments = Math.min(Math.floor(progress * totalSegments), totalSegments);
    const segmentFraction = progress * totalSegments - activeSegments;

    // Outer subtle casing for crisp transit line separation
    this.casingGraphics.lineStyle(strokeWidth + 4, 0xfaf8f5, alpha * 0.95);
    this.casingGraphics.moveTo(points[0].x, points[0].y);
    for (let i = 1; i <= activeSegments; i++) {
      this.casingGraphics.lineTo(points[i].x, points[i].y);
    }
    if (segmentFraction > 0 && activeSegments < totalSegments) {
      const p1 = points[activeSegments];
      const p2 = points[activeSegments + 1];
      const curX = p1.x + (p2.x - p1.x) * segmentFraction;
      const curY = p1.y + (p2.y - p1.y) * segmentFraction;
      this.casingGraphics.lineTo(curX, curY);
    }

    // Bold solid transit stroke
    this.graphics.lineStyle(strokeWidth, colorHex, alpha);
    this.graphics.moveTo(points[0].x, points[0].y);
    for (let i = 1; i <= activeSegments; i++) {
      this.graphics.lineTo(points[i].x, points[i].y);
    }
    if (segmentFraction > 0 && activeSegments < totalSegments) {
      const p1 = points[activeSegments];
      const p2 = points[activeSegments + 1];
      const curX = p1.x + (p2.x - p1.x) * segmentFraction;
      const curY = p1.y + (p2.y - p1.y) * segmentFraction;
      this.graphics.lineTo(curX, curY);
    }
  }

  public destroy() {
    this.container.destroy({ children: true });
  }
}
