import { useState, useCallback, useEffect } from 'react'
import { MAX_STAGE_WIDTH, PAD, type Plate, type PlateValidation } from '@/types/plate'
import { parseDecimalInput, validateDimension } from '@/utils/validation'

const DEFAULT_PLATES: Plate[] = [{ id: '1', width: 300, height: 128 }]
const STORAGE_KEY = 'plate-generator-plates'

// Helper function to safely parse JSON from localStorage
const getStoredPlates = (): Plate[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      // Validate that it's an array with valid plate objects
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.filter(plate => 
          plate.id && 
          typeof plate.width === 'number' && 
          typeof plate.height === 'number'
        )
      }
    }
  } catch (error) {
    console.warn('Failed to parse plates from localStorage:', error)
  }
  return DEFAULT_PLATES
}

// Helper function to save plates to localStorage
const saveToStorage = (plates: Plate[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plates))
  } catch (error) {
    console.warn('Failed to save plates to localStorage:', error)
  }
}



export function usePlates() {
  const [plates, setPlates] = useState<Plate[]>(getStoredPlates())

    useEffect(() => {
    saveToStorage(plates)
  }, [plates])

  const addPlate = useCallback(() => {
    if (plates.length >= 10) return

    const newPlate: Plate = {
      id: Date.now().toString(),
      width: 30,
      height: 30,
    }

    setPlates((prev) => [...prev, newPlate])
  }, [plates.length])

  const removePlate = useCallback(
    (id: string) => {
      if (plates.length <= 1) return // Always keep at least one plate

      setPlates((prev) => prev.filter((plate) => plate.id !== id))
    },
    [plates.length]
  )

  const updatePlate = useCallback((id: string, updates: Partial<Plate>) => {
    setPlates((prev) =>
      prev.map((plate) => (plate.id === id ? { ...plate, ...updates } : plate))
    )
  }, [])

  const updatePlateDimension = useCallback(
    (
      id: string,
      dimension: 'width' | 'height',
      value: string
    ): PlateValidation => {
      const numValue = parseDecimalInput(value)
      const validation = validateDimension(numValue, dimension)

      if (validation.isValid) {
        updatePlate(id, { [dimension]: numValue })
      }

      return validation
    },
    [updatePlate]
  )

  const getTotalDimensions = useCallback(() => {
    const totalWidth = plates.reduce((sum, plate) => sum + plate.width, 0)
    const maxHeight = Math.max(...plates.map((plate) => plate.height))
    const totalArea = plates.reduce(
      (sum, plate) => sum + plate.width * plate.height,
      0
    )

    return {
      totalWidth,
      maxHeight,
      totalArea,
      plateCount: plates.length,
      needsMirroring: totalWidth > 300,
    }
  }, [plates])

  const computeSizes = useCallback(() => {
  const totalWidth = plates.reduce((s, p) => s + (Number(p.width) || 0), 0);
  const maxHeight = Math.max(1, ...plates.map((p) => Number(p.height) || 0));
  const pxW = Math.max(1, Math.round(totalWidth));
  const pxH = Math.max(1, Math.round(maxHeight));
  const stageWidth = Math.min(pxW + PAD * 2, MAX_STAGE_WIDTH);
  const stageHeight = pxH + PAD * 2;
  return { 
    totalWidth, 
    maxHeight, 
    pxW, 
    pxH, 
    stageWidth, 
    stageHeight }
}, [plates]);

  const reorderPlates = useCallback((fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return

    setPlates((prev) => {
      const newPlates = [...prev]
      const [movedPlate] = newPlates.splice(fromIndex, 1)
      newPlates.splice(toIndex, 0, movedPlate)
      return newPlates
    })
  }, [])

  return {
    plates,
    setPlates,
    addPlate,
    removePlate,
    updatePlate,
    updatePlateDimension,
    getTotalDimensions,
    reorderPlates,
    canAddPlate: plates.length < 10,
    canRemovePlate: plates.length > 1,
    computeSizes
  }
}
