import { useState, useCallback } from 'react'
import type { Plate, PlateValidation } from '@/types/plate'
import { parseDecimalInput, validateDimension } from '@/utils/validation'

const DEFAULT_PLATES: Plate[] = [{ id: '1', width: 300, height: 128 }]

export function usePlates() {
  const [plates, setPlates] = useState<Plate[]>(DEFAULT_PLATES)

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
  }
}
