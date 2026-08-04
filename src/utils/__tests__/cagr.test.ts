import { describe, it, expect } from 'vitest'
import { calculateCAGR } from '../cagr'
import type { CAGRInput } from '../../types'

describe('calculateCAGR', () => {
  const createInput = (
    beginningValue: string,
    endingValue: string,
    years: string
  ): CAGRInput => ({
    beginningValue: { value: beginningValue },
    endingValue: { value: endingValue },
    years: { value: years },
  })

  it('should calculate CAGR correctly', () => {
    const input = createInput('1000', '2000', '10')
    const result = calculateCAGR(input)

    // CAGR = (2000/1000)^(1/10) - 1 = 2^0.1 - 1 ≈ 0.0718 = 7.18%
    expect(result.cagr).toBeTruthy()
    const cagr = parseFloat(result.cagr)
    expect(cagr).toBeCloseTo(7.18, 1)
  })

  it('should handle doubling in different timeframes', () => {
    const input = createInput('1000', '2000', '5')
    const result = calculateCAGR(input)

    // CAGR = (2000/1000)^(1/5) - 1 = 2^0.2 - 1 ≈ 0.1487 = 14.87%
    const cagr = parseFloat(result.cagr)
    expect(cagr).toBeCloseTo(14.87, 1)
  })

  it('should handle no growth', () => {
    const input = createInput('1000', '1000', '10')
    const result = calculateCAGR(input)

    // CAGR = (1000/1000)^(1/10) - 1 = 1^0.1 - 1 = 0
    expect(result.cagr).toBe('0.00%')
  })

  it('should handle growth loss', () => {
    const input = createInput('2000', '1000', '10')
    const result = calculateCAGR(input)

    // CAGR = (1000/2000)^(1/10) - 1 = 0.5^0.1 - 1 ≈ -0.067 = -6.7%
    const cagr = parseFloat(result.cagr)
    expect(cagr).toBeLessThan(0)
  })

  it('should validate required fields', () => {
    const input = createInput('', '2000', '10')
    expect(() => calculateCAGR(input)).toThrow('Beginning Value is required')
  })

  it('should validate positive beginning value', () => {
    const input = createInput('0', '2000', '10')
    expect(() => calculateCAGR(input)).toThrow('Beginning Value must be positive')

    const input2 = createInput('-1000', '2000', '10')
    expect(() => calculateCAGR(input2)).toThrow('Beginning Value must be positive')
  })

  it('should validate positive ending value', () => {
    const input = createInput('1000', '0', '10')
    expect(() => calculateCAGR(input)).toThrow('Ending Value must be positive')

    const input2 = createInput('1000', '-2000', '10')
    expect(() => calculateCAGR(input2)).toThrow('Ending Value must be positive')
  })

  it('should validate positive years', () => {
    const input = createInput('1000', '2000', '0')
    expect(() => calculateCAGR(input)).toThrow('Years must be positive')

    const input2 = createInput('1000', '2000', '-5')
    expect(() => calculateCAGR(input2)).toThrow('Years must be positive')
  })

  it('should handle large numbers', () => {
    const input = createInput('1000000', '5000000', '20')
    const result = calculateCAGR(input)

    // CAGR = (5000000/1000000)^(1/20) - 1 = 5^0.05 - 1 ≈ 0.0838 = 8.38%
    expect(result.cagr).toBeTruthy()
    const cagr = parseFloat(result.cagr)
    expect(cagr).toBeGreaterThan(0)
    expect(cagr).toBeLessThan(10)
  })

  it('should handle decimal years', () => {
    const input = createInput('1000', '1500', '2.5')
    const result = calculateCAGR(input)

    // CAGR = (1500/1000)^(1/2.5) - 1 = 1.5^0.4 - 1 ≈ 0.175 = 17.5%
    expect(result.cagr).toBeTruthy()
    const cagr = parseFloat(result.cagr)
    expect(cagr).toBeGreaterThan(0)
  })

  it('should handle very high growth', () => {
    const input = createInput('100', '10000', '5')
    const result = calculateCAGR(input)

    // CAGR = (10000/100)^(1/5) - 1 = 100^0.2 - 1 ≈ 1.58 = 158%
    expect(result.cagr).toBeTruthy()
    const cagr = parseFloat(result.cagr)
    expect(cagr).toBeGreaterThan(100)
  })
})
