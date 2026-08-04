import { Decimal } from './math'
import { 
  validateAndParse, 
  formatCurrency,
  formatPercentage 
} from './validation'
import type { TVMInput, TVMVariable, TVMResult } from '../types'

/**
 * Time Value of Money (TVM) Solver
 * 
 * Basic TVM formula: PV + PMT * [1 - (1 + r)^(-n)] / r + FV / (1 + r)^n = 0
 * 
 * Can solve for any one variable given the other four:
 * - PV: Present Value
 * - FV: Future Value
 * - PMT: Payment per period
 * - I/Y: Interest rate per period (as percentage)
 * - N: Number of periods
 */

export function solveTVM(
  inputs: TVMInput,
  solveFor: TVMVariable
): TVMResult {
  // Validate that the variable to solve for is not provided
  const solveForInput = inputs[solveFor]
  if (solveForInput.value && solveForInput.value.trim() !== '') {
    throw new Error(`Cannot solve for ${solveFor.toUpperCase()} when it is already provided`)
  }

  // Count how many values are provided
  const providedCount = Object.values(inputs).filter(
    input => input.value && input.value.trim() !== ''
  ).length

  if (providedCount !== 4) {
    throw new Error('Exactly 4 values must be provided to solve for the 5th')
  }

  // Parse provided values
  const pv = inputs.pv.value ? validateAndParse(inputs.pv.value, 'PV') : null
  const fv = inputs.fv.value ? validateAndParse(inputs.fv.value, 'FV') : null
  const pmt = inputs.pmt.value ? validateAndParse(inputs.pmt.value, 'PMT') : null
  const iy = inputs.iy.value ? validateAndParse(inputs.iy.value, 'I/Y') : null
  const n = inputs.n.value ? validateAndParse(inputs.n.value, 'N') : null

  // Convert interest rate to decimal if provided
  const rate = iy ? iy.div(100) : null

  let result: TVMResult = {}

  switch (solveFor) {
    case 'pv':
      if (!fv || !pmt || !rate || !n) {
        throw new Error('FV, PMT, I/Y, and N must be provided to solve for PV')
      }
      result.pv = solvePV(fv, pmt, rate, n)
      break

    case 'fv':
      if (!pv || !pmt || !rate || !n) {
        throw new Error('PV, PMT, I/Y, and N must be provided to solve for FV')
      }
      result.fv = solveFV(pv, pmt, rate, n)
      break

    case 'pmt':
      if (!pv || !fv || !rate || !n) {
        throw new Error('PV, FV, I/Y, and N must be provided to solve for PMT')
      }
      result.pmt = solvePMT(pv, fv, rate, n)
      break

    case 'iy':
      if (!pv || !fv || !pmt || !n) {
        throw new Error('PV, FV, PMT, and N must be provided to solve for I/Y')
      }
      result.iy = solveIY(pv, fv, pmt, n)
      break

    case 'n':
      if (!pv || !fv || !pmt || !rate) {
        throw new Error('PV, FV, PMT, and I/Y must be provided to solve for N')
      }
      result.n = solveN(pv, fv, pmt, rate)
      break
  }

  return result
}

/**
 * Solves for Present Value (PV)
 * PV = -[FV / (1 + r)^n + PMT * (1 - (1 + r)^(-n)) / r]
 */
function solvePV(
  fv: Decimal,
  pmt: Decimal,
  rate: Decimal,
  n: Decimal
): string {
  const ratePlusOne = rate.add(1)
  const ratePlusOnePowN = ratePlusOne.pow(n)
  
  // FV portion: FV / (1 + r)^n
  const fvPortion = fv.div(ratePlusOnePowN)
  
  // PMT portion: PMT * (1 - (1 + r)^(-n)) / r
  let pmtPortion = new Decimal(0)
  if (rate.eq(0)) {
    pmtPortion = pmt.mul(n)
  } else {
    const oneMinusRatePowMinusN = new Decimal(1).sub(ratePlusOnePowN.pow(-1))
    pmtPortion = pmt.mul(oneMinusRatePowMinusN).div(rate)
  }
  
  const pv = fvPortion.add(pmtPortion).neg()
  return formatCurrency(pv)
}

/**
 * Solves for Future Value (FV)
 * FV = -[PV * (1 + r)^n + PMT * ((1 + r)^n - 1) / r]
 */
function solveFV(
  pv: Decimal,
  pmt: Decimal,
  rate: Decimal,
  n: Decimal
): string {
  const ratePlusOne = rate.add(1)
  const ratePlusOnePowN = ratePlusOne.pow(n)
  
  // PV portion: PV * (1 + r)^n
  const pvPortion = pv.mul(ratePlusOnePowN)
  
  // PMT portion: PMT * ((1 + r)^n - 1) / r
  let pmtPortion = new Decimal(0)
  if (rate.eq(0)) {
    pmtPortion = pmt.mul(n)
  } else {
    const ratePlusOnePowNMinusOne = ratePlusOnePowN.sub(1)
    pmtPortion = pmt.mul(ratePlusOnePowNMinusOne).div(rate)
  }
  
  const fv = pvPortion.add(pmtPortion).neg()
  return formatCurrency(fv)
}

/**
 * Solves for Payment (PMT)
 * PMT = -[PV * r * (1 + r)^n + FV * r] / [(1 + r)^n - 1]
 */
function solvePMT(
  pv: Decimal,
  fv: Decimal,
  rate: Decimal,
  n: Decimal
): string {
  const ratePlusOne = rate.add(1)
  const ratePlusOnePowN = ratePlusOne.pow(n)
  
  let pmt = new Decimal(0)
  
  if (rate.eq(0)) {
    // If rate is 0, PMT = -(PV + FV) / n
    pmt = pv.add(fv).div(n).neg()
  } else {
    // Numerator: PV * r * (1 + r)^n + FV * r
    const numerator = pv.mul(rate).mul(ratePlusOnePowN).add(fv.mul(rate))
    
    // Denominator: (1 + r)^n - 1
    const denominator = ratePlusOnePowN.sub(1)
    
    pmt = numerator.div(denominator).neg()
  }
  
  return formatCurrency(pmt)
}

/**
 * Solves for Interest Rate (I/Y) using Newton-Raphson method
 * This requires numerical iteration as there's no closed-form solution
 */
function solveIY(
  pv: Decimal,
  fv: Decimal,
  pmt: Decimal,
  n: Decimal
): string {
  // Newton-Raphson iteration
  let rate = new Decimal(0.1) // Initial guess: 10%
  const maxIterations = 100
  const tolerance = new Decimal(1e-10)
  
  for (let i = 0; i < maxIterations; i++) {
    const f = tvmFunction(pv, fv, pmt, n, rate)
    const fp = tvmDerivative(pv, pmt, n, rate)
    
    if (fp.abs().lt(tolerance)) {
      break // Avoid division by zero
    }
    
    const newRate = rate.sub(f.div(fp))
    
    if (newRate.sub(rate).abs().lt(tolerance)) {
      rate = newRate
      break
    }
    
    rate = newRate
  }
  
  // Convert to percentage
  return formatPercentage(rate.mul(100))
}

/**
 * Solves for Number of Periods (N) using logarithms
 * When PMT = 0: N = ln(FV/PV) / ln(1 + r)
 * When PMT ≠ 0: Requires numerical solution
 */
function solveN(
  pv: Decimal,
  fv: Decimal,
  pmt: Decimal,
  rate: Decimal
): string {
  if (pmt.eq(0)) {
    // Simple case: N = ln(FV/PV) / ln(1 + r)
    if (rate.eq(0)) {
      throw new Error('Cannot solve for N when both PMT and rate are 0')
    }
    
    const ratePlusOne = rate.add(1)
    const ratio = fv.div(pv).neg()
    
    if (ratio.lte(0)) {
      throw new Error('Invalid values for solving N')
    }
    
    const logRatio = ratio.ln()
    const logRatePlusOne = ratePlusOne.ln()
    
    const n = logRatio.div(logRatePlusOne)
    return n.toFixed(2)
  } else {
    // Complex case: requires numerical solution
    return solveNNumerical(pv, fv, pmt, rate)
  }
}

/**
 * TVM function for Newton-Raphson: f(r) = PV + PMT * [1 - (1+r)^(-n)]/r + FV/(1+r)^n
 */
function tvmFunction(
  pv: Decimal,
  fv: Decimal,
  pmt: Decimal,
  n: Decimal,
  rate: Decimal
): Decimal {
  const ratePlusOne = rate.add(1)
  const ratePlusOnePowN = ratePlusOne.pow(n)
  
  // PV term
  const pvTerm = pv
  
  // PMT term: PMT * [1 - (1+r)^(-n)]/r
  let pmtTerm = new Decimal(0)
  if (rate.eq(0)) {
    pmtTerm = pmt.mul(n)
  } else {
    const oneMinusRatePowMinusN = new Decimal(1).sub(ratePlusOnePowN.pow(-1))
    pmtTerm = pmt.mul(oneMinusRatePowMinusN).div(rate)
  }
  
  // FV term: FV/(1+r)^n
  const fvTerm = fv.div(ratePlusOnePowN)
  
  return pvTerm.add(pmtTerm).add(fvTerm)
}

/**
 * Derivative of TVM function with respect to rate
 */
function tvmDerivative(
  pv: Decimal,
  pmt: Decimal,
  n: Decimal,
  rate: Decimal
): Decimal {
  if (rate.eq(0)) {
    // Use limit as rate approaches 0
    return pmt.mul(n).mul(n.add(1)).div(2).neg()
  }
  
  // Derivative is complex, using approximation
  const h = new Decimal(0.0001)
  const f1 = tvmFunction(pv, new Decimal(0), pmt, n, rate.add(h))
  const f2 = tvmFunction(pv, new Decimal(0), pmt, n, rate.sub(h))
  
  return f1.sub(f2).div(h.mul(2))
}

/**
 * Numerical solution for N when PMT ≠ 0
 */
function solveNNumerical(
  pv: Decimal,
  fv: Decimal,
  pmt: Decimal,
  rate: Decimal
): string {
  if (rate.eq(0)) {
    // When rate is 0: N = -(PV + FV) / PMT
    const n = pv.add(fv).div(pmt).neg()
    return n.toFixed(2)
  }
  
  // Binary search for N
  let low = new Decimal(0)
  let high = new Decimal(1000)
  const tolerance = new Decimal(0.01)
  
  for (let i = 0; i < 100; i++) {
    const mid = low.add(high).div(2)
    const f = tvmFunction(pv, fv, pmt, mid, rate)
    
    if (f.abs().lt(tolerance)) {
      return mid.toFixed(2)
    }
    
    if (f.gt(0)) {
      low = mid
    } else {
      high = mid
    }
  }
  
  return low.add(high).div(2).toFixed(2)
}
