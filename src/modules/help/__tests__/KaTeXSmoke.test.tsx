import React from 'react'
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BlockMath } from 'react-katex'

describe('KaTeX smoke test', () => {
  it('renders a minimal hardcoded formula using BlockMath', () => {
    render(
      <div data-testid="katex-smoke">
        <BlockMath math={String.raw`x=\frac{-b\pm\sqrt{b^2-4ac}}{2a}`} />
      </div>,
    )

    expect(screen.getByTestId('katex-smoke').querySelector('.katex-display')).toBeInTheDocument()
  })
})
