import { useMemo, useState } from 'react'
import { Header } from './components/layout'
import { Tabs } from './components/ui'
import { CompoundInterestCalculator } from './modules/compound'
import { SimpleInterestCalculator } from './modules/simple'
import { MortgageCalculator } from './modules/mortgage'
import { TVMCalculator } from './modules/tvm'
import { CAGRCalculator } from './modules/cagr'
import { HelpGuide } from './modules/help'

function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  const tabs = useMemo(() => [
    {
      value: 'compound',
      label: 'Compound Interest',
      content: <CompoundInterestCalculator />,
    },
    {
      value: 'simple',
      label: 'Simple Interest',
      content: <SimpleInterestCalculator />,
    },
    {
      value: 'mortgage',
      label: 'Mortgage',
      content: <MortgageCalculator />,
    },
    {
      value: 'tvm',
      label: 'TVM Solver',
      content: <TVMCalculator />,
    },
    {
      value: 'cagr',
      label: 'CAGR',
      content: <CAGRCalculator />,
    },
    {
      value: 'help',
      label: 'Help',
      content: <HelpGuide />,
    },
  ], [])

  return (
    <div className="min-h-screen" data-theme={theme}>
      <Header theme={theme} onToggleTheme={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')} />
      <main className="mx-auto w-full max-w-[880px] px-4 py-6 sm:py-8">
        <Tabs tabs={tabs} />
      </main>
      <footer className="py-6 px-4 border-t border-[var(--border)] mt-8">
        <div className="max-w-4xl mx-auto text-center text-[var(--text-muted)] text-sm">
          <p>FinCalc Suite - Professional Financial Calculator</p>
          <p className="mt-1">Built with React, TypeScript, and Decimal.js</p>
        </div>
      </footer>
    </div>
  )
}

export default App
