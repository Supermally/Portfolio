import * as PIXI from "pixi.js";
import { RenderStation } from "./mapData";
import { LINES } from "@/lib/data/skills";

export class MapStationView {
  public data: RenderStation;
  public container: PIXI.Container;
  private nodeGraphics: PIXI.Graphics;
  private labelText: PIXI.Text;
  private subLabelText: PIXI.Text;

  private onHoverCb?: (station: RenderStation, isHovered: boolean, screenX: number, screenY: number) => void;
  private onClickCb?: (station: RenderStation) => void;

  constructor(
    station: RenderStation,
    onHover?: (station: RenderStation, isHovered: boolean, screenX: number, screenY: number) => void,
    onClick?: (station: RenderStation) => void
  ) {
    this.data = station;
    this.onHoverCb = onHover;
    this.onClickCb = onClick;

    this.container = new PIXI.Container();
    this.container.eventMode = "static";
    this.container.cursor = "pointer";

    this.nodeGraphics = new PIXI.Graphics();
    this.container.addChild(this.nodeGraphics);

    // Station title label in bold, high-contrast sans-serif
    this.labelText = new PIXI.Text(station.title, {
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Helvetica Neue, Arial, sans-serif",
      fontSize: 12,
      fontWeight: "700",
      fill: 0x18181b,
      align: "left",
    });

    // Station date / route sublabel
    this.subLabelText = new PIXI.Text(station.date, {
      fontFamily: "Inter, Arial, sans-serif",
      fontSize: 10,
      fontWeight: "500",
      fill: 0x71717a,
    });

    this.container.addChild(this.labelText);
    this.container.addChild(this.subLabelText);

    this.setupInteractivity();
    this.render();
  }

  private setupInteractivity() {
    this.container.on("pointerover", (e: any) => {
      const globalPos = e.global || { x: this.data.pixelX, y: this.data.pixelY };
      if (this.onHoverCb) {
        this.onHoverCb(this.data, true, globalPos.x, globalPos.y);
      }
    });

    this.container.on("pointerout", () => {
      if (this.onHoverCb) {
        this.onHoverCb(this.data, false, 0, 0);
      }
    });

    this.container.on("pointerdown", () => {
      if (this.onClickCb) {
        this.onClickCb(this.data);
      }
    });
  }

  public render(isHighlighted: boolean = false, isDimmed: boolean = false, pulsePhase: number = 0) {
    this.nodeGraphics.clear();

    const { pixelX, pixelY, isInterchange, status, waypoints, lines } = this.data;
    const alpha = isDimmed ? 0.25 : 1.0;
    this.container.alpha = alpha;

    const primaryLine = LINES.find((l) => lines.includes(l.id));
    const primaryColorHex = primaryLine
      ? parseInt(primaryLine.color.replace("#", ""), 16)
      : 0x18181b;

    const g = this.nodeGraphics;

    // 1. Draw Waypoint / Certification Marker if station has waypoints
    if (waypoints && waypoints.length > 0) {
      const wpX = pixelX + 16;
      const wpY = pixelY - 16;
      g.lineStyle(1.5, 0x18181b, 1);
      g.beginFill(0x0039a6, 1); // Subway Blue Waypoint
      g.moveTo(wpX, wpY - 6);
      g.lineTo(wpX + 6, wpY);
      g.lineTo(wpX, wpY + 6);
      g.lineTo(wpX - 6, wpY);
      g.closePath();
      g.endFill();
    }

    // 2. Draw Station Bullets (MTA style: white core with thick black/colored rim)
    if (isInterchange) {
      // Interchange Station Bullet (Larger transfer hub)
      const radius = isHighlighted ? 13 : 11;

      // Outer black casing
      g.lineStyle(4, 0x18181b, 1);
      g.beginFill(0xffffff, 1);
      g.drawCircle(pixelX, pixelY, radius);
      g.endFill();

      // Inner dark pip
      g.lineStyle(0);
      g.beginFill(0x18181b, 1);
      g.drawCircle(pixelX, pixelY, radius - 6);
      g.endFill();
    } else {
      // Local Single Station Bullet
      const radius = isHighlighted ? 9.5 : 8;

      g.lineStyle(3.5, primaryColorHex, 1);
      g.beginFill(0xffffff, 1);
      g.drawCircle(pixelX, pixelY, radius);
      g.endFill();

      // If in progress or complete, add center dot
      if (status === "in-progress") {
        g.lineStyle(0);
        g.beginFill(0xff6319, 1);
        g.drawCircle(pixelX, pixelY, 3.5);
        g.endFill();
      }
    }

    // 3. Highlight / In-Progress Pulse Ring
    if (status === "in-progress" || isHighlighted) {
      const pulseScale = isHighlighted ? 1.5 : 1.0 + Math.sin(pulsePhase) * 0.28;
      const pulseRadius = (isInterchange ? 16 : 12) * pulseScale;

      g.lineStyle(
        2,
        0xff6319,
        isHighlighted ? 0.9 : 0.4 + Math.cos(pulsePhase) * 0.35
      );
      g.drawCircle(pixelX, pixelY, pulseRadius);
    }

    // Label Offset
    const textOffsetX = 16;
    const textOffsetY = isInterchange ? -20 : -14;

    this.labelText.x = pixelX + textOffsetX;
    this.labelText.y = pixelY + textOffsetY;
    this.subLabelText.x = pixelX + textOffsetX;
    this.subLabelText.y = pixelY + textOffsetY + 16;

    this.labelText.style.fill = isHighlighted ? 0xff6319 : 0x18181b;
  }

  public destroy() {
    this.container.destroy({ children: true });
  }
}
