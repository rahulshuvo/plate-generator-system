import styles from './PreviewCard.module.scss'
import { useEffect, useMemo, useRef, useState } from 'react'
import Konva from 'konva'
import type { Stage as KonvaStage } from 'konva/lib/Stage'
import CanvasStage from './Konva/CanvasStage'
import PlateBlock from './Konva/PlateBlock'
import {
  computeSizes,
  getCoverSrcRect,
  makeMirroredStripe,
} from '@/utils/helpers'
import {
  type CoverRect,
  type PlateCanvasProps,
  GAP,
  PAD,
  type Plate,
} from '@/types/plate'
import { Button } from 'antd'

export default function PlateCanvas({
  plates,
  img,
  onCanvasRef,
  onStageRef,
  exportPNG,
}: PlateCanvasProps) {
  const stageRef = useRef<KonvaStage | null>(null)
  const nodeMapRef = useRef<Record<string, Konva.Group | null>>({})
  const prevPlatesRef = useRef<Plate[]>([])
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [fitScale, setFitScale] = useState(1)
  const [canScroll, setCanScroll] = useState(false)
  const { totalWidth, pxW, pxH, stageWidth, stageHeight } = useMemo(() => {
    const s = computeSizes(plates)
    return {
      totalWidth: s.totalWidth,
      pxW: s.pxW,
      pxH: s.pxH,
      stageWidth: s.stageWidth,
      stageHeight: s.stageHeight,
    }
  }, [plates])

  // Memoize source image (mirror if needed for wide setups)
  const { sourceImg, sW, sH } = useMemo(() => {
    const ready = !!img && img.width > 0 && img.height > 0
    const needsMirror = totalWidth > 300 && ready
    if (!needsMirror || !img) {
      return {
        sourceImg: (img as CanvasImageSource | null) ?? null,
        sW: img?.width ?? 0,
        sH: img?.height ?? 0,
      }
    }
    return makeMirroredStripe(img)
  }, [img, totalWidth])

  // Expose Konva stage reference upward
  useEffect(() => onStageRef?.(stageRef.current), [onStageRef])

  // Compute fit-to-container scale on initial render and resize
  useEffect(() => {
    if (!containerRef.current) return
    const containerWidth = containerRef.current.offsetWidth
    
    if (stageWidth > 0 && containerWidth > 0) {
      const scaleToFit = containerWidth / stageWidth
      setFitScale(scaleToFit)
    }
  }, [stageWidth])

  
  useEffect(() => {
    if (!onCanvasRef) return
    const stage = stageRef.current
    const canvasEl =
      (stage
        ?.container?.()
        ?.querySelector?.('canvas') as HTMLCanvasElement | null) || null
    onCanvasRef(canvasEl)
  }, [onCanvasRef])

  const globalSrc: CoverRect | null =
    sourceImg && sW > 0 && sH > 0 ? getCoverSrcRect(sW, sH, pxW, pxH) : null

  const lastSnapshotRef = useRef<{
    prevPlates: Plate[]
    pxW: number
    pxH: number
    globalSrc: CoverRect | null
  }>({
    prevPlates: [],
    pxW,
    pxH,
    globalSrc,
  })

  useEffect(() => {
    lastSnapshotRef.current = {
      prevPlates: prevPlatesRef.current,
      pxW,
      pxH,
      globalSrc,
    }
    prevPlatesRef.current = plates.map((p) => ({ ...p }))
  }, [plates, pxW, pxH, globalSrc])

  const {
    plateRects,
    stageWidthScaled,
    stageHeightScaled,
    scale,
  } = useMemo(() => {
    const rects: {
      id: string
      left: number
      top: number
      width: number
      height: number
    }[] = []
    const gaps: number[] = []
    let cursorXForRects = 0
    gaps.push(PAD)
    for (const p of plates) {
      const w = Number(p.width) || 0
      const h = Number(p.height) || 0
      const drawW = Math.max(0, w - GAP)
      const x = cursorXForRects
      const y = pxH - h

      rects.push({
        id: p.id,
        left: PAD + x,
        top: PAD + y,
        width: drawW,
        height: h,
      })

      cursorXForRects += w
      gaps.push(PAD + cursorXForRects)
    }
    const scale = fitScale * 1
    const stageWidthScaled = stageWidth * scale
    const stageHeightScaled = stageHeight * scale
    const rectsScaled = rects.map((r) => ({
      id: r.id,
      left: r.left * scale,
      top: r.top * scale,
      width: r.width * scale,
      height: r.height * scale,
    }))
    const gapsScaled = gaps.map((x) => x * scale)

    return {
      plateRects: rects,
      gapXs: gaps,
      plateRectsScaled: rectsScaled,
      gapXsScaled: gapsScaled,
      stageWidthScaled,
      stageHeightScaled,
      scale,
    }
  }, [plates, pxH, stageWidth, stageHeight, fitScale])

  useEffect(() => {
    if (!containerRef.current) return
    const checkScroll = () => {
      const containerWidth = containerRef.current?.offsetWidth ?? 0
      setCanScroll(stageWidthScaled > containerWidth)
    }
    checkScroll()
    window.addEventListener('resize', checkScroll)
    return () => window.removeEventListener('resize', checkScroll)
  }, [stageWidthScaled])

  return (
    <div>
      <Button className={styles.exportButton} onClick={exportPNG}>Export PNG</Button>
      <div
        ref={containerRef}
        className={`${styles.canvasContainer} ${canScroll ? styles.canScroll : styles.noScroll}`}
      >
        <div className={styles.canvasInner}>
          <div
            className="relative"
            style={{
              width: stageWidthScaled,
              height: stageHeightScaled,
            }}
          >
            {/* Only the Konva canvas is scaled */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
              }}
            >
              <CanvasStage
                ref={stageRef}
                width={stageWidth}
                height={stageHeight}
                pad={PAD}
              >
                {plates.map((p) => {
                  const w = Number(p.width) || 0
                  const h = Number(p.height) || 0
                  const x =
                    (plateRects.find((r) => r.id === p.id)?.left ?? PAD) - PAD
                  const y = pxH - h
                  const drawW = Math.max(0, w - GAP)
                  const drawH = h
                  const id = p.id

                  const crop =
                    sourceImg && globalSrc
                      ? {
                          x: globalSrc.x + (globalSrc.w * x) / pxW,
                          y: globalSrc.y + (globalSrc.h * (pxH - h)) / pxH,
                          width: (globalSrc.w * drawW) / pxW,
                          height: (globalSrc.h * drawH) / pxH,
                        }
                      : null

                  return (
                    <PlateBlock
                      key={id}
                      id={id}
                      x={x}
                      y={y}
                      width={drawW}
                      height={drawH}
                      crop={crop}
                      sourceImg={sourceImg}
                      onRef={(node) => (nodeMapRef.current[id] = node)}
                    />
                  )
                })}
                
              </CanvasStage>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
