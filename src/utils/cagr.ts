import { Decimal } from './math'
import { 
  validateAndParse, 
  validatePositive,
  formatPercentageShort 
} from './validation'
import type { CAGRInput, CAGRResult } from '../types'

/**
 * Calculates Compound Annual Growth Rate (CAGR)
 * 
 * Formula: CAGR = (Ending Value / Beginning Value)^(1 / Years) - 1
 * 
 * Where:
 * - CAGR is expressed as a percentage
 * - Beginning Value and Ending Value must be positive
 * - Years must be positive
 */
export function calculateCAGR(
  inputs: CAGRInput
): CAGRResult {
  const beginningValue = validateAndParse(inputs.beginningValue.value, 'Beginning Value')
  const endingValue = validateAndParse(inputs.endingValue.value, 'Ending Value')
  const years = validateAndParse(inputs.years.value, 'Years')

  validatePositive(beginningValue, 'Beginning Value')
  validatePositive(endingValue, 'Ending Value')
  validatePositive(years, 'Years')

  // Calculate ratio: Ending Value / Beginning Value
  const ratio = endingValue.div(beginningValue)

  // Calculate exponent: 1 / Years
  const exponent = new Decimal(1).div(years)

  // Calculate CAGR: ratio^(1/years) - 1
  const cagrDecimal = ratio.pow(exponent).sub(1)

  // Convert to percentage
  const cagrPercentage = cagrDecimal.mul(100)

  return {
    cagr: formatPercentageShort(cagrPercentage),
  }
}
