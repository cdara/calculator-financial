import React from 'react'

export const Header: React.FC = () => {
  return (
    <header className="py-6 px-4 border-b border-[#3a3a3c]">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white">
          FinCalc Suite
        </h1>
        <p className="text-[#8e8e93] text-sm mt-1">
          Professional Financial Calculator
        </p>
      </div>
    </header>
  )
}
