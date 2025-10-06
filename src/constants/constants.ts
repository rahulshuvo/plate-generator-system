// ========================================
// PLATE DIMENSIONS
// ========================================
export const PLATE_DIMENSIONS = {
  WIDTH: {
    MIN: 20,
    MAX: 300,
    DEFAULT: 30,
    UNIT: 'cm'
  },
  HEIGHT: {
    MIN: 30,
    MAX: 128,
    DEFAULT: 30,
    UNIT: 'cm'
  }
} as const

// ========================================
// PLATE LIMITS
// ========================================
export const PLATE_LIMITS = {
  MAX_PLATES: 10,
  MIN_PLATES: 1
} as const

// ========================================
// UI CONSTANTS
// ========================================
export const UI = {
  FORM_HEIGHT: {
    NORMAL: 72,
    ACTIVE: 128
  },
  FORM_WIDTH: 516,
  INPUT_HEIGHT: {
    NORMAL: 40,
    ACTIVE: 44
  },
  BUTTON_SIZE: {
    SMALL: 24,
    MEDIUM: 35
  },
  BORDER_RADIUS: {
    SMALL: 4,
    MEDIUM: 8,
    CIRCLE: '50%'
  },
  TRANSITION_DURATION: '0.3s'
} as const

// ========================================
// VALIDATION
// ========================================
export const VALIDATION = {
  NUMBER_REGEX: /^[0-9.,]*$/
} as const

// ========================================
// MESSAGES
// ========================================
export const MESSAGES = {
  ERRORS: {
    REQUIRED: 'This field is required',
    INVALID_NUMBER: 'Please enter a valid number',
    MIN_VALUE: 'Value must be at least',
    MAX_VALUE: 'Value must not exceed',
    INVALID_DIMENSION: 'Please enter a valid dimension',
    OUT_OF_RANGE: 'Value is out of allowed range',
    MAX_PLATES_REACHED: 'Maximum number of plates reached',
    REQUIRED_FIELD: 'This field is required'
  }
} as const

// ========================================
// LOCAL STORAGE KEYS
// ========================================
export const STORAGE_KEYS = {
  PLATES: 'plate-generator-plates',
  SETTINGS: 'plate-generator-settings'
} as const

// ========================================
// EXPORT ALL
// ========================================
export const CONSTANTS = {
  PLATE_DIMENSIONS,
  PLATE_LIMITS,
  UI,
  VALIDATION,
  MESSAGES,
  STORAGE_KEYS
} as const
