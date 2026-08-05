import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '../Input'

describe('Input', () => {
  it('renders the label without showing helper text beneath the field', () => {
    render(
      <Input
        label="Principal Amount"
        helperText="Enter a numeric value"
      />
    )

    expect(screen.getByLabelText('Principal Amount')).toBeInTheDocument()
    expect(screen.queryByText('Enter a numeric value')).not.toBeInTheDocument()
  })

  it('keeps calculator fields digit-friendly by removing non-numeric characters', async () => {
    const user = userEvent.setup()

    render(
      <Input
        label="Principal Amount"
        inputMode="decimal"
      />
    )

    const input = screen.getByLabelText('Principal Amount')

    await user.type(input, '12abc3.4e+5')

    expect(input).toHaveValue('123.45')
  })
})
