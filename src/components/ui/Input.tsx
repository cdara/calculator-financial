import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
  
  return (
    <div className="flex flex-col space-y-1">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-[#8e8e93]"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
          px-4 py-3 rounded-lg bg-[#2c2c2e] border-2 border-[#3a3a3c]
          text-white placeholder-[#8e8e93]
          focus:outline-none focus:border-[#ff9f0a] focus:ring-1 focus:ring-[#ff9f0a]
          transition-all duration-200
          ${error ? 'border-[#ff453a] focus:border-[#ff453a] focus:ring-[#ff453a]' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <span className="text-sm text-[#ff453a]">{error}</span>
      )}
      {helperText && !error && (
        <span className="text-sm text-[#8e8e93]">{helperText}</span>
      )}
    </div>
  )
}
