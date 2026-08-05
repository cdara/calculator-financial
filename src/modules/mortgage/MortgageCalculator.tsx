import React from 'react'
import { Card, CardHeader, CardTitle, CardContent, Input, Button } from '../../components/ui'
import { useCalculatorState } from '../../hooks'
import { calculateMortgage } from '../../utils'
import type { MortgageInput, MortgageResult } from '../../types'

const initialState: MortgageInput = {
  loanAmount: { value: '' },
  interestRate: { value: '' },
  loanTerm: { value: '' },
  propertyTax: { value: '0' },
  homeInsurance: { value: '0' },
}

export const MortgageCalculator: React.FC = () => {
  const { state, updateField, setErrors, clearErrors } = useCalculatorState(initialState)
  const [result, setResult] = React.useState<MortgageResult | null>(null)
  const [showSchedule, setShowSchedule] = React.useState(false)

  const handleCalculate = () => {
    clearErrors()
    try {
      const calculationResult = calculateMortgage(state)
      setResult(calculationResult)
      setShowSchedule(false)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Calculation failed'
      if (errorMessage.includes('Loan Amount')) {
        setErrors({ loanAmount: errorMessage })
      } else if (errorMessage.includes('Interest Rate')) {
        setErrors({ interestRate: errorMessage })
      } else if (errorMessage.includes('Loan Term')) {
        setErrors({ loanTerm: errorMessage })
      } else if (errorMessage.includes('Property Tax')) {
        setErrors({ propertyTax: errorMessage })
      } else if (errorMessage.includes('Home Insurance')) {
        setErrors({ homeInsurance: errorMessage })
      } else {
        alert(errorMessage)
      }
    }
  }

  const handleReset = () => {
    setResult(null)
    setShowSchedule(false)
    clearErrors()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mortgage Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            label="Loan Amount (USD)"
            type="number"
            step="0.01"
            value={state.loanAmount.value}
            error={state.loanAmount.error}
            onChange={(e) => updateField('loanAmount', e.target.value)}
          />
          
          <Input
            label="Interest Rate (%)"
            type="number"
            step="0.01"
            value={state.interestRate.value}
            error={state.interestRate.error}
            onChange={(e) => updateField('interestRate', e.target.value)}
          />
          
          <Input
            label="Loan Term (years)"
            type="number"
            step="1"
            value={state.loanTerm.value}
            error={state.loanTerm.error}
            onChange={(e) => updateField('loanTerm', e.target.value)}
          />
          
          <Input
            label="Annual Property Tax (USD/year)"
            type="number"
            step="0.01"
            value={state.propertyTax.value}
            error={state.propertyTax.error}
            onChange={(e) => updateField('propertyTax', e.target.value)}
          />
          
          <Input
            label="Annual Home Insurance (USD/year)"
            type="number"
            step="0.01"
            value={state.homeInsurance.value}
            error={state.homeInsurance.error}
            onChange={(e) => updateField('homeInsurance', e.target.value)}
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
            <div className="mt-6 space-y-4">
              <div className="p-4 bg-[var(--panel)] rounded-lg border border-[var(--border)] space-y-3">
                <h3 className="text-lg font-semibold text-[#ff9f0a]">Monthly Payment Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[var(--text-muted)]">Total Monthly Payment</p>
                    <p className="financial-display text-[clamp(2rem,5vw,3.5rem)] font-bold text-[var(--text-strong)]">{result.monthlyPayment}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--text-muted)]">Principal & Interest</p>
                    <p className="financial-display text-[clamp(1.8rem,4vw,3rem)] font-bold text-[var(--text-strong)]">{result.principalAndInterest}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--text-muted)]">Total Interest</p>
                    <p className="financial-display text-[clamp(1.8rem,4vw,3rem)] font-bold text-[#ff453a]">{result.totalInterest}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--text-muted)]">Total Cost</p>
                    <p className="financial-display text-[clamp(1.8rem,4vw,3rem)] font-bold text-[var(--text-strong)]">{result.totalCost}</p>
                  </div>
                </div>
              </div>
              
              <Button
                onClick={() => setShowSchedule(!showSchedule)}
                variant="secondary"
                className="w-full"
              >
                {showSchedule ? 'Hide' : 'Show'} Amortization Schedule
              </Button>
              
              {showSchedule && (
                <div className="mt-4 p-4 bg-[var(--panel)] rounded-lg border border-[var(--border)] max-h-96 overflow-y-auto">
                  <h3 className="text-lg font-semibold text-[#ff9f0a] mb-3">Amortization Schedule</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[var(--border)]">
                          <th className="text-left py-2 px-2 text-[var(--text-muted)]">Month</th>
                          <th className="text-right py-2 px-2 text-[var(--text-muted)]">Payment</th>
                          <th className="text-right py-2 px-2 text-[var(--text-muted)]">Principal</th>
                          <th className="text-right py-2 px-2 text-[var(--text-muted)]">Interest</th>
                          <th className="text-right py-2 px-2 text-[var(--text-muted)]">Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.amortizationSchedule.map((entry) => (
                          <tr key={entry.month} className="border-b border-[var(--border)]">
                            <td className="py-2 px-2 text-[var(--text-strong)]">{entry.month}</td>
                            <td className="py-2 px-2 text-right text-[var(--text-strong)]">{entry.payment}</td>
                            <td className="py-2 px-2 text-right text-[#30d158]">{entry.principal}</td>
                            <td className="py-2 px-2 text-right text-[#ff453a]">{entry.interest}</td>
                            <td className="py-2 px-2 text-right text-[var(--text-strong)]">{entry.balance}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
