import { describe, it, expect } from 'vitest'
import { solveTVM } from '../tvm'
import type { TVMInput } from '../../types'

describe('solveTVM', () => {
  const createInput = (
    pv: string,
    fv: string,
    pmt: string,
    iy: string,
    n: string
  ): TVMInput => ({
    pv: { value: pv },
    fv: { value: fv },
    pmt: { value: pmt },
    iy: { value: iy },
    n: { value: n },
  })

  it('should solve for PV', () => {
    const input = createInput('', '10000', '-100', '5', '10')
    const result = solveTVM(input, 'pv')

    expect((result as any).pv).toBeTruthy()
    expect(parseFloat((result as any).pv!)).toBeLessThan(0) // PV should be negative (outflow)
  })

  it('should solve for FV', () => {
    const input = createInput('-1000', '', '-100', '5', '10')
    const result = solveTVM(input, 'fv')

    expect((result as any).fv).toBeTruthy()
  })

  it('should solve for PMT', () => {
    const input = createInput('-1000', '10000', '', '5', '10')
    const result = solveTVM(input, 'pmt')

    expect((result as any).pmt).toBeTruthy()
  })

  it('should solve for I/Y', () => {
    const input = createInput('-1000', '10000', '-100', '', '10')
    const result = solveTVM(input, 'iy')

    expect((result as any).iy).toBeTruthy()
    expect((result as any).iy).toContain('%')
  })

  it('should solve for N', () => {
    const input = createInput('-1000', '10000', '-100', '5', '')
    const result = solveTVM(input, 'n')

    expect((result as any).n).toBeTruthy()
  })

  it('should require exactly 4 values', () => {
    const input = createInput('', '10000', '', '5', '')
    expect(() => solveTVM(input, 'pv')).toThrow(
      'Exactly 4 values must be provided'
    )
  })

  it('should require all 4 values for solving', () => {
    const input = createInput('', '10000', '', '5', '10')
    expect(() => solveTVM(input, 'pv')).toThrow(
      'Exactly 4 values must be provided'
    )
  })

  it('should not allow solving for provided variable', () => {
    const input = createInput('-1000', '10000', '-100', '5', '10')
    expect(() => solveTVM(input, 'pv')).toThrow(
      'Cannot solve for PV when it is already provided'
    )
  })

  it('should handle zero interest rate when solving for PV', () => {
    const input = createInput('', '10000', '-100', '0', '10')
    const result = solveTVM(input, 'pv')

    expect((result as any).pv).toBeTruthy()
  })

  it('should handle zero interest rate when solving for FV', () => {
    const input = createInput('-1000', '', '-100', '0', '10')
    const result = solveTVM(input, 'fv')

    expect((result as any).fv).toBeTruthy()
  })

  it('should handle zero interest rate when solving for PMT', () => {
    const input = createInput('-1000', '10000', '', '0', '10')
    const result = solveTVM(input, 'pmt')

    expect((result as any).pmt).toBeTruthy()
  })

  it('should handle simple case: no PMT, solve for FV', () => {
    const input = createInput('-1000', '', '0', '5', '10')
    const result = solveTVM(input, 'fv')

    expect((result as any).fv).toBeTruthy()
    // FV should be PV * (1 + r)^n = -1000 * (1.05)^10 ≈ 1628.89 (positive inflow)
    const fv = parseFloat((result as any).fv!)
    expect(fv).toBeCloseTo(1628.89, 0)
  })

  it('should handle simple case: no PMT, solve for PV', () => {
    const input = createInput('', '10000', '0', '5', '10')
    const result = solveTVM(input, 'pv')

    expect((result as any).pv).toBeTruthy()
    // PV should be FV / (1 + r)^n = 10000 / (1.05)^10 ≈ -6139.13 (negative outflow)
    const pv = parseFloat((result as any).pv!)
    expect(pv).toBeCloseTo(-6139.13, 0)
  })

  it('should validate required fields for each solve type', () => {
    expect(() => solveTVM(createInput('', '10000', '', '5', '10'), 'pv')).toThrow()
    expect(() => solveTVM(createInput('-1000', '', '', '5', '10'), 'fv')).toThrow()
    expect(() => solveTVM(createInput('', '10000', '-100', '', '10'), 'pmt')).toThrow()
    expect(() => solveTVM(createInput('', '10000', '-100', '5', ''), 'iy')).toThrow()
    expect(() => solveTVM(createInput('', '10000', '-100', '5', '10'), 'n')).toThrow()
  })
})
