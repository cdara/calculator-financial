import { describe, it, expect } from 'vitest'
import {
  validateAndParse,
  validateNonNegative,
  validatePositive,
  formatCurrency,
  formatPercentage,
  formatPercentageShort,
} from '../validation'
import { Decimal } from '../math'

describe('validation', () => {
  describe('validateAndParse', () => {
    it('should parse valid numeric strings', () => {
      expect(validateAndParse('100', 'Test')).toEqual(new Decimal(100))
      expect(validateAndParse('100.50', 'Test')).toEqual(new Decimal('100.50'))
      expect(validateAndParse('-50', 'Test')).toEqual(new Decimal(-50))
      expect(validateAndParse('0', 'Test')).toEqual(new Decimal(0))
    })

    it('should throw error for empty string', () => {
      expect(() => validateAndParse('', 'Test')).toThrow('Test is required')
      expect(() => validateAndParse('   ', 'Test')).toThrow('Test is required')
    })

    it('should throw error for invalid strings', () => {
      expect(() => validateAndParse('abc', 'Test')).toThrow('must be a valid number')
      expect(() => validateAndParse('-', 'Test')).toThrow('must be a valid number')
      expect(() => validateAndParse('.', 'Test')).toThrow('must be a valid number')
    })

    it('should handle whitespace', () => {
      expect(validateAndParse('  100  ', 'Test')).toEqual(new Decimal(100))
    })
  })

  describe('validateNonNegative', () => {
    it('should allow zero and positive values', () => {
      expect(() => validateNonNegative(new Decimal(0), 'Test')).not.toThrow()
      expect(() => validateNonNegative(new Decimal(100), 'Test')).not.toThrow()
    })

    it('should throw error for negative values', () => {
      expect(() => validateNonNegative(new Decimal(-1), 'Test')).toThrow(
        'Test must be non-negative'
      )
    })
  })

  describe('validatePositive', () => {
    it('should allow positive values', () => {
      expect(() => validatePositive(new Decimal(1), 'Test')).not.toThrow()
      expect(() => validatePositive(new Decimal(100), 'Test')).not.toThrow()
    })

    it('should throw error for zero', () => {
      expect(() => validatePositive(new Decimal(0), 'Test')).toThrow(
        'Test must be positive'
      )
    })

    it('should throw error for negative values', () => {
      expect(() => validatePositive(new Decimal(-1), 'Test')).toThrow(
        'Test must be positive'
      )
    })
  })

  describe('formatCurrency', () => {
    it('should format as currency with 2 decimal places', () => {
      expect(formatCurrency(new Decimal(100))).toBe('100.00')
      expect(formatCurrency(new Decimal('100.50'))).toBe('100.50')
      expect(formatCurrency(new Decimal('100.567'))).toBe('100.57')
      expect(formatCurrency(new Decimal('100.564'))).toBe('100.56')
    })
  })

  describe('formatPercentage', () => {
    it('should format as percentage with 4 decimal places', () => {
      expect(formatPercentage(new Decimal(10))).toBe('10.0000%')
      expect(formatPercentage(new Decimal('10.5678'))).toBe('10.5678%')
      expect(formatPercentage(new Decimal('0.5'))).toBe('0.5000%')
    })
  })

  describe('formatPercentageShort', () => {
    it('should format as percentage with 2 decimal places', () => {
      expect(formatPercentageShort(new Decimal(10))).toBe('10.00%')
      expect(formatPercentageShort(new Decimal('10.5678'))).toBe('10.57%')
      expect(formatPercentageShort(new Decimal('0.5'))).toBe('0.50%')
    })
  })
})
