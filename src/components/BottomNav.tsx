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
    { key: 'rides', label: language === 'kn' ? t.navHome : 'Rides', testLabel: 'Home', path: '/', icon: 'directions_car' },
    { key: 'courier', label: language === 'kn' ? 'ಕೊರಿಯರ್' : 'Courier', testLabel: 'Courier', path: '/courier', icon: 'inventory_2' },
    { key: 'miles', label: language === 'kn' ? 'ಮೈಲ್ಸ್' : 'Miles', testLabel: 'Miles', path: '/miles', icon: 'miles_special' },
    { key: 'activity', label: language === 'kn' ? 'ಚಟುವಟಿಕೆ' : 'Activity', testLabel: 'Activity', path: '/activity', icon: 'receipt_long' },
    { key: 'profile', label: language === 'kn' ? 'ಪ್ರೊಫೈಲ್' : 'Profile', testLabel: 'Profile', path: '/profile', icon: 'person' },
  ];

  return (
    <nav className="w-full shrink-0 z-40 bg-white/95 backdrop-blur-xl shadow-[0_-2px_12px_rgba(16,28,43,0.06)] border-t border-slate-200/70 select-none">
      <div className="flex justify-around items-center h-16 px-1 w-full relative max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = tab.path === '/' ? path === '/' : path.startsWith(tab.path);
          const isMiles = tab.key === 'miles';

          if (isMiles) {
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => navigate(tab.path)}
                aria-current={isActive ? 'page' : undefined}
                className="relative flex flex-col items-center justify-center -mt-2 transition-transform active:scale-95 cursor-pointer px-1.5"
              >
                <span className="sr-only">{tab.testLabel}</span>
                {/* Dedicated Dark Navy Pill for Miles */}
                <div
                  className={`w-12 h-10 rounded-2xl flex items-center justify-center transition-all ${
                    isActive
                      ? 'bg-[#091322] shadow-md shadow-blue-950/20 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {/* Skyppy S Logo Glyph */}
                  <span className="font-extrabold italic font-serif text-lg tracking-tighter">S</span>
                </div>
                <span
                  className={`text-[10px] mt-0.5 leading-none transition-colors ${
                    isActive ? 'font-bold text-[#091322]' : 'font-medium text-slate-500'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => navigate(tab.path)}
              aria-current={isActive ? 'page' : undefined}
              className={`relative flex flex-col items-center justify-center w-14 h-13 rounded-2xl transition-all gap-0.5 active:scale-95 cursor-pointer ${
                isActive
                  ? 'text-slate-900 font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="sr-only">{tab.testLabel}</span>

              {/* Subtle animated active pill for non-miles tabs */}
              {isActive && (
                <motion.div
                  layoutId="bottomNavActivePill"
                  className="absolute inset-0 bg-slate-100/90 rounded-2xl -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}

              <span
                className="material-symbols-outlined text-[22px] transition-transform duration-200"
                style={{
                  fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                  transform: isActive ? 'scale(1.05)' : 'scale(1)'
                }}
              >
                {tab.icon}
              </span>
              <span className={`text-[10px] leading-tight transition-colors duration-150 ${isActive ? 'font-bold text-slate-900' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
