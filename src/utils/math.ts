import Decimal from 'decimal.js'

// Configure Decimal.js globally for financial calculations
// Precision = 20, Rounding = ROUND_HALF_UP as per PRD
Decimal.set({
  precision: 20,
  rounding: Decimal.ROUND_HALF_UP,
})

export { Decimal }
