import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MathFormula } from '../../../types/MathFormula'

describe('KaTeX smoke test', () => {
  it('renders a formula using KaTeX', () => {
    render(
      <div data-testid="katex-smoke">
        <MathFormula formula={String.raw`x=\frac{-b\pm\sqrt{b^2-4ac}}{2a}`} />
      </div>,
    )

    expect(
      screen.getByTestId('katex-smoke').querySelector('.katex')
    ).toBeInTheDocument()
  })
})