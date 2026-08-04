// Common financial types used across the application

export interface CalculatorInput {
  value: string
  error?: string
}

export interface CompoundInterestInput {
  principal: CalculatorInput
  annualRate: CalculatorInput
  compoundingFrequency: CalculatorInput
  duration: CalculatorInput
  recurringContribution: CalculatorInput
}

export interface CompoundInterestResult {
  finalBalance: string
  interestEarned: string
  effectiveAnnualRate: string
}

export interface SimpleInterestInput {
  principal: CalculatorInput
  interestRate: CalculatorInput
  time: CalculatorInput
}

export interface SimpleInterestResult {
  interest: string
  totalAmount: string
}

export interface MortgageInput {
  loanAmount: CalculatorInput
  interestRate: CalculatorInput
  loanTerm: CalculatorInput
  propertyTax: CalculatorInput
  homeInsurance: CalculatorInput
}

export interface MortgageResult {
  monthlyPayment: string
  principalAndInterest: string
  totalInterest: string
  totalCost: string
  amortizationSchedule: AmortizationEntry[]
}

export interface AmortizationEntry {
  month: number
  payment: string
  principal: string
  interest: string
  balance: string
}

export interface TVMInput {
  pv: CalculatorInput
  fv: CalculatorInput
  pmt: CalculatorInput
  iy: CalculatorInput
  n: CalculatorInput
}

export type TVMVariable = 'pv' | 'fv' | 'pmt' | 'iy' | 'n'

export type TVMResult = {
  [K in TVMVariable]?: string
}

export interface CAGRInput {
  beginningValue: CalculatorInput
  endingValue: CalculatorInput
  years: CalculatorInput
}

export interface CAGRResult {
  cagr: string
}
