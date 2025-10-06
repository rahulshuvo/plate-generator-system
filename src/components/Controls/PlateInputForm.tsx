import { Input } from 'antd'
import styles from './PlateInputForm.module.scss'
import { useState, useRef } from 'react'
import { CircleAlert, Minus, X } from 'lucide-react'
import { MESSAGES, PLATE_DIMENSIONS, VALIDATION } from '@/constants/constants'

export default function PlateInputForm() {
  const [isActive, setIsActive] = useState(false)
  const [width, setWidth] = useState(PLATE_DIMENSIONS.WIDTH.DEFAULT.toString())
  const [height, setHeight] = useState(
    PLATE_DIMENSIONS.HEIGHT.DEFAULT.toString()
  )
  const [widthError, setWidthError] = useState('')
  const [heightError, setHeightError] = useState('')

  // Store last valid values
  const lastValidWidth = useRef(PLATE_DIMENSIONS.WIDTH.DEFAULT.toString())
  const lastValidHeight = useRef(PLATE_DIMENSIONS.HEIGHT.DEFAULT.toString())

    // Third validation: Check for multiple decimal separators
  const validateDecimalFormat = (value: string): boolean => {
    if (!value) return true // Empty is handled by other validation
    
    // Count dots and commas
    const dotCount = (value.match(/\./g) || []).length
    const commaCount = (value.match(/,/g) || []).length
    
    // Should not have more than one decimal separator total
    return (dotCount + commaCount) <= 1
  }

    // Fourth validation: Check for single decimal place only
  const validateSingleDecimal = (value: string): boolean => {
    if (!value) return true // Empty is handled by other validation
    
    // Check if value has decimal separator
    const hasDot = value.includes('.')
    const hasComma = value.includes(',')
    
    if (hasDot) {
      const parts = value.split('.')
      // Should have exactly 2 parts and second part should be 1 digit max
      return parts.length === 2 && parts[1].length <= 1
    }
    
    if (hasComma) {
      const parts = value.split(',')
      // Should have exactly 2 parts and second part should be 1 digit max
      return parts.length === 2 && parts[1].length <= 1
    }
    
    // No decimal separator is fine
    return true
  }

  // Validate boundary constraints
  const validateBoundary = (
    value: string,
    min: number,
    max: number,
    setError: (error: string) => void
  ): boolean => {
    if (!value || value.trim() === '') {
      setError(MESSAGES.ERRORS.REQUIRED)
      return false
    }
    if (!validateDecimalFormat(value)) {
      setError(MESSAGES.ERRORS.INVALID_NUMBER)
      return false
    }

    if (!validateSingleDecimal(value)) {
      setError('Only one decimal place allowed')
      return false
    }

    // Normalize German decimal format (replace comma with dot)
    const normalizedValue = value.replace(',', '.')
    const numericValue = parseFloat(normalizedValue)

    if (isNaN(numericValue)) {
      setError(MESSAGES.ERRORS.INVALID_NUMBER)
      return false
    }

    if (numericValue < min) {
      setError(`${MESSAGES.ERRORS.MIN_VALUE} ${min} cm`)
      return false
    }

    if (numericValue > max) {
      setError(`${MESSAGES.ERRORS.MAX_VALUE} ${max} cm`)
      return false
    }

    setError('') // Clear error if validation passes
    return true
  }

  const handleNumberInput = (
    value: string,
    setValue: (val: string) => void,
    setError: (error: string) => void,
    lastValidRef: { current: string },
    min: number,
    max: number
  ) => {
    // Allow only numbers, dots, and commas using constant regex
    if (VALIDATION.NUMBER_REGEX.test(value)) {
      setValue(value)

      // Check if empty and show error
      if (!value || value.trim() === '') {
        setError(MESSAGES.ERRORS.REQUIRED)
      } else {
        // Clear error and update last valid value
        const isValid = validateBoundary(value, min, max, setError)

        // Only update last valid value if boundary validation passes
        if (isValid) {
          lastValidRef.current = value
        }
      }
    }
  }

  const handleBlur = (
    currentValue: string,
    setValue: (val: string) => void,
    setError: (error: string) => void,
    lastValidRef: { current: string },
    min: number,
    max: number
  ) => {
    // If input is empty, revert to last valid value
    if (!currentValue || currentValue.trim() === '') {
      setValue(lastValidRef.current)
      setError('') // Clear error after reverting
    }
    // Validate boundary constraints on blur
    const isValid = validateBoundary(currentValue, min, max, setError)

    // If boundary validation fails, revert to last valid value
    if (!isValid) {
      setValue(lastValidRef.current)
      setError('') // Clear error after reverting
    }
  }
  const convertToMm = (
    value: string,
    hasError: boolean,
    lastValidValue: string
  ): string => {
    const valueToConvert = hasError ? lastValidValue : value

    if (!valueToConvert || valueToConvert === '') return `0 mm`

    const normalizedValue = valueToConvert.replace(',', '.')
    const numericValue = parseFloat(normalizedValue)

    if (isNaN(numericValue)) return `0 mm`

    const mmValue = numericValue * 10
    return `${mmValue} mm`
  }

  const widthInMm = convertToMm(width, !!widthError, lastValidWidth.current)
  const heightInMm = convertToMm(height, !!heightError, lastValidHeight.current)

  return (
    <div
      className={`${styles.plateInputForm} ${
        isActive ? styles.plateInputFormActive : ''
      }`}
      onFocus={() => setIsActive(true)}
      onBlur={() => setIsActive(false)}
      tabIndex={-1} // For div focusable
    >
      {(widthError || heightError) && (
        <span className={styles.errorTooltip}>
          <CircleAlert color="#ef4444" style={{ fill: 'white' }} />
          {widthError || heightError}
        </span>
      )}
      <div className={styles.index}>1</div>
      <div className={styles.inputContainer}>
        <div className={styles.label}>
          Width{' '}
          <span className={styles.subLabel}>
            {PLATE_DIMENSIONS.WIDTH.MIN} - {PLATE_DIMENSIONS.WIDTH.MAX}{' '}
            {PLATE_DIMENSIONS.WIDTH.UNIT}
          </span>
        </div>
        <Input
          className={`${styles.input} ${widthError ? styles.inputError : ''}`}
          placeholder="Width"
          suffix={PLATE_DIMENSIONS.WIDTH.UNIT}
          value={width}
          onChange={(e) =>
            handleNumberInput(
              e.target.value,
              setWidth,
              setWidthError,
              lastValidWidth,
              PLATE_DIMENSIONS.WIDTH.MIN,
              PLATE_DIMENSIONS.WIDTH.MAX
            )
          }
          onBlur={() =>
            handleBlur(
              width,
              setWidth,
              setWidthError,
              lastValidWidth,
              PLATE_DIMENSIONS.WIDTH.MIN,
              PLATE_DIMENSIONS.WIDTH.MAX
            )
          }
        />
        <div className={styles.underLabel}>{widthInMm}</div>
      </div>
      <div className={styles.connector}>
        <X />
      </div>
      <div className={styles.inputContainer}>
        <div className={styles.label}>
          Height{' '}
          <span className={styles.subLabel}>
            {PLATE_DIMENSIONS.HEIGHT.MIN} - {PLATE_DIMENSIONS.HEIGHT.MAX}{' '}
            {PLATE_DIMENSIONS.HEIGHT.UNIT}
          </span>
        </div>
        <Input
          className={`${styles.input} ${heightError ? styles.inputError : ''}`}
          placeholder="Height"
          suffix={PLATE_DIMENSIONS.HEIGHT.UNIT}
          value={height}
          onChange={(e) =>
            handleNumberInput(
              e.target.value,
              setHeight,
              setHeightError,
              lastValidHeight,
              PLATE_DIMENSIONS.HEIGHT.MIN,
              PLATE_DIMENSIONS.HEIGHT.MAX
            )
          }
          onBlur={() =>
            handleBlur(
              height,
              setHeight,
              setHeightError,
              lastValidHeight,
              PLATE_DIMENSIONS.HEIGHT.MIN,
              PLATE_DIMENSIONS.HEIGHT.MAX
            )
          }
        />
        <div className={styles.underLabel}>{heightInMm}</div>
      </div>
      <div className={styles.removeButton}>
        <Minus color="red" size={16} />
      </div>
    </div>
  )
}
