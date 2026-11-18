import React from 'react';
import { useDriverStore } from '../../store/useDriverStore';

export const DriverBottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useDriverStore();

  const tabs = [
    { key: 'home', label: 'Home', icon: 'dashboard' },
    { key: 'activity', label: 'Activity', icon: 'receipt_long' },
    { key: 'earnings', label: 'Earnings', icon: 'account_balance_wallet' },
    { key: 'profile', label: 'Profile', icon: 'person' }
  ] as const;

  return (
    <nav className="w-full shrink-0 z-40 bg-surface-container-lowest/95 backdrop-blur-xl border-t border-surface-container/60 select-none shadow-[0_-2px_12px_rgba(16,28,43,0.05)]">
      <div className="flex justify-around items-center h-16 px-2 w-full max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center justify-center w-16 h-13 rounded-xl transition-all gap-0.5 active:scale-95 ${
                isActive
                  ? 'text-primary font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <span
                className="material-symbols-outlined text-[23px]"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {tab.icon}
              </span>
              <span className={`text-[11px] leading-tight ${isActive ? 'font-bold text-primary' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
