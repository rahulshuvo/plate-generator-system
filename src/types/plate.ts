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