import * as PIXI from "pixi.js";
import { calculateMapCoordinates, RenderStation, RenderLine, BackgroundTerritory } from "./mapData";
import { MapLineView } from "./Line";
import { MapStationView } from "./Station";

export interface MapEngineOptions {
  container: HTMLDivElement;
  onSelectStation: (station: RenderStation) => void;
  onHoverStation: (station: RenderStation | null, screenPos: { x: number; y: number } | null) => void;
}

export class MapEngine {
  private container: HTMLDivElement;
  private app: PIXI.Application | null = null;
  private lineViews: MapLineView[] = [];
  private stationViews: MapStationView[] = [];
  private backgroundContainer: PIXI.Container | null = null;

  private onSelectStation: (station: RenderStation) => void;
  private onHoverStation: (station: RenderStation | null, screenPos: { x: number; y: number } | null) => void;

  private animationProgress: number = 0;
  private pulsePhase: number = 0;
  private highlightedStationId: string | null = null;
  private highlightedLineId: string | null = null;
  private isDestroyed: boolean = false;

  constructor(options: MapEngineOptions) {
    this.container = options.container;
    this.onSelectStation = options.onSelectStation;
    this.onHoverStation = options.onHoverStation;
  }

  public init() {
    const width = this.container.clientWidth || 800;
    const height = this.container.clientHeight || 580;

    const app = new PIXI.Application({
      width,
      height,
      backgroundAlpha: 0,
      antialias: true,
      resolution: Math.min(window.devicePixelRatio || 1, 2),
      autoDensity: true,
    });

    if (this.isDestroyed) {
      app.destroy(true);
      return;
    }

    this.container.appendChild(app.view as HTMLCanvasElement);
    this.app = app;

    this.backgroundContainer = new PIXI.Container();
    this.app.stage.addChild(this.backgroundContainer);

    this.buildMapObjects(width, height);
    this.startRenderLoop();
  }

  private drawBackgroundLayer(width: number, height: number, territories: BackgroundTerritory[]) {
    if (!this.backgroundContainer) return;
    this.backgroundContainer.removeChildren();

    const grid = new PIXI.Graphics();
    const gridStep = 80;

    // Soft transit paper grid lines
    grid.lineStyle(1, 0x8c8273, 0.12);
    for (let x = gridStep; x < width; x += gridStep) {
      grid.moveTo(x, 0);
      grid.lineTo(x, height);
    }
    for (let y = gridStep; y < height; y += gridStep) {
      grid.moveTo(0, y);
      grid.lineTo(width, y);
    }
    this.backgroundContainer.addChild(grid);

    // Large, soft, low-contrast background territory labels ("borough names behind lines")
    territories.forEach((t) => {
      const text = new PIXI.Text(t.label, {
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Arial, sans-serif",
        fontSize: Math.max(width * 0.038, 22),
        fontWeight: "900",
        fill: 0x8c8273,
        letterSpacing: 2,
        align: "center",
      });
      text.alpha = 0.16;
      text.anchor.set(0.5);
      text.x = t.x;
      text.y = t.y;
      this.backgroundContainer?.addChild(text);
    });
  }

  private buildMapObjects(width: number, height: number) {
    if (!this.app) return;

    // Clear old views
    this.lineViews.forEach((l) => l.destroy());
    this.stationViews.forEach((s) => s.destroy());
    this.lineViews = [];
    this.stationViews = [];

    const { stations, lines, territories } = calculateMapCoordinates(width, height);

    this.drawBackgroundLayer(width, height, territories);

    // 1. Create Lines
    lines.forEach((lineData) => {
      const lineView = new MapLineView(lineData);
      this.app?.stage.addChild(lineView.container);
      this.lineViews.push(lineView);
    });

    // 2. Create Stations
    stations.forEach((stationData) => {
      const stationView = new MapStationView(
        stationData,
        (station, isHovered, screenX, screenY) => {
          if (isHovered) {
            this.highlightedStationId = station.id;
            this.onHoverStation(station, { x: screenX, y: screenY });
          } else {
            if (this.highlightedStationId === station.id) {
              this.highlightedStationId = null;
            }
            this.onHoverStation(null, null);
          }
          this.updateVisualStates();
        },
        (station) => {
          this.onSelectStation(station);
        }
      );

      this.app?.stage.addChild(stationView.container);
      this.stationViews.push(stationView);
    });

    this.updateVisualStates();
  }

  private startRenderLoop() {
    if (!this.app) return;

    this.app.ticker.add((delta) => {
      if (this.isDestroyed) return;

      this.pulsePhase += 0.05 * delta;

      // Smooth progressive draw-in of transit lines
      if (this.animationProgress < 1) {
        this.animationProgress = Math.min(this.animationProgress + 0.025 * delta, 1);
      }

      this.updateVisualStates();
    });
  }

  public updateVisualStates() {
    const activeStation = this.stationViews.find((s) => s.data.id === this.highlightedStationId);
    const activeStationLines = activeStation ? activeStation.data.lines : [];

    // Update lines
    this.lineViews.forEach((lineView) => {
      const isLineActive =
        (this.highlightedLineId && lineView.data.id === this.highlightedLineId) ||
        (activeStation && activeStationLines.includes(lineView.data.id));

      const isLineDimmed =
        (this.highlightedLineId && lineView.data.id !== this.highlightedLineId) ||
        (activeStation && !activeStationLines.includes(lineView.data.id));

      lineView.render(this.animationProgress, !!isLineActive, !!isLineDimmed);
    });

    // Update stations
    this.stationViews.forEach((stationView) => {
      const isStationActive = stationView.data.id === this.highlightedStationId;
      const isConnectedToSelectedLine = this.highlightedLineId
        ? stationView.data.lines.includes(this.highlightedLineId)
        : true;

      const isDimmed = this.highlightedLineId
        ? !isConnectedToSelectedLine
        : activeStation
        ? !stationView.data.lines.some((l) => activeStationLines.includes(l)) && !isStationActive
        : false;

      stationView.render(isStationActive, isDimmed, this.pulsePhase);
    });
  }

  public setHighlightedLine(lineId: string | null) {
    this.highlightedLineId = lineId;
    this.updateVisualStates();
  }

  public setHighlightedStation(stationId: string | null) {
    this.highlightedStationId = stationId;
    this.updateVisualStates();
  }

  public resize() {
    if (!this.app || !this.container) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    if (width > 0 && height > 0) {
      this.app.renderer.resize(width, height);
      this.buildMapObjects(width, height);
    }
  }

  public destroy() {
    this.isDestroyed = true;
    this.lineViews.forEach((l) => l.destroy());
    this.stationViews.forEach((s) => s.destroy());
    if (this.backgroundContainer) {
      this.backgroundContainer.destroy({ children: true });
    }
    if (this.app) {
      this.app.destroy(true, { children: true, texture: true, baseTexture: true });
      this.app = null;
    }
  }
}
