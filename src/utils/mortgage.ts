import { Decimal } from './math'
import { 
  validateAndParse, 
  validateNonNegative, 
  validatePositive,
  formatCurrency 
} from './validation'
import type { MortgageInput, MortgageResult, AmortizationEntry } from '../types'

/**
 * Calculates mortgage payment and amortization schedule
 * 
 * Monthly payment formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
 * Where:
 * - M = Monthly payment
 * - P = Principal (loan amount)
 * - r = Monthly interest rate (decimal)
 * - n = Total number of payments
 */
export function calculateMortgage(
  inputs: MortgageInput
): MortgageResult {
  const loanAmount = validateAndParse(inputs.loanAmount.value, 'Loan Amount')
  const annualRate = validateAndParse(inputs.interestRate.value, 'Interest Rate')
  const loanTerm = validateAndParse(inputs.loanTerm.value, 'Loan Term')
  const propertyTax = validateAndParse(inputs.propertyTax.value, 'Property Tax')
  const homeInsurance = validateAndParse(inputs.homeInsurance.value, 'Home Insurance')

  validatePositive(loanAmount, 'Loan Amount')
  validateNonNegative(annualRate, 'Interest Rate')
  validatePositive(loanTerm, 'Loan Term')
  validateNonNegative(propertyTax, 'Property Tax')
  validateNonNegative(homeInsurance, 'Home Insurance')

  // Convert annual rate to monthly rate (decimal)
  const monthlyRate = annualRate.div(100).div(12)
  
  // Calculate total number of payments
  const totalPayments = loanTerm.mul(12)

  // Calculate monthly principal and interest payment
  let monthlyPI = new Decimal(0)
  if (monthlyRate.eq(0)) {
    // If rate is 0, payment is just principal divided by number of payments
    monthlyPI = loanAmount.div(totalPayments)
  } else {
    // M = P * [r(1+r)^n] / [(1+r)^n - 1]
    const ratePlusOne = monthlyRate.add(1)
    const numerator = ratePlusOne.pow(totalPayments).mul(monthlyRate)
    const denominator = ratePlusOne.pow(totalPayments).sub(1)
    monthlyPI = loanAmount.mul(numerator.div(denominator))
  }

  // Calculate monthly property tax and insurance
  const monthlyTax = propertyTax.div(12)
  const monthlyInsurance = homeInsurance.div(12)

  // Calculate total monthly payment
  const monthlyPayment = monthlyPI.add(monthlyTax).add(monthlyInsurance)

  // Calculate total interest over life of loan
  const totalPrincipalAndInterest = monthlyPI.mul(totalPayments)
  const totalInterest = totalPrincipalAndInterest.sub(loanAmount)

  // Calculate total cost of loan
  const totalTax = propertyTax.mul(loanTerm)
  const totalInsurance = homeInsurance.mul(loanTerm)
  const totalCost = loanAmount.add(totalInterest).add(totalTax).add(totalInsurance)

  // Generate amortization schedule
  const amortizationSchedule = generateAmortizationSchedule(
    loanAmount,
    monthlyRate,
    monthlyPI,
    totalPayments
  )

  return {
    monthlyPayment: formatCurrency(monthlyPayment),
    principalAndInterest: formatCurrency(monthlyPI),
    totalInterest: formatCurrency(totalInterest),
    totalCost: formatCurrency(totalCost),
    amortizationSchedule,
  }
}

/**
 * Generates amortization schedule
 */
function generateAmortizationSchedule(
  principal: Decimal,
  monthlyRate: Decimal,
  monthlyPayment: Decimal,
  totalPayments: Decimal
): AmortizationEntry[] {
  const schedule: AmortizationEntry[] = []
  let balance = principal

  for (let i = 1; i <= totalPayments.toNumber(); i++) {
    const payment = monthlyPayment
    
    // Calculate interest portion
    const interest = balance.mul(monthlyRate)
    
    // Calculate principal portion
    const principalPortion = payment.sub(interest)
    
    // Update balance
    balance = balance.sub(principalPortion)
    
    // Ensure balance doesn't go negative due to rounding
    if (balance.lt(0)) {
      balance = new Decimal(0)
    }

    schedule.push({
      month: i,
      payment: formatCurrency(payment),
      principal: formatCurrency(principalPortion),
      interest: formatCurrency(interest),
      balance: formatCurrency(balance),
    })
  }

  return schedule
}
