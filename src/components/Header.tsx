/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Layers3 } from 'lucide-react';

export default function Header() {
  return (
    <header className="border-b border-slate-200 bg-white py-4 px-6 mb-6 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
            <Layers3 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-sans font-bold text-2xl tracking-tight text-slate-900">
              Z-Buffer Mini Theater
            </h1>
            <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">
              Computer Graphics Course Demo • Hidden Surface Removal
            </p>
          </div>
        </div>

      </div>
    </header>
  );
}
