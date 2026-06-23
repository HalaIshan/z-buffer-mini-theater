/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Table, HelpCircle as InfoIcon, ChevronDown, ChevronUp } from 'lucide-react';
import {
  PixelData,
  ObjectKey,
  OBJECT_COLORS,
  GRID_SIZE,
} from '../types';

interface PixelInspectorProps {
  hoveredCell: { x: number; y: number } | null;
  setHoveredCell: (cell: { x: number; y: number } | null) => void;
  gridData: PixelData[][];
  depths: Record<ObjectKey, number>;
  drawingOrder: string;
}

export default function PixelInspector({
  hoveredCell,
  setHoveredCell,
  gridData,
  depths,
  drawingOrder,
}: PixelInspectorProps) {
  // Collapsible states for advanced/secondary sections
  const [showExtraPoints, setShowExtraPoints] = useState(false);
  const [showMiniDepthBuffer, setShowMiniDepthBuffer] = useState(false);

  // Key academic sample points for quick reference
  const samplePoints = [
    { label: 'Single Object (A)', x: 12, y: 3, desc: 'Only Red Triangle covers this pixel' },
    { label: 'Two-Object Overlap (A & B)', x: 9, y: 9, desc: 'Red & Blue overlap. Compare depths!' },
    { label: 'Three-Object Overlap', x: 13, y: 11, desc: 'Critical Area where all three overlap!' },
  ];

  // Default to a central interesting pixel if not hovering
  const activeX = hoveredCell ? hoveredCell.x : 13;
  const activeY = hoveredCell ? hoveredCell.y : 11;
  const cell: PixelData = gridData[activeX][activeY];

  const getWinnerBadge = (key: ObjectKey | null) => {
    if (!key) return <span className="text-slate-500 font-mono bg-slate-100 px-1.5 py-0.5 rounded text-xs">Background</span>;
    const color = OBJECT_COLORS[key];
    return (
      <span
        className="text-white font-mono font-bold px-2 py-0.5 rounded text-xs shadow-xs"
        style={{ backgroundColor: color }}
      >
        Object {key}
      </span>
    );
  };

  // Build a 5x5 local neighborhood around the current inspection point
  const neighborhoodRadius = 2; // gives 5x5 grid
  const nGrid: { x: number; y: number; data: PixelData | null }[][] = [];

  for (let dy = -neighborhoodRadius; dy <= neighborhoodRadius; dy++) {
    const row: { x: number; y: number; data: PixelData | null }[] = [];
    for (let dx = -neighborhoodRadius; dx <= neighborhoodRadius; dx++) {
      const nx = activeX + dx;
      const ny = activeY + dy;
      if (nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE) {
        row.push({ x: nx, y: ny, data: gridData[nx][ny] });
      } else {
        row.push({ x: nx, y: ny, data: null });
      }
    }
    nGrid.push(row);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
      {/* Pixel Explanation (7 cols) */}
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Search className="w-4.5 h-4.5 text-blue-600" />
              <h3 className="font-sans font-semibold text-slate-800 text-sm">
                Pixel Explanation
              </h3>
            </div>
            <div className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">
              {hoveredCell ? 'Hovering at' : 'Default point'}: X:{activeX}, Y:{activeY}
            </div>
          </div>

          {/* Core Pixel Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            {/* Left: Pixel coverage properties */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Object Coverage
              </h4>
              <div className="space-y-2">
                {/* Object A */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                    <span className="text-xs font-sans font-medium text-slate-700">A (Red Triangle)</span>
                  </div>
                  <div className="text-xs font-mono">
                    {cell.coversA ? (
                      <span className="text-red-700 font-semibold bg-red-50 px-1.5 py-0.5 rounded">
                        Covers (z = {depths.A})
                      </span>
                    ) : (
                      <span className="text-slate-400">Doesn't cover</span>
                    )}
                  </div>
                </div>

                {/* Object B */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                    <span className="text-xs font-sans font-medium text-slate-700">B (Blue Rectangle)</span>
                  </div>
                  <div className="text-xs font-mono">
                    {cell.coversB ? (
                      <span className="text-blue-700 font-semibold bg-blue-50 px-1.5 py-0.5 rounded">
                        Covers (z = {depths.B})
                      </span>
                    ) : (
                      <span className="text-slate-400">Doesn't cover</span>
                    )}
                  </div>
                </div>

                {/* Object C */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span className="text-xs font-sans font-medium text-slate-700">C (Green Triangle)</span>
                  </div>
                  <div className="text-xs font-mono">
                    {cell.coversC ? (
                      <span className="text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                        Covers (z = {depths.C})
                      </span>
                    ) : (
                      <span className="text-slate-400">Doesn't cover</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Comparative calculations */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Algorithm Outcomes
              </h4>
              <div className="grid grid-cols-1 gap-2.5">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Painter's Result</span>
                    {getWinnerBadge(cell.painterWinner)}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Order: {drawingOrder.replace(/-/g, ' → ')}
                  </div>
                </div>

                <div className="p-2.5 bg-blue-50/40 rounded-lg border border-blue-200/50">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Z-Buffer Result</span>
                    {getWinnerBadge(cell.zBufferWinner)}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Closest z seen: <span className="font-semibold text-slate-800">{cell.zBufferDepth === Infinity ? '∞' : cell.zBufferDepth}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom comparative explanation for this pixel - LARGE AND EASY TO READ */}
          <div className="p-4 bg-amber-50 border border-amber-200/80 rounded-xl text-amber-950 font-sans flex gap-3">
            <InfoIcon className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              {(() => {
                const activeDepths: { name: string; color: string; z: number }[] = [];
                if (cell.coversA) activeDepths.push({ name: 'A', color: 'Red', z: depths.A });
                if (cell.coversB) activeDepths.push({ name: 'B', color: 'Blue', z: depths.B });
                if (cell.coversC) activeDepths.push({ name: 'C', color: 'Green', z: depths.C });

                if (activeDepths.length === 0) {
                  return (
                    <p className="text-sm sm:text-base font-semibold leading-relaxed text-amber-900">
                      At this pixel, there are no overlapping objects (background space). Neither algorithm needs to draw anything here.
                    </p>
                  );
                } else if (activeDepths.length === 1) {
                  const item = activeDepths[0];
                  return (
                    <p className="text-sm sm:text-base font-semibold leading-relaxed text-amber-900">
                      At this pixel, only {item.name} is present with z={item.z}. Since there are no overlapping depths to resolve, the Z-buffer keeps {item.name}.
                    </p>
                  );
                } else {
                  // Sorted by depth (smallest first = closest)
                  const sorted = [...activeDepths].sort((a, b) => a.z - b.z);
                  const minObj = sorted[0];

                  // Construct nice string: "A has z=3 and B has z=5" or "A has z=3, B has z=5, and C has z=2"
                  let objectListStr = '';
                  if (activeDepths.length === 2) {
                    objectListStr = `${activeDepths[0].name} has z=${activeDepths[0].z} and ${activeDepths[1].name} has z=${activeDepths[1].z}`;
                  } else {
                    objectListStr = `${activeDepths[0].name} has z=${activeDepths[0].z}, ${activeDepths[1].name} has z=${activeDepths[1].z}, and ${activeDepths[2].name} has z=${activeDepths[2].z}`;
                  }

                  const isCorrect = cell.painterWinner === cell.zBufferWinner;

                  return (
                    <div className="space-y-1.5">
                      <p className="text-sm sm:text-base font-bold text-amber-950 leading-relaxed">
                        At this pixel, {objectListStr}. Since smaller z is closer, the Z-buffer keeps {minObj.name}.
                      </p>
                      <div className="text-xs text-amber-900/80 border-t border-amber-200/60 pt-1.5">
                        <span className="font-semibold">Painter's Algorithm Outcome:</span> Draws objects in sequence ({drawingOrder.replace(/-/g, ' → ')}), resulting in <span className="font-semibold">{cell.painterWinner}</span>.{' '}
                        {isCorrect ? (
                          <span className="text-emerald-700 font-semibold ml-1 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200">
                            (Correct order here)
                          </span>
                        ) : (
                          <span className="text-rose-700 font-bold ml-1 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                            (Notice the mistake: Farther object covers closer objects!)
                          </span>
                        )}
                      </div>
                    </div>
                  );
                }
              })()}
            </div>
          </div>
        </div>

        {/* Collapsible Extra Test Points Section */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <button
            onClick={() => setShowExtraPoints(!showExtraPoints)}
            className="w-full flex items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-50 border-b border-slate-100 transition duration-150 focus:outline-hidden"
          >
            <div className="flex items-center gap-2">
              <Table className="w-4 h-4 text-slate-500" />
              <span className="font-sans font-semibold text-slate-800 text-xs sm:text-sm">
                Extra test points (Optional reference list)
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <span>{showExtraPoints ? 'Hide Table' : 'Show Table'}</span>
              {showExtraPoints ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </div>
          </button>

          {showExtraPoints && (
            <div className="p-4 border-t border-slate-100 animate-fade-in">
              <p className="text-xs text-slate-500 mb-3 font-sans">
                Click any coordinate row below to snap the inspector onto key locations representing single and multiple overlaps!
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-mono">
                      <th className="py-2 px-3 font-semibold">Test Area</th>
                      <th className="py-2 px-2 font-semibold">Coord</th>
                      <th className="py-2 px-2 font-semibold text-center">Covers</th>
                      <th className="py-2 px-2 font-semibold text-center">Painter Winner</th>
                      <th className="py-2 px-2 font-semibold text-center">Z-Buffer Winner</th>
                      <th className="py-2 px-3 font-semibold text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {samplePoints.map((pt) => {
                      const targetCell = gridData[pt.x][pt.y];
                      const active = activeX === pt.x && activeY === pt.y;

                      // Find covered objects list
                      const coveredList = [];
                      if (targetCell.coversA) coveredList.push('A');
                      if (targetCell.coversB) coveredList.push('B');
                      if (targetCell.coversC) coveredList.push('C');

                      const isCorrect = targetCell.painterWinner === targetCell.zBufferWinner;

                      return (
                        <tr
                          key={`${pt.x}-${pt.y}`}
                          onClick={() => setHoveredCell({ x: pt.x, y: pt.y })}
                          className={`hover:bg-blue-50/40 cursor-pointer transition-colors duration-75 ${
                            active ? 'bg-blue-50/80 font-medium border-l-2 border-l-blue-600' : ''
                          }`}
                        >
                          <td className="py-2 px-3">
                            <div className="font-medium text-slate-800">{pt.label}</div>
                            <div className="text-[10px] text-slate-400 font-sans">{pt.desc}</div>
                          </td>
                          <td className="py-2 px-2 font-mono text-slate-600">
                            ({pt.x},{pt.y})
                          </td>
                          <td className="py-2 px-2 text-center">
                            <div className="flex justify-center gap-1">
                              {targetCell.coversA && <span className="w-2.5 h-2.5 rounded-full bg-red-500" title="Covers A" />}
                              {targetCell.coversB && <span className="w-2.5 h-2.5 rounded-full bg-blue-500" title="Covers B" />}
                              {targetCell.coversC && <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" title="Covers C" />}
                              {coveredList.length === 0 && <span className="text-slate-400 font-mono">-</span>}
                            </div>
                          </td>
                          <td className="py-2 px-2 text-center font-mono">
                            {targetCell.painterWinner ? (
                              <span className="font-semibold" style={{ color: OBJECT_COLORS[targetCell.painterWinner] }}>
                                {targetCell.painterWinner}
                              </span>
                            ) : (
                              <span className="text-slate-300">-</span>
                            )}
                          </td>
                          <td className="py-2 px-2 text-center font-mono">
                            {targetCell.zBufferWinner ? (
                              <span className="font-semibold" style={{ color: OBJECT_COLORS[targetCell.zBufferWinner] }}>
                                {targetCell.zBufferWinner}
                              </span>
                            ) : (
                              <span className="text-slate-300">-</span>
                            )}
                          </td>
                          <td className="py-2 px-3 text-center">
                            {coveredList.length <= 1 ? (
                              <span className="text-slate-400 text-[10px] bg-slate-100 px-1 rounded font-mono">No Overlap</span>
                            ) : isCorrect ? (
                              <span className="text-emerald-700 text-[10px] bg-emerald-50 px-1 rounded font-mono font-semibold">
                                Correct
                              </span>
                            ) : (
                              <span className="text-rose-700 text-[10px] bg-rose-50 px-1 rounded font-mono font-bold animate-pulse">
                                Error
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Optional Mini Depth Buffer (5 cols) */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="w-4.5 h-4.5 text-blue-600 shrink-0" />
              <div>
                <h3 className="font-sans font-semibold text-slate-800 text-sm">
                  Optional Mini Depth Buffer
                </h3>
                <p className="text-[10px] text-slate-400 font-sans">
                  Depth values stored around the selected pixel (X:{activeX}, Y:{activeY})
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowMiniDepthBuffer(!showMiniDepthBuffer)}
              className="text-xs font-semibold text-blue-600 hover:underline shrink-0 ml-2"
            >
              {showMiniDepthBuffer ? 'Hide Grid' : 'Show Grid'}
            </button>
          </div>

          {/* Memory grid is collapsible */}
          {showMiniDepthBuffer && (
            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col items-center animate-fade-in">
              <div className="grid grid-cols-5 gap-1 p-2 bg-slate-100 rounded-xl border border-slate-200">
                {nGrid.map((row, rowIndex) =>
                  row.map((cellObj, colIndex) => {
                    const isCenter = cellObj && cellObj.x === activeX && cellObj.y === activeY;
                    const cData = cellObj?.data;

                    const winnerColor = cData?.zBufferWinner
                      ? OBJECT_COLORS[cData.zBufferWinner]
                      : '#e2e8f0'; // empty slate-200

                    const depthVal = cData
                      ? cData.zBufferDepth === Infinity
                        ? '∞'
                        : cData.zBufferDepth
                      : '';

                    return (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className={`w-11 h-11 sm:w-12 sm:h-12 rounded-lg flex flex-col items-center justify-center text-center p-0.5 border transition-all ${
                          isCenter
                            ? 'border-black ring-2 ring-amber-400 scale-105 bg-white shadow-md'
                            : 'border-slate-200 bg-white shadow-xs'
                        }`}
                        title={
                          cData
                            ? `Depth buffer cell at (${cData.x}, ${cData.y}) stores depth: ${depthVal}`
                            : ''
                        }
                      >
                        {/* Pixel coordinates */}
                        <span className="text-[7px] font-mono text-slate-400">
                          {cellObj ? `${cellObj.x},${cellObj.y}` : ''}
                        </span>

                        {/* Stored Depth value */}
                        <span className="text-[11px] font-mono font-bold text-slate-800">
                          {depthVal}
                        </span>

                        {/* Winning label badge */}
                        {cData?.zBufferWinner ? (
                          <span
                            className="text-[7px] font-bold font-mono text-white px-0.5 rounded-xs uppercase tracking-tight"
                            style={{ backgroundColor: winnerColor }}
                          >
                            Obj:{cData.zBufferWinner}
                          </span>
                        ) : (
                          <span className="text-[8px] font-mono text-slate-300">empty</span>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              <div className="mt-4 text-center max-w-xs w-full">
                <div className="text-[11px] font-semibold text-slate-700 font-sans">
                  Depth Buffer Range:
                </div>
                <div className="mt-1 flex items-center justify-between text-[9px] font-mono text-slate-500 w-full px-1">
                  <span>1 (Closest)</span>
                  <div className="h-1.5 flex-1 mx-2 rounded-xs bg-gradient-to-r from-slate-900 to-slate-200 border border-slate-300" />
                  <span>10 (Far)</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-2 font-sans leading-relaxed">
                  This grid shows the closest depth value recorded at each pixel. Infinite values (background) are initialized to <span className="font-mono">∞</span>.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
