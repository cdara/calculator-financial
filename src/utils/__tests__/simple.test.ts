import { describe, it, expect } from 'vitest'
import { calculateSimpleInterest } from '../simple'
import type { SimpleInterestInput } from '../../types'

describe('calculateSimpleInterest', () => {
  const createInput = (
    principal: string,
    rate: string,
    time: string
  ): SimpleInterestInput => ({
    principal: { value: principal },
    interestRate: { value: rate },
    time: { value: time },
  })

  it('should calculate simple interest correctly', () => {
    const input = createInput('10000', '5', '3')
    const result = calculateSimpleInterest(input)

    // I = P * r * t = 10000 * 0.05 * 3 = 1500
    expect(result.interest).toBe('1500.00')
    // A = P + I = 10000 + 1500 = 11500
    expect(result.totalAmount).toBe('11500.00')
  })

  it('should handle zero interest rate', () => {
    const input = createInput('10000', '0', '3')
    const result = calculateSimpleInterest(input)

    expect(result.interest).toBe('0.00')
    expect(result.totalAmount).toBe('10000.00')
  })

  it('should handle zero time', () => {
    const input = createInput('10000', '5', '0')
    const result = calculateSimpleInterest(input)

    expect(result.interest).toBe('0.00')
    expect(result.totalAmount).toBe('10000.00')
  })

  it('should handle zero principal', () => {
    const input = createInput('0', '5', '3')
    const result = calculateSimpleInterest(input)

    expect(result.interest).toBe('0.00')
    expect(result.totalAmount).toBe('0.00')
  })

  it('should validate required fields', () => {
    const input = createInput('', '5', '3')
    expect(() => calculateSimpleInterest(input)).toThrow('Principal is required')
  })

  it('should validate negative values', () => {
    const input = createInput('-10000', '5', '3')
    expect(() => calculateSimpleInterest(input)).toThrow('Principal must be non-negative')
  })

  it('should handle decimal rates and time', () => {
    const input = createInput('10000', '7.5', '2.5')
    const result = calculateSimpleInterest(input)

    // I = 10000 * 0.075 * 2.5 = 1875
    expect(result.interest).toBe('1875.00')
    expect(result.totalAmount).toBe('11875.00')
  })

  it('should handle large numbers with precision', () => {
    const input = createInput('1000000', '4.25', '15')
    const result = calculateSimpleInterest(input)

    // I = 1000000 * 0.0425 * 15 = 637500
    expect(result.interest).toBe('637500.00')
    expect(result.totalAmount).toBe('1637500.00')
  })
})
