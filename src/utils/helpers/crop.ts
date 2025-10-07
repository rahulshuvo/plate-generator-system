import type { CoverRect, CropRect } from "@/types/plate";

export function buildPlateCrop(
  globalSrc: CoverRect,
  pxW: number,
  pxH: number,
  cursorX: number,
  plateH: number,
  drawW: number,
  drawH: number
): CropRect {
  const sx = globalSrc.w / pxW;
  const sy = globalSrc.h / pxH;

  return {
    x: globalSrc.x + cursorX * sx,
    y: globalSrc.y + (pxH - plateH) * sy,
    width: drawW * sx,
    height: drawH * sy,
  };
}
