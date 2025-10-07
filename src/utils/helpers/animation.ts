import { GAP, type CoverRect, type Plate, type RemovedGhost, type ResizeChange } from "@/types/plate";

export function getResizeChanges(
  prev: Plate[],
  next: Plate[],
  epsDim = 1e-6,
  epsAreaRel = 1e-6
): ResizeChange[] {
  const beforeById = new Map(prev.map((p) => [p.id, p]));
  const changes: ResizeChange[] = [];

  for (const cur of next) {
    const before = beforeById.get(cur.id);
    if (!before) continue;

    const dw = Number(cur.width) - Number(before.width);
    const dh = Number(cur.height) - Number(before.height);

    if (Math.abs(dw) <= epsDim && Math.abs(dh) <= epsDim) continue;

    const areaBefore = Number(before.width) * Number(before.height);
    const areaAfter = Number(cur.width) * Number(cur.height);

    const denom = Math.max(areaBefore, 1);
    const relDelta = (areaAfter - areaBefore) / denom;

    let type: ResizeChange["type"];
    if (Math.abs(relDelta) > epsAreaRel) {
      type = relDelta > 0 ? "grow" : "shrink";
    } else {
      type =
        Math.abs(dw) >= Math.abs(dh)
          ? dw >= 0
            ? "grow"
            : "shrink"
          : dh >= 0
          ? "grow"
          : "shrink";
    }

    changes.push({ id: cur.id, type });
  }

  return changes;
}

/** Compute the “ghost” rect + crop for a recently removed plate for fade-out animation. */
export function computeRemovedGhost(
  prevPlates: Plate[],
  removedId: string,
  snapW: number,
  snapH: number,
  snapCrop: CoverRect | null,
  sourceImg: CanvasImageSource | null
): RemovedGhost {
  let cursor = 0;
  for (const p of prevPlates) {
    const width = Number(p.width) || 0;
    const height = Number(p.height) || 0;
    if (p.id === removedId) {
      const x = cursor;
      const y = snapH - height;
      const drawW = Math.max(0, width - GAP);
      const drawH = height;

      if (snapCrop && sourceImg) {
        const fx = cursor / snapW;
        const fy = (snapH - height) / snapH;
        const fw = drawW / snapW;
        const fh = drawH / snapH;

        const sx = snapCrop.x + snapCrop.w * fx;
        const sy = snapCrop.y + snapCrop.h * fy;
        const sw = snapCrop.w * fw;
        const sh = snapCrop.h * fh;

        return {
          id: p.id,
          x,
          y,
          w: drawW,
          h: drawH,
          crop: { x: sx, y: sy, width: sw, height: sh },
        };
      }
      return { id: p.id, x, y, w: drawW, h: drawH, crop: null };
    }
    cursor += width;
  }
  return null;
}
