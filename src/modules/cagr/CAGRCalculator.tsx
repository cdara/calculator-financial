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
            label="Beginning Value (USD)"
            type="number"
            step="0.01"
            value={state.beginningValue.value}
            error={state.beginningValue.error}
            onChange={(e) => updateField('beginningValue', e.target.value)}
          />
          
          <Input
            label="Ending Value (USD)"
            type="number"
            step="0.01"
            value={state.endingValue.value}
            error={state.endingValue.error}
            onChange={(e) => updateField('endingValue', e.target.value)}
          />
          
          <Input
            label="Number of Years"
            type="number"
            step="0.1"
            value={state.years.value}
            error={state.years.error}
            onChange={(e) => updateField('years', e.target.value)}
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
            <div className="mt-6 p-4 bg-[var(--panel)] rounded-lg border border-[var(--border)]">
              <h3 className="text-lg font-semibold text-[#ff9f0a] mb-2">Result</h3>
              <div>
                <p className="text-sm text-[var(--text-muted)]">Compound Annual Growth Rate</p>
                <p className="financial-display text-[clamp(2rem,5vw,3.5rem)] font-bold text-[var(--text-strong)]">{result.cagr}</p>
              </div>
            </div>
          )}
          
          <div className="mt-4 p-4 bg-[var(--panel)] rounded-lg border border-[var(--border)]">
            <h4 className="text-sm font-semibold text-[var(--text-muted)] mb-2">About CAGR</h4>
            <p className="text-xs text-[var(--text-muted)]">
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
