import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CAGRCalculator } from '../CAGRCalculator'

describe('CAGRCalculator', () => {
  it('renders the form with all inputs', () => {
    render(<CAGRCalculator />)

    expect(screen.getByText('Compound Annual Growth Rate (CAGR)')).toBeInTheDocument()
    expect(screen.getByLabelText('Beginning Value (USD)')).toBeInTheDocument()
    expect(screen.getByLabelText('Ending Value (USD)')).toBeInTheDocument()
    expect(screen.getByLabelText('Number of Years')).toBeInTheDocument()
  })

  it('accepts user input and displays CAGR result', async () => {
    const user = userEvent.setup()
    render(<CAGRCalculator />)

    await user.type(screen.getByLabelText('Beginning Value (USD)'), '1000')
    await user.type(screen.getByLabelText('Ending Value (USD)'), '2000')
    await user.type(screen.getByLabelText('Number of Years'), '10')
    await user.click(screen.getByRole('button', { name: 'Calculate' }))

    expect(screen.getByText('Result')).toBeInTheDocument()
    expect(screen.getByText('Compound Annual Growth Rate')).toBeInTheDocument()
    expect(screen.getByText(/7\.18/)).toBeInTheDocument()
  })

  it('shows validation error when beginning value is missing', async () => {
    const user = userEvent.setup()
    render(<CAGRCalculator />)

    await user.type(screen.getByLabelText('Ending Value (USD)'), '2000')
    await user.type(screen.getByLabelText('Number of Years'), '10')
    await user.click(screen.getByRole('button', { name: 'Calculate' }))

    expect(screen.getByText('Beginning Value is required')).toBeInTheDocument()
  })
})
