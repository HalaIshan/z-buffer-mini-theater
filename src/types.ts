/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ObjectKey = 'A' | 'B' | 'C';

export interface GraphicalObject {
  id: ObjectKey;
  name: string;
  color: string;
  label: string;
  defaultDepth: number;
}

export type DrawingOrder =
  | 'A-B-C'
  | 'A-C-B'
  | 'B-A-C'
  | 'B-C-A'
  | 'C-A-B'
  | 'C-B-A';

export interface PixelData {
  x: number;
  y: number;
  coversA: boolean;
  coversB: boolean;
  coversC: boolean;
  painterColor: string;
  painterWinner: ObjectKey | null;
  zBufferColor: string;
  zBufferWinner: ObjectKey | null;
  zBufferDepth: number;
}

export const GRID_SIZE = 24;

// Default depths (smaller = closer)
export const DEFAULT_DEPTHS: Record<ObjectKey, number> = {
  A: 3, // Red Triangle - middle
  B: 5, // Blue Rectangle - far
  C: 2, // Green Triangle - close
};

export const OBJECT_COLORS: Record<ObjectKey, string> = {
  A: '#ef4444', // vibrant red (tailwindcss red-500)
  B: '#3b82f6', // vibrant blue (tailwindcss blue-500)
  C: '#10b981', // vibrant green (tailwindcss emerald-500)
};

export const BACKGROUND_COLOR = '#f1f5f9'; // slate-100
export const GRID_LINE_COLOR = 'rgba(203, 213, 225, 0.4)'; // slate-300 with opacity
