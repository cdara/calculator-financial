import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SimpleInterestCalculator } from '../SimpleInterestCalculator'

describe('SimpleInterestCalculator', () => {
  it('renders the form with all inputs', () => {
    render(<SimpleInterestCalculator />)

    expect(screen.getByText('Simple Interest Calculator')).toBeInTheDocument()
    expect(screen.getByLabelText('Principal Amount')).toBeInTheDocument()
    expect(screen.getByLabelText('Interest Rate (%)')).toBeInTheDocument()
    expect(screen.getByLabelText('Time (years)')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Calculate' })).toBeInTheDocument()
  })

  it('accepts user input and displays results', async () => {
    const user = userEvent.setup()
    render(<SimpleInterestCalculator />)

    await user.type(screen.getByLabelText('Principal Amount (USD)'), '10000')
    await user.type(screen.getByLabelText('Interest Rate (%)'), '5')
    await user.type(screen.getByLabelText('Time (years)'), '3')
    await user.click(screen.getByRole('button', { name: 'Calculate' }))

    expect(screen.getByText('Results')).toBeInTheDocument()
    expect(screen.getByText('1500.00')).toBeInTheDocument()
    expect(screen.getByText('11500.00')).toBeInTheDocument()
  })

  it('shows validation error when required fields are empty', async () => {
    const user = userEvent.setup()
    render(<SimpleInterestCalculator />)

    await user.click(screen.getByRole('button', { name: 'Calculate' }))

    expect(screen.getByText('Principal is required')).toBeInTheDocument()
  })

  it('clears results on reset', async () => {
    const user = userEvent.setup()
    render(<SimpleInterestCalculator />)

    await user.type(screen.getByLabelText('Principal Amount (USD)'), '10000')
    await user.type(screen.getByLabelText('Interest Rate (%)'), '5')
    await user.type(screen.getByLabelText('Time (years)'), '3')
    await user.click(screen.getByRole('button', { name: 'Calculate' }))
    expect(screen.getByText('Results')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Reset' }))
    expect(screen.queryByText('Results')).not.toBeInTheDocument()
  })
})
