import { describe, it, expect } from 'vitest'
import { calculateMortgage } from '../mortgage'
import type { MortgageInput } from '../../types'

describe('calculateMortgage', () => {
  const createInput = (
    loanAmount: string,
    interestRate: string,
    loanTerm: string,
    propertyTax: string,
    homeInsurance: string
  ): MortgageInput => ({
    loanAmount: { value: loanAmount },
    interestRate: { value: interestRate },
    loanTerm: { value: loanTerm },
    propertyTax: { value: propertyTax },
    homeInsurance: { value: homeInsurance },
  })

  it('should calculate mortgage payment correctly', () => {
    const input = createInput('300000', '4.5', '30', '3000', '1200')
    const result = calculateMortgage(input)

    expect(result.monthlyPayment).toBeTruthy()
    expect(result.principalAndInterest).toBeTruthy()
    expect(result.totalInterest).toBeTruthy()
    expect(result.totalCost).toBeTruthy()
    expect(result.amortizationSchedule).toHaveLength(360) // 30 years * 12 months
  })

  it('should handle zero interest rate', () => {
    const input = createInput('300000', '0', '30', '3000', '1200')
    const result = calculateMortgage(input)

    // With 0% interest, monthly PI should be loan / total payments
    expect(result.principalAndInterest).toBe('833.33')
  })

  it('should handle zero property tax and insurance', () => {
    const input = createInput('300000', '4.5', '30', '0', '0')
    const result = calculateMortgage(input)

    expect(result.monthlyPayment).toBe(result.principalAndInterest)
  })

  it('should validate required fields', () => {
    const input = createInput('', '4.5', '30', '3000', '1200')
    expect(() => calculateMortgage(input)).toThrow('Loan Amount is required')
  })

  it('should validate positive loan amount', () => {
    const input = createInput('0', '4.5', '30', '3000', '1200')
    expect(() => calculateMortgage(input)).toThrow('Loan Amount must be positive')
  })

  it('should validate positive loan term', () => {
    const input = createInput('300000', '4.5', '0', '3000', '1200')
    expect(() => calculateMortgage(input)).toThrow('Loan Term must be positive')
  })

  it('should validate non-negative tax and insurance', () => {
    const input = createInput('300000', '4.5', '30', '-100', '1200')
    expect(() => calculateMortgage(input)).toThrow('Property Tax must be non-negative')
  })

  it('should generate correct amortization schedule', () => {
    const input = createInput('100000', '5', '1', '0', '0')
    const result = calculateMortgage(input)

    expect(result.amortizationSchedule).toHaveLength(12)
    
    // First month should have highest interest
    const firstMonth = result.amortizationSchedule[0]
    const lastMonth = result.amortizationSchedule[11]
    
    expect(parseFloat(firstMonth.interest)).toBeGreaterThan(parseFloat(lastMonth.interest))
    expect(parseFloat(lastMonth.balance)).toBe(0)
  })

  it('should handle 15-year mortgage', () => {
    const input = createInput('300000', '4.5', '15', '3000', '1200')
    const result = calculateMortgage(input)

    expect(result.amortizationSchedule).toHaveLength(180) // 15 years * 12 months
  })

  it('should calculate total cost correctly', () => {
    const input = createInput('300000', '4.5', '30', '3000', '1200')
    const result = calculateMortgage(input)

    const totalCost = parseFloat(result.totalCost)
    const loanAmount = 300000
    expect(totalCost).toBeGreaterThan(loanAmount)
  })
})
