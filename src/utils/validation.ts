import type { Plate } from "@/types/plate"

export interface ValidationRule {
  min: number
  max: number
  message: string
}

export interface ValidationRules {
  width: ValidationRule
  height: ValidationRule
}

export const PLATE_VALIDATION_RULES: ValidationRules = {
  width: {
    min: 20,
    max: 300,
    message: "Breite muss zwischen 20 und 300 cm liegen",
  },
  height: {
    min: 30,
    max: 128,
    message: "Höhe muss zwischen 30 und 128 cm liegen",
  },
}

export function parseDecimalInput(input: string): number {
  // Support both German (,) and English (.) decimal separators
  const normalized = input.replace(",", ".")
  return Number.parseFloat(normalized)
}

export function validateDimension(value: number, type: "width" | "height"): { isValid: boolean; error?: string } {
  const rule = PLATE_VALIDATION_RULES[type]

  if (isNaN(value) || value < rule.min || value > rule.max) {
    return {
      isValid: false,
      error: rule.message,
    }
  }

  return { isValid: true }
}

export function formatDimension(value: number, locale = "de-DE"): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value)
}

export function isValidPlateConfiguration(plates: Plate[]): boolean {
  if (!Array.isArray(plates) || plates.length === 0 || plates.length > 10) {
    return false
  }

  return plates.every((plate) => {
    if (!plate || typeof plate !== "object") return false
    if (typeof plate.id !== "string") return false
    if (typeof plate.width !== "number" || typeof plate.height !== "number") return false

    const widthValid = validateDimension(plate.width, "width").isValid
    const heightValid = validateDimension(plate.height, "height").isValid

    return widthValid && heightValid
  })
}
