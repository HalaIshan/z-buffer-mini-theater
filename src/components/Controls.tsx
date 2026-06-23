/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RefreshCw, Eye, EyeOff, Sliders, AlertTriangle } from 'lucide-react';
import { ObjectKey, DrawingOrder, OBJECT_COLORS } from '../types';

interface ControlsProps {
  depths: Record<ObjectKey, number>;
  setDepths: React.Dispatch<React.SetStateAction<Record<ObjectKey, number>>>;
  drawingOrder: DrawingOrder;
  setDrawingOrder: (order: DrawingOrder) => void;
  showLabels: boolean;
  setShowLabels: (show: boolean) => void;
  onReset: () => void;
  onPainterFailsPreset: () => void;
}

export default function Controls({
  depths,
  setDepths,
  drawingOrder,
  setDrawingOrder,
  showLabels,
  setShowLabels,
  onReset,
  onPainterFailsPreset,
}: ControlsProps) {
  const handleDecrement = (key: ObjectKey) => {
    setDepths((prev) => ({
      ...prev,
      [key]: Math.max(1, prev[key] - 1),
    }));
  };

  const handleIncrement = (key: ObjectKey) => {
    setDepths((prev) => ({
      ...prev,
      [key]: Math.min(10, prev[key] + 1),
    }));
  };

  const handleDepthChange = (key: ObjectKey, val: number) => {
    setDepths((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  const orders: { value: DrawingOrder; label: string }[] = [
    { value: 'A-B-C', label: 'A → B → C' },
    { value: 'A-C-B', label: 'A → C → B' },
    { value: 'B-A-C', label: 'B → A → C' },
    { value: 'B-C-A', label: 'B → C → A' },
    { value: 'C-A-B', label: 'C → A → B' },
    { value: 'C-B-A', label: 'C → B → A' },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6 shadow-xs space-y-6">
      {/* Header with Depth Rule */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-slate-500" />
          <h3 className="font-sans font-semibold text-slate-800 text-sm">
            Interactive Depth Controls
          </h3>
        </div>
        <div className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold border border-blue-100 shrink-0">
          Depth rule: <span className="underline font-bold">smaller z = closer</span> to the camera.
        </div>
      </div>

      {/* Depth Control Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card for Object A */}
        <div className="bg-slate-50/50 border border-slate-200/80 rounded-xl p-4 flex flex-col justify-between transition-all hover:border-slate-300">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full border border-red-200 bg-red-500 shrink-0"
                style={{ backgroundColor: OBJECT_COLORS.A }}
              ></span>
              <div>
                <span className="font-sans font-bold text-slate-800 text-xs sm:text-sm block">Object A</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Red Triangle</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between bg-white border border-slate-200/60 rounded-xl p-2 shadow-2xs mb-4">
            <button
              onClick={() => handleDecrement('A')}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
              disabled={depths.A === 1}
              title="Make closer (decrease z)"
            >
              −
            </button>
            <div className="text-center">
              <span className="text-xl font-black font-mono text-slate-900">
                z = <span className="text-red-600 text-2xl">{depths.A}</span>
              </span>
            </div>
            <button
              onClick={() => handleIncrement('A')}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
              disabled={depths.A === 10}
              title="Make farther (increase z)"
            >
              +
            </button>
          </div>

          <div className="space-y-1">
            <div className="relative flex items-center">
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={depths.A}
                onChange={(e) => handleDepthChange('A', parseInt(e.target.value))}
                className="w-full h-1.5 rounded-lg bg-slate-200 appearance-none cursor-pointer accent-red-600"
              />
            </div>
            <div className="flex justify-between px-1 mt-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <button
                  key={num}
                  onClick={() => handleDepthChange('A', num)}
                  className="flex flex-col items-center group focus:outline-hidden"
                >
                  <span className={`w-0.5 h-1 rounded-full transition ${depths.A === num ? 'bg-red-600 h-2 w-1' : 'bg-slate-300'}`}></span>
                  <span className={`text-[9px] font-mono mt-0.5 transition ${depths.A === num ? 'text-red-600 font-bold' : 'text-slate-400'}`}>{num}</span>
                </button>
              ))}
            </div>
            <div className="flex justify-between text-[10px] font-semibold text-slate-500 px-1 pt-1 border-t border-slate-100 mt-1">
              <span className="text-red-700">Near / closer</span>
              <span className="text-slate-500">Far / farther</span>
            </div>
          </div>
        </div>

        {/* Card for Object B */}
        <div className="bg-slate-50/50 border border-slate-200/80 rounded-xl p-4 flex flex-col justify-between transition-all hover:border-slate-300">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full border border-blue-200 bg-blue-500 shrink-0"
                style={{ backgroundColor: OBJECT_COLORS.B }}
              ></span>
              <div>
                <span className="font-sans font-bold text-slate-800 text-xs sm:text-sm block">Object B</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Blue Rectangle</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between bg-white border border-slate-200/60 rounded-xl p-2 shadow-2xs mb-4">
            <button
              onClick={() => handleDecrement('B')}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
              disabled={depths.B === 1}
              title="Make closer (decrease z)"
            >
              −
            </button>
            <div className="text-center">
              <span className="text-xl font-black font-mono text-slate-900">
                z = <span className="text-blue-600 text-2xl">{depths.B}</span>
              </span>
            </div>
            <button
              onClick={() => handleIncrement('B')}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
              disabled={depths.B === 10}
              title="Make farther (increase z)"
            >
              +
            </button>
          </div>

          <div className="space-y-1">
            <div className="relative flex items-center">
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={depths.B}
                onChange={(e) => handleDepthChange('B', parseInt(e.target.value))}
                className="w-full h-1.5 rounded-lg bg-slate-200 appearance-none cursor-pointer accent-blue-600"
              />
            </div>
            <div className="flex justify-between px-1 mt-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <button
                  key={num}
                  onClick={() => handleDepthChange('B', num)}
                  className="flex flex-col items-center group focus:outline-hidden"
                >
                  <span className={`w-0.5 h-1 rounded-full transition ${depths.B === num ? 'bg-blue-600 h-2 w-1' : 'bg-slate-300'}`}></span>
                  <span className={`text-[9px] font-mono mt-0.5 transition ${depths.B === num ? 'text-blue-600 font-bold' : 'text-slate-400'}`}>{num}</span>
                </button>
              ))}
            </div>
            <div className="flex justify-between text-[10px] font-semibold text-slate-500 px-1 pt-1 border-t border-slate-100 mt-1">
              <span className="text-blue-700">Near / closer</span>
              <span className="text-slate-500">Far / farther</span>
            </div>
          </div>
        </div>

        {/* Card for Object C */}
        <div className="bg-slate-50/50 border border-slate-200/80 rounded-xl p-4 flex flex-col justify-between transition-all hover:border-slate-300">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full border border-emerald-200 bg-emerald-500 shrink-0"
                style={{ backgroundColor: OBJECT_COLORS.C }}
              ></span>
              <div>
                <span className="font-sans font-bold text-slate-800 text-xs sm:text-sm block">Object C</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Green Triangle</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between bg-white border border-slate-200/60 rounded-xl p-2 shadow-2xs mb-4">
            <button
              onClick={() => handleDecrement('C')}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
              disabled={depths.C === 1}
              title="Make closer (decrease z)"
            >
              −
            </button>
            <div className="text-center">
              <span className="text-xl font-black font-mono text-slate-900">
                z = <span className="text-emerald-600 text-2xl">{depths.C}</span>
              </span>
            </div>
            <button
              onClick={() => handleIncrement('C')}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
              disabled={depths.C === 10}
              title="Make farther (increase z)"
            >
              +
            </button>
          </div>

          <div className="space-y-1">
            <div className="relative flex items-center">
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={depths.C}
                onChange={(e) => handleDepthChange('C', parseInt(e.target.value))}
                className="w-full h-1.5 rounded-lg bg-slate-200 appearance-none cursor-pointer accent-emerald-600"
              />
            </div>
            <div className="flex justify-between px-1 mt-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <button
                  key={num}
                  onClick={() => handleDepthChange('C', num)}
                  className="flex flex-col items-center group focus:outline-hidden"
                >
                  <span className={`w-0.5 h-1 rounded-full transition ${depths.C === num ? 'bg-emerald-600 h-2 w-1' : 'bg-slate-300'}`}></span>
                  <span className={`text-[9px] font-mono mt-0.5 transition ${depths.C === num ? 'text-emerald-600 font-bold' : 'text-slate-400'}`}>{num}</span>
                </button>
              ))}
            </div>
            <div className="flex justify-between text-[10px] font-semibold text-slate-500 px-1 pt-1 border-t border-slate-100 mt-1">
              <span className="text-emerald-700">Near / closer</span>
              <span className="text-slate-500">Far / farther</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom controls */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-4 border-t border-slate-100 items-end">
        {/* Drawing Order (6 cols) */}
        <div className="md:col-span-6 space-y-2">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Painter's Drawing Order
          </label>
          <select
            value={drawingOrder}
            onChange={(e) => setDrawingOrder(e.target.value as DrawingOrder)}
            className="w-full bg-slate-50 border border-slate-300 text-slate-700 py-2.5 px-3 rounded-lg text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            {orders.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label} (Draw {o.value.replace(/-/g, ' → ')})
              </option>
            ))}
          </select>
          <p className="text-[11px] text-slate-400 font-sans leading-tight">
            Last drawn item will cover previous items in the left panel.
          </p>
        </div>

        {/* Global Controls (6 cols) */}
        <div className="md:col-span-6 flex flex-col sm:flex-row gap-2 shrink-0 w-full">
          <button
            onClick={() => setShowLabels(!showLabels)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-semibold border transition-all duration-150 ${
              showLabels
                ? 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
            title="Toggle depth and letter labels over individual shapes"
          >
            {showLabels ? (
              <>
                <Eye className="w-4 h-4 shrink-0" />
                Hide Labels
              </>
            ) : (
              <>
                <EyeOff className="w-4 h-4 shrink-0" />
                Show Labels
              </>
            )}
          </button>

          <button
            onClick={onPainterFailsPreset}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 shadow-xs transition-all duration-150"
            title="Configure depths and order to demonstrate where Painter's fails"
          >
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            Painter Fails Example
          </button>

          <button
            onClick={onReset}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-semibold bg-slate-800 text-white hover:bg-slate-700 transition-all duration-150 border border-slate-900 shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 shrink-0" />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
