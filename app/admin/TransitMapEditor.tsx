"use client";

import React, { useRef, useState } from "react";
import type { Line } from "@/lib/data/skills";
import type { Station } from "@/lib/data/projects";
import { MAP_VIEW_HEIGHT, MAP_VIEW_WIDTH, clientPointToSvg, stationToSvg, svgToStation } from "@/lib/content/mapLayout";

type TransitMapEditorProps = {
  stations: Station[];
  lines: Line[];
  selectedStationId?: string | null;
  selectedLineId?: string | null;
  onSelectStation: (stationId: string) => void;
  onMoveStation: (stationId: string, coords: { x: number; y: number }) => void;
};

export function TransitMapEditor({
  stations,
  lines,
  selectedStationId,
  selectedLineId,
  onSelectStation,
  onMoveStation,
}: TransitMapEditorProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const moveToPointer = (stationId: string, clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return;
    onMoveStation(stationId, svgToStation(clientPointToSvg(svg, clientX, clientY)));
  };

  return (
    <div className="overflow-auto rounded-2xl border border-zinc-300 bg-[#faf8f5] shadow-inner" style={{ maxHeight: "70vh" }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${MAP_VIEW_WIDTH} ${MAP_VIEW_HEIGHT}`}
        className="block w-full select-none touch-none"
        onPointerMove={(event) => {
          if (!draggingId) return;
          moveToPointer(draggingId, event.clientX, event.clientY);
        }}
        onPointerUp={() => setDraggingId(null)}
        onPointerLeave={() => setDraggingId(null)}
      >
        <rect width={MAP_VIEW_WIDTH} height={MAP_VIEW_HEIGHT} fill="#faf8f5" />
        {Array.from({ length: 11 }, (_, index) => (
          <line key={`v-${index}`} x1={index * 100} y1={0} x2={index * 100} y2={MAP_VIEW_HEIGHT} stroke="#e4dcce" strokeWidth="1" />
        ))}
        {Array.from({ length: 36 }, (_, index) => (
          <line key={`h-${index}`} x1={0} y1={index * 100} x2={MAP_VIEW_WIDTH} y2={index * 100} stroke="#e4dcce" strokeWidth="1" />
        ))}

        {lines.map((line) => {
          const emphasized = !selectedLineId || selectedLineId === line.id;
          return (
            <path
              key={line.id}
              d={line.pathD || ""}
              fill="none"
              stroke={line.color}
              strokeWidth={emphasized ? 14 : 8}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={emphasized ? 1 : 0.18}
            />
          );
        })}

        {stations.map((station) => {
          const point = stationToSvg(station.coords);
          const selected = station.id === selectedStationId;
          const color = lines.find((line) => station.lines.includes(line.id))?.color || "#18181b";
          return (
            <g
              key={station.id}
              transform={`translate(${point.x}, ${point.y})`}
              className="cursor-grab"
              onPointerDown={(event) => {
                event.preventDefault();
                svgRef.current?.setPointerCapture(event.pointerId);
                setDraggingId(station.id);
                onSelectStation(station.id);
                moveToPointer(station.id, event.clientX, event.clientY);
              }}
            >
              <circle r={selected ? 28 : 22} fill={selected ? "#fff7ed" : "#ffffff"} stroke={selected ? "#ff6319" : "#18181b"} strokeWidth={selected ? 8 : 6} />
              <circle r={8} fill={color} />
              <text x={34} y={-10} fontSize="28" fontWeight="800" fill="#18181b">{station.title}</text>
              <text x={34} y={22} fontSize="20" fontWeight="600" fill="#71717a">{station.date}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
