/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BookOpen, Info } from 'lucide-react';

export default function ExplanationBox() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      {/* Theoretical Foundation */}
      <div className="lg:col-span-2 bg-blue-50/40 border border-blue-200/60 rounded-xl p-5 text-slate-800 shadow-xs flex flex-col justify-center">
        <div className="flex items-start gap-3">
          <div className="p-1.5 bg-blue-100 text-blue-600 rounded-md mt-0.5 shrink-0">
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <h2 className="font-sans font-semibold text-xs text-blue-900 tracking-tight uppercase tracking-wider">
              Theory: Hidden Surface Removal
            </h2>
            <p className="text-sm leading-relaxed text-slate-700">
              Hidden surface removal decides which object is visible when objects overlap. Painter’s Algorithm depends on drawing order. Z-buffer compares depth per pixel and keeps the closest surface.
            </p>
          </div>
        </div>
      </div>

      {/* What to Notice quick facts */}
      <div className="bg-amber-50/50 border border-amber-200/70 rounded-xl p-5 text-slate-800 shadow-xs">
        <div className="flex items-start gap-2.5">
          <div className="p-1.5 bg-amber-100 text-amber-700 rounded-md shrink-0">
            <Info className="w-4 h-4" />
          </div>
          <div className="space-y-1.5 w-full">
            <h2 className="font-sans font-semibold text-xs text-amber-900 tracking-tight uppercase tracking-wider">
              What to Notice
            </h2>
            <ul className="text-xs space-y-1 text-amber-950 font-sans list-disc list-inside">
              <li>
                <span className="font-semibold">Smaller z</span> means <span className="font-semibold">closer</span> to the camera.
              </li>
              <li>
                <span className="font-semibold">Painter’s Algorithm</span> depends on draw order.
              </li>
              <li>
                <span className="font-semibold">Z-buffer</span> compares depth per pixel.
              </li>
              <li>
                In overlap areas, the two methods can give different results.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
