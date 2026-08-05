import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TVMCalculator } from '../TVMCalculator'

describe('TVMCalculator', () => {
  it('renders the form with all TVM variables', () => {
    render(<TVMCalculator />)

    expect(screen.getByText('Time Value of Money (TVM) Solver')).toBeInTheDocument()
    expect(screen.getByLabelText('Present Value (PV)')).toBeInTheDocument()
    expect(screen.getByLabelText('Future Value (FV)')).toBeInTheDocument()
    expect(screen.getByLabelText('Payment (PMT)')).toBeInTheDocument()
    expect(screen.getByLabelText('Interest Rate (I/Y)')).toBeInTheDocument()
    expect(screen.getByLabelText('Number of Periods (N)')).toBeInTheDocument()
  })

  it('allows switching the variable to solve for', async () => {
    const user = userEvent.setup()
    render(<TVMCalculator />)

    await user.click(screen.getByRole('button', { name: 'N' }))

    expect(screen.getByRole('button', { name: 'Calculate N' })).toBeInTheDocument()
    expect(screen.getByLabelText('Number of Periods (N)')).toBeInTheDocument()
  })

  it('solves for future value with valid inputs', async () => {
    const user = userEvent.setup()
    render(<TVMCalculator />)

    await user.type(screen.getByLabelText('Present Value (PV)'), '-1000')
    await user.type(screen.getByLabelText('Payment (PMT)'), '-100')
    await user.type(screen.getByLabelText('Interest Rate (I/Y)'), '5')
    await user.type(screen.getByLabelText('Number of Periods (N)'), '10')
    await user.click(screen.getByRole('button', { name: 'Calculate FV' }))

    expect(screen.getByText('Result')).toBeInTheDocument()
    expect(screen.getByText('2886.68')).toBeInTheDocument()
  })

  it('shows error when required inputs are missing', async () => {
    const user = userEvent.setup()
    render(<TVMCalculator />)

    await user.click(screen.getByRole('button', { name: 'Calculate FV' }))

    expect(screen.queryByText('Result')).not.toBeInTheDocument()
  })
})
