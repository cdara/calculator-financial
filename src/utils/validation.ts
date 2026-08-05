import { Decimal } from './math'

/**
 * Validates and parses a numeric input string
 * Returns parsed Decimal or throws error if invalid
 */
export function validateAndParse(value: string, fieldName: string): Decimal {
  if (!value || value.trim() === '') {
    throw new Error(`${fieldName} is required`)
  }

  const numStr = value.trim()
  
  // Remove any non-numeric characters except decimal point and minus sign
  const cleanStr = numStr.replace(/[^0-9.\-]/g, '')
  
  if (cleanStr === '' || cleanStr === '-' || cleanStr === '.') {
    throw new Error(`${fieldName} must be a valid number`)
  }

  const decimal = new Decimal(cleanStr)
  
  if (decimal.isNaN()) {
    throw new Error(`${fieldName} must be a valid number`)
  }

  return decimal
}

/**
 * Validates that a value is non-negative
 */
export function validateNonNegative(value: Decimal, fieldName: string): void {
  if (value.isNegative()) {
    throw new Error(`${fieldName} must be non-negative`)
  }
}

/**
 * Validates that a value is positive
 */
export function validatePositive(value: Decimal, fieldName: string): void {
  if (value.lte(0)) {
    throw new Error(`${fieldName} must be positive`)
  }
}

/**
 * Formats a Decimal as a US currency string
 */
export function formatCurrency(value: Decimal): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value.toNumber())
}

/**
 * Formats a Decimal as percentage string
 */
export function formatPercentage(value: Decimal): string {
  return value.toFixed(4) + '%'
}

/**
 * Formats a Decimal as percentage with 2 decimal places
 */
export function formatPercentageShort(value: Decimal): string {
  return value.toFixed(2) + '%'
}
