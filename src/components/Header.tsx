import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { translations } from '../utils/i18n';
import { SkyppyLogo } from './SkyppyLogo';

interface HeaderProps {
  type?: 'tab' | 'stack';
  title?: string;
  subtitle?: string;
  backTo?: string;
  onBack?: () => void;
  rightAction?: 'default' | 'none' | React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  type = 'tab',
  title = '',
  subtitle,
  backTo,
  onBack,
  rightAction = 'default'
}) => {
  const navigate = useNavigate();
  const { openModal, showToast, notifications, language, setLanguage } = useAppStore();
  const unreadCount = notifications.filter((n) => n.unread).length;
  const t = translations[language] || translations.en;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'kn' : 'en');
  };

  return (
    <header className="sticky top-0 left-0 right-0 w-full z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-xs border-b border-slate-100 dark:border-slate-800 shrink-0 safe-top">
      <div className="flex items-center justify-between px-3 sm:px-4 h-14 w-full max-w-lg mx-auto">
        {type === 'tab' ? (
          <div
            className="flex items-center cursor-pointer active:scale-95 transition-transform shrink-0"
            onClick={() => navigate('/')}
          >
            <SkyppyLogo size="sm" subtitle={t.appSubtitle} />
          </div>
        ) : (
          <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
            <button
              aria-label="Go back"
              onClick={handleBack}
              className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors active:scale-95 shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="font-headline-md text-base sm:text-[17px] text-brand-navy dark:text-white font-bold truncate leading-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate leading-tight">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center gap-1.5 shrink-0">
          {type === 'tab' && (
            <button
              type="button"
              onClick={() => showToast('Mysuru Corridor Active', 'info')}
              className="h-7.5 px-2 rounded-full bg-blue-50/80 dark:bg-blue-950/40 text-brand-primary border border-blue-100 dark:border-blue-900/50 font-semibold text-[11px] flex items-center gap-0.5 hover:bg-blue-100/70 transition-colors active:scale-95 shrink-0"
              title="Current City Corridor"
            >
              <span className="material-symbols-outlined text-[14px]">location_on</span>
              <span className="font-bold tracking-tight hidden xs:inline">{t.cityMysuru}</span>
              <span className="material-symbols-outlined text-[13px] hidden xs:inline">keyboard_arrow_down</span>
            </button>
          )}

          {/* Quick Language Toggle Pill */}
          <button
            type="button"
            aria-label="Switch language English or Kannada"
            onClick={toggleLanguage}
            className="h-7.5 px-2 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-brand-primary hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1 active:scale-95 shrink-0"
            title="Switch Language (English / ಕನ್ನಡ)"
          >
            <span className="material-symbols-outlined text-[13px]">translate</span>
            <span className="tracking-tight">{language === 'en' ? 'ಕನ್ನಡ' : 'EN'}</span>
          </button>

          {rightAction === 'default' ? (
            <>
              {type === 'tab' ? (
                <button
                  aria-label="Notifications"
                  onClick={() => openModal('notifications')}
                  className="w-7.5 h-7.5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors relative active:scale-95 shrink-0"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">notifications</span>
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-orange-500 ring-2 ring-white dark:ring-slate-900"></span>
                  )}
                </button>
              ) : (
                <button
                  aria-label="Help & Safety"
                  onClick={() => openModal('safety')}
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors active:scale-95 shrink-0"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[17px] text-emerald-600 dark:text-emerald-400">shield</span>
                </button>
              )}

              <button
                type="button"
                aria-label="Profile Account"
                onClick={() => navigate('/profile')}
                className="w-7.5 h-7.5 rounded-full bg-brand-primary text-white flex items-center justify-center shadow-xs active:scale-95 transition-transform shrink-0"
              >
                <span className="material-symbols-outlined text-[17px]">person</span>
              </button>
            </>
          ) : (
            rightAction
          )}
        </div>
      </div>
    </header>
  );
};
