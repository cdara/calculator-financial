import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '../Input'

describe('Input', () => {
  it('renders the label and helper content', () => {
    render(
      <Input
        label="Principal Amount"
        helperText="Enter a numeric value"
        placeholder="Enter principal amount"
      />
    )

    expect(screen.getByLabelText('Principal Amount')).toBeInTheDocument()
    expect(screen.getByText('Enter a numeric value')).toBeInTheDocument()
  })

  it('keeps calculator fields digit-friendly by removing non-numeric characters', async () => {
    const user = userEvent.setup()

    render(
      <Input
        label="Principal Amount"
        placeholder="Enter principal amount"
        inputMode="decimal"
      />
    )

    const input = screen.getByLabelText('Principal Amount')

    await user.type(input, '12abc3.4e+5')

    expect(input).toHaveValue('123.45')
  })
})
