import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { translations } from '../utils/i18n';
import { SkyppyLogo } from './SkyppyLogo';

interface HeaderProps {
  type?: 'tab' | 'stack';
  title?: string;
  backTo?: string;
  onBack?: () => void;
  rightAction?: 'default' | 'none' | React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  type = 'tab',
  title = '',
  backTo,
  onBack,
  rightAction = 'default'
}) => {
  const navigate = useNavigate();
  const { openModal, showToast, notifications, language, setLanguage, userProfile } = useAppStore();
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
    <header className="sticky top-0 left-0 right-0 w-full z-40 bg-surface/95 backdrop-blur-xl shadow-[0_1px_6px_rgba(0,0,0,0.03)] border-b border-surface-container/60 shrink-0">
      <div className="flex items-center justify-between px-3 sm:px-4 h-14 w-full">
        {type === 'tab' ? (
          <div
            className="flex items-center cursor-pointer active:scale-95 transition-transform shrink-0"
            onClick={() => navigate('/')}
          >
            <SkyppyLogo size="sm" subtitle={t.appSubtitle} />
          </div>
        ) : (
          <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
            <button
              aria-label="Go back"
              onClick={handleBack}
              className="w-8.5 h-8.5 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors active:scale-95 shrink-0"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
            <h1 className="font-headline-md text-[17px] text-on-surface font-semibold truncate leading-tight">
              {title}
            </h1>
          </div>
        )}

        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {type === 'tab' && (
            <button
              type="button"
              onClick={() => showToast('Mysuru Urban & Regional corridor active', 'info')}
              className="h-7.5 px-2 rounded-full bg-[#edf3ff] text-primary border border-blue-100 font-semibold text-[11px] flex items-center gap-0.5 hover:bg-blue-100/70 transition-colors active:scale-95 shrink-0"
              title="Current City Corridor"
            >
              <span className="material-symbols-outlined text-[15px] text-primary">location_on</span>
              <span className="font-bold tracking-tight">{t.cityMysuru}</span>
              <span className="material-symbols-outlined text-[14px] text-primary">keyboard_arrow_down</span>
            </button>
          )}

          {/* Quick Language Toggle Pill */}
          <button
            type="button"
            aria-label="Switch language English or Kannada"
            onClick={toggleLanguage}
            className="h-7.5 px-2 rounded-full bg-surface-container text-[11px] font-bold text-primary hover:bg-surface-container-high transition-colors flex items-center gap-1 active:scale-95 shrink-0"
            title="Switch Language (English / ಕನ್ನಡ)"
          >
            <span className="material-symbols-outlined text-[14px]">translate</span>
            <span className="tracking-tight">{language === 'en' ? 'ಕನ್ನಡ' : 'EN'}</span>
          </button>

          {rightAction === 'default' ? (
            <>
              {type === 'tab' ? (
                <button
                  aria-label="Notifications"
                  onClick={() => openModal('notifications')}
                  className="w-7.5 h-7.5 rounded-full bg-[#f1f5f9] flex items-center justify-center text-slate-700 hover:bg-slate-200 transition-colors relative active:scale-95 shrink-0"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">notifications</span>
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-orange-500 ring-2 ring-white"></span>
                  )}
                </button>
              ) : (
                <button
                  aria-label="Help & Safety"
                  onClick={() => openModal('safety')}
                  className="w-8.5 h-8.5 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors active:scale-95 shrink-0"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px] text-secondary">shield</span>
                </button>
              )}

              <button
                type="button"
                aria-label="Profile Account"
                onClick={() => navigate('/profile')}
                className="w-7.5 h-7.5 rounded-full bg-primary text-white flex items-center justify-center shadow-xs active:scale-95 transition-transform shrink-0"
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

