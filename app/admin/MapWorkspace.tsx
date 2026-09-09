"use client";

import React, { useState } from "react";
import type { SiteContent } from "@/lib/content/types";
import type { Station } from "@/lib/data/projects";
import { pathThroughStations } from "@/lib/content/mapLayout";
import { TransitMapEditor } from "./TransitMapEditor";
import { ArrowDown, ArrowUp, MapPin, Plus, Route, Trash2 } from "lucide-react";

function Field({
  label,
  value,
  onChange,
  multiline = false,
  type = "text",
  hint,
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  multiline?: boolean;
  type?: string;
  hint?: string;
}) {
  const classes = "w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-950 outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10";
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-bold text-zinc-700">{label}</span>
      {multiline ? (
        <textarea rows={4} className={classes} value={value} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input type={type} className={classes} value={value} onChange={(event) => onChange(event.target.value)} />
      )}
      {hint && <span className="block text-[11px] text-zinc-500">{hint}</span>}
    </label>
  );
}

const list = (value: string) => value.split(/\n|,/).map((item) => item.trim()).filter(Boolean);

type MapWorkspaceProps = {
  content: SiteContent;
  patch: (recipe: (draft: SiteContent) => void) => void;
  mode: "stations" | "lines";
  selectedStation: number;
  setSelectedStation: (index: number) => void;
};

export function MapWorkspace({ content, patch, mode, selectedStation, setSelectedStation }: MapWorkspaceProps) {
  const [selectedLine, setSelectedLine] = useState(0);
  const station = content.stations[selectedStation] || content.stations[0];
  const line = content.lines[selectedLine] || content.lines[0];

  const selectStationId = (stationId: string) => {
    const index = content.stations.findIndex((item) => item.id === stationId);
    if (index >= 0) setSelectedStation(index);
  };

  const syncLinePath = (draft: SiteContent, lineIndex: number) => {
    const current = draft.lines[lineIndex];
    if (!current) return;
    const coords = current.stations
      .map((id) => draft.stations.find((item) => item.id === id)?.coords)
      .filter((item): item is Station["coords"] => !!item);
    current.pathD = pathThroughStations(coords);
  };

  const moveStation = (stationId: string, coords: { x: number; y: number }) => {
    patch((draft) => {
      const item = draft.stations.find((entry) => entry.id === stationId);
      if (item) item.coords = coords;
      draft.lines.forEach((entry, index) => {
        if (entry.stations.includes(stationId)) syncLinePath(draft, index);
      });
    });
  };

  const addStation = () => {
    const id = `station-${Date.now()}`;
    patch((draft) => {
      draft.stations.push({
        id,
        title: "New stop",
        lines: draft.lines[0] ? [draft.lines[0].id] : [],
        coords: { x: 50, y: 50 },
        summary: "",
        date: "NEW STOP",
        tags: [],
        links: {},
        status: "in-progress",
      });
      if (draft.lines[0]) {
        draft.lines[0].stations.push(id);
        syncLinePath(draft, 0);
      }
    });
    setSelectedStation(content.stations.length);
  };

  const addLine = () => {
    patch((draft) => {
      draft.lines.push({
        id: `line-${Date.now()}`,
        label: "New line",
        shortLabel: "New line",
        bullet: "N",
        color: "#18181b",
        description: "",
        stations: [],
        pathD: "",
      });
    });
    setSelectedLine(content.lines.length);
  };

  const redrawLine = (lineIndex: number) => {
    patch((draft) => syncLinePath(draft, lineIndex));
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[240px_minmax(0,1fr)_360px]">
      <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        {mode === "stations" ? (
          <>
            <div className="mb-4 flex items-center justify-between gap-2">
              <h2 className="text-base font-black">Stops</h2>
              <button onClick={addStation} className="inline-flex items-center gap-1 text-xs font-bold text-[#ff6319]">
                <Plus className="h-4 w-4" />Add
              </button>
            </div>
            <div className="space-y-2">
              {content.stations.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedStation(index)}
                  className={`w-full rounded-xl border p-3 text-left ${selectedStation === index ? "border-[#ff6319] bg-orange-50" : "border-zinc-200"}`}
                >
                  <div className="truncate text-sm font-bold">{item.title}</div>
                  <div className="mt-1 font-mono text-[10px] text-zinc-500">{item.date}</div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between gap-2">
              <h2 className="text-base font-black">Lines</h2>
              <button onClick={addLine} className="inline-flex items-center gap-1 text-xs font-bold text-[#ff6319]">
                <Plus className="h-4 w-4" />Add
              </button>
            </div>
            <div className="space-y-2">
              {content.lines.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedLine(index)}
                  className={`w-full rounded-xl border p-3 text-left ${selectedLine === index ? "border-[#ff6319] bg-orange-50" : "border-zinc-200"}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="truncate text-sm font-bold">{item.label}</span>
                  </div>
                  <div className="mt-1 font-mono text-[10px] text-zinc-500">{item.stations.length} stops</div>
                </button>
              ))}
            </div>
          </>
        )}
      </section>

      <section className="space-y-3">
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-black">Live map</h2>
              <p className="text-xs text-zinc-500">Drag a stop to move it. Click a stop to edit it. Changes show here immediately.</p>
            </div>
            {mode === "lines" && line && (
              <button
                onClick={() => redrawLine(selectedLine)}
                className="inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-3 py-2 text-xs font-black text-white"
              >
                <Route className="h-4 w-4" />
                Redraw line through stops
              </button>
            )}
          </div>
          <TransitMapEditor
            stations={content.stations}
            lines={content.lines}
            selectedStationId={station?.id}
            selectedLineId={mode === "lines" ? line?.id : null}
            onSelectStation={selectStationId}
            onMoveStation={moveStation}
          />
        </div>
      </section>

      {mode === "stations" && station && (
        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-base font-black">Edit stop</h2>
            <button
              onClick={() => patch((draft) => {
                const id = draft.stations[selectedStation]?.id;
                draft.stations.splice(selectedStation, 1);
                draft.lines.forEach((item) => {
                  item.stations = item.stations.filter((stationId) => stationId !== id);
                });
                setSelectedStation(Math.max(0, selectedStation - 1));
              })}
              className="text-red-500"
              aria-label="Delete stop"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-4">
            <Field label="Project / stop name" value={station.title} onChange={(value) => patch((draft) => { draft.stations[selectedStation].title = value; })} />
            <Field label="Status label / date" value={station.date} onChange={(value) => patch((draft) => { draft.stations[selectedStation].date = value; })} />
            <label className="space-y-1.5">
              <span className="text-xs font-bold text-zinc-700">Project status</span>
              <select value={station.status} onChange={(event) => patch((draft) => { draft.stations[selectedStation].status = event.target.value as Station["status"]; })} className="w-full rounded-xl border border-zinc-300 px-3.5 py-2.5 text-sm">
                <option value="complete">Complete</option>
                <option value="in-progress">In progress</option>
                <option value="archived">Archived</option>
              </select>
            </label>
            <Field label="Letter marker" value={station.letterZone || ""} onChange={(value) => patch((draft) => { draft.stations[selectedStation].letterZone = value; })} />
            <div className="rounded-xl bg-zinc-100 p-3 text-xs font-medium text-zinc-600">
              Map position {station.coords.x}, {station.coords.y} — drag the stop on the map instead of typing coordinates.
            </div>
            <Field label="Summary" multiline value={station.summary} onChange={(value) => patch((draft) => { draft.stations[selectedStation].summary = value; })} />
            <Field label="Tags" value={station.tags.join(", ")} onChange={(value) => patch((draft) => { draft.stations[selectedStation].tags = list(value); })} hint="Separate tags with commas." />
            <Field label="Repository URL" value={station.links.repo || ""} onChange={(value) => patch((draft) => { draft.stations[selectedStation].links.repo = value; })} />
            <Field label="Demo URL" value={station.links.demo || ""} onChange={(value) => patch((draft) => { draft.stations[selectedStation].links.demo = value; })} />
            <div>
              <div className="mb-2 text-xs font-bold text-zinc-700">Lines serving this stop</div>
              <div className="grid gap-2">
                {content.lines.map((item) => (
                  <label key={item.id} className="flex items-center gap-2 rounded-xl border border-zinc-200 p-3 text-xs font-bold">
                    <input
                      type="checkbox"
                      checked={station.lines.includes(item.id)}
                      onChange={(event) => patch((draft) => {
                        const current = draft.stations[selectedStation];
                        current.lines = event.target.checked ? [...current.lines, item.id] : current.lines.filter((id) => id !== item.id);
                        const routeIndex = draft.lines.findIndex((entry) => entry.id === item.id);
                        const route = draft.lines[routeIndex];
                        if (!route) return;
                        if (event.target.checked && !route.stations.includes(current.id)) route.stations.push(current.id);
                        if (!event.target.checked) route.stations = route.stations.filter((id) => id !== current.id);
                        syncLinePath(draft, routeIndex);
                      })}
                    />
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.label}
                  </label>
                ))}
              </div>
            </div>
            <Field
              label="Project highlights"
              multiline
              value={Object.entries(station.specs || {}).map(([key, value]) => `${key}: ${value}`).join("\n")}
              onChange={(value) => patch((draft) => {
                draft.stations[selectedStation].specs = Object.fromEntries(
                  value.split("\n").map((row) => row.split(":")).filter((parts) => parts.length > 1).map(([key, ...rest]) => [key.trim(), rest.join(":").trim()])
                );
              })}
              hint="One highlight per line: Label: Value"
            />
          </div>
        </section>
      )}

      {mode === "lines" && line && (
        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-base font-black">Edit line</h2>
            <button
              onClick={() => patch((draft) => {
                const id = draft.lines[selectedLine]?.id;
                draft.lines.splice(selectedLine, 1);
                draft.stations.forEach((item) => {
                  item.lines = item.lines.filter((lineId) => lineId !== id);
                });
                setSelectedLine(Math.max(0, selectedLine - 1));
              })}
              className="text-red-500"
              aria-label="Delete line"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-4">
            <Field label="Line name" value={line.label} onChange={(value) => patch((draft) => { draft.lines[selectedLine].label = value; })} />
            <Field label="Short name" value={line.shortLabel} onChange={(value) => patch((draft) => { draft.lines[selectedLine].shortLabel = value; })} />
            <div className="grid grid-cols-[1fr_auto] gap-3">
              <Field label="Bullet" value={line.bullet} onChange={(value) => patch((draft) => { draft.lines[selectedLine].bullet = value; })} />
              <Field label="Color" type="color" value={line.color} onChange={(value) => patch((draft) => { draft.lines[selectedLine].color = value; })} />
            </div>
            <Field label="Description" multiline value={line.description || ""} onChange={(value) => patch((draft) => { draft.lines[selectedLine].description = value; })} />
            <label className="flex items-center gap-2 rounded-xl border border-zinc-200 p-3 text-xs font-bold">
              <input type="checkbox" checked={!!line.underConstruction} onChange={(event) => patch((draft) => { draft.lines[selectedLine].underConstruction = event.target.checked; })} />
              Under construction
            </label>
            <div>
              <div className="mb-2 text-xs font-bold text-zinc-700">Stop order along this line</div>
              <div className="space-y-2">
                {line.stations.map((stationId, index) => {
                  const stop = content.stations.find((item) => item.id === stationId);
                  return (
                    <div key={`${stationId}-${index}`} className="flex items-center gap-2 rounded-xl border border-zinc-200 p-2">
                      <MapPin className="h-4 w-4 text-zinc-400" />
                      <span className="min-w-0 flex-1 truncate text-sm font-bold">{stop?.title || stationId}</span>
                      <button aria-label="Move stop up" onClick={() => patch((draft) => {
                        if (index === 0) return;
                        const route = draft.lines[selectedLine].stations;
                        [route[index - 1], route[index]] = [route[index], route[index - 1]];
                        syncLinePath(draft, selectedLine);
                      })}><ArrowUp className="h-4 w-4" /></button>
                      <button aria-label="Move stop down" onClick={() => patch((draft) => {
                        const route = draft.lines[selectedLine].stations;
                        if (index >= route.length - 1) return;
                        [route[index + 1], route[index]] = [route[index], route[index + 1]];
                        syncLinePath(draft, selectedLine);
                      })}><ArrowDown className="h-4 w-4" /></button>
                      <button aria-label="Remove stop from line" onClick={() => patch((draft) => {
                        draft.lines[selectedLine].stations = draft.lines[selectedLine].stations.filter((_, stopIndex) => stopIndex !== index);
                        const stopRecord = draft.stations.find((item) => item.id === stationId);
                        if (stopRecord) stopRecord.lines = stopRecord.lines.filter((lineId) => lineId !== line.id);
                        syncLinePath(draft, selectedLine);
                      })}><Trash2 className="h-4 w-4 text-red-500" /></button>
                    </div>
                  );
                })}
              </div>
              <select
                className="mt-3 w-full rounded-xl border border-zinc-300 px-3 py-2.5 text-sm"
                value=""
                onChange={(event) => {
                  const stationId = event.target.value;
                  if (!stationId) return;
                  patch((draft) => {
                    const route = draft.lines[selectedLine];
                    if (!route.stations.includes(stationId)) route.stations.push(stationId);
                    const stop = draft.stations.find((item) => item.id === stationId);
                    if (stop && !stop.lines.includes(route.id)) stop.lines.push(route.id);
                    syncLinePath(draft, selectedLine);
                  });
                }}
              >
                <option value="">Add a stop to this line…</option>
                {content.stations.filter((item) => !line.stations.includes(item.id)).map((item) => (
                  <option key={item.id} value={item.id}>{item.title}</option>
                ))}
              </select>
            </div>
            <div>
              <div className="mb-2 text-xs font-bold text-zinc-700">Interlines with</div>
              <div className="grid gap-2">
                {content.lines.filter((item) => item.id !== line.id).map((item) => (
                  <label key={item.id} className="flex items-center gap-2 rounded-xl border border-zinc-200 p-3 text-xs font-bold">
                    <input
                      type="checkbox"
                      checked={(line.interlinesWith || []).includes(item.id)}
                      onChange={(event) => patch((draft) => {
                        const current = draft.lines[selectedLine];
                        const next = current.interlinesWith || [];
                        current.interlinesWith = event.target.checked ? [...next, item.id] : next.filter((id) => id !== item.id);
                      })}
                    />
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.label}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
