import React from 'react'

interface HeaderProps {
  theme: 'dark' | 'light'
  onToggleTheme: () => void
}

export const Header: React.FC<HeaderProps> = ({ theme, onToggleTheme }) => {
  return (
    <header className="py-6 px-4 border-b border-[var(--border)] bg-[var(--bg)]">
      <div className="max-w-4xl mx-auto flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-strong)]">
            FinCalc Suite
          </h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">
            Professional Financial Calculator
          </p>
        </div>
        <button
          type="button"
          onClick={onToggleTheme}
          className="rounded-full border border-[var(--border)] bg-[var(--panel)] px-3 py-1.5 text-sm font-medium text-[var(--text-strong)] hover:bg-[var(--panel-hover)] transition-colors"
        >
          {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>
      </div>
    </header>
  )
}
