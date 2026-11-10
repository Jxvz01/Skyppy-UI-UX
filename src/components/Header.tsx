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
    <header className="sticky top-0 left-0 right-0 w-full z-40 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-surface-container/50">
      <div className="flex items-center justify-between px-margin h-16">
        {type === 'tab' ? (
          <div className="flex items-center cursor-pointer active:scale-95 transition-transform" onClick={() => navigate('/')}>
            <SkyppyLogo size="sm" subtitle={t.appSubtitle} />
          </div>
        ) : (
          <div className="flex items-center gap-space-sm min-w-0">
            <button
              aria-label="Go back"
              onClick={handleBack}
              className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors active:scale-95 shrink-0"
              type="button"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </button>
            <h1 className="font-headline-md text-headline-md text-on-surface font-semibold truncate">
              {title}
            </h1>
          </div>
        )}

        <div className="flex items-center gap-2 shrink-0">
          {type === 'tab' && (
            <button
              type="button"
              onClick={() => showToast('Mysuru Urban & Regional corridor active', 'info')}
              className="h-8 px-2.5 rounded-full bg-[#edf3ff] text-primary border border-blue-100 font-semibold text-xs flex items-center gap-1 hover:bg-blue-100/70 transition-colors active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px] text-primary">location_on</span>
              <span className="font-bold">Mysuru</span>
              <span className="material-symbols-outlined text-[15px] text-primary">keyboard_arrow_down</span>
            </button>
          )}

          {/* Quick Language Toggle Pill */}
          <button
            type="button"
            aria-label="Switch language English or Kannada"
            onClick={toggleLanguage}
            className="h-8 px-2 rounded-full bg-surface-container text-xs font-bold text-primary hover:bg-surface-container-high transition-colors flex items-center gap-0.5 active:scale-95"
            title="Switch Language (English / ಕನ್ನಡ)"
          >
            <span className="material-symbols-outlined text-[14px]">translate</span>
            <span className="text-[11px]">{language === 'en' ? 'ಕನ್ನಡ' : 'EN'}</span>
          </button>

          {rightAction === 'default' ? (
            <>
              {type === 'tab' ? (
                <button
                  aria-label="Notifications"
                  onClick={() => openModal('notifications')}
                  className="w-8 h-8 rounded-full bg-[#f1f5f9] flex items-center justify-center text-slate-700 hover:bg-slate-200 transition-colors relative active:scale-95"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[19px]">notifications</span>
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-orange-500 ring-2 ring-white"></span>
                </button>
              ) : (
                <button
                  aria-label="Help & Safety"
                  onClick={() => openModal('safety')}
                  className="w-9 h-9 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[19px] text-secondary">shield</span>
                </button>
              )}

              <button
                type="button"
                aria-label="Profile Account"
                onClick={() => navigate('/profile')}
                className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-xs active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined text-[18px]">person</span>
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

