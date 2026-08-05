import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MortgageCalculator } from '../MortgageCalculator'

describe('MortgageCalculator', () => {
  it('renders the form with all inputs', () => {
    render(<MortgageCalculator />)

    expect(screen.getByText('Mortgage Calculator')).toBeInTheDocument()
    expect(screen.getByLabelText('Loan Amount (USD)')).toBeInTheDocument()
    expect(screen.getByLabelText('Interest Rate (%)')).toBeInTheDocument()
    expect(screen.getByLabelText('Loan Term (years)')).toBeInTheDocument()
  })

  it('accepts user input and displays payment summary', async () => {
    const user = userEvent.setup()
    render(<MortgageCalculator />)

    await user.type(screen.getByPlaceholderText('Enter loan amount'), '300000')
    await user.type(screen.getByPlaceholderText('Enter annual interest rate'), '4.5')
    await user.type(screen.getByPlaceholderText('Enter loan term'), '30')
    await user.click(screen.getByRole('button', { name: 'Calculate' }))

    expect(screen.getByText('Monthly Payment Summary')).toBeInTheDocument()
    expect(screen.getByText('Total Interest')).toBeInTheDocument()
    expect(screen.getByText('Total Cost')).toBeInTheDocument()
  })

  it('shows validation error when loan amount is missing', async () => {
    const user = userEvent.setup()
    render(<MortgageCalculator />)

    await user.type(screen.getByPlaceholderText('Enter annual interest rate'), '4.5')
    await user.type(screen.getByPlaceholderText('Enter loan term'), '30')
    await user.click(screen.getByRole('button', { name: 'Calculate' }))

    expect(screen.getByText('Loan Amount is required')).toBeInTheDocument()
  })

  it('shows amortization schedule when toggled', async () => {
    const user = userEvent.setup()
    render(<MortgageCalculator />)

    await user.type(screen.getByPlaceholderText('Enter loan amount'), '300000')
    await user.type(screen.getByPlaceholderText('Enter annual interest rate'), '4.5')
    await user.type(screen.getByPlaceholderText('Enter loan term'), '30')
    await user.click(screen.getByRole('button', { name: 'Calculate' }))
    await user.click(screen.getByRole('button', { name: 'Show Amortization Schedule' }))

    expect(screen.getByText('Amortization Schedule')).toBeInTheDocument()
    expect(screen.getByText('Month')).toBeInTheDocument()
  })
})
