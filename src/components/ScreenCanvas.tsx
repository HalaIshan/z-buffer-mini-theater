/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect } from 'react';
import {
  GRID_SIZE,
  PixelData,
  ObjectKey,
  OBJECT_COLORS,
  GRID_LINE_COLOR,
} from '../types';

interface ScreenCanvasProps {
  type: 'painters' | 'zbuffer';
  gridData: PixelData[][];
  hoveredCell: { x: number; y: number } | null;
  onHoverCell: (cell: { x: number; y: number } | null) => void;
  showLabels: boolean;
  depths: Record<ObjectKey, number>;
}

export default function ScreenCanvas({
  type,
  gridData,
  hoveredCell,
  onHoverCell,
  showLabels,
  depths,
}: ScreenCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const CELL_SIZE = 14;
  const CANVAS_DIM = GRID_SIZE * CELL_SIZE; // 24 * 14 = 336px

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = CANVAS_DIM;
    canvas.height = CANVAS_DIM;

    // Clear background
    ctx.fillStyle = '#f8fafc'; // slate-50 background
    ctx.fillRect(0, 0, CANVAS_DIM, CANVAS_DIM);

    // 1. Draw pixel grid
    for (let x = 0; x < GRID_SIZE; x++) {
      for (let y = 0; y < GRID_SIZE; y++) {
        const cell = gridData[x][y];
        const cellColor = type === 'painters' ? cell.painterColor : cell.zBufferColor;

        ctx.fillStyle = cellColor;
        ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);

        // Draw grid boundaries
        ctx.strokeStyle = GRID_LINE_COLOR;
        ctx.lineWidth = 0.5;
        ctx.strokeRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }

    // 2. Overlay Ideal Mathematical Vector Outlines if showLabels is true
    if (showLabels) {
      // Triangle A (Red)
      ctx.beginPath();
      ctx.moveTo(12 * CELL_SIZE, 1.5 * CELL_SIZE);
      ctx.lineTo(2 * CELL_SIZE, 16.5 * CELL_SIZE);
      ctx.lineTo(17 * CELL_SIZE, 19.5 * CELL_SIZE);
      ctx.closePath();
      ctx.strokeStyle = '#991b1b'; // dark red
      ctx.lineWidth = 2;
      ctx.stroke();

      // Rectangle B (Blue)
      ctx.beginPath();
      ctx.rect(4 * CELL_SIZE, 7 * CELL_SIZE, 14 * CELL_SIZE, 8 * CELL_SIZE);
      ctx.strokeStyle = '#1e40af'; // dark blue
      ctx.lineWidth = 2;
      ctx.stroke();

      // Triangle C (Green)
      ctx.beginPath();
      ctx.moveTo(21 * CELL_SIZE, 4.5 * CELL_SIZE);
      ctx.lineTo(7 * CELL_SIZE, 20.5 * CELL_SIZE);
      ctx.lineTo(22 * CELL_SIZE, 22.5 * CELL_SIZE);
      ctx.closePath();
      ctx.strokeStyle = '#065f46'; // dark emerald
      ctx.lineWidth = 2;
      ctx.stroke();

      // Render Text Label Flags inside shapes (semi-transparent tags)
      ctx.font = 'bold 10px monospace';
      
      // Tag A
      ctx.fillStyle = 'rgba(153, 27, 27, 0.85)';
      ctx.fillRect(10.5 * CELL_SIZE - 2, 4.5 * CELL_SIZE, 42, 14);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`A z=${depths.A}`, 10.5 * CELL_SIZE + 2, 4.5 * CELL_SIZE + 10);

      // Tag B
      ctx.fillStyle = 'rgba(30, 64, 175, 0.85)';
      ctx.fillRect(5 * CELL_SIZE, 8.5 * CELL_SIZE, 42, 14);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`B z=${depths.B}`, 5 * CELL_SIZE + 4, 8.5 * CELL_SIZE + 10);

      // Tag C
      ctx.fillStyle = 'rgba(6, 95, 70, 0.85)';
      ctx.fillRect(16.5 * CELL_SIZE - 2, 16.5 * CELL_SIZE, 42, 14);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`C z=${depths.C}`, 16.5 * CELL_SIZE + 2, 16.5 * CELL_SIZE + 10);
    }

    // 3. Highlight hovered cell
    if (hoveredCell) {
      const { x, y } = hoveredCell;
      ctx.strokeStyle = '#000000'; // black frame
      ctx.lineWidth = 2;
      ctx.strokeRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);

      // Draw outer indicator glows or dots
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.fillRect(x * CELL_SIZE + 5, y * CELL_SIZE + 5, CELL_SIZE - 10, CELL_SIZE - 10);
    }
  }, [type, gridData, hoveredCell, showLabels, depths, CANVAS_DIM]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate cell coordinate
    const x = Math.floor((mouseX / rect.width) * GRID_SIZE);
    const y = Math.floor((mouseY / rect.height) * GRID_SIZE);

    if (x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE) {
      onHoverCell({ x, y });
    } else {
      onHoverCell(null);
    }
  };

  const handleMouseLeave = () => {
    onHoverCell(null);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative border-4 border-slate-300 rounded-lg overflow-hidden bg-slate-100 shadow-sm cursor-crosshair">
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="block select-none"
          style={{ imageRendering: 'pixelated' }}
        />
      </div>
    </div>
  );
}
