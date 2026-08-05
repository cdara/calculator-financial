import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HelpGuide } from '../HelpGuide'

describe('HelpGuide', () => {
  it('renders the help scenarios for each calculator', () => {
    render(<HelpGuide />)

    expect(screen.getByText('Help & Learning Guide')).toBeInTheDocument()
    expect(screen.getByText('Compound Interest')).toBeInTheDocument()
    expect(screen.getByText('Simple Interest')).toBeInTheDocument()
    expect(screen.getByText('Mortgage')).toBeInTheDocument()
    expect(screen.getByText('TVM Solver')).toBeInTheDocument()
    expect(screen.getByText('CAGR')).toBeInTheDocument()
  })

  it('shows formula guidance inside each help section', async () => {
    const { container } = render(<HelpGuide />)

    const compoundButton = screen.getByRole('button', { name: /Compound Interest/i })
    await compoundButton.click()

    expect(screen.getByText('Formula')).toBeInTheDocument()
    expect(container.querySelector('.katex-display')).toBeInTheDocument()
  })
})
