import React from 'react'
import { Card, CardHeader, CardTitle, CardContent, Input, Button } from '../../components/ui'
import { useCalculatorState } from '../../hooks'
import { calculateSimpleInterest } from '../../utils'
import type { SimpleInterestInput, SimpleInterestResult } from '../../types'

const initialState: SimpleInterestInput = {
  principal: { value: '' },
  interestRate: { value: '' },
  time: { value: '' },
}

export const SimpleInterestCalculator: React.FC = () => {
  const { state, updateField, setErrors, clearErrors } = useCalculatorState(initialState)
  const [result, setResult] = React.useState<SimpleInterestResult | null>(null)

  const handleCalculate = () => {
    clearErrors()
    try {
      const calculationResult = calculateSimpleInterest(state)
      setResult(calculationResult)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Calculation failed'
      if (errorMessage.includes('Principal')) {
        setErrors({ principal: errorMessage })
      } else if (errorMessage.includes('Interest Rate')) {
        setErrors({ interestRate: errorMessage })
      } else if (errorMessage.includes('Time')) {
        setErrors({ time: errorMessage })
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
        <CardTitle>Simple Interest Calculator</CardTitle>
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
            helperText="Initial amount"
          />
          
          <Input
            label="Interest Rate (%)"
            type="number"
            step="0.01"
            placeholder="Enter interest rate"
            value={state.interestRate.value}
            error={state.interestRate.error}
            onChange={(e) => updateField('interestRate', e.target.value)}
            helperText="Annual interest rate as percentage"
          />
          
          <Input
            label="Time (years)"
            type="number"
            step="0.1"
            placeholder="Enter time period"
            value={state.time.value}
            error={state.time.error}
            onChange={(e) => updateField('time', e.target.value)}
            helperText="Duration in years"
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[#8e8e93]">Interest Earned</p>
                  <p className="text-xl font-bold text-[#30d158]">{result.interest}</p>
                </div>
                <div>
                  <p className="text-sm text-[#8e8e93]">Total Amount</p>
                  <p className="text-xl font-bold text-white">{result.totalAmount}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
