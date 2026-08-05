import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

const normalizeNumericInputValue = (value: string) => {
  const sanitized = value.replace(/[^\d.-]/g, '')
  let sign = ''
  const characters: string[] = []
  let sawDecimal = false

  for (const char of sanitized) {
    if (char === '-') {
      if (!sign && characters.length === 0) {
        sign = '-'
      }
      continue
    }

    if (char === '.') {
      if (!sawDecimal) {
        characters.push('.')
        sawDecimal = true
      }
      continue
    }

    if (/\d/.test(char)) {
      characters.push(char)
    }
  }

  return `${sign}${characters.join('')}`
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className = '',
  id,
  type,
  inputMode,
  onChange,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
  const isNumericInput = type === 'number' || inputMode === 'decimal' || inputMode === 'numeric'
  const resolvedType = isNumericInput ? 'text' : type

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    if (isNumericInput) {
      event.target.value = normalizeNumericInputValue(event.target.value)
    }

    onChange?.(event)
  }

  return (
    <div className="flex flex-col space-y-1">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-semibold text-[var(--text-muted)]"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={resolvedType}
        inputMode={isNumericInput ? 'decimal' : inputMode}
        className={`
          px-4 py-3 rounded-xl bg-[var(--input-bg)] border-2 border-[var(--input-border)]
          text-[var(--input-text)] placeholder:text-[var(--text-muted)]
          focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]
          transition-all duration-200 shadow-sm
          ${error ? 'border-[var(--error)] focus:border-[var(--error)] focus:ring-[var(--error)]' : ''}
          ${className}
        `}
        onChange={handleChange}
        {...props}
      />
      {error && (
        <span className="text-sm text-[var(--error)]">{error}</span>
      )}
      {helperText && !error && (
        <span className="text-sm text-[var(--text-muted)]">{helperText}</span>
      )}
    </div>
  )
}
