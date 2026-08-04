import { describe, it, expect } from 'vitest'
import { calculateCompoundInterest } from '../compound'
import type { CompoundInterestInput } from '../../types'

describe('calculateCompoundInterest', () => {
  const createInput = (
    principal: string,
    annualRate: string,
    frequency: string,
    duration: string,
    contribution: string
  ): CompoundInterestInput => ({
    principal: { value: principal },
    annualRate: { value: annualRate },
    compoundingFrequency: { value: frequency },
    duration: { value: duration },
    recurringContribution: { value: contribution },
  })

  it('should calculate compound interest correctly', () => {
    const input = createInput('10000', '5', '12', '10', '0')
    const result = calculateCompoundInterest(input)

    expect(result.finalBalance).toBeTruthy()
    expect(result.interestEarned).toBeTruthy()
    expect(result.effectiveAnnualRate).toBeTruthy()
  })

  it('should handle zero interest rate', () => {
    const input = createInput('10000', '0', '12', '10', '0')
    const result = calculateCompoundInterest(input)

    expect(result.finalBalance).toBe('10000.00')
    expect(result.interestEarned).toBe('0.00')
  })

  it('should handle recurring contributions', () => {
    const input = createInput('10000', '5', '12', '10', '500')
    const result = calculateCompoundInterest(input)

    expect(result.finalBalance).toBeTruthy()
    expect(parseFloat(result.finalBalance)).toBeGreaterThan(10000)
  })

  it('should handle zero principal with contributions', () => {
    const input = createInput('0', '5', '12', '10', '500')
    const result = calculateCompoundInterest(input)

    expect(result.finalBalance).toBeTruthy()
    expect(parseFloat(result.finalBalance)).toBeGreaterThan(0)
  })

  it('should validate required fields', () => {
    const input = createInput('', '5', '12', '10', '0')
    expect(() => calculateCompoundInterest(input)).toThrow('Principal is required')
  })

  it('should validate negative values', () => {
    const input = createInput('-10000', '5', '12', '10', '0')
    expect(() => calculateCompoundInterest(input)).toThrow('Principal must be non-negative')
  })

  it('should validate positive frequency and duration', () => {
    const input = createInput('10000', '5', '0', '10', '0')
    expect(() => calculateCompoundInterest(input)).toThrow('Compounding Frequency must be positive')

    const input2 = createInput('10000', '5', '12', '0', '0')
    expect(() => calculateCompoundInterest(input2)).toThrow('Duration must be positive')
  })

  it('should handle large numbers with precision', () => {
    const input = createInput('1000000', '7.5', '365', '30', '10000')
    const result = calculateCompoundInterest(input)

    expect(result.finalBalance).toBeTruthy()
    expect(parseFloat(result.finalBalance)).toBeGreaterThan(1000000)
  })

  it('should calculate effective annual rate correctly', () => {
    const input = createInput('10000', '5', '12', '10', '0')
    const result = calculateCompoundInterest(input)

    // EAR should be slightly higher than nominal rate due to compounding
    const ear = parseFloat(result.effectiveAnnualRate)
    expect(ear).toBeGreaterThan(5)
    expect(ear).toBeLessThan(6)
  })
})
