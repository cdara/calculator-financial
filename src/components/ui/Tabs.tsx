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
    <div className={className}>
      <div className="flex space-x-1 bg-[var(--panel)] p-1 rounded-xl mb-6 border border-[var(--border)]">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`
              flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
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
