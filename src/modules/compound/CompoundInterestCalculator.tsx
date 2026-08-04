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
            label="Principal Amount"
            type="number"
            step="0.01"
            placeholder="Enter principal amount"
            value={state.principal.value}
            error={state.principal.error}
            onChange={(e) => updateField('principal', e.target.value)}
            helperText="Initial investment amount"
          />
          
          <Input
            label="Annual Interest Rate (%)"
            type="number"
            step="0.01"
            placeholder="Enter annual interest rate"
            value={state.annualRate.value}
            error={state.annualRate.error}
            onChange={(e) => updateField('annualRate', e.target.value)}
            helperText="Annual interest rate as percentage"
          />
          
          <Input
            label="Compounding Frequency"
            type="number"
            step="1"
            placeholder="Enter compounding frequency"
            value={state.compoundingFrequency.value}
            error={state.compoundingFrequency.error}
            onChange={(e) => updateField('compoundingFrequency', e.target.value)}
            helperText="Number of times interest compounds per year (e.g., 12 for monthly)"
          />
          
          <Input
            label="Investment Duration (years)"
            type="number"
            step="0.1"
            placeholder="Enter investment duration"
            value={state.duration.value}
            error={state.duration.error}
            onChange={(e) => updateField('duration', e.target.value)}
            helperText="Length of investment in years"
          />
          
          <Input
            label="Recurring Contribution"
            type="number"
            step="0.01"
            placeholder="Enter recurring contribution"
            value={state.recurringContribution.value}
            error={state.recurringContribution.error}
            onChange={(e) => updateField('recurringContribution', e.target.value)}
            helperText="Amount contributed each compounding period (optional)"
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
            <div className="mt-6 p-4 bg-[#1c1c1e] rounded-lg space-y-3">
              <h3 className="text-lg font-semibold text-[#ff9f0a]">Results</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-[#8e8e93]">Final Balance</p>
                  <p className="text-xl font-bold text-white">{result.finalBalance}</p>
                </div>
                <div>
                  <p className="text-sm text-[#8e8e93]">Interest Earned</p>
                  <p className="text-xl font-bold text-[#30d158]">{result.interestEarned}</p>
                </div>
                <div>
                  <p className="text-sm text-[#8e8e93]">Effective Annual Rate</p>
                  <p className="text-xl font-bold text-white">{result.effectiveAnnualRate}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
