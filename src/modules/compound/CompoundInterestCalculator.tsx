import React from 'react'
import { Card, CardHeader, CardTitle, CardContent, Input, Button } from '../../components/ui'
import { useCalculatorState } from '../../hooks'
import { calculateCompoundInterest } from '../../utils'
import type { CompoundInterestInput, CompoundInterestResult } from '../../types'

const initialState: CompoundInterestInput = {
  principal: { value: '' },
  annualRate: { value: '' },
  compoundingFrequency: { value: '12' },
  duration: { value: '' },
  recurringContribution: { value: '0' },
}

export const CompoundInterestCalculator: React.FC = () => {
  const { state, updateField, setErrors, clearErrors } = useCalculatorState(initialState)
  const [result, setResult] = React.useState<CompoundInterestResult | null>(null)

  const handleCalculate = () => {
    clearErrors()
    try {
      const calculationResult = calculateCompoundInterest(state)
      setResult(calculationResult)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Calculation failed'
      if (errorMessage.includes('Principal')) {
        setErrors({ principal: errorMessage })
      } else if (errorMessage.includes('Annual Interest Rate')) {
        setErrors({ annualRate: errorMessage })
      } else if (errorMessage.includes('Compounding Frequency')) {
        setErrors({ compoundingFrequency: errorMessage })
      } else if (errorMessage.includes('Duration')) {
        setErrors({ duration: errorMessage })
      } else if (errorMessage.includes('Recurring Contribution')) {
        setErrors({ recurringContribution: errorMessage })
      } else {
        alert(errorMessage)
      }
    }
  }

  const handleReset = () => {
    setResult(null)
    clearErrors()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Compound Interest Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            label="Principal Amount (USD)"
            type="number"
            step="0.01"
            value={state.principal.value}
            error={state.principal.error}
            onChange={(e) => updateField('principal', e.target.value)}
          />

          <Input
            label="Annual Interest Rate (%)"
            type="number"
            step="0.01"
            value={state.annualRate.value}
            error={state.annualRate.error}
            onChange={(e) => updateField('annualRate', e.target.value)}
          />

          <Input
            label="Compounding Frequency (times/year)"
            type="number"
            step="1"
            value={state.compoundingFrequency.value}
            error={state.compoundingFrequency.error}
            onChange={(e) => updateField('compoundingFrequency', e.target.value)}
          />

          <Input
            label="Investment Duration (years)"
            type="number"
            step="0.1"
            value={state.duration.value}
            error={state.duration.error}
            onChange={(e) => updateField('duration', e.target.value)}
          />

          <Input
            label="Recurring Contribution (USD/period)"
            type="number"
            step="0.01"
            value={state.recurringContribution.value}
            error={state.recurringContribution.error}
            onChange={(e) => updateField('recurringContribution', e.target.value)}
          />

          <div className="flex space-x-3 pt-4">
            <Button onClick={handleCalculate} className="flex-1">
              Calculate
            </Button>
            <Button onClick={handleReset} variant="secondary" className="flex-1">
              Reset
            </Button>
          </div>

          {result && (
            <div className="mt-6 p-4 bg-[var(--panel)] rounded-lg border border-[var(--border)] space-y-3">
              <h3 className="text-lg font-semibold text-[#ff9f0a]">Results</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg bg-[var(--panel-strong)] px-4 py-3">
                  <p className="text-sm text-[var(--text-muted)]">Final Balance</p>
                  <p className="financial-display break-all text-right text-[clamp(1.5rem,4vw,2.5rem)] font-bold text-[var(--text-strong)]">
                    {result.finalBalance}
                  </p>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-[var(--panel-strong)] px-4 py-3">
                  <p className="text-sm text-[var(--text-muted)]">Interest Earned</p>
                  <p className="financial-display break-all text-right text-[clamp(1.5rem,4vw,2.5rem)] font-bold text-[#30d158]">
                    {result.interestEarned}
                  </p>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-[var(--panel-strong)] px-4 py-3">
                  <p className="text-sm text-[var(--text-muted)]">Effective Annual Rate</p>
                  <p className="financial-display text-right text-[clamp(1.5rem,4vw,2.5rem)] font-bold text-[var(--text-strong)]">
                    {result.effectiveAnnualRate}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
