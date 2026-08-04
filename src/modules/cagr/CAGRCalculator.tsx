import React from 'react'
import { Card, CardHeader, CardTitle, CardContent, Input, Button } from '../../components/ui'
import { useCalculatorState } from '../../hooks'
import { calculateCAGR } from '../../utils'
import type { CAGRInput, CAGRResult } from '../../types'

const initialState: CAGRInput = {
  beginningValue: { value: '' },
  endingValue: { value: '' },
  years: { value: '' },
}

export const CAGRCalculator: React.FC = () => {
  const { state, updateField, setErrors, clearErrors } = useCalculatorState(initialState)
  const [result, setResult] = React.useState<CAGRResult | null>(null)

  const handleCalculate = () => {
    clearErrors()
    try {
      const calculationResult = calculateCAGR(state)
      setResult(calculationResult)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Calculation failed'
      if (errorMessage.includes('Beginning Value')) {
        setErrors({ beginningValue: errorMessage })
      } else if (errorMessage.includes('Ending Value')) {
        setErrors({ endingValue: errorMessage })
      } else if (errorMessage.includes('Years')) {
        setErrors({ years: errorMessage })
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
        <CardTitle>Compound Annual Growth Rate (CAGR)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            label="Beginning Value"
            type="number"
            step="0.01"
            placeholder="Enter beginning value"
            value={state.beginningValue.value}
            error={state.beginningValue.error}
            onChange={(e) => updateField('beginningValue', e.target.value)}
            helperText="Initial investment or value"
          />
          
          <Input
            label="Ending Value"
            type="number"
            step="0.01"
            placeholder="Enter ending value"
            value={state.endingValue.value}
            error={state.endingValue.error}
            onChange={(e) => updateField('endingValue', e.target.value)}
            helperText="Final investment or value"
          />
          
          <Input
            label="Number of Years"
            type="number"
            step="0.1"
            placeholder="Enter number of years"
            value={state.years.value}
            error={state.years.error}
            onChange={(e) => updateField('years', e.target.value)}
            helperText="Time period in years"
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
            <div className="mt-6 p-4 bg-[#1c1c1e] rounded-lg">
              <h3 className="text-lg font-semibold text-[#ff9f0a] mb-2">Result</h3>
              <div>
                <p className="text-sm text-[#8e8e93]">Compound Annual Growth Rate</p>
                <p className="text-3xl font-bold text-white">{result.cagr}</p>
              </div>
            </div>
          )}
          
          <div className="mt-4 p-4 bg-[#2c2c2e] rounded-lg">
            <h4 className="text-sm font-semibold text-[#8e8e93] mb-2">About CAGR</h4>
            <p className="text-xs text-[#8e8e93]">
              CAGR measures the annual growth rate of an investment over a specified period,
              assuming the investment had grown at a steady rate. It's useful for comparing
              the performance of different investments over time.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
