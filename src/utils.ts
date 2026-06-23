/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  GRID_SIZE,
  ObjectKey,
  DrawingOrder,
  PixelData,
  OBJECT_COLORS,
  BACKGROUND_COLOR,
} from './types';

// Helper: Point in triangle test using barycentric coordinate approach
export function isPointInTriangle(
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number
): boolean {
  const d1 = (px - x2) * (y1 - y2) - (x1 - x2) * (py - y2);
  const d2 = (px - x3) * (y2 - y3) - (x2 - x3) * (py - y3);
  const d3 = (px - x1) * (y3 - y1) - (x3 - x1) * (py - y1);

  const has_neg = d1 < 0 || d2 < 0 || d3 < 0;
  const has_pos = d1 > 0 || d2 > 0 || d3 > 0;

  // We add a tiny tolerance for boundary edges
  return !(has_neg && has_pos);
}

// Geometric descriptions of the three shapes in 24x24 coordinate system
export function checkCoverage(x: number, y: number) {
  // Use pixel centers for standard rasterization sampling
  const px = x + 0.5;
  const py = y + 0.5;

  // Triangle A (Red)
  // Vertex 1: (12, 1.5) - top center
  // Vertex 2: (2, 16.5) - bottom left
  // Vertex 3: (17, 19.5) - bottom right
  const coversA = isPointInTriangle(px, py, 12, 1.5, 2, 16.5, 17, 19.5);

  // Rectangle B (Blue)
  // Horizontal range [4, 17], Vertical range [7, 14]
  const coversB = px >= 4 && px <= 18 && py >= 7 && py <= 15;

  // Triangle C (Green)
  // Vertex 1: (20, 4.5) - top right
  // Vertex 2: (8, 20.5) - middle left
  // Vertex 3: (22, 22.5) - bottom right
  const coversC = isPointInTriangle(px, py, 21, 4.5, 7, 20.5, 22, 22.5);

  return { coversA, coversB, coversC };
}

/**
 * Computes raster grids for both Painter's and Z-Buffer algorithms based on current depths.
 */
export function computeGridData(
  depths: Record<ObjectKey, number>,
  drawingOrder: DrawingOrder,
  painterStepLimit?: number
): PixelData[][] {
  const grid: PixelData[][] = [];

  // Parse drawing order: e.g., "A-B-C" -> ['A', 'B', 'C']
  const orderList = drawingOrder.split('-') as ObjectKey[];
  const activeOrderList = painterStepLimit && painterStepLimit >= 1 && painterStepLimit <= 3
    ? orderList.slice(0, painterStepLimit)
    : orderList;

  for (let x = 0; x < GRID_SIZE; x++) {
    grid[x] = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      const { coversA, coversB, coversC } = checkCoverage(x, y);

      // --- PAINTER'S ALGORITHM ---
      // Draw objects in activeOrderList sequence. The last object drawn at this pixel wins.
      let painterColor = BACKGROUND_COLOR;
      let painterWinner: ObjectKey | null = null;

      for (const objKey of activeOrderList) {
        if (objKey === 'A' && coversA) {
          painterColor = OBJECT_COLORS.A;
          painterWinner = 'A';
        } else if (objKey === 'B' && coversB) {
          painterColor = OBJECT_COLORS.B;
          painterWinner = 'B';
        } else if (objKey === 'C' && coversC) {
          painterColor = OBJECT_COLORS.C;
          painterWinner = 'C';
        }
      }

      // --- Z-BUFFER ALGORITHM ---
      // Check all covering objects and choose the one with the SMALLEST depth (z).
      let zBufferColor = BACKGROUND_COLOR;
      let zBufferWinner: ObjectKey | null = null;
      let zBufferDepth = Infinity; // Infinity means empty / background

      // Evaluate each object at this pixel
      if (coversA && depths.A < zBufferDepth) {
        zBufferDepth = depths.A;
        zBufferColor = OBJECT_COLORS.A;
        zBufferWinner = 'A';
      }
      if (coversB && depths.B < zBufferDepth) {
        zBufferDepth = depths.B;
        zBufferColor = OBJECT_COLORS.B;
        zBufferWinner = 'B';
      }
      if (coversC && depths.C < zBufferDepth) {
        zBufferDepth = depths.C;
        zBufferColor = OBJECT_COLORS.C;
        zBufferWinner = 'C';
      }

      grid[x][y] = {
        x,
        y,
        coversA,
        coversB,
        coversC,
        painterColor,
        painterWinner,
        zBufferColor,
        zBufferWinner,
        zBufferDepth,
      };
    }
  }

  return grid;
}
