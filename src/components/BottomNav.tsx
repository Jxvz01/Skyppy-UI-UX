import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { translations } from '../utils/i18n';

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const { language } = useAppStore();
  const t = translations[language] || translations.en;

  const tabs = [
    { key: 'home', label: t.navHome, path: '/', icon: 'home' },
    { key: 'activity', label: t.navActivity, path: '/activity', icon: 'receipt_long' },
    { key: 'miles', label: t.navMiles, path: '/miles', icon: 'layers' },
    { key: 'profile', label: t.navProfile, path: '/profile', icon: 'person' },
  ];

  return (
    <nav className="w-full shrink-0 z-40 bg-surface-container-lowest/95 backdrop-blur-xl shadow-[0_-2px_12px_rgba(16,28,43,0.05)] border-t border-surface-container/50 select-none">
      <div className="flex justify-around items-center h-16 px-space-xs w-full relative">
        {tabs.map((tab) => {
          const isActive = tab.key === 'home' ? (path === '/' || path === '/courier') : path.startsWith(tab.path);
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => navigate(tab.path)}
              aria-current={isActive ? 'page' : undefined}
              className={`relative flex flex-col items-center justify-center w-16 h-13 rounded-2xl transition-all gap-0.5 active:scale-95 cursor-pointer ${
                isActive
                  ? 'text-primary font-bold'
                  : 'text-tertiary hover:text-on-surface'
              }`}
            >
              {/* Subtle Animated Active Indicator Pill */}
              {isActive && (
                <motion.div
                  layoutId="bottomNavActivePill"
                  className="absolute inset-0 bg-primary/10 rounded-2xl -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}

              <span
                className="material-symbols-outlined text-[23px] transition-transform duration-200"
                style={{
                  fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                  transform: isActive ? 'scale(1.08)' : 'scale(1)'
                }}
              >
                {tab.icon}
              </span>
              <span className={`text-[11px] leading-tight transition-colors duration-150 ${isActive ? 'font-bold text-primary' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
