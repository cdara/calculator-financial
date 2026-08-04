import React from 'react'
import { Card, CardHeader, CardTitle, CardContent, Input, Button } from '../../components/ui'
import { useCalculatorState } from '../../hooks'
import { solveTVM } from '../../utils'
import type { TVMInput, TVMVariable, TVMResult } from '../../types'

const initialState: TVMInput = {
  pv: { value: '' },
  fv: { value: '' },
  pmt: { value: '' },
  iy: { value: '' },
  n: { value: '' },
}

const variableLabels: Record<TVMVariable, string> = {
  pv: 'Present Value (PV)',
  fv: 'Future Value (FV)',
  pmt: 'Payment (PMT)',
  iy: 'Interest Rate (I/Y)',
  n: 'Number of Periods (N)',
}

const variableHelpers: Record<TVMVariable, string> = {
  pv: 'Initial investment or loan amount',
  fv: 'Target future value',
  pmt: 'Regular payment per period',
  iy: 'Interest rate per period (%)',
  n: 'Total number of periods',
}

export const TVMCalculator: React.FC = () => {
  const { state, updateField, clearErrors } = useCalculatorState(initialState)
  const [solveFor, setSolveFor] = React.useState<TVMVariable>('fv')
  const [result, setResult] = React.useState<TVMResult | null>(null)

  const handleCalculate = () => {
    clearErrors()
    try {
      const calculationResult = solveTVM(state, solveFor)
      setResult(calculationResult)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Calculation failed'
      alert(errorMessage)
    }
  }

  const handleReset = () => {
    setResult(null)
    clearErrors()
  }

  const handleVariableChange = (variable: TVMVariable, value: string) => {
    // Clear the field being solved for when user types in it
    if (variable === solveFor) {
      updateField(variable, value)
    } else {
      updateField(variable, value)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Time Value of Money (TVM) Solver</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#8e8e93] mb-2">
              Solve For
            </label>
            <div className="grid grid-cols-5 gap-2">
              {Object.keys(variableLabels).map((key) => (
                <button
                  key={key}
                  onClick={() => {
                    setSolveFor(key as TVMVariable)
                    setResult(null)
                  }}
                  className={`
                    px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${solveFor === key
                      ? 'bg-[#ff9f0a] text-white shadow-md'
                      : 'bg-[#2c2c2e] text-[#8e8e93] hover:text-white hover:bg-[#3a3a3c]'
                    }
                  `}
                >
                  {key.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {Object.entries(variableLabels).map(([key, label]) => {
            const variable = key as TVMVariable
            const isSolvingFor = variable === solveFor

            return (
              <Input
                key={key}
                label={label}
                type="number"
                step="0.01"
                placeholder={isSolvingFor ? 'Leave empty to solve' : `Enter ${variable}`}
                value={state[variable].value}
                error={state[variable].error}
                onChange={(e) => handleVariableChange(variable, e.target.value)}
                helperText={variableHelpers[variable]}
                disabled={isSolvingFor}
                className={isSolvingFor ? 'opacity-50' : ''}
              />
            )
          })}
          
          <div className="flex space-x-3 pt-4">
            <Button onClick={handleCalculate} className="flex-1">
              Calculate {solveFor.toUpperCase()}
            </Button>
            <Button onClick={handleReset} variant="secondary" className="flex-1">
              Reset
            </Button>
          </div>
          
          {result && (result as any)[solveFor] && (
            <div className="mt-6 p-4 bg-[#1c1c1e] rounded-lg">
              <h3 className="text-lg font-semibold text-[#ff9f0a] mb-2">Result</h3>
              <div>
                <p className="text-sm text-[#8e8e93]">{variableLabels[solveFor]}</p>
                <p className="text-2xl font-bold text-white">{(result as any)[solveFor]}</p>
              </div>
            </div>
          )}
          
          <div className="mt-4 p-4 bg-[#2c2c2e] rounded-lg">
            <h4 className="text-sm font-semibold text-[#8e8e93] mb-2">How to Use</h4>
            <ul className="text-xs text-[#8e8e93] space-y-1">
              <li>• Select which variable to solve for using the buttons above</li>
              <li>• Enter values for the other 4 variables</li>
              <li>• Leave the field you want to solve for empty</li>
              <li>• Click Calculate to solve for the unknown variable</li>
              <li>• Cash inflows are positive, outflows are negative</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
