import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { translations } from '../utils/i18n';

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const { language } = useAppStore();
  const t = translations[language] || translations.en;

  const tabs = [
    { key: 'home', label: t.navHome, path: '/', icon: 'directions_car' },
    { key: 'activity', label: t.navActivity, path: '/activity', icon: 'receipt_long' },
    { key: 'miles', label: t.navMiles, path: '/miles', icon: 'military_tech' },
    { key: 'profile', label: t.navProfile, path: '/profile', icon: 'person' },
  ];

  return (
    <nav className="w-full shrink-0 z-40 bg-surface-container-lowest/95 backdrop-blur-xl shadow-[0_-2px_12px_rgba(16,28,43,0.05)] border-t border-surface-container/50 select-none">
      <div className="flex justify-around items-center h-16 px-space-xs w-full">
        {tabs.map((tab) => {
          const isActive = tab.path === '/' ? path === '/' : path.startsWith(tab.path);
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => navigate(tab.path)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center justify-center w-16 h-13 rounded-xl transition-all gap-0.5 active:scale-95 ${
                isActive
                  ? 'text-primary font-bold font-label-lg'
                  : 'text-tertiary hover:text-on-surface'
              }`}
            >
              <span
                className="material-symbols-outlined text-[23px]"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {tab.icon}
              </span>
              <span className={`font-label-sm text-[11px] leading-tight ${isActive ? 'font-bold text-primary' : 'font-medium'}`}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

