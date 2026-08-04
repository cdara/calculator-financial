import { 
  validateAndParse, 
  validateNonNegative,
  formatCurrency 
} from './validation'
import type { SimpleInterestInput, SimpleInterestResult } from '../types'

/**
 * Calculates simple interest
 * 
 * Formula: I = P * r * t
 * A = P + I
 * Where:
 * - I = Interest
 * - P = Principal
 * - r = Annual interest rate (decimal)
 * - t = Time in years
 * - A = Total amount
 */
export function calculateSimpleInterest(
  inputs: SimpleInterestInput
): SimpleInterestResult {
  const principal = validateAndParse(inputs.principal.value, 'Principal')
  const rate = validateAndParse(inputs.interestRate.value, 'Interest Rate')
  const time = validateAndParse(inputs.time.value, 'Time')

  validateNonNegative(principal, 'Principal')
  validateNonNegative(rate, 'Interest Rate')
  validateNonNegative(time, 'Time')

  // Convert rate to decimal
  const rateDecimal = rate.div(100)

  // Calculate interest: I = P * r * t
  const interest = principal.mul(rateDecimal).mul(time)

  // Calculate total amount: A = P + I
  const totalAmount = principal.add(interest)

  return {
    interest: formatCurrency(interest),
    totalAmount: formatCurrency(totalAmount),
  }
}
