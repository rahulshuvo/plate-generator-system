import styles from './PreviewCard.module.scss'
import { usePlates } from '@/hooks/use-plates'
import motifImage from '../../../public/image/motifImage.webp'
import { useEffect, useRef } from 'react'
import { exportPNGHelper } from '@/utils/plates'
import PlateCanvas from './PlateCanvas'
import useImage from '@/hooks/useImage'

export default function PreviewCard({ plates }: { plates: ReturnType<typeof usePlates>['plates'] }) {
  const { img } = useImage(motifImage);
  const exportCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const handleCanvasRef = (c: HTMLCanvasElement | null) => {
    exportCanvasRef.current = c
  }
  const exportPNG = () => exportPNGHelper(exportCanvasRef.current);

    // Debug: Log when plates change
  useEffect(() => {
    console.log('PreviewCard: plates updated', plates);
  }, [plates]);

  return (
    <div className={styles.previewCard}>
      <PlateCanvas
        plates={plates}
        img={img}
        exportPNG={exportPNG}
        onCanvasRef={handleCanvasRef}
      />
    </div>
  )
}
