import type { Stage as KonvaStage } from "konva/lib/Stage";

export interface Plate {
  id: string
  width: number // in cm
  height: number // in cm
  x?: number // position for canvas
  y?: number // position for canvas
}

export interface PlateValidation {
  isValid: boolean
  error?: string
}

export const MAX_STAGE_WIDTH = 12000;
export const PAD = 24;
export const GAP = 4;
export const ANIM_S = 0.5;
export type OnReorder = (from: number, to: number) => void;
export type CoverRect = { x: number; y: number; w: number; h: number };
export type CropRect = { x: number; y: number; width: number; height: number };
export type RemovedGhost = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  crop: CropRect | null;
} | null;

export type ResizeChange = { id: string; type: "grow" | "shrink" };

export type PlateCanvasProps = {
  plates: Plate[];
  img: HTMLImageElement | null;
  onCanvasRef?: (el: HTMLCanvasElement | null) => void;
  onStageRef?: (stage: KonvaStage | null) => void;
  recentlyAdded?: string | null;
  recentlyRemoved?: string | null;
  exportPNG: () => void;
  onReorder?: OnReorder;
};