import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui'
import { MathFormula } from '../../types/MathFormula'

interface HelpSectionProps {
  title: string
  scenario: string
  inputSteps: string[]
  formula: string
  sampleResult: string
}

const HelpSection: React.FC<HelpSectionProps> = ({ title, scenario, inputSteps, formula, sampleResult }) => {
  const [open, setOpen] = React.useState(false)
  const formulaForRender = formula

  console.log('Help formula before BlockMath:', formulaForRender)

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--panel)] overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="w-full flex items-center justify-between px-4 py-3 text-left text-[var(--text-strong)] font-semibold"
      >
        <span>{title}</span>
        <span className="text-[var(--text-muted)] text-lg">{open ? '▾' : '▸'}</span>
      </button>
      {open && (
        <div className="border-t border-[var(--border)] px-4 py-4 space-y-3 text-sm text-[var(--text)]">
          <p className="font-medium text-[var(--text-strong)]">Scenario</p>
          <p>{scenario}</p>
          <div>
            <p className="font-medium text-[var(--text-strong)]">What to enter</p>
            <ol className="list-decimal pl-5 space-y-1 mt-2">
              {inputSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
          <div>
            <p className="font-medium text-[var(--text-strong)]">Formula</p>
            <div className="mt-2 rounded-xl bg-[var(--panel-strong)] px-3 py-4 text-[var(--text)] flex justify-center overflow-x-auto">
              <MathFormula formula={formulaForRender} />
            </div>
          </div>
          <div>
            <p className="font-medium text-[var(--text-strong)]">Sample result</p>
            <p className="mt-2 rounded-lg bg-[var(--panel-strong)] px-3 py-2 text-[var(--text)]">{sampleResult}</p>
          </div>
        </div>
      )}
    </div>
  )
}

const helpSections = [
  {
    title: 'Compound Interest',
    scenario: 'Sarah invests $10,000 in a retirement account that earns 5% annual interest and compounds monthly for 10 years. She also adds $200 every month.',
    inputSteps: [
      'Principal Amount: 10000',
      'Annual Interest Rate (%): 5',
      'Compounding Frequency: 12',
      'Investment Duration (years): 10',
      'Recurring Contribution: 200',
    ],
    formula: String.raw`A = P\left(1+\frac{r}{n}\right)^{nt} + PMT\left[\frac{\left(1+\frac{r}{n}\right)^{nt}-1}{\frac{r}{n}}\right]`,
    sampleResult: 'Final Balance ≈ $47,526.55, Interest Earned ≈ $13,526.55, Effective Annual Rate ≈ 5.12%',
  },
  {
    title: 'Simple Interest',
    scenario: 'A short-term loan of $5,000 is charged at 6% simple interest for 3 years. You want to see how much interest is earned and the total repayment.',
    inputSteps: [
      'Principal Amount: 5000',
      'Interest Rate (%): 6',
      'Time (years): 3',
    ],
    formula: String.raw`I = P \times r \times t \quad \text{and} \quad A = P + I`,
    sampleResult: 'Interest Earned = $900.00, Total Amount = $5,900.00',
  },
  {
    title: 'Mortgage',
    scenario: 'A buyer wants to purchase a home with a loan of $300,000 at 4.5% for 30 years and wants to understand the monthly payment and yearly cost.',
    inputSteps: [
      'Loan Amount: 300000',
      'Interest Rate (%): 4.5',
      'Loan Term (years): 30',
      'Annual Property Tax: 3000',
      'Annual Home Insurance: 1200',
    ],
    formula: String.raw`M = P \cdot \frac{r(1+r)^n}{(1+r)^n - 1}`,
    sampleResult: 'Monthly Payment ≈ $2,344.68, Principal & Interest ≈ $1,520.06, Total Interest ≈ $247,220.06, Total Cost ≈ $1,083,620.06',
  },
  {
    title: 'TVM Solver',
    scenario: 'An investor wants to find out how many years it will take to grow $1,000 into $10,000 if they save $100 per month and earn 5% annually.',
    inputSteps: [
      'Use Solve For: N',
      'PV: -1000',
      'FV: 10000',
      'PMT: -100',
      'IY: 5',
    ],
    formula: String.raw`PV + PMT \cdot \frac{1-(1+r)^{-n}}{r} + \frac{FV}{(1+r)^n} = 0`,
    sampleResult: 'This scenario solves for N, which is the number of periods needed to reach the future value target.',
  },
  {
    title: 'CAGR',
    scenario: 'A mutual fund account grew from $2,000 to $5,000 over 8 years. You want to find the annual compound growth rate.',
    inputSteps: [
      'Beginning Value: 2000',
      'Ending Value: 5000',
      'Number of Years: 8',
    ],
    formula: String.raw`CAGR = \left(\frac{\text{Ending Value}}{\text{Beginning Value}}\right)^{\frac{1}{\text{Years}}} - 1`,
    sampleResult: 'CAGR ≈ 12.47%',
  },
]

export const HelpGuide: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Help & Learning Guide</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {helpSections.map((section) => (
            <HelpSection key={section.title} {...section} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
