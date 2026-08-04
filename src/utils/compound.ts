import { Decimal } from './math'
import { 
  validateAndParse, 
  validateNonNegative, 
  validatePositive,
  formatCurrency,
  formatPercentage 
} from './validation'
import type { CompoundInterestInput, CompoundInterestResult } from '../types'

/**
 * Calculates daily compound interest with recurring contributions
 * 
 * Formula: A = P(1 + r/n)^(nt) + PMT * [((1 + r/n)^(nt) - 1) / (r/n)]
 * Where:
 * - A = Final amount
 * - P = Principal
 * - r = Annual interest rate (decimal)
 * - n = Compounding frequency per year
 * - t = Time in years
 * - PMT = Recurring contribution per compounding period
 */
export function calculateCompoundInterest(
  inputs: CompoundInterestInput
): CompoundInterestResult {
  const principal = validateAndParse(inputs.principal.value, 'Principal')
  const annualRate = validateAndParse(inputs.annualRate.value, 'Annual Interest Rate')
  const frequency = validateAndParse(inputs.compoundingFrequency.value, 'Compounding Frequency')
  const duration = validateAndParse(inputs.duration.value, 'Duration')
  const contribution = validateAndParse(inputs.recurringContribution.value, 'Recurring Contribution')

  validateNonNegative(principal, 'Principal')
  validateNonNegative(annualRate, 'Annual Interest Rate')
  validatePositive(frequency, 'Compounding Frequency')
  validatePositive(duration, 'Duration')
  validateNonNegative(contribution, 'Recurring Contribution')

  // Convert annual rate to decimal
  const rateDecimal = annualRate.div(100)
  
  // Calculate number of compounding periods
  const n = frequency
  const t = duration
  const totalPeriods = n.mul(t)

  // Calculate compound factor: (1 + r/n)^(nt)
  const ratePerPeriod = rateDecimal.div(n)
  const compoundFactor = ratePerPeriod.add(1).pow(totalPeriods)

  // Calculate principal growth: P * (1 + r/n)^(nt)
  const principalGrowth = principal.mul(compoundFactor)

  // Calculate contribution growth if there are contributions
  let contributionGrowth = new Decimal(0)
  if (contribution.gt(0)) {
    // PMT * [((1 + r/n)^(nt) - 1) / (r/n)]
    if (ratePerPeriod.eq(0)) {
      contributionGrowth = contribution.mul(totalPeriods)
    } else {
      const numerator = compoundFactor.sub(1)
      const denominator = ratePerPeriod
      contributionGrowth = contribution.mul(numerator.div(denominator))
    }
  }

  // Calculate final balance
  const finalBalance = principalGrowth.add(contributionGrowth)

  // Calculate interest earned
  const totalContributions = contribution.mul(totalPeriods)
  const interestEarned = finalBalance.sub(principal).sub(totalContributions)

  // Calculate effective annual rate: (1 + r/n)^n - 1
  let effectiveAnnualRate = new Decimal(0)
  if (ratePerPeriod.gt(0)) {
    effectiveAnnualRate = ratePerPeriod.add(1).pow(n).sub(1).mul(100)
  }

  return {
    finalBalance: formatCurrency(finalBalance),
    interestEarned: formatCurrency(interestEarned),
    effectiveAnnualRate: formatPercentage(effectiveAnnualRate),
  }
}
