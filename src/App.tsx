/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import ExplanationBox from './components/ExplanationBox';
import Controls from './components/Controls';
import ScreenCanvas from './components/ScreenCanvas';
import PixelInspector from './components/PixelInspector';
import { ObjectKey, DrawingOrder, DEFAULT_DEPTHS, OBJECT_COLORS } from './types';
import { computeGridData } from './utils';
import { Layers, CheckCircle2, AlertTriangle, PlayCircle, Eye } from 'lucide-react';

export default function App() {
  // 1. App State
  const [depths, setDepths] = useState<Record<ObjectKey, number>>({ ...DEFAULT_DEPTHS });
  const [drawingOrder, setDrawingOrder] = useState<DrawingOrder>('C-A-B'); // default C then A then B creates interesting overlaps!
  const [painterStep, setPainterStep] = useState<number>(0); // 0 means final full render
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [hoveredCell, setHoveredCell] = useState<{ x: number; y: number } | null>(null);

  // Set document title once
  useEffect(() => {
    document.title = 'Z-Buffer Mini Theater - Interactive Graphics Lab';
  }, []);

  // 2. Compute grid data based on depths and drawing sequence
  const gridData = useMemo(() => {
    return computeGridData(depths, drawingOrder, painterStep);
  }, [depths, drawingOrder, painterStep]);

  // 3. Reset to default example state
  const handleReset = () => {
    setDepths({ ...DEFAULT_DEPTHS });
    setDrawingOrder('C-A-B'); // C is closest, A is middle, B is far; draws C then A then B (B covers A and C incorrectly!)
    setPainterStep(0);
    setShowLabels(true);
    setHoveredCell(null);
  };

  // 4. Load Painter Fails Example preset
  const handlePainterFailsPreset = () => {
    // A=3, B=5, C=2. Drawing order C -> A -> B. Since B is drawn last but has z=5 (farthest), it incorrectly overlays closer objects.
    setDepths({ A: 3, B: 5, C: 2 });
    setDrawingOrder('C-A-B');
    setPainterStep(0); // Show full sequence
    setHoveredCell({ x: 13, y: 11 }); // Snap to the triple overlap area for instant diagnosis
  };

  // 4. Count incorrect pixels in Painter's Algorithm to show a live "Rendering Accuracy Meter"
  const accuracyStats = useMemo(() => {
    let totalOverlapPixels = 0;
    let incorrectOverlapPixels = 0;

    for (let x = 0; x < 24; x++) {
      for (let y = 0; y < 24; y++) {
        const cell = gridData[x][y];
        // Only count pixels where there are at least 2 overlapping shapes
        const overlapCount = (cell.coversA ? 1 : 0) + (cell.coversB ? 1 : 0) + (cell.coversC ? 1 : 0);
        if (overlapCount > 1) {
          totalOverlapPixels++;
          if (cell.painterWinner !== cell.zBufferWinner) {
            incorrectOverlapPixels++;
          }
        }
      }
    }

    const accuracyRate = totalOverlapPixels > 0 
      ? Math.round(((totalOverlapPixels - incorrectOverlapPixels) / totalOverlapPixels) * 100) 
      : 100;

    return {
      totalOverlapPixels,
      incorrectOverlapPixels,
      accuracyRate,
    };
  }, [gridData]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-12">
      {/* Top Navigation / Branding Banner */}
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Core Educational Introduction Block */}
        <ExplanationBox />

        {/* Global Controls & Sliders Block */}
        <Controls
          depths={depths}
          setDepths={setDepths}
          drawingOrder={drawingOrder}
          setDrawingOrder={setDrawingOrder}
          showLabels={showLabels}
          setShowLabels={setShowLabels}
          onReset={handleReset}
          onPainterFailsPreset={handlePainterFailsPreset}
        />

        {/* Two Comparison Panels Grid (Side by Side) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* LEFT PANEL: Painter's Algorithm */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-400 animate-pulse"></div>
                  <h2 className="font-sans font-bold text-lg text-slate-900 tracking-tight">
                    1. Painter’s Algorithm
                  </h2>
                </div>
              </div>

              {/* Subtitle / Strategy Explanation */}
              <p className="text-xs text-slate-500 mb-4 leading-relaxed font-sans">
                Renders polygons strictly in sequence like a physical oil painter on a canvas. Newer polygons draw completely on top of existing ones, regardless of physical depths.
              </p>

              {/* Step through Painter's Draw Order Controls */}
              <div className="mb-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-700">Step-by-Step Drawing Order:</span>
                  {painterStep > 0 && (
                    <button
                      onClick={() => setPainterStep(0)}
                      className="text-[11px] text-blue-600 font-medium hover:underline flex items-center gap-0.5"
                    >
                      Show final result
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-4 gap-1">
                  <button
                    onClick={() => setPainterStep(0)}
                    className={`text-xs py-1.5 px-2 rounded-md font-medium border transition ${
                      painterStep === 0
                        ? 'bg-slate-800 text-white border-slate-900 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Show final result
                  </button>
                  {[1, 2, 3].map((step) => {
                    const obj = drawingOrder.split('-')[step - 1];
                    return (
                      <button
                        key={step}
                        onClick={() => setPainterStep(step)}
                        className={`text-xs py-1.5 px-1 rounded-md font-medium border transition truncate ${
                          painterStep === step
                            ? 'bg-blue-600 text-white border-blue-700 font-semibold shadow-xs'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                        title={`Draw ${obj}`}
                      >
                        Step {step}: Draw {obj}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-2 text-[11px] text-slate-500 font-sans leading-tight min-h-[16px]">
                  {painterStep === 0 ? (
                    <span>Click steps to watch objects drawn one-by-one. Farthest should be drawn first.</span>
                  ) : (
                    <span>
                      Showing steps 1 to {painterStep}: Draw{' '}
                      {drawingOrder.split('-').slice(0, painterStep).map((obj, i) => (
                        <span key={obj}>
                          {i > 0 && ' → '}
                          <span
                            className="font-bold"
                            style={{
                              color:
                                obj === 'A'
                                  ? OBJECT_COLORS.A
                                  : obj === 'B'
                                  ? OBJECT_COLORS.B
                                  : OBJECT_COLORS.C,
                            }}
                          >
                            {obj}
                          </span>
                        </span>
                      ))}
                    </span>
                  )}
                </div>
              </div>

              {/* Painter's Canvas Grid */}
              <div className="my-4">
                <ScreenCanvas
                  type="painters"
                  gridData={gridData}
                  hoveredCell={hoveredCell}
                  onHoverCell={setHoveredCell}
                  showLabels={showLabels}
                  depths={depths}
                />
              </div>
            </div>

            {/* Panel Footer & Mandated Explanation */}
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="flex items-start gap-2 text-sm text-slate-600 font-medium">
                <Layers className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <span className="leading-snug">
                  Painter’s Algorithm draws objects in order. If the order is wrong, the visible result can be wrong.
                </span>
              </div>

              {/* Overlay Quality Badge */}
              <div className="mt-3 flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span className="text-xs text-slate-500 font-sans">Status:</span>
                <div className="flex items-center gap-1.5">
                  {accuracyStats.accuracyRate === 100 ? (
                    <span className="text-emerald-700 font-sans text-xs font-semibold bg-emerald-50 px-2.5 py-1 rounded flex items-center gap-1 border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Drawing order is correct
                    </span>
                  ) : (
                    <span className="text-rose-700 font-sans text-xs font-semibold bg-rose-50 px-2.5 py-1 rounded flex items-center gap-1 border border-rose-200 animate-pulse">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> Current order has an error
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: Z-Buffer */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                  <h2 className="font-sans font-bold text-lg text-slate-900 tracking-tight">
                    2. Z-Buffer (Depth-Buffer)
                  </h2>
                </div>
              </div>

              {/* Subtitle / Strategy Explanation */}
              <p className="text-xs text-slate-500 mb-6 leading-relaxed font-sans">
                Renders per-pixel. For every point, compares the object’s depth with a memory buffer holding the closest depth found so far, updating color only if the new depth is closer.
              </p>

              {/* Z-Buffer Canvas Grid */}
              <div className="my-6">
                <ScreenCanvas
                  type="zbuffer"
                  gridData={gridData}
                  hoveredCell={hoveredCell}
                  onHoverCell={setHoveredCell}
                  showLabels={showLabels}
                  depths={depths}
                />
              </div>
            </div>

            {/* Panel Footer & Mandated Explanation */}
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="flex items-start gap-2 text-sm text-slate-600 font-medium">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span className="leading-snug">
                  Z-buffer compares depth per pixel and keeps the closest surface.
                </span>
              </div>

              {/* Immutable correctness badge */}
              <div className="mt-3 flex items-center justify-between bg-blue-50/35 p-2 rounded-lg border border-blue-100">
                <span className="text-xs text-blue-700 font-sans">Z-Buffer Correctness:</span>
                <span className="text-blue-700 font-sans text-xs font-semibold bg-blue-50 px-2.5 py-1 rounded flex items-center gap-1.5 border border-blue-100">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Correct for opaque objects in this demo
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Diagnostic Inspector Panels (Pixel Check + Z-Buffer neighborhood) */}
        <PixelInspector
          hoveredCell={hoveredCell}
          setHoveredCell={setHoveredCell}
          gridData={gridData}
          depths={depths}
          drawingOrder={drawingOrder}
        />

        {/* Legend / Quick Help Footer Banner */}
        <div className="mt-8 bg-slate-100/60 border border-slate-200 rounded-xl p-4 text-xs text-slate-500 font-sans flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="font-semibold text-slate-700">A (Red Triangle)</span>
            <span className="mx-1">•</span>
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span className="font-semibold text-slate-700">B (Blue Rectangle)</span>
            <span className="mx-1">•</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="font-semibold text-slate-700">C (Green Triangle)</span>
          </div>
          <div>
            Hover over any pixel grid to witness the per-pixel calculation in real time!
          </div>
        </div>
      </main>
    </div>
  );
}
