import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CompoundInterestCalculator } from '../CompoundInterestCalculator'

describe('CompoundInterestCalculator', () => {
  it('renders the form with all inputs', () => {
    render(<CompoundInterestCalculator />)

    expect(screen.getByText('Daily Compound Interest Calculator')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter principal amount')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter annual interest rate')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter compounding frequency')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter investment duration')).toBeInTheDocument()
  })

  it('accepts user input and displays results', async () => {
    const user = userEvent.setup()
    render(<CompoundInterestCalculator />)

    await user.type(screen.getByPlaceholderText('Enter principal amount'), '10000')
    await user.type(screen.getByPlaceholderText('Enter annual interest rate'), '5')
    await user.type(screen.getByPlaceholderText('Enter investment duration'), '10')
    await user.click(screen.getByRole('button', { name: 'Calculate' }))

    expect(screen.getByText('Results')).toBeInTheDocument()
    expect(screen.getByText('Final Balance')).toBeInTheDocument()
    expect(screen.getByText('Interest Earned')).toBeInTheDocument()
    expect(screen.getByText('Effective Annual Rate')).toBeInTheDocument()
  })

  it('shows validation error when principal is missing', async () => {
    const user = userEvent.setup()
    render(<CompoundInterestCalculator />)

    await user.type(screen.getByPlaceholderText('Enter annual interest rate'), '5')
    await user.type(screen.getByPlaceholderText('Enter investment duration'), '10')
    await user.click(screen.getByRole('button', { name: 'Calculate' }))

    expect(screen.getByText('Principal is required')).toBeInTheDocument()
  })
})
