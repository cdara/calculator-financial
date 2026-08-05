import React from 'react'

interface HeaderProps {
  theme: 'dark' | 'light'
  onToggleTheme: () => void
}

export const Header: React.FC<HeaderProps> = ({ theme, onToggleTheme }) => {
  return (
    <header className="px-4 py-3 border-b border-[var(--border)] bg-[var(--bg)]">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-[var(--text-strong)]">
            FinCalc Suite
          </h1>
          <span className="text-sm text-[var(--text-muted)] hidden sm:inline">
            Professional Financial Calculator
          </span>
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
