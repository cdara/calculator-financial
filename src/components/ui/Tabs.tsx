import React, { useState } from 'react'

interface TabItem {
  value: string
  label: string
  content: React.ReactNode
}

interface TabsProps {
  tabs: TabItem[]
  className?: string
}

export const Tabs: React.FC<TabsProps> = ({ tabs, className = '' }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.value || '')

  return (
    <div className={`w-full ${className}`}>
      <div className="mb-5 flex flex-wrap gap-2 rounded-[22px] border-[3px] border-[var(--border)] bg-[var(--panel)] p-1.5 shadow-[var(--shadow)]">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`
              flex-1 min-w-[120px] rounded-[16px] px-3 py-2.5 text-xs font-semibold sm:text-sm transition-all duration-200
              ${activeTab === tab.value
                ? 'bg-[var(--accent)] text-white shadow-md'
                : 'text-[var(--text-muted)] hover:text-[var(--text-strong)] hover:bg-[var(--panel-strong)]'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="animate-in fade-in duration-300">
        {tabs.find((tab) => tab.value === activeTab)?.content}
      </div>
    </div>
  )
}
